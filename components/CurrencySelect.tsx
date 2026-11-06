import {
  Box,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
} from "@mui/material";
import {
  isLegacyCurrency,
  LEGACY_CURRENCIES,
} from "../service/LegacyCurrencies";

interface SelectProps {
  isoCodes: string[];
  label: string;
  value: string;
  onSelect: (label: string) => void;
}

const CurrencySelect = ({ isoCodes, label, value, onSelect }: SelectProps) => {
  const idLabel = `${label}label`;
  const legacyCodes = isoCodes.filter(isLegacyCurrency);

  return (
    <Box sx={{ minWidth: 120 }}>
      <InputLabel id={idLabel}>{label}</InputLabel>
      <Select
        id={label}
        labelId={idLabel}
        value={value}
        renderValue={(selected) => selected}
        onChange={(e) => onSelect(e.target.value)}
      >
        {isoCodes
          .filter((item) => !isLegacyCurrency(item))
          .map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        {legacyCodes.length > 0 && (
          <ListSubheader>Historische Währungen</ListSubheader>
        )}
        {legacyCodes.map((item) => (
          <MenuItem key={item} value={item}>
            {item} – {LEGACY_CURRENCIES[item].name}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

export default CurrencySelect;
