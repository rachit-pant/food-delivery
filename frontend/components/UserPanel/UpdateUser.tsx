'use client';
import React from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { TextShimmer } from '../ui/text-shimmer';
import { SubmitHandler, useForm } from 'react-hook-form';
import z from 'zod';
import { userUpdateSchema } from '@/schema/userUpdateSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { userUpdate } from '@/api/userUpdate';
import { handleError } from '@/lib/handleError';

const UpdateUser = () => {
  const form = useForm<z.infer<typeof userUpdateSchema>>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      password: '',
    },
  });
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
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
            'Log in'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default UpdateUser;
