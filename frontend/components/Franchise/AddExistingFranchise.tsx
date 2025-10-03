import React, { useEffect, useState } from 'react';
import { api } from '@/api/api';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '../ui/form';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

interface Staff {
  id: number;
  fullName: string;
}
interface Franchise {
  id: number;
  name: string;
}
interface Role {
  id: number;
  role: string;
}

const formSchema = z.object({
  staffId: z.string().min(1, 'Staff is required'),
  franchiseId: z.string().min(1, 'Franchise is required'),
  roleId: z.string().min(1, 'Role is required'),
});

const AddExistingFranchise = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [franchise, setFranchise] = useState<Franchise[]>([]);
  const [role, setRole] = useState<Role[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      staffId: '',
      franchiseId: '',
      roleId: '',
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/franchise/getStaff');
        setStaff(response.data);
      } catch (error) {
        console.error('Error fetching staff:', error);
      }
    };
    fetchData();
  }, []);

  const fetchFranchise = async (staffId: string) => {
    try {
      const response = await api.get(
        `/franchise/existingStaffFranchise/${staffId}`
      );
      setFranchise(response.data);
      setRole([]); // reset roles when staff changes
      form.setValue('franchiseId', '');
      form.setValue('roleId', '');
    } catch (error) {
      console.error('Error fetching franchise:', error);
    }
  };

  const fetchRole = async () => {
    try {
      const response = await api.get(`/franchise/getStaffRoles`);
      setRole(response.data);
      form.setValue('roleId', '');
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log('Submitting:', data);
    try {
      const response = await api.post(
        '/franchise/createAlreadyCreatedStaff',
        data
      );
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error submitting:', error);
    }
    form.reset();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Existing Franchise</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Existing Franchise</DialogTitle>
          <DialogDescription>
            Add an existing franchise to your account
          </DialogDescription>
        </DialogHeader>
        <div className="p-4 space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="staffId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Staff</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          fetchFranchise(value);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a staff" />
                        </SelectTrigger>
                        <SelectContent>
                          {staff.map((s) => (
                            <SelectItem key={s.id} value={s.id.toString()}>
                              {s.fullName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          fetchRole();
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a franchise" />
                        </SelectTrigger>
                        <SelectContent>
                          {franchise.map((f) => (
                            <SelectItem key={f.id} value={f.id.toString()}>
                              {f.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="roleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          {role.map((r) => (
                            <SelectItem key={r.id} value={r.id.toString()}>
                              {r.role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddExistingFranchise;
