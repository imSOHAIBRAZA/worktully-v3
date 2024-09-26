'use client';

import Link from 'next/link';
import { routes } from '@/config/routes';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button, Title, Text, Avatar } from 'rizzui';
import cn from '@/utils/class-names';
import { FcGoogle } from 'react-icons/fc';
import OrSeparation from '@/app/shared/auth-layout/or-separation';
import { siteConfig } from '@/config/site.config';
import { BsApple } from 'react-icons/bs';
import ArrowShape from '@/components/shape/arrow';
import {
  PiAppleLogoFill,
  PiArrowLeftBold,
  PiArrowRightBold,
  PiDribbbleLogo,
  PiFacebookLogo,
  PiInstagramLogo,
  PiLinkedinLogo,
  PiTwitterLogo,
  PiArrowLineRight,
  PiUserCirclePlus,
} from 'react-icons/pi';

function AuthNavLink({
  href,
  children,
}: React.PropsWithChildren<{
  href: string;
}>) {
  const pathname = usePathname();
  function isActive(href: string) {
    if (pathname === href) {
      return true;
    }
    return false;
  }

  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center gap-x-1 rounded-3xl p-2 py-1 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 md:px-4 md:py-2.5 [&>svg]:w-4 [&>svg]:text-gray-500',
        isActive(href) ? 'bg-gray-100 text-gray-900 [&>svg]:text-gray-900' : ' '
      )}
    >
      {children}
    </Link>
  );
}

export default function AuthWrapper({
  children,
  title,
  isSocialLoginActive = false,
  isSignIn = false,
  className = '',
}: {
  children: React.ReactNode;
  title: React.ReactNode;
  isSocialLoginActive?: boolean;
  isSignIn?: boolean;
  className?: string;
}) {
  return (
    <div className="flex  min-h-screen  w-full flex-row justify-between">

      <IntroBannerBlock />

      <div className="flex w-full h-full flex-col justify-center p-10 md:p-20">
        <AuthHeader />
        <div
          className={cn(
            '',
            className
          )}
        >
          <div className="flex flex-col ">
            <Link href={'/'} >
              <Image
                width={260}
                height={260}
                src={siteConfig.logo}
                alt={siteConfig.title}
                className="dark:invert"
                priority
              />
            </Link>
            <Title
              as="h2"
              className="mb-7  text-[28px] font-bold leading-snug md:text-3xl md:!leading-normal lg:mb-10 lg:text-4xl"
            >
              {title}
            </Title>
          </div>
          {children}
          {isSocialLoginActive && (
            <>
              <OrSeparation
                title={`OR`}
                isCenter
                className="mb-5 2xl:mb-7"
              />
              <div className="flex flex-col gap-4 pb-6 md:flex-row md:gap-6 xl:pb-7">
                <Button className="bg-black h-11 w-full">
                  <BsApple className="me-2 h-4 w-4 shrink-0 md:h-5 md:w-5" />
                  <span className="truncate">Signin with Apple</span>
                </Button>
                <Button variant="outline" className="h-11 w-full">
                  <FcGoogle className="me-2 h-4 w-4 shrink-0" />
                  <span className="truncate">Signin with Google</span>
                </Button>

              </div>

            </>
          )}
        </div>
      </div>
    </div>

  );
}

function AuthHeader() {
  return (
    <header>
      <div className=" w-full flex items-start py-8 ">
        <AuthNavLink href={routes.auth.signIn}>
          <PiArrowLineRight className="h-4 w-4" />
          <span>Login</span>
        </AuthNavLink>
        <AuthNavLink href={routes.auth.signUp}>
          <PiUserCirclePlus className="h-4 w-4" />
          <span>Sign Up</span>
        </AuthNavLink>
      </div>
    </header>
  );
}

function IntroBannerBlock() {
  return (
    <div className="relative hidden w-[calc(50%-50px)] shrink-0   xl:block xl:w-[calc(50%-20px)] ">
      <div className="absolute mx-auto h-full w-full overflow-hidden  before:absolute before:start-0 before:top-0 before:z-10 before:h-full before:w-full before:bg-[#043ABA]/80 before:content-['']">
        <Image
          fill
          priority
          src={
            'https://isomorphic-furyroad.s3.amazonaws.com/public/auth/sign-in-bg2.webp'
          }
          alt="Sign Up Thumbnail"
          sizes="(max-width: 768px) 100vw"
          className="bg-primary object-cover"
        />
      </div>
      <div className="  relative z-20 flex h-full flex-col justify-around px-10 py-24 xl:px-16 xl:py-28 2xl:px-24">
        <div className="text-white ">
          <div className="inline-flex max-w-[120px]">
            <Image width={50} height={50} src={'/auth/star.svg'}  alt="Star" />
          </div>
          <Title
            as="h2"
            className="mb-5 pt-3.5 text-[26px] font-semibold leading-snug text-white md:text-3xl md:!leading-normal xl:mb-7 xl:text-4xl xl:text-[28px] xl:leading-snug 2xl:text-5xl 2xl:leading-snug"
          >
            Start turning your ideas into reality.
          </Title>
          <Text className="mb-5 text-base leading-loose xl:mb-7 2xl:pe-20">
            Sign up now and start taking advantage to a wealth of information
            that will help you improve your business and stay ahead of the
            competition.
          </Text>

          <JoinedMember />
        </div>

        <SocialLinks />
      </div>
    </div>
  );
}

const socialLinks = [
  {
    title: 'Facebook',
    link: 'https://www.facebook.com/redqinc',
    icon: <PiFacebookLogo className="h-auto w-4" />,
  },
  {
    title: 'Twitter',
    link: 'https://twitter.com/RedqTeam',
    icon: <PiTwitterLogo className="h-auto w-4" />,
  },
  {
    title: 'Instagram',
    link: 'https://www.instagram.com/redqteam/',
    icon: <PiInstagramLogo className="h-auto w-4" />,
  },
  {
    title: 'Linkedin',
    link: 'https://www.linkedin.com/company/redqinc/',
    icon: <PiLinkedinLogo className="h-auto w-4" />,
  },
  {
    title: 'Dribbble',
    link: 'https://dribbble.com/redqinc',
    icon: <PiDribbbleLogo className="h-auto w-4" />,
  },
];
function SocialLinks() {
  return (
    <div className="-mx-2 flex items-center pt-24 text-white xl:-mx-2.5 2xl:pb-5 2xl:pt-40 [&>a>svg]:w-5 xl:[&>a>svg]:w-6">
      {socialLinks.map((item) => (
        <a
          key={item.title}
          href={item.link}
          title={item.title}
          target="_blank"
          className="mx-2 transition-opacity hover:opacity-80 xl:mx-2.5"
        >
          {item.icon}
        </a>
      ))}
    </div>
  );
}

const members = [
  'https://randomuser.me/api/portraits/women/40.jpg',
  'https://randomuser.me/api/portraits/women/41.jpg',
  'https://randomuser.me/api/portraits/women/42.jpg',
  'https://randomuser.me/api/portraits/women/43.jpg',
  'https://randomuser.me/api/portraits/women/44.jpg',
];
function JoinedMember() {
  return (
    <div className="flex items-center">
      <div className="mx-0.5">
        {members.map((member) => (
          <Avatar
            key={member}
            src={member}
            name="avatar"
            className="relative -mx-0.5 inline-flex object-cover ring-2 ring-gray-0"
          />
        ))}
      </div>
      <div className="relative inline-flex items-center justify-center px-3 text-xs font-semibold">
        Join 30,000+ users
      </div>
      <ArrowShape className="h-11 w-10 text-white" />
    </div>
  );
}




