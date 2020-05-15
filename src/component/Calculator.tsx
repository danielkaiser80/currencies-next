// - zusätzlich soll man mit Hilfe von 2 Eingabefeldern die Beträge der jeweils ausgewählten Währung eingeben können
//
// - während der Eingabe in eines der Felder soll das jeweils andere Feld den umgerechneten Betrag anzeigen
//
// - wenn das andere Feld bereits eine Eingabe enthält, soll sie überschrieben werden
//
// - die berechneten Werte sollen auf 2 Nachkommastellen gerundet werden
//
// - die Kurse, sowie die Währungen sollen vom Currencies-Server abgeholt werden

import React from "react";
import {fetchCurrencyForSymbol} from "../service/BackendService";
import Select from "./Select";


const Calculator = () =>
    <div>
        <div>1. Währung: <Select/></div>
        <div>2. Währung: <Select/></div>
    </div>

fetchCurrencyForSymbol('ZAR').then(currency => {
    if (currency)
        console.log(currency);
});

export default Calculator;
