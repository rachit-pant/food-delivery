import { configureStore } from '@reduxjs/toolkit';
import filterReducer from '../components/filters/filterSlice';
import countryReducer from '../components/Navbar/LocationSlice';
import ordersReducer from '../components/cart/OrdersSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      filter: filterReducer,
      country: countryReducer,
      orders: ordersReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
