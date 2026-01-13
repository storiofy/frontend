import { create } from 'zustand';

interface CartItem {
    id: string;
    bookId?: string;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    getItemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    addItem: (item) =>
        set((state) => {
            const existingItem = state.items.find((i) => i.id === item.id);
            if (existingItem) {
                return {
                    items: state.items.map((i) =>
                        i.id === item.id
                            ? { ...i, quantity: i.quantity + item.quantity }
                            : i
                    ),
                };
            }
            return {
                items: [...state.items, item],
            };
        }),
    removeItem: (id) =>
        set((state) => ({
            items: state.items.filter((i) => i.id !== id),
        })),
    updateQuantity: (id, quantity) =>
        set((state) => ({
            items: state.items.map((i) =>
                i.id === id ? { ...i, quantity } : i
            ),
        })),
    clearCart: () =>
        set({
            items: [],
        }),
    getItemCount: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.quantity, 0);
    },
}));

