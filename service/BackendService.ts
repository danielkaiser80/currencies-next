import axios from "axios";
import {
  isLegacyCurrency,
  LEGACY_CURRENCIES,
  LEGACY_ISO_CODES,
} from "./LegacyCurrencies";

export interface Currency {
  isoCode: string;
  value: number;
}

export const DEFAULT_CODE = "EUR";

// available without the backend
export const FALLBACK_ISO_CODES = [DEFAULT_CODE, ...LEGACY_ISO_CODES];

const BASE_URL = "http://localhost:8080/currencies";
export const fetchAllIsoCodes: () => Promise<string[]> = async () => {
  const response = await axios.get<Currency[]>(BASE_URL);
  const currencies = response.data
    .map(({ isoCode }) => isoCode)
    .filter(
      (isoCode) => isoCode !== DEFAULT_CODE && !isLegacyCurrency(isoCode),
    );
  return [DEFAULT_CODE, ...currencies, ...LEGACY_ISO_CODES];
};

export const fetchCurrencyForSymbol = async (
  symbol: string,
): Promise<{ isoCode: string; value: number }> => {
  if (symbol === DEFAULT_CODE) {
    return { isoCode: DEFAULT_CODE, value: 1 };
  }
  if (isLegacyCurrency(symbol)) {
    return { isoCode: symbol, value: LEGACY_CURRENCIES[symbol].rate };
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
