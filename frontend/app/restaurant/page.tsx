import Filter from '@/components/filters/Filter';
import GridRestra from '@/components/GridRestro/GridRestra';
import PopularDishes from '@/components/GridRestro/PopularDishes';
import TopBrands from '@/components/GridRestro/TopBrands';

const Restaurant = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-8 ">
        <div className="flex justify-center">
          <div className="rounded-2xl p-6 border-1 inset-shadow-sm mt-5">
            <Filter />
          </div>
        </div>

        <div>
          <PopularDishes />
          <div>
            <TopBrands />
          </div>
          <div>
            <GridRestra />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Restaurant;
