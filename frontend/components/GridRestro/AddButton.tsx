'use client';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { handleError } from '@/lib/handleError';
import { api } from '@/api/api';
const AddButton = ({
  variant,
}: {
  variant: {
    id: number;
    menu_id: number;
    variety_name: string;
    price: number;
  }[];
}) => {
  const [selectVariant, setselectVariant] = useState<string | null>(null);
  async function hadnleSubmit() {
    if (!selectVariant) {
      alert('Please enter variant');
      return;
    }
    try {
      const res = await api.post('/cart', {
        variant: selectVariant,
      });
      console.log('success', res);
    } catch (error) {
      const err = handleError(error);
      console.log(err);
      throw err;
    }
  }
  return (
    <div>
      <div>
        <Select onValueChange={(val) => setselectVariant(val)}>
          <SelectTrigger>
            <SelectValue placeholder="Select Varient" />
          </SelectTrigger>
          <SelectContent>
            {variant.map((details) => (
              <SelectItem key={details.id} value={String(details.id)}>
                {details.variety_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Button type="submit" onClick={hadnleSubmit}>
          Add to cart
        </Button>
      </div>
    </div>
  );
};

export default AddButton;
