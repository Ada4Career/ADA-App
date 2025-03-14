import { Plus } from 'lucide-react';
import React from 'react';

import AcceptedOfferSection from '@/components/features/human-resources/accepted-offer-section';
import OngoingOfferSection from '@/components/features/human-resources/ongoing-offer-section';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const HROfferingsPage = () => {
  return (
    <div className='container mx-auto flex flex-col gap-y-12'>
      <div className='flex flex-col gap-y-4'>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-bold tracking-tight'>List Offerings</h1>
          <Button className='gap-1'>
            <Plus className='h-4 w-4' />
            New Offering
          </Button>
        </div>

        <Tabs defaultValue='ongoing'>
          <TabsList className='grid w-full grid-cols-2 md:w-[400px]'>
            <TabsTrigger value='ongoing'>Ongoing Offerings</TabsTrigger>
            <TabsTrigger value='accepted'>Accepted Offerings</TabsTrigger>
          </TabsList>
          <TabsContent value='ongoing'>
            <div className='p-4 rounded bg-card border shadow flex flex-col gap-y-4'>
              <h3 className='text-xl'>Ongoing Offer</h3>
              <OngoingOfferSection />
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
