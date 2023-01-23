import React, { ChangeEvent } from "react";
import { useSelector } from "react-redux";
import { Input } from "@mui/material";
import Select from "./Select";
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
        1. Währung:
        <Select
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
        2. Währung:
        <Select
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
