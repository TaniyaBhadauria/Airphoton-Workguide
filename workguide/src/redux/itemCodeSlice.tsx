import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ItemCodeState {
  itemCode: string | null;
}

const initialState: ItemCodeState = {
  itemCode: null,
};

const itemCodeSlice = createSlice({
  name: "itemCode",
  initialState,
  reducers: {
    setItemCode: (state, action: PayloadAction<string>) => {
      state.itemCode = action.payload;
    },
    clearItemCode: (state) => {
      state.itemCode = null;
    },
  },
});


export const { setItemCode, clearItemCode } = itemCodeSlice.actions;
export default itemCodeSlice.reducer;
