
import React, { useState } from "react";
import {  Button } from "rizzui";
import {  Text } from "rizzui"
import { PiXBold } from 'react-icons/pi';
import { cn } from "@/utils/class-names";
import {
    Modal,
    ActionIcon,
    Title,
    Checkbox
} from "rizzui";


const TermConfirmModal = ({
    isOpen,
    onClose,
    buttonText = "Confirm",
    modalTitle = "",
    modalSubTitle = "",
    handleSubmit = () => { }
}) => {

    const [interviewAccepted, setInterviewAccepted] = useState(false);

    const handleInterviewAccept = (event) => {
        setInterviewAccepted(event.target.checked);
    };


    return (
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
                <div className="h-96 overflow-y-auto custom-scrollbar">
                    <p className="text-base mb-4">
                        As a participant in the interview assessment process, I understand and agree to abide by the following honor code:
                    </p>
                    <ol className="list-decimal list-inside mb-6 space-y-2">
                        <li>You acknowledge that you will be allotted a total of <b>30 minutes to answer 30 questions</b> during the Technical Assessment.</li>
                        <li>You understand that you are allowed <b>only one attempt per question.</b></li>
                        <li>You agree that you must <b>answer each question sequentially,</b> starting from the first question and proceeding to the next question only after responding to the previous one.</li>
                        <li>You affirm that all responses provided during the assessment will be your own work and will reflect your true knowledge, skills, and abilities. You will <b>not seek or accept unauthorized assistance</b> from external sources or individuals.</li>
                        <li>You acknowledge that you are <b>prohibited</b> from using any external resources, materials, or aids during the assessment, including but not limited to textbooks, notes, internet resources, or electronic devices.</li>
                        <li>You will approach the interview assessment with honesty, integrity, and respect for the assessment process. You understand that any attempt to cheat, manipulate, or undermine the integrity of the assessment will result in <b>disqualification</b> and may have further consequences.</li>
                        <li>You will maintain the <b>confidentiality</b> of the interview assessment questions and refrain from sharing or discussing them with others during and after the assessment process.</li>
                        <li>You agree to <b>comply with all instructions,</b> including but not limited to time limits, question format, and submission procedures.</li>
                        <li>You understand that it is your responsibility to ensure that you have access to a <b>reliable internet connection</b> and <b>suitable technology</b> for participating in the interview assessment. Any technical issues or disruptions will not be considered grounds for additional time or special accommodations.</li>
                        <li>You acknowledge that if you do not perform to the best of your abilities during the initial assessment, you can try again and <b>re-submit your response.</b> You agree to <b>submit your best response</b> and comply with the terms and conditions stated herein.</li>
                    </ol>
                </div>
                <div className={cn('text-right  gap-4 pt-5')}>
                    <Checkbox
                        checked={interviewAccepted}
                        onChange={handleInterviewAccept}
                        color="primary"
                        label="I confirm that I have read and accept the terms and conditions and privacy policy."
                        className="mb-4"
                    />

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
                        disabled={!interviewAccepted}
                    >
                        {buttonText}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default React.memo(TermConfirmModal);