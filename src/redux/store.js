import { configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';
import { rootReducer } from './rootReducer';

const initialState = {
  rootReducer: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
  },
};

const store = configureStore({
  reducer: {
    rootReducer: rootReducer,
  },
  preloadedState: initialState,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(thunk),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;