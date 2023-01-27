import React from "react";
import { render } from "@testing-library/react";
import App from "../pages";

test("renders heading", () => {
  const { getByText } = render(<App />);
  const headingElement = getByText(/Währungsrechner/i);
  expect(headingElement).toBeInTheDocument();
});
