import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import App from "../pages";
import store from "../app/store";

test("renders heading", () => {
  const { getByText } = render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  const headingElement = getByText(/Währungsrechner/i);
  expect(headingElement).toBeInTheDocument();
});
