import React, { useEffect } from "react";
import { defaultCode, fetchAllCurrencies } from "../service/BackendService";

interface SelectProps {
  onSelect: (label: string) => void;
}

const Select: React.FC<SelectProps> = ({ onSelect }) => {
  const [loading, setLoading] = React.useState(true);
  const [currencyValues, setCurrencyValues] = React.useState<Array<string>>([
    "Loading ...",
  ]);

  useEffect(() => {
    fetchAllCurrencies().then((currencies) => {
      if (currencies) {
        const loadedCurrencies = currencies.map(({ isoCode }) => isoCode);
        loadedCurrencies.unshift(defaultCode);
        setCurrencyValues(loadedCurrencies);
        setLoading(false);
      }
    });
  }, [currencyValues]);

  return (
    <select
      disabled={loading}
      onChange={(e) => onSelect(e.currentTarget.value)}
    >
      {currencyValues.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </select>
  );
};

export default Select;
