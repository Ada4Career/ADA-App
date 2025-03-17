import { Contrast, Droplet, Eye, Moon, Paintbrush, Sun } from 'lucide-react';

import { Button } from '@/components/ui/button';

type ColorAdjustmentsProps = {
  settings: {
    contrast: 'default' | 'dark' | 'light' | 'high';
    saturation: 'default' | 'high' | 'low';
    monochrome: boolean;
    textColor: string;
    titleColor: string;
    backgroundColor: string;
  };
  updateSettings: (key: string, value: any) => void;
};

export function ColorAdjustments({
  settings,
  updateSettings,
}: ColorAdjustmentsProps) {
  const toggleSetting = (
    key: keyof Omit<
      typeof settings,
      'textColor' | 'titleColor' | 'backgroundColor'
    >
  ) => {
    updateSettings(key, !settings[key]);
  };

  const colorOptions = [
    '#8B5CF6',
    '#3B82F6',
    '#10B981',
    '#F59E0B',
    '#EF4444',
    '#EC4899',
    '#000000',
  ];

  const toggleContrast = (newVal: 'default' | 'dark' | 'light' | 'high') => {
    if (settings.contrast == newVal) {
      updateSettings('contrast', 'default');
    } else {
      updateSettings('contrast', newVal);
    }
  };

  const toggleSaturation = (newVal: 'default' | 'high' | 'low') => {
    if (settings.saturation == newVal) {
      updateSettings('saturation', 'default');
    } else {
      updateSettings('saturation', newVal);
    }
  };

  return (
    <div className='space-y-4'>
      <div>
        <h3 className='text-lg font-medium text-gray-900'>Color Adjustments</h3>
      </div>

      <div className='grid grid-cols-2 gap-2'>
        <Button
          variant={settings.contrast == 'dark' ? 'default' : 'outline'}
          size='sm'
          onClick={() => toggleContrast('dark')}
          className='flex h-20 flex-col items-center justify-center gap-1 text-sm'
          aria-pressed={settings.contrast == 'dark'}
        >
          <Moon className='h-4 w-4' />
          <span>Dark Contrast</span>
        </Button>

        <Button
          variant={settings.contrast == 'light' ? 'default' : 'outline'}
          size='sm'
          onClick={() => toggleContrast('light')}
          className='flex h-20 flex-col items-center justify-center gap-1 text-sm'
          aria-pressed={settings.contrast == 'light'}
        >
          <Sun className='h-4 w-4' />
          <span>Light Contrast</span>
        </Button>

        <Button
          variant={settings.contrast == 'high' ? 'default' : 'outline'}
          size='sm'
          onClick={() => toggleContrast('high')}
          className='flex h-20 flex-col items-center justify-center gap-1 text-sm'
          aria-pressed={settings.contrast == 'high'}
        >
          <Eye className='h-4 w-4' />
          <span>High Contrast</span>
        </Button>

        <Button
          variant={settings.saturation == 'high' ? 'default' : 'outline'}
          size='sm'
          onClick={() => toggleSaturation('high')}
          className='flex h-20 flex-col items-center justify-center gap-1 text-sm'
          aria-pressed={settings.saturation == 'high'}
        >
          <Droplet className='h-4 w-4' />
          <span>High Saturation</span>
        </Button>

        {/* <div className='col-span-2 flex h-20 flex-col items-center justify-center rounded-md bg-umrple-500 p-2 text-white'>
          <span className='text-xs'>Adjust Text Colors</span>
          <div className='mt-1 flex gap-1'>
            {colorOptions.map((color) => (
              <button
                key={`text-${color}`}
                className='h-4 w-4 rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1'
                style={{ backgroundColor: color }}
                onClick={() => updateSettings('textColor', color)}
                aria-label={`Set text color to ${color}`}
                aria-pressed={settings.textColor === color}
              />
            ))}
          </div>
        </div> */}

        <Button
          variant={settings.monochrome ? 'default' : 'outline'}
          size='sm'
          onClick={() => toggleSetting('monochrome')}
          className='flex h-20 flex-col items-center justify-center gap-1 text-sm'
          aria-pressed={settings.monochrome}
        >
          <Contrast className='h-4 w-4' />
          <span>Monochrome</span>
        </Button>

        {/* <div className='col-span-2 flex h-20 flex-col items-center justify-center rounded-md border omrder-gray-200 p-2'>
          <span className='text-xs'>Adjust Title Colors</span>
          <div className='mt-1 flex gap-1'>
            {colorOptions.map((color) => (
              <button
                key={`title-${color}`}
                className='h-4 w-4 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-1'
                style={{ backgroundColor: color }}
                onClick={() => updateSettings('titleColor', color)}
                aria-label={`Set title color to ${color}`}
                aria-pressed={settings.titleColor === color}
              />
            ))}
          </div>
        </div> */}

        <Button
          variant={settings.saturation == 'low' ? 'default' : 'outline'}
          size='sm'
          onClick={() => toggleSaturation('low')}
          className='flex h-20 flex-col items-center justify-center gap-1 text-sm'
          aria-pressed={settings.saturation == 'low'}
        >
          <Paintbrush className='h-4 w-4' />
          <span>Low Saturation</span>
        </Button>

        {/* <div className='col-span-2 flex h-20 flex-col items-center justify-center rounded-md border omrder-gray-200 p-2'>
          <span className='text-xs'>Adjust Background Colors</span>
          <div className='mt-1 flex gap-1'>
            {colorOptions.map((color) => (
              <button
                key={`bg-${color}`}
                className='h-4 w-4 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-1'
                style={{ backgroundColor: color }}
                onClick={() => updateSettings('backgroundColor', color)}
                aria-label={`Set background color to ${color}`}
                aria-pressed={settings.backgroundColor === color}
              />
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
}
