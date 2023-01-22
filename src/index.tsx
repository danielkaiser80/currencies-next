import React from "react";
import "./index.css";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import App from "./App";
import store from "./app/store";
import { fetchCurrencies } from "./currencies/recducer";

async function main() {
  store.dispatch(fetchCurrencies());

  const container = document.getElementById("root");
  if (!container) throw new Error("Failed to find the root element");

  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  );
}

main().then(() => console.log("Started app"));
