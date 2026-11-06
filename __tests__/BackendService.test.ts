import axios from "axios";
import {
  fetchAllIsoCodes,
  fetchCurrencyForSymbol,
} from "../service/BackendService";
import { LEGACY_ISO_CODES } from "../service/LegacyCurrencies";

jest.mock("axios");

const get = jest.mocked(axios.get);

beforeEach(() => {
  get.mockReset();
});

test("lists the euro first and the legacy currencies last", async () => {
  get.mockResolvedValue({
    data: [{ isoCode: "USD" }, { isoCode: "EUR" }, { isoCode: "DEM" }],
  });

  await expect(fetchAllIsoCodes()).resolves.toEqual([
    "EUR",
    "USD",
    ...LEGACY_ISO_CODES,
  ]);
});

test("fails to list the currencies without the backend", async () => {
  get.mockRejectedValue(new Error("Network Error"));

  await expect(fetchAllIsoCodes()).rejects.toThrow("Network Error");
});

test.each([
  ["DEM", 1.95583],
  ["ITL", 1936.27],
])("uses the fixed rate of %s without the backend", async (isoCode, value) => {
  await expect(fetchCurrencyForSymbol(isoCode)).resolves.toEqual({
    isoCode,
    value,
  });
  expect(get).not.toHaveBeenCalled();
});

test("parses the exchange rate", async () => {
  get.mockResolvedValue({ data: { isoCode: "USD", value: "1.25" } });

  await expect(fetchCurrencyForSymbol("USD")).resolves.toEqual({
    isoCode: "USD",
    value: 1.25,
  });
});

test.each(["abc", "0", "-1"])("rejects the invalid rate %s", async (value) => {
  get.mockResolvedValue({ data: { isoCode: "USD", value } });

  await expect(fetchCurrencyForSymbol("USD")).rejects.toThrow(
    "Invalid exchange rate for USD",
  );
});
