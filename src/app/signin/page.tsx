import AuthWrapper from '@/app/shared/auth-layout/auth-wrapper';
import SignInForm from './sign-in-form';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Sign Up'),
};

export default function SignInPage() {
  return (
    <AuthWrapper title="Login" isSocialLoginActive={true}>
      <SignInForm />
    </AuthWrapper>
  );
}
