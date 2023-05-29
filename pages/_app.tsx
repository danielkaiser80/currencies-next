import "../styles/global.css";
import "../styles/app.css";

import { AppProps } from "next/app";

const App = ({ Component, pageProps }: AppProps) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Component {...pageProps} />
);

export default App;
