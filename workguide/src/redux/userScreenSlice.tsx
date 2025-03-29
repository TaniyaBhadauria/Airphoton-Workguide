import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserScreenState {
  activeScreen: string;
}

const initialState: UserScreenState = {
  activeScreen: "Roles", // Default active screen
};

const userScreenSlice = createSlice({
  name: "userScreen",
  initialState,
  reducers: {
    setActiveScreen: (state, action: PayloadAction<string>) => {
      state.activeScreen = action.payload;
    },
  },
});

export const { setActiveScreen } = userScreenSlice.actions;
export default userScreenSlice.reducer;
