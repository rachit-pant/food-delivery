import FranchiseDashboard from '@/components/Franchise/FranchiseDashboard';
import React from 'react';

const page = async ({
  params,
}: {
  params: Promise<{ franchiseId: string }>;
}) => {
  const franchiseId = (await params).franchiseId;
  return <FranchiseDashboard franchiseId={franchiseId} />;
};

export default page;
