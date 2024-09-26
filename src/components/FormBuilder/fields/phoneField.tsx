
import {  Controller } from 'react-hook-form';
import { PhoneNumber } from '@/components/ui/phone-input';

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
     prefix:any;
    }
  
  const FormikPhoneField = (props ) => {
    const {
      // sx,
      name,
      label,
      values,
      control,
      prefix,
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
  
      <Controller
      name="phone"
      control={control}
      render={({ field: { value, onChange } }) => (
        <PhoneNumber
        label={label}
          country="us"
          value={value}
          // size={isMedium ? 'lg' : 'xl'}
          className="[&>label>span]:font-medium w-full"
          onChange={onChange}
          error={errors?.message}
        />
      )}
    />

  //   <Controller
  //   control={control}
  //   name={name}
  //   render={({ field: { value, onChange } }) => (
  //     <Select
  //       dropdownClassName="!z-[10]"
  //       //           inPortal={false}
  //       placeholder={placeholder}
  //       className="col-span-full"
  //       // size="lg"
  //       label={label}
  //       options={options}
  //       onChange={onChange}
  //       value={value}
  //       getOptionValue={(option) => option.value}
  //       displayValue={(selected) =>
  //           options?.find((r) => r.value === selected)?.label ??
  //         ''
  //       }

  //       // {...register(name)}
  //     error={errors?.message}
  //     />
  //   )}
  // />

    );
  };
  
  export default FormikPhoneField;
  