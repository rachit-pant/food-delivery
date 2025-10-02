'use client';
import { TextShimmer } from '@/components/ui/text-shimmer';
import CardWrapper from '../auth/CardWrapper';
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
import { handleError } from '@/lib/handleError';
import { api } from '@/api/api';
import { useAppSelector } from '@/lib/hooks';
import { useAppDispatch } from '@/lib/hooks';
import {
  setCartLogin,
  setQuantityCart,
} from '@/components/GridRestro/cartloginslice';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '../ui/dialog';
type LoginData = z.infer<typeof loginSchema>;

const ExistingUser = ({ query }: { query: string }) => {
  const [open, setOpen] = useState(false);
  const [jobInfo, setJobInfo] = useState([]);
  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
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
  const selector = useAppSelector((state) => state.cartLogin.id);
  const quantity = useAppSelector((state) => state.cartLogin.quantity);
  const dispatch = useAppDispatch();
  const onSubmit: SubmitHandler<LoginData> = async (data) => {
    try {
      const payload = {
        email: data.email,
        password: data.password,
        receivedToken: query,
      };
      const res = await api.post('/franchise/login', payload);
      console.log('success', res);
      setOpen(false);
      const selectVariant = selector;

      if (selectVariant !== 0) {
        try {
          const res = await api.post('/cart', {
            variant: selectVariant,
            quantity,
          });
          console.log('success', res);
          dispatch(setCartLogin(0));
          dispatch(setQuantityCart(1));
          window.location.href = '/cart';
        } catch (error) {
          const err = handleError(error);
          console.log(err);
          throw err;
        }
      }
      window.location.href = '/restaurant';
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
              'Sign In'
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
                <Button
                  type="button"
                  disabled={form.formState.isSubmitting}
                  onClick={form.handleSubmit(onSubmit)}
                >
                  Continue
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default ExistingUser;
