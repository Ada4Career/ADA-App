import ChipInput from '@/components/chip-input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

import type { JobSeekerSectionProps } from '@/app/onboarding/form.types';

const SkillExperience = ({ form }: JobSeekerSectionProps) => {
  // Common skill suggestions
  const skillSuggestions = [
    'Frontend',
    'Backend',
    'Fullstack',
    'Mobile',
    'DevOps',
    'Rust',
    'TypeScript',
    'IoT',
    'Cloud Computing',
    'UI/UX',
    'HTML',
    'Kotlin',
    'Flutter',
    'Swift',
    'Data Science',
  ];

  return (
    <>
      <FormField
        control={form.control}
        name='skillExperience.skill'
        render={({ field }) => (
          <FormItem className='w-full items-start flex flex-col'>
            <FormLabel>Skills *</FormLabel>
            <FormControl>
              <ChipInput
                value={field.value || []}
                onChange={field.onChange}
                placeholder='Type a skill and press Enter'
                suggestions={skillSuggestions}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name='skillExperience.experience'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Experience *</FormLabel>
            <FormControl>
              <Textarea placeholder='Your experiences...' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default SkillExperience;
