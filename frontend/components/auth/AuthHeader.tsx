import { cn } from '@/lib/utils';
import React from 'react';

interface Authtypes {
  title: string;
}

const AuthHeader = ({ title }: Authtypes) => {
  return (
    <div className="flex flex-col gap-y-2 items-center justify-center">
      <h1 className={cn('leading-none font-semibold text-3xl')}>{title}</h1>
      <p className={cn('text-muted-foreground text-sm')}>
        {title} now to get started
      </p>
    </div>
  );
};

export default AuthHeader;
