'use client';
import { api } from '@/api/api';
import { handleError } from '@/lib/handleError';
import React, { useEffect, useState } from 'react';

type Data = {
  full_name: string;
  email: string;
  user_roles: {
    role_name: string;
  };
};

const Profile = () => {
  const [profile, setProfile] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = (await api.get('/users')).data;
        setProfile(res);
      } catch (error) {
        const err = handleError(error);
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-500 animate-pulse">
          Loading profile...
        </div>
      </section>
    );
  }

  if (!profile) {
    return (
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-500 mb-4">You are not logged in.</p>
          <a
            href="/auth/login"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            Login
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-r from-blue-500 to-indigo-600 py-10 text-white">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center text-2xl font-bold text-blue-600 shadow-md">
            {profile.full_name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-semibold">{profile.full_name}</h1>
            <p className="text-blue-100">{profile.email}</p>
            <span className=" mt-1 px-3 py-1 bg-white/20 rounded-full text-sm">
              {profile.user_roles.role_name}
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
