import React from "react";
import { Box, InputLabel, MenuItem, Select } from "@mui/material";

interface SelectProps {
  isoCodes: string[];
  label: string;
  value: string;
  onSelect: (label: string) => void;
}

const CurrencySelect: React.FC<SelectProps> = ({
  isoCodes,
  label,
  value,
  onSelect,
}) => {
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
        {isoCodes.map((item) => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

export default CurrencySelect;
