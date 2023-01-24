import React, { ChangeEvent } from "react";
import { useSelector } from "react-redux";
import { Input, InputLabel } from "@mui/material";
import CurrencySelect from "./CurrencySelect";
import {
  calculateValue,
  fetchCurrencyValue,
  setCurrency,
} from "../currencies/recducer";
import { selectValues, useAppDispatch } from "../app/store";

const Calculator = () => {
  const dispatch = useAppDispatch();
  const values = useSelector(selectValues);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    return dispatch(calculateValue({ name, value }));
  };

  const handleCurrencyChange = (label: string, index: number) => {
    dispatch(setCurrency({ label, index }));
    dispatch(fetchCurrencyValue({ symbol: label, index }));
  };

  return (
    <div>
      <div>
        <InputLabel>1. Währung:</InputLabel>
        <CurrencySelect onSelect={(label) => handleCurrencyChange(label, 0)} />
        <Input
          name="firstValue"
          value={values[0]}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <InputLabel>2. Währung:</InputLabel>
        <CurrencySelect onSelect={(label) => handleCurrencyChange(label, 1)} />

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
