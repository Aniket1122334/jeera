import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getOrgs = createAsyncThunk(
  "org/getOrgs",
  async ({ page = 1, limit = 6 }, thunkAPI) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/org`,
        {
          params: {
            page,
            limit,
          },
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

export const createOrg = createAsyncThunk(
  "org/createOrg",
  async (orgData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/org/create-org`,
        orgData,
        {
          withCredentials: true,
        },
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to create organisation",
      );
    }
  },
);

export const deleteOrg = createAsyncThunk(
  "org/deleteOrg",
  async (id, thunkAPI) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/org/${id}`,
        {
          withCredentials: true,
        },
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to delete organisation",
      );
    }
  },
);

export const updateOrg = createAsyncThunk(
  "org/updateOrg",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/org/${id}`,
        data,
        {
          withCredentials: true,
        },
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to update organisation",
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

      // GET ORGS
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
      })

      // CREATE ORG
      .addCase(createOrg.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createOrg.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })

      .addCase(createOrg.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE ORG
      .addCase(deleteOrg.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteOrg.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const updatedOrg = action.payload.data;

        if (state.org?.data) {
          state.org.data = state.org.data.map((org) =>
            org._id === updatedOrg._id
              ? { ...org, isActive: updatedOrg.isActive }
              : org,
          );
        }
      })

      .addCase(deleteOrg.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE ORG
      .addCase(updateOrg.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateOrg.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })

      .addCase(updateOrg.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default orgSlice.reducer;
