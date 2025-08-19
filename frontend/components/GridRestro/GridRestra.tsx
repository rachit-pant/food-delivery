import CardRestra from './CardRestra';
import { api } from '@/api/api';
import { handleError } from '@/lib/handleError';

type restaurants = {
  id: number;
  user_id: number;
  name: string;
  address: string;
  city_id: number;
  rating: number;
  imageurl: string;
  status: string;
};
const GridRestra = async () => {
  let data;
  try {
    data = (await api.get('/restaurants')).data;
  } catch (error) {
    const err = handleError(error);
    console.log(err);
    throw err;
  }

  return (
    <div className="max-w-[1100px] mx-auto px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-10">
        Food Delivery Restaurants
      </h1>
      <div
        className="grid grid-cols-3 gap-x-10 gap-y-10 justify-center"
        style={{ userSelect: 'none' }}
      >
        {data.map((restaurants: restaurants) => (
          <CardRestra
            key={restaurants.id}
            image={restaurants.imageurl}
            name={restaurants.name}
            rating={restaurants.rating}
            id={restaurants.id}
          />
        ))}
      </div>
    </div>
  );
};

export default GridRestra;
