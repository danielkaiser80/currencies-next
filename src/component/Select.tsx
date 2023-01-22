import React from "react";
import { useSelector } from "react-redux";
import { selectCurrencies } from "../app/store";

interface SelectProps {
  onSelect: (label: string) => void;
}

const Select: React.FC<SelectProps> = ({ onSelect }) => {
  const currencyValues: Array<string> = useSelector(selectCurrencies);

  return (
    <select onChange={(e) => onSelect(e.currentTarget.value)}>
      {currencyValues.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </select>
  );
};

export default Select;
