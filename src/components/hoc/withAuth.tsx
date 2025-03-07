import { useRouter } from 'next/router';
import React, { useCallback, useEffect } from 'react';
import { ImSpinner8 } from 'react-icons/im';
import { toast } from 'react-toastify';

import api from '@/lib/axios';
import { getToken, removeToken } from '@/lib/cookies';

import useAuthStore from '@/store/useAuthStore';

import { ApiReturn } from '@/types/api.types';
import { User } from '@/types/entities/user.types';

export interface WithAuthProps {
  user: User | null;
}

const LOGIN_ROUTE = '/login';
const JOBSEEKER_ROUTE = '/app/home';
const HR_ROUTE = '/app/hr';

export enum RouteRole {
  public,
  optional,
  jobseeker,
  human_resources,
}

export default function withAuth<T>(
  Component: React.ComponentType<T>,
  routeRole: keyof typeof RouteRole,
  options: { withCache?: boolean } = { withCache: true }
) {
  const ComponentWithAuth = (props: Omit<T, keyof WithAuthProps>) => {
    const router = useRouter();
    const { query } = router;

    const isAuthenticated = useAuthStore.useIsAuthenticated();
    const isLoading = useAuthStore.useIsLoading();
    const login = useAuthStore.useLogin();
    const logout = useAuthStore.useLogout();
    const stopLoading = useAuthStore.useStopLoading();
    const user = useAuthStore.useUser();

    const checkAuth = useCallback(() => {
      const token = getToken();
      if (!token) {
        if (isAuthenticated) logout();
        stopLoading();
        return;
      }

      const loadUser = async () => {
        try {
          const res = await api.get<ApiReturn<User>>('/auth/me');
          if (!res.data.data) {
            toast.error('Sesi login tidak valid');
            throw new Error('Invalid session');
          }
          login({ token, ...res.data.data });
        } catch {
          logout();
          removeToken();
        } finally {
          stopLoading();
        }
      };

      if (!isAuthenticated || options.withCache) {
        loadUser();
      }
    }, [isAuthenticated, login, logout, stopLoading]);

    useEffect(() => {
      checkAuth();
      window.addEventListener('focus', checkAuth);
      return () => window.removeEventListener('focus', checkAuth);
    }, [checkAuth]);

    useEffect(() => {
      if (!isLoading) {
        if (isAuthenticated) {
          if (routeRole === 'public') {
            if (query?.redirect) {
              router.replace(query.redirect as string);
            } else {
              router.replace(
                user?.role === 'jobseeker' ? JOBSEEKER_ROUTE : HR_ROUTE
              );
            }
          } else if (
            (routeRole === 'jobseeker' && user?.role !== 'jobseeker') ||
            (routeRole === 'human_resources' &&
              user?.role !== 'human_resources')
          ) {
            router.replace(
              user?.role === 'jobseeker' ? JOBSEEKER_ROUTE : HR_ROUTE
            );
          }
        } else if (routeRole !== 'public' && routeRole !== 'optional') {
          router.replace(`${LOGIN_ROUTE}?redirect=${router.asPath}`);
        }
      }
    }, [isAuthenticated, isLoading, query, router, user, routeRole]);

    if (
      isLoading ||
      (!isAuthenticated && routeRole !== 'public' && routeRole !== 'optional')
    ) {
      return (
        <div className='flex min-h-screen flex-col items-center justify-center text-gray-800'>
          <ImSpinner8 className='mb-4 animate-spin text-4xl' />
          <p>Loading...</p>
        </div>
      );
    }

    if (isAuthenticated) {
      if (
        (routeRole === 'jobseeker' && user?.role !== 'jobseeker') ||
        (routeRole === 'human_resources' && user?.role !== 'human_resources')
      ) {
        router.replace('/');
        return null;
      }
    }

    return <Component {...(props as T)} user={user} />;
  };

  return ComponentWithAuth;
}
