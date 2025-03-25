'use client';
import { useMutation } from '@tanstack/react-query';
import {
  ArrowLeft,
  ArrowRight,
  AudioLines,
  EarIcon,
  EyeIcon,
  HandHeart,
  HandIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';
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

const impairmentIcons = {
  visual: <EyeIcon />,
  hearing: <EarIcon />,
  mute: <AudioLines />,
  motoric: <HandIcon />,
  mental: <HandHeart />,
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
  const t = useTranslations('Onboarding.Disability');
  const tImpairments = useTranslations('Onboarding.Disability.Impairments');

  const disabilityTypes: DisabilityType[] = [
    { id: 'visual', label: t('visual') },
    { id: 'hearing', label: t('hearing') },
    { id: 'mute', label: t('mute') },
    { id: 'motoric', label: t('motoric') },
    { id: 'mental', label: t('mental') },
  ];

  // Default impairment types for each disability
  const impairmentOptions = {
    visual: [
      tImpairments('visual.lowVision'),
      tImpairments('visual.colorBlindness'),
      tImpairments('visual.blindness'),
      tImpairments('visual.other'),
    ],
    hearing: [
      tImpairments('hearing.moderateHearingLoss'),
      tImpairments('hearing.severeHearingLoss'),
      tImpairments('hearing.deaf'),
      tImpairments('hearing.other'),
    ],
    mute: [
      tImpairments('mute.moderateSpeechImpairment'),
      tImpairments('mute.severeSpeechImpairment'),
      tImpairments('mute.nonVerbal'),
      tImpairments('mute.other'),
    ],
    motoric: [
      tImpairments('motoric.limitedMobility'),
      tImpairments('motoric.fineMotorControlIssues'),
      tImpairments('motoric.coordinationIssues'),
      tImpairments('motoric.other'),
    ],
    mental: [
      tImpairments('mental.anxietyDepression'),
      tImpairments('mental.adhdAutism'),
      tImpairments('mental.ptsdOcd'),
      tImpairments('mental.other'),
    ],
  };
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

  const { mutateAsync, isPending } = useMutation<
    ApiReturn<null>,
    ApiError,
    {
      question: string;
      answer: string;
    }[]
  >({
    mutationFn: async (data) => {
      const email = await getCookie('ada4career-email');

      const dataToSend = {
        email: email?.value,
        answers: data,
      };

      console.log(dataToSend, 'ini dikirim');

      const response = await api.post(
        `${API_BASE_URL}/questionnaire`,
        dataToSend
      );

      return response.data;
    },
    onSuccess: (data) => {
      toast.success('Disability Questionnaire submitted successfully!');
      refetch();
    },
  });

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
            question: t('haveDisability'),
            answer: 'Yes',
          },
          {
            question: t('whatType'),
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
    // console.log('f1');
    if (!currentAnswer?.impairmentType) {
      console.log('f1');
      return false;
    }

    // If "Other" is selected, custom type must be provided
    if (
      currentAnswer.impairmentType === 'Other' &&
      !currentAnswer.customImpairmentType
    ) {
      console.log(currentAnswer);
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
          <h1 className='mt-4 mb-2'>{t('title')}</h1>
          <p>{t('desc')}</p>
          <div className='w-full text-orange-600 flex items-center mt-12 mb-6 gap-x-3'>
            <p className='font-medium'>
              {currentStep + 1}/{totalSteps + 1}
            </p>
            <Progress
              value={((currentStep + 1) / (totalSteps + 1)) * 100}
              className='h-2'
            />
            <p className='font-semibold text-start flex-grow flex-1'>
              {t('yourProgress')}
            </p>
          </div>

          {/* Step 0: Initial Disability Selection */}
          {currentStep === 0 && (
            <div className='w-full mt-6'>
              <p className='font-bold mb-6'>
                {t('selectType')} <span className='text-red-500'>*</span>
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
                {t('details')}
                <span className='font-normal text-sm ml-2'>
                  ({t('step', { currentStep, totalStep: totalSteps })})
                </span>
              </p>

              {/* Impairment Type Selection */}
              <div className='mb-6'>
                <p className='font-bold text-left mb-2'>
                  {t('selectImpairment')}{' '}
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
                    {t('specifyImpairment')}{' '}
                    <span className='text-red-500'>*</span>
                  </p>
                  <Input
                    value={customType}
                    onChange={handleCustomImpairmentChange}
                    placeholder={t('impairmentPlaceholder')}
                    className='w-full'
                  />
                </div>
              )}

              {/* Description Textarea */}
              <div className='mb-6'>
                <p className='font-bold text-left mb-2'>
                  {t('additionalDetails')}
                </p>
                <Textarea
                  value={getCurrentDescription()}
                  onChange={handleDescriptionChange}
                  placeholder={t('detailsPlaceholder')}
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
              disabled={!isPreviousEnabled() || isPending}
            >
              <ArrowLeft />
              {t('previous')}
            </Button>

            <Button
              className='text-lg px-14 bg-blue-600 py-6'
              onClick={handleNext}
              disabled={!isNextEnabled() || isPending}
            >
              {currentStep === totalSteps - 1 ? t('submit') : t('next')}{' '}
              <ArrowRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisabilityTest;
