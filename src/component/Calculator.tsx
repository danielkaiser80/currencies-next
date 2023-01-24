import React, { ChangeEvent } from "react";
import { useSelector } from "react-redux";
import { Input, Paper } from "@mui/material";
import CurrencySelect from "./CurrencySelect";
import {
  calculateValue,
  fetchCurrencyValue,
  setCurrency,
} from "../currencies/recducer";
import {
  selectSelectedCurrencies,
  selectValues,
  useAppDispatch,
} from "../app/store";
import CurrencyElement from "./CurrencyElement";

const Calculator = () => {
  const dispatch = useAppDispatch();
  const values = useSelector(selectValues);
  const selectedCurrencies = useSelector(selectSelectedCurrencies);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    return dispatch(calculateValue({ name, value }));
  };

  const handleCurrencyChange = (label: string, index: number) => {
    dispatch(setCurrency({ label, index }));
    dispatch(fetchCurrencyValue({ symbol: label, index }));
  };

  return (
    <Paper>
      <CurrencyElement
        selectedCurrency={selectedCurrencies[0]}
        onSelect={(label) => handleCurrencyChange(label, 0)}
        value={values[0]}
        handleInputChange={handleInputChange}
        label="1. Währung"
        inputName="firstValue"
      />

      <div>
        <CurrencySelect
          label="2. Währung"
          value={selectedCurrencies[1]}
          onSelect={(label) => handleCurrencyChange(label, 1)}
        />

        <Input
          name="secondValue"
          value={values[1]}
          onChange={handleInputChange}
        />
      </div>
    </Paper>
  );
};

export default Calculator;
