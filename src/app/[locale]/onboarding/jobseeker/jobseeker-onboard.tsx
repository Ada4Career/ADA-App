/* eslint-disable no-case-declarations */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

import api from '@/lib/axios';
import { getCookie } from '@/lib/cookies-action';

import AdaLogo from '@/components/ada-logo';
import AidaChatOnboard from '@/components/aida-chat-onboard';
import CvPreviewOnboard from '@/components/cv-preview-onboard';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import Education from '@/app/[locale]/onboarding/jobseeker/form/Education';
import Experience from '@/app/[locale]/onboarding/jobseeker/form/Experience';
import PersonalInfo from '@/app/[locale]/onboarding/jobseeker/form/PersonalInfo';
import ResumeReview from '@/app/[locale]/onboarding/jobseeker/form/Review';
import Skills from '@/app/[locale]/onboarding/jobseeker/form/Skills';
import { API_BASE_URL } from '@/constant/config';

import { ApiError, ApiReturn } from '@/types/api.types';
import {
  educationSchema,
  experienceSchema,
  personalInfoSchema,
  ResumeData,
  resumeSchema,
  skillsSchema,
} from '@/types/entities/cv.types';

const ResumeFormPage = () => {
  const t = useTranslations('Resume');

  const [step, setStep] = React.useState(1);
  const [isValidating, setIsValidating] = React.useState(false);

  const form = useForm<ResumeData>({
    resolver: zodResolver(resumeSchema),
    mode: 'onTouched',
    defaultValues: {
      personal_info: {
        full_name: 'John Doe',
        contact_info: {
          email: 'john.doe@example.com',
          phone: '+1 234 567 8900',
          address: '123 Main Street, City, Country',
          linkedin: 'https://linkedin.com/in/johndoe',
        },
        summary_objective:
          'Experienced professional seeking opportunities to leverage skills in software development.',
      },
      education: [
        {
          institution: 'University of Technology',
          degree: 'Bachelor of Science',
          field_of_study: 'Computer Science',
          start_date: '2018-09',
          end_date: '2022-06',
          gpa: '3.8',
        },
      ],
      experience: [
        {
          title: 'Software Developer',
          company: 'Tech Solutions Inc.',
          start_date: '2022-07',
          end_date: '2023-12',
          responsibilities: [
            'Developed full-stack applications',
            'Collaborated with cross-functional teams',
            'Implemented new features and optimizations',
          ],
        },
      ],
      skills: {
        technical: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'],
        research: [
          'Data Analysis',
          'Market Research',
          'Technical Documentation',
        ],
        soft: ['Communication', 'Team Leadership', 'Problem Solving'],
      },
    },
  });

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  const router = useRouter();

  const { mutateAsync: mutateAsyncUptData, isPending } = useMutation<
    ApiReturn<null>,
    ApiError,
    ResumeData
  >({
    mutationFn: async (data) => {
      const email = (await getCookie('ada4career-email'))?.value;

      // Format the data as needed for your API
      const formattedData = {
        personal_info: data.personal_info,
        education: data.education,
        experience: data.experience,
        skills: data.skills,
      };

      const response = await api.post(
        `${API_BASE_URL}/resume/${email}`,
        formattedData
      );

      return response.data;
    },
    onSuccess: () => {
      toast.success(t('successMessage'));
      router.push('/resume/result');
    },
    onError: (error) => {
      toast.error(error.message || t('errorMessage'));
    },
  });

  const onSubmit = async (values: ResumeData) => {
    console.log(values);
    // await mutateAsyncUptData(values);
  };

  // Function to validate current step before proceeding
  const validateStep = async () => {
    setIsValidating(true);

    let isValid = false;

    try {
      switch (step) {
        case 1:
          // Validate personal info
          const personalData = form.getValues('personal_info');
          await personalInfoSchema.parseAsync(personalData);
          isValid = true;
          break;
        case 2:
          // Validate education
          const educationData = form.getValues('education');
          await z.array(educationSchema).parseAsync(educationData);
          isValid = true;
          break;
        case 3:
          // Validate experience
          const experienceData = form.getValues('experience');
          await z.array(experienceSchema).parseAsync(experienceData);
          isValid = true;
          break;
        case 4:
          // Validate skills
          const skillsData = form.getValues('skills');
          await skillsSchema.parseAsync(skillsData);
          isValid = true;
          break;

        case 5:
          isValid = true;
          break;
        default:
          isValid = false;
      }
    } catch (error) {
      isValid = false;
      // Trigger form validation to show error messages
      form.trigger();
      toast.error(t('errorMessage'));
    }

    setIsValidating(false);
    return isValid;
  };

  // Handle next button click
  const handleNext = async () => {
    const isValid = await validateStep();

    if (isValid) {
      if (step < totalSteps) {
        setStep(step + 1);
      } else {
        form.handleSubmit(onSubmit)();
      }
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <PersonalInfo form={form} />;
      case 2:
        return <Education form={form} />;
      case 3:
        return <Experience form={form} />;
      case 4:
        return <Skills form={form} />;
      case 5:
        return <ResumeReview form={form} />;
      default:
        return null;
    }
  };

  return (
    <div className='min-h-screen w-screen py-8 px-4 overflow-x-clip flex items-center justify-center relative'>
      <div className='max-w-7xl grid grid-cols-8 gap-x-6 mx-auto w-full h-full items-start justify-center'>
        <div className='mx-auto rounded-md bg-white z-10 p-6 w-full text-center col-span-5 shadow-md'>
          <div className='max-w-4xl mx-auto items-center flex flex-col p-4'>
            <AdaLogo width={56} height={56} />
            <h1 className='mt-4 mb-2'>{t('title')}</h1>
            <p>{t('description')}</p>
            <div className='w-full text-orange-600 flex items-center mt-12 mb-6 gap-x-3'>
              <p className='font-medium'>
                {step}/{totalSteps}
              </p>
              <Progress value={progress} className='h-2' />
              <p className='font-semibold text-start flex-grow flex-1'>
                {t('yourProgress')}
              </p>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='w-full'>
                <div className='flex flex-col gap-y-8 items-start text-start justify-start w-full'>
                  {renderStepContent()}
                </div>

                <footer className='flex justify-between mt-16'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => step > 1 && setStep(step - 1)}
                    disabled={step === 1}
                  >
                    {t('previous')}
                  </Button>
                  <Button
                    type='button'
                    onClick={handleNext}
                    disabled={isValidating || isPending}
                  >
                    {step === totalSteps ? t('submit') : t('next')}
                  </Button>
                </footer>
              </form>
            </Form>
          </div>
        </div>
        <div className='w-full max-w-2xl col-span-3'>
          <Tabs defaultValue='chat'>
            <TabsList className='mb-2'>
              <TabsTrigger value='chat'>AIDA Chat</TabsTrigger>
              <TabsTrigger value='preview'>Preview CV</TabsTrigger>
            </TabsList>
            <TabsContent value='chat'>
              <AidaChatOnboard />
            </TabsContent>
            <TabsContent value='preview'>
              <CvPreviewOnboard />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ResumeFormPage;
