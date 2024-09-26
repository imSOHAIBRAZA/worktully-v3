export const routes = {


  dashboard: {
    home: '/',
    profile:'/profile',
    assessment: (id: string) => `/assessment/${id}`
  },
  emailTemplates: '/email-templates',
  // profile: '/profile',
  welcome: '/welcome',
  comingSoon: '/coming-soon',
  accessDenied: '/access-denied',
  notFound: '/not-found',
  maintenance: '/maintenance',
  blank: '/blank',
  auth: {
    signUp: '/auth/signup',
    signIn: '/signin',
    forgotPassword: '/auth/forgot-password',
    otp: '/auth/otp',
  },
  signIn: '/signin',
};
