'use client';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Download } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import api from '@/lib/axios';

import { CircularProgressIndicator } from '@/components/features/job-seeker/circular-progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { API_BASE_URL } from '@/constant/config';

import { ApiReturn } from '@/types/api.types';
import { JobApplicant, JobPostingDataExtended } from '@/types/response/job';

import aidaLogo from '~/images/aida-logo.png';

type Props = {
  id: string;
};

const resumeData: SkillSectionItem[] = [
  {
    id: '1',
    title: 'Relevant Skills',
    description:
      'Mauris, turpis augue mauris tellus massa, lacus. Id quam adipiscing tincidunt at feugiat arcu in',
    isCompleted: true,
  },
  {
    id: '2',
    title: 'Work Experience',
    description:
      'Mauris, turpis augue mauris tellus massa, lacus. Id quam adipiscing tincidunt at feugiat arcu in',
    isCompleted: false,
  },
  {
    id: '3',
    title: 'Educational Qualification',
    description:
      'Mauris, turpis augue mauris tellus massa, lacus. Id quam adipiscing tincidunt at feugiat arcu in',
    isCompleted: true,
  },
  {
    id: '4',
    title: 'Soft Skills & Adaptability',
    description:
      'Mauris, turpis augue mauris tellus massa, lacus. Id quam adipiscing tincidunt at feugiat arcu in',
    isCompleted: true,
  },
  {
    id: '5',
    title: 'Certifications & Additional Training',
    description:
      'Mauris, turpis augue mauris tellus massa, lacus. Id quam adipiscing tincidunt at feugiat arcu in',
    isCompleted: true,
  },
];

const ApplicantDetailSection = ({ id }: Props) => {
  const { acceptApplicant, rejectApplicant, isProcessing } =
    useApplicantStatus();

  const { data: applicant, isPending } = useQuery({
    queryKey: ['applicant-detail'],
    queryFn: async () => {
      const response = await api.get<ApiReturn<JobApplicant>>(
        `${API_BASE_URL}/job-application/${id}`
      );
      return response.data.data;
    },
  });

  const { data: offering, isPending: isPendingOffering } = useQuery({
    queryKey: ['offering-detail'],
    queryFn: async () => {
      const response = await api.get<ApiReturn<JobPostingDataExtended>>(
        `${API_BASE_URL}/job-vacancy/${applicant?.job_vacancy_id}`
      );

      return response.data.data;
    },
    enabled: !isPending,
  });

  const matchPercentage = Math.floor(Math.random() * 31) + 65;

  const router = useRouter();

  if (isPending || isPendingOffering) {
    return <div>Loading...</div>;
  }

  return (
    <div className='container mx-auto'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-x-4'>
          <Button
            onClick={() => {
              router.back();
            }}
            size='icon'
          >
            <ArrowLeft className='h-6 w-6' />
          </Button>
          <div className='flex items-center gap-x-2'>
            <Avatar className='h-14 w-14'>
              <AvatarImage
                src={applicant?.id || '/placeholder.svg'}
                alt={applicant?.id ?? 'Company logo'}
                className='object-contain'
              />
              <AvatarFallback className='text-xs'>
                {applicant?.job_seeker_email
                  ? applicant?.job_seeker_email.substring(0, 2).toUpperCase()
                  : 'CO'}
              </AvatarFallback>
            </Avatar>
            <div className='flex flex-col gap-1'>
              <h4>{applicant?.job_seeker_email}</h4>
              <p>{offering?.department}</p>
            </div>
          </div>
        </div>
        <div className='flex flex-col items-end gap-2'>
          <Badge className='p-2' variant='outline'>
            Applicant Status: {applicant?.status}
          </Badge>
          <p>{offering?.start_date}</p>
        </div>
      </div>
      <div className='border p-4 rounded mt-6 gap-6 flex'>
        <div className=' flex-1 p-2'>
          <div className='bg-blue-50 p-4 rounded'>
            <div className='flex items-center gap-2'>
              <Image src={aidaLogo} alt='AIDA Logo' width={36} height={36} />
              <h5>AIDA Chat</h5>
              <Link className='ml-auto' href='/app/hr/chat'>
                <Button size='lg'>Ask More AIDA</Button>
              </Link>
            </div>
            <p className='mt-6'>
              Thank you for reviewing the AI screening results for the
              candidate. Based on our system's analysis, the applicant has
              achieved a score of {matchPercentage}%, indicating a fairly strong
              alignment with the job requirements. Below is a breakdown of key
              aspects that meet the company`s hiring criteria:
            </p>
          </div>
          <div className='mt-4'>
            <ResumeSkills items={resumeData} />
          </div>
        </div>
        <div className='w-full h-fit md:w-96 bg-gray-900 rounded text-white p-6 flex flex-col'>
          <div className='flex flex-col gap-6 items-center mb-6'>
            <h3>User Score Results</h3>
            <CircularProgressIndicator
              percentage={matchPercentage}
              size={180}
              strokeWidth={24}
            />
            <p className='text-sm text-gray-300'>
              The results are an AIDA analysis, which can be used as
              recommendations for selecting job candidates.
            </p>
          </div>
        </div>
      </div>
      <div className='border p-4 rounded mt-6'>
        <h3>Supporting Data</h3>
        <div className='flex items-center mt-8 justify-between'>
          <div className='flex items-center'>
            <div className='h-10 w-10 font-semibold flex items-center justify-center rounded-full bg-slate-100'>
              1
            </div>
            <h5>Curriculum Vitae</h5>
          </div>
          <div className='flex items-center gap-2'>
            <Link href={applicant?.resume_url ?? ''}>
              <Button variant='outline' size='lg'>
                Download
                <Download className='h-4 w-4' />
              </Button>
            </Link>
          </div>
        </div>
        <div className='flex items-center mt-8 justify-between'>
          <div className='flex items-center'>
            <div className='h-10 w-10 font-semibold flex items-center justify-center rounded-full bg-slate-100'>
              2
            </div>
            <h5>Cover Letter</h5>
          </div>
          <div className='flex items-center gap-2'>
            <Button variant='outline' size='lg'>
              Download
              <Download className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>
      <div className='mt-6 flex items-center justify-end gap-4'>
        <Button
          onClick={async () => {
            await rejectApplicant({ applicantId: id });
            router.back();
          }}
          disabled={
            applicant?.status == 'accepted' || applicant?.status == 'rejected'
          }
          size='lg'
          variant='destructive'
        >
          Reject
        </Button>
        <Button
          disabled={
            applicant?.status == 'accepted' || applicant?.status == 'rejected'
          }
          className='bg-green-500 hover:bg-green-600'
          onClick={async () => {
            await acceptApplicant({ applicantId: id });
            router.back();
          }}
          size='lg'
          variant='default'
        >
          Accept
        </Button>
      </div>
    </div>
  );
};

export default ApplicantDetailSection;

// components/ResumeSkills.tsx
import { Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';
import { useApplicantStatus } from '@/hooks/hr/use-process-applicant';

// Define types for our component
export interface SkillSectionItem {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
}

export interface SkillSectionProps {
  items: SkillSectionItem[];
  className?: string;
}

const ResumeSkills = ({ items, className }: SkillSectionProps) => {
  return (
    <div className={cn('space-y-4', className)}>
      {items.map((item) => (
        <div key={item.id} className='flex items-start gap-4 p-1'>
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-md',
              item.isCompleted ? 'bg-green-500' : 'bg-red-500'
            )}
          >
            {item.isCompleted ? (
              <Check className='h-6 w-6 text-white' />
            ) : (
              <X className='h-6 w-6 text-white' />
            )}
          </div>

          <div className='grid grid-cols-2 items-center space-y-1'>
            <h3 className='font-medium  text-lg '>{item.title}</h3>
            <p className='text-gray-500 text-sm  '>{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
