import { Input, Paper } from "@mui/material";
import React from "react";
import CurrencySelect from "./CurrencySelect";

interface CurrencyElementProps {
  selectedCurrency: string;
  handleCurrencyChange: (label: string, index: number) => void;
  value: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => unknown;
}

const CurrencyElement = ({
  selectedCurrency,
  value,
  handleCurrencyChange,
  handleInputChange,
}: CurrencyElementProps) => (
  <Paper variant="outlined" square>
    <CurrencySelect
      label="1. Währung"
      value={selectedCurrency}
      onSelect={(label) => handleCurrencyChange(label, 0)}
    />
    <Input name="firstValue" value={value} onChange={handleInputChange} />
  </Paper>
);

export default CurrencyElement;
