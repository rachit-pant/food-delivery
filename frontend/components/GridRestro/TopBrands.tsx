import { FaCrown, FaStar } from 'react-icons/fa';
import HorizaontalCarousel from './HorizaontalCarousel';

const TopBrands = () => {
  const arr = [
    {
      id: 1,
      name: "McDonald's",
      image: '/images/kanha',
    },
    {
      id: 2,
      name: 'KFC',
      image: '/images/kanha',
    },
    {
      id: 3,
      name: "Domino's",
      image: '/images/kanha',
    },
    {
      id: 4,
      name: 'Subway',
      image: '/images/kanha',
    },
    {
      id: 5,
      name: 'Pizza Hut',
      image: '/images/kanha',
    },
    {
      id: 6,
      name: 'Starbucks',
      image: '/images/kanha',
    },
    {
      id: 7,
      name: 'Taco Bell',
      image: '/images/kanha',
    },
    {
      id: 8,
      name: 'Burger King',
      image: '/images/kanha',
    },
    {
      id: 10,
      name: "Dunkin'",
      image: '/images/kanha',
    },
    {
      id: 11,
      name: 'Baskin Robbins',
      image: '/images/kanha',
    },
    {
      id: 12,
      name: "Haldiram's",
      image: '/images/kanha',
    },
  ];

  return (
    <section>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full">
              <FaCrown className="w-6 h-6 text-yellow-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold gradient-text">
              Top Brands
            </h2>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Order from your favorite restaurants and discover new premium brands
          </p>

          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <FaStar className="w-4 h-4 text-yellow-500" />
              <span>4.5+ Rated</span>
            </div>
            <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
            <span>Fast Delivery</span>
            <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
            <span>Premium Quality</span>
          </div>
        </div>

        <div className="relative bg-gradient-to-r from-background via-card/30 to-background rounded-2xl p-6 border border-border/30 shadow-sm">
          <HorizaontalCarousel items={arr} />
        </div>
      </div>
    </section>
  );
};

export default TopBrands;
