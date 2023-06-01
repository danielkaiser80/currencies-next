import { ChangeEvent, useState } from "react";
import { Paper } from "@mui/material";

import { useImmer } from "use-immer";
import CurrencyElement from "./CurrencyElement";
import {
  DEFAULT_CODE,
  fetchCurrencyForSymbol,
} from "../service/BackendService";
import { HTMLNumericElement } from "./NumericInput";
import type { HomeProps } from "../pages";

type NullableNumber = number | null;
type CalculatorProps = HomeProps;

const Calculator = ({ isoCodes }: CalculatorProps) => {
  const [values, setValues] = useState<[NullableNumber, NullableNumber]>([
    null,
    null,
  ]);
  const [selectedCurrencies, updateSelectedCurrencies] = useImmer([
    DEFAULT_CODE,
    DEFAULT_CODE,
  ]);
  const [exchangeRates, updateExchangeRate] = useImmer([1, 1]);

  const handleInputChange = (e: ChangeEvent<HTMLNumericElement>) => {
    const { name, value } = e.target;

    if (!value) {
      setValues([null, null]);
      return;
    }

    if (selectedCurrencies[0] === selectedCurrencies[1]) {
      setValues([value, value]);
      return;
    }

    // the name is `input_${index}`
    const index = parseInt(name.slice(-1), 10);
    const otherValue =
      (value / exchangeRates[index]) * exchangeRates[1 - index];

    setValues(() => (index === 0 ? [value, otherValue] : [otherValue, value]));
  };

  const handleCurrencyChange = (label: string, index: number) => {
    updateSelectedCurrencies((draft) => {
      draft[index] = label;
    });
    setValues([null, null]);

    fetchCurrencyForSymbol(label)
      .then((rate) => {
        updateExchangeRate((draft) => {
          draft[index] = rate.value;
        });
      })
      .catch((reason) => {
        console.error(reason);
        // reset the exchange rate
        updateExchangeRate([1, 1]);
      });
  };

  return (
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
        />
      ))}
    </Paper>
  );
};

export default Calculator;
