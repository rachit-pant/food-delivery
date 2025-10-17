import PopularMenu from '@/components/GridRestro/PopularMenu';
import React from 'react';
import Filter from '@/components/filters/Filter';
const page = async ({ params }: { params: Promise<{ menuName: string }> }) => {
  const menuName = (await params).menuName;
  return (
    <div>
      <div className="container mx-auto px-4 py-8  ">
        <div className="flex justify-center">
          <div className="rounded-2xl p-6 border-1 inset-shadow-sm mt-5">
            <Filter />
          </div>
        </div>
        <PopularMenu MenuName={menuName} />
      </div>
    </div>
  );
};

export default page;
