import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { ReactNode } from "react";
import { SWRConfig } from "swr";
import Calculator from "../components/Calculator";
import {
  fetchAllIsoCodes,
  fetchCurrencyForSymbol,
} from "../service/BackendService";

jest.mock("../service/BackendService", () => ({
  DEFAULT_CODE: "EUR",
  fetchAllIsoCodes: jest.fn(),
  fetchCurrencyForSymbol: jest.fn(),
}));

const fetchRate = jest.mocked(fetchCurrencyForSymbol);
const fetchIsoCodes = jest.mocked(fetchAllIsoCodes);
const isoCodes = ["EUR", "USD", "CHF"];

const renderCalculator = async (codes = isoCodes) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <SWRConfig
      value={{
        provider: () => new Map(),
        dedupingInterval: 0,
        shouldRetryOnError: false,
      }}
    >
      {children}
    </SWRConfig>
  );
  render(<Calculator isoCodes={codes} />, { wrapper });
  // let the currency list request settle
  await act(async () => {});
};

const input = (index: number) =>
  document.querySelector<HTMLInputElement>(`input[name=input_${index}]`)!;

const select = async (index: number, code: string) => {
  fireEvent.mouseDown(screen.getAllByRole("combobox")[index]);
  fireEvent.click(within(screen.getByRole("listbox")).getByText(code));
  // let the pending exchange rate request settle
  await act(async () => {});
};

const retry = async () => {
  fireEvent.click(screen.getByRole("button", { name: "Erneut versuchen" }));
  await act(async () => {});
};

beforeEach(() => {
  fetchRate.mockReset();
  fetchIsoCodes.mockReset();
  fetchIsoCodes.mockImplementation(async () => isoCodes);
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("converts with the loaded exchange rate", async () => {
  fetchRate.mockResolvedValue({ isoCode: "USD", value: 2 });
  await renderCalculator();

  await select(1, "USD");
  fireEvent.change(input(0), { target: { value: "12" } });

  expect(input(0)).toHaveValue("0.12");
  expect(input(1)).toHaveValue("0.24");
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

test("shows an error instead of converting when loading a rate fails", async () => {
  fetchRate.mockRejectedValue(new Error("Network Error"));
  await renderCalculator();

  await select(1, "USD");

  expect(screen.getByRole("alert")).toHaveTextContent(
    "Der Kurs für USD konnte nicht geladen werden",
  );
  expect(input(0)).toBeDisabled();
  expect(input(1)).toBeDisabled();
});

test("recovers when another currency loads after a failure", async () => {
  fetchRate.mockRejectedValueOnce(new Error("Network Error"));
  fetchRate.mockResolvedValueOnce({ isoCode: "CHF", value: 4 });
  await renderCalculator();

  await select(1, "USD");
  await select(1, "CHF");
  fireEvent.change(input(0), { target: { value: "100" } });

  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  expect(input(1)).toHaveValue("4.00");
});

test("loads the rate again when retrying after a failure", async () => {
  fetchRate.mockRejectedValueOnce(new Error("Network Error"));
  fetchRate.mockResolvedValueOnce({ isoCode: "USD", value: 2 });
  await renderCalculator();

  await select(1, "USD");
  await retry();
  fireEvent.change(input(0), { target: { value: "100" } });

  expect(fetchRate).toHaveBeenCalledTimes(2);
  expect(fetchRate).toHaveBeenLastCalledWith("USD");
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  expect(input(1)).toHaveValue("2.00");
});

test("keeps showing the error when retrying fails again", async () => {
  fetchRate.mockRejectedValue(new Error("Network Error"));
  await renderCalculator();

  await select(1, "USD");
  await retry();

  expect(fetchRate).toHaveBeenCalledTimes(2);
  expect(screen.getByRole("alert")).toHaveTextContent("USD");
  expect(input(0)).toBeDisabled();
});

test("retries every field showing the failed currency", async () => {
  fetchRate.mockRejectedValueOnce(new Error("Network Error"));
  fetchRate.mockRejectedValueOnce(new Error("Network Error"));
  fetchRate.mockResolvedValue({ isoCode: "USD", value: 2 });
  await renderCalculator();

  await select(0, "USD");
  await select(1, "USD");
  expect(screen.getAllByRole("alert")).toHaveLength(1);

  await retry();

  expect(fetchRate).toHaveBeenCalledTimes(4);
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

test("disables the inputs while a rate is loading", async () => {
  let resolveRate: (rate: {
    isoCode: string;
    value: number;
  }) => void = () => {};
  fetchRate.mockReturnValue(
    new Promise((resolve) => {
      resolveRate = resolve;
    }),
  );
  await renderCalculator();

  await select(1, "USD");
  expect(input(0)).toBeDisabled();

  await act(async () => resolveRate({ isoCode: "USD", value: 2 }));
  expect(input(0)).toBeEnabled();
});

test("ignores the response of an outdated currency selection", async () => {
  let resolveUsd: (rate: { isoCode: string; value: number }) => void = () => {};
  fetchRate.mockReturnValueOnce(
    new Promise((resolve) => {
      resolveUsd = resolve;
    }),
  );
  fetchRate.mockResolvedValueOnce({ isoCode: "CHF", value: 4 });
  await renderCalculator();

  await select(1, "USD");
  await select(1, "CHF");
  await act(async () => resolveUsd({ isoCode: "USD", value: 2 }));
  fireEvent.change(input(0), { target: { value: "100" } });

  expect(input(1)).toHaveValue("4.00");
});

test("warns and keeps the legacy currencies when the backend is down", async () => {
  fetchIsoCodes.mockRejectedValue(new Error("Network Error"));
  fetchRate.mockResolvedValue({ isoCode: "DEM", value: 1.95583 });
  await renderCalculator(["EUR", "DEM"]);

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Der Server ist nicht erreichbar",
  );

  await select(1, "DEM – Deutsche Mark");
  fireEvent.change(input(0), { target: { value: "100" } });

  expect(input(1)).toHaveValue("1.96");
});

test("adds the currencies of the backend in the browser", async () => {
  fetchIsoCodes.mockResolvedValue(["EUR", "USD", "DEM"]);
  await renderCalculator(["EUR", "DEM"]);

  fireEvent.mouseDown(screen.getAllByRole("combobox")[0]);

  expect(
    await screen.findByRole("option", { name: "USD" }),
  ).toBeInTheDocument();
});

test("groups the legacy currencies without making the heading selectable", async () => {
  fetchIsoCodes.mockResolvedValue(["EUR", "DEM"]);
  await renderCalculator(["EUR", "DEM"]);

  fireEvent.mouseDown(screen.getAllByRole("combobox")[1]);
  fireEvent.click(screen.getByText("Historische Währungen"));

  expect(fetchRate).not.toHaveBeenCalled();
  expect(screen.getByRole("listbox")).toBeInTheDocument();
  // the open menu hides the rest of the page from the accessibility tree
  expect(
    screen.getAllByRole("combobox", { hidden: true })[1],
  ).toHaveTextContent("EUR");
});

test("shows only the code of a selected legacy currency", async () => {
  fetchIsoCodes.mockResolvedValue(["EUR", "DEM"]);
  fetchRate.mockResolvedValue({ isoCode: "DEM", value: 1.95583 });
  await renderCalculator(["EUR", "DEM"]);

  await select(1, "DEM – Deutsche Mark");

  expect(screen.getAllByRole("combobox")[1]).toHaveTextContent(/^DEM$/);
});

test("converts between two legacy currencies through the euro", async () => {
  fetchIsoCodes.mockResolvedValue(["EUR", "DEM", "ITL"]);
  fetchRate.mockImplementation(async (isoCode) => ({
    isoCode,
    value: isoCode === "DEM" ? 1.95583 : 1936.27,
  }));
  await renderCalculator(["EUR", "DEM", "ITL"]);

  await select(0, "DEM – Deutsche Mark");
  await select(1, "ITL – Italienische Lira");
  fireEvent.change(input(0), { target: { value: "100" } });

  expect(input(1)).toHaveValue("990.00");
});
