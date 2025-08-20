import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface data {
  addressId: number;
  amount: number;
  payment: string;
  payment_status: string;
  restaurant_id: number;
}

const initialState: data = {
  addressId: 0,
  amount: 0,
  payment: '',
  payment_status: '',
  restaurant_id: 0,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<data>) => {
      return action.payload;
    },
  },
});

export default ordersSlice.reducer;
export const { setOrders } = ordersSlice.actions;
