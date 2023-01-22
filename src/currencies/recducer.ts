import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAllIsoCodes } from "../service/BackendService";

interface CurrencyState {
  currencies: Array<string>;
}

export const fetchCurrencies = createAsyncThunk(
  "currencies/fetchCodes",
  async () => fetchAllIsoCodes()
);

const initialState: CurrencyState = { currencies: [] };

const currencySlice = createSlice({
  name: "currencies",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchCurrencies.fulfilled, (state, action) => ({
      ...state,
      currencies: action.payload,
    }));
  },
});

export default currencySlice.reducer;
