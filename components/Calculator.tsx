import React, { ChangeEvent, useEffect, useState } from "react";
import { Paper } from "@mui/material";

import CurrencyElement from "./CurrencyElement";
import {
  defaultCode,
  fetchAllIsoCodes,
  fetchCurrencyForSymbol,
} from "../service/BackendService";
import { HTMLNumericElement } from "./NumericInput";

const Calculator = () => {
  const [values, setValues] = useState<[number | null, number | null]>([
    null,
    null,
  ]);
  const [selectedCurrencies, setSelectedCurrencies] = useState([
    defaultCode,
    defaultCode,
  ]);
  const [exchangeRates, setExchangeRate] = useState([1, 1]);
  const [isoCodes, setIsoCodes] = useState<string[]>(["EUR"]);

  useEffect(() => {
    fetchAllIsoCodes().then(setIsoCodes);
  }, []);

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

  const handleCurrencyChange = async (label: string, index: number) => {
    setSelectedCurrencies((prevState) => {
      const newState = [...prevState];
      newState[index] = label;
      return newState;
    });
    setValues([null, null]);

    const exchangeRate = (await fetchCurrencyForSymbol(label)).value;
    setExchangeRate((prevState) => {
      const newState = [...prevState];
      newState[index] = exchangeRate;
      return newState;
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
