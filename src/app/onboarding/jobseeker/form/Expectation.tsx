import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

import type { JobSeekerSectionProps } from '@/app/onboarding/form.types';

const Expectation = ({ form }: JobSeekerSectionProps) => {
  // Common skill suggestions

  return (
    <>
      <FormField
        control={form.control}
        name='expectation.expectation'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Expectation (optional)</FormLabel>
            <FormControl>
              <Textarea placeholder='Tell us your expecations' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default Expectation;
