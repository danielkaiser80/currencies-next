import React, {ChangeEvent} from "react";
import {defaultCode, fetchCurrencyForSymbol} from "../service/BackendService";
import Select from "./Select";
import Value from './Value';

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

    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
        if (firstIsoCode && secondIsoCode && e.target) {
            const firstPromise = fetchCurrencyForSymbol(firstIsoCode);
            const secondPromise = fetchCurrencyForSymbol(secondIsoCode);
            // read before handling promises, as this changes the event
            const newValue = parseFloat(e.target.value);
            const name = e.target.name;

            Promise.all([firstPromise, secondPromise]).then(currencies => {
                if (currencies) {
                    const convertedValue = newValue / currencies[0].data.value * currencies[1].data.value;
                    if (name === 'firstValue') {
                        setSecondValue(convertedValue);
                    }

                    if (name === 'secondValue') {
                        setFirstValue(convertedValue);
                    }
                }
            })
        }
    }

    const [firstValue, setFirstValue] = React.useState(0);
    const [secondValue, setSecondValue] = React.useState(0);

    handleLabel(defaultCode,1);
    handleLabel(defaultCode,2);

    return <div>
        <div>1. Währung:
            <Select onSelect={(label) => handleLabel(label, 1)}/>
            <input name="firstValue" onChange={handleInputChange}/>
            umgerechnet: <Value value={firstValue}/>
        </div>

        <div>2. Währung:
            <Select onSelect={(label) => handleLabel(label, 2)}/>
            <input name="secondValue" onChange={handleInputChange}/>
            umgerechnet: <Value value={secondValue}/>
        </div>
    </div>;
}

export default Calculator;
