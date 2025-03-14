import { ClipboardList, FileText, MessageSquareWarning } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { columns } from '@/components/features/human-resources/applicant-table/column';
import { DataTable } from '@/components/features/human-resources/applicant-table/data-table';
import { applicants } from '@/components/features/human-resources/applicant-table/schema';
import StatsCard from '@/components/features/human-resources/stats-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const companyInfo = {
  name: 'Company name',
  subtitle: 'Phoenix Recruitment',
  logo: '/placeholder.svg?height=48&width=48',
};

const stats = {
  totalRegistrants: 124,
  needReview: 124,
  totalReceived: 124,
};

const HRDashboardPage = () => {
  return (
    <div className='mx-auto max-w-6xl'>
      <div className='flex flex-col gap-y-6'>
        {/* Header */}
        <div className='grid grid-cols-4 gap-x-6'>
          <Card className='md:col-span-1'>
            <CardContent className='flex !py-6 flex-row items-center justify-center gap-4 pb-2'>
              <div className='h-12 w-12 overflow-hidden rounded-md border bg-muted'>
                <Image
                  src={
                    companyInfo.logo || '/placeholder.svg?height=48&width=48'
                  }
                  alt={companyInfo.name}
                  width={48}
                  height={48}
                  className='h-full w-full object-cover'
                />
              </div>
              <div>
                <h5 className='text-lg'>{companyInfo.name}</h5>
                <p className='text-sm text-muted-foreground'>
                  {companyInfo.subtitle}
                </p>
              </div>
            </CardContent>
          </Card>

          <StatsCard
            title='Total Registrants'
            value={stats.totalRegistrants}
            icon={<ClipboardList className='text-amber-500 h-4 w-4' />}
          />
          <StatsCard
            title='Need Review'
            value={stats.needReview}
            icon={<FileText className='text-blue-500 h-4 w-4' />}
          />
          <StatsCard
            title='Total Received'
            value={stats.totalReceived}
            icon={<MessageSquareWarning className='text-green-500 h-4 w-4' />}
          />
        </div>

        {/* Table */}
        <div className='bg-card p-6 w-full border rounded-md shadow'>
          <div className='flex items-center justify-between'>
            <h4>All applicant registration list</h4>
            <Link href='all'>
              <Button variant='link' className='text-blue-500 underline'>
                See All
              </Button>
            </Link>
          </div>
          <div className='mt-4'>
            <DataTable columns={columns} data={applicants} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboardPage;
