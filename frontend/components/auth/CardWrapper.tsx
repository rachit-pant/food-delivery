'use client';
import Link from 'next/link';
import type React from 'react';

import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

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
    <Card className="w-full max-w-md mx-auto shadow-lg border-0 bg-card">
      <CardHeader className="space-y-4 pb-8">
        <div className="flex flex-col space-y-2 text-center">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            {title}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {title} now to get started
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-6">{children}</CardContent>

      <CardFooter className="flex flex-col space-y-4 px-6 pb-6">
        <Separator />

        <Button
          variant="outline"
          className="w-full h-11 font-medium hover:bg-accent hover:text-accent-foreground transition-colors bg-transparent"
        >
          {extraBtn1}
        </Button>

        <Button
          variant="link"
          asChild
          className="text-sm text-muted-foreground hover:text-primary"
        >
          <Link href={backButton}>{label}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CardWrapper;
