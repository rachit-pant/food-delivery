import React from 'react';
import { Button } from '../ui/button';
const AddButton = ({ itemId }: { itemId: number }) => {
  return (
    <div>
      <Button>{itemId}</Button>
    </div>
  );
};

export default AddButton;
