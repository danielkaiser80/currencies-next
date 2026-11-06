import { Card } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { ChangeEvent } from "react";
import CurrencySelect from "./CurrencySelect";
import NumericInput, { HTMLNumericElement } from "./NumericInput";

interface CurrencyElementProps {
  isoCodes: string[];
  selectedCurrency: string;
  label: string;
  inputName: string;
  value: number | null;
  inputDisabled: boolean;
  onSelect: (isoCode: string) => void;
  handleInputChange: (e: ChangeEvent<HTMLNumericElement>) => void;
}

const CurrencyElement = ({
  isoCodes,
  selectedCurrency,
  label,
  inputName,
  value,
  inputDisabled,
  onSelect,
  handleInputChange,
}: CurrencyElementProps) => (
  <div>
    <Card square elevation={12} sx={{ display: "inline-block", padding: 3 }}>
      <Grid
        container
        spacing={2}
        direction="row"
        justifyContent="center"
        alignItems="flex-end"
      >
        <Grid xs={6}>
          <CurrencySelect
            label={label}
            value={selectedCurrency}
            onSelect={onSelect}
            isoCodes={isoCodes}
          />
        </Grid>
        <Grid xs={4}>
          <NumericInput
            name={inputName}
            value={value}
            disabled={inputDisabled}
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
