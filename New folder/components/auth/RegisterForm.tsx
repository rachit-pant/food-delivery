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
type LoginError = {
  message?: string;
  fieldErrors?: Partial<Record<keyof FormData, string>>;
};
import { zodResolver } from '@hookform/resolvers/zod';
import { TextShimmer } from '@/components/ui/text-shimmer';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { z } from 'zod';
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
    <div>
      <CardWrapper
        label="Already have an account? Login"
        title="Register"
        backButton="/auth/login"
        extraBtn1="Register with Google"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
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
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
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
                  <FormLabel>Number</FormLabel>
                  <FormControl>
                    <Input type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.formState.errors.root && (
              <FormMessage className="flex justify-center ">
                {form.formState.errors.root.message}
              </FormMessage>
            )}
            <Button
              type="submit"
              className="w-full hover:cursor-pointer"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <TextShimmer duration={1} spread={1}>
                  Please wait
                </TextShimmer>
              ) : (
                'Register'
              )}
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </div>
  );
};

export default RegisterForm;
