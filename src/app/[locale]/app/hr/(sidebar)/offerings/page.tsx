'use client';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import api from '@/lib/axios';

import AcceptedOfferSection from '@/components/features/human-resources/accepted-offer-section';
import OngoingOfferSection from '@/components/features/human-resources/ongoing-offer-section';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import useAuthStore from '@/store/useAuthStore';

import { API_BASE_URL } from '@/constant/config';

import { ApiReturn } from '@/types/api.types';
import { JobPostingDataExtended } from '@/types/response/job';

const HROfferingsPage = () => {
  const { user } = useAuthStore();
  const { data } = useQuery({
    queryKey: ['offerings'],
    queryFn: async () => {
      const response = await api.get<ApiReturn<JobPostingDataExtended[]>>(
        `${API_BASE_URL}/job-vacancies/${user?.email}`
      );
      return response.data.data;
    },
  });
  return (
    <div className='container mx-auto flex flex-col gap-y-12'>
      <div className='flex flex-col gap-y-4'>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-bold tracking-tight'>List Offerings</h1>
          {/* <Button className='gap-1'>
            <Plus className='h-4 w-4' />
            New Offering
          </Button> */}
        </div>

        <Tabs defaultValue='ongoing'>
          <TabsList className='grid w-full grid-cols-2 md:w-[400px]'>
            <TabsTrigger value='ongoing'>Ongoing Offerings</TabsTrigger>
            <TabsTrigger value='accepted'>Accepted Offerings</TabsTrigger>
          </TabsList>
          <TabsContent value='ongoing'>
            <div className='p-4 rounded bg-card border shadow flex flex-col gap-y-4'>
              <h3 className='text-xl'>Ongoing Offer</h3>
              {data ? (
                <OngoingOfferSection offerings={data} />
              ) : (
                <div className='flex items-center text-xl'>
                  <h4>There is no ongoing offerings</h4>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value='accepted'>
            <div className='p-4 rounded bg-card border shadow flex flex-col gap-y-4'>
              <h3 className='text-xl'>Accepted Offer</h3>
              <AcceptedOfferSection />
            </div>
          </TabsContent>
        </Tabs>

        {/* {ACCEPTED.map((acc) => (
          <div className='h-28'>
            
          </div>
        ))} */}
      </div>
    </div>
  );
};

export default HROfferingsPage;
