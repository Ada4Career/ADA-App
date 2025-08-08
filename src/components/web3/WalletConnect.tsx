'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { LogOut, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { truncateAddress } from '@/lib/utils';

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
  const t = useTranslations('WalletConnect');
  const [isOpen, setIsOpen] = useState(false);
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  // Find MetaMask connector
  const metaMaskConnector = connectors.find(
    (connector) => 
      connector.name.toLowerCase().includes('metamask') || 
      connector.id === 'io.metamask'
  );

  const handleConnect = async () => {
    if (!metaMaskConnector) {
      // If MetaMask not found, try to use injected provider
      const injectedConnector = connectors.find(connector => connector.type === 'injected');
      if (!injectedConnector) {
        alert('Please install MetaMask to continue');
        return;
      }
    }
    
    try {
      const connectorToUse = metaMaskConnector || connectors[0];
      const result = await connect({ connector: connectorToUse });
      if (result && onSuccess) {
        onSuccess(result.accounts[0]);
      }
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to connect MetaMask:', error);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setIsOpen(false);
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
          {t('disconnect')}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            window.open(`https://blockscout.lisk.com/address/${address}`)
          }
          title={t('viewOnExplorer')}
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  if (!metaMaskConnector && connectors.length === 0) {
    return (
      <Button 
        variant={variant} 
        className={className}
        onClick={() => window.open('https://metamask.io/download/', '_blank')}
      >
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Install MetaMask
      </Button>
    );
  }

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
      {isPending ? t('connecting') : 'Connect MetaMask'}
    </Button>
  );
}