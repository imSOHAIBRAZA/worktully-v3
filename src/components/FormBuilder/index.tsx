import React,{ useState,useMemo } from "react";
// import { Formik } from "formik";
import TextField from "./fields/textField";
// import { createYupSchema } from "./yupSchemaCreator";
// import * as yup from "yup";

import { SubmitHandler } from 'react-hook-form';
import { PiArrowRightBold } from 'react-icons/pi';
import { Checkbox, Password } from 'rizzui';
import { PiXBold } from 'react-icons/pi';
import { ActionIcon, Button, Input, Text, Textarea, Title,FormGroup } from 'rizzui';
import { Form } from "../ui/form";
import cn from '@/utils/class-names';
import _map from "lodash/map";
import { useModal } from '@/app/shared/modal-views/use-modal';
import FormikTextField from "./fields/textField";
import FormikSelectField from "./fields/selectField";
import FormikDateField from "./fields/dateField";
import FormikTextAreaField from "./fields/textAreaField";
import FormikCheckboxField from "./fields/checkbox"



const FormBuilder = ({ key,fields, FormSchema,modalTitle="Add Form",modalSubTitle="", buttonText = "Confirm", onSubmitCallback,isMutate=false,initialValues={} }: any) => {
    console.log("isMutate+++++>",{fields})
    const { closeModal } = useModal();
    const [reset, setReset] = useState({});


    const renderField = useMemo(() => {
        return ({ field, register, control, errors }: any) => {
    
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
                            type={""}     
                            {...field}
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
                            {...field}
                        />
                    );
    
                case "checkbox":
                    return (
                        <FormikCheckboxField
                            key={field?.key}
                            label={field?.label}
                            name={field?.key}
                            // required={field?.required}
                            register={register}
                            errors={errors[field?.key]} 
                            // placeholder={field?.placeholder}
                            // type={""}     
                            // {...field}
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
                            {...field}
                        />
                    );
            }
        };
    }, []); // Add dependencies if necessary

    return (

        <div key={key} className="m-auto p-4 md:px-7 md:py-6">
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
                    onClick={closeModal}
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
                
                {({ register,control, formState: { errors } }) => (
                   
                    <div className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                        {
                            _map(fields, (field: any) => (
                                <div  className={cn(
                                    // 'col-span-2',
                                    field.style 
                                  )}>
                            {renderField({ field, register,control, errors })}
                            </div>
                            ))
                        }
                        </div>
                        <div className={cn('text-right  gap-4 pt-5')}>
                            <Button
                                variant="outline"
                                className=" dark:hover:border-gray-400"
                                onClick={closeModal}
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
    );
}


export default React.memo(FormBuilder);

