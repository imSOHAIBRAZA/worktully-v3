import { Checkbox } from "rizzui";
import {  Controller } from 'react-hook-form';
import UploadZone from "@/components/ui/file-upload/upload-zone";

type FormType= { 
  name: string; 
  label: string; 
  required:boolean;
  handleChange: any;
   placeholder: any; 
   type: string; 
   register: any; 
   errors: any; 
   prefix:string;
   getValues:any;
   setValue:any
  }

const FormikFileField = (props:FormType ) => {
  const {
    // sx,
    name,
    label,
    // values,
    // errors,
    // touched,
    handleChange,
    placeholder,
    // InputProps,
    // control,
    type,
    register,
    errors,
    prefix,
    getValues,
    setValue
    // InputLabelProps,
  } = props;

  
  return (

    <UploadZone
                      name={name}
                      getValues={getValues}
                      setValue={setValue}
                      error={errors?.message}
                      // error={errors?.portfolios?.message as string}
                    />

  //   <Checkbox
  //   placeholder={placeholder}
  //   label={label}
  //   // size="lg"
  //   className="w-full"
  //   prefix={prefix}
  //   name={name}
  //   {...register(name)}
  //   error={errors?.message}
  //   // type={type}
  // />
  );
};

export default FormikFileField;
