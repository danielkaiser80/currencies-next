import { act, fireEvent, render, screen, within } from "@testing-library/react";
import Calculator from "../components/Calculator";
import { fetchCurrencyForSymbol } from "../service/BackendService";

jest.mock("../service/BackendService", () => ({
  DEFAULT_CODE: "EUR",
  fetchCurrencyForSymbol: jest.fn(),
}));

const fetchRate = jest.mocked(fetchCurrencyForSymbol);
const isoCodes = ["EUR", "USD", "CHF"];

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
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("converts with the loaded exchange rate", async () => {
  fetchRate.mockResolvedValue({ isoCode: "USD", value: 2 });
  render(<Calculator isoCodes={isoCodes} />);

  await select(1, "USD");
  fireEvent.change(input(0), { target: { value: "12" } });

  expect(input(0)).toHaveValue("0.12");
  expect(input(1)).toHaveValue("0.24");
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

test("shows an error instead of converting when loading a rate fails", async () => {
  fetchRate.mockRejectedValue(new Error("Network Error"));
  render(<Calculator isoCodes={isoCodes} />);

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
  render(<Calculator isoCodes={isoCodes} />);

  await select(1, "USD");
  await select(1, "CHF");
  fireEvent.change(input(0), { target: { value: "100" } });

  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  expect(input(1)).toHaveValue("4.00");
});

test("loads the rate again when retrying after a failure", async () => {
  fetchRate.mockRejectedValueOnce(new Error("Network Error"));
  fetchRate.mockResolvedValueOnce({ isoCode: "USD", value: 2 });
  render(<Calculator isoCodes={isoCodes} />);

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
  render(<Calculator isoCodes={isoCodes} />);

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
  render(<Calculator isoCodes={isoCodes} />);

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
  render(<Calculator isoCodes={isoCodes} />);

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
  render(<Calculator isoCodes={isoCodes} />);

  await select(1, "USD");
  await select(1, "CHF");
  await act(async () => resolveUsd({ isoCode: "USD", value: 2 }));
  fireEvent.change(input(0), { target: { value: "100" } });

  expect(input(1)).toHaveValue("4.00");
});

test("shows an error when no currencies are available", () => {
  render(<Calculator isoCodes={[]} />);

  expect(screen.getByRole("alert")).toHaveTextContent(
    "Die Währungen konnten nicht geladen werden",
  );
});
