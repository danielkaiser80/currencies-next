import React from "react";
import Select from "./Select";
import Value from "./Value";

const Calculator = () => {
  const firstValue = 0;
  const secondValue = 0;

  return (
    <div>
      <div>
        1. Währung:
        {/* eslint-disable-next-line no-console */}
        <Select onSelect={(label) => console.log("selected first ", label)} />
        <input name="firstValue" />
        umgerechnet: <Value value={firstValue} />
      </div>

      <div>
        2. Währung:
        {/* eslint-disable-next-line no-console */}
        <Select onSelect={(label) => console.log("selected second ", label)} />
        <input name="secondValue" />
        umgerechnet: <Value value={secondValue} />
      </div>
    </div>
  );
};

export default Calculator;
