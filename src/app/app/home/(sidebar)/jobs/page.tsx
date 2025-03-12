'use client';
import { BriefcaseBusiness } from 'lucide-react';
import React from 'react';
import { useQuery } from 'react-query';

import api from '@/lib/axios';
import {
  getRandomCompany,
  getRandomExperience,
  getRandomLocation,
  getRandomStage,
} from '@/lib/utils';

import JobCard from '@/components/features/job-seeker/job-card';
import JobFilters from '@/components/features/job-seeker/job-filter';

import { API_BASE_URL } from '@/constant/config';

import { ApiReturn } from '@/types/api.types';
import {
  JobPostingData,
  JobPostingDataExtended,
  JobType,
  WorkplaceType,
} from '@/types/response/job';

const HomePage = () => {
  const { data, isLoading } = useQuery<JobPostingDataExtended[]>({
    queryKey: ['jobs'],
    queryFn: async () => {
      const response = await api.get<ApiReturn<JobPostingData[]>>(
        `${API_BASE_URL}/job-vacancies`
      );
      return response.data.data.map((j) => {
        const exp = getRandomExperience();
        const cmp = getRandomCompany();
        const stg = getRandomStage();
        const loc = getRandomLocation();
        return {
          ...j,
          company: cmp,
          experience: exp,
          location: loc,
          stage: stg,
        };
      });
    },
  });

  const [filters, setFilters] = React.useState({
    division: '',
    jobType: 'all' as JobType | 'all',
    workplaceType: 'all' as WorkplaceType | 'all',
  });

  const filteredJobs = data?.filter((job) => {
    if (
      filters.division &&
      !job.division.toLowerCase().includes(filters.division.toLowerCase())
    ) {
      return false;
    }
    if (filters.jobType !== 'all' && job.job_type !== filters.jobType) {
      return false;
    }
    if (
      filters.workplaceType !== 'all' &&
      job.workplace_type !== filters.workplaceType
    ) {
      return false;
    }
    return true;
  });

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  const clickHandler = () => {
    return;
  };

  return (
    <div className=''>
      <div className='flex flex-col items-start mb-8'>
        <div>
          <div className='flex items-center gap-x-2'>
            <BriefcaseBusiness className='w-8 h-8 text-blue-600 mr-3' />
            <h1 className='text-3xl font-bold text-gray-900'>
              Jobs Recommendation
            </h1>
          </div>
          <JobFilters filters={filters} setFilters={setFilters} />
        </div>
        <div className='flex flex-col gap-y-8 mt-4 w-full'>
          {filteredJobs ? (
            <>
              {filteredJobs.map((d, idx) => (
                <JobCard job={d} onClick={clickHandler} key={idx} />
              ))}
            </>
          ) : (
            <div>No Job Vacancies</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
