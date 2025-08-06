'use client';
import React from 'react';
import { TextShimmer } from '@/components/ui/text-shimmer';
import CardWrapper from './CardWrapper';
import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox } from '@/components/ui/checkbox';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { loginSchema } from '@/schema/loginSchema';
import { Login } from '@/api/login';
import { isAxiosError } from 'axios';
import { handleError } from '@/lib/handleError';
type LoginData = z.infer<typeof loginSchema>;
const LoginForm = () => {
  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const onSubmit: SubmitHandler<LoginData> = async (data) => {
    try {
      const res = await Login(data);
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
      label="Dont have an account? Register"
      title="Login"
      backButton="/auth/register"
      extraBtn1="Login with Google"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
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
          <div className="flex gap-2">
            <Checkbox id="remeber" />
            <FormLabel htmlFor="remeber">Remember me</FormLabel>
          </div>
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
              'Log in'
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default LoginForm;
