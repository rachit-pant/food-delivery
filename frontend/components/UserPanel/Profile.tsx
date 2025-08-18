'use client';
import { api } from '@/api/api';
import { handleError } from '@/lib/handleError';
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';

import { TextShimmer } from '../ui/text-shimmer';
import { SubmitHandler, useForm } from 'react-hook-form';
import z from 'zod';
import { userUpdateSchema } from '@/schema/userUpdateSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { userUpdate } from '@/api/userUpdate';

type Data = {
  full_name: string;
  email: string;
  user_roles: {
    role_name: string;
  };
};

const Profile = () => {
  const form = useForm<z.infer<typeof userUpdateSchema>>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      password: '',
      email: '',
    },
  });
  const [profile, setProfile] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const router = useRouter();
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
  async function handleLogout() {
    try {
      await api.post('/auths/logout', {});
      router.push('/auth/login');
    } catch (error) {
      const err = handleError(error);
      console.log(err);
      throw err;
    }
  }

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

  const onSubmit: SubmitHandler<z.infer<typeof userUpdateSchema>> = async (
    data
  ) => {
    try {
      const res = await userUpdate(data);
      console.log('success', res);
    } catch (error) {
      console.error('Error', error);
      const err = handleError(error);
      form.setError('root', {
        type: 'server',
        message: err,
      });
    }
  };

  return (
    <div className="min-h-screen p-10">
      {/* Profile Header */}
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center md:items-center justify-between gap-6 bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center gap-5">
            <div className="h-20 w-20 rounded-full bg-amber-700 flex items-center justify-center text-3xl font-bold text-blue-600 shadow-md">
              {profile.full_name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-semibold">{profile.full_name}</h1>
              <p className="text-gray-700">{profile.email}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button
              onClick={handleLogout}
              className="px-5 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </Button>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="max-w-6xl mx-auto px-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-6xl mx-auto space-y-8"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">
                Update Profile
              </h2>
              <Button
                type="button"
                className="w-20 rounded-xl"
                onClick={() => setEdit((prev) => !prev)}
              >
                {edit ? 'Cancel' : 'Edit'}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
              {/* Left Side */}
              <div className="flex flex-col space-y-15">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          disabled={!edit}
                          placeholder={profile.full_name}
                          className="mt-3 w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:outline-none h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          {...field}
                          disabled={!edit}
                          placeholder={profile.email}
                          className="mt-3 w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:outline-none h-10 mb-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Right Side */}
              <div className="flex flex-col space-y-15">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          {...field}
                          disabled={!edit}
                          placeholder="Password"
                          className="mt-3 w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:outline-none h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          {...field}
                          disabled={!edit}
                          placeholder="Number"
                          className="mt-3 w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:outline-none h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {form.formState.errors.root && (
              <FormMessage className="flex justify-center text-red-500">
                {form.formState.errors.root.message}
              </FormMessage>
            )}

            {/* Submit Button */}
            {edit && (
              <div className="flex justify-center">
                <Button
                  type="submit"
                  className="w-30 py-3 rounded-xl bg-amber-500 text-white font-semibold shadow hover:bg-amber-600 transition -mt-5"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <TextShimmer duration={1} spread={1}>
                      Please wait
                    </TextShimmer>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            )}
          </form>
        </Form>
      </section>
    </div>
  );
};

export default Profile;
