//
// - mit Hilfe von 2 Dropdowns soll man die umzurechnenden Währungen auswählen können
//
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
import {fetchAllCurrencies, fetchCurrencyForSymbol} from "../service/BackendService";

const Calculator = () => {
    return <div></div>
}

fetchAllCurrencies().then(currencies => {
    if (currencies)
        console.log(currencies);
});

fetchCurrencyForSymbol('ZAR').then(currency => {
    if (currency)
        console.log(currency);
});

export default Calculator;
