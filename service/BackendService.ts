import axios from "axios";

export interface Currency {
  isoCode: string;
  value: number;
}

export const DEFAULT_CODE = "EUR";

const BASE_URL = "http://localhost:8080/currencies";
export const fetchAllIsoCodes: () => Promise<string[]> = async () => {
  try {
    const response = await axios.get<Array<Currency>>(
      BASE_URL
    );
    const currencies = response.data.map(({ isoCode }) => isoCode);
    currencies.unshift(DEFAULT_CODE);
    return currencies;
  } catch (error) {
    // TODO add useful error handling, as the app makes no sense without the backend
    // eslint-disable-next-line no-console
    console.log(error);
    // simply return empty array
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
  return { isoCode, value: parseFloat(value) };
};
