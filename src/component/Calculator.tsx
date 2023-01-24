import React, { ChangeEvent } from "react";
import { useSelector } from "react-redux";
import { Paper } from "@mui/material";
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
      {[0, 1].map((index) => (
        <CurrencyElement
          key={`currency ${index}`}
          selectedCurrency={selectedCurrencies[index]}
          onSelect={(label) => handleCurrencyChange(label, index)}
          value={values[index]}
          handleInputChange={handleInputChange}
          label={`${index + 1} Währung`}
          inputName={`input_${index}`}
        />
      ))}
    </Paper>
  );
};

export default Calculator;
