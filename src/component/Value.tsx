import React from "react";

interface ValueProps {
  value: number;
}

const Value = ({ value }: ValueProps) => (
  <span>{value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
);

export default Value;
