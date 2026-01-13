import apiClient from './client';
import { getSessionId } from '../utils/session';

export interface CartItemResponse {
    id: string;
    bookId?: string;
    bookTitle?: string;
    bookSlug?: string;
    bookCoverImageUrl?: string;
    personalizationId?: string;
    personalizationChildFirstName?: string;
    personalizationChildAge?: number;
    personalizationChildPhotoUrl?: string;
    quantity: number;
    languageCode: string;
    unitPrice: number;
    totalPrice: number;
    discountAmount: number;
}

export interface CartTotals {
    subtotal: number;
    discount: number;
    shipping: number;
    tax: number;
    total: number;
}

export interface CartResponse {
    items: CartItemResponse[];
    totals: CartTotals;
    itemCount: number;
}

export interface AddCartItemRequest {
    bookId?: string;
    personalizationId?: string;
    quantity: number;
    languageCode?: string;
}

export interface UpdateCartItemRequest {
    quantity: number;
}

export interface CartCountResponse {
    count: number;
    totalItems: number;
}

/**
 * Get cart items and totals
 */
export async function getCart(): Promise<CartResponse> {
    const sessionId = getSessionId();
    const response = await apiClient.get<CartResponse>('/cart', {
        headers: {
            'X-Session-Id': sessionId,
        },
    });
    return response.data;
}

/**
 * Add item to cart
 */
export async function addCartItem(request: AddCartItemRequest): Promise<CartItemResponse> {
    const sessionId = getSessionId();
    const response = await apiClient.post<CartItemResponse>('/cart/items', request, {
        headers: {
            'X-Session-Id': sessionId,
        },
    });
    return response.data;
}

/**
 * Update cart item quantity
 */
export async function updateCartItem(
    itemId: string,
    request: UpdateCartItemRequest
): Promise<CartItemResponse> {
    const sessionId = getSessionId();
    const response = await apiClient.put<CartItemResponse>(`/cart/items/${itemId}`, request, {
        headers: {
            'X-Session-Id': sessionId,
        },
    });
    return response.data;
}

/**
 * Remove item from cart
 */
export async function removeCartItem(itemId: string): Promise<void> {
    const sessionId = getSessionId();
    await apiClient.delete(`/cart/items/${itemId}`, {
        headers: {
            'X-Session-Id': sessionId,
        },
    });
}

/**
 * Clear entire cart
 */
export async function clearCart(): Promise<void> {
    const sessionId = getSessionId();
    await apiClient.post(
        '/cart/clear',
        {},
        {
            headers: {
                'X-Session-Id': sessionId,
            },
        }
    );
}

/**
 * Get cart item count
 */
export async function getCartCount(): Promise<CartCountResponse> {
    const sessionId = getSessionId();
    const response = await apiClient.get<CartCountResponse>('/cart/count', {
        headers: {
            'X-Session-Id': sessionId,
        },
    });
    return response.data;
}

/**
 * Merge guest cart into user cart (after login)
 */
export async function mergeCarts(sessionId: string): Promise<void> {
    await apiClient.post(
        '/cart/merge',
        {},
        {
            headers: {
                'X-Session-Id': sessionId,
            },
        }
    );
}




