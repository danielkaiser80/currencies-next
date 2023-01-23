import React, { ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "./Select";
import Value from "./Value";
import {
  calculateFirstValue,
  calculateSecondValue,
  setFirstCurrency,
  setSecondCurrency,
} from "../currencies/recducer";
import { selectValues } from "../app/store";

const Calculator = () => {
  const dispatch = useDispatch();
  const values = useSelector(selectValues);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    const newValue = parseFloat(value);
    if (name === "firstValue") dispatch(calculateFirstValue(newValue));
    if (name === "secondValue") dispatch(calculateSecondValue(newValue));
  };

  return (
    <div>
      <div>
        1. Währung:
        <Select onSelect={(label) => dispatch(setFirstCurrency(label))} />
        <input name="firstValue" onChange={handleInputChange} />
        umgerechnet: <Value value={values[0]} />
      </div>

      <div>
        2. Währung:
        <Select onSelect={(label) => dispatch(setSecondCurrency(label))} />
        <input name="secondValue" onChange={handleInputChange} />
        umgerechnet: <Value value={values[1]} />
      </div>
    </div>
  );
};

export default Calculator;
