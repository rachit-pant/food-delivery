'use client';
import { api } from '@/api/api';
import { handleError } from '@/lib/handleError';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';

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
import { type SubmitHandler, useForm } from 'react-hook-form';
import type z from 'zod';
import { userUpdateSchema } from '@/schema/userUpdateSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { userUpdate } from '@/api/userUpdate';
import { User, Mail, Phone, Lock, Edit3, LogOut, Shield } from 'lucide-react';
import { disconnectSocket } from '@/lib/sockets';
import { useAppDispatch } from '@/lib/hooks';
import { setRole } from '@/lib/roleMiddlewareSlice';
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
  const dispatch = useAppDispatch();
  async function handleLogout() {
    try {
      await api.post('/auths/logout', {});

      dispatch(setRole(0));
      disconnectSocket();
      window.location.href = '/auth/login';
    } catch (error) {
      const err = handleError(error);
      console.log(err);
      throw err;
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md mx-4">
          <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Access Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please log in to view your profile
          </p>
          <a
            href="/auth/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <LogOut className="w-4 h-4" />
            Login
          </a>
        </div>
      </div>
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto mb-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 h-32 relative">
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
          <div className="relative px-8 pb-8">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center text-4xl font-bold text-white shadow-2xl border-4 border-white">
                  {profile.full_name.charAt(0)}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {profile.full_name}
                </h1>
                <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600 mb-2">
                  <Mail className="w-4 h-4" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Shield className="w-4 h-4 text-orange-500" />
                  <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                    {profile.user_roles?.role_name || 'User'}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 bg-transparent"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-white shadow-xl rounded-2xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                    <Edit3 className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Update Profile
                  </h2>
                </div>
                <Button
                  type="button"
                  variant={edit ? 'outline' : 'default'}
                  className={`flex items-center gap-2 ${
                    edit
                      ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
                  }`}
                  onClick={() => setEdit((prev) => !prev)}
                >
                  <Edit3 className="w-4 h-4" />
                  {edit ? 'Cancel' : 'Edit'}
                </Button>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                          <User className="w-4 h-4 text-orange-500" />
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            {...field}
                            disabled={!edit}
                            placeholder={profile.full_name}
                            className={`h-12 rounded-xl border-2 transition-all duration-200 ${
                              edit
                                ? 'border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100'
                                : 'border-gray-100 bg-gray-50'
                            }`}
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
                        <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                          <Mail className="w-4 h-4 text-orange-500" />
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            {...field}
                            disabled={!edit}
                            placeholder={profile.email}
                            className={`h-12 rounded-xl border-2 transition-all duration-200 ${
                              edit
                                ? 'border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100'
                                : 'border-gray-100 bg-gray-50'
                            }`}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                          <Lock className="w-4 h-4 text-orange-500" />
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            {...field}
                            disabled={!edit}
                            placeholder="Enter new password"
                            className={`h-12 rounded-xl border-2 transition-all duration-200 ${
                              edit
                                ? 'border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100'
                                : 'border-gray-100 bg-gray-50'
                            }`}
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
                        <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                          <Phone className="w-4 h-4 text-orange-500" />
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            {...field}
                            disabled={!edit}
                            placeholder="Enter phone number"
                            className={`h-12 rounded-xl border-2 transition-all duration-200 ${
                              edit
                                ? 'border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100'
                                : 'border-gray-100 bg-gray-50'
                            }`}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {form.formState.errors.root && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <FormMessage className="text-red-600 text-center">
                    {form.formState.errors.root.message}
                  </FormMessage>
                </div>
              )}

              {edit && (
                <div className="flex justify-center mt-8 pt-6 border-t border-gray-200">
                  <Button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <TextShimmer duration={1} spread={1}>
                        Saving Changes...
                      </TextShimmer>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Profile;
