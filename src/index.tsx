import "../styles/global.css";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import App from "../pages";
import store from "../app/store";
import { fetchCurrencies } from "../app/recducer";
import { StrictMode } from "react";

async function main() {
  store.dispatch(fetchCurrencies());

  const container = document.getElementById("root");
  if (!container) throw new Error("Failed to find the root element");

  const root = createRoot(container);

  root.render(
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>
  );
}

main().then(() => console.log("Started app"));
