import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FormState {
  formData: { [key: string]: any };
}

const initialState: FormState = {
  formData: {},
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    updateFormData(state, action: PayloadAction<{ [key: string]: any }>) {
      state.formData = { ...state.formData, ...action.payload };
    },
    resetFormData(state) {
      state.formData = {};
    },
  },
});

export const { updateFormData, resetFormData } = formSlice.actions;
export default formSlice.reducer;