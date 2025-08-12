import Navbar from '@/components/Navbar/Navbar';
import AllInfo from '@/components/UserPanel/AllInfo';
import FooterMain from '@/components/UserPanel/FooterMain';
import Profile from '@/components/UserPanel/Profile';

import React from 'react';

const User = () => {
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div>
        <Profile />
      </div>
      <div>
        <AllInfo />
      </div>
      <div>
        <FooterMain />
      </div>
    </div>
  );
};

export default User;
