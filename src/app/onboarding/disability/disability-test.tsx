'use client';
import {
  ArrowLeft,
  ArrowRight,
  AudioLines,
  EarIcon,
  EyeIcon,
  HandHeart,
  HandIcon,
} from 'lucide-react';
import React from 'react';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';

import api from '@/lib/axios';
import { getCookie } from '@/lib/cookies-action';

import AdaLogo from '@/components/ada-logo';
import { ChoiceGroup, ChoiceItem } from '@/components/chooice-group';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';

import { API_BASE_URL } from '@/constant/config';

import { ApiError, ApiReturn } from '@/types/api.types';

// Define types for our questions and answers
interface DisabilityType {
  id: string;
  label: string;
}

interface Answer {
  type: string;
  impairmentType: string;
  customImpairmentType?: string;
  description?: string;
}

type ImpairmentData = {
  [key: string]: Answer; // Kategori bisa apa saja, tidak terbatas pada hearing, visual, dll
};

// Available disability types
const disabilityTypes: DisabilityType[] = [
  { id: 'visual', label: 'Visual' },
  { id: 'hearing', label: 'Hearing' },
  { id: 'mute', label: 'Mute' },
  { id: 'motoric', label: 'Motoric' },
  { id: 'mental', label: 'Mental or Intellectual' },
];

const impairmentIcons = {
  visual: <EyeIcon />,
  hearing: <EarIcon />,
  mute: <AudioLines />,
  motoric: <HandIcon />,
  mental: <HandHeart />,
};

// Default impairment types for each disability
const impairmentOptions = {
  visual: ['Low Vision', 'Color Blindness', 'Blindness', 'Other'],
  hearing: ['Moderate Hearing Loss', 'Severe Hearing Loss', 'Deaf', 'Other'],
  mute: [
    'Moderate Speech Impairment',
    'Severe Speech Impairment',
    'Non-verbal',
    'Other',
  ],
  motoric: [
    'Limited Mobility',
    'Fine Motor Control Issues',
    'Coordination Issues',
    'Other',
  ],
  mental: ['Anxiety/Depression', 'ADHD/Autism', 'PTSD/OCD', 'Other'],
};

function transformData(
  jsonData: ImpairmentData
): { question: string; answer: string }[] {
  const result: { question: string; answer: string }[] = [];

  // Loop melalui semua kategori (hearing, visual, mute, dll)
  for (const category in jsonData) {
    if (Object.prototype.hasOwnProperty.call(jsonData, category)) {
      const details = jsonData[category];
      const type = details.type;
      const impairmentType = details.impairmentType;
      const customImpairmentType = details.customImpairmentType;
      const description = details.description;

      // Tentukan impairment type yang digunakan
      const specificImpairmentType =
        impairmentType === 'Other' ? customImpairmentType : impairmentType;

      // Tentukan kalimat yang akan dimasukkan dalam `answer`
      const answer = `i have ${type} disabilities, which more specifically is ${specificImpairmentType}. ${
        description ? 'more detail is ' + description : ''
      }`;

      // Tambahkan question dan answer ke array hasil
      result.push({
        question: `Tell me more detail about your ${type} disabilities`,
        answer: answer,
      });
    }
  }

  return result;
}

const DisabilityTest = ({ refetch }: { refetch: () => void }) => {
  // State for tracking selected disability types and step progress
  const [selectedDisabilities, setSelectedDisabilities] = React.useState<
    string[]
  >([]);

  const [currentDisabilityIndex, setCurrentDisabilityIndex] =
    React.useState<number>(-1);
  const [answers, setAnswers] = React.useState<Record<string, Answer>>({});
  const [customType, setCustomType] = React.useState<string>('');

  // Determine the current step (0 = initial selection, 1+ = disability forms)
  const currentStep =
    currentDisabilityIndex === -1 ? 0 : currentDisabilityIndex + 1;

  // Total steps (initial selection + one for each selected disability)
  const totalSteps = selectedDisabilities.length;

  // Current disability being processed
  const currentDisability =
    currentDisabilityIndex >= 0 &&
    currentDisabilityIndex < selectedDisabilities.length
      ? selectedDisabilities[currentDisabilityIndex]
      : '';

  // Handle selection of disability types (multiple selection)
  const handleDisabilitySelection = (value: string | string[]) => {
    // Ensure we're working with an array since this is multiple selection
    const selectedValues = Array.isArray(value) ? value : [value];
    setSelectedDisabilities(selectedValues);
  };

  // Handle impairment type selection
  const handleImpairmentSelection = (value: string | string[]) => {
    // Since we're using "single" mode, we can safely cast the value to string
    const selectedValue = typeof value === 'string' ? value : value[0] || '';

    setAnswers((prev) => ({
      ...prev,
      [currentDisability]: {
        ...(prev[currentDisability] || {}),
        type: currentDisability,
        impairmentType: selectedValue,
      },
    }));
  };

  // Handle custom impairment type input
  const handleCustomImpairmentChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCustomType(e.target.value);
    setAnswers((prev) => ({
      ...prev,
      [currentDisability]: {
        ...(prev[currentDisability] || {}),
        type: currentDisability,
        impairmentType: 'Other',
        customImpairmentType: e.target.value,
      },
    }));
  };

  // Handle description textarea input
  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [currentDisability]: {
        ...(prev[currentDisability] || {}),
        type: currentDisability,
        impairmentType: prev[currentDisability]?.impairmentType || '',
        description: e.target.value,
      },
    }));
  };

  // Get current values for the form
  const getCurrentImpairmentType = () => {
    return answers[currentDisability]?.impairmentType || '';
  };

  const getCurrentDescription = () => {
    return answers[currentDisability]?.description || '';
  };

  const { mutateAsync, isLoading } = useMutation<
    ApiReturn<null>,
    ApiError,
    {
      question: string;
      answer: string;
    }[]
  >(
    async (data) => {
      const email = await getCookie('ada4career-email');

      const dataToSend = {
        email: email?.value,
        answers: data,
      };

      const response = await api.post(
        `${API_BASE_URL}/questionnaire`,
        dataToSend
      );

      return response.data;
    },
    {
      onSuccess: (data) => {
        toast.success('Disability Questionnaire submitted successfully!');
        refetch();
      },
    }
  );

  const handleNext = async () => {
    try {
      if (currentStep === 0) {
        setCurrentDisabilityIndex(0);
      } else if (currentDisabilityIndex < selectedDisabilities.length - 1) {
        // Move to the next disability form
        setCurrentDisabilityIndex((prev) => prev + 1);
        setCustomType('');
      } else {
        // Completed all forms, submit

        const transformedDataPerDisability = transformData(answers);
        const structured = [
          {
            question: 'Do you have any disabilities?',
            answer: 'Yes',
          },
          {
            question: 'What type of disability do you have?',
            answer: selectedDisabilities.join(', '),
          },
          ...transformedDataPerDisability,
        ];
        await mutateAsync(structured);
      }
    } catch (error) {
      console.error('Error submitting disability questionnaire:', error);
    }
  };

  // Check if the current form is valid and the Next button can be enabled
  const isNextEnabled = () => {
    if (currentStep === 0) {
      return selectedDisabilities.length > 0;
    }

    const currentAnswer = answers[currentDisability];
    if (!currentAnswer?.impairmentType) return false;

    // If "Other" is selected, custom type must be provided
    if (
      currentAnswer.impairmentType === 'Other' &&
      !currentAnswer.customImpairmentType
    ) {
      return false;
    }

    return true;
  };

  const handlePrevious = () => {
    if (currentDisabilityIndex > 0) {
      // Move to the previous disability form
      setCurrentDisabilityIndex((prev) => prev - 1);
      // Reset custom type if applicable
      if (
        answers[selectedDisabilities[currentDisabilityIndex - 1]]
          ?.impairmentType === 'Other'
      ) {
        setCustomType(
          answers[selectedDisabilities[currentDisabilityIndex - 1]]
            ?.customImpairmentType || ''
        );
      } else {
        setCustomType('');
      }
    } else if (currentDisabilityIndex === 0) {
      // Go back to the initial disability selection screen
      setCurrentDisabilityIndex(-1);
    }
  };

  // Check if the previous button should be disabled
  const isPreviousEnabled = () => {
    return currentStep > 0;
  };

  return (
    <div className='h-screen w-screen flex items-center justify-center relative overflow-x-hidden flex-col'>
      <div className='w-[560px] h-[560px] rounded-full blur-3xl -translate-x-48 -translate-y-20 absolute opacity-50 bg-orange-200 top-0 left-0' />
      <div className='w-[560px] h-[560px] rounded-full blur-3xl translate-x-48 translate-y-20 absolute opacity-50 bg-orange-200 bottom-0 right-0' />
      <div className='max-w-6xl mx-auto rounded-md bg-white z-10 w-full text-center shadow-md'>
        <div className='max-w-4xl mx-auto items-center flex flex-col p-4'>
          <AdaLogo width={64} height={64} />
          <h1 className='mt-4 mb-2'>Disability Questionnaire</h1>
          <p>
            Please provide information about your needs to help us serve you
            better.
          </p>
          <div className='w-full text-orange-600 flex items-center mt-12 mb-6 gap-x-3'>
            <p className='font-medium'>
              {currentStep + 1}/{totalSteps + 1}
            </p>
            <Progress
              value={((currentStep + 1) / (totalSteps + 1)) * 100}
              className='h-2'
            />
            <p className='font-semibold text-start flex-grow flex-1'>
              Your Progress
            </p>
          </div>

          {/* Step 0: Initial Disability Selection */}
          {currentStep === 0 && (
            <div className='w-full mt-6'>
              <p className='font-bold mb-6'>
                Please select your disability type(s):{' '}
                <span className='text-red-500'>*</span>
              </p>
              <ChoiceGroup
                type='multiple'
                value={selectedDisabilities}
                onChange={handleDisabilitySelection}
                className='w-full mt-6'
                variant={currentStep === 0 ? 'square' : 'default'}
                orientation={currentStep === 0 ? 'horizontal' : 'vertical'}
              >
                {disabilityTypes.map((disability, index) => (
                  <ChoiceItem
                    key={disability.id}
                    icon={
                      currentStep === 0
                        ? impairmentIcons[
                            disability.id as keyof typeof impairmentIcons
                          ]
                        : undefined
                    }
                    value={disability.id}
                    label={disability.label}
                    index={String.fromCharCode(65 + index)}
                  />
                ))}
              </ChoiceGroup>
            </div>
          )}

          {/* Disability Specific Forms */}
          {currentStep > 0 && currentDisability && (
            <div className='w-full mt-6'>
              <p className='font-bold mb-4'>
                {disabilityTypes.find((d) => d.id === currentDisability)?.label}{' '}
                Details
                <span className='font-normal text-sm ml-2'>
                  (Step {currentStep} of {totalSteps})
                </span>
              </p>

              {/* Impairment Type Selection */}
              <div className='mb-6'>
                <p className='font-bold text-left mb-2'>
                  Please select your type of impairment:{' '}
                  <span className='text-red-500'>*</span>
                </p>
                <ChoiceGroup
                  type='single'
                  value={getCurrentImpairmentType()}
                  onChange={handleImpairmentSelection}
                  className='w-full'
                >
                  {impairmentOptions[
                    currentDisability as keyof typeof impairmentOptions
                  ].map((option, index) => (
                    <ChoiceItem
                      key={option}
                      value={option}
                      label={option}
                      index={String.fromCharCode(65 + index)}
                    />
                  ))}
                </ChoiceGroup>
              </div>

              {/* Custom Impairment Type Input */}
              {getCurrentImpairmentType() === 'Other' && (
                <div className='mb-6'>
                  <p className='font-bold text-left mb-2'>
                    Please specify your impairment type:{' '}
                    <span className='text-red-500'>*</span>
                  </p>
                  <Input
                    value={customType}
                    onChange={handleCustomImpairmentChange}
                    placeholder='Enter your specific impairment type'
                    className='w-full'
                  />
                </div>
              )}

              {/* Description Textarea */}
              <div className='mb-6'>
                <p className='font-bold text-left mb-2'>
                  Please provide any additional details (optional):
                </p>
                <Textarea
                  value={getCurrentDescription()}
                  onChange={handleDescriptionChange}
                  placeholder='Describe your condition and any specific needs or accommodations'
                  className='w-full min-h-24'
                />
              </div>
            </div>
          )}

          {/* Navigation Button */}
          <div className='w-full mt-8 justify-end gap-5 flex'>
            <Button
              variant='ghost'
              className='text-lg px-14 py-6'
              onClick={handlePrevious}
              disabled={!isPreviousEnabled() || isLoading}
            >
              <ArrowLeft />
              Previous
            </Button>

            <Button
              className='text-lg px-14 bg-blue-600 py-6'
              onClick={handleNext}
              disabled={!isNextEnabled() || isLoading}
            >
              {currentStep === totalSteps - 1 ? 'Submit' : 'Next'}{' '}
              <ArrowRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisabilityTest;
