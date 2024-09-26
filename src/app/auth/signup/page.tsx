import AuthWrapper from '@/app/shared/auth-layout/auth-wrapper';
import SignUpForm from './sign-up-form';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Sign Up'),
};

export default function SignUpPage() {
  return (
    <AuthWrapper title="Sign Up!" isSocialLoginActive={true}>
      <SignUpForm />
    </AuthWrapper>
  );
}
