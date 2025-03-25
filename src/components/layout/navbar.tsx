import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import ChangeLangButton from '@/components/change-lang-button';
import AuthDialog from '@/components/features/auth/auth-dialog';

import logo from '~/images/ADALogo.png';

const NAV_LINKS = [
  {
    name: 'Home',
    url: '/',
  },
  {
    name: 'Products',
    url: '#product',
  },
];

const queryClient = new QueryClient();

const Navbar = () => {
  // const { user, isAuthenticated, isPending } = useAuthStore();
  return (
    <nav className='max-w-6xl mx-auto py-4 px-4 flex items-center justify-between'>
      <div className='flex items-center gap-5'>
        <Image
          src={logo}
          alt='ADA Logo'
          className='mr-1'
          width={40}
          height={40}
        />
        {NAV_LINKS.map((l) => (
          <Link
            href={l.url}
            key={l.name}
            className=' text-gray-700 hover:text-gradient-ms hover:font-medium'
          >
            {l.name}
          </Link>
        ))}
      </div>
      <div className='flex items-center gap-8'>
        {/* {isAuthenticated ? (
          <Link href={`/app/${user?.role == 'jobseeker' ? 'home' : 'hr'}`}>
            <Button>
              Go To Dashboard <ArrowRight />
            </Button>
          </Link>
        ) : (
        )} */}
        <ChangeLangButton />
        <QueryClientProvider client={queryClient}>
          <AuthDialog />
        </QueryClientProvider>
        {/* <LoginDialog />
        <RegisterDialog /> */}
      </div>
    </nav>
  );
};

export default Navbar;
