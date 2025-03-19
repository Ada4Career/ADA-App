import React from 'react';

// import OfferingDetailSection from '@/components/features/human-resources/offering-detail-section';

const OfferingDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return <div>{id}</div>;
};

export default OfferingDetailPage;
