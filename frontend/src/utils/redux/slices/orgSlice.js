import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getOrgs = createAsyncThunk(
  "org/getOrgs",
  async (limit, thunkAPI) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/org?limit=${limit}`,
        {
          withCredentials: true,
        },
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Organisations not found",
      );
    }
  },
);

const initialState = {
  org: null,
  loading: false,
  error: null,
};

const orgSlice = createSlice({
  name: "org",
  initialState,

  extraReducers: (builder) => {
    builder
      .addCase(getOrgs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getOrgs.fulfilled, (state, action) => {
        state.loading = false;
        state.org = action.payload;
      })

      .addCase(getOrgs.rejected, (state, action) => {
        state.loading = false;
        state.org = null;
        state.error = action.payload;
      });
  },
});

export default orgSlice.reducer;
