import React, {useEffect} from "react";
import {defaultCode, fetchAllCurrencies} from "../service/BackendService";

interface SelectProps {
    onSelect: (label: string) => void
}

const Select = (props: SelectProps) => {
    const [loading, setLoading] = React.useState(true);
    const [currencyValues, setCurrencyValues] = React.useState<Array<{ label: string }>>([{label: "Loading ..."}]);

    useEffect(() => {
        fetchAllCurrencies().then(currencies => {
            if (currencies) {
                const loadedCurrencies = currencies.map((currencyValue) => ({label: currencyValue.isoCode}));
                loadedCurrencies.unshift({label: defaultCode});
                setCurrencyValues(loadedCurrencies)
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
