import { useQueryState } from 'nuqs';
import React, { useEffect } from 'react';

import AdaLogo from '@/components/ada-logo';
import KeyHandler from '@/components/key-handler';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const JobseekerOnboardStart = () => {
  const [_, setMode] = useQueryState('mode');

  // Handle button click
  const handleCreateClick = () => {
    setMode('create');
  };

  const handleUploadClick = () => {
    setMode('upload');
  };

  // Handle keyboard input
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key.toLowerCase() === 's') {
      setMode('create');
    } else if (e.key.toLowerCase() === 'u') {
      setMode('upload');
    }
  };

  useEffect(() => {
    // Add event listener for keyboard events
    document.addEventListener('keydown', handleKeyDown);

    // Clean up the event listener when component unmounts
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className='h-screen flex flex-col justify-center items-center'>
      <Card className='max-w-3xl w-full mx-auto my-8'>
        <CardHeader className='flex text-center flex-col items-center space-y-2'>
          <AdaLogo />
          <h5 className='text-2xl font-semibold'>
            Do you have a{' '}
            <span className='text-gradient-ms'>Curriculum Vitae</span> (CV)?
          </h5>
          <p className='text-lg'>If not, we'll help you create one. </p>
        </CardHeader>
        <CardContent className='flex flex-col space-y-4'>
          <div className='space-y-1'>
            <h6>Create CV</h6>
            <Button
              className='w-full text-base p-8'
              size='lg'
              onClick={handleCreateClick}
            >
              <KeyHandler label='S' />
              Start from Scratch
            </Button>
          </div>
          <div className='space-y-1'>
            <h6>Upload CV</h6>
            <Button
              className='w-full text-base p-8'
              size='lg'
              onClick={handleUploadClick}
            >
              <KeyHandler label='U' />
              Use your existing file
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobseekerOnboardStart;
