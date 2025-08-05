'use client';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '../ui/button';
import AuthHeader from './AuthHeader';
interface CardWrapperTypes {
  label: string;
  title: string;
  backButton: string;
  extraBtn1: string;
  extraBtn2: string;
  children: React.ReactNode;
}

const CardWrapper = ({
  label,
  backButton,
  title,
  extraBtn1,
  extraBtn2,
  children,
}: CardWrapperTypes) => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <AuthHeader title={title} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter className="flex flex-col gap-2 -my-3">
        <Button variant="link" asChild>
          <Link href={backButton}>{label}</Link>
        </Button>
        <Button className="hover:cursor-pointer" variant="outline">
          {extraBtn1}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CardWrapper;
