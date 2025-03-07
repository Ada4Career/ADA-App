'use client';

import type React from 'react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RegisterFormProps {
  onLoginClick: () => void;
}

export function RegisterForm({ onLoginClick }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
    // Handle registration logic here
    console.log('Registration submitted');
  };

  return (
    <div className='space-y-4 py-2 pb-4'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='name'>Full Name</Label>
          <Input id='name' placeholder='John Doe' required />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='email'>Email</Label>
          <Input id='email' type='email' placeholder='m@example.com' required />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='password'>Password</Label>
          <Input id='password' type='password' required />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='confirm-password'>Confirm Password</Label>
          <Input id='confirm-password' type='password' required />
        </div>
        <div className='flex items-center space-x-2'>
          <Checkbox id='terms' required />
          <Label htmlFor='terms' className='text-sm font-normal'>
            I agree to the{' '}
            <Button
              variant='link'
              className='h-auto p-0 text-sm font-normal'
              type='button'
            >
              Terms of Service
            </Button>{' '}
            and{' '}
            <Button
              variant='link'
              className='h-auto p-0 text-sm font-normal'
              type='button'
            >
              Privacy Policy
            </Button>
          </Label>
        </div>
        <Button type='submit' className='w-full' disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>
      <div className='mt-4 text-center'>
        <p className='text-sm text-muted-foreground mb-2'>
          Already have an account?
        </p>
        <Button
          type='button'
          variant='outline'
          onClick={onLoginClick}
          className='w-full'
        >
          Sign In
        </Button>
      </div>
    </div>
  );
}
