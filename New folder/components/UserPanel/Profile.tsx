import { handleError } from '@/lib/handleError';
import { cookies } from 'next/headers';
import React from 'react';
type data = {
  full_name: string;
  email: string;
  user_roles: {
    role_name: string;
  };
};
const Profile = async () => {
  let data: data;
  try {
    const cookiesFetched = await cookies();

    const res = await fetch('http://localhost:5000/users', {
      method: 'GET',
      credentials: 'include',
      headers: {
        Cookie: cookiesFetched.toString(),
      },
    });
    data = (await res.json()) as data;
  } catch (error) {
    const err = handleError(error);
    console.log(err);
    throw err;
  }
  return (
    <section className="bg-gradient-to-r from-blue-500 to-indigo-600 py-10 text-white">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center text-2xl font-bold text-blue-600 shadow-md">
            {data.full_name?.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-semibold">{data.full_name}</h1>
            <p className="text-blue-100">{data.email}</p>
            <span className="mt-1 px-3 py-1 bg-white/20 rounded-full text-sm">
              {data.user_roles?.role_name}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <a
            href="/users/profile"
            className="px-5 py-2 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition"
          >
            View Profile
          </a>
          <a
            href="/auth/logout"
            className="px-5 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </a>
        </div>
      </div>
    </section>
  );
};

export default Profile;
