
import React, { useState, useMemo, useCallback } from "react";
import { GoMortarBoard } from "react-icons/go";
import ProfileSection from "@/app/shared/profile/profile-section";
import FormModal from "@/app/shared/form-modal";
import { jobProfileFormSchema } from "@/utils/validators/create-job-profile.schema";
import { revalidateTag } from "@/actions/serverFunctions";
import { editJobProfile } from "@/actions/jobProfile";
import { getJobTitles } from "@/actions/lookups";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const EditJobProfile = ({ data = {} }: any) => {
    console.log("EDITE PROFIEL", data)
    const queryClient = useQueryClient();
    const [modalState, setModalState] = useState(false);
    const { data: getJobTitle = [], isLoading, refetch } = useQuery({ queryKey: ['getJobTitles'], queryFn: getJobTitles, enabled: false });

    const formFieldsJson = useMemo(() => [
        {
            key: "job_title",
            label: "Profile Name",
            placeholder: "Write here",
            type: "select",
            style: "col-span-2",
            options: isLoading
                ? [{ label: "Loading...", value: "" }]
                : getJobTitle?.length > 0
                    ? getJobTitle.map(lang => ({
                        label: lang.name,
                        value: lang.id,
                    }))
                    : [{ label: "No Job Title Available", value: "" }]
        },
        {
            key: "hourly_rate",
            label: "Hourly Rate",
            prefixs: "$",
            type: "number",
            style: "col-span-2",
        }
    ], [getJobTitle, isLoading]);

    const { mutate: handleAdd, isPending: isAdding } = useMutation({
        mutationFn: async (formdata: any) => {
            return await editJobProfile(formdata, data?.id);
        },
        onSuccess: (response: any) => {
            toast.success(response?.message);


            toggleModal();
            // Refetch the profiles to ensure the new profile is included
            revalidateTag("jobProfile");
            queryClient.invalidateQueries(['jobProfile']);
        },
        onError: (error) => {
            toast.error(`${error?.data?.detail}`);
        },
    });

    const toggleModal = useCallback(async () => {
        setModalState((prev) => {
            if (!prev && getJobTitle?.length === 0) {
                refetch();
            }
            return !prev;
        });
    }, [getJobTitle?.length, refetch]);

    return (
        <>
            <ProfileSection
                heading={data?.job_title?.name || "Software Engineer"}
                headindIcon={<GoMortarBoard />}
                showAdd={false}
                handleEdit={toggleModal}
            />

            <FormModal
                isOpen={modalState}
                onClose={toggleModal}
                modalTitle="Edit Job Profile"
                modalSubTitle="Based on this profile you can apply for jobs"
                fields={formFieldsJson}
                FormSchema={jobProfileFormSchema}
                onSubmitCallback={handleAdd}
                initialValues={{ ...data, job_title: data?.job_title?.id }}
                isMutate={isAdding}
            />
        </>
    );
};


export default React.memo(EditJobProfile);