import { configureStore } from '@reduxjs/toolkit';
import filterReducer from '../components/filters/filterSlice';
import countryReducer from '../components/Navbar/LocationSlice';
import ordersReducer from '../components/cart/OrdersSlice';
import roleMiddlewareReducer from './roleMiddlewareSlice';
export const makeStore = () => {
  return configureStore({
    reducer: {
      filter: filterReducer,
      country: countryReducer,
      orders: ordersReducer,
      roleMiddleware: roleMiddlewareReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
