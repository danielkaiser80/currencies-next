import axios from "axios";

export interface Currency {
  isoCode: string;
  value: number;
}

export const defaultCode = "EUR";

export const fetchAllIsoCodes: () => Promise<string[]> = async () => {
  try {
    const response = await axios.get<Array<Currency>>(
      "http://localhost:8080/currencies"
    );
    const currencies = response.data.map(({ isoCode }) => isoCode);
    currencies.unshift(defaultCode);
    return currencies;
  } catch (error) {
    // TODO add useful error handling, as the app makes no sense without the backend
    // eslint-disable-next-line no-console
    console.log(error);
    // simply return empty array
    return [];
  }
};

export const fetchCurrencyForSymbol = async (symbol: string) => {
  if (symbol === defaultCode) {
    return { data: { isoCode: defaultCode, value: 1 } };
  }
  return axios.get<Currency>(`http://localhost:8080/currencies/${symbol}`);
};
