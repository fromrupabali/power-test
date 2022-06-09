import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import authslice from "../components/Login/authslice";

export const store = configureStore({
  reducer: {
    auth: authslice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
