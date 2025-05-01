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
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { ResumeFormSectionProps } from '@/types/entities/cv.types';

const Experience = ({ form }: ResumeFormSectionProps) => {
  const t = useTranslations('Resume.Experience');
  const { control } = form;

  // Main experience field array
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experience',
  });

  // Function to handle adding a responsibility to a specific experience
  const handleAddResponsibility = (experienceIndex: number) => {
    const currentResponsibilities =
      form.getValues(`experience.${experienceIndex}.responsibilities`) || [];
    form.setValue(`experience.${experienceIndex}.responsibilities`, [
      ...currentResponsibilities,
      '',
    ]);
  };

  // Function to handle removing a responsibility
  const handleRemoveResponsibility = (
    experienceIndex: number,
    responsibilityIndex: number
  ) => {
    const currentResponsibilities =
      form.getValues(`experience.${experienceIndex}.responsibilities`) || [];
    const updatedResponsibilities = currentResponsibilities.filter(
      (_, i) => i !== responsibilityIndex
    );
    form.setValue(
      `experience.${experienceIndex}.responsibilities`,
      updatedResponsibilities
    );
  };

  return (
    <div className='w-full space-y-6'>
      <h2 className='text-xl font-semibold'>{t('title')}</h2>

      {fields.map((field, index) => {
        // Need to get responsibilities for this experience
        const watchedResponsibilities = form.watch(
          `experience.${index}.responsibilities`
        ) || [''];

        return (
          <Card key={field.id} className='w-full'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-md'>
                {t('experience')} #{index + 1}
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
              {/* Job Title */}
              <FormField
                control={control}
                name={`experience.${index}.title`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('title')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('titlePlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Company */}
              <FormField
                control={control}
                name={`experience.${index}.company`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('company')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('companyPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-2 gap-4'>
                {/* Start Date */}
                <FormField
                  control={control}
                  name={`experience.${index}.start_date`}
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
                  name={`experience.${index}.end_date`}
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

              {/* Responsibilities */}
              <div className='space-y-3'>
                <FormLabel>{t('responsibilities')}</FormLabel>
                {watchedResponsibilities.map((_, respIndex) => (
                  <div
                    key={`${field.id}-resp-${respIndex}`}
                    className='flex gap-2'
                  >
                    <FormField
                      control={control}
                      name={`experience.${index}.responsibilities.${respIndex}`}
                      render={({ field }) => (
                        <FormItem className='flex-1'>
                          <FormControl>
                            <Textarea
                              placeholder={t('responsibilityPlaceholder')}
                              className='resize-none'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {watchedResponsibilities.length > 1 && (
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        onClick={() =>
                          handleRemoveResponsibility(index, respIndex)
                        }
                        className='self-start mt-1'
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
                  onClick={() => handleAddResponsibility(index)}
                >
                  <PlusCircle className='h-4 w-4' />
                  {t('addResponsibility')}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}

      <Button
        type='button'
        variant='outline'
        className='w-full'
        onClick={() =>
          append({
            title: '',
            company: '',
            start_date: '',
            end_date: '',
            responsibilities: [''],
          })
        }
      >
        {t('addExperience')}
      </Button>
    </div>
  );
};

export default Experience;
