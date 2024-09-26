import { Checkbox } from "rizzui";
import {  Controller } from 'react-hook-form';
import AvatarUpload from '@/components/ui/file-upload/avatar-upload';

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

const FormikAvatarField = (props:FormType ) => {
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

    <AvatarUpload
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

export default FormikAvatarField;
