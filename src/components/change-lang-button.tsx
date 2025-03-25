'use client';
import { Globe } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { usePathname, useRouter } from '@/i18n/navigation';

const ChangeLangButton = () => {
  const [language, setLanguage] = React.useState('en');
  const pathname = usePathname();
  const router = useRouter();

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    router.replace(pathname, { locale: newLanguage });
  };

  const t = useTranslations('SwitchLanguage');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='sm' className='flex items-center gap-2'>
          <Globe size={16} />
          {t('switchLanguage')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem
          onClick={() => handleLanguageChange('en')}
          className={language === 'en' ? 'bg-slate-100 font-medium' : ''}
        >
          {t('english')}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleLanguageChange('id')}
          className={language === 'id' ? 'bg-slate-100 font-medium' : ''}
        >
          {t('indonesian')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ChangeLangButton;
