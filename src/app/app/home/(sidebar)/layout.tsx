'use client';

import { LogOut, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useMutation, useQuery } from 'react-query';

import api from '@/lib/axios';

import { AppSidebar } from '@/components/features/job-seeker/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

import useAuthStore from '@/store/useAuthStore';

import { API_BASE_URL } from '@/constant/config';

import { ApiReturn } from '@/types/api.types';
import { UserInterface } from '@/types/entities/user.types';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { logout } = useAuthStore();
  const router = useRouter();

  const { isLoading: isLoadingLogout, mutateAsync: logoutMutation } =
    useMutation(async () => {
      const resp = await api.post(`${API_BASE_URL}/logout`);
      return resp.data;
    });

  const handleLogout = async () => {
    // Implement your logout logic here
    await logoutMutation();
    logout();
    router.replace('/');
  };

  const { setUser, user } = useAuthStore();
  const { isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const meResponse = await api.get<ApiReturn<UserInterface>>(
        `${API_BASE_URL}/me`
      );
      return meResponse.data;
    },
    onSuccess: (data) => {
      setUser(data.data);
    },
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <SidebarProvider>
      <div className='flex min-h-screen w-screen'>
        <AppSidebar />
        <SidebarInset className='flex-1'>
          <header className='sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-6'>
            <SidebarTrigger className='md:hidden' />

            <div className='ml-auto'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='outline'
                    className='h-10 p-3 rounded-full gap-2 px-2'
                  >
                    <div className='flex items-center gap-2'>
                      <Avatar className='h-8 w-8'>
                        <AvatarImage src={user?.address} alt={user?.name} />
                        <AvatarFallback>
                          {user?.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className='hidden flex-col items-start text-left md:flex'>
                        <span className='text-sm truncate font-medium'>
                          {user?.name}
                        </span>
                        <span className='text-xs truncate text-muted-foreground'>
                          {user?.email}
                        </span>
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-56'>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <User className='mr-2 h-4 w-4' />
                      <span>Profile</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    disabled={isLoadingLogout}
                    onClick={handleLogout}
                    className='cursor-pointer !hover:bg-red-500'
                  >
                    <LogOut className='mr-2 h-4 w-4' />
                    <span>
                      {isLoadingLogout ? 'Logging Out...' : 'Log Out'}
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className='flex-1 p-6 w-full'>{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

const GetUserData = () => {
  return <></>;
};
