
import React from "react";
import { Text } from "rizzui"
import { PiXBold } from 'react-icons/pi';
import {
    Modal,
    ActionIcon,
    Title,
    Badge
} from "rizzui";
import Image from 'next/image';

const ResultModal = ({
    isOpen,
    onClose,
    status,
    result,
}: any) => {


    const percentage = (result?.obtainedMarks / result?.totalMarks) * 100;

    return (
        <Modal isOpen={isOpen} onClose={onClose} customSize="640px">
            <div className="m-auto p-4">


                <div className="text-right ">
                    <ActionIcon
                        size="sm"
                        variant="text"
                        onClick={onClose}
                        className="p-0 text-gray-500 hover:!text-gray-900"
                    >
                        <PiXBold className="h-[18px] w-[18px]" />
                    </ActionIcon>
                </div>

                <div className="flex flex-col justify-center items-center">
                    <Image
                        width={120}
                        height={120}
                        src={status === "Pass" ? "/success.svg" : "/fail.svg"}
                        alt="icon"
                        className="dark:invert py-4"
                        priority
                    />
                    <Title as="h3" >
                        {status === 'Pass' ? "Congratulations!" : "Better Luck Next Time"}
                    </Title>
                    <Text className="text-lg my-2 text-center">
                        You have successfully completed assessment
                    </Text>

                    <div className="rounded-md bg-gray-100 text-center p-8">
                        <Title as="h4" >
                            You achieved
                        </Title>
                        <div className="flex justify-between items-center">
                        <Title as="h2" className="text-red-600">
                            {`${result?.obtainedMarks}/${result?.totalMarks}`}
                        </Title>
                        <Badge
                                variant="flat"
                                color="danger"
                                rounded="md"
                                 className="mx-6 text-sm"
                            >
                                Failed
                            </Badge>
                        </div>
                    </div>

                    {/* <div className="flex flex-col sm:flex-row gap-4 w-full my-4">
                        <div className="rounded-md bg-gray-100 w-full p-8">
                            <Title as="h4"  >
                                To Pass
                            </Title>
                            <Text className="text-lg ">
                                80% or Higher
                            </Text>
                        </div>
                        <div className="rounded-md bg-gray-100 w-full p-8">
                            <Title as="h4" >
                                You achieved
                            </Title>
                            <Text className="text-lg">
                                100% Pass
                            </Text>
                        </div>
                    </div> */}

                    {/* {percentage} */}

                </div>
            </div>
        </Modal>
    )
}

export default React.memo(ResultModal);