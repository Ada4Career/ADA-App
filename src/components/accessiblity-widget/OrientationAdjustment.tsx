import { BookOpen, ImageOff, MousePointer } from 'lucide-react';

import { Button } from '@/components/ui/button';

type OrientationAdjustmentsProps = {
  settings: {
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
  updateSettings: (key: string, value: boolean | string) => void;
};

export function OrientationAdjustments({
  settings,
  updateSettings,
}: OrientationAdjustmentsProps) {
  const toggleSetting = (key: keyof typeof settings, value?: string) => {
    if (typeof settings[key] === 'boolean') {
      updateSettings(key, !settings[key]);
    } else if (typeof settings[key] === 'string') {
      updateSettings(key, value ?? '');
    }
  };

  const toggleCursor = (
    current: 'default' | 'black' | 'white',
    newVal: 'default' | 'black' | 'white'
  ) => {
    let newCursor = current;
    if (current === newVal) {
      newCursor = 'default';
    } else if (current === 'default') {
      newCursor = newVal;
    } else {
      newCursor = newVal == 'black' ? 'black' : 'white';
    }
    updateSettings('cursor', newCursor);
  };

  return (
    <div className='space-y-4'>
      <div>
        <h3 className='text-lg font-medium text-gray-900'>
          Orientation Adjustments
        </h3>
      </div>

      <div className='grid grid-cols-2 gap-2'>
        {/* <Button
          variant={settings.muteSounds ? 'default' : 'outline'}
          // size='sm'
          onClick={() => toggleSetting('muteSounds')}
          className='flex h-20 flex-col items-center justify-center gap-1 text-sm'
          aria-pressed={settings.muteSounds}
        >
          <Volume2Off className='h-4 w-4' />
          <span>Mute Sounds</span>
        </Button> */}

        <Button
          variant={settings.hideImages ? 'default' : 'outline'}
          size='sm'
          onClick={() => toggleSetting('hideImages')}
          className='flex h-20 flex-col items-center justify-center gap-1 text-sm'
          aria-pressed={settings.hideImages}
        >
          <ImageOff className='h-4 w-4' />
          <span>Hide Images</span>
        </Button>

        <Button
          variant={settings.readMode ? 'default' : 'outline'}
          size='sm'
          onClick={() => toggleSetting('readMode')}
          className='flex h-20 flex-col items-center justify-center gap-1 text-sm'
          aria-pressed={settings.readMode}
        >
          <BookOpen className='h-4 w-4' />
          <span>Read Mode</span>
        </Button>

        {/* <Button
          variant={settings.readingGuide ? 'default' : 'outline'}
          size='sm'
          onClick={() => toggleSetting('readingGuide')}
          className='flex h-20 flex-col items-center justify-center gap-1 text-sm'
          aria-pressed={settings.readingGuide}
        >
          <AlignJustify className='h-4 w-4' />
          <span>Reading Guide</span>
        </Button>

        <Button
          variant='outline'
          size='sm'
          className='flex h-20 flex-col items-center justify-center gap-1 text-sm'
        >
          <Link className='h-4 w-4' />
          <span>Useful Links</span>
        </Button> */}

        {/* <Button
          variant={settings.readingMask ? 'secondary' : 'outline'}
          size='sm'
          onClick={() => toggleSetting('readingMask')}
          className={`flex h-20 flex-col items-center justify-center gap-1 text-sm ${
            settings.readingMask
              ? 'bg-purple-500 text-white hover:bg-purple-600'
              : ''
          }`}
          aria-pressed={settings.readingMask}
        >
          <Layers className='h-4 w-4' />
          <span>Reading Mask</span>
        </Button>

        <Button
          variant={settings.highlightHover ? 'default' : 'outline'}
          size='sm'
          onClick={() => toggleSetting('highlightHover')}
          className='flex h-20 flex-col items-center justify-center gap-1 text-sm'
          aria-pressed={settings.highlightHover}
        >
          <MousePointerClick className='h-4 w-4' />
          <span>Highlight Hover</span>
        </Button>

        <Button
          variant={settings.highlightFocus ? 'default' : 'outline'}
          size='sm'
          onClick={() => toggleSetting('highlightFocus')}
          className='flex h-20 flex-col items-center justify-center gap-1 text-sm'
          aria-pressed={settings.highlightFocus}
        >
          <Target className='h-4 w-4' />
          <span>Highlight Focus</span>
        </Button> */}

        {/* <Button
          variant={settings.stopAnimations ? 'default' : 'outline'}
          size='sm'
          onClick={() => toggleSetting('stopAnimations')}
          className='flex h-20 flex-col items-center justify-center gap-1 text-sm'
          aria-pressed={settings.stopAnimations}
        >
          <ZapOff className='h-4 w-4' />
          <span>Stop Animations</span>
        </Button> */}

        <Button
          variant={settings.cursor == 'black' ? 'default' : 'outline'}
          size='sm'
          onClick={() => toggleCursor(settings.cursor, 'black')}
          className='flex h-20 flex-col items-center justify-center gap-1 text-sm'
          aria-pressed={settings.cursor == 'black'}
        >
          <MousePointer className='h-4 w-4' />
          <span>Big Black Cursor</span>
        </Button>

        <Button
          variant={settings.cursor == 'white' ? 'default' : 'outline'}
          size='sm'
          onClick={() => toggleCursor(settings.cursor, 'white')}
          className='flex h-20 flex-col items-center justify-center gap-1 text-sm'
          aria-pressed={settings.cursor == 'white'}
        >
          <MousePointer className='h-4 w-4' />
          <span>Big White Cursor</span>
        </Button>
      </div>
    </div>
  );
}
