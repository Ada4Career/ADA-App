import { PlusCircle, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';
import { useFieldArray } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { ResumeFormSectionProps } from '@/types/entities/cv.types';

const Skills = ({ form }: ResumeFormSectionProps) => {
  const t = useTranslations('Resume.Skills');
  const { control } = form;

  // Technical skills field array
  const {
    fields: technicalFields,
    append: appendTechnical,
    remove: removeTechnical,
  } = useFieldArray({
    control,
    name: 'skills.technical',
  });

  // Research skills field array
  const {
    fields: researchFields,
    append: appendResearch,
    remove: removeResearch,
  } = useFieldArray({
    control,
    name: 'skills.research',
  });

  // Soft skills field array
  const {
    fields: softFields,
    append: appendSoft,
    remove: removeSoft,
  } = useFieldArray({
    control,
    name: 'skills.soft',
  });

  return (
    <div className='w-full space-y-6'>
      <h2 className='text-xl font-semibold'>{t('title')}</h2>

      {/* Technical Skills */}
      <Card>
        <CardHeader>
          <CardTitle>{t('technicalSkills')}</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {technicalFields.map((field, index) => (
            <div key={field.id} className='flex items-center gap-2'>
              <FormField
                control={control}
                name={`skills.technical.${index}`}
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormControl>
                      <Input
                        placeholder={t('technicalSkillPlaceholder')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {technicalFields.length > 1 && (
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  onClick={() => removeTechnical(index)}
                >
                  <X className='h-4 w-4' />
                </Button>
              )}
            </div>
          ))}
          <Button
            type='button'
            variant='outline'
            size='sm'
            className='flex items-center gap-1'
            onClick={() => appendTechnical('')}
          >
            <PlusCircle className='h-4 w-4' />
            {t('addTechnicalSkill')}
          </Button>
        </CardContent>
      </Card>

      {/* Research Skills */}
      <Card>
        <CardHeader>
          <CardTitle>{t('researchSkills')}</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {researchFields.map((field, index) => (
            <div key={field.id} className='flex items-center gap-2'>
              <FormField
                control={control}
                name={`skills.research.${index}`}
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormControl>
                      <Input
                        placeholder={t('researchSkillPlaceholder')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {researchFields.length > 1 && (
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  onClick={() => removeResearch(index)}
                >
                  <X className='h-4 w-4' />
                </Button>
              )}
            </div>
          ))}
          <Button
            type='button'
            variant='outline'
            size='sm'
            className='flex items-center gap-1'
            onClick={() => appendResearch('')}
          >
            <PlusCircle className='h-4 w-4' />
            {t('addResearchSkill')}
          </Button>
        </CardContent>
      </Card>

      {/* Soft Skills */}
      <Card>
        <CardHeader>
          <CardTitle>{t('softSkills')}</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {softFields.map((field, index) => (
            <div key={field.id} className='flex items-center gap-2'>
              <FormField
                control={control}
                name={`skills.soft.${index}`}
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormControl>
                      <Input
                        placeholder={t('softSkillPlaceholder')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {softFields.length > 1 && (
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  onClick={() => removeSoft(index)}
                >
                  <X className='h-4 w-4' />
                </Button>
              )}
            </div>
          ))}
          <Button
            type='button'
            variant='outline'
            size='sm'
            className='flex items-center gap-1'
            onClick={() => appendSoft('')}
          >
            <PlusCircle className='h-4 w-4' />
            {t('addSoftSkill')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Skills;
