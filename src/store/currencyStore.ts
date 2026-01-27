import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CurrencyCode } from '@lib/utils/currency';
import { DEFAULT_CURRENCY } from '@lib/utils/currency';

interface CurrencyState {
    currency: CurrencyCode;
    setCurrency: (currency: CurrencyCode) => void;
}

export const useCurrencyStore = create<CurrencyState>()(
    persist(
        (set) => ({
            currency: DEFAULT_CURRENCY,
            setCurrency: (currency: CurrencyCode) => set({ currency }),
        }),
        {
            name: 'Storiofy_currency_settings',
        }
    )
);
