'use client';
import { LoaderCircleIcon } from 'lucide-react';
import React from 'react';
import { useQuery } from 'react-query';

import api from '@/lib/axios';

import DisabilityTest from '@/app/onboarding/disability/disability-test';
import HRFormPage from '@/app/onboarding/hr/hr-onboard';
import JobSeekerFormPage from '@/app/onboarding/jobseeker/jobseeker-onboard';
import { API_BASE_URL } from '@/constant/config';

import { ApiReturn } from '@/types/api.types';
import { UserInterface } from '@/types/entities/user.types';
import { DisabilityResponse } from '@/types/response/disability';

const OnboardingPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const meResponse = await api.get<ApiReturn<UserInterface>>(
        `${API_BASE_URL}/me`
      );
      return meResponse;
    },
  });

  const { data: disabilityData, isLoading: isLoadingDisability } = useQuery({
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
    if (data?.data.data.role[0] == 'jobseeker') {
      if (disabilityData?.data == undefined) {
        return <DisabilityTest />;
      } else {
        return <JobSeekerFormPage />;
      }
    } else {
      return <HRFormPage />;
    }
  };

  if (isLoading || isLoadingDisability) {
    return (
      <div className='w-screen h-screen flex items-center justify-center'>
        <LoaderCircleIcon className='h-20 w-20 animate-spin' />
      </div>
    );
  }

  return <div>{renderOnboard()}</div>;
};

export default OnboardingPage;
