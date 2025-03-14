import { ArrowRight, Trash2, User } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const ongoingOfferings = [
  {
    id: 3,
    title: 'Junior Graphic and UI/UX Designer',
    company: 'Phoenix Recruitment',
    department: 'IT System Custom Software Development',
    stage: 'Early Stage',
    logo: '/placeholder.svg?height=40&width=40',
    applicants: 5,
  },
  {
    id: 4,
    title: 'Junior Front - End Developer',
    company: 'Phoenix Recruitment',
    department: 'IT System Custom Software Development',
    stage: 'Early Stage',
    logo: '/placeholder.svg?height=40&width=40',
    applicants: 3,
  },
];
const OngoingOfferSection = () => {
  return (
    <div className='space-y-4'>
      {ongoingOfferings.map((offering) => (
        <div
          key={offering.id}
          className='flex flex-col gap-4 rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow md:flex-row md:items-center'
        >
          <div className='flex items-start gap-4 md:flex-1'>
            <div className='flex h-10 w-10 items-center justify-center overflow-hidden rounded-md border bg-slate-50'>
              <Image
                src={offering.logo || '/placeholder.svg'}
                alt={offering.company}
                width={40}
                height={40}
                className='h-10 w-10 object-contain'
              />
            </div>
            <div className='flex-1'>
              <h4 className='font-semibold'>{offering.title}</h4>
              <div className='mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground'>
                <span>{offering.company}</span>
                <span className='text-xs'>•</span>
                <span>{offering.department}</span>
                <Badge variant='outline' className='ml-1'>
                  {offering.stage}
                </Badge>
              </div>
              <Badge className='mt-2'>{offering.applicants} applied</Badge>
            </div>
          </div>
          <div className='flex items-center gap-2 self-end md:self-center'>
            <Button variant='outline' className='h-9 gap-1'>
              <User className='h-4 w-4' />
              Applicant Details
              <ArrowRight className='h-4 w-4' />
            </Button>
            <Button variant='destructive' size='icon' className='h-9 w-9'>
              <Trash2 className='h-4 w-4' />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OngoingOfferSection;
