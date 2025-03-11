'use client';

import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { ArrowLeft, ArrowRight, Download, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { useQuery } from 'react-query';

import api from '@/lib/axios';
import { getCookie } from '@/lib/cookies-action';

import CVDocument, { Resume } from '@/components/cv-document';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { API_AI_URL, API_BASE_URL } from '@/constant/config';

import { ApiReturn } from '@/types/api.types';
import { UserInterface } from '@/types/entities/user.types';

const blobToFile = (blob: Blob, fileName: string) => {
  return new File([blob], fileName, { type: 'application/pdf' });
};

const CVResult = () => {
  const router = useRouter();
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const pdfLinkRef = useRef(null);

  const [suggestedRole, setSuggestedRole] = useState<string>('');

  const { data: userData, isLoading } = useQuery<UserInterface>({
    queryKey: ['me'],
    queryFn: async () => {
      const meResponse = await api.get<ApiReturn<UserInterface>>(
        `${API_BASE_URL}/me`
      );
      return meResponse.data.data;
    },
  });

  const {
    data: resumeData,
    isLoading: isLoadingResume,
    error,
  } = useQuery<Resume>({
    queryKey: ['resume'],
    queryFn: async () => {
      const response = await api.post(`${API_AI_URL}/resume`, {
        name: userData?.name,
        email: userData?.email,
        skills: userData?.job_seeker_data?.skill,
        experiences: userData?.job_seeker_data?.experiences,
        expectations: userData?.job_seeker_data?.expectations,
      });
      return response.data.resume_content;
    },
    enabled: userData != undefined,
  });

  const { data: roleMappingData, isLoading: isLoadingRoleMapping } = useQuery<
    ApiReturn<string>
  >({
    queryKey: ['role-mapping'],
    queryFn: async () => {
      const email = (await getCookie('ada4career-email'))?.value;
      const response = await api.post(`${API_BASE_URL}/generate-role/${email}`);
      setSuggestedRole(response.data.data);
      return response.data;
    },
  });
  // Function to capture PDF as Blob
  const handleCaptureBlob = async (blob: Blob) => {
    setPdfBlob(blob);
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-background to-muted/30 py-8 px-4'>
      <div className='max-w-6xl mx-auto'>
        <header className='mb-8 text-center'>
          <h1 className='text-3xl font-bold tracking-tight mb-2 text-gradient-ms'>
            Your AI-Generated Resume
          </h1>
          <p className='text-muted-foreground'>
            Tailored for disability career development and accessibility
          </p>
        </header>

        <div className='grid md:grid-cols-[1fr_300px] gap-8'>
          <div className='flex flex-col'>
            <Card className='mb-6'>
              <CardContent className='p-6'>
                {isLoading || isLoadingResume || resumeData == undefined ? (
                  <div className='flex flex-col items-center justify-center space-y-4 py-12'>
                    <Loader2 className='h-12 w-12 animate-spin text-primary' />
                    <div className='text-center'>
                      <h3 className='font-medium text-lg'>
                        Generating your resume
                      </h3>
                      <p className='text-muted-foreground'>
                        Our AI is analyzing your profile and creating a tailored
                        resume...
                      </p>
                    </div>
                    <div className='w-full max-w-md space-y-2'>
                      <Skeleton className='h-4 w-full' />
                      <Skeleton className='h-4 w-3/4' />
                      <Skeleton className='h-4 w-5/6' />
                    </div>
                  </div>
                ) : error ? (
                  <div className='flex flex-col items-center justify-center py-12'>
                    <div className='text-center text-destructive'>
                      <h3 className='font-medium text-lg'>Error</h3>
                      {/* <p>{error}</p> */}
                      <Button
                        variant='outline'
                        className='mt-4'
                        onClick={() => router.push('/onboard/cv/q/form')}
                      >
                        <ArrowLeft className='mr-2 h-4 w-4' />
                        Go Back and Try Again
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className='flex flex-col items-center'>
                    <div className='w-full h-[600px] mb-4'>
                      <PDFViewer
                        width='100%'
                        height='600px'
                        className='border rounded-md'
                      >
                        <CVDocument resumeContent={resumeData} />
                      </PDFViewer>
                    </div>
                    <div className='flex justify-center mt-4 gap-4'>
                      <div style={{ display: 'none' }}>
                        <PDFDownloadLink
                          ref={pdfLinkRef}
                          document={<CVDocument resumeContent={resumeData} />}
                          fileName='my-accessible-resume.pdf'
                        >
                          {({ blob, url, loading, error }) => {
                            if (blob && !pdfBlob) {
                              handleCaptureBlob(blob);
                            }
                            return null;
                          }}
                        </PDFDownloadLink>
                      </div>
                      <PDFDownloadLink
                        document={<CVDocument resumeContent={resumeData} />}
                        fileName='my-accessible-resume.pdf'
                        className='inline-flex'
                      >
                        {({ loading }) => (
                          <Button variant='outline' disabled={loading}>
                            {loading ? (
                              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            ) : (
                              <Download className='mr-2 h-4 w-4' />
                            )}
                            Download Resume
                          </Button>
                        )}
                      </PDFDownloadLink>
                      {/* {isSaving && (
                        <Button variant='outline' disabled>
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          Saving to profile...
                        </Button>
                      )} */}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className='flex items-center justify-between gap-4 mt-auto'>
              <Button
                onClick={() => {
                  router.replace('/app/home/jobs');
                }}
                size='lg'
                className='flex-1 py-8 w-full'
              >
                Continue to Dashboard
                <ArrowRight className='ml-2 h-4 w-4' />
              </Button>
            </div>
          </div>

          <div className='space-y-6'>
            <Card>
              <CardContent className='p-6'>
                <h2 className='text-xl font-semibold mb-4'>
                  Career Suggestions
                </h2>
                {isLoading || suggestedRole === '' ? (
                  <div className='space-y-2'>
                    <Skeleton className='h-6 w-full' />
                    <Skeleton className='h-6 w-3/4' />
                    <Skeleton className='h-6 w-5/6' />
                  </div>
                ) : (
                  <div>
                    <h6 className='font-semibold text-gradient-ms'>
                      {suggestedRole}
                    </h6>
                    <div className='text-xs font-medium text-muted-foreground mt-0.5'>
                      Best match for your profile
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVResult;
