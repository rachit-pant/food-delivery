import { configureStore } from '@reduxjs/toolkit';
import filterReducer from '../components/filters/filterSlice';
export const makeStore = () => {
  return configureStore({
    reducer: {
      filter: filterReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
