import React from "react";

interface ValueProps {
    value: number
}

const Value = (props: ValueProps) =>
    (
        <span>
            {props.value.toLocaleString(undefined, {maximumFractionDigits: 2})}
        </span>
    )

export default Value;
