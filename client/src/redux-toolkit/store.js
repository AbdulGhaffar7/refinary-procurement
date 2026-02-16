import { configureStore } from "@reduxjs/toolkit";
import poReducer from "./poSlice";

export const store = configureStore({
  reducer: {
    po: poReducer,
  },
});
