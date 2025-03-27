'use client';
import { BrainCircuit, Eye, Sparkles, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { useAccessibilityStore } from '@/store/useAccessibilityStore';
import { useRefStore } from '@/store/useRefStore';

type ProfileCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
};

// Profile Card Component
const ProfileCard: React.FC<ProfileCardProps> = ({
  icon,
  title,
  description,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className='flex flex-col p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors'
    >
      <div className='flex items-center mb-2'>
        {icon}
        <h3 className='text-lg font-medium ml-2'>{title}</h3>
      </div>
      <p className='text-sm text-gray-600 dark:text-gray-300'>{description}</p>
    </button>
  );
};

type Props = {
  changeProfile: (key: string, value: boolean) => void;
};

const AccessibilityWelcomeModal = ({ changeProfile }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const t = useTranslations('Accessibility.welcome');
  const { updateSettings } = useAccessibilityStore();
  const clickButton = useRefStore((state) => state.clickButton);

  // Check if this is the first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('accessibility-onboarding-shown');
    if (!hasVisited) {
      setOpen(true);
    }
  }, []);

  // Function to handle profile selection
  const handleProfileSelect = (profileName: string): void => {
    // Apply the profile
    updateSettings('profiles', profileName, true);
    localStorage.setItem('accessibility-onboarding-shown', 'true');
    changeProfile(profileName, true);
    // Close the modal
    setOpen(false);
  };

  // Function to skip profile selection
  const handleSkip = (): void => {
    setOpen(false);
    localStorage.setItem('accessibility-onboarding-shown', 'true');
  };

  const handleMore = () => {
    clickButton();
    setOpen(false);
    localStorage.setItem('accessibility-onboarding-shown', 'true');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='w-[1800px]  max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {t('title') || 'Welcome! Customize Your Experience'}
          </DialogTitle>
          <DialogDescription>
            {t('description') ||
              'Please select an accessibility profile that suits your needs, or skip to use the default interface.'}
          </DialogDescription>
        </DialogHeader>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 py-4'>
          <ProfileCard
            icon={<Zap className='h-6 w-6 text-yellow-500' />}
            title={t('seizeSafe') || 'Seizure Safe'}
            description={
              t('seizeSafeDesc') || 'Eliminates flashes and reduces color'
            }
            onClick={() => handleProfileSelect('seizeSafe')}
          />

          <ProfileCard
            icon={<Eye className='h-6 w-6 text-blue-500' />}
            title={t('visionImpaired') || 'Vision Impaired'}
            description={t('visionImpairedDesc') || 'Enhances website visuals'}
            onClick={() => handleProfileSelect('visionImpaired')}
          />

          <ProfileCard
            icon={<Sparkles className='h-6 w-6 text-purple-500' />}
            title={t('adhd') || 'ADHD Friendly'}
            description={
              t('adhdDesc') || 'Reduces distractions and improves focus'
            }
            onClick={() => handleProfileSelect('adhd')}
          />

          <ProfileCard
            icon={<BrainCircuit className='h-6 w-6 text-green-500' />}
            title={t('cognitiveDisability') || 'Cognitive Disability'}
            description={
              t('cognitiveDisabilityDesc') ||
              'Assists with reading and focusing'
            }
            onClick={() => handleProfileSelect('cognitiveDisability')}
          />
        </div>

        <DialogFooter className='!flex !flex-col'>
          <Button className='text-sm mb-2' onClick={handleMore}>
            Open More Settings
          </Button>
          <Button variant='outline' onClick={handleSkip}>
            {t('skipButton') || 'Skip for now'}
          </Button>
          <div className='text-xs text-gray-500 mt-2'>
            {t('note') ||
              'You can change your accessibility settings anytime using the widget at the bottom right of the screen.'}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AccessibilityWelcomeModal;
