import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './userServices';

const Rootuser = JSON.parse(localStorage.getItem('persist:root'))?.user;
const user = Rootuser && JSON.parse(Rootuser).User;

const initialState = {
  User: user ? user : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Login user
export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
  try {
    return await authService.login(user);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});
export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.User = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.User = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.User = null;
      });
  },
});

export const { reset } = userSlice.actions;
export default userSlice.reducer;
