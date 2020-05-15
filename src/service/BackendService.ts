import axios from 'axios';

export interface Currency {
    isoCode: string;
    value: number;
}

export const fetchAllCurrencies = async () => {
    try {
        const response = await axios.get<Array<Currency>>('/currencies');
        return response.data;
    } catch (error) {
        // simply return empty array
        console.log(error);
        return [];
    }
};


export const fetchCurrencyForSymbol = async (symbol: string) => {
    return await axios.get<Currency>(`/currencies/${symbol}`);
};
