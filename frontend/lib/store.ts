import { configureStore } from '@reduxjs/toolkit';
import filterReducer from '../components/filters/filterSlice';
import countryReducer from '../components/Navbar/LocationSlice';
import roleMiddlewareReducer from './roleMiddlewareSlice';
import cartLoginReducer from '../components/GridRestro/cartloginslice';
export const makeStore = () => {
  return configureStore({
    reducer: {
      filter: filterReducer,
      country: countryReducer,
      roleMiddleware: roleMiddlewareReducer,
      cartLogin: cartLoginReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
