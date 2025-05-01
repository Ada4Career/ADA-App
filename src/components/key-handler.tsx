import React from 'react';

const KeyHandler = (payload: { label: string }) => {
  return (
    <div className='p-2 bg-white text-black rounded text-lg'>
      {payload.label}
    </div>
  );
};

export default KeyHandler;
