import { createSlice } from '@reduxjs/toolkit';
interface CartLoginState {
  id: number;
  quantity: number;
}
const initialState: CartLoginState = {
  id: 0,
  quantity: 1,
};
const cartLoginSlice = createSlice({
  name: 'cartLogin',
  initialState,
  reducers: {
    setCartLogin: (state, action) => {
      state.id = action.payload;
    },
    setQuantityCart: (state, action) => {
      state.quantity = action.payload;
    },
  },
});
export const { setCartLogin, setQuantityCart } = cartLoginSlice.actions;
export default cartLoginSlice.reducer;
