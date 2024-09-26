
import React, { useMemo, useCallback, useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GoMortarBoard } from "react-icons/go";
import moment from "moment";
import Card from "@/components/cards/card";
import ProfileSection from "@/app/shared/profile/profile-section";
import { educationFormSchema } from "@/utils/validators/create-education.schema";
import { addEducation, editEducation, deleteEducation } from "@/actions/education";
import { revalidateTag } from "@/actions/serverFunctions";
import { getDegreeTypes } from "@/actions/lookups";
import FormModal from "../form-modal";
import toast from "react-hot-toast";

const Education = ({ data: initialData = [] }: any) => {
  const queryClient = useQueryClient();
  const [data, setData] = useState(initialData);
  const [modalState, setModalState] = useState(false);
  const [isEdit, setEdit] = useState<number | null>(null); // Track edit mode by record id
  const [initialValues, setInitialValues] = useState<any>(null); // Pre-populate form values for editing

  const { data: degreeTypes = [], isLoading, refetch } = useQuery({
    queryKey: ["degreeTypes"],
    queryFn: getDegreeTypes,
    enabled: false,
  });

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const formFieldsJson = useMemo(
    () => [
      {
        key: "institute_name",
        label: "Institute",
        placeholder: "Institute",
        type: "text",
        style: "col-span-2",
      },
      {
        key: "degree_type",
        label: "Degree Type",
        required: true,
        visible: true,
        type: "select",
        style: "grid-span-1",
        options: isLoading
          ? [{ label: "Loading...", value: "" }]
          : degreeTypes?.map((degree: { name: string; id: string }) => ({
            label: degree.name,
            value: degree.id,
          })),
      },
      {
        key: "discipline",
        label: "Discipline",
        required: true,
        visible: true,
        type: "text",
        style: "grid-span-1",
      },
      {
        key: "from_date",
        label: "From",
        required: true,
        visible: true,
        type: "date",
        style: "grid-span-1",
      },
      {
        key: "to_date",
        label: "To",
        required: true,
        visible: true,
        type: "date",
        style: "grid-span-1",
      },
    ],
    [degreeTypes, isLoading]
  );



  //**  ADD EDUCATION **//
  const { mutate: handleAdd, isPending: isAdding } = useMutation({
    mutationFn: async (data: any) => {
      const formData = {
        ...data,
        from_date: moment(data?.from_date).format('YYYY-MM-DD'),
        to_date: moment(data?.to_date).format('YYYY-MM-DD'),
      };

      return await addEducation(formData);
    },
    onSuccess: (response: any, variables: any) => {
      toast.success(response?.message);
      const optimisticData = {
        ...variables,
        id: Date.now(), // Temporary ID before server gives the real ID
        from_date: moment(variables?.from_date).format('YYYY-MM-DD'),
        to_date: moment(variables?.to_date).format('YYYY-MM-DD'),
      };
      setData((prev) => [optimisticData, ...prev]); // Add new data to the top

      toggleModal();
      // Optionally refetch relevant queries or update UI directly
      revalidateTag("jobProfile");
      queryClient.invalidateQueries(['jobProfile']);


    },
    onError: (error, variables, context) => {
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
        from_date: moment(data?.from_date).format('YYYY-MM-DD'),
        to_date: moment(data?.to_date).format('YYYY-MM-DD'),
      };

      return await editEducation(formData);
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
      return await deleteEducation(id);
    },
    onSuccess: (response: any, variables: any) => {

      setData((prev: any[]) => prev.filter((item) => item.id !== variables)); // Remove deleted item from state
      queryClient.invalidateQueries(['jobProfile']);
      toast.success(response?.message);

      // router.refresh();
      revalidateTag("jobProfile");

    },
    onError: (error: any) => {
      console.log("DELETE ERROR++++>", error)
      if (error) {
        toast.error(`${error?.data?.detail}`);
      }
    },
  })

  // Open Add Modal
  const toggleModal = useCallback(async () => {
    setModalState((prev) => {
      if (!prev && degreeTypes?.length === 0) {
        refetch(); // Fetch degree types when modal opens
      }
      setEdit(null); // Reset edit mode
      setInitialValues(null); // Reset form initial values
      return !prev;
    });
  }, [degreeTypes?.length, refetch]);

  // Open Edit Modal
  const handleEditModal = (id: number) => {
    const { from_date, to_date, ...restOfRecord } = data?.find((item: any) => item.id === id) || {};
    const fromDate = from_date ? moment(from_date).toDate() : null;
    const toDate = to_date ? moment(to_date).toDate() : null;

    const currentRecord = { ...restOfRecord, fromDate, toDate };
    setEdit(id);
    setInitialValues(currentRecord);
    setModalState(true);
    if (degreeTypes?.length === 0) {
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
          heading="Education"
          headindIcon={<GoMortarBoard />}
          showEdit={false}
          onClick={toggleModal}
        >
          {data
            ?.sort((a: { id: number }, b: { id: number }) => b?.id - a?.id)
            .map((edu: any, index: number) => (
              <ProfileSection.Body
                key={edu.id}
                heading={edu?.discipline}
                subHeading={edu?.institute_name}
                date={`${edu?.from_date} - ${edu?.to_date}`}
                handleDelete={() => deleteItem(edu.id)}
                handleEdit={() => handleEditModal(edu.id, index)}
              />
            ))}
        </ProfileSection>
      </Card>

      <FormModal
        isOpen={modalState}
        onClose={toggleModal}
        modalTitle={isEdit !== null ? "Edit Education" : "Add Education"}
        modalSubTitle={
          isEdit !== null
            ? "Update your academic qualifications here"
            : "Add your academic qualifications here"
        }
        fields={formFieldsJson}
        FormSchema={educationFormSchema}
        onSubmitCallback={handleSubmit}
        initialValues={initialValues}
        isMutate={isAdding || isEditing}
      />
    </>
  );
};

export default React.memo(Education);

