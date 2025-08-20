'use client';
import { FaStar, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
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

const CardRestaurant = ({ image, name, rating, id }: props) => {
  return (
    <Link href={`/restaurant/${id}`} className="group block">
      <Card className="food-card-hover border-0 bg-card/60 backdrop-blur-sm shadow-lg hover:shadow-2xl overflow-hidden group-hover:border-primary/20 transition-all duration-300">
        <CardHeader className="p-0 relative overflow-hidden">
          <div className="relative h-56 w-full">
            <Image
              src={`http://localhost:5000${image}`}
              alt={`${name} restaurant`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="absolute top-4 right-4">
              <Badge className="bg-primary/90 backdrop-blur-sm text-primary-foreground border-0 shadow-lg">
                <FaStar className="w-3 h-3 mr-1 text-yellow-400" />
                {rating.toFixed(1)}
              </Badge>
            </div>

            <div className="absolute bottom-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Badge
                variant="secondary"
                className="bg-background/90 backdrop-blur-sm text-foreground border-0"
              >
                <FaClock className="w-3 h-3 mr-1" />
                25-30 min
              </Badge>
              <Badge
                variant="secondary"
                className="bg-background/90 backdrop-blur-sm text-foreground border-0"
              >
                <FaMapMarkerAlt className="w-3 h-3 mr-1" />
                2.5 km
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-1">
                {name}
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-1 flex items-center gap-1">
                <span className="text-sm">Fast Food • Indian • ₹₹</span>
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t border-border/50">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Open now
            </span>
            <span className="font-medium text-primary">Free delivery</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CardRestaurant;
