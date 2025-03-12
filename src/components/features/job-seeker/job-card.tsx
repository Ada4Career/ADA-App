'use client';
import {
  ArrowRight,
  Bookmark,
  Building,
  Calendar,
  Clock,
  MapPin,
} from 'lucide-react';

import { CircularProgressIndicator } from '@/components/features/job-seeker/circular-progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { JobPostingDataExtended } from '@/types/response/job';

interface JobCardProps {
  job: JobPostingDataExtended;
  onClick: () => void;
}

export default function JobCard({ job, onClick }: JobCardProps) {
  const jobTypeLabels = {
    full_time: 'Full-time',
    part_time: 'Part-time',
    contract: 'Contract',
    fixed_term: 'Fixed-term',
    casual: 'Casual',
  };

  const workplaceTypeLabels = {
    remote: 'Remote',
    hybrid: 'Hybrid',
    on_site: 'On-site',
  };

  // Calculate days since posting (dummy data)
  const daysAgo = Math.floor(Math.random() * 7) + 1;

  // Generate random match percentage between 65% and 95%
  const matchPercentage = Math.floor(Math.random() * 31) + 65;

  // Get first few qualification points
  const qualifications = job.qualification
    .split('\\n')
    .map((item) => item.replace(/^- /, '').trim())
    .filter(Boolean)
    .slice(0, 3);

  return (
    <Card className='overflow-hidden border-0 shadow-md'>
      <div className='flex flex-col md:flex-row'>
        {/* Left section */}
        <div className='flex-1 p-6 bg-white'>
          <div className='flex justify-between items-start mb-4'>
            <div className='flex gap-2'>
              <Badge variant='outline' className='text-xs font-normal'>
                {daysAgo} {daysAgo === 1 ? 'Hour' : 'Hours'} Ago
              </Badge>
              <Badge
                variant='outline'
                className='text-xs font-normal text-blue-500 border-blue-200 bg-blue-50'
              >
                Be an early applicant
              </Badge>
            </div>
            <button className='text-gray-400 hover:text-gray-600'>
              <Bookmark className='h-5 w-5' />
            </button>
          </div>

          <div className='flex gap-3 mb-4'>
            <div className='w-10 h-10 rounded-md bg-amber-50 flex items-center justify-center'>
              <span className='text-amber-600 font-semibold text-lg'>
                {job.division.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className='text-lg font-semibold'>{job.division}</h3>
              <p className='text-sm text-gray-500'>
                {job.company || 'TechCorp'} / {job.department || job.division} -{' '}
                {job.stage || 'Growing'}
              </p>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-y-2 gap-x-4 mt-6 text-sm'>
            <div className='flex items-center gap-2 text-gray-600'>
              <MapPin className='h-4 w-4' />
              <span>{job.location || 'Remote Available'}</span>
            </div>
            <div className='flex items-center gap-2 text-gray-600'>
              <Building className='h-4 w-4' />
              <span>{workplaceTypeLabels[job.workplace_type]}</span>
              {/* <span>{workplaceTypeLabels[job.workplaceType]}</span> */}
            </div>
            <div className='flex items-center gap-2 text-gray-600'>
              <Clock className='h-4 w-4' />
              <span>{jobTypeLabels[job.job_type]}</span>
            </div>
            <div className='flex items-center gap-2 text-gray-600'>
              <Calendar className='h-4 w-4' />
              <span>{job.experience || '1+ years exp'}</span>
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className='w-full md:w-96 bg-gray-900 text-white p-6 flex flex-col'>
          <div className='flex flex-col items-center mb-6'>
            <CircularProgressIndicator
              percentage={matchPercentage}
              size={120}
              strokeWidth={12}
            />
          </div>

          <h4 className='font-medium mb-3'>Required</h4>
          <ul className='space-y-2 mb-6 flex-1'>
            {qualifications.map((qualification, index) => (
              <li key={index} className='flex items-start gap-2 text-sm'>
                <span className='text-white mt-1'>•</span>
                <span>{qualification}</span>
              </li>
            ))}
          </ul>

          <Button
            onClick={onClick}
            className='w-full justify-between bg-blue-500 hover:bg-blue-600'
          >
            See Detail
            <ArrowRight className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </Card>
  );
}
