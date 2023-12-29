// store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Authentication/authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
