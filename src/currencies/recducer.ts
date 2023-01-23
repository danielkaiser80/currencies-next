import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { defaultCode, fetchAllIsoCodes } from "../service/BackendService";

interface CurrencyState {
  currencies: Array<string>;
  selectedCurrencies: [string, string];
  values: [string, string];
}

export const fetchCurrencies = createAsyncThunk(
  "currencies/fetchCodes",
  async () => fetchAllIsoCodes()
);

const initialState: CurrencyState = {
  currencies: [],
  selectedCurrencies: [defaultCode, defaultCode],
  values: ["", ""],
};

const currencySlice = createSlice({
  name: "currencies",
  initialState,
  reducers: {
    setFirstCurrency: (state, action) => {
      state.selectedCurrencies[0] = action.payload;
      state.values = ["", ""];
    },
    setSecondCurrency: (state, action) => {
      state.selectedCurrencies[1] = action.payload;
      state.values = ["", ""];
    },
    calculateValue: ({ selectedCurrencies, values }, action) => {
      const { value, name } = action.payload;
      const newValue = parseFloat(value);

      const index = name === "firstValue" ? 0 : 1;
      const otherIndex = 1 - index;
      if (Number.isNaN(newValue)) {
        values[index] = "";
        values[otherIndex] = "";
        return;
      }

      // now we can calculate the other value
      let divisor;
      if (selectedCurrencies[0] === selectedCurrencies[1]) {
        divisor = 1;
      } else {
        divisor = 2;
      }

      values[index] = newValue.toString();
      values[otherIndex] = (newValue / divisor).toString();
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchCurrencies.fulfilled, (state, action) => {
      state.currencies = action.payload;
    });
  },
});

export const { setFirstCurrency, setSecondCurrency, calculateValue } =
  currencySlice.actions;

export default currencySlice.reducer;
