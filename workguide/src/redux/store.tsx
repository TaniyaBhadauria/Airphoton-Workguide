import { configureStore } from "@reduxjs/toolkit";
import itemCodeReducer from "./itemCodeSlice";
import userScreenReducer from "./userScreenSlice";

export const store = configureStore({
  reducer: {
    itemCode: itemCodeReducer,
    userScreen: userScreenReducer
  },
});

// Types for use in hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;