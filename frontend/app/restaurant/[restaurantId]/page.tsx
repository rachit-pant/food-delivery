import React from 'react';
import { api } from '@/api/api';
import Image from 'next/image';
import AddButton from '@/components/GridRestro/AddButton';
type MenuItem = {
  id: number;
  item_name: string;
  description: string;
  image_url: string;
  menu_categories: { id: number; cat_name: string };
  menu_variants: {
    id: number;
    variety_name: string;
    price: number;
    menu_id: number;
  }[];
};

type MenuData = Record<string, MenuItem[]>;

const Menus = async ({
  params,
}: {
  params: Promise<{ restaurantId: number }>;
}) => {
  let data;
  try {
    const { restaurantId } = await params;
    data = (await api.get(`restaurants/${restaurantId}/menus`))
      .data as MenuData;
  } catch (error) {
    console.log(error);
    throw error;
  }
  return (
    <div className="px-4 md:px-8 lg:px-16 py-8">
      {Object.entries(data).map(([category, items]) => (
        <div key={category} className="mb-12">
          <h2 className="text-2xl font-bold mb-6 border-b-2 border-gray-200 pb-2">
            {category}
          </h2>

          <div className="space-y-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative w-full sm:w-48 h-48 flex-shrink-0">
                  <Image
                    src={`http://localhost:5000${item.image_url}`}
                    alt={item.item_name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 200px"
                  />
                </div>

                <div className="p-4 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">
                      {item.item_name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-center mt-4">
                    <AddButton key={item.id} variant={item.menu_variants} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
export default Menus;
