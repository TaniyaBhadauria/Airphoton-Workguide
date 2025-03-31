import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserNameState {
  activeUser: string | null;
}

const initialState: UserNameState = {
  activeUser: null,
};

const userNameSlice = createSlice({
  name: "userName",
  initialState,
  reducers: {
    setActiveUser: (state, action: PayloadAction<string>) => {
      state.activeUser = action.payload; // Set the username in the state
    },
    clearActiveUser: (state) => {
      state.activeUser = null; // Clear the username
    },
  },
});

export const { setActiveUser, clearActiveUser } = userNameSlice.actions;
export default userNameSlice.reducer;
