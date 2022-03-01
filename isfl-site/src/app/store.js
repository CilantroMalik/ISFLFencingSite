import { configureStore } from '@reduxjs/toolkit';
import seasonReducer from '../features/season/seasonSlice'

export const store = configureStore({
  reducer: {
    season: seasonReducer
  },
});
