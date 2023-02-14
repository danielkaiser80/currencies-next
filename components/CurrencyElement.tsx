import { Card } from "@mui/material";
import React from "react";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import CurrencySelect from "./CurrencySelect";
import NumericInput, { HTMLNumericElement } from "./NumericInput";

interface CurrencyElementProps {
  isoCodes: string[];
  selectedCurrency: string;
  label: string;
  inputName: string;
  value: number | null;
  onSelect: (isoCode: string) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLNumericElement>) => void;
}

const CurrencyElement = ({
  isoCodes,
  selectedCurrency,
  label,
  inputName,
  value,
  onSelect,
  handleInputChange,
}: CurrencyElementProps) => (
  <div>
    <Card square elevation={12} style={{ display: "inline-block" }}>
      <Grid container spacing={2} minHeight={160}>
        <Grid xs={6} display="flex" justifyContent="center" alignItems="center">
          <CurrencySelect
            label={label}
            value={selectedCurrency}
            onSelect={onSelect}
            isoCodes={isoCodes}
          />
        </Grid>
        <Grid xs={4} display="flex" justifyContent="center" alignItems="center">
          <NumericInput
            name={inputName}
            value={value}
            onChange={handleInputChange}
            decimalChar=","
            precision={2}
            thousandChar="."
          />
        </Grid>
      </Grid>
    </Card>
  </div>
);

export default CurrencyElement;
