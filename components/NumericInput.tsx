import type { TextFieldProps } from "@mui/material";
import { TextField } from "@mui/material";
import { ChangeEvent, KeyboardEvent, useMemo } from "react";

export interface HTMLNumericElement
  extends Omit<HTMLInputElement, "value" | "name"> {
  value: number | "" | null;
  name: string;
}

export type NumericInputProps = Omit<TextFieldProps, "onChange"> & {
  precision: number;
  thousandChar: string;
  decimalChar: string;
  value: number | string | null;
  name: string;
  onChange: (e: ChangeEvent<HTMLNumericElement>) => void;
};

const verifyNumber = (string: string) => {
  const numericRepresentation = string.replace(/[,.]/g, "");

  return {
    isNumber: !Number.isNaN(Number(numericRepresentation)),
    numberFormat: !Number.isNaN(Number(numericRepresentation))
      ? Number(numericRepresentation)
      : null,
  };
};

const allowedKeys = [
  "Backspace",
  "Enter",
  "Tab",
  "Delete",
  "ArrowLeft",
  "ArrowRight",
  "U+007F", // 'forward delete on macOS'
];

type KeyEventE = KeyboardEvent<HTMLInputElement>;

const shouldIgnoreKeyPress = (e: KeyEventE) =>
  e.ctrlKey || e.shiftKey || e.metaKey || allowedKeys.includes(e.key);

const handleKeyDown = (e: KeyEventE): void => {
  if (e.key === " ") e.preventDefault();

  if (shouldIgnoreKeyPress(e)) {
    return;
  }

  if (!verifyNumber(e.key).isNumber) e.preventDefault();
};
const NumericInput = ({
  value = null,
  precision,
  thousandChar,
  decimalChar,
  name,
  onChange,
  ...inputProps
}: NumericInputProps) => {
  const defaultValue = value === null ? NaN : Number(value);

  const formatter = useMemo(
    () =>
      // TODO make i18n here
      new Intl.NumberFormat("de-DE", {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      }),

    [thousandChar, decimalChar]
  );

  if (!decimalChar) {
    throw new Error("Decimal char should not be an empty string!");
  }
  if (!thousandChar) {
    throw new Error("Thousand char should not be an empty string!");
  }

  const format = (number: number) =>
    formatter
      .format(number)
      .replace(",", decimalChar)
      .replaceAll(".", thousandChar);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const newEvent: ChangeEvent<HTMLNumericElement> = {
      ...e,
      currentTarget: {
        ...e.currentTarget,
        name,
        value: 0,
      },
      target: {
        ...e.target,
        name,
        value: 0,
      },
    };
    let numericRepresentation = e.target.value;

    numericRepresentation = numericRepresentation.replaceAll(thousandChar, "");
    numericRepresentation = numericRepresentation.replace(decimalChar, "");

    if (numericRepresentation === "") {
      e.target.value = "";
      newEvent.target.value = null;
      newEvent.currentTarget.value = null;
      onChange(newEvent);
    }

    const { isNumber, numberFormat } = verifyNumber(numericRepresentation);
    if (isNumber && numberFormat) {
      const withPrecision = numberFormat / 10 ** precision;

      const formattedNumber = format(withPrecision);

      newEvent.target.value = withPrecision;
      newEvent.currentTarget.value = withPrecision;

      e.target.value = formattedNumber;

      onChange(newEvent);
    }
  };

  const hasValue = value !== null;
  let inputValue: string | null = "";

  if (hasValue) {
    if (Number.isNaN(defaultValue) || value === "") {
      inputValue = null;
    } else {
      inputValue = format(defaultValue);
    }
  }

  return (
    <TextField
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      value={inputValue}
      name={name}
      {...inputProps}
    />
  );
};

export default NumericInput;
