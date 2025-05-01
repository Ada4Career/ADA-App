import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import Education from './Education';
import Experience from './Experience';
import PersonalInfo from './PersonalInfo';
import Skills from './Skills';

import { ResumeFormSectionProps } from '@/types/entities/cv.types';

const ResumeReview = ({ form }: ResumeFormSectionProps) => {
  const t = useTranslations('Resume.Review');
  const [expandedSections, setExpandedSections] = useState<{
    personalInfo: boolean;
    education: boolean;
    experience: boolean;
    skills: boolean;
  }>({
    personalInfo: false,
    education: true,
    experience: true,
    skills: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  return (
    <div className='w-full space-y-6'>
      <div className='text-center mb-8'>
        <h1 className='text-2xl font-bold'>{t('title')}</h1>
        <p className='text-gray-500'>{t('description')}</p>
      </div>

      {/* Personal Information Section */}
      <Card className='w-full'>
        <CardHeader
          className='bg-slate-50 border-b cursor-pointer flex flex-row items-center justify-between'
          onClick={() => toggleSection('personalInfo')}
        >
          <CardTitle className='text-lg'>{t('personalInfo')}</CardTitle>
          <Button variant='ghost' size='sm'>
            {expandedSections.personalInfo ? (
              <ChevronUpIcon size={18} />
            ) : (
              <ChevronDownIcon size={18} />
            )}
          </Button>
        </CardHeader>
        {expandedSections.personalInfo && (
          <CardContent className='pt-6'>
            <PersonalInfo form={form} />
          </CardContent>
        )}
      </Card>

      {/* Education Section */}
      <Card className='w-full'>
        <CardHeader
          className='bg-slate-50 border-b cursor-pointer flex flex-row items-center justify-between'
          onClick={() => toggleSection('education')}
        >
          <CardTitle className='text-lg'>{t('education')}</CardTitle>
          <Button variant='ghost' size='sm'>
            {expandedSections.education ? (
              <ChevronUpIcon size={18} />
            ) : (
              <ChevronDownIcon size={18} />
            )}
          </Button>
        </CardHeader>
        {expandedSections.education && (
          <CardContent className='pt-6'>
            <Education form={form} />
          </CardContent>
        )}
      </Card>

      {/* Experience Section */}
      <Card className='w-full'>
        <CardHeader
          className='bg-slate-50 border-b cursor-pointer flex flex-row items-center justify-between'
          onClick={() => toggleSection('experience')}
        >
          <CardTitle className='text-lg'>{t('experience')}</CardTitle>
          <Button variant='ghost' size='sm'>
            {expandedSections.experience ? (
              <ChevronUpIcon size={18} />
            ) : (
              <ChevronDownIcon size={18} />
            )}
          </Button>
        </CardHeader>
        {expandedSections.experience && (
          <CardContent className='pt-6'>
            <Experience form={form} />
          </CardContent>
        )}
      </Card>

      {/* Skills Section */}
      <Card className='w-full'>
        <CardHeader
          className='bg-slate-50 border-b cursor-pointer flex flex-row items-center justify-between'
          onClick={() => toggleSection('skills')}
        >
          <CardTitle className='text-lg'>{t('skills')}</CardTitle>
          <Button variant='ghost' size='sm'>
            {expandedSections.skills ? (
              <ChevronUpIcon size={18} />
            ) : (
              <ChevronDownIcon size={18} />
            )}
          </Button>
        </CardHeader>
        {expandedSections.skills && (
          <CardContent className='pt-6'>
            <Skills form={form} />
          </CardContent>
        )}
      </Card>

      <div className='flex justify-center'>
        <p className='text-sm text-gray-500'>{t('reviewInstructions')}</p>
      </div>
    </div>
  );
};

export default ResumeReview;
