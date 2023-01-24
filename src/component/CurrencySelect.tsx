import React from "react";
import { useSelector } from "react-redux";
import { Box, InputLabel, MenuItem, Select } from "@mui/material";
import { selectCurrencies } from "../app/store";

interface SelectProps {
  label: string;
  value: string;
  onSelect: (label: string) => void;
}

const CurrencySelect: React.FC<SelectProps> = ({ label, value, onSelect }) => {
  const currencyValues = useSelector(selectCurrencies);
  const idLabel = `${label}label`;

  return (
    <Box sx={{ minWidth: 120 }}>
      <InputLabel id={idLabel}>{label}</InputLabel>
      <Select
        id={label}
        labelId={idLabel}
        value={value}
        onChange={(e) => onSelect(e.target.value as string)}
      >
        {currencyValues.map((item) => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

export default CurrencySelect;
