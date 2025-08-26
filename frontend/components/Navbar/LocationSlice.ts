import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface country {
  countryName: string;
}

const initialState: country = {
  countryName: '',
};

const countrySlice = createSlice({
  name: 'country',
  initialState,
  reducers: {
    setCountry: (state, action: PayloadAction<string>) => {
      state.countryName = action.payload;
    },
  },
});

export default countrySlice.reducer;

export const { setCountry } = countrySlice.actions;
