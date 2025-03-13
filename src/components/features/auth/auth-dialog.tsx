'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

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

// Create a separate component for the parts that use useSearchParams
function AuthDialogContent() {
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

// Main component with Suspense boundary
export default function AuthDialog() {
  return (
    <Suspense
      fallback={
        <div className='space-x-4'>
          <Button disabled>Sign In</Button>
          <Button disabled variant='outline'>
            Register
          </Button>
        </div>
      }
    >
      <AuthDialogContent />
    </Suspense>
  );
}
