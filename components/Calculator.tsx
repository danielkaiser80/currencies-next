import React, { ChangeEvent, useEffect, useState } from "react";
import { Paper } from "@mui/material";

import CurrencyElement from "./CurrencyElement";
import {
  defaultCode,
  fetchAllIsoCodes,
  fetchCurrencyForSymbol,
} from "../service/BackendService";

const Calculator = () => {
  const [values, setValues] = useState(["", ""]);
  const [selectedCurrencies, setSelectedCurrencies] = useState([
    defaultCode,
    defaultCode,
  ]);
  const [exchangeRates, setExchangeRate] = useState([1, 1]);
  const [isoCodes, setIsoCodes] = useState<string[]>(["EUR"]);

  useEffect(() => {
    fetchAllIsoCodes().then(setIsoCodes);
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newValue = parseFloat(value.replace(/\./g, "").replace(/,/g, "."));

    if (Number.isNaN(newValue)) {
      return;
    }

    const options = { maximumFractionDigits: 2 };
    const stringValue = newValue.toLocaleString(undefined, options);
    if (selectedCurrencies[0] === selectedCurrencies[1]) {
      setValues([stringValue, stringValue]);

      return;
    }

    // the name is `input_${index}`
    const index = parseInt(name.slice(-1), 10);
    const otherIndex = 1 - index;

    values[index] = stringValue;
    values[otherIndex] = (
      (newValue / exchangeRates[index]) *
      exchangeRates[otherIndex]
    ).toLocaleString(undefined, options);
  };

  const handleCurrencyChange = async (label: string, index: number) => {
    setSelectedCurrencies((prevState) => {
      const newState = [...prevState];
      newState[index] = label;
      return newState;
    });
    setValues(["", ""]);

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
