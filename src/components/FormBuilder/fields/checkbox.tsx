import { Checkbox } from "rizzui";
import {  Controller } from 'react-hook-form';

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
  }

const FormikCheckboxField = (props:FormType ) => {
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
    prefix
    // InputLabelProps,
  } = props;

  
  return (


    <Checkbox
    placeholder={placeholder}
    label={label}
    // size="lg"
    className="w-full"
    prefix={prefix}
    name={name}
    {...register(name)}
    error={errors?.message}
    // type={type}
  />
  );
};

export default FormikCheckboxField;
