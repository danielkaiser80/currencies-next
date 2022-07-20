import React, { ChangeEvent } from 'react';
import { defaultCode, fetchCurrencyForSymbol } from '../service/BackendService';
import Select from './Select';
import Value from './Value';

// FIXME own this by component and make array or better structure
let firstIsoCode: string | undefined;
let secondIsoCode: string | undefined;

function handleLabel(label: string, index: number) {
  if (index === 1) {
    firstIsoCode = label;
  }
  if (index === 2) {
    secondIsoCode = label;
  }
}

const Calculator = () => {
  const [firstValue, setFirstValue] = React.useState(0);
  const [secondValue, setSecondValue] = React.useState(0);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (firstIsoCode && secondIsoCode && e.target) {
      // read before handling promises, as this changes the event
      const newValue = parseFloat(e.target.value);
      const { name } = e.target;

      Promise.all([fetchCurrencyForSymbol(firstIsoCode),
        fetchCurrencyForSymbol(secondIsoCode)]).then((currencies) => {
        if (currencies) {
          const convertedValue = newValue / (currencies[0].data.value * currencies[1].data.value);
          if (name === 'firstValue') {
            setSecondValue(convertedValue);
          }

          if (name === 'secondValue') {
            setFirstValue(convertedValue);
          }
        }
      });
    }
  };

  handleLabel(defaultCode, 1);
  handleLabel(defaultCode, 2);

  return (
    <div>
      <div>
        1. Währung:
        <Select onSelect={(label) => handleLabel(label, 1)} />
        <input name="firstValue" onChange={handleInputChange} />
        umgerechnet:
        {' '}
        <Value value={firstValue} />
      </div>

      <div>
        2. Währung:
        <Select onSelect={(label) => handleLabel(label, 2)} />
        <input name="secondValue" onChange={handleInputChange} />
        umgerechnet:
        {' '}
        <Value value={secondValue} />
      </div>
    </div>
  );
};

export default Calculator;
