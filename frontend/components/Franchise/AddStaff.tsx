'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '@/api/api';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

const AddStaffSchema = z.object({
  email: z.string().email({ message: 'A valid email is required.' }),
  franchiseId: z.number().min(1, { message: 'Please select a franchise.' }),
  role: z.number().min(1, { message: 'Please select a role.' }),
});

type AddStaffData = z.infer<typeof AddStaffSchema>;

interface FranchiseData {
  id: number;
  userId: number;
  name: string;
  address: string | null;
}
interface StaffRoles {
  id: number;
  role: string;
}

const AddStaff = () => {
  const [franchise, setFranchise] = useState<FranchiseData[]>([]);
  const [staffRoles, setStaffRoles] = useState<StaffRoles[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<AddStaffData>({
    resolver: zodResolver(AddStaffSchema),
    defaultValues: {
      email: '',
      franchiseId: 0,
      role: 0,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [franchiseRes, staffRolesRes] = await Promise.all([
          api.get('/franchise'),
          api.get('/franchise/getStaffRoles'),
        ]);
        setFranchise(franchiseRes.data || []);
        setStaffRoles(staffRolesRes.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (data: AddStaffData) => {
    try {
      const response = await api.post('/franchise/addStaffInvites', data);
      console.log(response.data);
      form.reset();
    } catch (error) {
      console.error(error);
      form.setError('root', {
        type: 'manual',
        message: 'Failed to add staff. Please try again.',
      });
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full h-11 font-medium transition-all duration-200 hover:shadow-md">
            Add Staff
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Staff</DialogTitle>
            <DialogDescription>
              Add a new staff member to your franchise.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter staff email"
                          className="h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="franchiseId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Franchise</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value ? String(field.value) : ''}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select a franchise" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            {loading ? (
                              <SelectItem disabled value="loading">
                                Loading...
                              </SelectItem>
                            ) : franchise.length > 0 ? (
                              franchise.map((f) => (
                                <SelectItem key={f.id} value={String(f.id)}>
                                  {f.name}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem disabled value="none">
                                No franchises found
                              </SelectItem>
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value ? String(field.value) : ''}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            {loading ? (
                              <SelectItem disabled value="loading">
                                Loading...
                              </SelectItem>
                            ) : staffRoles.length > 0 ? (
                              staffRoles.map((s) => (
                                <SelectItem key={s.id} value={String(s.id)}>
                                  {s.role}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem disabled value="none">
                                No roles available
                              </SelectItem>
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {form.formState.errors.root && (
                <Alert variant="destructive" className="py-3">
                  <AlertDescription>
                    {form.formState.errors.root.message}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-11 font-medium transition-all duration-200 hover:shadow-md"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'Please wait...' : 'Add Staff'}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddStaff;
