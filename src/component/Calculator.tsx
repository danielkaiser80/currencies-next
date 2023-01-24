import React, { ChangeEvent } from "react";
import { useSelector } from "react-redux";
import { Input, InputLabel } from "@mui/material";
import CurrencySelect from "./CurrencySelect";
import {
  calculateValue,
  fetchCurrencyValue,
  setFirstCurrency,
  setSecondCurrency,
} from "../currencies/recducer";
import { selectValues, useAppDispatch } from "../app/store";

const Calculator = () => {
  const dispatch = useAppDispatch();
  const values = useSelector(selectValues);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    return dispatch(calculateValue({ name, value }));
  };

  return (
    <div>
      <div>
        <InputLabel>1. Währung:</InputLabel>
        <CurrencySelect
          onSelect={(label) => {
            dispatch(setFirstCurrency(label));
            dispatch(fetchCurrencyValue({ symbol: label, index: 0 }));
          }}
        />
        <Input
          name="firstValue"
          value={values[0]}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <InputLabel>2. Währung:</InputLabel>
        <CurrencySelect
          onSelect={(label) => {
            dispatch(setSecondCurrency(label));
            dispatch(fetchCurrencyValue({ symbol: label, index: 1 }));
          }}
        />
        <Input
          name="secondValue"
          value={values[1]}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default Calculator;
