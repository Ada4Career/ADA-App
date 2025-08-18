'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { useRouter } from '@/i18n/navigation';

import { MetaMaskConnect } from '@/components/web3/WalletConnect';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Create a separate component for the parts that use useSearchParams
function AuthDialogContent() {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Check URL parameters for auth type
    const authParam = searchParams.get('auth');
    if (authParam === 'login' || authParam === 'register') {
      setOpen(true);
    }
  }, [searchParams]);

  const openDialog = () => {
    setOpen(true);
  };

  const handleWalletSuccess = (_address: string) => {
    // Demo: wallet connection successful
    setOpen(false);
    
    // Redirect to buy tokens page after successful wallet connection
    router.push('/app/home/buy-tokens');
  };

  return (
    <>
      <div className='space-x-4'>
        <Button onClick={openDialog}>Connect Wallet</Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Connect to ADA Platform</DialogTitle>
            <DialogDescription>
              Connect your MetaMask wallet to access the ADA accessible career platform.
            </DialogDescription>
          </DialogHeader>
          
          <div className='py-4'>
            <MetaMaskConnect 
              onSuccess={handleWalletSuccess}
              variant="default"
              className="w-full h-12"
            />
          </div>
          
          <div className="text-xs text-gray-500 text-center">
            <p>
              By connecting your wallet, you agree to our Terms of Service and
              Privacy Policy.
            </p>
          </div>
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
          <Button disabled>Connect Wallet</Button>
        </div>
      }
    >
      <AuthDialogContent />
    </Suspense>
  );
}
