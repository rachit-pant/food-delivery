'use client';
import { TextShimmer } from '@/components/ui/text-shimmer';
import CardWrapper from './CardWrapper';
import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox } from '@/components/ui/checkbox';
import { type SubmitHandler, useForm } from 'react-hook-form';
import type { z } from 'zod';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { loginSchema } from '@/schema/loginSchema';
import { Login } from '@/api/login';
import { handleError } from '@/lib/handleError';
import { useRouter } from 'next/navigation';

type LoginData = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const router = useRouter();
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
      router.push('/restaurant');
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
      label="Don't have an account? Register"
      title="Login"
      backButton="/auth/register"
      extraBtn1="Login with Google"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
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
                      placeholder="Enter your password"
                      className="h-11 transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center space-x-2 py-2">
            <Checkbox
              id="remember"
              className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
            />
            <FormLabel
              htmlFor="remember"
              className="text-sm font-normal text-muted-foreground cursor-pointer"
            >
              Remember me
            </FormLabel>
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
              'Sign In'
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default LoginForm;
