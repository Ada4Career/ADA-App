'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { LoginForm } from './login-form';
import { RegisterForm } from './register-form';

export default function AuthDialog() {
  const [open, setOpen] = useState(false);
  const [activeForm, setActiveForm] = useState<'login' | 'register'>('login');
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check URL parameters for auth type
    const authParam = searchParams.get('auth');
    if (authParam === 'login' || authParam === 'register') {
      setActiveForm(authParam);
      setOpen(true);
    }
  }, [searchParams]);

  const openDialog = (form: 'login' | 'register') => {
    setActiveForm(form);
    setOpen(true);
  };

  const toggleForm = () => {
    setActiveForm(activeForm === 'login' ? 'register' : 'login');
  };

  return (
    <>
      <div className='space-x-4'>
        <Button onClick={() => openDialog('login')}>Sign In</Button>
        <Button onClick={() => openDialog('register')} variant='outline'>
          Register
        </Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>
              {activeForm === 'login' ? 'Sign In' : 'Create Account'}
            </DialogTitle>
            <DialogDescription>
              {activeForm === 'login'
                ? 'Sign in to your account to access your dashboard.'
                : 'Create a new account to get started.'}
            </DialogDescription>
          </DialogHeader>

          {activeForm === 'login' ? (
            <LoginForm onRegisterClick={toggleForm} />
          ) : (
            <RegisterForm onLoginClick={toggleForm} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
