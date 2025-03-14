'use client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

import api from '@/lib/axios';

import AdaLogo from '@/components/ada-logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

import useAuthStore from '@/store/useAuthStore';

import { API_BASE_URL } from '@/constant/config';

import { ApiReturn } from '@/types/api.types';
import { UserInterface } from '@/types/entities/user.types';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { setUser, user } = useAuthStore();

  const { isPending } = useQuery<ApiReturn<UserInterface>>({
    queryKey: ['me'],
    queryFn: async () => {
      const meResponse = await api.get<ApiReturn<UserInterface>>(
        `${API_BASE_URL}/me`
      );
      setUser(meResponse.data.data);
      return meResponse.data;
    },
  });

  const pathname = usePathname();

  if (isPending) {
    return <div>Loading...</div>;
  }

  const LINKS = [
    {
      label: 'Home',
      url: '/app/hr/dashboard',
    },
    {
      label: 'List Offering',
      url: '/app/hr/offerings',
    },
    {
      label: 'List Offering',
      url: '/app/hr/make-offering',
    },
  ];

  return (
    <div className='flex flex-col gap-y-4'>
      <header className='sticky top-0 z-10 h-16 border-b flex items-center justify-center bg-white px-4 md:px-6'>
        <div className='items-center w-full flex justify-between mx-auto container'>
          <div className='flex items-center gap-4'>
            <Link href='/app/hr/dashboard' className='flex items-center gap-2'>
              <AdaLogo />
            </Link>
            <nav className='hidden md:flex items-center gap-6'>
              {LINKS.map((l, idx) => (
                <Link
                  key={idx}
                  href={l.url}
                  className={` ${
                    pathname.includes(l.url) ? 'font-medium text-primary' : null
                  } text-sm font-medium text-muted-foreground transition-colors hover:text-primary`}
                >
                  {l.label}
                </Link>
              ))}
              {/* <Link href='/' className='text-sm font-medium text-primary'>
                Home
              </Link>
              <Link
                href='/make-offering'
                className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
              >
                Make Offering
              </Link> */}
            </nav>
          </div>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2'>
              <Avatar className='h-8 w-8'>
                <AvatarImage src={user?.name} alt={user?.name} />
                <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className='hidden md:block'>
                <p className='text-sm font-medium'>{user?.name}</p>
                <p className='text-xs text-muted-foreground'>{user?.email}</p>
              </div>
            </div>
            <Button variant='ghost' size='icon' aria-label='Settings'>
              <span className='sr-only'>Settings</span>
              <span className='h-6 w-6 rounded-full border' />
            </Button>
          </div>
        </div>
      </header>
      <div className='p-5'>{children}</div>
    </div>
  );
}
