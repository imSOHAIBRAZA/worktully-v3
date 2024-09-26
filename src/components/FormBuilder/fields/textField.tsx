import { Input } from "rizzui";


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
   prefixClassName:string;
  }

const FormikTextField = (props:FormType ) => {
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
    type,
    register,
    errors,
prefix,
prefixClassName
    // InputLabelProps,
  } = props;

  return (

    <Input
      placeholder={placeholder}
      label={label}
      // size="lg"
      className="w-full"
      prefix={prefix}
      name={name}
      {...register(name)}
      error={errors?.message}
      type={type}
      prefixClassName={prefixClassName}
    />
  );
};

export default FormikTextField;
