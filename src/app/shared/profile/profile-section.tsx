"use client";
import React from "react";
import Image from 'next/image';
import { ActionIcon, Title, Text, Badge } from "rizzui";
import { FiCopy } from 'react-icons/fi';
import DeletePopover from "../../shared/delete-popover";
import { GoPlus, GoPencil } from "react-icons/go";



interface ProfileSectionProps {
  // initialValues: Experience[];
  heading: string;
  headindIcon: JSX.Element;
  children: JSX.Element;
  showEdit?: boolean;
  showAdd?: boolean;
  openModal?: any;
  formFields: any[];
  FormSchema: any;
  onClick?: () => void;
  handleEdit?: () => void;

}

const ProfileSection = React.memo(({
  children,
  heading = "",
  headindIcon,
  showEdit = true,
  showAdd = true,
  onClick = () => { },
  handleEdit = () => { }
}: ProfileSectionProps) => {
  return (
    <>
      <section>
        <div className=" flex justify-between">
          <div className="my-1 flex  w-full items-center truncate">
            <span className="text-gray-600 font-bold me-2 inline-flex h-8 w-8 items-center justify-center rounded-md [&>svg]:h-[30px] [&>svg]:w-[30px]">
              {headindIcon}
            </span>

            <Title className="text-gray-600" as="h4">
              {heading}
            </Title>
          </div>
          {showAdd && <ActionIcon
            rounded="full"
            variant="outline"
            className=" border-gray-300 bg-white"
            onClick={onClick}
          >
            <GoPlus className="w-5 h-5 " />
          </ActionIcon>}
          {showEdit && (
            <ActionIcon
              rounded="full"
              variant="outline"
              className="ml-3 border-gray-300 bg-white"
              onClick={handleEdit}
            >
              <GoPencil className="w-5 h-5" />
            </ActionIcon>
          )}
        </div>

        {children}
      </section>

    </>
  );
});




const levels: any = {
  // native: "info",
  // fluent: "success",
  // proficient: "warning",
  // intermediate: "secondary",
  // basic: "danger",
  beginner: "success",
  intermediate: "warning",
  professional: "secondary",
};

const getBadgeColor = (level: any) => {
  const result = levels[level];
  return result;
};

ProfileSection.Language = ({ heading = "", level = "", handleDelete = () => { }, handleEdit = () => { } }) => {
  return (
    <div className="my-4">
      <div>
        <div className="flex justify-between items-center">
          <Title as="h6">
            {heading}
            {level && <Badge
              variant="flat"
              color={getBadgeColor(level?.toLowerCase())}
              rounded="md"
              className="mx-6"
            >
              {level}
            </Badge>}
          </Title>
          <div>
            <ActionIcon
              onClick={handleEdit}
              rounded="full"
              variant="outline"
              className="ml-3 border-gray-300 bg-white"
            >
              <GoPencil className="w-5 h-5" />
            </ActionIcon>

            <DeletePopover
              title={`Delete Member`}
              description={`Are you sure you want to delete ?`}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2"></div>
    </div>
  );
};

ProfileSection.Skill = ({ skills = [] }: any) => {
  return (
    <div className="my-4 ">
      <div className="">
        {
          skills?.map((val: string) => (
            <Badge
            key={val?.skill?.id}
              variant="flat"
              size="xl"
              className="mr-2 my-2 border border-gray-300 text-gray-700 "
            >
              {val?.skill?.name}
            </Badge>
          ))
        }
      </div>
    </div>
  );
};

ProfileSection.Body = ({ heading = "", subHeading = "", date = "", description = "", handleDelete = () => { }, handleEdit = () => { } }) => {
  return (

    <div className="my-4 ">
      <div>
        <div className='flex justify-between items-center'>
          <Title as="h6">
            {heading}
          </Title>
          <div>
            <ActionIcon
              onClick={handleEdit}
              rounded="full"
              variant="outline"
              className="ml-3 border-gray-300 bg-white">
              < GoPencil className="w-5 h-5" />
            </ActionIcon>

            <DeletePopover
              title={`Delete Member`}
              description={`Are you sure you want to delete ?`}
              onDelete={handleDelete}
            />
          </div>
        </div>

        <Text className='text-sm'>
          {subHeading}
        </Text>
        <Text className='text-sm text-gray-400'>
          {date}
        </Text>
        <Text className='pt-2 text-sm text-gray-500'>
          {description}
        </Text>
      </div>
      <div className="flex items-center space-x-2">
      </div>
    </div>

  )
}


ProfileSection.Portfolio = ({ heading = "", subHeading = "", description = "", image = "", handleDelete = () => { }, handleEdit = () => { } }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(subHeading);
  };


  return (
    <div className="my-4 ">
      <div className="flex flex-col  sm:flex-row gap-4">
        <div className="relative aspect-square w-32 ">
          <Image
            src={image ?? "https://isomorphic-furyroad.s3.amazonaws.com/public/avatars/avatar-11.webp"}
            alt={"portfolio image"}
            fill
            priority
            // placeholder="blur"
            sizes="(max-width: 768px) 100vw"
            // blurDataURL={`/_next/image?url=${flight.image}&w=10&q=1`}
            className="h-full w-full object-contain rounded-lg "
          />
        </div>
        <div className="flex w-full flex-col">
          <div className='flex  justify-between  '>

            <Title as="h6">
              {heading}
            </Title>

            <div>
              <ActionIcon
                onClick={handleEdit}
                rounded="full"
                variant="outline"
                className="ml-3 border-gray-300 bg-white">
                < GoPencil className="w-5 h-5" />
              </ActionIcon>

              <DeletePopover
                title={`Delete Member`}
                description={`Are you sure you want to delete ?`}
                onDelete={handleDelete}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Title as="h6">
              {subHeading}
            </Title>
            <ActionIcon variant="text" onClick={handleCopy}>
              <FiCopy className="w-4 h-4" />
            </ActionIcon>
          </div>
          <Text className='pt-2 text-sm text-gray-500'>
            {description}
          </Text>
        </div>

      </div>
    </div>

  )
}



export default ProfileSection;


