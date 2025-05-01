import { Send } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

import aidaLogo from '~/images/aida-logo.png';

const AidaChatOnboard = () => {
  const messages = [
    { id: 1, sender: 'AIDA', text: 'Hello! How can I assist you today?' },
    { id: 2, sender: 'User', text: 'Can you help me with my project?' },
    { id: 3, sender: 'AIDA', text: 'Of course! What do you need help with?' },
  ];

  return (
    <div className='bg-white p-4 rounded shadow z-auto'>
      <div className='flex items-center gap-2'>
        <Image src={aidaLogo} alt='Aida Logo' width={48} height={48} />
        <div>
          <h5 className='text-gradient-ms font-semibold text-xl'>AIDA</h5>
          <p>Your AI Copilot</p>
        </div>
      </div>
      <Separator className='my-4' />
      <ScrollArea className='h-96'>
        <div className='flex flex-col gap-4 pb-4'>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`py-2 px-3 rounded ${
                message.sender === 'AIDA'
                  ? 'bg-blue-100 self-start'
                  : 'bg-gray-200 self-end'
              }`}
            >
              {message.text}
            </div>
          ))}
        </div>
      </ScrollArea>
      <Separator className='my-4' />
      <div className='flex items-center gap-2'>
        <Input placeholder='Type a message...' />
        <Button size='icon'>
          <Send />
        </Button>
      </div>
    </div>
  );
};

export default AidaChatOnboard;
