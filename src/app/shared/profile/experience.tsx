"use client"

import React, { useMemo, useCallback, useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import Card from "@/components/cards/card";
import ProfileSection from "@/app/shared/profile/profile-section";
import { revalidateTag } from "@/actions/serverFunctions";
import FormModal from "../form-modal";
import toast from "react-hot-toast";
import { GoBriefcase } from "react-icons/go";
import { experienceFormSchema } from "@/utils/validators/create-experience.schema";
import { addExperience, deleteExperience, editExperience } from "@/actions/experience";
import { getCountries } from "@/actions/lookups";

const Experience = ({ data: initialData = [], jobProfileId = "" }: any) => {
  const queryClient = useQueryClient();
  const [data, setData] = useState(initialData);
  const [jobProfile, setJobProfile] = useState(null);
  const [modalState, setModalState] = useState(false);
  const [isEdit, setEdit] = useState<number | null>(null); // Track edit mode by record id
  const [initialValues, setInitialValues] = useState<any>(null); // Pre-populate form values for editing

  //     // Fetch countries using React Query
  const { data: countries = [], isLoading, refetch } = useQuery({ queryKey: ['countries'], queryFn: getCountries, enabled: false });


  useEffect(() => {
    setData(initialData);
    setJobProfile(jobProfileId)
  }, [initialData, jobProfileId]);



  const formFieldsJson = useMemo(() => [
    {
      key: "company_name",
      label: "Company",
      placeholder: "Company",
      type: "text",
      style: "grid-span-1",
    },
    {
      key: "start_date",
      label: "Start Date",
      type: "date",
      style: "grid-span-1",
    },
    {
      key: "end_date",
      label: "End Date",
      type: "date",
      style: "grid-span-1",
    },
    {
      key: "currently_working",
      label: "I still work here",
      type: "checkbox",
      style: "grid-span-1 self-end pb-1",
    },

    {
      key: "country",
      label: "Country",
      type: "select",
      style: "grid-span-1",
      options: isLoading
        ? [{ label: "Loading...", value: "" }]  // Show loading while countries are being fetched
        : countries && countries?.data?.length > 0
          ? countries?.data?.map(country => ({
            label: country.name,
            value: country.id,
          }))
          : [{ label: "No countries available", value: "" }]  // Fallback if no countries
    },
    {
      key: "city",
      label: "City",
      type: "select",
      style: "grid-span-1",
      options: [
        { label: 'Lahore', value: 1 },
        { label: 'Karachi', value: 2 },
        { label: 'Islamabad', value: 3 },
      ]
    },
    {
      key: "description",
      label: "Description",
      type: "textarea",
      style: "col-span-2",
    },
  ], [countries, isLoading]);



  //**  ADD EDUCATION **//
  const { mutate: handleAdd, isPending: isAdding } = useMutation({
    mutationFn: async (data: any) => {
      const formData = {
        ...data,
        job_profile: jobProfile,
        start_date: moment(data?.start_date).format('YYYY-MM-DD'),
        end_date: moment(data?.end_date).format('YYYY-MM-DD'),
      };

      return await addExperience(formData);
    },
    onSuccess: (response: any, variables: any) => {
      toast.success(response?.message);
      const optimisticData = {
        ...variables,
        id: Date.now(), // Temporary ID before server gives the real ID
        start_date: moment(variables?.start_date).format('YYYY-MM-DD'),
        end_date: moment(variables?.end_date).format('YYYY-MM-DD'),
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

  //**  EDIT EDUCATION **//
  const { mutate: handleEdit, isPending: isEditing } = useMutation({
    mutationFn: async (data: any) => {
      const formData = {
        ...data,
        job_profile: jobProfile,
        start_date: moment(data?.start_date).format('YYYY-MM-DD'),
        end_date: moment(data?.end_date).format('YYYY-MM-DD'),
      };

      return await editExperience(formData);

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



  //** DELETE EDUCATION **//
  const { mutate: deleteItem } = useMutation({
    mutationFn: async (id: any) => {
      return await deleteExperience(id);
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
      if (!prev && countries?.length === 0) {
        refetch(); // Fetch degree types when modal opens
      }
      setEdit(null); // Reset edit mode
      setInitialValues(null); // Reset form initial values
      return !prev;
    });
  }, [countries?.length, refetch]);

  // Open Edit Modal
  const handleEditModal = (id: number) => {
    const { start_date, end_date, ...restOfRecord } = data?.find((item: any) => item.id === id) || {};
    const fromDate = start_date ? moment(start_date).toDate() : null;
    const toDate = end_date ? moment(end_date).toDate() : null;

    const currentRecord = { ...restOfRecord, fromDate, toDate };

    setEdit(id);
    setInitialValues(currentRecord);
    setModalState(true);
    if (countries?.length === 0) {
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
          heading="Experiance"
          headindIcon={<GoBriefcase />}
          showEdit={false}
          onClick={toggleModal} // Open the modal directly
        >

          {data
            ?.sort((a: { id: number }, b: { id: number }) => b?.id - a?.id)
            .map((exp: any) => (
              <ProfileSection.Body
                key={exp?.id}
                heading={exp?.company_name}
                subHeading="Web Developer"
                date={`${exp?.start_date} - ${exp?.end_date}`}
                description={exp?.description}
                handleDelete={() => deleteItem(exp?.id)}
                handleEdit={() => handleEditModal(exp?.id)}
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
        FormSchema={experienceFormSchema}
        onSubmitCallback={handleSubmit}
        initialValues={initialValues}
        isMutate={isAdding || isEditing}
      />
    </>
  );
};

export default React.memo(Experience);