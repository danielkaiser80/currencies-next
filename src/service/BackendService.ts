import axios from "axios";

export interface Currency {
  isoCode: string;
  value: number;
}

export const defaultCode = "EUR";

export const fetchAllCurrencies = async () => {
  try {
    const response = await axios.get<Array<Currency>>(
      "http://localhost:8080/currencies"
    );
    return response.data;
  } catch (error) {
    // simply return empty array
    // TODO add useful error handling, as the app makes no sense without the backend
    // eslint-disable-next-line no-console
    console.log(error);
    return [];
  }
};

export const fetchCurrencyForSymbol = async (symbol: string) => {
  if (symbol === defaultCode) {
    return { data: { isoCode: defaultCode, value: 1 } };
  }
  return axios.get<Currency>(`http://localhost:8080/currencies/${symbol}`);
};
