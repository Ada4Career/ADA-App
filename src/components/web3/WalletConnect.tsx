'use client';

import React, { useState } from 'react';
import { LogOut, ExternalLink } from 'lucide-react';

import { Button } from '@/components/ui/button';
// Dialog components removed for dummy implementation

// Dummy truncate address function for demo
function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

interface MetaMaskConnectProps {
  onSuccess?: (address: string) => void;
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
}

export function MetaMaskConnect({
  onSuccess,
  variant = 'default',
  className,
}: MetaMaskConnectProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string>('');
  const [isPending, setIsPending] = useState(false);

  // Check for existing connection on component mount
  React.useEffect(() => {
    const checkConnection = () => {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('ada4career-token='))
        ?.split('=')[1];
      
      if (token === 'demo-token') {
        setIsConnected(true);
        setAddress('0x1234567890123456789012345678901234567890');
      }
    };
    
    checkConnection();
  }, []);

  // Dummy wallet connection for demo purposes
  const handleConnect = async () => {
    setIsPending(true);
    
    try {
      // Simulate wallet connection delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a dummy wallet address
      const dummyAddress = '0x1234567890123456789012345678901234567890';
      setAddress(dummyAddress);
      setIsConnected(true);
      
      // Set dummy authentication cookie for demo
      document.cookie = 'ada4career-token=demo-token; path=/; max-age=3600';
      document.cookie = 'ada4career-email=demo@example.com; path=/; max-age=3600';
      
      if (onSuccess) {
        onSuccess(dummyAddress);
      }
    } catch (error) {
      // Error handling for demo
      console.error('Demo wallet connection error:', error);
    } finally {
      setIsPending(false);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setAddress('');
    
    // Clear demo authentication cookies
    document.cookie = 'ada4career-token=; path=/; max-age=0';
    document.cookie = 'ada4career-email=; path=/; max-age=0';
  };

  if (isConnected && address) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-sm text-gray-600">
          {truncateAddress(address)}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDisconnect}
          className="flex items-center gap-1"
        >
          <LogOut className="h-4 w-4" />
          Disconnect
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            window.open(`https://etherscan.io/address/${address}`)
          }
          title="View on Explorer"
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  // For demo purposes, always show the connect button

  return (
    <Button 
      variant={variant} 
      className={className}
      onClick={handleConnect}
      disabled={isPending}
    >
      <svg className="mr-2 h-4 w-4" viewBox="0 0 318.6 318.6" fill="currentColor">
        <path d="M274.1 35.5l-99.5 73.9L193 65.8z" fill="#E2761B"/>
        <path d="M44.4 35.5l98.7 74.6-17.5-44.3z" fill="#E4761B"/>
        <path d="M238.3 180.5l-26.5 40.6 56.7 15.6 16.3-55.3z" fill="#E4761B"/>
        <path d="M33.9 181.4l16.2 55.3 56.7-15.6-26.5-40.6z" fill="#E4761B"/>
        <path d="M103.6 138.2l-15.8 23.9 56.3 2.5-1.9-60.6z" fill="#E4761B"/>
        <path d="M214.9 138.2l-39-34.8-1.3 61.2 56.2-2.5z" fill="#E4761B"/>
        <path d="M106.8 221.1l33.8-16.5-29.2-22.8z" fill="#E4761B"/>
        <path d="M177.9 204.6l33.8 16.5-4.7-39.3z" fill="#E4761B"/>
      </svg>
      {isPending ? 'Connecting...' : 'Connect MetaMask'}
    </Button>
  );
}