import React from 'react';
import List from './List';
import UserPanel from './UserPanel';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  return (
    <nav className="flex justify-center gap-20  pb-2">
      <div className="p-5">
        <Link href="/auth/login">
          <Image src="/logoipsum.svg" alt="logo" width={100} height={100} />
        </Link>
      </div>
      <div className="flex p-2">
        <List />
      </div>
      <div className="p-3">
        <UserPanel />
      </div>
    </nav>
  );
};

export default Navbar;
