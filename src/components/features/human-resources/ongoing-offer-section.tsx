import React from 'react';

import OfferingCard from '@/components/features/human-resources/offering-card';

import { JobPostingDataExtended } from '@/types/response/job';

type Props = {
  offerings: JobPostingDataExtended[];
  onViewApplicants?: (offeringId: string) => void;
  onDelete?: (offeringId: string) => void;
};

const OngoingOfferSection = ({
  offerings,
  onViewApplicants,
  onDelete,
}: Props) => {
  console.log(offerings);
  return (
    <div className='space-y-4'>
      {offerings.map((offering) => (
        <OfferingCard
          key={offering.id}
          offering={offering}
          onViewApplicants={
            onViewApplicants ? () => onViewApplicants(offering.id) : undefined
          }
          onDelete={onDelete ? () => onDelete(offering.id) : undefined}
        />
      ))}
    </div>
  );
};

export default OngoingOfferSection;
