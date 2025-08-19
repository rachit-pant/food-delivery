'use client';
import React from 'react';
import { FaStar } from 'react-icons/fa';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
type props = {
  image: string;
  name: string;
  rating: number;
  id: number;
};
const CardRestra = ({ image, name, rating, id }: props) => {
  return (
    <Link href={`/restaurant/${id}`}>
      <Card
        onClick={() => console.log(id)}
        className="flex flex-col justify-center rounded-lg w-full mx-auto h-full max-h-5/6 border-none
      transition-transform duration-200 hover:scale-105 hover:shadow-lg hover:cursor-pointer shadow-none"
      >
        <CardHeader className="w-[328px] h-[248px] overflow-hidden rounded-md px-2 ">
          <Image
            src={`http://localhost:5000${image}`}
            alt="restro img"
            width={328}
            height={248}
            className="object-cover rounded-2xl w-full h-full"
          />
        </CardHeader>
        <CardContent className="text-center  flex -my-4 justify-between items-center">
          <CardTitle className="text-lg font-semibold font-sans text-gray-900">
            {name}
          </CardTitle>
          <CardDescription className=" items-center text-sm text-yellow-600 font-semibold">
            <Badge asChild variant="default" className="bg-green-700">
              <span className="flex">
                {rating.toFixed(1)}
                <FaStar className="mr-1" />
              </span>
            </Badge>
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CardRestra;
