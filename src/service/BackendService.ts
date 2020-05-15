import axios from 'axios';

export async function fetchAllCurrencies() {
    try {
        return await axios.get('/currencies');
    } catch (error) {
        console.error(error);
    }
}

export async function fetchCurrencyForSymbol(symbol: string) {
    try {
        return await axios.get(`/currencies/${symbol}`);
    } catch (error) {
        console.error(error);
    }
}
