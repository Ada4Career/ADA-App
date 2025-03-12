'use client';

import { Search, X } from 'lucide-react';
import type React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { JobType, WorkplaceType } from '@/types/response/job';

interface JobFiltersProps {
  filters: {
    division: string;
    jobType: JobType | 'all';
    workplaceType: WorkplaceType | 'all';
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      division: string;
      jobType: JobType | 'all';
      workplaceType: WorkplaceType | 'all';
    }>
  >;
}

export default function JobFilters({ filters, setFilters }: JobFiltersProps) {
  const resetFilters = () => {
    setFilters({
      division: '',
      jobType: 'all',
      workplaceType: 'all',
    });
  };

  return (
    <div className='bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm'>
      <div className='grid gap-4 md:grid-cols-3'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400' />
          <Input
            placeholder='Search by division'
            className='pl-9'
            value={filters.division}
            onChange={(e) =>
              setFilters({ ...filters, division: e.target.value })
            }
          />
        </div>

        <Select
          value={filters.jobType}
          onValueChange={(value) =>
            setFilters({ ...filters, jobType: value as JobType | 'all' })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder='Job Type' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Job Types</SelectItem>
            <SelectItem value='full_time'>Full-time</SelectItem>
            <SelectItem value='part_time'>Part-time</SelectItem>
            <SelectItem value='contract'>Contract</SelectItem>
            <SelectItem value='fixed_term'>Fixed-term</SelectItem>
            <SelectItem value='casual'>Casual</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.workplaceType}
          onValueChange={(value) =>
            setFilters({
              ...filters,
              workplaceType: value as WorkplaceType | 'all',
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder='Workplace Type' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Workplace Types</SelectItem>
            <SelectItem value='remote'>Remote</SelectItem>
            <SelectItem value='hybrid'>Hybrid</SelectItem>
            <SelectItem value='on_site'>On-site</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(filters.division ||
        filters.jobType !== 'all' ||
        filters.workplaceType !== 'all') && (
        <div className='mt-4 flex justify-end'>
          <Button
            variant='outline'
            size='sm'
            onClick={resetFilters}
            className='flex items-center gap-1'
          >
            <X className='h-4 w-4' />
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
