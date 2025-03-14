'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Check, FileText, X } from 'lucide-react';

import { Applicant } from '@/components/features/human-resources/applicant-table/schema';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export const columns: ColumnDef<Applicant>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const applicant = row.original;
      return (
        <div className='flex items-center gap-3'>
          <Avatar className='h-8 w-8'>
            <AvatarImage src={applicant.avatar} alt={applicant.name} />
            <AvatarFallback>{applicant.name[0]}</AvatarFallback>
          </Avatar>
          <span className='font-medium'>{applicant.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'position',
    header: 'Role Job',
  },
  {
    accessorKey: 'startDate',
    header: 'Start Date',
  },
  {
    accessorKey: 'endDate',
    header: 'End Date',
  },
  {
    accessorKey: 'cvLink',
    header: 'Curriculum Vitae',
    cell: ({ row }) => {
      const applicant = row.original;
      return (
        <a href='#' className='text-primary hover:underline'>
          {applicant.cvLink}
        </a>
      );
    },
  },
  {
    id: 'actions',
    header: 'Action',
    cell: ({ row }) => {
      return (
        <div className='flex gap-2'>
          <Button size='icon' variant='outline' className='h-8 w-8'>
            <span className='sr-only'>View CV</span>
            <FileText className='h-4 w-4' />
          </Button>
          <Button
            size='icon'
            className='h-8 w-8 bg-green-500 hover:bg-green-600'
          >
            <span className='sr-only'>Approve</span>
            <Check className='h-4 w-4 text-white' />
          </Button>
          <Button size='icon' variant='destructive' className='h-8 w-8'>
            <span className='sr-only'>Reject</span>
            <X className='h-4 w-4' />
          </Button>
        </div>
      );
    },
  },
];
