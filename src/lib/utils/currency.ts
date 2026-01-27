export type CurrencyCode = 'USD' | 'THB' | 'INR';

export interface CurrencyConfig {
    code: CurrencyCode;
    symbol: string;
    name: string;
}

export const SUPPORTED_CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
    USD: {
        code: 'USD',
        symbol: '$',
        name: 'US Dollar',
    },
    THB: {
        code: 'THB',
        symbol: '฿',
        name: 'Thai Baht',
    },
    INR: {
        code: 'INR',
        symbol: '₹',
        name: 'Indian Rupee',
    },
};

export const DEFAULT_CURRENCY: CurrencyCode = 'USD';

export const getCurrencySymbol = (code: CurrencyCode): string => {
    return SUPPORTED_CURRENCIES[code]?.symbol || '$';
};

export const formatPrice = (amount: number, code: CurrencyCode): string => {
    const symbol = getCurrencySymbol(code);
    return `${symbol}${amount.toLocaleString()}`;
};
