'use client';
import {
  Accessibility,
  ArrowLeft,
  Briefcase,
  Building,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Globe,
  Heart,
  Mail,
  MapPin,
  Share2,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useQuery } from 'react-query';

import api from '@/lib/axios';
import {
  formatDate,
  getRandomAccessibilityLevel,
  getRandomAccommodations,
  getRandomCompany,
  getRandomExperience,
  getRandomInclusiveStatement,
  getRandomLocation,
  getRandomStage,
} from '@/lib/utils';

import { CircularProgressIndicator } from '@/components/features/job-seeker/circular-progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { API_BASE_URL } from '@/constant/config';

import { ApiReturn } from '@/types/api.types';
import { JobPostingData, JobPostingDataExtended } from '@/types/response/job';

export default function JobDetailSection({ id }: { id: string }) {
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

  const accessibilityLevelLabels = {
    high: 'High Accessibility',
    medium: 'Medium Accessibility',
    standard: 'Standard Accessibility',
  };

  const formatBulletPoints = (text: string) => {
    if (!text) return [];
    return text
      .split('\\n')
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const { data, isLoading } = useQuery<JobPostingDataExtended>({
    queryKey: ['detail-job'],
    queryFn: async () => {
      const response = await api.get<ApiReturn<JobPostingData>>(
        `${API_BASE_URL}/job-vacancy/${id}`
      );

      const exp = getRandomExperience();
      const cmp = getRandomCompany();
      const stg = getRandomStage();
      const loc = getRandomLocation();
      const sta = getRandomInclusiveStatement();
      const lvl = getRandomAccessibilityLevel();
      const aco = getRandomAccommodations();
      const newData = {
        ...response.data.data,
        company: cmp,
        accommodations: aco,
        accessibility_level: lvl,
        inclusive_hiring_statement: sta,
        disability_friendly: true,
        experience: exp,
        location: loc,
        stage: stg,
      };

      console.log('ini data', newData);
      return newData;
    },
  });

  const responsibilities = formatBulletPoints(data?.responsibilities ?? '');
  const qualifications = formatBulletPoints(data?.qualification ?? '');

  // Generate random match percentage between 65% and 95%
  const matchPercentage =
    data?.match_percentage || Math.floor(Math.random() * 31) + 65;

  // Generate random salary range based on job type
  const generateSalaryRange = () => {
    const baseSalary = {
      full_time: [80000, 120000],
      part_time: [30000, 60000],
      contract: [90000, 150000],
      fixed_term: [70000, 110000],
      casual: [25000, 50000],
    };

    const range = baseSalary[data?.job_type as keyof typeof baseSalary];
    const min = range[0];
    const max = range[1];

    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  // Generate random benefits
  const benefits = [
    'Health insurance',
    'Dental and vision coverage',
    '401(k) matching',
    'Flexible work hours',
    'Remote work options',
    'Professional development budget',
    'Paid time off',
    'Parental leave',
    'Wellness programs',
    'Company events and retreats',
  ];

  // Select 4-6 random benefits
  const selectedBenefits = () => {
    const shuffled = [...benefits].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.floor(Math.random() * 3) + 4);
  };

  const jobBenefits = selectedBenefits();

  // Generate similar jobs
  // const similarJobs = jobData
  //   .filter(
  //     (j) =>
  //       j.id !== job.id &&
  //       (j.division === job.division ||
  //         j.job_type === job.job_type ||
  //         j.workplace_type === job.workplace_type)
  //   )
  //   .slice(0, 3);

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Back button */}
      <Link href='/' className='inline-flex items-center  mb-6'>
        <Button>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back to all jobs
        </Button>
      </Link>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Main content */}
        <div className='lg:col-span-2'>
          <div className='bg-white rounded-lg shadow-md overflow-hidden'>
            {/* Header */}
            <div className='p-6 border-b'>
              <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-4'>
                <div className='flex items-start gap-4'>
                  <div className='w-16 h-16 rounded-md bg-amber-50 flex items-center justify-center flex-shrink-0'>
                    <span className='text-amber-600 font-semibold text-2xl'>
                      {data?.division.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h1 className='text-2xl font-bold'>{data?.division}</h1>
                    <p className='text-gray-600 mt-1'>
                      {data?.company || 'TechCorp'} /{' '}
                      {data?.department || data?.division} -{' '}
                      {data?.stage || 'Growing'}
                    </p>
                    <div className='flex flex-wrap gap-2 mt-3'>
                      <Badge variant='secondary' className='font-normal'>
                        {
                          jobTypeLabels[
                            data?.job_type as keyof typeof jobTypeLabels
                          ]
                        }
                      </Badge>
                      <Badge variant='outline' className='font-normal'>
                        {
                          workplaceTypeLabels[
                            data?.workplace_type as keyof typeof workplaceTypeLabels
                          ]
                        }
                      </Badge>
                      <Badge
                        variant='outline'
                        className='font-normal text-blue-500 border-blue-200 bg-blue-50'
                      >
                        New
                      </Badge>
                      {data?.disability_friendly && (
                        <Badge
                          variant='outline'
                          className='font-normal text-green-600 border-green-200 bg-green-50'
                        >
                          <Accessibility className='h-3.5 w-3.5 mr-1' />
                          Disability-Friendly
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className='flex gap-2 mt-4 md:mt-0'>
                  <Button
                    variant='outline'
                    size='icon'
                    className='rounded-full'
                  >
                    <Heart className='h-5 w-5' />
                    <span className='sr-only'>Save job</span>
                  </Button>
                  <Button
                    variant='outline'
                    size='icon'
                    className='rounded-full'
                  >
                    <Share2 className='h-5 w-5' />
                    <span className='sr-only'>Share job</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Job details tabs */}
            <Tabs defaultValue='details' className='p-6'>
              <TabsList className='mb-6'>
                <TabsTrigger value='details'>Job Details</TabsTrigger>
                <TabsTrigger value='accessibility'>Accessibility</TabsTrigger>
                <TabsTrigger value='company'>Company</TabsTrigger>
              </TabsList>

              <TabsContent value='details' className='space-y-8'>
                {/* Key details */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  <div className='flex items-start gap-3'>
                    <MapPin className='h-5 w-5 text-gray-500 mt-0.5' />
                    <div>
                      <h3 className='font-medium'>Location</h3>
                      <p className='text-gray-600'>
                        {data?.location ||
                          workplaceTypeLabels[data?.workplace_type ?? 'remote']}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-start gap-3'>
                    <Clock className='h-5 w-5 text-gray-500 mt-0.5' />
                    <div>
                      <h3 className='font-medium'>Job Type</h3>
                      <p className='text-gray-600'>
                        {jobTypeLabels[data?.job_type ?? 'casual']}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-start gap-3'>
                    <DollarSign className='h-5 w-5 text-gray-500 mt-0.5' />
                    <div>
                      <h3 className='font-medium'>Salary Range</h3>
                      <p className='text-gray-600'>
                        {generateSalaryRange()} per year
                      </p>
                    </div>
                  </div>
                  <div className='flex items-start gap-3'>
                    <Calendar className='h-5 w-5 text-gray-500 mt-0.5' />
                    <div>
                      <h3 className='font-medium'>Duration</h3>
                      <p className='text-gray-600'>
                        {formatDate(data?.start_date ?? '')} -{' '}
                        {formatDate(data?.end_date ?? '')}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-start gap-3'>
                    <Briefcase className='h-5 w-5 text-gray-500 mt-0.5' />
                    <div>
                      <h3 className='font-medium'>Experience</h3>
                      <p className='text-gray-600'>
                        {data?.experience || 'Required'}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-start gap-3'>
                    <Mail className='h-5 w-5 text-gray-500 mt-0.5' />
                    <div>
                      <h3 className='font-medium'>Contact</h3>
                      <p className='text-gray-600'>{data?.email}</p>
                    </div>
                  </div>
                </div>

                {/* Job description */}
                <div>
                  <h2 className='text-xl font-semibold mb-4'>
                    Job Description
                  </h2>
                  <p className='text-gray-700 mb-6'>
                    We are looking for a talented {data?.division} professional
                    to join our team. This is an exciting opportunity to work
                    with cutting-edge technologies and contribute to innovative
                    projects in a collaborative environment.
                  </p>

                  {responsibilities.length > 0 && (
                    <div className='mb-6'>
                      <h3 className='text-lg font-semibold mb-3'>
                        Responsibilities
                      </h3>
                      <ul className='list-disc pl-5 space-y-2'>
                        {responsibilities.map((item, index) => (
                          <li key={index} className='text-gray-700'>
                            {item.replace(/^- /, '')}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {qualifications.length > 0 && (
                    <div className='mb-6'>
                      <h3 className='text-lg font-semibold mb-3'>
                        Qualifications
                      </h3>
                      <ul className='list-disc pl-5 space-y-2'>
                        {qualifications.map((item, index) => (
                          <li key={index} className='text-gray-700'>
                            {item.replace(/^- /, '')}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Benefits */}
                <div>
                  <h2 className='text-xl font-semibold mb-4'>Benefits</h2>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                    {jobBenefits.map((benefit, index) => (
                      <div key={index} className='flex items-center gap-2'>
                        <CheckCircle2 className='h-5 w-5 text-green-500' />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Accessibility Tab */}
              <TabsContent value='accessibility' className='space-y-6'>
                <div>
                  <div className='flex items-center gap-2 mb-4'>
                    <Accessibility className='h-6 w-6 text-green-600' />
                    <h2 className='text-xl font-semibold'>
                      Accessibility & Accommodations
                    </h2>
                  </div>

                  <div className='mb-6'>
                    <h3 className='text-lg font-medium mb-2'>
                      Accessibility Level
                    </h3>
                    <Badge className='text-base font-normal py-1 px-3 bg-green-100 text-green-800 hover:bg-green-200'>
                      {data?.accessibility_level
                        ? accessibilityLevelLabels[data?.accessibility_level]
                        : 'Disability-Friendly'}
                    </Badge>
                    <p className='mt-3 text-gray-700'>
                      This position has been rated as having{' '}
                      {data?.accessibility_level || 'standard'} accessibility,
                      meaning we have taken steps to ensure the workplace,
                      tools, and processes are accessible to people with
                      disabilities.
                    </p>
                  </div>
                  {data?.accommodations && data?.accommodations.length > 0 && (
                    <div className='mb-6'>
                      <h3 className='text-lg font-medium mb-2'>
                        Available Accommodations
                      </h3>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {data?.accommodations.map((accommodation, index) => (
                          <div
                            key={index}
                            className='flex items-start gap-2 bg-gray-50 p-3 rounded-md'
                          >
                            <CheckCircle2 className='h-5 w-5 text-green-500 mt-0.5' />
                            <div>
                              <p className='font-medium'>
                                {accommodation.type}
                              </p>
                              <p className='text-gray-600'>
                                {accommodation.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className='mb-6'>
                    <h3 className='text-lg font-medium mb-2'>
                      Inclusive Hiring Statement
                    </h3>
                    <div className='bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md'>
                      <p className='text-gray-700'>
                        {data?.inclusive_hiring_statement ||
                          'We are committed to creating an inclusive workplace that promotes and values diversity. We actively seek applicants from diverse backgrounds, including those with disabilities.'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className='text-lg font-medium mb-2'>
                      Additional Support
                    </h3>
                    <p className='text-gray-700 mb-3'>
                      If you require any accommodations during the application
                      or interview process, please contact our HR team at{' '}
                      {data?.email}. We are committed to ensuring an accessible
                      and equitable hiring process for all candidates.
                    </p>
                    <p className='text-gray-700'>
                      We also welcome suggestions on how we can make our
                      workplace and hiring process more accessible and
                      inclusive.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value='company'>
                <div className='space-y-6'>
                  <div className='flex items-center gap-4'>
                    <div className='w-16 h-16 rounded-md bg-amber-50 flex items-center justify-center'>
                      <span className='text-amber-600 font-semibold text-2xl'>
                        {(data?.company || 'TC').charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h2 className='text-xl font-semibold'>
                        {data?.company || 'TechCorp'}
                      </h2>
                      <p className='text-gray-600'>
                        {data?.stage || 'Growing'} company
                      </p>
                    </div>
                  </div>

                  <p className='text-gray-700'>
                    {data?.company || 'TechCorp'} is a{' '}
                    {data?.stage || 'growing'} company in the
                    {data?.department || data?.division} industry. We are
                    dedicated to innovation, excellence, and creating a positive
                    impact through our products and services.
                  </p>

                  <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-6'>
                    <div className='flex items-start gap-3'>
                      <Users className='h-5 w-5 text-gray-500 mt-0.5' />
                      <div>
                        <h3 className='font-medium'>Company Size</h3>
                        <p className='text-gray-600'>
                          {Math.floor(Math.random() * 900) + 100}-
                          {Math.floor(Math.random() * 900) + 1000} employees
                        </p>
                      </div>
                    </div>
                    <div className='flex items-start gap-3'>
                      <Globe className='h-5 w-5 text-gray-500 mt-0.5' />
                      <div>
                        <h3 className='font-medium'>Website</h3>
                        <p className='text-gray-600'>
                          www.
                          {(data?.company || 'techcorp')
                            .toLowerCase()
                            .replace(/\s+/g, '')}
                          .com
                        </p>
                      </div>
                    </div>
                    <div className='flex items-start gap-3'>
                      <Building className='h-5 w-5 text-gray-500 mt-0.5' />
                      <div>
                        <h3 className='font-medium'>Industry</h3>
                        <p className='text-gray-600'>
                          {data?.department || data?.division}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='mt-6'>
                    <h3 className='font-medium mb-2'>
                      Commitment to Accessibility
                    </h3>
                    <p className='text-gray-700'>
                      At {data?.company || 'TechCorp'}, we believe in creating
                      an inclusive workplace where everyone can thrive. We have
                      implemented various accessibility features across our
                      offices and digital platforms, and we continuously work to
                      improve our accessibility standards.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Similar jobs
          {similarJobs.length > 0 && (
            <div className='mt-8'>
              <h2 className='text-xl font-semibold mb-4'>Similar Jobs</h2>
              <div className='grid gap-4'>
                {similarJobs.map((similarJob) => (
                  <Link
                    key={similarJob.id}
                    href={`/jobs/${similarJob.id}`}
                    className='block'
                  >
                    <Card className='hover:shadow-md transition-shadow'>
                      <CardContent className='p-4'>
                        <div className='flex items-center gap-3'>
                          <div className='w-10 h-10 rounded-md bg-amber-50 flex items-center justify-center'>
                            <span className='text-amber-600 font-semibold'>
                              {similarJob.division.charAt(0)}
                            </span>
                          </div>
                          <div className='flex-1'>
                            <h3 className='font-medium'>
                              {similarJob.division}
                            </h3>
                            <div className='flex items-center gap-4 text-sm text-gray-500 mt-1'>
                              <span className='flex items-center gap-1'>
                                <MapPin className='h-3 w-3' />
                                {similarJob.location ||
                                  workplaceTypeLabels[
                                    similarJob.workplace_type
                                  ]}
                              </span>
                              <span className='flex items-center gap-1'>
                                <Clock className='h-3 w-3' />
                                {jobTypeLabels[similarJob.job_type]}
                              </span>
                            </div>
                          </div>
                          {similarJob.disability_friendly && (
                            <Badge
                              variant='outline'
                              className='text-xs font-normal text-green-600 border-green-200 bg-green-50'
                            >
                              <Accessibility className='h-3 w-3 mr-1' />
                              Accessible
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )} */}
        </div>

        {/* Sidebar */}
        <div className='space-y-6'>
          {/* Match score */}
          <Card className='bg-gray-900 text-white overflow-hidden'>
            <CardContent className='p-6'>
              <div className='flex flex-col items-center mb-6'>
                <CircularProgressIndicator
                  percentage={matchPercentage}
                  size={120}
                  strokeWidth={12}
                />
              </div>

              <h3 className='font-medium mb-3'>Required</h3>
              <ul className='space-y-2 mb-6'>
                {qualifications.slice(0, 3).map((qualification, index) => (
                  <li key={index} className='flex items-start gap-2 text-sm'>
                    <span className='text-white mt-1'>•</span>
                    <span>{qualification.replace(/^- /, '')}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Apply now */}
          <Card>
            <CardContent className='p-6'>
              <h3 className='text-lg font-semibold mb-4'>
                Apply for this position
              </h3>
              <p className='text-gray-600 mb-6'>
                Submit your application now to be considered for this role. The
                hiring process typically takes 1-2 weeks.
              </p>
              <Button className='w-full bg-blue-500 hover:bg-blue-600'>
                Apply Now
              </Button>
              <p className='text-sm text-gray-500 mt-3'>
                Need accommodations during the application process? Please
                contact us at {data?.email}.
              </p>
            </CardContent>
          </Card>

          {/* Accessibility highlights */}
          <Card className='border-green-200'>
            <CardContent className='p-6'>
              <div className='flex items-center gap-2 mb-4'>
                <Accessibility className='h-5 w-5 text-green-600' />
                <h3 className='text-lg font-semibold'>
                  Accessibility Highlights
                </h3>
              </div>

              <div className='space-y-3'>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-600'>Accessibility Level</span>
                  <Badge className='font-normal bg-green-100 text-green-800 hover:bg-green-200'>
                    {data?.accessibility_level
                      ? accessibilityLevelLabels[data?.accessibility_level]
                      : 'Standard'}
                  </Badge>
                </div>

                <div className='pt-2'>
                  <p className='text-gray-600 font-medium mb-2'>
                    Key Accommodations:
                  </p>
                  <ul className='space-y-1'>
                    {(data?.accommodations || [])
                      .slice(0, 3)
                      .map((accommodation, index) => (
                        <li
                          key={index}
                          className='flex items-start gap-2 text-sm'
                        >
                          <CheckCircle2 className='h-4 w-4 text-green-500 mt-0.5' />
                          <span className='text-gray-700'>
                            {accommodation.description}
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>

              <div className='mt-4 pt-4 border-t border-gray-100'>
                <Link
                  href='#'
                  className='text-blue-600 hover:text-blue-800 text-sm font-medium'
                >
                  View all accessibility features
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Job insights */}
          <Card>
            <CardContent className='p-6'>
              <h3 className='text-lg font-semibold mb-4'>Job Insights</h3>
              <div className='space-y-4'>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-600'>Posted</span>
                  <span className='font-medium'>
                    {Math.floor(Math.random() * 7) + 1} days ago
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-600'>Applications</span>
                  <span className='font-medium'>
                    {Math.floor(Math.random() * 50) + 5}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-600'>Interviews</span>
                  <span className='font-medium'>
                    {Math.floor(Math.random() * 10) + 1}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
