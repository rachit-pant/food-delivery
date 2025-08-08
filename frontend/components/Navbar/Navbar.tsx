import React from 'react';
import List from './List';
import UserPanel from './UserPanel';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  return (
    <nav>
      <div>
        <Link href="/auth/login">
          <Image src="/logoipsum.svg" alt="logo" width={100} height={100} />
        </Link>
      </div>
      <div>
        <List />
      </div>
      <div>
        <UserPanel />
      </div>
    </nav>
  );
};

export default Navbar;
