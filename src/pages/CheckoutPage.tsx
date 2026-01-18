import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getCart, type CartResponse } from '@lib/api/cart';
import { processCheckout, getShippingOptions, getDeliveryTypes, type CheckoutRequest, type ShippingOptions, type DeliveryType } from '@lib/api/checkout';
import { useAuthStore } from '@store/authStore';

// Fix Leaflet default marker icon issue
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

// Validation schema
const checkoutSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    phoneCountryCode: z.string().min(1, 'Country code is required'),
    phone: z.string().min(6, 'Please enter a valid phone number'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    company: z.string().optional(),
    addressLine1: z.string().min(1, 'Address is required'),
    addressLine2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    stateProvince: z.string().optional(),
    postalCode: z.string().min(1, 'Postal code is required'),
    country: z.string().min(1, 'Country is required'),
    countryCode: z.string().length(2, 'Country code must be 2 characters'),
    sameAsShipping: z.boolean(),
    // Billing address (only if different)
    billingFirstName: z.string().optional(),
    billingLastName: z.string().optional(),
    billingCompany: z.string().optional(),
    billingAddressLine1: z.string().optional(),
    billingAddressLine2: z.string().optional(),
    billingCity: z.string().optional(),
    billingStateProvince: z.string().optional(),
    billingPostalCode: z.string().optional(),
    billingCountry: z.string().optional(),
    billingCountryCode: z.string().optional(),
    deliveryTypeId: z.string().min(1, 'Delivery type is required'),
    notes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

// Phone country codes
const PHONE_COUNTRY_CODES = [
    { code: '+66', country: 'TH', name: 'Thailand', flag: '🇹🇭' },
    { code: '+91', country: 'IN', name: 'India', flag: '🇮🇳' },
    { code: '+1', country: 'US', name: 'USA', flag: '🇺🇸' },
];

// Country list
const COUNTRIES = [
    { code: 'TH', name: 'Thailand' },
    { code: 'IN', name: 'India' },
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'JP', name: 'Japan' },
    { code: 'SG', name: 'Singapore' },
];

// Map click handler component
function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
    useMapEvents({
        click: (e) => {
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

// Component to recenter map
function RecenterMap({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
}

// Draggable marker component
function DraggableMarker({ position, onDragEnd }: { position: [number, number]; onDragEnd: (lat: number, lng: number) => void }) {
    const markerRef = useRef<L.Marker>(null);

    const eventHandlers = {
        dragend() {
            const marker = markerRef.current;
            if (marker) {
                const newPos = marker.getLatLng();
                onDragEnd(newPos.lat, newPos.lng);
            }
        },
    };

    return (
        <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={position}
            ref={markerRef}
        />
    );
}

// Locate Me button component (appears on the map like Google Maps)
function LocateControl({ onLocate, isLocating }: { onLocate: () => void; isLocating: boolean }) {
    const map = useMap();

    useEffect(() => {
        // Create custom control
        const LocateButton = L.Control.extend({
            onAdd: function () {
                const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
                const button = L.DomUtil.create('a', '', container);
                button.href = '#';
                button.title = 'Use my current location';
                button.setAttribute('role', 'button');
                button.setAttribute('aria-label', 'Use my current location');
                button.style.cssText = 'display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; background: white; cursor: pointer; border-radius: 4px; box-shadow: 0 1px 4px rgba(0,0,0,0.3);';

                // Create the crosshair/target icon (like Google Maps)
                button.innerHTML = isLocating
                    ? '<svg style="width: 20px; height: 20px; animation: spin 1s linear infinite;" viewBox="0 0 24 24"><style>@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }</style><circle cx="12" cy="12" r="10" stroke="#7c3aed" stroke-width="3" fill="none" stroke-dasharray="31.4 31.4" stroke-linecap="round"/></svg>'
                    : '<svg style="width: 20px; height: 20px;" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></svg>';

                // Hover effect
                button.onmouseenter = () => {
                    if (!isLocating) button.style.background = '#f3f4f6';
                };
                button.onmouseleave = () => {
                    button.style.background = 'white';
                };

                L.DomEvent.disableClickPropagation(button);
                L.DomEvent.on(button, 'click', function (e) {
                    L.DomEvent.preventDefault(e);
                    if (!isLocating) onLocate();
                });

                return container;
            },
        });

        const locateControl = new LocateButton({ position: 'bottomright' });
        map.addControl(locateControl);

        return () => {
            map.removeControl(locateControl);
        };
    }, [map, onLocate, isLocating]);

    return null;
}

export default function CheckoutPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const [mapCoordinates, setMapCoordinates] = useState<{ lat: number; lng: number } | null>(null);
    const [isLocating, setIsLocating] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);

    // Default center (Bangkok, Thailand)
    const defaultCenter: [number, number] = [13.7563, 100.5018];

    // Fetch cart data
    const { data: cart, isLoading: cartLoading, error: cartError } = useQuery<CartResponse>({
        queryKey: ['cart'],
        queryFn: getCart,
    });

    // Fetch delivery types
    const { data: deliveryTypes, isLoading: deliveryTypesLoading } = useQuery<DeliveryType[]>({
        queryKey: ['delivery-types'],
        queryFn: getDeliveryTypes,
    });

    // Filter active delivery types
    const activeDeliveryTypes = deliveryTypes?.filter(dt => dt.isActive !== false) || [];

    // Fetch shipping options (for free shipping threshold and tax rate)
    const { data: shippingOptions } = useQuery<ShippingOptions>({
        queryKey: ['shipping-options'],
        queryFn: () => getShippingOptions('TH'),
    });

    // Form setup
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isValid },
    } = useForm<CheckoutFormData>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            email: user?.email || '',
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            phoneCountryCode: '+66', // Default to Thailand
            sameAsShipping: true,
            deliveryTypeId: '',
            country: 'Thailand',
            countryCode: 'TH',
        },
        mode: 'onChange',
    });

    const sameAsShipping = watch('sameAsShipping');
    const deliveryTypeId = watch('deliveryTypeId');
    const phoneCountryCode = watch('phoneCountryCode');

    // Debug form state
    useEffect(() => {
        console.log('[CheckoutPage] Form validation state:', {
            isValid,
            errors: Object.keys(errors),
            errorDetails: errors,
        });
    }, [isValid, errors]);

    // Calculate totals
    const subtotal = cart?.totals.subtotal || 0;
    const selectedDeliveryType = activeDeliveryTypes.find(dt => dt.id === deliveryTypeId);
    const shippingCost = selectedDeliveryType?.price || 0;
    const taxRate = shippingOptions?.taxRate || 0.10;
    const tax = subtotal * taxRate;
    const total = subtotal + shippingCost + tax;

    // Set default delivery type when they load
    useEffect(() => {
        if (activeDeliveryTypes.length > 0 && !deliveryTypeId) {
            const firstActive = activeDeliveryTypes[0];
            setValue('deliveryTypeId', firstActive.id);
        }
    }, [activeDeliveryTypes, deliveryTypeId, setValue]);

    // Reverse geocode using Nominatim (OpenStreetMap's free geocoding service)
    const reverseGeocode = async (lat: number, lng: number) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
                {
                    headers: {
                        'Accept-Language': 'en',
                    },
                }
            );
            const data = await response.json();

            if (data && data.address) {
                const addr = data.address;
                setSelectedAddress(data.display_name);

                // Update form fields
                const streetAddress = [addr.house_number, addr.road].filter(Boolean).join(' ') ||
                    addr.suburb || addr.neighbourhood || '';
                setValue('addressLine1', streetAddress);
                setValue('city', addr.city || addr.town || addr.village || addr.county || '');
                setValue('stateProvince', addr.state || addr.province || '');
                setValue('postalCode', addr.postcode || '');

                // Map country to our supported countries
                const countryName = addr.country || '';
                const matchedCountry = COUNTRIES.find(c =>
                    c.name.toLowerCase() === countryName.toLowerCase() ||
                    addr.country_code?.toUpperCase() === c.code
                );
                if (matchedCountry) {
                    setValue('country', matchedCountry.name);
                    setValue('countryCode', matchedCountry.code);
                } else {
                    setValue('country', countryName);
                    setValue('countryCode', addr.country_code?.toUpperCase() || 'TH');
                }
            }
        } catch (error) {
            console.error('Reverse geocoding failed:', error);
        }
    };

    // Search for address using Nominatim
    const searchAddress = async () => {
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&addressdetails=1`,
                {
                    headers: {
                        'Accept-Language': 'en',
                    },
                }
            );
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Address search failed:', error);
        } finally {
            setIsSearching(false);
        }
    };

    // Handle search result selection
    const handleSearchResultSelect = (result: any) => {
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        setMapCoordinates({ lat, lng });
        setSelectedAddress(result.display_name);
        setSearchResults([]);
        setSearchQuery('');

        // Update form fields from result
        if (result.address) {
            const addr = result.address;
            const streetAddress = [addr.house_number, addr.road].filter(Boolean).join(' ') ||
                addr.suburb || addr.neighbourhood || '';
            setValue('addressLine1', streetAddress);
            setValue('city', addr.city || addr.town || addr.village || addr.county || '');
            setValue('stateProvince', addr.state || addr.province || '');
            setValue('postalCode', addr.postcode || '');

            const countryName = addr.country || '';
            const matchedCountry = COUNTRIES.find(c =>
                c.name.toLowerCase() === countryName.toLowerCase() ||
                addr.country_code?.toUpperCase() === c.code
            );
            if (matchedCountry) {
                setValue('country', matchedCountry.name);
                setValue('countryCode', matchedCountry.code);
            }
        }
    };

    // Handle map click or marker drag
    const handleLocationSelect = (lat: number, lng: number) => {
        setMapCoordinates({ lat, lng });
        reverseGeocode(lat, lng);
    };

    // Checkout mutation
    const checkoutMutation = useMutation({
        mutationFn: processCheckout,
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            navigate(`/order-confirmation/${response.order.orderNumber}`);
        },
        onError: (error: any) => {
            console.error('[CheckoutPage] Checkout failed:', error);
            console.error('[CheckoutPage] Error response:', error.response);
            console.error('[CheckoutPage] Error response data:', error.response?.data);

            const errorMessage = error.response?.data?.error
                || error.response?.data?.message
                || error.message
                || 'Unknown error occurred';

            alert(`Checkout failed: ${errorMessage}`);
        },
    });

    // Get current location (called from map control)
    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const newCoords = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                setMapCoordinates(newCoords);
                setIsLocating(false);
                reverseGeocode(newCoords.lat, newCoords.lng);
            },
            (error) => {
                console.error('Error getting location:', error);
                setIsLocating(false);
                alert('Unable to get your location. Please select your address on the map or enter it manually.');
            }
        );
    };

    // Handle form submission
    const onSubmit = (data: CheckoutFormData) => {
        console.log('[CheckoutPage] onSubmit called with data:', data);
        console.log('[CheckoutPage] Form isValid:', isValid);
        console.log('[CheckoutPage] Form errors:', errors);

        const fullPhone = `${data.phoneCountryCode}${data.phone.replace(/^0+/, '')}`;

        const request: CheckoutRequest = {
            email: data.email,
            phone: fullPhone,
            shippingAddress: {
                firstName: data.firstName,
                lastName: data.lastName,
                company: data.company,
                addressLine1: data.addressLine1,
                addressLine2: data.addressLine2,
                city: data.city,
                stateProvince: data.stateProvince,
                postalCode: data.postalCode,
                country: data.country,
                countryCode: data.countryCode,
            },
            billingAddress: data.sameAsShipping
                ? {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    company: data.company,
                    addressLine1: data.addressLine1,
                    addressLine2: data.addressLine2,
                    city: data.city,
                    stateProvince: data.stateProvince,
                    postalCode: data.postalCode,
                    country: data.country,
                    countryCode: data.countryCode,
                }
                : {
                    firstName: data.billingFirstName || '',
                    lastName: data.billingLastName || '',
                    company: data.billingCompany,
                    addressLine1: data.billingAddressLine1 || '',
                    addressLine2: data.billingAddressLine2,
                    city: data.billingCity || '',
                    stateProvince: data.billingStateProvince,
                    postalCode: data.billingPostalCode || '',
                    country: data.billingCountry || '',
                    countryCode: data.billingCountryCode || '',
                },
            sameAsShipping: data.sameAsShipping,
            deliveryTypeId: data.deliveryTypeId,
            paymentMethod: 'cod',
            currencyCode: 'USD',
            notes: data.notes,
            latitude: mapCoordinates?.lat,
            longitude: mapCoordinates?.lng,
        };

        console.log('[CheckoutPage] Submitting checkout request:', request);
        checkoutMutation.mutate(request);
    };

    // Redirect if cart is empty
    useEffect(() => {
        if (!cartLoading && (!cart || cart.items.length === 0)) {
            navigate('/cart');
        }
    }, [cart, cartLoading, navigate]);

    if (cartLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (cartError || !cart || cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                        <Link to="/books" className="text-indigo-600 hover:text-indigo-700 font-medium">
                            Continue shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const mapCenter: [number, number] = mapCoordinates
        ? [mapCoordinates.lat, mapCoordinates.lng]
        : defaultCenter;

    return (
        <div className="min-h-screen bg-gray-50 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
                    <p className="text-gray-600 mt-2">Complete your order</p>
                </div>

                {/* Debug: Show validation errors */}
                {!isValid && Object.keys(errors).length > 0 && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
                        <h3 className="text-sm font-semibold text-red-800 mb-2">Please fix the following errors:</h3>
                        <ul className="text-sm text-red-600 space-y-1">
                            {Object.entries(errors).map(([field, error]) => (
                                <li key={field}>
                                    <strong>{field}:</strong> {error?.message?.toString() || 'Invalid'}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Forms */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Contact Information */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                    <span className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">1</span>
                                    Contact Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email Address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            {...register('email')}
                                            type="email"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            placeholder="your@email.com"
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Phone Number <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex gap-2">
                                            {/* Country Code Selector */}
                                            <div className="relative">
                                                <select
                                                    {...register('phoneCountryCode')}
                                                    className="appearance-none w-28 px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white pr-8"
                                                >
                                                    {PHONE_COUNTRY_CODES.map((country) => (
                                                        <option key={country.code} value={country.code}>
                                                            {country.flag} {country.code}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                            {/* Phone Number Input */}
                                            <input
                                                {...register('phone')}
                                                type="tel"
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                placeholder={phoneCountryCode === '+66' ? '812345678' : phoneCountryCode === '+91' ? '9876543210' : '5551234567'}
                                            />
                                        </div>
                                        {errors.phone && (
                                            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                                        )}
                                        <p className="mt-1 text-xs text-gray-500">
                                            {phoneCountryCode === '+66' && 'Thai mobile number (e.g., 812345678)'}
                                            {phoneCountryCode === '+91' && 'Indian mobile number (e.g., 9876543210)'}
                                            {phoneCountryCode === '+1' && 'US phone number (e.g., 5551234567)'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                    <span className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">2</span>
                                    Shipping Address
                                </h2>

                                {mapCoordinates && (
                                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl">
                                        <div className="flex items-start gap-2">
                                            <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <div>
                                                <p className="text-sm font-medium text-green-800">Location captured</p>
                                                {selectedAddress && (
                                                    <p className="text-sm text-green-700 mt-1">{selectedAddress}</p>
                                                )}
                                                <p className="text-xs text-green-600 mt-1">
                                                    Coordinates: {mapCoordinates.lat.toFixed(6)}, {mapCoordinates.lng.toFixed(6)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* OpenStreetMap with Leaflet */}
                                <div className="mb-6 rounded-xl overflow-hidden border border-gray-200">
                                    {/* Search Box */}
                                    <div className="p-3 bg-gray-50 border-b border-gray-200">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        searchAddress();
                                                    }
                                                }}
                                                placeholder="Search for an address..."
                                                className="w-full px-4 py-2 pr-24 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            />
                                            <button
                                                type="button"
                                                onClick={searchAddress}
                                                disabled={isSearching}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-sm rounded-md hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50"
                                            >
                                                {isSearching ? 'Searching...' : 'Search'}
                                            </button>
                                        </div>

                                        {/* Search Results */}
                                        {searchResults.length > 0 && (
                                            <div className="mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                                                {searchResults.map((result, index) => (
                                                    <button
                                                        key={index}
                                                        type="button"
                                                        onClick={() => handleSearchResultSelect(result)}
                                                        className="w-full text-left px-4 py-2 hover:bg-indigo-50 border-b border-gray-100 last:border-0"
                                                    >
                                                        <p className="text-sm text-gray-900 line-clamp-2">{result.display_name}</p>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Map Container */}
                                    <div className="h-60 w-full relative">
                                        <MapContainer
                                            center={mapCenter}
                                            zoom={15}
                                            style={{ height: '100%', width: '100%' }}
                                            scrollWheelZoom={true}
                                        >
                                            <TileLayer
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />
                                            <MapClickHandler onLocationSelect={handleLocationSelect} />
                                            <LocateControl onLocate={getCurrentLocation} isLocating={isLocating} />
                                            {mapCoordinates && (
                                                <>
                                                    <RecenterMap center={[mapCoordinates.lat, mapCoordinates.lng]} />
                                                    <DraggableMarker
                                                        position={[mapCoordinates.lat, mapCoordinates.lng]}
                                                        onDragEnd={handleLocationSelect}
                                                    />
                                                </>
                                            )}
                                        </MapContainer>
                                    </div>

                                    <div className="p-3 bg-gray-50 border-t border-gray-200">
                                        <p className="text-sm text-gray-600">
                                            📍 Click on the map or drag the marker to select your delivery location
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            First Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            {...register('firstName')}
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                        {errors.firstName && (
                                            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Last Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            {...register('lastName')}
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                        {errors.lastName && (
                                            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                                        )}
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Company (Optional)
                                        </label>
                                        <input
                                            {...register('company')}
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Address Line 1 <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            {...register('addressLine1')}
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            placeholder="Street address, P.O. box"
                                        />
                                        {errors.addressLine1 && (
                                            <p className="mt-1 text-sm text-red-600">{errors.addressLine1.message}</p>
                                        )}
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Address Line 2
                                        </label>
                                        <input
                                            {...register('addressLine2')}
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            placeholder="Apartment, suite, unit, building, floor"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            City <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            {...register('city')}
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                        {errors.city && (
                                            <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            State / Province
                                        </label>
                                        <input
                                            {...register('stateProvince')}
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Postal Code <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            {...register('postalCode')}
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                        {errors.postalCode && (
                                            <p className="mt-1 text-sm text-red-600">{errors.postalCode.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Country <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            {...register('countryCode')}
                                            onChange={(e) => {
                                                const selected = COUNTRIES.find(c => c.code === e.target.value);
                                                setValue('countryCode', e.target.value);
                                                setValue('country', selected?.name || '');
                                            }}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        >
                                            {COUNTRIES.map((country) => (
                                                <option key={country.code} value={country.code}>
                                                    {country.name}
                                                </option>
                                            ))}
                                        </select>
                                        <input type="hidden" {...register('country')} />
                                    </div>
                                </div>

                                {/* Same as shipping checkbox */}
                                <div className="mt-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            {...register('sameAsShipping')}
                                            type="checkbox"
                                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                        />
                                        <span className="text-sm text-gray-700">Billing address is the same as shipping</span>
                                    </label>
                                </div>
                            </div>

                            {/* Billing Address (if different) */}
                            {!sameAsShipping && (
                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Billing Address</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                            <input
                                                {...register('billingFirstName')}
                                                type="text"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                            <input
                                                {...register('billingLastName')}
                                                type="text"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                                            <input
                                                {...register('billingAddressLine1')}
                                                type="text"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                                            <input
                                                {...register('billingAddressLine2')}
                                                type="text"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                            <input
                                                {...register('billingCity')}
                                                type="text"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">State / Province</label>
                                            <input
                                                {...register('billingStateProvince')}
                                                type="text"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                                            <input
                                                {...register('billingPostalCode')}
                                                type="text"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                            <select
                                                {...register('billingCountryCode')}
                                                onChange={(e) => {
                                                    const selected = COUNTRIES.find(c => c.code === e.target.value);
                                                    setValue('billingCountryCode', e.target.value);
                                                    setValue('billingCountry', selected?.name || '');
                                                }}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            >
                                                <option value="">Select country</option>
                                                {COUNTRIES.map((country) => (
                                                    <option key={country.code} value={country.code}>
                                                        {country.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <input type="hidden" {...register('billingCountry')} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Shipping Method */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                    <span className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">3</span>
                                    Shipping Method
                                </h2>
                                {deliveryTypesLoading ? (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                        <span className="ml-3 text-gray-600">Loading shipping methods...</span>
                                    </div>
                                ) : !deliveryTypes || activeDeliveryTypes.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <p>No shipping methods available at the moment.</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-3">
                                            {activeDeliveryTypes.map((deliveryType) => (
                                                <label
                                                    key={deliveryType.id}
                                                    className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${deliveryTypeId === deliveryType.id
                                                        ? 'border-indigo-500 bg-indigo-50'
                                                        : 'border-gray-200 hover:border-indigo-300'
                                                        }`}
                                                    onClick={() => {
                                                        setValue('deliveryTypeId', deliveryType.id);
                                                    }}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <input
                                                            {...register('deliveryTypeId')}
                                                            type="radio"
                                                            value={deliveryType.id}
                                                            className="w-4 h-4 text-indigo-600"
                                                        />
                                                        <div>
                                                            <p className="font-medium text-gray-900">{deliveryType.name}</p>
                                                            {deliveryType.description && (
                                                                <p className="text-sm text-gray-500">{deliveryType.description}</p>
                                                            )}
                                                            {deliveryType.estimatedDays && (
                                                                <p className="text-xs text-gray-400 mt-1">
                                                                    Estimated delivery: {deliveryType.estimatedDays}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="font-medium text-gray-900">${deliveryType.price.toFixed(2)}</span>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                        {errors.deliveryTypeId && (
                                            <p className="mt-2 text-sm text-red-600">{errors.deliveryTypeId.message}</p>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                    <span className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">4</span>
                                    Payment Method
                                </h2>
                                <div className="p-4 border border-indigo-500 bg-indigo-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                                            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Cash on Delivery (COD)</p>
                                            <p className="text-sm text-gray-500">Pay when your order arrives</p>
                                        </div>
                                        <div className="ml-auto">
                                            <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <p className="mt-3 text-sm text-gray-500">
                                    ℹ️ More payment options coming soon (Credit/Debit Card, PromptPay, TrueMoney)
                                </p>
                            </div>

                            {/* Order Notes */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Notes (Optional)</h2>
                                <textarea
                                    {...register('notes')}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                    placeholder="Special instructions for delivery, gift messages, etc."
                                />
                            </div>
                        </div>

                        {/* Right Column - Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                                <p className="text-sm text-gray-500 mb-4">{cart.items.length} item{cart.items.length > 1 ? 's' : ''} in your order</p>

                                {/* Cart Items */}
                                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-1">
                                    {cart.items.map((item) => (
                                        <div key={item.id} className="bg-gray-50 rounded-xl p-3">
                                            <div className="flex gap-3">
                                                <img
                                                    src={item.bookCoverImageUrl || 'https://via.placeholder.com/60x80?text=Product'}
                                                    alt={item.bookTitle || 'Product'}
                                                    className="w-16 h-20 object-cover rounded-xl flex-shrink-0"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-gray-900 text-sm">
                                                        {item.bookTitle}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        Qty: {item.quantity} × ${item.unitPrice.toFixed(2)}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Language: {item.languageCode.toUpperCase()}
                                                    </p>
                                                    <p className="font-semibold text-gray-900 text-sm mt-1">${item.totalPrice.toFixed(2)}</p>
                                                </div>
                                            </div>

                                            {/* Personalization Details */}
                                            {item.personalizationId && (
                                                <div className="mt-2 pt-2 border-t border-gray-200">
                                                    <div className="flex items-center gap-2">
                                                        {item.personalizationChildPhotoUrl && (
                                                            <img
                                                                src={item.personalizationChildPhotoUrl}
                                                                alt={`Photo of ${item.personalizationChildFirstName || 'child'}`}
                                                                className="w-8 h-8 object-cover rounded-full border border-indigo-200"
                                                            />
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-medium text-indigo-600 flex items-center gap-1">
                                                                <span>✨</span> Personalized
                                                            </p>
                                                            {item.personalizationChildFirstName && (
                                                                <p className="text-xs text-gray-600">
                                                                    For: <span className="font-medium">{item.personalizationChildFirstName}</span>
                                                                    {item.personalizationChildAge !== undefined && (
                                                                        <span> ({item.personalizationChildAge} yrs)</span>
                                                                    )}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-gray-200 pt-4 space-y-3">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        {shippingCost === 0 ? (
                                            <span className="text-green-600 font-medium">FREE</span>
                                        ) : (
                                            <span>${shippingCost.toFixed(2)}</span>
                                        )}
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tax (10%)</span>
                                        <span>${tax.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-3">
                                        <div className="flex justify-between text-lg font-bold text-gray-900">
                                            <span>Total</span>
                                            <span>${total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={checkoutMutation.isPending || !isValid}
                                    className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                >
                                    {checkoutMutation.isPending ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                            </svg>
                                            Processing...
                                        </span>
                                    ) : (
                                        `Place Order • $${total.toFixed(2)}`
                                    )}
                                </button>

                                <p className="mt-4 text-xs text-gray-500 text-center">
                                    By placing your order, you agree to our{' '}
                                    <Link to="/support/privacy-policy" className="text-indigo-600 hover:underline">
                                        Terms & Privacy Policy
                                    </Link>
                                </p>

                                {/* Secure checkout badges */}
                                <div className="mt-6 flex items-center justify-center gap-4 text-gray-400">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                                    </svg>
                                    <span className="text-sm">Secure Checkout</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
