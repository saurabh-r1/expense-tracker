// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const loginAsync = createAsyncThunk('auth/login', async ({ email, password }) => {
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBLKAbRXVsMIF8DYwJjnSGwYrzgHYy3jiU`,
    {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error.message || 'Authentication failed!');
  }

  return data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: '',
    isLoggedIn: false,
    userEmail: '',
    emailVerified: false,
    loading: 'idle',
  },
  reducers: {
    logout: (state) => {
      state.token = '';
      state.userEmail = '';
      state.emailVerified = false;
      state.isLoggedIn = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = 'idle';
        state.token = action.payload.idToken;
        state.userEmail = action.payload.email;
        state.emailVerified = true;
        state.isLoggedIn = true;
      })
      .addCase(loginAsync.rejected, (state) => {
        state.loading = 'idle';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
