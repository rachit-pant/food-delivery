import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

import Link from 'next/link';
import Image from 'next/image';
type data = {
  id: number;
  name: string;
  image: string;
};
const HorizaontalCarousel = ({ items }: { items: data[] }) => {
  return (
    <>
      <Carousel className="w-full select-none" opts={{ watchDrag: false }}>
        <CarouselContent className="-ml-10">
          {items.map((item, index) => (
            <CarouselItem key={index} className="basis-1/5  ">
              <Link href={`/restaurant/dishes/${item.name}`}>
                <div className="flex flex-col items-center gap-3">
                  <Image
                    src={`http://localhost:5000${item.image}.avif`}
                    alt={item.name}
                    width={150}
                    height={150}
                    className="rounded-full shadow-lg "
                  />
                  <span className="font-sans">{item.name}</span>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="disabled:hidden hover:cursor-pointer" />
        <CarouselNext className="disabled:hidden hover:cursor-pointer" />
      </Carousel>
    </>
  );
};

export default HorizaontalCarousel;
