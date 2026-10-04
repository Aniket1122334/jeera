import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getTeams = createAsyncThunk(
  "teams/getTeams",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/teams`,
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
  teams: null,
  loading: false,
  error: null,
};

const teamSlice = createSlice({
  name: "teams",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getTeams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getTeams.fulfilled, (state, action) => {
        state.loading = false;
        state.teams = action.payload;
      })

      .addCase(getTeams.rejected, (state, action) => {
        state.loading = false;
        state.teams = null;
        state.error = action.payload;
      });
  },
});

export default teamSlice.reducer;
