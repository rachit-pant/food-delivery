import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AddressForm from './AddressForm';
import UpdateUser from './UpdateUser';

const AllInfo = () => {
  return (
    <Tabs defaultValue="Address" className="items-center">
      <TabsList className="gap-1 bg-transparent">
        <TabsTrigger
          value="Address"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full data-[state=active]:shadow-none"
        >
          Add Address
        </TabsTrigger>
        <TabsTrigger
          value="User"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full data-[state=active]:shadow-none"
        >
          Update User
        </TabsTrigger>
      </TabsList>
      <TabsContent value="Address">
        <AddressForm />
      </TabsContent>
      <TabsContent value="User">
        <UpdateUser />
      </TabsContent>
    </Tabs>
  );
};

export default AllInfo;
