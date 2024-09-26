"use client"

import { addPortfolio, deletePortfolio, editPortfolio } from "@/actions/portfolio";


import React, { useMemo, useCallback, useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Card from "@/components/cards/card";
import ProfileSection from "@/app/shared/profile/profile-section";
import { revalidateTag } from "@/actions/serverFunctions";
import FormModal from "../form-modal";
import toast from "react-hot-toast";
import { GoBriefcase } from "react-icons/go";
import { portfolioFormSchema } from "@/utils/validators/create-portfolio.schema";

const Portfolio = ({ data: initialData = [], jobProfileId = "" }: any) => {
    const queryClient = useQueryClient();
    const [data, setData] = useState(initialData);
    const [modalState, setModalState] = useState(false);
    const [jobProfile, setJobProfile] = useState(null);
    const [isEdit, setEdit] = useState<number | null>(null); // Track edit mode by record id
    const [initialValues, setInitialValues] = useState<any>(null); // Pre-populate form values for editing

    useEffect(() => {
        setData(initialData);
        setJobProfile(jobProfileId)
    }, [initialData, jobProfileId]);



    const formFieldsJson = useMemo(() => [
        {
            key: "project_title",
            label: "Project Title",
            placeholder: "Project Title",
            type: "text",
            style: "col-span-2",
        },
        {
            key: "description",
            label: "Description",
            required: true,
            visible: true,
            type: "textarea",
            style: "col-span-2",
        },
        {
            key: "url",
            label: "Website",
            placeholder: "Website",
            type: "text",
            style: "col-span-2",
            prefixs: "https://",
            prefixClass: "relative pe-2.5 before:w-[1px] before:h-[38px] before:absolute before:bg-gray-300 before:-top-[9px] before:right-0"
        },
        {
            key: "image_url",
            label: "Portfolio Image",
            required: true,
            visible: true,
            type: "file",
            style: "col-span-2",
        },

    ], []);



    //**  ADD LANGUAGE **//
    const { mutate: handleAdd, isPending: isAdding } = useMutation({
        mutationFn: async (data: any) => {
            const formData = {
                ...data,
                job_profile: jobProfile,
                image_url: data?.image_url[0]?.url
                // language: {
                //     "name": data?.language,
                //     "status": "string"
                // }
            };

            return await addPortfolio(formData);
        },
        onSuccess: (response: any, variables: any) => {
            toast.success(response?.message);
            const optimisticData = {
                ...variables,
                id: Date.now(), // Temporary ID before server gives the real ID
            };
            setData((prev) => [optimisticData, ...prev]); // Add new data to the top

            toggleModal();
            // Optionally refetch relevant queries or update UI directly
            revalidateTag("jobProfile");
            queryClient.invalidateQueries(['jobProfile']);


        },
        onError: (error) => {
            if (error) {
                toast.error(`${error?.data?.detail}`);
            }
        },
    });

    //**  EDIT LANGUAGE **//
    const { mutate: handleEdit, isPending: isEditing } = useMutation({
        mutationFn: async (data: any) => {
            const formData = {
                ...data,
                job_profile: jobProfile,
            };

            return await editPortfolio(formData);

        },
        onSuccess: (response: any, variables: any) => {
            setData((prev) =>
                prev.map((item) =>
                    item.id === variables.id ? { ...variables, ...response.data } : item
                )
            );
            toggleModal();
            queryClient.invalidateQueries(["jobProfile"]);
            toast.success(response?.message);
        },
        onError: (error: any) => {
            if (error) {
                toast.error(`${error?.data?.detail}`);
            }
        },
    });



    //** DELETE PORTFOLIO **//
    const { mutate: deleteItem } = useMutation({
        mutationFn: async (id: any) => {
            return await deletePortfolio(id);
        },
        onSuccess: (response: any, variables: any) => {

            setData((prev: any[]) => prev.filter((item) => item.id !== variables)); // Remove deleted item from state
            queryClient.invalidateQueries(['jobProfile']);
            toast.success(response?.message);

            // router.refresh();
            revalidateTag("jobProfile");

        },
        onError: (error: any) => {
            if (error) {
                toast.error(`${error?.data?.detail}`);
            }
        },
    })

    // Open Add Modal
    const toggleModal = useCallback(async () => {
        setModalState((prev) => {
            setEdit(null); // Reset edit mode
            setInitialValues(null); // Reset form initial values
            return !prev;
        });
    }, []);

    // Open Edit Modal
    const handleEditModal = (id: number) => {
        const { image_url: image, ...restOfRecord } = data?.find((item: any) => item.id === id) || {};
        const image_url = image ? [
            {
                name: '',
                size: 0,
                url: image,
            },
        ]
            : [];
        const currentRecord = { ...restOfRecord, image_url };

        setEdit(id);
        setInitialValues(currentRecord);
        setModalState(true);
    };

    // Submit Record
    const handleSubmit = (formData: any) => {
        if (isEdit !== null) {
            // Editing mode
            handleEdit({ ...formData, id: isEdit });
        } else {
            // Adding mode
            handleAdd(formData);
        }
    };

    return (
        <>
            <Card>
                <ProfileSection
                    heading="Portfolio"
                    headindIcon={<GoBriefcase />}
                    showEdit={false}
                    onClick={toggleModal} // Open the modal directly
                >

                    {data?.sort((a: { id: number }, b: { id: number }) => b?.id - a?.id)
                        .map((val: any, index: number) => (
                            <ProfileSection.Portfolio
                                key={val?.id}
                                heading={val?.project_title}
                                subHeading={val?.url}
                                image={val?.image_url}
                                description={val?.description}
                                handleDelete={() => deleteItem(val?.id)}
                                handleEdit={() => handleEditModal(val?.id, index)}
                            />
                        ))}
                </ProfileSection>
            </Card>

            <FormModal
                isOpen={modalState}
                onClose={toggleModal}
                modalTitle={isEdit !== null ? "Edit Portfolio" : "Add Portfolio"}
                modalSubTitle={
                    isEdit !== null
                        ? "Update your professional accomplishments and achievements"
                        : "Add your professional accomplishments and achievements"
                }
                fields={formFieldsJson}
                FormSchema={portfolioFormSchema}
                onSubmitCallback={handleSubmit}
                initialValues={initialValues}
                isMutate={isAdding || isEditing}
            />
        </>
    );
};

export default React.memo(Portfolio);