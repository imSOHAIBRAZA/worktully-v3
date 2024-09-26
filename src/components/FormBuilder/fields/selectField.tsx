import { Select } from "rizzui";
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
     options:any;
    }
  
  const FormikSelectField = (props ) => {
    const {
      // sx,
      name,
      label,
      values,
      control,
      // touched,
      handleChange,
      placeholder,
      options,
      // InputProps,
      type,
      register,
      errors
      // InputLabelProps,
    } = props;
  
    return (
  
      // <Select
      //   placeholder={placeholder}
      //   label={label}
      //   size="lg"
      //   className="col-span-full"
      //   name={name}
      //   options={options}
      //   // value={values}
      //   // onChange={handleChange}
      //   // onChange={(e) => handleChange(e.value)} // Ensure to pass the value on change
      //   // {...register(name)}
      //   error={errors?.message}
      //   // type={type}
      // />

    <Controller
    control={control}
    name={name}
    render={({ field: { value, onChange } }) => (
      <Select
        dropdownClassName="!z-[10]"
        //           inPortal={false}
        placeholder={placeholder}
        className="col-span-full"
        // size="lg"
        label={label}
        options={options}
        onChange={onChange}
        value={value}
        getOptionValue={(option) => option.value}
        displayValue={(selected) =>
            options?.find((r) => r.value === selected)?.label ??
          ''
        }

        // {...register(name)}
      error={errors?.message}
      />
    )}
  />

    );
  };
  
  export default FormikSelectField;
  