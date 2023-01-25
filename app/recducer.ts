import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  defaultCode,
  fetchAllIsoCodes,
  fetchCurrencyForSymbol,
} from "../service/BackendService";
import { HYDRATE } from "next-redux-wrapper";

interface CurrencyState {
  currencies: Array<string>;
  selectedCurrencies: [string, string];
  values: [string, string];
  exchangeRates: [number, number];
}

export const fetchCurrencies = createAsyncThunk(
  "currencies/fetchCodes",
  async () => fetchAllIsoCodes()
);

export const fetchCurrencyValue = createAsyncThunk(
  "currencies/fetchCurrencyForSymbol",
  async ({ symbol, index }: { symbol: string; index: number }) => ({
    value: (await fetchCurrencyForSymbol(symbol)).value,
    index,
  })
);

const hydrate = createAction<CurrencyState>(HYDRATE);

const initialState: CurrencyState = {
  currencies: [defaultCode],
  selectedCurrencies: [defaultCode, defaultCode],
  values: ["", ""],
  exchangeRates: [1, 1],
};

const currencySlice = createSlice({
  name: "currencies",
  initialState,
  reducers: {
    setCurrency: (state, action) => {
      const { label, index } = action.payload;
      state.selectedCurrencies[index] = label;
      state.values = initialState.values;
    },
    calculateValue: ({ selectedCurrencies, values, exchangeRates }, action) => {
      const { value, name } = action.payload;
      const newValue = parseFloat(value.replace(/\./g, "").replace(/,/g, "."));

      if (Number.isNaN(newValue)) {
        return;
      }

      const options = { maximumFractionDigits: 2 };
      const stringValue = newValue.toLocaleString(undefined, options);
      if (selectedCurrencies[0] === selectedCurrencies[1]) {
        values[0] = stringValue;
        values[1] = stringValue;
        return;
      }

      // the name is `input_${index}`
      const index = parseInt(name.slice(-1), 10);
      const otherIndex = 1 - index;

      values[index] = stringValue;
      values[otherIndex] = (
        (newValue / exchangeRates[index]) *
        exchangeRates[otherIndex]
      ).toLocaleString(undefined, options);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(hydrate, (state, action) => {
        return {
          ...state,
          ...action.payload,
        };
      })
      .addCase(fetchCurrencies.fulfilled, (state, action) => {
        state.currencies = action.payload;
      })
      .addCase(fetchCurrencyValue.fulfilled, (state, action) => {
        const { index, value } = action.payload;
        state.exchangeRates[index] = value;
      });
  },
});

export const { setCurrency, calculateValue } = currencySlice.actions;

export default currencySlice.reducer;
