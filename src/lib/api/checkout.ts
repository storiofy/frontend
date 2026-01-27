import apiClient from './client';
import { getSessionId } from '../utils/session';

export interface AddressData {
    firstName: string;
    lastName: string;
    company?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    stateProvince?: string;
    postalCode: string;
    country: string;
    countryCode: string;
}

export interface CheckoutRequest {
    email: string;
    phone: string;
    shippingAddress: AddressData;
    billingAddress: AddressData;
    sameAsShipping: boolean;
    deliveryTypeId: string; // The selected delivery type ID from delivery-types API (REQUIRED)
    paymentMethod: 'cod';
    currencyCode?: string;
    notes?: string;
    latitude?: number;
    longitude?: number;
}

export interface AddressInfo {
    id: string;
    fullName: string;
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
}

export interface OrderItemResponse {
    id: string;
    bookId?: string;
    bookTitle?: string;
    bookSlug?: string;
    personalizationId?: string;
    quantity: number;
    unitPrice: number;
    discountPercentage: number;
    subtotal: number;
}

export interface OrderResponse {
    id: string;
    orderNumber: string;
    userId?: string;
    status: string;
    subtotal: number;
    shippingCost: number;
    tax: number;
    discount: number;
    total: number;
    currencyCode: string;
    shippingAddress: AddressInfo;
    billingAddress: AddressInfo;
    paymentMethod: string;
    paymentStatus: string;
    shippingMethod: string;
    trackingNumber?: string;
    estimatedDeliveryDate?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    items: OrderItemResponse[];
}

export interface CheckoutResponse {
    success: boolean;
    message: string;
    order: OrderResponse;
}

export interface ShippingMethod {
    id: string;
    name: string;
    description: string;
    price: number;
    estimatedDays: string;
    freeAbove?: number;
}

export interface ShippingOptions {
    methods: ShippingMethod[];
    freeShippingThreshold: number;
    taxRate: number;
}

export interface DeliveryType {
    id: string;
    name: string;
    description?: string;
    price: number;
    estimatedDays?: string;
    isActive?: boolean;
    code?: string; // Optional code field that might map to 'standard' or 'express'
    [key: string]: any; // Allow for additional properties from API
}

/**
 * Process checkout and create order
 */
export async function processCheckout(request: CheckoutRequest): Promise<CheckoutResponse> {
    const sessionId = getSessionId();
    const response = await apiClient.post<CheckoutResponse>('/checkout', request, {
        headers: {
            'X-Session-Id': sessionId,
        },
    });
    return response.data;
}

/**
 * Validate checkout data
 */
export async function validateCheckout(request: CheckoutRequest): Promise<{ valid: boolean; error?: string }> {
    const sessionId = getSessionId();
    const response = await apiClient.post<{ valid: boolean; error?: string }>('/checkout/validate', request, {
        headers: {
            'X-Session-Id': sessionId,
        },
    });
    return response.data;
}

/**
 * Get shipping options
 */
export async function getShippingOptions(countryCode: string = 'US', currency?: string): Promise<ShippingOptions> {
    const response = await apiClient.get<ShippingOptions>('/checkout/shipping-options', {
        params: { countryCode, currency },
    });
    return response.data;
}

/**
 * Get delivery types
 */
export async function getDeliveryTypes(currency?: string): Promise<DeliveryType[]> {
    const response = await apiClient.get<DeliveryType[]>('/delivery-types', {
        params: { currency }
    });
    return response.data;
}

/**
 * Get order by order number
 */
export async function getOrderByNumber(orderNumber: string): Promise<OrderResponse> {
    const response = await apiClient.get<OrderResponse>(`/orders/${orderNumber}`);
    return response.data;
}

/**
 * Get user orders
 */
export async function getUserOrders(page: number = 0, size: number = 10): Promise<{
    content: OrderResponse[];
    totalPages: number;
    totalElements: number;
}> {
    const response = await apiClient.get('/orders', {
        params: { page, size },
    });
    return response.data;
}

