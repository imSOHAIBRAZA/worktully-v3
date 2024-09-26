
"use client"

import { HiOutlineLanguage } from "react-icons/hi2";
import { addLanguage, deleteLanguage, editLanguage } from "@/actions/language";
import React, { useMemo, useCallback, useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import Card from "@/components/cards/card";
import ProfileSection from "@/app/shared/profile/profile-section";
import { revalidateTag } from "@/actions/serverFunctions";
import FormModal from "../form-modal";
import toast from "react-hot-toast";
import { languageFormSchema } from "@/utils/validators/create-language.schema";
import { getLanguages } from "@/actions/lookups";

const Language = ({ data: initialData = [] }: any) => {
  const queryClient = useQueryClient();
  const [data, setData] = useState(initialData);
  const [modalState, setModalState] = useState(false);
  const [isEdit, setEdit] = useState<number | null>(null); // Track edit mode by record id
  const [initialValues, setInitialValues] = useState<any>(null); // Pre-populate form values for editing

  //     // Fetch countries using React Query
  const { data: language = [], isLoading, refetch } = useQuery({ queryKey: ['language'], queryFn: getLanguages, enabled: false });


  useEffect(() => {
    setData(initialData);
  }, [initialData]);



  const formFieldsJson = useMemo(() => [
    {
      key: "language",
      label: "Language",
      placeholder: "Language",
      type: "select",
      style: "col-span-2",
      options: isLoading
        ? [{ label: "Loading...", value: "" }]  // Show loading while countries are being fetched
        : language && language?.length > 0
          ? language?.map(lang => ({
            label: lang.name,
            value: lang.id,
          }))
          : [{ label: "No language available", value: "" }]  // Fallback if no countries
    },
    {
      key: "proficiency",
      label: "Proficiency",
      type: "select",
      style: "col-span-2",
      options: [
        { label: 'Beginner', value: 'Beginner' },
        { label: 'Intermediate', value: 'Intermediate' },
        { label: 'Professional', value: 'Professional' },
      ]
    },

  ], [language, isLoading]);



  //**  ADD LANGUAGE **//
  const { mutate: handleAdd, isPending: isAdding } = useMutation({
    mutationFn: async (data: any) => {
      return await addLanguage(data);
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
      return await editLanguage(data);

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



  //** DELETE LANGUAGE **//
  const { mutate: deleteItem } = useMutation({
    mutationFn: async (id: any) => {
      return await deleteLanguage(id);
    },
    onSuccess: (response: any, variables: any) => {

      setData((prev: any[]) => prev.filter((item) => item.id !== variables)); // Remove deleted item from state
      queryClient.invalidateQueries(['jobProfile']);
      toast.success(response?.message);
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
      if (!prev && language?.length === 0) {
        refetch(); // Fetch degree types when modal opens
      }
      setEdit(null); // Reset edit mode
      setInitialValues(null); // Reset form initial values
      return !prev;
    });
  }, [language?.length, refetch]);

  // Open Edit Modal
  const handleEditModal = (id: number) => {
    const { start_date, end_date, ...restOfRecord } = data?.find((item: any) => item.id === id) || {};
    const fromDate = start_date ? moment(start_date).toDate() : null;
    const toDate = end_date ? moment(end_date).toDate() : null;

    const currentRecord = { ...restOfRecord, fromDate, toDate };

    setEdit(id);
    setInitialValues(currentRecord);
    setModalState(true);
    if (language?.length === 0) {
      refetch(); // Fetch degree types when modal opens
    }
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
          heading="Language"
          headindIcon={<HiOutlineLanguage />}
          showEdit={false}
          onClick={toggleModal} // Open the modal directly
        >

          {data
            ?.sort((a: { id: number }, b: { id: number }) => b?.id - a?.id)
            .map((val: any) => (
              <ProfileSection.Language
                key={val?.id}
                heading={val?.language_details?.name}
                level={val?.proficiency}
                handleDelete={() => deleteItem(val?.id)}
                handleEdit={() => handleEditModal(val?.id)}
              />
            ))}
        </ProfileSection>
      </Card>

      <FormModal
        isOpen={modalState}
        onClose={toggleModal}
        modalTitle={isEdit !== null ? "Edit Experience" : "Add Experience"}
        modalSubTitle={
          isEdit !== null
            ? "Update your work experience here"
            : "Add your work experience here"
        }
        fields={formFieldsJson}
        FormSchema={languageFormSchema}
        onSubmitCallback={handleSubmit}
        initialValues={initialValues}
        isMutate={isAdding || isEditing}
      />
    </>
  );
};

export default React.memo(Language);