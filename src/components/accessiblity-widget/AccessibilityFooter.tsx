import { Button } from '@/components/ui/button';

export function AccessibilityFooter() {
  return (
    <div className='mt-8 text-center'>
      <Button
        variant='link'
        className='text-xs text-blue-600 hover:text-blue-800'
      >
        Read our Accessibility Statements & Guidelines
      </Button>
    </div>
  );
}
