import { BriefcaseBusiness } from 'lucide-react';
import React from 'react';

const HomePage = () => {
  return (
    <div className=''>
      <div className='flex items-center mb-8'>
        <BriefcaseBusiness className='w-8 h-8 text-blue-600 mr-3' />
        <h1 className='text-3xl font-bold text-gray-900'>
          Jobs Recommendation
        </h1>
      </div>
    </div>
  );
};

export default HomePage;
