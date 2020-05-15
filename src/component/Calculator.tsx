// - zusätzlich soll man mit Hilfe von 2 Eingabefeldern die Beträge der jeweils ausgewählten Währung eingeben können
//
// - während der Eingabe in eines der Felder soll das jeweils andere Feld den umgerechneten Betrag anzeigen
//
// - wenn das andere Feld bereits eine Eingabe enthält, soll sie überschrieben werden
//
// - die berechneten Werte sollen auf 2 Nachkommastellen gerundet werden
//
// - die Kurse, sowie die Währungen sollen vom Currencies-Server abgeholt werden

import React, {ChangeEvent} from "react";
import {fetchCurrencyForSymbol} from "../service/BackendService";
import Select from "./Select";

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

function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    if (firstIsoCode && secondIsoCode) {
        if (e.target.name === 'firstValue') {
            console.log('got first value');
        }

        if (e.target.name === 'secondValue') {
            console.log('got second value');
        }

    }
}

const Calculator = () => {
    return <div>
        <div>1. Währung:
            <Select onSelect={(label) => handleLabel(label, 1)}/>
            <input name="firstValue" onChange={handleInputChange}/>
        </div>

        <div>2. Währung:
            <Select onSelect={(label) => handleLabel(label, 2)}/>
            <input name="secondValue" onChange={handleInputChange}/>
        </div>
    </div>;
}

fetchCurrencyForSymbol('ZAR').then(currency => {
    if (currency)
        console.log(currency);
});

export default Calculator;
