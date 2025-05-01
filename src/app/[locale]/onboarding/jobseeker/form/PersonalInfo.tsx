import { useTranslations } from 'next-intl';
import React from 'react';

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

const PersonalInfo = ({ form }: ResumeFormSectionProps) => {
  const t = useTranslations('Resume.PersonalInfo');

  return (
    <div className='w-full space-y-4'>
      <h2 className='text-xl font-semibold'>{t('title')}</h2>

      {/* Full Name */}
      <FormField
        control={form.control}
        name='personal_info.full_name'
        render={({ field }) => (
          <FormItem className='w-full'>
            <FormLabel>{t('fullName')}</FormLabel>
            <FormControl>
              <Input placeholder={t('fullNamePlaceholder')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Email */}
      <FormField
        control={form.control}
        name='personal_info.contact_info.email'
        render={({ field }) => (
          <FormItem className='w-full'>
            <FormLabel>{t('email')}</FormLabel>
            <FormControl>
              <Input
                type='email'
                placeholder={t('emailPlaceholder')}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Phone */}
      <FormField
        control={form.control}
        name='personal_info.contact_info.phone'
        render={({ field }) => (
          <FormItem className='w-full'>
            <FormLabel>{t('phone')}</FormLabel>
            <FormControl>
              <Input placeholder={t('phonePlaceholder')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Address */}
      <FormField
        control={form.control}
        name='personal_info.contact_info.address'
        render={({ field }) => (
          <FormItem className='w-full'>
            <FormLabel>{t('address')}</FormLabel>
            <FormControl>
              <Input placeholder={t('addressPlaceholder')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* LinkedIn */}
      <FormField
        control={form.control}
        name='personal_info.contact_info.linkedin'
        render={({ field }) => (
          <FormItem className='w-full'>
            <FormLabel>{t('linkedin')}</FormLabel>
            <FormControl>
              <Input placeholder={t('linkedinPlaceholder')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Summary/Objective */}
      <FormField
        control={form.control}
        name='personal_info.summary_objective'
        render={({ field }) => (
          <FormItem className='w-full'>
            <FormLabel>{t('summary')}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={t('summaryPlaceholder')}
                className='min-h-32'
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PersonalInfo;
