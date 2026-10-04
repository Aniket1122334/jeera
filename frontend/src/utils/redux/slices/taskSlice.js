import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getTasks = createAsyncThunk(
  "tasks/getTasks",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/tasks`,
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
  tasks: null,
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,

  extraReducers: (builder) => {
    builder
      .addCase(getTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })

      .addCase(getTasks.rejected, (state, action) => {
        state.loading = false;
        state.tasks = null;
        state.error = action.payload;
      });
  },
});

export default taskSlice.reducer;
