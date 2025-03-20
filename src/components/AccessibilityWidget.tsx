'use client';
import { PersonStanding, RefreshCcw } from 'lucide-react';
import { useTranslations } from 'next-intl'; // Import useTranslations
import React from 'react';

import AccessibilityWelcomeModal from '@/components/accessibility-welcome-modal';
import { AccessibilityFooter } from '@/components/accessiblity-widget/AccessibilityFooter';
import { AccessibilityHeader } from '@/components/accessiblity-widget/AccessibilityHeader';
import { ColorAdjustments } from '@/components/accessiblity-widget/ColorAdjustment';
import { ContentAdjustments } from '@/components/accessiblity-widget/ContentAdjustment';
import { OrientationAdjustments } from '@/components/accessiblity-widget/OrientationAdjustment';
import { ProfileSettings } from '@/components/accessiblity-widget/ProfileSettings';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { useAccessibilityStore } from '@/store/useAccessibilityStore';

export type AccessibilitySettings = {
  profiles: {
    seizeSafe: boolean;
    visionImpaired: boolean;
    adhd: boolean;
    cognitiveDisability: boolean;
  };
  orientation: {
    muteSounds: boolean;
    hideImages: boolean;
    readMode: boolean;
    readingGuide: boolean;
    readingMask: boolean;
    highlightHover: boolean;
    highlightFocus: boolean;
    cursor: 'default' | 'black' | 'white';
    stopAnimations: boolean;
  };
  colors: {
    contrast: 'default' | 'dark' | 'light' | 'high';
    saturation: 'default' | 'high' | 'low';
    monochrome: boolean;
    textColor: string;
    titleColor: string;
    backgroundColor: string;
  };
  content: {
    contentScaling: 'default' | 'large' | 'larger';
    readableFont: boolean;
    highlightTitles: boolean;
    highlightLinks: boolean;
    highlightHover: boolean;
    fontSize: 'default' | 'large' | 'larger';
    lineHeight: 'default' | 'large' | 'larger';
    letterSpacing: 'default' | 'large' | 'larger';
    alignment: 'left' | 'center' | 'right' | 'justify' | 'default';
  };
};

// Profile presets moved outside component for reusability
export const profilePresets: Record<string, Partial<AccessibilitySettings>> = {
  seizeSafe: {
    orientation: {
      muteSounds: false,
      hideImages: true,
      readMode: true,
      readingGuide: true,
      readingMask: false,
      highlightHover: false,
      highlightFocus: true,
      cursor: 'default',
      stopAnimations: false,
    },
    colors: {
      contrast: 'default',
      saturation: 'default',
      monochrome: false,
      textColor: '#000000',
      titleColor: '#000000',
      backgroundColor: '#FFFFFF',
    },
    content: {
      contentScaling: 'large',
      readableFont: true,
      highlightTitles: true,
      highlightLinks: false,
      highlightHover: false,
      fontSize: 'large',
      lineHeight: 'large',
      letterSpacing: 'large',
      alignment: 'left',
    },
  },
  visionImpaired: {
    orientation: {
      muteSounds: false,
      hideImages: false,
      readMode: true,
      readingGuide: false,
      readingMask: false,
      highlightHover: false,
      highlightFocus: true,
      cursor: 'black',
      stopAnimations: false,
    },
    colors: {
      contrast: 'high',
      saturation: 'high',
      monochrome: false,
      textColor: '#000000',
      titleColor: '#000000',
      backgroundColor: '#FFFFFF',
    },
    content: {
      contentScaling: 'larger',
      readableFont: true,
      highlightTitles: true,
      highlightLinks: true,
      highlightHover: false,
      fontSize: 'larger',
      lineHeight: 'larger',
      letterSpacing: 'larger',
      alignment: 'left',
    },
  },
  adhd: {
    orientation: {
      muteSounds: false,
      hideImages: false,
      readMode: false,
      readingGuide: true,
      readingMask: true,
      highlightHover: false,
      highlightFocus: false,
      cursor: 'default',
      stopAnimations: true,
    },
    colors: {
      contrast: 'default',
      saturation: 'default',
      monochrome: false,
      textColor: '#8B5CF6',
      titleColor: '#8B5CF6',
      backgroundColor: '#FFFFFF',
    },
    content: {
      contentScaling: 'default',
      readableFont: true,
      highlightTitles: true,
      highlightLinks: true,
      highlightHover: false,
      fontSize: 'default',
      lineHeight: 'large',
      letterSpacing: 'default',
      alignment: 'left',
    },
  },
  cognitiveDisability: {
    orientation: {
      muteSounds: false,
      hideImages: false,
      readMode: true,
      readingGuide: true,
      readingMask: true,
      highlightHover: false,
      highlightFocus: false,
      cursor: 'default',
      stopAnimations: true,
    },
    colors: {
      contrast: 'default',
      saturation: 'default',
      monochrome: false,
      textColor: '#000000',
      titleColor: '#000000',
      backgroundColor: '#FFFFFF',
    },
    content: {
      contentScaling: 'default',
      readableFont: true,
      highlightTitles: true,
      highlightLinks: true,
      highlightHover: false,
      fontSize: 'default',
      lineHeight: 'large',
      letterSpacing: 'large',
      alignment: 'left',
    },
  },
};

const AccessibilityWidget = () => {
  const t = useTranslations('Accessibility.widget'); // Add translation hook

  const { settings, updateSettings, resetSettings } = useAccessibilityStore();

  // Function to handle profile changes
  const handleProfileChange = (
    profileName: keyof typeof profilePresets,
    isActive: boolean
  ) => {
    // Update the profile toggle
    updateSettings('profiles', profileName, isActive);

    if (isActive) {
      // If the profile is being activated, apply all its preset settings
      const preset = profilePresets[profileName];

      Object.entries(preset).forEach(([category, values]) => {
        if (category !== 'profiles') {
          Object.entries(values as Record<string, any>).forEach(
            ([subcategory, value]) => {
              updateSettings(
                category as keyof Omit<AccessibilitySettings, 'profiles'>,
                subcategory,
                value
              );
            }
          );
        }
      });
    } else {
      // If the profile is being deactivated, reset all settings to default
      Object.entries(profilePresets[profileName]).forEach(
        ([category, values]) => {
          if (category !== 'profiles') {
            Object.entries(values as Record<string, any>).forEach(
              ([subcategory, _]) => {
                updateSettings(
                  category as keyof Omit<AccessibilitySettings, 'profiles'>,
                  subcategory,
                  getDefaultValue(category, subcategory)
                );
              }
            );
          }
        }
      );
    }
  };

  // Helper function to get default values for settings
  const getDefaultValue = (category: string, subcategory: string) => {
    switch (category) {
      case 'orientation':
      case 'colors':
        return subcategory === 'textColor' ||
          subcategory === 'titleColor' ||
          subcategory === 'backgroundColor'
          ? '#000000'
          : false;
      case 'content':
        return subcategory === 'contentScaling' ||
          subcategory === 'fontSize' ||
          subcategory === 'lineHeight' ||
          subcategory === 'letterSpacing'
          ? 'default'
          : subcategory === 'alignment'
          ? 'left'
          : false;
      default:
        return false;
    }
  };

  return (
    <>
      {/* Welcome Modal component */}
      <AccessibilityWelcomeModal changeProfile={handleProfileChange} />

      <Popover>
        <PopoverTrigger
          tabIndex={0}
          aria-description='Accessibility Widget'
          className='fixed bottom-4 right-4 md:bottom-6 md:right-6 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors z-50'
          aria-label={t('openSettings')}
        >
          <PersonStanding className='w-8 h-8 md:w-10 md:h-10' />
        </PopoverTrigger>
        <PopoverContent
          className='w-[90vw] max-w-md md:max-w-lg lg:max-w-xl max-h-[80vh] overflow-hidden flex flex-col p-0'
          side='top'
          align='end'
        >
          <div className='px-6 py-4 border-b-2 flex items-center justify-between'>
            <AccessibilityHeader />
            <Button onClick={() => resetSettings()}>
              {t('reset')} <RefreshCcw />
            </Button>
          </div>

          <div className='flex-grow overflow-y-auto p-4 max-h-[calc(80vh-120px)]'>
            <div className='space-y-6'>
              <ProfileSettings
                settings={settings.profiles}
                updateSettings={handleProfileChange}
              />

              <OrientationAdjustments
                settings={settings.orientation}
                updateSettings={(subcategory, value) =>
                  updateSettings('orientation', subcategory, value)
                }
              />

              <ColorAdjustments
                settings={settings.colors}
                updateSettings={(subcategory, value) =>
                  updateSettings('colors', subcategory, value)
                }
              />

              <ContentAdjustments
                settings={settings.content}
                updateSettings={(subcategory, value) =>
                  updateSettings('content', subcategory, value)
                }
              />
            </div>
          </div>

          <div className='sticky bottom-0 z-10 bg-white dark:bg-gray-800 border-t'>
            <AccessibilityFooter />
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default AccessibilityWidget;
