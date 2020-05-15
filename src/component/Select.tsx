import React, {useEffect} from "react";
import {fetchAllCurrencies} from "../service/BackendService";

interface SelectProps {
    onSelect: (label: string) => void
}

const Select = (props: SelectProps) => {
    const [loading, setLoading] = React.useState(true);
    const [currencyValues, setCurrencyValues] = React.useState<Array<{ label: string }>>([{label: "Loading ..."}]);

    useEffect(() => {
        fetchAllCurrencies().then(currencies => {
            if (currencies) {
                setCurrencyValues(currencies.map((currencyValue) => ({label: currencyValue.isoCode})))
                setLoading(false)
            }
        })
    }, [currencyValues, props])

    return <select disabled={loading} onChange={e => props.onSelect(e.currentTarget.value)}>
        {currencyValues.map(item => (
            <option
                key={item.label}
                value={item.label}
            >
                {item.label}
            </option>
        ))}
    </select>
}

export default Select;
