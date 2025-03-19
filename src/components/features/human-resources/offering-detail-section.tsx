import { useQuery } from '@tanstack/react-query';
import React from 'react';

const OfferingDetailSection = ({ id }: { id: string }) => {
  const {} = useQuery({
    queryKey: ['offering-detail'],
    queryFn: async () => {
      const response = await api.get<ApiReturn<JobPostingDataExtended>>(
        `${API_BASE_URL}/job-vacancies/${id}`
      );
      return response.data.data;
    },
  });
  return (
    <div className='container mx-auto'>
      <h1></h1>
    </div>
  );
};

export default OfferingDetailSection;
