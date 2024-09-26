import { Textarea } from "rizzui";


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

const FormikTextAreaField = (props:FormType ) => {
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
    prefix
    // InputLabelProps,
  } = props;

  
  return (

    <Textarea
      placeholder={placeholder}
      label={label}
      // size="lg"
      className="w-full"
      prefix={prefix}
      name={name}
      {...register(name)}
      error={errors?.message}
      type={type}
    />
  );
};

export default FormikTextAreaField;
