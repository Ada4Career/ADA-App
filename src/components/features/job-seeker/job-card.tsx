'use client';

import {
  Accessibility,
  ArrowRight,
  Building,
  Calendar,
  Clock,
  MapPin,
} from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl'; // Import useTranslations

import { isRecent, smartTimeFormat } from '@/lib/luxon';

import { CircularProgressIndicator } from '@/components/features/job-seeker/circular-progress';
import { SegmentedProgressBar } from '@/components/segmented-progress-bar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { JobPostingDataExtended } from '@/types/response/job';

interface JobCardProps {
  job: JobPostingDataExtended;
  onClick: () => void;
}

export default function JobCard({ job, onClick }: JobCardProps) {
  const t = useTranslations('Jobs.Card'); // Add translation hook

  // Use translations for job type labels
  const jobTypeLabels = {
    full_time: t('jobTypes.full_time'),
    part_time: t('jobTypes.part_time'),
    contract: t('jobTypes.contract'),
    fixed_term: t('jobTypes.fixed_term'),
    casual: t('jobTypes.casual'),
  };

  // Use translations for workplace type labels
  const workplaceTypeLabels = {
    remote: t('workplaceTypes.remote'),
    hybrid: t('workplaceTypes.hybrid'),
    on_site: t('workplaceTypes.on_site'),
  };

  // Use translations for accessibility level labels
  const accessibilityLevelLabels = {
    high: t('accessibilityLevels.high'),
    medium: t('accessibilityLevels.medium'),
    standard: t('accessibilityLevels.standard'),
  };

  // Calculate days since posting (dummy data)
  const daysAgo = Math.floor(Math.random() * 7) + 1;

  // Generate random match percentage between 65% and 95%
  const randMatchPercentage = Math.floor(Math.random() * 31) + 65;

  // Get first few qualification points
  const qualifications = job.qualification
    .split('\\n')
    .map((item) => item.replace(/^- /, '').trim())
    .filter(Boolean)
    .slice(0, 3);

  // Get first few accommodations (if available)
  const accommodations = job.accommodations?.slice(0, 2) || [];

  return (
    <Card className='overflow-hidden border-0 shadow-md'>
      <div className='flex flex-col md:flex-row'>
        {/* Left section */}
        <div className='flex-1 p-6 bg-white'>
          <div className='flex justify-between items-start mb-4'>
            <div className='flex gap-2'>
              <Badge variant='outline' className='text-xs font-normal'>
                {smartTimeFormat(job.created_at ?? '')}{' '}
                {/* {daysAgo === 1 ? t('timeLabels.hour') : t('timeLabels.hours')}{' '}
                {t('timeLabels.ago')} */}
              </Badge>
              {isRecent(job.created_at ?? '') ? (
                <Badge
                  variant='outline'
                  className='text-xs font-normal text-blue-500 border-blue-200 bg-blue-50'
                >
                  {t('earlyApplicant')}
                </Badge>
              ) : null}
            </div>
            {/* <button className='text-gray-400 hover:text-gray-600'>
              <Bookmark className='h-5 w-5' />
            </button> */}
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

          {/* Accessibility section */}
          <div className='mt-4 pt-4 border-t'>
            <div className='flex items-center gap-2 mb-2'>
              <Accessibility className='h-5 w-5 text-green-600' />
              <span className='font-medium text-green-600'>
                {job.accessibility_level
                  ? accessibilityLevelLabels[job.accessibility_level]
                  : t('disabilityFriendly')}
              </span>
            </div>
            {accommodations.length > 0 ? (
              <div className='text-sm text-gray-600'>
                <p className='mb-2'>{t('accommodationsInclude')}</p>
                <ul className='list-disc pl-5 space-y-2'>
                  {accommodations.map((accommodation, index) => (
                    <li key={index}>{accommodation.description}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className='text-sm text-gray-600'>
                No Accomodation Got Listed
              </div>
            )}
          </div>
        </div>

        {/* Right section */}
        <div className='w-full md:w-96 bg-gray-900 text-white p-6 flex flex-col'>
          <div className='flex flex-col items-center mb-6'>
            <CircularProgressIndicator
              percentage={job.match_percentage ?? 0}
              size={120}
              strokeWidth={12}
            />
          </div>
          <div className='mb-4'>
            <SegmentedProgressBar
              height={2}
              scoreBreakdown={job.score_breakdown}
            />
          </div>

          <h4 className='font-medium mb-3'>{t('required')}</h4>
          <ul className='space-y-2 mb-6 flex-1'>
            {qualifications.map((qualification, index) => (
              <li key={index} className='flex items-start gap-2 text-sm'>
                <span className='text-white mt-1'>•</span>
                <span>{qualification}</span>
              </li>
            ))}
          </ul>

          <Link href={`/app/home/jobs/${job.id}`}>
            <Button
              onClick={onClick}
              className='w-full justify-between bg-blue-500 hover:bg-blue-600'
            >
              {t('seeDetail')}
              <ArrowRight className='h-4 w-4' />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
