
"use client"

import { useState, useMemo, useCallback } from "react";
import { ActionIcon } from 'rizzui';
import { GoPlus } from "react-icons/go";
import ProfileDetails from "@/app/shared/profile/profile-details";
import FormModal from "@/app/shared/form-modal";
import { jobProfileFormSchema } from "@/utils/validators/create-job-profile.schema";
import { getJobProfile, revalidateTag } from "@/actions/serverFunctions";
import { addJobProfile } from "@/actions/jobProfile";
import { getJobTitles } from "@/actions/lookups";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const ProfilesView = () => {
    // Fetch job profiles using useQuery (data will come from hydration)
    const { data: profiles = [] } = useQuery({ queryKey: ['jobProfile'], queryFn: getJobProfile });
    const [activeTab, setActiveTab] = useState<string>(profiles?.data[0]?.id || '');

    return (
        <div className="col-span-full @5xl:col-span-8 @7xl:col-span-9">
            <div className="w-full">
                <div className="relative right-0">
                    {/* Tabs */}
                    <ul className="border p-2 relative flex gap-2 flex-wrap px-1.5 py-1.5 list-none rounded-md" role="tablist">
                        {profiles?.data?.map((profile: any) => (
                            <button
                                key={profile?.id}
                                onClick={() => setActiveTab(profile?.id)}
                                className={`flex-1 py-2 px-4 rounded-md transition-colors duration-300 ease-in-out focus:outline-none ${activeTab === profile.id ? 'bg-primary text-white' : 'bg-inherit text-slate-600 hover:bg-gray-300'}`}
                            >
                                {profile?.job_title?.name}
                            </button>
                        ))}
                        <AddProfileComponent profiles={profiles} setActiveTab={setActiveTab} />
                    </ul>

                    {/* Tab Panels */}
                    <div className="py-4">
                        {profiles?.data?.map((profile: any) => (
                            <div
                                key={profile.id}
                                role="tabpanel"
                                className={`transition-opacity ${activeTab === profile.id ? 'opacity-100' : 'opacity-0 hidden'}`}
                            >
                                <ProfileDetails profile={profile} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilesView;

//********** ADD PROFILE COMPONENT *************//
const AddProfileComponent = ({ profiles = [], setActiveTab }: any) => {
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
            prefix: "$",
            type: "number",
            style: "col-span-2",
        }
    ], [getJobTitle, isLoading]);

    const { mutate: handleAdd, isPending: isAdding } = useMutation({
        mutationFn: async (data: any) => {
            return await addJobProfile(data);
        },
        onSuccess: (response: any) => {
            toast.success(response?.message);
            const newProfileId = response?.data?.id; // Get the real ID from the response
            // const newProfileId = 21;
            // Set the new profile as the active tab
            setActiveTab(newProfileId);

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
            <ActionIcon
                disabled={profiles?.data?.length === 3}
                variant="flat"
                className="w-10 h-10"
                onClick={toggleModal}
            >
                <GoPlus className="w-10 h-10 text-gray-400" />
            </ActionIcon>

            <FormModal
                isOpen={modalState}
                onClose={toggleModal}
                modalTitle="Add Job Profile"
                modalSubTitle="Based on this profile you can apply for jobs"
                fields={formFieldsJson}
                FormSchema={jobProfileFormSchema}
                onSubmitCallback={handleAdd}
                isMutate={isAdding}
            />
        </>
    );
};
