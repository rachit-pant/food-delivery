import React from 'react';

import UserPanel from './UserPanel';
import Link from 'next/link';
import Image from 'next/image';
import Location from './Location';
import SearchBox from './SearchBox';

const Navbar = () => {
  return (
    <nav className="bg-background border-b border-border shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          <div className="flex-shrink-0">
            <Link href="/restaurant" className="flex items-center">
              <Image
                src="/logoipsum.svg"
                alt="logo"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </Link>
          </div>

          <div className="flex-1 max-w-2xl flex items-center">
            <Location />
            <SearchBox />
          </div>

          <div className="flex-shrink-0">
            <UserPanel />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
