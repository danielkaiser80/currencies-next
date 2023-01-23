import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAllIsoCodes } from "../service/BackendService";

interface CurrencyState {
  currencies: Array<string>;
  selectedCurrencies: [string, string];
  values: [number, number];
}

export const fetchCurrencies = createAsyncThunk(
  "currencies/fetchCodes",
  async () => fetchAllIsoCodes()
);

const initialState: CurrencyState = {
  currencies: [],
  selectedCurrencies: ["EUR", "EUR"],
  values: [0, 0],
};

const currencySlice = createSlice({
  name: "currencies",
  initialState,
  reducers: {
    setFirstCurrency: (state, action) => {
      state.selectedCurrencies[0] = action.payload;
    },
    setSecondCurrency: (state, action) => {
      state.selectedCurrencies[1] = action.payload;
    },
    calculateFirstValue: (state, action) => {
      state.values[1] = action.payload;
    },
    calculateSecondValue: (state, action) => {
      state.values[0] = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchCurrencies.fulfilled, (state, action) => {
      state.currencies = action.payload;
    });
  },
});

export const {
  setFirstCurrency,
  setSecondCurrency,
  calculateFirstValue,
  calculateSecondValue,
} = currencySlice.actions;

export default currencySlice.reducer;
