'use client';
import { SendIcon } from 'lucide-react';
import React from 'react';

import { useChatConversation } from '@/hooks/use-conversation';

import AdaLogo from '@/components/ada-logo';
import { MemoizedMarkdown } from '@/components/features/job-seeker/memoized-markdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

import useAuthStore from '@/store/useAuthStore';

const AidaChatPage = () => {
  const { user } = useAuthStore();
  const {
    conversationId,
    // startConversation,
    sendMessage,
    messages,
    // selectConversation,
    isLoading,
    error,
  } = useChatConversation(user?.email ?? '');

  // State for the message input
  const [inputMessage, setInputMessage] = React.useState('');

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    sendMessage(inputMessage);
    setInputMessage('');
  };

  return (
    <div className='flex flex-col h-full '>
      <ScrollArea className='flex-1 h-full pb-8'>
        <div>
          {messages.map((message, index) => (
            <div key={index} className='flex items-end gap-1'>
              {!message.is_user ? (
                <div className=''>
                  <AdaLogo />
                </div>
              ) : null}
              <div
                className={`p-4 rounded-lg prose space-y-2 mb-2 ${
                  message.is_user
                    ? 'bg-blue-500 text-white ml-auto'
                    : 'bg-gray-100 text-black'
                }`}
              >
                <MemoizedMarkdown content={message.content} id={message.id} />
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className='h-14 p-2 w-full rounded-lg border-2 flex gap-2 group focus-within:border-blue-500'>
        <Input
          className='h-full !border-none focus-visible:ring-0 !focus:outline-none !focus:border-none !outline-none shadow-none'
          placeholder='Ask something...'
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <Button className='h-full' onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send'}
          <SendIcon />
        </Button>
      </div>
    </div>
  );
};

export default AidaChatPage;
