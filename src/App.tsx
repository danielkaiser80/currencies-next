import React from 'react';
import logo from './logo.svg';
import './App.css';
import {fetchAllCurrencies, fetchCurrencyForSymbol} from "./service/BackendService";

function App() {

    fetchAllCurrencies().then(currencies => {
        if (currencies)
            console.log(currencies);
    });

    fetchCurrencyForSymbol('ZAR').then(currency => {
        if (currency)
            console.log(currency);
    });

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default App;
