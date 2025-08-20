import Filter from '@/components/filters/Filter';
import GridRestra from '@/components/GridRestro/GridRestra';
import PopularDishes from '@/components/GridRestro/PopularDishes';
import TopBrands from '@/components/GridRestro/TopBrands';

const Restaurant = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-8 space-y-12">
        <div className="flex justify-center">
          <div className="backdrop-blur-sm bg-card/80 border border-border/50 rounded-2xl p-6 shadow-xl">
            <Filter />
          </div>
        </div>

        <div className="space-y-16">
          <PopularDishes />
          <div className="border-t border-border/30 pt-16">
            <TopBrands />
          </div>
          <div className="border-t border-border/30 pt-16">
            <GridRestra />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Restaurant;
