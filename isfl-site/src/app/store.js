import { configureStore } from '@reduxjs/toolkit';
import seasonReducer from '../features/season/seasonSlice'
import addMeetReducer from '../features/addMeet/addMeetSlice'
import typesReducer from '../features/season/typesSlice'
import themeReducer from '../features/theme/themeSlice'

export const store = configureStore({
  reducer: {
    season: seasonReducer,
    addMeet: addMeetReducer,
    types: typesReducer,
    theme: themeReducer
  },
});
