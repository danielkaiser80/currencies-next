import axios from "axios";
import { fetchCurrencyForSymbol } from "../service/BackendService";

jest.mock("axios");

const get = jest.mocked(axios.get);

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
