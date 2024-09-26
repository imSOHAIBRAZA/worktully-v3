'use client'
import React, { useState } from "react";
import { Stepper, Button } from "rizzui";
import { Progressbar, Text } from "rizzui"
import { useMedia } from '@/hooks/use-media';
import { useRouter } from 'next/navigation';
import { useAtom } from "jotai";
import { AssessmentAtom } from "@/store/AssessmentAtom";

import TermConfirmModal from "@/app/shared/assessment/modal/term-condition"

export default function ProfileProgress({ completionRate = 0, jobProfileId,jobTitleId  }:any) {
    const router = useRouter();
    const isMedium = useMedia('(max-width: 1200px)', false);
    const [currentStep, setCurrentStep] = React.useState(0);
    const [modalState, setModalState] = useState(false);
    const [, setAtomAssessment] = useAtom(AssessmentAtom);

    const title = ["Complete Profile", "Assessment", "Review"];


    const handleRedirect = () => {
        // Add validation to ensure both values exist
        if (jobProfileId && jobTitleId) {
          setAtomAssessment({
            jobProfileId,
            jobTitleId,
          });
          
          // Redirect only if validation passes
          router.push(`/assessment?jobProfileId=${jobProfileId}&jobTitleId=${jobTitleId}`);

        } else {
          // Handle missing values case (optional)
          console.log('Job Profile ID or Job Title ID is missing!');
        }
      };

    const handleConfirm = () => {
        // Redirect to the assessment page with the job_profile_id as a query parameter
        // setCurrentStep(currentStep + 1)
        setCurrentStep(1)
        setModalState(true)
        // router.push(`/assessment/${completionRate}`);

    };



    return (
        <>
            <Stepper
                direction={isMedium ? "vertical" : "horizontal"}
                currentIndex={currentStep}>
                {
                    title.map(value => <Stepper.Step color="success" title={value} />)
                }
            </Stepper>
            <div className="my-4 flex flex-row justify-between items-end">
                <div>
                    <Text as="small" className="text-gray-400">
                        Your progress
                    </Text>
                    <Text className="text-primary font-bold">
                        Profile Completion Score
                    </Text>
                </div>

                <Text className="text-primary font-bold">
                    {completionRate}% complete
                </Text>
            </div>
            <Progressbar
                value={completionRate}
                className="gap-0"
            />

            <div className="my-4 @container">
                <div className="grid grid-cols-12">
                    <div className="col-span-12 md:col-span-9">
                        <Text >
                            You profile is almost complete, Please complete your job assessment to to get your your profile verified based on it employers can hire you.
                        </Text>
                    </div>
                    <div className=" col-span-12 md:col-span-3 md:text-right">
                        <Button
                            className="mt-4 sm:mt-0"
                            disabled={completionRate <= 90 || currentStep === 3}
                            onClick={handleConfirm}
                        >
                            Start Assessment
                        </Button>
                    </div>
                </div>
            </div>

            <TermConfirmModal
                isOpen={modalState}
                onClose={() => setModalState(false)}
                handleSubmit={handleRedirect}
                modalTitle="Terms & Conditions"
                modalSubTitle="Add your professional skills relevant to your job profile"
            />
        </>
    );
}

