import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';

type data = {
  id: number;
  name: string;
  image: string;
};

const HorizontalCarousel = ({ items }: { items: data[] }) => {
  return (
    <div className="relative">
      <Carousel
        className="w-full select-none"
        opts={{
          watchDrag: false,
          align: 'start',
        }}
      >
        <CarouselContent className="-ml-5">
          {items.map((item, index) => (
            <CarouselItem
              key={index}
              className="pl-4 basis-1/2 md:basis-1/4 lg:basis-1/5"
            >
              <Link
                href={`/restaurant/dishes/${item.name}`}
                className="group block"
              >
                <div className="flex flex-col items-center gap-4 p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/30 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group-hover:scale-105">
                  <div className="relative">
                    <div className="w-20 h-20 md:w-24 md:h-24 relative overflow-hidden rounded-full ring-4 ring-background shadow-lg group-hover:ring-primary/20 transition-all duration-300">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${item.image}`}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    {index < 3 && (
                      <Badge className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground text-xs px-2 py-1 shadow-md">
                        Popular
                      </Badge>
                    )}
                  </div>

                  <div className="text-center">
                    <span className="font-semibold text-sm md:text-base text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-1">
                      {item.name}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      Starting ₹99
                    </p>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="disabled:hidden hover:cursor-pointer -left-4 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 shadow-lg" />
        <CarouselNext className="disabled:hidden hover:cursor-pointer -right-4 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 shadow-lg" />
      </Carousel>
    </div>
  );
};

export default HorizontalCarousel;
