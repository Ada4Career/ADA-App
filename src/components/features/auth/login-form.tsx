'use client';

import type React from 'react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginFormProps {
  onRegisterClick: () => void;
}

export function LoginForm({ onRegisterClick }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
    // Handle login logic here
    console.log('Login submitted');
  };

  return (
    <div className='space-y-4 py-2 pb-4'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='email'>Email</Label>
          <Input id='email' type='email' placeholder='m@example.com' required />
        </div>
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <Label htmlFor='password'>Password</Label>
            <Button variant='link' className='px-0 font-normal' type='button'>
              Forgot password?
            </Button>
          </div>
          <Input id='password' type='password' required />
        </div>
        <div className='flex items-center space-x-2'>
          <Checkbox id='remember' />
          <Label htmlFor='remember' className='text-sm font-normal'>
            Remember me
          </Label>
        </div>
        <Button type='submit' className='w-full' disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>

        <div className='mt-4 text-center'>
          <p className='text-sm text-muted-foreground mb-2'>
            Don't have an account?
          </p>
          <Button
            type='button'
            variant='outline'
            onClick={onRegisterClick}
            className='w-full'
          >
            Create Account
          </Button>
        </div>
      </form>
    </div>
  );
}
