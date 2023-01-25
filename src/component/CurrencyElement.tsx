import { Input, Paper } from "@mui/material";
import React from "react";
import CurrencySelect from "./CurrencySelect";

interface CurrencyElementProps {
  selectedCurrency: string;
  label: string;
  inputName: string;
  value: string;
  onSelect: (isoCode: string) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => unknown;
}

const CurrencyElement = ({
  selectedCurrency,
  label,
  inputName,
  value,
  onSelect,
  handleInputChange,
}: CurrencyElementProps) => (
  <Paper square elevation={12}>
    <CurrencySelect
      label={label}
      value={selectedCurrency}
      onSelect={onSelect}
    />
    <Input name={inputName} value={value} onChange={handleInputChange} />
  </Paper>
);

export default CurrencyElement;
