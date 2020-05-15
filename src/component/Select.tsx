import React, {useEffect} from "react";
import {fetchAllCurrencies} from "../service/BackendService";


const Select = () => {
    const [currencyValues, setCurrencyValues] = React.useState<Array<{ label: string, value: number }>>([]);

    useEffect(() => {
        fetchAllCurrencies().then(currencies => {
            if (currencies)
                setCurrencyValues(currencies.map((currencyValue, index) => ({label: currencyValue.isoCode, value: index})))
        })
    }, [])

    return <select>
        {currencyValues.map(item => (
            <option
                key={item.value}
                value={item.value}
            >
                {item.label}
            </option>
        ))}
    </select>
}

export default Select;
