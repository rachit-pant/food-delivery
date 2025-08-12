import React from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="w-full">
      <div className="h-screen flex items-center justify-center px-4 bg-black">
        <div className="w-full max-w-md ">{children}</div>
      </div>
    </section>
  );
};

export default AuthLayout;
