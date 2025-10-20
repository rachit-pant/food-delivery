import { FaFire } from 'react-icons/fa';
import HorizaontalCarousel from './HorizaontalCarousel';

const PopularDishes = () => {
  const arr = [
    {
      id: 1,
      name: 'Pizza',
      image: '/images/pizza.jpg',
    },
    {
      id: 2,
      name: 'Burger',
      image: '/images/pizza.jpg',
    },
    {
      id: 3,
      name: 'Paneer',
      image: '/images/pizza.jpg',
    },
    {
      id: 4,
      name: 'Biryani',
      image: '/images/pizza.jpg',
    },
    {
      id: 5,
      name: 'Masala',
      image: '/images/pizza.jpg',
    },
    {
      id: 6,
      name: 'Pasta',
      image: '/images/pizza.jpg',
    },
    {
      id: 7,
      name: 'Dal',
      image: '/images/pizza.jpg',
    },
    {
      id: 8,
      name: 'Noodles',
      image: '/images/pizza.jpg',
    },
    {
      id: 10,
      name: 'Shake',
      image: '/images/pizza.jpg',
    },
    {
      id: 11,
      name: 'Chocolate',
      image: '/images/pizza.jpg',
    },
    {
      id: 12,
      name: 'Ice Cream',
      image: '/images/pizza.jpg',
    },
  ];

  return (
    <section>
      <div className="relative overflow-hidden rounded-3xl p-8 md:p-12">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-3xl translate-y-24 -translate-x-24"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <FaFire className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold gradient-text">
                Whats on your mind?
              </h2>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover trending dishes and get inspiration for your next
              delicious order
            </p>
          </div>

          <div className="relative">
            <HorizaontalCarousel items={arr} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularDishes;
