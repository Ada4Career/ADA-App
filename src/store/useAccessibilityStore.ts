import type React from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { AccessibilitySettings } from '@/components/AccessibilityWidget';

/**
 * Accessibility store type definition
 */
type AccessibilityStore = {
  settings: AccessibilitySettings;
  updateSettings: (
    category: keyof AccessibilitySettings,
    subcategory: string,
    value: any
  ) => void;
  applyAccessibilityStyles: () => React.CSSProperties;
  resetSettings: () => void;
};

/**
 * Default accessibility settings
 */
const defaultSettings: AccessibilitySettings = {
  profiles: {
    seizeSafe: false,
    visionImpaired: false,
    adhd: false,
    cognitiveDisability: false,
  },
  orientation: {
    muteSounds: false,
    hideImages: false,
    readMode: false,
    readingGuide: false,
    readingMask: false,
    highlightHover: false,
    highlightFocus: false,
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
    contentScaling: 'default',
    readableFont: false,
    highlightTitles: false,
    highlightLinks: false,
    highlightHover: false,
    fontSize: 'default',
    lineHeight: 'default',
    letterSpacing: 'default',
    alignment: 'default',
  },
};

/**
 * Zustand store for managing accessibility settings
 */
export const useAccessibilityStore = create<AccessibilityStore>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,

      resetSettings: () =>
        set(() => ({
          settings: defaultSettings,
        })),
      /**
       * Updates a specific setting in the store
       */
      updateSettings: (category, subcategory, value) =>
        set((state) => ({
          settings: {
            ...state.settings,
            [category]: {
              ...state.settings[category],
              [subcategory]: value,
            },
          },
        })),

      /**
       * Generates and applies accessibility-related CSS styles
       */
      applyAccessibilityStyles: () => {
        const { settings } = get();
        const styles: React.CSSProperties = {};

        // // Font Size
        // const fontSizeMap: Record<string, string> = {
        //   large: '1.1rem',
        //   larger: '1.25rem',
        // };
        // if (settings.content.fontSize in fontSizeMap) {
        //   styles.fontSize = fontSizeMap[settings.content.fontSize];
        // }

        // // Line Height
        // const lineHeightMap: Record<string, string> = {
        //   large: '1.8',
        //   larger: '2.2',
        // };
        // if (settings.content.lineHeight in lineHeightMap) {
        //   styles.lineHeight = lineHeightMap[settings.content.lineHeight];
        // }

        // // Letter Spacing
        // const letterSpacingMap: Record<string, string> = {
        //   large: '0.05em',
        //   larger: '0.1em',
        // };
        // if (settings.content.letterSpacing in letterSpacingMap) {
        //   styles.letterSpacing =
        //     letterSpacingMap[settings.content.letterSpacing];
        // }

        // // Text Alignment
        // styles.textAlign = settings.content.alignment || 'left';

        // // High Contrast Mode
        // if (settings.colors.highContrast) {
        //   styles.color = '#000000';
        //   styles.backgroundColor = '#FFFFFF';
        // }

        // // Dark/Light Contrast
        // if (settings.colors.darkContrast) {
        //   styles.backgroundColor = '#000000';
        //   styles.color = '#FFFFFF';
        // } else if (settings.colors.lightContrast) {
        //   styles.backgroundColor = '#FFFFFF';
        //   styles.color = '#000000';
        // }

        // // High/Low Saturation & Monochrome
        // if (settings.colors.highSaturation) {
        //   styles.filter = 'saturate(200%)';
        // } else if (settings.colors.lowSaturation) {
        //   styles.filter = 'saturate(50%)';
        // } else if (settings.colors.monochrome) {
        //   styles.filter = 'grayscale(100%)';
        // }

        // // Readable Font
        // if (settings.content.readableFont) {
        //   styles.fontFamily = "'Arial', 'Helvetica', sans-serif";
        // }

        // // Hide Images
        // if (settings.orientation.hideImages) {
        //   styles.visibility = 'hidden';
        // }

        // // Stop Animations
        // if (settings.orientation.stopAnimations) {
        //   styles.animation = 'none';
        //   styles.transition = 'none';
        // }

        return styles;
      },
    }),
    {
      name: 'accessibility-storage',
      partialize: (state) => ({ settings: state.settings }),
    }
  )
);
