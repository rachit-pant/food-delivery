'use client';

import CardWrapper from './CardWrapper';
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

type FormData = z.infer<typeof RegisterSchema>;

const RegisterForm = () => {
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
    try {
      const res = await registerUsers(data);
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
            type="submit"
            className="w-full h-11 font-medium transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <TextShimmer duration={1} spread={1} className="text-sm">
                Please wait...
              </TextShimmer>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default RegisterForm;
