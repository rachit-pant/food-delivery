import React from 'react';
import CardRestra from './CardRestra';
interface Data {
  id: number;
  user_id: number;
  name: string;
  address: string;
  city_id: number;
  rating: number;
  imageurl: string;
  status: string;
}

const PopularMenu = ({ data, Name }: { data: Data[]; Name: string }) => {
  return (
    <div className="max-w-[1100px] mx-auto px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-5 mt-10">
        {Name} Delivery
      </h1>
      <div
        className="grid grid-cols-3 gap-x-10 gap-y-10 justify-center"
        style={{ userSelect: 'none' }}
      >
        {data.map((items) => (
          <CardRestra
            key={items.id}
            image={items.imageurl}
            name={items.name}
            rating={items.rating}
            id={items.id}
          />
        ))}
      </div>
    </div>
  );
};

export default PopularMenu;
