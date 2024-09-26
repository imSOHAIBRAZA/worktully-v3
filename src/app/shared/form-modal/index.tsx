'use client';

import React, { useState, useMemo } from "react";
import { PiXBold } from 'react-icons/pi';
import cn from '@/utils/class-names';
import _map from "lodash/map";
import { ActionIcon, Button,  Text,  Title ,Modal} from 'rizzui';
import { Form } from "@/components/ui/form"
import FormikTextField from "@/components/FormBuilder/fields/textField";
import FormikSelectField from "@/components/FormBuilder/fields/selectField";
import FormikDateField from "@/components/FormBuilder/fields/dateField";
import FormikTextAreaField from "@/components/FormBuilder/fields/textAreaField";
import FormikCheckboxField from "@/components/FormBuilder/fields/checkbox";
import FormikFileField from "@/components/FormBuilder/fields/fileField";
import FormikPhoneField from "@/components/FormBuilder/fields/phoneField";
import FormikAvatarField from "@/components/FormBuilder/fields/avatarField";

 function FormModal({
  isOpen,
  onClose,
  customSize = "720px", // default size
  fields,
  FormSchema,
  modalTitle = "Add Form",
  modalSubTitle = "",
  buttonText = "Confirm",
  onSubmitCallback,
  isMutate = false,
  initialValues = {}
}) {


  const [reset] = useState({});


  const renderField = useMemo(() => {
    return ({ field, register, setValue,getValues,control, errors }: any) => {
      console.log("field+>",field)
      switch (field?.type) {
        case "text":
          return (
            <FormikTextField
              key={field?.key}
              label={field?.label}
              name={field?.key}
              required={field?.required}
              register={register}
              errors={errors[field?.key]}
              placeholder={field?.placeholder}
              prefix={field?.prefixs}
              prefixClassName = {field?.prefixClass}
              // type={""}
              // {...field}
            />
          );

        case "textarea":
          return (
            <FormikTextAreaField
              key={field?.key}
              label={field?.label}
              name={field?.key}
              required={field?.required}
              register={register}
              errors={errors[field?.key]}
              placeholder={field?.placeholder}
              type={""}
            />
          );

        case "checkbox":
          return (
            <FormikCheckboxField
              key={field?.key}
              label={field?.label}
              name={field?.key}
              required={field?.required}
              register={register}
              errors={errors[field?.key]}
              placeholder={field?.placeholder}
              type={""}
            />
          );
          case "file":
            return (
              <FormikFileField
                key={field?.key}
                label={field?.label}
                name={field?.key}
                required={field?.required}
                register={register}
                errors={errors[field?.key]}
                placeholder={field?.placeholder}
                type={""}
                getValues={getValues}
                setValue={setValue}
              />
            );

            case "avatar":
              return (
                <FormikAvatarField
                  key={field?.key}
                  label={field?.label}
                  name={field?.key}
                  required={field?.required}
                  register={register}
                  errors={errors[field?.key]}
                  placeholder={field?.placeholder}
                  type={""}
                  getValues={getValues}
                  setValue={setValue}
                />
              );
        case "select":
          return (
            <FormikSelectField
              key={field?.key}
              options={field?.options}
              placeholder={field?.placeholder}
              label={field?.label}
              name={field?.key}
              control={control}
              type={""}
              register={register}
              errors={errors[field?.key]}
            />
          );

          case "phone":
            return (
              <FormikPhoneField
                key={field?.key}
                options={field?.options}
                placeholder={field?.placeholder}
                label={field?.label}
                name={field?.key}
                control={control}
                type={""}
                register={register}
                errors={errors[field?.key]}
              />
            );

          
        case "date":
          return (
            <FormikDateField
              key={field?.key}
              options={field?.options}
              placeholder={field?.label}
              label={field?.label}
              name={field?.key}
              control={control}
              type={""}
              register={register}
              errors={errors[field?.key]}
            />
          );

        default:
          return (
            <FormikTextField
              key={field?.key}
              label={field?.label}
              name={field?.key}
              required={field?.required}
              type={field?.type}
              register={register}
              errors={errors[field?.key]}
              placeholder={field?.placeholder}
              prefix={field?.prefixs}
            />
          );
      }
    };
  }, []); // Add dependencies if necessary

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      customSize={customSize}
      overlayClassName="dark:bg-opacity-40 dark:backdrop-blur-lg"
      containerClassName="dark:bg-gray-100"
      className="z-[9999]"
    >
      <div className="m-auto p-4 md:px-7 md:py-6">
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

        <Form
          validationSchema={FormSchema}
          resetValues={reset}
          onSubmit={onSubmitCallback}
          // onSubmit={onSubmitHandle}
          useFormProps={{
            defaultValues: initialValues,
          }}

          // useFormProps={{
          //   defaultValues: {
          //     title: event?.title ?? '',
          //     description: event?.description ?? '',
          //     location: event?.location ?? '',
          //     startDate: startDate ?? event?.start,
          //     endDate: endDate ?? event?.end,
          //   },
          // }}
          // className="grid grid-cols-1 gap-5 @container md:grid-cols-2 [&_label]:font-medium"

          className="grid grid-cols-1 gap-5 @container  [&_label]:font-medium"
        >

          {({ register, control, setValue,getValues, formState: { errors } }) => (

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                {
                  _map(fields, (field: any) => (
                    <div className={cn(
                      // 'col-span-2',
                      field.style
                    )} key={field?.key}>
                      {renderField({ field, register,setValue,getValues, control, errors })}
                    </div>
                  ))
                }
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
                  type='submit'
                  className="ml-4 hover:gray-700 "
                  isLoading={isMutate}

                  disabled={isMutate}
                >
                  {buttonText}
                </Button>
              </div>
            </div>
          )}
        </Form>
      </div>
    </Modal>
  );
}


export default React.memo(FormModal);