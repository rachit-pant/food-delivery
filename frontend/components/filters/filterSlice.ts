import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface filterSlice {
  filterName: string;
}

const initialState: filterSlice = {
  filterName: 'None',
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<string>) => {
      state.filterName = action.payload;
    },
  },
});

export default filterSlice.reducer;
export const { setFilter } = filterSlice.actions;
