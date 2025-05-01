'use client';
import { useQuery } from '@tanstack/react-query';
import { LoaderCircleIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useQueryState } from 'nuqs';
import React from 'react';

import api from '@/lib/axios';

import DisabilityTest from '@/app/[locale]/onboarding/disability/disability-test';
import HRFormPage from '@/app/[locale]/onboarding/hr/hr-onboard';
import JobSeekerFormPage from '@/app/[locale]/onboarding/jobseeker/jobseeker-onboard';
import JobseekerOnboardCv from '@/app/[locale]/onboarding/jobseeker/jobseeker-onboard-cv';
import JobseekerOnboardStart from '@/app/[locale]/onboarding/jobseeker/jobseeker-onboard-start';
import { API_BASE_URL } from '@/constant/config';

import { ApiReturn } from '@/types/api.types';
import { UserInterface } from '@/types/entities/user.types';
import { DisabilityResponse } from '@/types/response/disability';

const APP_MODE = process.env.NEXT_PUBLIC_APP_MODE;

const OnboardingPage = () => {
  const router = useRouter();
  const [mode] = useQueryState('mode');
  const { data, isPending } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const meResponse = await api.get<ApiReturn<UserInterface>>(
        `${API_BASE_URL}/me`
      );
      return meResponse;
    },
  });

  const {
    data: disabilityData,
    isPending: isLoadingDisability,
    refetch,
  } = useQuery({
    queryKey: ['disability'],
    queryFn: async () => {
      try {
        const response = await api.get<ApiReturn<DisabilityResponse>>(
          `${API_BASE_URL}/questionnaire/${data?.data.data.email}`
        );
        return response;
      } catch (err) {
        // console.error(err);
      }
    },
    enabled: data?.data.data.email != undefined,
  });

  const renderOnboard = () => {
    const isJobseeker = data?.data.data.role[0] === 'jobseeker';
    const hasGender = data?.data.data.gender !== '';

    if (!isJobseeker) {
      return <HRFormPage />;
    }

    if (hasGender) {
      router.replace('/onboarding/jobseeker/result');
      return;
    }

    if (APP_MODE === 'disability') {
      if (!disabilityData?.data) {
        return <DisabilityTest refetch={refetch} />;
      }
    }

    switch (mode) {
      case 'create':
        return <JobSeekerFormPage />;
      case 'upload':
        return <JobseekerOnboardCv />;
      default:
        return <JobseekerOnboardStart />;
    }
  };
  if (isPending || isLoadingDisability) {
    return (
      <div className='w-screen h-screen flex items-center justify-center'>
        <LoaderCircleIcon className='h-20 w-20 animate-spin' />
      </div>
    );
  }

  return <div>{renderOnboard()}</div>;
};

export default OnboardingPage;
