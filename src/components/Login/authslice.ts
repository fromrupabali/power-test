import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { User } from "../../models";

export enum LoginStatus {
  LOGGED_IN,
  LOGIN_PENDING,
  LOGIN_ERROR,
  LOGGED_OUT,
}
export type AuthState =
  | {
      user: User;
      apiToken: string;
      status: LoginStatus.LOGGED_IN;
    }
  | {
      status: LoginStatus.LOGGED_OUT | LoginStatus.LOGIN_PENDING;
    }
  | {
      status: LoginStatus.LOGIN_ERROR;
      error: string;
    };

const initialState = {
  status: LoginStatus.LOGGED_OUT,
} as AuthState;

/*
The API is managed by mockapi.io, which does not actually handle authentication or present an interface for e.g. retrieving a user by username. 
The login logic creatively works around these limitations, and should not be used as any kind of inspiration for other code!
*/
export const login = createAsyncThunk(
  "auth/login",
  async ({ username }: { username: string }) => {
    const response = await fetch(
      "https://60b793ec17d1dc0017b8a6bc.mockapi.io/users"
    );
    const json = await response.json();

    if (!Array.isArray(json))
      throw new Error("Login API returned unexpected structure");

    if (json.length > 80)
      throw new Error(
        "This sample API has too much data in it. Please create a new API to test with using https://mockapi.io/clone/60b793ec17d1dc0017b8a6bd"
      );

    const user = json.find((user) => "name" in user && user.name === username);

    if (user) return user;

    // user does not already exist; create a new one.
    const registration = await fetch(
      "https://60b793ec17d1dc0017b8a6bc.mockapi.io/users",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: username,
        }),
      }
    );
    return registration.json();
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => ({ status: LoginStatus.LOGGED_OUT }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        return {
          status: LoginStatus.LOGGED_IN,
          user: action.payload,
          apiToken: "xxx-my-super-secret-token", // TODO: actually retrieve a token
        };
      })
      .addCase(login.rejected, (state, action) => {
        return {
          status: LoginStatus.LOGIN_ERROR,
          error: "Login failed. See console for details.",
        };
      })
      .addCase(login.pending, (state, action) => {
        return {
          status: LoginStatus.LOGIN_PENDING,
        };
      });
  },
});

export const { logout } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
