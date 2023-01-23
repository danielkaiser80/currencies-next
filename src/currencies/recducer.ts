import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  defaultCode,
  fetchAllIsoCodes,
  fetchCurrencyForSymbol,
} from "../service/BackendService";

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

const initialState: CurrencyState = {
  currencies: [],
  selectedCurrencies: [defaultCode, defaultCode],
  values: ["", ""],
  exchangeRates: [1, 1],
};

const currencySlice = createSlice({
  name: "currencies",
  initialState,
  reducers: {
    setFirstCurrency: (state, action) => {
      state.selectedCurrencies[0] = action.payload;
      state.values = initialState.values;
    },
    setSecondCurrency: (state, action) => {
      state.selectedCurrencies[1] = action.payload;
      state.values = initialState.values;
    },
    calculateValue: ({ selectedCurrencies, values, exchangeRates }, action) => {
      const { value, name } = action.payload;
      const newValue = parseFloat(value.replace(/\./g, "").replace(/,/g, "."));

      if (Number.isNaN(newValue)) {
        // noinspection JSUnusedAssignment
        values = initialState.values;
        return;
      }

      const options = { maximumFractionDigits: 2 };
      const stringValue = newValue.toLocaleString(undefined, options);
      if (selectedCurrencies[0] === selectedCurrencies[1]) {
        // noinspection JSUnusedAssignment
        values = [stringValue, stringValue];
        return;
      }

      const index = name === "firstValue" ? 0 : 1;
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
      .addCase(fetchCurrencies.fulfilled, (state, action) => {
        state.currencies = action.payload;
      })
      .addCase(fetchCurrencyValue.fulfilled, (state, action) => {
        const { index, value } = action.payload;
        state.exchangeRates[index] = value;
      });
  },
});

export const { setFirstCurrency, setSecondCurrency, calculateValue } =
  currencySlice.actions;

export default currencySlice.reducer;
