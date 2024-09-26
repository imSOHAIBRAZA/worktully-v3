'use client';

import Link from 'next/link';
import { useState } from 'react';
import { SubmitHandler, Controller } from 'react-hook-form';
import { Password, Checkbox, Button, Input, Text } from 'rizzui';
import { useMedia } from '@/hooks/use-media';
import { Form } from '@/components/ui/form';
import { PhoneNumber } from '@/components/ui/phone-input';
import { routes } from '@/config/routes';
import { SignUpSchema, signUpSchema } from '@/utils/validators/signup.schema';
import {
  PiArrowRightBold,
} from 'react-icons/pi';

const initialValues = {
  email: '',
  password: '',
  confirmPassword: '',
  isAgreed: false,
  firstName: '',
  lastName: '',
  phone: ''
};

// "first_name": "muhammad hassan",
// "last_name": "ijaz",
// "email": "xeyikow801@amxyy.com",
// "password": "Test1234",
// "phone": "0123456789"



export default function SignUpForm() {
  const isMedium = useMedia('(max-width: 1200px)', false);
  const [reset, setReset] = useState({});
  const onSubmit: SubmitHandler<SignUpSchema> = async (data) => {
    console.log('sign up form data', data);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/jobseeker/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Signup successful!', result);
        // Reset form fields
        setReset({ ...initialValues, isAgreed: false });
      } else {
        console.log(result.message || 'Something went wrong');
      }
    } catch (error) {
      console.log('Network error', error);
    } finally {
      console.log("FINALLY ");
    }

    setReset({ ...initialValues, isAgreed: false });
  };

  return (
    <>
      <Form<SignUpSchema>
        validationSchema={signUpSchema}
        // resetValues={reset}
        onSubmit={onSubmit}
        useFormProps={{
          defaultValues: initialValues,
        }}
      >
        {({ register, control, formState: { errors } }) => (
          <div className="space-y-5">
            <div className="flex flex-col gap-4  md:flex-row md:gap-6 ">
              <Input
                type="text"
                size={isMedium ? 'lg' : 'xl'}
                label="First Name*"
                placeholder="Enter your firstname..."
                className="[&>label>span]:font-medium w-full "
                {...register('first_name')}
                error={errors.first_name?.message}
              />
              <Input
                type="text"
                size={isMedium ? 'lg' : 'xl'}
                label="Last Name"
                placeholder="Enter your lastname..."
                className="[&>label>span]:font-medium w-full "
                {...register('last_name')}
                error={errors.last_name?.message}
              />
            </div>

            <Input
              type="email"
              size={isMedium ? 'lg' : 'xl'}
              label="Email*"
              placeholder="Enter your email"
              className="[&>label>span]:font-medium"
              {...register('email')}
              error={errors.email?.message}
            />

            <Controller
              name="phone"
              control={control}
              render={({ field: { value, onChange } }) => (
                <PhoneNumber
                  label="Phone Number"
                  country="us"
                  value={value}
                  size={isMedium ? 'lg' : 'xl'}
                  className="[&>label>span]:font-medium w-full"
                  onChange={onChange}
                  error={errors.phone?.message}
                />
              )}
            />

            <div className="flex flex-col gap-4  md:flex-row md:gap-6 ">
              <Password
                label="Password*"
                placeholder="Enter your password"
                size={isMedium ? 'lg' : 'xl'}
                className="[&>label>span]:font-medium w-full"
                {...register('password')}
                error={errors.password?.message}
              />
              <Password
                label="Confirm Password*"
                placeholder="Enter your confirm password"
                size={isMedium ? 'lg' : 'xl'}
                className="[&>label>span]:font-medium w-full"
                {...register('confirmPassword')}
                error={errors.password?.message}
              />
            </div>

            <div className="flex items-start pt-5 text-gray-700">
              <Checkbox {...register('isAgreed')} variant="flat" />
              <p className="-mt-0.5 ps-2 text-sm leading-relaxed">
                By signing up you have agreed to our{' '}
                <Link
                  href="/"
                  className="font-semibold text-blue transition-colors hover:text-gray-1000"
                >
                  Terms
                </Link>{' '}
                &{' '}
                <Link
                  href="/"
                  className="font-semibold text-blue transition-colors hover:text-gray-1000"
                >
                  Privacy Policy
                </Link>
              </p>
            </div>
            <Button
              className="border-primary-light w-full border-2 text-base font-medium"
              type="submit"
              size={isMedium ? 'lg' : 'xl'}
            >
              Get Started

              <PiArrowRightBold className="mx-4 h-4 w-4" />
            </Button>
          </div>
        )}
      </Form>
      <Text className="mt-5 text-center text-[15px] leading-loose text-gray-500 lg:text-start xl:mt-7 xl:text-base">
        Already have an account?{' '}
        <Link
          href={routes.auth.signIn}
          className="font-semibold text-gray-700 transition-colors hover:text-blue"
        >
          Sign In
        </Link>
      </Text>
    </>
  );
}
