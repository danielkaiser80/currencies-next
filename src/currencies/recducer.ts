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
    calculateValue: (state, action) => {
      const { value, name } = action.payload;
      const newValue = parseFloat(value);
      const index = name === "firstValue" ? 0 : 1;
      state.values[index] = Number.isNaN(newValue) ? "" : newValue.toString();

      // now we can calculate the other value
      const otherIndex = name !== "firstValue" ? 0 : 1;
      state.values[otherIndex] = Number.isNaN(newValue)
        ? ""
        : (newValue / 2).toString();
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
