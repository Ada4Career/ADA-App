import { useTranslations } from 'next-intl'; // Import useTranslations

import { Button } from '@/components/ui/button';

export function AccessibilityFooter() {
  const t = useTranslations('Accessibility.widget'); // Add translation hook

  return (
    <div className='mt-8 text-center'>
      <Button
        variant='link'
        className='text-xs text-blue-600 hover:text-blue-800'
      >
        {t('readGuidelines')}
      </Button>
    </div>
  );
}
