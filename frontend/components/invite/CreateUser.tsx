'use client';

import CardWrapper from '../auth/CardWrapper';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextShimmer } from '@/components/ui/text-shimmer';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { z } from 'zod';
import { RegisterSchema } from '@/schema/registerSchema';
import { registerUsers } from '@/api/register';
import { handleError } from '@/lib/handleError';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { useState, useEffect } from 'react';
import { api } from '@/api/api';

type FormData = z.infer<typeof RegisterSchema>;

const CreateUser = ({ query }: { query: string }) => {
  const [open, setOpen] = useState(false);
  const [JobInfo, setJobInfo] = useState({});
  const form = useForm<FormData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      phoneNumber: '',
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log('data', data);
    console.log('query', query);
    const payload = {
      full_name: data.fullName,
      phone_number: data.phoneNumber,
      email: data.email,
      password: data.password,
      receivedToken: query,
    };
    try {
      const res = await api.post('/franchise/register', payload);
      console.log('success', res);
      setOpen(false);
    } catch (error) {
      console.error('Error', error);
      const err = handleError(error);
      form.setError('root', {
        type: 'server',
        message: err,
      });
    }
  };
  const info = async () => {
    try {
      const res = await api.post(`/franchise/franchiseRoleinfo`, {
        token: query,
      });
      console.log('info', res.data);
      setJobInfo(res.data);
    } catch (error) {
      console.error('Error', error);
    }
  };
  useEffect(() => {
    info();
  }, [query]);
  return (
    <div>
      <CardWrapper
        label="Already have an account? Login"
        title="Register"
        backButton="/auth/login"
        extraBtn1="Register with Google"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter your full name"
                        className="h-11 transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        className="h-11 transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Create a password"
                        className="h-11 transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="Enter your phone number"
                        className="h-11 transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {form.formState.errors.root && (
              <Alert variant="destructive" className="py-3">
                <AlertDescription className="text-sm">
                  {form.formState.errors.root.message}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="button"
              className="w-full h-11 font-medium transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={form.formState.isSubmitting}
              onClick={() => setOpen(true)}
            >
              {form.formState.isSubmitting ? (
                <TextShimmer duration={1} spread={1} className="text-sm">
                  Please wait...
                </TextShimmer>
              ) : (
                'Create Account'
              )}
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="button" onClick={form.handleSubmit(onSubmit)}>
                    Continue
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </form>
        </Form>
      </CardWrapper>
    </div>
  );
};

export default CreateUser;
