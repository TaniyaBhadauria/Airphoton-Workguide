import { configureStore } from "@reduxjs/toolkit";
import itemCodeReducer from "./itemCodeSlice";
import userScreenReducer from "./userScreenSlice";
import userNameReducer from "./userNameSlice";

export const store = configureStore({
  reducer: {
    itemCode: itemCodeReducer,
    userScreen: userScreenReducer,
    userName: userNameReducer
  },
});

// Types for use in hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;