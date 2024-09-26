

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Card from "@/components/cards/card";
import { GoCodespaces } from "react-icons/go";
import ProfileSection from "@/app/shared/profile/profile-section";
import { jobProfileFormSchema } from "@/utils/validators/create-job-profile.schema";
import { getJobProfile, revalidateTag } from "@/actions/serverFunctions";
import { editJobProfile } from "@/actions/jobProfile";
import { addSkill } from "@/actions/skill";
import { getSkillCategories } from "@/actions/lookups";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { cn } from "@/utils/class-names";
import { PiXBold } from 'react-icons/pi';

import {
    Modal,
    Button,
    Text,
    Loader,
    ActionIcon,
    Accordion,
    Title,
    Badge
} from "rizzui";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

const Skill = ({ data = [], jobProfileId }: any) => {
    const queryClient = useQueryClient();
    const [modalState, setModalState] = useState(false);
    const { data: getSkillCategory = [], isLoading, refetch } = useQuery({ queryKey: ['getSkillCategories'], queryFn: getSkillCategories, enabled: false });


    const toggleModal = useCallback(async () => {
        setModalState((prev) => {
            if (!prev && getSkillCategory?.length === 0) {
                refetch();
            }
            return !prev;
        });
    }, [getSkillCategory?.length, refetch]);




    return (
        <>
            <Card >
                <ProfileSection
                    heading="Skills"
                    headindIcon={<GoCodespaces />}
                    showAdd={false}
                    handleEdit={toggleModal}
                >
                    <ProfileSection.Skill
                        skills={data}
                    />
                </ProfileSection>
            </Card>

            <SkillModal
                isOpen={modalState}
                onClose={toggleModal}
                jobProfileId={jobProfileId}
                modalTitle="Add Professional Skills"
                modalSubTitle="Add your professional skills relevant to your job profile"
                initialValues={getSkillCategory}
                formValues={data}
                isLoadingSkill={isLoading}
            />
        </>
    );
};


export default React.memo(Skill);







const SkillModal = ({ isOpen, onClose,
    buttonText = "Confirm",
    initialValues: data = [],
    isLoadingSkill = false,
    modalTitle = "",
    modalSubTitle = "",
    onSubmitCallback = () => { },
    jobProfileId = "",
    formValues = []
}) => {
    const queryClient = useQueryClient();

    const [selectedSkills, setSelectedSkills] = useState<{ categoryId: string, skillIds: string[] }[]>([]);

    const [toastShownForCategory, setToastShownForCategory] = useState<{ [categoryId: string]: boolean }>({});

    // Populate `selectedSkills` based on `formValues` (data from db) when modal opens

    useEffect(() => {
        if (formValues.length > 0) {
            // Use a reducer to accumulate skills by categoryId
            const preSelected = formValues.reduce((acc, curr) => {
                const categoryId = curr?.skill?.skill_category;
                const skillId = curr?.skill?.id;

                // Check if the category already exists in the accumulator
                const existingCategory = acc.find(item => item.categoryId === categoryId);

                if (existingCategory) {
                    // If the category exists, push the skillId if it's not already in the array
                    if (!existingCategory.skillIds.includes(skillId)) {
                        existingCategory.skillIds.push(skillId);
                    }
                } else {
                    // If the category doesn't exist, add a new entry with the categoryId and skillId
                    acc.push({
                        categoryId,
                        skillIds: [skillId],
                    });
                }

                return acc;
            }, []);

            console.log("Pre-selected skills", preSelected);
            setSelectedSkills(preSelected);
        }
    }, [formValues]);




    //**  ADD / EDIT SKILL  **//
    const { mutate: handleAdd, isPending: isEditing } = useMutation({
        mutationFn: async (data: any) => {
            const formData = {
                categories: data,
                job_profile_id: jobProfileId,
            };

            return await addSkill(formData);
        },
        onSuccess: (response: any, variables: any) => {
            queryClient.invalidateQueries(["jobProfile"]);
            revalidateTag("jobProfile");
            toast.success(response?.message);
            onClose();
        },
        onError: (error: any) => {
            if (error) {
                toast.error(`${error?.data?.detail}`);
            }
        },
    });

    const handlePillToggle = useCallback((categoryId: string, skillId: string) => {
        setSelectedSkills((prevSelectedSkills) => {
            // Find the category by categoryId
            const category = prevSelectedSkills.find(skill => skill.categoryId === categoryId);
            // Ensure skillIds is always an array, defaulting to an empty array if not found
            const skillsInCategory = category ? category.skillIds : [];
            const skillExists = skillsInCategory.includes(skillId);

            // Check if the user has already selected 5 skills in the category
            if (skillsInCategory.length >= 5 && !skillExists) {
                // Only show the toast if it hasn't been shown yet for this category
                if (!toastShownForCategory[categoryId]) {
                    // Show toast once and then update the state so it's not shown again
                    toast.error("You can only select up to 5 skills in this category.");

                    // Set that the toast has been shown for this category
                    setToastShownForCategory((prev) => ({
                        ...prev,
                        [categoryId]: true,
                    }));
                }
                return prevSelectedSkills; // Prevent adding more than 5 skills in the category
            }

            if (skillExists) {
                // If the skill is already selected, remove it from the array
                const updatedSkillsInCategory = skillsInCategory.filter(id => id !== skillId);

                // Always keep the category with an empty array even if no skills are left
                const updatedSkills = prevSelectedSkills.map(skill =>
                    skill.categoryId === categoryId ? { ...skill, skillIds: updatedSkillsInCategory } : skill
                );

                // Reset the toast if the selected skills drop below 5
                if (updatedSkillsInCategory.length < 5) {
                    setToastShownForCategory((prev) => ({
                        ...prev,
                        [categoryId]: false,
                    }));
                }

                return updatedSkills;
            } else {
                // If the skill is not selected, add it to the array
                const updatedSkillsInCategory = [...skillsInCategory, skillId];
                return category
                    ? prevSelectedSkills.map(skill =>
                        skill.categoryId === categoryId ? { ...skill, skillIds: updatedSkillsInCategory } : skill
                    )
                    : [...prevSelectedSkills, { categoryId, skillIds: [skillId] }];
            }
        });
    }, [toastShownForCategory, setSelectedSkills, setToastShownForCategory]);




    // Handle form submission
    const handleSubmit = () => {
        handleAdd(selectedSkills);
    };





    return (
        <>
            {/* <Button onClick={() => setModalState(true)}>Open Modal</Button> */}
            <Modal isOpen={isOpen} onClose={onClose} customSize="720px">
                <div className="m-auto px-7 pt-6 pb-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <Title as="h3" className="text-lg">
                                {modalTitle}

                            </Title>
                            <Text className="text-gray-400">{modalSubTitle}</Text>
                        </div>
                        <ActionIcon
                            size="sm"
                            variant="text"
                            onClick={onClose}
                            className="p-0 text-gray-500 hover:!text-gray-900"
                        >
                            <PiXBold className="h-[18px] w-[18px]" />
                        </ActionIcon>
                    </div>
                    <div className="">
                        {isLoadingSkill ? (
                            <div className="flex justify-center items-center h-64">
                                <Loader color="primary" />
                            </div>
                        ) : (
                            <div className="h-96 overflow-y-auto custom-scrollbar">
                                {data.map((item) => (
                                    <Accordion
                                        key={item?.id}
                                        className="mx-1 rounded-lg p-4 mb-4 border border-gray-300"
                                    >
                                        <Accordion.Header>
                                            {({ open }) => (
                                                <div className="flex w-full cursor-pointer items-center justify-between py-5 text-xl font-semibold">
                                                    <div>
                                                        {item?.name}
                                                        <Badge variant="flat" color="info" className="mx-4">Max 5 Allowed</Badge>
                                                    </div>
                                                    <ActionIcon rounded="full" variant="flat">
                                                        <ChevronDownIcon
                                                            className={cn(
                                                                "h-5 w-5 rotate-360 transform transition-transform duration-300",
                                                                open && "rotate-180"
                                                            )}
                                                        />
                                                    </ActionIcon>
                                                </div>
                                            )}
                                        </Accordion.Header>
                                        <Accordion.Body className="mb-7">
                                            <div className=""> {/* Add scroll to the skills list */}
                                                {item?.skills?.map((skill: { id: string; name: string }) => {
                                                    // Find the category in selectedSkills by its categoryId (item?.id)
                                                    const category = selectedSkills?.find((selected) => selected?.categoryId === item?.id);

                                                    // Check if the skill is selected within this category
                                                    const isSelected = category?.skillIds?.includes(skill.id) ?? false;

                                                    return (
                                                        <Badge
                                                            key={skill?.id}
                                                            id={skill?.id}
                                                            variant="flat"
                                                            size="xl"
                                                            className={cn(
                                                                "mr-2 my-2 border border-gray-200 text-gray-700",
                                                                isSelected ? "bg-primary text-white" : ""
                                                            )}
                                                            onClick={() => handlePillToggle(item?.id, skill.id)}
                                                        >
                                                            {skill?.name}
                                                        </Badge>
                                                    );
                                                })}


                                            </div>
                                        </Accordion.Body>
                                    </Accordion>
                                ))}
                            </div>
                        )}

                    </div>

                    <div className={cn('text-right  gap-4 pt-5')}>
                        <Button
                            variant="outline"
                            className=" dark:hover:border-gray-400"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            className="ml-4 hover:gray-700 "
                            isLoading={isEditing}
                            disabled={isEditing}
                        >
                            {buttonText}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

