"use client";

import { useMemo, useCallback, useState, useEffect } from "react";
import Card from "@/components/cards/card";
import { Title, Text, Avatar, Button, Badge } from "rizzui";
import moment from "moment";
import { PiSealCheckFill } from "react-icons/pi";
import {
    GoMail,
    GoDeviceMobile,
    GoLocation,
    GoCalendar,
    GoCreditCard,
    GoClock,
} from "react-icons/go";
import { getJobSeeker, revalidateTag } from "@/actions/serverFunctions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import FormModal from "../form-modal";
import toast from "react-hot-toast";
import { editJobSeeker, editJobSeekerProfile } from "@/actions/jobSeeker";
import { jobSeekerFormSchema } from "@/utils/validators/create-jobSeeker.schema";

// Main Profile Information Component
export default function ProfileInformation() {
    // Fetch job seeker data using React Query
    const queryClient = useQueryClient();
    const [modalState, setModalState] = useState(false);
    const [AvatarModalState, setAvatarModalState] = useState(false);
    const [data, setData] = useState<any>({});

    const { data: initialData = {} } = useQuery({
        queryKey: ["jobSeeker"],
        queryFn: getJobSeeker,
    });

    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    // Destructure necessary fields from the data
    const {
        birth_date,
        city,
        country,
        email,
        first_name,
        last_name,
        phone,
        state,
        timezone,
        id_number,
        profile_picture_url,
        id,
        status
    } = data?.data || {};

    console.log("data?.data", data?.data)
    // Dynamically populate the userInfo array
    const userInfo = [
        { heading: "Email", title: email || "N/A", icon: <GoMail /> },
        { heading: "Phone", title: phone || "N/A", icon: <GoDeviceMobile /> },
        {
            heading: "Location",
            title: `${city || "City"}, ${state || "State"}, ${country?.name || "Country"}`,
            icon: <GoLocation />,
        },
        {
            heading: "Date of Birth",
            title: birth_date ? new Date(birth_date).toLocaleDateString() : "N/A",
            icon: <GoCalendar />,
        },
        { heading: "CNIC", title: id_number || "N/A", icon: <GoCreditCard /> },
        { heading: "Timezone", title: timezone || "N/A", icon: <GoClock /> }, // Add actual timezone value if available
    ];

    const formFieldsJson = useMemo(
        () => [
            {
                key: "first_name",
                label: "First Name",
                placeholder: "First Name",
                type: "text",
                style: "grid-span-1",
            },
            {
                key: "last_name",
                label: "Last Name",
                placeholder: "Last Name",
                type: "text",
                style: "grid-span-1",
            },
            {
                key: "email",
                label: "Email",
                placeholder: "Email",
                type: "text",
                style: "grid-span-1",
            },
            {
                key: "phone",
                label: "Phone",
                placeholder: "Phone",
                type: "phone",
                style: "grid-span-1",
            },
            {
                key: "gender",
                label: "Gender",
                type: "select",
                style: "grid-span-1",
                options: [
                    { label: 'Male', value: 'male' },
                    { label: 'Female', value: 'female' },
                    { label: 'Other', value: 'other' },
                ]
            },
            {
                key: "birth_date",
                label: "Date of birth",
                required: true,
                visible: true,
                type: "date",
                style: "grid-span-1",
            },
            {
                key: "status",
                label: "Status",
                type: "select",
                style: "col-span-2",
                options: [
                    { label: 'Available', value: 'available' },
                    { label: 'Not Available', value: 'not_available' },
                ]
            },
        ],
        []
    );


    const avatarFormJson = useMemo(() => [
        {
            key: "profile_picture_url",
            label: "Portfolio Image",
            required: true,
            visible: true,
            type: "avatar",
            style: "col-span-2",
        },

    ], []);

    //**  EDIT JOB SEEKER INFO **//
    const { mutate: handleEdit, isPending: isEditing } = useMutation({
        mutationFn: async (data) => {
            const formData = {
                ...data,
                birth_date: moment(data?.from_date).format('YYYY-MM-DD'),
            };
            return await editJobSeeker(formData, id);

        },
        onSuccess: (response: any, variables: any) => {
            setData((prev: { data: any; }) => ({
                ...prev,
                data: {
                    ...prev.data,
                    ...variables,
                },
            }));

            toggleModal();
            queryClient.invalidateQueries(["jobSeeker"]);
            toast.success(response?.message);
        },
        onError: (error: any) => {
            if (error) {
                toast.error(`${error?.data?.detail}`);
            }
        },
    });

    //**  EDIT JOB SEEKER PROFILE **//
    const { mutate: handleEditProfile, isPending: isEditingProfile } = useMutation({
        mutationFn: async (data) => {
            const formData = {
                profile_picture_url: data?.profile_picture_url?.url
            };
            return await editJobSeekerProfile(formData);

        },
        onSuccess: (response: any, variables: any) => {
            setData((prev: { data: any; }) => ({
                ...prev,
                data: {
                    ...prev.data,
                    ...variables,
                },
            }));

            setAvatarModalState(false)
            queryClient.invalidateQueries(["jobSeeker"]);
            revalidateTag("jobSeeker");
            toast.success(response?.message);
        },
        onError: (error: any) => {
            if (error) {
                toast.error(`${error?.data?.detail}`);
            }
        },
    });

    // Open Add Modal
    const toggleModal = useCallback(async () => {
        setModalState((prev) => {
            return !prev;
        });
    }, []);


    return (
        <div className="rounded-lg border border-muted col-span-full @5xl:col-span-4 @7xl:col-span-3">
            <Card className="py-14 flex flex-col justify-center items-center">
                <Avatar
                    src={profile_picture_url ? profile_picture_url : "https://isomorphic-furyroad.s3.amazonaws.com/public/avatars/avatar-11.webp"}
                    name={`${first_name || "John"} ${last_name || "Doe"}`}
                    customSize="115"
                    onClick={() => setAvatarModalState(true)}
                />
                <Badge
                    variant="flat"
                    color="secondary"
                    size="lg"
                    className="capitalize relative -top-4"
                >
                    {status || "available"}
                </Badge>
                <Title
                    as="h2"
                    className="capitalize m-2 inline-flex items-center gap-3 text-xl font-bold text-gray-900"
                >
                    {first_name} {last_name}
                    <PiSealCheckFill className="h-5 w-5 text-primary md:h-6 md:w-6" />
                </Title>
                <Text className="mb-4 text-sm text-gray-500 uppercase">
                    Product Manager
                </Text>
                <Button rounded="pill" className="px-8 mt-4 sm:mt-0" onClick={toggleModal}>
                    Edit Detail
                </Button>
            </Card>
            <Card>
                {userInfo?.map((val, index) => (
                    <InformationDetails key={index} data={val} />
                ))}
            </Card>

            <FormModal
                isOpen={modalState}
                onClose={toggleModal}
                modalTitle={"Edit Basic Info"}
                modalSubTitle={"Update your basic information here"}
                fields={formFieldsJson}
                FormSchema={jobSeekerFormSchema}
                onSubmitCallback={handleEdit}
                initialValues={data?.data}
                isMutate={isEditing}
            />
            <FormModal
                isOpen={AvatarModalState}
                onClose={() => setAvatarModalState(false)}
                modalTitle={"Edit Basic Info"}
                modalSubTitle={"Update your basic information here"}
                fields={avatarFormJson}
                // FormSchema={jobSeekerFormSchema}
                onSubmitCallback={handleEditProfile}
                // initialValues={data?.data}
                isMutate={isEditingProfile}
            />
        </div>
    );
}

// InformationDetails component to display each info row
const InformationDetails = ({ data }: any) => {
    const { heading, title, icon } = data;
    return (
        <div className="my-6">
            <div className="my-1 flex w-full items-center truncate">
                <span className="text-primary font-bold me-2 inline-flex h-5 w-5 items-center justify-center rounded-md [&>svg]:h-[20px] [&>svg]:w-[20px]">
                    {icon}
                </span>
                <Text className="text-sm text-gray-500 uppercase truncate">
                    {heading}
                </Text>
            </div>
            <Text className="text-base text-black truncate">{title}</Text>
        </div>
    );
};
