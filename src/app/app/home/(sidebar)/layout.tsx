'use client';

import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { useQueryState } from 'nuqs';
import type { ReactNode } from 'react';
import { Suspense } from 'react'; // Add this import

import api from '@/lib/axios';

import { AppSidebar } from '@/components/features/job-seeker/sidebar';
import UserProfileDropdown from '@/components/features/user-profile-dropdown';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

import useAuthStore from '@/store/useAuthStore';

import { API_BASE_URL } from '@/constant/config';

import { ApiReturn } from '@/types/api.types';
import { UserInterface } from '@/types/entities/user.types';

// Create a separate component for the parts that use useQueryState
function HeaderLabel() {
  const pathname = usePathname();
  const [conversationId] = useQueryState('conversationId');
  const [conversationTitle] = useQueryState('conversationTitle');

  const getHeaderLabel = () => {
    if (pathname.includes('jobs')) {
      return 'Job Recommendation';
    } else if (pathname.includes('courses')) {
      return 'Course Recommendation';
    } else if (pathname.includes('chat')) {
      return conversationId ? 'Convo: ' + conversationTitle : 'Chat with AIDA';
    } else if (pathname.includes('career-tree')) {
      return 'Your Personalize Career Tree';
    }
    return '';
  };

  return <h3>{getHeaderLabel()}</h3>;
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { setUser } = useAuthStore();

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

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <SidebarProvider>
      <div className='flex min-h-screen w-screen'>
        <AppSidebar />
        <SidebarInset className='flex-1'>
          <header className='sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-6'>
            <SidebarTrigger className='md:hidden' />

            {/* Wrap the component that uses useQueryState in Suspense */}
            <Suspense fallback={<h3>Loading...</h3>}>
              <HeaderLabel />
            </Suspense>

            <div className='ml-auto'>
              <UserProfileDropdown />
            </div>
          </header>
          <main className='flex-1 p-6 w-full'>{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
