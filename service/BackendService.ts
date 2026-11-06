import axios from "axios";

export interface Currency {
  isoCode: string;
  value: number;
}

export const DEFAULT_CODE = "EUR";

const BASE_URL = "http://localhost:8080/currencies";
export const fetchAllIsoCodes: () => Promise<string[]> = async () => {
  try {
    const response = await axios.get<Currency[]>(BASE_URL);
    const currencies = response.data.map(({ isoCode }) => isoCode);
    currencies.unshift(DEFAULT_CODE);
    return currencies;
  } catch (error) {
    console.log(error);
    // the calculator shows an error for the empty array
    return [];
  }
};

export const fetchCurrencyForSymbol = async (
  symbol: string
): Promise<{ isoCode: string; value: number }> => {
  if (symbol === DEFAULT_CODE) {
    return { isoCode: DEFAULT_CODE, value: 1 };
  }
  const { isoCode, value } = (
    await axios.get<{
      isoCode: string;
      value: string;
    }>(`${BASE_URL}/${symbol}`)
  ).data;
  const rate = Number.parseFloat(value);
  if (!Number.isFinite(rate) || rate <= 0) {
    throw new Error(`Invalid exchange rate for ${symbol}: ${value}`);
  }
  return { isoCode, value: rate };
};
