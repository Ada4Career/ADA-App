import Link from 'next/link';
import React from 'react';

import { Separator } from '@/components/ui/separator';

const FOOTER_ITEMS = [
  {
    label: 'About Us',
    url: '/',
  },
  {
    label: 'Contact',
    url: '/',
  },
  {
    label: 'Privacy Policy',
    url: '/',
  },
  {
    label: 'Sitemap',
    url: '/',
  },
  {
    label: 'Terms of Use',
    url: '/',
  },
];

const Footer = () => {
  return (
    <footer className='py-28 px-36'>
      <div className='text-gray-700'>
        <Separator />
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-10 mt-6'>
            {FOOTER_ITEMS.map((f) => (
              <Link key={f.label} href={f.url}>
                {f.label}
              </Link>
            ))}
          </div>
          <p>© 2024-2025, All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
