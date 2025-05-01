import { useTranslations } from 'next-intl';
import React from 'react';
import { useFieldArray } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { ResumeFormSectionProps } from '@/types/entities/cv.types';

const Education = ({ form }: ResumeFormSectionProps) => {
  const t = useTranslations('Resume.Education');
  const { control } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'education',
  });

  return (
    <div className='w-full space-y-6'>
      <h2 className='text-xl font-semibold'>{t('title')}</h2>

      {fields.map((field, index) => (
        <Card key={field.id} className='w-full'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-md'>
              {t('education')} #{index + 1}
            </CardTitle>
            {fields.length > 1 && (
              <Button
                type='button'
                variant='destructive'
                size='sm'
                onClick={() => remove(index)}
              >
                {t('remove')}
              </Button>
            )}
          </CardHeader>
          <CardContent className='space-y-4'>
            {/* Institution */}
            <FormField
              control={control}
              name={`education.${index}.institution`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('institution')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('institutionPlaceholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Degree */}
            <FormField
              control={control}
              name={`education.${index}.degree`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('degree')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('degreePlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Field of Study */}
            <FormField
              control={control}
              name={`education.${index}.field_of_study`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('fieldOfStudy')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('fieldOfStudyPlaceholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-4'>
              {/* Start Date */}
              <FormField
                control={control}
                name={`education.${index}.start_date`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('startDate')}</FormLabel>
                    <FormControl>
                      <Input type='date' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* End Date */}
              <FormField
                control={control}
                name={`education.${index}.end_date`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('endDate')}</FormLabel>
                    <FormControl>
                      <Input type='date' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* GPA */}
            <FormField
              control={control}
              name={`education.${index}.gpa`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('gpa')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('gpaPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      ))}

      <Button
        type='button'
        variant='outline'
        className='w-full'
        onClick={() =>
          append({
            institution: '',
            degree: '',
            field_of_study: '',
            start_date: '',
            end_date: '',
            gpa: '',
          })
        }
      >
        {t('addEducation')}
      </Button>
    </div>
  );
};

export default Education;
