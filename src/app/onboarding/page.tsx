import React from 'react';

import HRFormPage from '@/app/onboarding/hr/hr-onboard';
import JobSeekerFormPage from '@/app/onboarding/jobseeker/jobseeker-onboard';

const OnboardingPage = () => {
  return (
    <div>
      <JobSeekerFormPage />
      <HRFormPage />
    </div>
  );
};

export default OnboardingPage;
