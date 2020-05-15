import React from 'react';
import logo from './logo.svg';
import './App.css';
import {fetchAllCurrencies, fetchCurrencyForSymbol} from "./service/BackendService";

function App() {

    fetchAllCurrencies().then(response => {
        if (response)
            console.log(response.data);
    });

    fetchCurrencyForSymbol('ZAR').then(response => {
        if (response)
            console.log(response.data);
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
