import { render } from "@testing-library/react";
import Home from "../pages";

test("renders heading", () => {
  const { getByText } = render(<Home isoCodes={["EUR", "USD"]} />);
  const headingElement = getByText(/Währungsrechner/i);
  expect(headingElement).toBeInTheDocument();
});
