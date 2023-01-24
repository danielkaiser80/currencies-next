import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import reducer from "../currencies/recducer";

const store = configureStore({
  // as we have only one reducer, we need not nest here.
  reducer,
});

export default store;

export type RootState = ReturnType<typeof store.getState>;

export const selectCurrencies = (state: RootState) => state.currencies;
export const selectSelectedCurrencies = (state: RootState) =>
  state.selectedCurrencies;
export const selectValues = (state: RootState) => state.values;

export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
