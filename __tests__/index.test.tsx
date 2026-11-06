import { render } from "@testing-library/react";
import Home from "../pages";

jest.mock("../service/BackendService", () => ({
  DEFAULT_CODE: "EUR",
  fetchAllIsoCodes: jest.fn().mockResolvedValue(["EUR", "USD"]),
}));

test("renders heading", () => {
  const { getByText } = render(<Home isoCodes={["EUR", "USD"]} />);
  const headingElement = getByText(/Währungsrechner/i);
  expect(headingElement).toBeInTheDocument();
});
