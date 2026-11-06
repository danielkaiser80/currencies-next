import { ChangeEvent, useRef, useState } from "react";
import { Alert, Button, Paper } from "@mui/material";

import useSWR from "swr";
import { useImmer } from "use-immer";
import CurrencyElement from "./CurrencyElement";
import {
  DEFAULT_CODE,
  fetchAllIsoCodes,
  fetchCurrencyForSymbol,
} from "../service/BackendService";
import { HTMLNumericElement } from "./NumericInput";
import type { HomeProps } from "../pages";

type NullableNumber = number | null;
type CalculatorProps = HomeProps;

const Calculator = ({ isoCodes: initialIsoCodes }: CalculatorProps) => {
  // the page is built statically, so check the backend again in the browser
  const { data: isoCodes = initialIsoCodes, error: backendError } = useSWR(
    "isoCodes",
    fetchAllIsoCodes,
    { fallbackData: initialIsoCodes, revalidateOnMount: true },
  );
  const [values, setValues] = useState<[NullableNumber, NullableNumber]>([
    null,
    null,
  ]);
  const [selectedCurrencies, updateSelectedCurrencies] = useImmer([
    DEFAULT_CODE,
    DEFAULT_CODE,
  ]);
  // a rate is null while it is loading or after loading it failed
  const [exchangeRates, updateExchangeRate] = useImmer<
    [NullableNumber, NullableNumber]
  >([1, 1]);
  const [failedCurrencies, updateFailedCurrencies] = useImmer<
    [string | null, string | null]
  >([null, null]);
  const latestRequests = useRef([0, 0]);

  const sameCurrency = selectedCurrencies[0] === selectedCurrencies[1];
  const canConvert =
    sameCurrency || (exchangeRates[0] !== null && exchangeRates[1] !== null);

  const handleInputChange = (e: ChangeEvent<HTMLNumericElement>) => {
    const { name, value } = e.target;

    if (!value) {
      setValues([null, null]);
      return;
    }

    if (sameCurrency) {
      setValues([value, value]);
      return;
    }

    // the name is `input_${index}`
    const index = Number.parseInt(name.slice(-1), 10);
    const rate = exchangeRates[index];
    const otherRate = exchangeRates[1 - index];
    if (rate === null || otherRate === null) {
      return;
    }
    const otherValue = (value / rate) * otherRate;

    setValues(() => (index === 0 ? [value, otherValue] : [otherValue, value]));
  };

  const loadExchangeRate = (label: string, index: number) => {
    updateExchangeRate((draft) => {
      draft[index] = null;
    });
    updateFailedCurrencies((draft) => {
      draft[index] = null;
    });

    latestRequests.current[index] += 1;
    const request = latestRequests.current[index];

    fetchCurrencyForSymbol(label)
      .then((rate) => {
        // ignore the response if another currency was selected in the meantime
        if (latestRequests.current[index] !== request) {
          return;
        }
        updateExchangeRate((draft) => {
          draft[index] = rate.value;
        });
      })
      .catch((reason) => {
        console.error(reason);
        if (latestRequests.current[index] !== request) {
          return;
        }
        updateFailedCurrencies((draft) => {
          draft[index] = label;
        });
      });
  };

  const handleCurrencyChange = (label: string, index: number) => {
    updateSelectedCurrencies((draft) => {
      draft[index] = label;
    });
    setValues([null, null]);
    loadExchangeRate(label, index);
  };

  const retryFailedCurrency = (code: string) => {
    failedCurrencies.forEach((failedCode, index) => {
      if (failedCode === code) {
        loadExchangeRate(code, index);
      }
    });
  };

  const failedCodes = Array.from(
    new Set(failedCurrencies.filter((code) => code !== null)),
  );

  return (
    <>
      {backendError && (
        <Alert severity="warning">
          Der Server ist nicht erreichbar, daher sind keine aktuellen Kurse
          verfügbar. Die historischen Währungen funktionieren weiterhin.
        </Alert>
      )}
      {failedCodes.map((code) => (
        <Alert
          key={code}
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => retryFailedCurrency(code)}
            >
              Erneut versuchen
            </Button>
          }
        >
          Der Kurs für {code} konnte nicht geladen werden. Bitte später erneut
          versuchen.
        </Alert>
      ))}
      <Paper square elevation={5}>
        {[0, 1].map((index) => (
          <CurrencyElement
            key={`currency ${index}`}
            selectedCurrency={selectedCurrencies[index]}
            onSelect={(label) => handleCurrencyChange(label, index)}
            value={values[index]}
            handleInputChange={handleInputChange}
            label={`${index + 1}. Währung`}
            inputName={`input_${index}`}
            isoCodes={isoCodes}
            inputDisabled={!canConvert}
          />
        ))}
      </Paper>
    </>
  );
};

export default Calculator;
