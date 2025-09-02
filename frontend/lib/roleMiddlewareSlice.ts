import { createSlice } from '@reduxjs/toolkit';
interface RoleMiddlewareState {
  role: number;
}
const initialState: RoleMiddlewareState = {
  role: 0,
};

const roleMiddlewareSlice = createSlice({
  name: 'roleMiddleware',
  initialState,
  reducers: {
    setRole: (state, action) => {
      state.role = action.payload;
    },
  },
});

export const { setRole } = roleMiddlewareSlice.actions;
export default roleMiddlewareSlice.reducer;
