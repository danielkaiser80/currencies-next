import { Box, InputLabel, MenuItem, Select } from "@mui/material";

interface SelectProps {
  isoCodes: string[];
  label: string;
  value: string;
  onSelect: (label: string) => void;
}

const CurrencySelect = ({ isoCodes, label, value, onSelect }: SelectProps) => {
  const idLabel = `${label}label`;

  return (
    <Box sx={{ minWidth: 120 }}>
      <InputLabel id={idLabel}>{label}</InputLabel>
      <Select
        id={label}
        labelId={idLabel}
        value={value}
        onChange={(e) => onSelect(e.target.value)}
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
