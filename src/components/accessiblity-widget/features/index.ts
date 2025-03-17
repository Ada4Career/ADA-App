import { useContrastMode } from '@/components/accessiblity-widget/features/color/useContrast';
import { useMonochrome } from '@/components/accessiblity-widget/features/color/useMonochrome';
import { useSaturation } from '@/components/accessiblity-widget/features/color/useSaturation';
import { useTextAlignment } from '@/components/accessiblity-widget/features/content/useAlignment';
import { useContentScaling } from '@/components/accessiblity-widget/features/content/useContentScaling';
import { useLinkHighlight } from '@/components/accessiblity-widget/features/content/useHighlightLink';
import { useCursor } from '@/components/accessiblity-widget/features/orientation/useCursor';
import { useHideImages } from '@/components/accessiblity-widget/features/orientation/useHideImage';
import { useMuteSound } from '@/components/accessiblity-widget/features/orientation/useMuteSounds';
import { useReadMode } from '@/components/accessiblity-widget/features/orientation/useReadMode';

export const useAccesibilityEffects = () => {
  useMuteSound();
  useContrastMode();
  useCursor();
  useHideImages();
  useReadMode();
  // useStopAnimations();
  useTextAlignment();
  useContentScaling();
  useLinkHighlight();
  useMonochrome();
  useSaturation();
};
