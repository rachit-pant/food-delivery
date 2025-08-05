'use client';
import Link from 'next/link';
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '../ui/button';
interface CardWrapperTypes {
  label: string;
  title: string;
  backButton: string;
  extraBtn1: string;
  children: React.ReactNode;
}

const CardWrapper = ({
  label,
  backButton,
  title,
  extraBtn1,
  children,
}: CardWrapperTypes) => {
  return (
    <Card className="w-full max-w-md dark">
      <CardHeader className="flex flex-col justify-center items-center gap-1.5">
        <CardTitle className="p-2">{title}</CardTitle>
        <CardDescription>{title} now to get started</CardDescription>
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
