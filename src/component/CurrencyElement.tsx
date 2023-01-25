import { Card, Input } from "@mui/material";
import React from "react";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
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
  <div>
    <Card square elevation={12} style={{ display: "inline-block" }}>
      <Grid container spacing={2} minHeight={160}>
        <Grid xs={6} display="flex" justifyContent="center" alignItems="center">
          <CurrencySelect
            label={label}
            value={selectedCurrency}
            onSelect={onSelect}
          />
        </Grid>
        <Grid xs={4} display="flex" justifyContent="center" alignItems="center">
          <Input name={inputName} value={value} onChange={handleInputChange} />
        </Grid>
      </Grid>
    </Card>
  </div>
);

export default CurrencyElement;
