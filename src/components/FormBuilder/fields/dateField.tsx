import {  Controller } from 'react-hook-form';
import { DatePicker } from "@/components/ui/datepicker"

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
  
  const FormikDateField = (props ) => {
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
      // register,
      errors
      // InputLabelProps,
    } = props;
  
    return (
  
  //   <Controller
  //   control={control}
  //   name={name}
  //   render={({ field: { value, onChange } }) => (
  //     <Select
  //       dropdownClassName="!z-10"
  //       inPortal={false}
  //       placeholder={placeholder}
  //       className="w-full"
  //       label={label}
  //       options={options}
  //       onChange={onChange}
  //       value={value}
  //       getOptionValue={(option) => option.value}
  //       displayValue={(selected) =>
  //           options?.find((r) => r.value === selected)?.label ??
  //         ''
  //       }
  //       error={errors?.role?.message as string}
  //     />
  //   )}
  // />


  <Controller
  name={name}
  control={control}
  render={({ field: { value, onChange } }) => (
    <>
    <DatePicker
      popperPlacement="top-start"
      selected={value}
      onChange={onChange}
      selectsStart
      startDate={value}
      label={label}
      // endDate={endDate}
      minDate={new Date()}
      // showTimeSelect
      showYearSelect
      dateFormat="MMMM d, yyyy"
      className="date-picker-event-calendar"
      placeholderText={placeholder}
      // {...register(name)}
      error={errors?.message}
    />
    </>
  )}
/>

    );
  };
  
  export default FormikDateField;
  