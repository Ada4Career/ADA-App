'use client';
import React from 'react';

import { useJobOfferings } from '@/hooks/hr/use-job-offerings';

import OngoingOfferSection from '@/components/features/human-resources/ongoing-offer-section';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import useAuthStore from '@/store/useAuthStore';

const HROfferingsPage = () => {
  const { user } = useAuthStore();

  const { data, isLoading, error } = useJobOfferings(user?.email);

  // const { data: applicants, isPending: isPendingApplicants } = useQuery({
  //   queryKey: ['offering-detail-list-applicants'],
  //   queryFn: async () => {
  //     const response = await api.get<ApiReturn<JobApplicant[]>>(
  //       `${API_BASE_URL}/job-applications/job-vacancy/${id}`
  //     );
  //     return response.data.data;
  //   },
  //   enab
  //   select: (data) => {
  //     return data.filter((applicant) => applicant.status === 'applied');
  //   },
  // });

  if (isLoading) return <div>Loading...</div>;

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
                <OngoingOfferSection offerings={data.ongoingJobs} />
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
              {data ? (
                <OngoingOfferSection offerings={data.completedJobs} />
              ) : (
                <div className='flex items-center text-xl'>
                  <h4>There is no accepted offer</h4>
                </div>
              )}
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
