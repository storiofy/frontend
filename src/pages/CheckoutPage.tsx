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
import { useCurrencyStore } from '@store/currencyStore';
import { getCurrencySymbol } from '@lib/utils/currency';
import { MapPin, Mail, Landmark, Truck, CreditCard, ChevronRight, ArrowLeft, ShieldCheck, Search, Crosshair } from 'lucide-react';

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

const PHONE_COUNTRY_CODES = [
    { code: '+66', country: 'TH', name: 'Thailand', flag: '🇹🇭' },
    { code: '+91', country: 'IN', name: 'India', flag: '🇮🇳' },
    { code: '+1', country: 'US', name: 'USA', flag: '🇺🇸' },
];

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

function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
    useMapEvents({
        click: (e) => {
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

function RecenterMap({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
}

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

function LocateControl({ onLocate, isLocating }: { onLocate: () => void; isLocating: boolean }) {
    const map = useMap();

    useEffect(() => {
        const LocateButton = L.Control.extend({
            onAdd: function () {
                const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
                const button = L.DomUtil.create('a', '', container);
                button.href = '#';
                button.title = 'Use my current location';
                button.setAttribute('role', 'button');
                button.setAttribute('aria-label', 'Use my current location');
                button.style.cssText = 'display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; background: white; cursor: pointer; border-radius: 4px; border: none; box-shadow: 0 1px 4px rgba(0,0,0,0.3);';

                button.innerHTML = isLocating
                    ? '<svg style="width: 20px; height: 20px; animation: spin 1s linear infinite;" viewBox="0 0 24 24"><style>@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }</style><circle cx="12" cy="12" r="10" stroke="#ec4899" stroke-width="3" fill="none" stroke-dasharray="31.4 31.4" stroke-linecap="round"/></svg>'
                    : '<svg style="width: 20px; height: 20px;" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></svg>';

                button.onmouseenter = () => { if (!isLocating) button.style.background = '#f3f4f6'; };
                button.onmouseleave = () => { button.style.background = 'white'; };

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

        return () => { map.removeControl(locateControl); };
    }, [map, onLocate, isLocating]);

    return null;
}

export default function CheckoutPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const { currency } = useCurrencyStore();
    const [mapCoordinates, setMapCoordinates] = useState<{ lat: number; lng: number } | null>(null);
    const [isLocating, setIsLocating] = useState(false);
    const [, setSelectedAddress] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);

    const defaultCenter: [number, number] = [13.7563, 100.5018];

    const { data: cart, isLoading: cartLoading } = useQuery<CartResponse>({
        queryKey: ['cart', currency],
        queryFn: () => getCart(currency),
    });

    const { data: deliveryTypes } = useQuery<DeliveryType[]>({
        queryKey: ['delivery-types', currency],
        queryFn: () => getDeliveryTypes(currency),
    });

    const activeDeliveryTypes = deliveryTypes?.filter(dt => dt.isActive !== false) || [];

    const { data: shippingOptions } = useQuery<ShippingOptions>({
        queryKey: ['shipping-options', currency],
        queryFn: () => getShippingOptions('TH', currency),
    });

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
            phoneCountryCode: '+66',
            sameAsShipping: true,
            deliveryTypeId: '',
            country: 'Thailand',
            countryCode: 'TH',
        },
        mode: 'onChange',
    });

    const deliveryTypeId = watch('deliveryTypeId');

    const subtotal = cart?.totals.subtotal || 0;
    const selectedDeliveryType = activeDeliveryTypes.find(dt => dt.id === deliveryTypeId);
    const shippingCost = selectedDeliveryType?.price || 0;
    const taxRate = shippingOptions?.taxRate !== undefined ? shippingOptions.taxRate : 0.07;
    const tax = subtotal * taxRate;
    const total = subtotal + shippingCost + tax;

    useEffect(() => {
        if (activeDeliveryTypes.length > 0 && !deliveryTypeId) {
            const firstActive = activeDeliveryTypes[0];
            setValue('deliveryTypeId', firstActive.id);
        }
    }, [activeDeliveryTypes, deliveryTypeId, setValue]);

    const reverseGeocode = async (lat: number, lng: number) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`, { headers: { 'Accept-Language': 'en' } });
            const data = await response.json();
            if (data && data.address) {
                const addr = data.address;
                setSelectedAddress(data.display_name);
                const streetAddress = [addr.house_number, addr.road].filter(Boolean).join(' ') || addr.suburb || addr.neighbourhood || '';
                setValue('addressLine1', streetAddress);
                setValue('city', addr.city || addr.town || addr.village || addr.county || '');
                setValue('stateProvince', addr.state || addr.province || '');
                setValue('postalCode', addr.postcode || '');
                const matchedCountry = COUNTRIES.find(c => c.name.toLowerCase() === (addr.country || '').toLowerCase() || addr.country_code?.toUpperCase() === c.code);
                if (matchedCountry) {
                    setValue('country', matchedCountry.name);
                    setValue('countryCode', matchedCountry.code);
                }
            }
        } catch (error) { console.error('Reverse geocoding failed:', error); }
    };

    const searchAddress = async () => {
        if (!searchQuery.trim()) return;
        setIsSearching(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&addressdetails=1`, { headers: { 'Accept-Language': 'en' } });
            const data = await response.json();
            setSearchResults(data);
        } catch (error) { console.error('Address search failed:', error); } finally { setIsSearching(false); }
    };

    const handleSearchResultSelect = (result: any) => {
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        setMapCoordinates({ lat, lng });
        setSelectedAddress(result.display_name);
        setSearchResults([]);
        setSearchQuery('');
        if (result.address) {
            const addr = result.address;
            const streetAddress = [addr.house_number, addr.road].filter(Boolean).join(' ') || addr.suburb || addr.neighbourhood || '';
            setValue('addressLine1', streetAddress);
            setValue('city', addr.city || addr.town || addr.village || addr.county || '');
            setValue('stateProvince', addr.state || addr.province || '');
            setValue('postalCode', addr.postcode || '');
            const matchedCountry = COUNTRIES.find(c => c.name.toLowerCase() === (addr.country || '').toLowerCase() || addr.country_code?.toUpperCase() === c.code);
            if (matchedCountry) { setValue('country', matchedCountry.name); setValue('countryCode', matchedCountry.code); }
        }
    };

    const handleLocationSelect = (lat: number, lng: number) => {
        setMapCoordinates({ lat, lng });
        reverseGeocode(lat, lng);
    };

    const checkoutMutation = useMutation({
        mutationFn: processCheckout,
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            navigate(`/order-confirmation/${response.order.orderNumber}`);
        },
        onError: (error: any) => { alert(`Checkout failed: ${error.response?.data?.message || error.message}`); },
    });

    const getCurrentLocation = () => {
        if (!navigator.geolocation) { alert('Geolocation is not supported by your browser'); return; }
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const newCoords = { lat: position.coords.latitude, lng: position.coords.longitude };
                setMapCoordinates(newCoords);
                setIsLocating(false);
                reverseGeocode(newCoords.lat, newCoords.lng);
            },
            () => { setIsLocating(false); alert('Unable to get location'); }
        );
    };

    const onSubmit = (data: CheckoutFormData) => {
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
            currencyCode: currency,
            notes: data.notes,
            latitude: mapCoordinates?.lat,
            longitude: mapCoordinates?.lng,
        };
        checkoutMutation.mutate(request);
    };

    useEffect(() => {
        if (!cartLoading && (!cart || cart.items.length === 0)) { navigate('/cart'); }
    }, [cart, cartLoading, navigate]);

    if (cartLoading) {
        return (
            <div className="min-h-screen bg-pink-50/30 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
            </div>
        );
    }

    const mapCenter: [number, number] = mapCoordinates ? [mapCoordinates.lat, mapCoordinates.lng] : defaultCenter;
    const currencySymbol = getCurrencySymbol(currency);

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 py-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Link */}
                <Link
                    to="/cart"
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-pink-500 transition mb-6 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Bag
                </Link>

                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Checkout</h1>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Final magic details</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Forms Column */}
                        <div className="lg:col-span-8 space-y-6">

                            {/* 1. Contact Info */}
                            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-pink-50 text-pink-500 rounded-xl flex items-center justify-center">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-lg font-black text-gray-900">Who's Ordering?</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                                        <input {...register('email')} className="w-full h-11 px-5 rounded-xl border-2 border-gray-100 focus:border-pink-500 transition-all outline-none font-bold text-gray-900 text-sm focus:ring-4 focus:ring-pink-50" placeholder="hero@storiofy.com" />
                                        {errors.email && <p className="text-[10px] font-bold text-rose-500 mt-1 ml-1">{errors.email.message}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Phone Connection</label>
                                        <div className="flex gap-2">
                                            <select {...register('phoneCountryCode')} className="h-11 px-3 rounded-xl border-2 border-gray-100 focus:border-pink-500 transition-all outline-none font-bold text-gray-900 text-sm bg-white cursor-pointer">
                                                {PHONE_COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
                                            </select>
                                            <input {...register('phone')} className="flex-1 h-11 px-5 rounded-xl border-2 border-gray-100 focus:border-pink-500 transition-all outline-none font-bold text-gray-900 text-sm focus:ring-4 focus:ring-pink-50" placeholder="812345678" />
                                        </div>
                                        {errors.phone && <p className="text-[10px] font-bold text-rose-500 mt-1 ml-1">{errors.phone.message}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* 2. Destination */}
                            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-lg font-black text-gray-900">Where to Ship?</h2>
                                </div>

                                {/* Compact Map Section */}
                                <div className="mb-8 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                                    <div className="p-3 bg-gray-50 flex gap-2 border-b border-gray-100">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), searchAddress())}
                                                className="w-full h-10 pl-9 pr-3 rounded-lg border-none font-bold text-xs bg-white focus:ring-2 focus:ring-blue-400 transition-all outline-none"
                                                placeholder="Search building or street..."
                                            />
                                            {isSearching && <div className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin w-3 h-3 border-2 border-pink-500 border-t-transparent rounded-full" />}
                                        </div>
                                        <button type="button" onClick={getCurrentLocation} className="h-10 px-4 bg-white text-gray-900 rounded-lg font-bold text-[10px] uppercase tracking-widest border border-gray-200 hover:bg-gray-50 transition flex items-center gap-2">
                                            <Crosshair className="w-3.5 h-3.5" /> Locate
                                        </button>
                                    </div>

                                    {searchResults.length > 0 && (
                                        <div className="absolute z-[1001] left-10 right-10 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
                                            {searchResults.map((r, i) => (
                                                <button key={i} type="button" onClick={() => handleSearchResultSelect(r)} className="w-full text-left px-4 py-2.5 hover:bg-pink-50 transition text-xs font-medium text-gray-700">
                                                    {r.display_name}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    <div className="h-56 w-full relative z-[1]">
                                        <MapContainer center={mapCenter} zoom={15} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
                                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                            <MapClickHandler onLocationSelect={handleLocationSelect} />
                                            <LocateControl onLocate={getCurrentLocation} isLocating={isLocating} />
                                            {mapCoordinates && (
                                                <>
                                                    <RecenterMap center={[mapCoordinates.lat, mapCoordinates.lng]} />
                                                    <DraggableMarker position={[mapCoordinates.lat, mapCoordinates.lng]} onDragEnd={handleLocationSelect} />
                                                </>
                                            )}
                                        </MapContainer>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Receiver Name</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input {...register('firstName')} className="h-11 px-5 rounded-xl border-2 border-gray-100 focus:border-blue-500 transition-all outline-none font-bold text-gray-900 text-sm" placeholder="First Name" />
                                            <input {...register('lastName')} className="h-11 px-5 rounded-xl border-2 border-gray-100 focus:border-blue-500 transition-all outline-none font-bold text-gray-900 text-sm" placeholder="Last Name" />
                                        </div>
                                        {(errors.firstName || errors.lastName) && <p className="text-[10px] font-bold text-rose-500 mt-1 ml-1">Name is required</p>}
                                    </div>

                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Street Address</label>
                                        <input {...register('addressLine1')} className="w-full h-11 px-5 rounded-xl border-2 border-gray-100 focus:border-blue-500 transition-all outline-none font-bold text-gray-900 text-sm" placeholder="123 Magic Lane" />
                                        {errors.addressLine1 && <p className="text-[10px] font-bold text-rose-500 mt-1 ml-1">{errors.addressLine1.message}</p>}
                                    </div>

                                    <div className="space-y-1.5 md:col-span-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Apt/Suite (Optional)</label>
                                        <input {...register('addressLine2')} className="w-full h-11 px-5 rounded-xl border-2 border-gray-100 focus:border-blue-500 transition-all outline-none font-bold text-gray-900 text-sm" placeholder="Floor 4" />
                                    </div>

                                    <div className="space-y-1.5 md:col-span-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Country</label>
                                        <select {...register('countryCode')} onChange={(e) => { const s = COUNTRIES.find(c => c.code === e.target.value); setValue('countryCode', e.target.value); setValue('country', s?.name || ''); }} className="w-full h-11 px-5 rounded-xl border-2 border-gray-100 focus:border-blue-500 transition-all outline-none font-bold text-gray-900 text-sm bg-white cursor-pointer">
                                            {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 md:col-span-2">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">City</label>
                                            <input {...register('city')} className="w-full h-11 px-5 rounded-xl border-2 border-gray-100 focus:border-blue-500 transition-all outline-none font-bold text-gray-900 text-sm" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Zip/Postal Code</label>
                                            <input {...register('postalCode')} className="w-full h-11 px-5 rounded-xl border-2 border-gray-100 focus:border-blue-500 transition-all outline-none font-bold text-gray-900 text-sm" />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 md:col-span-2">
                                        <input {...register('sameAsShipping')} type="checkbox" className="w-5 h-5 rounded border-2 border-gray-200 text-pink-500 focus:ring-pink-500 cursor-pointer" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Billing matches shipping</span>
                                    </div>
                                </div>
                            </div>

                            {/* 3. Delivery Speed */}
                            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center">
                                        <Truck className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-lg font-black text-gray-900">Shipping Mode</h2>
                                </div>

                                <div className="space-y-3">
                                    {activeDeliveryTypes.map((dt) => (
                                        <label
                                            key={dt.id}
                                            className={`flex items-center gap-4 p-3.5 rounded-2xl border-2 transition-all cursor-pointer group/item ${deliveryTypeId === dt.id
                                                ? 'border-pink-500 bg-pink-50/30'
                                                : 'border-gray-50 bg-gray-50/50 hover:border-pink-100 hover:bg-white'
                                                }`}
                                            onClick={() => setValue('deliveryTypeId', dt.id)}
                                        >
                                            <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm transition-colors ${deliveryTypeId === dt.id ? 'text-pink-500' : 'text-gray-400 group-hover/item:text-pink-400'}`}>
                                                <Truck className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-black text-gray-900 text-sm">{dt.name}</p>
                                                    {deliveryTypeId === dt.id && <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse"></span>}
                                                </div>
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5">{dt.estimatedDays || 'Magic Delivery'}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-black text-gray-900 text-sm">{currencySymbol}{dt.price.toFixed(0)}</p>
                                            </div>
                                            <input type="radio" {...register('deliveryTypeId')} value={dt.id} className="hidden" />
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* 4. Payment */}
                            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center">
                                        <CreditCard className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-lg font-black text-gray-900">Payment</h2>
                                </div>

                                <div className="p-5 bg-gray-900 rounded-2xl text-white flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                                            <Landmark className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Selected Method</p>
                                            <p className="font-black text-base">Cash on Delivery</p>
                                        </div>
                                    </div>
                                    <ShieldCheck className="w-6 h-6 text-emerald-500" />
                                </div>
                            </div>

                            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 md:p-8">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 block mb-3">Order Instructions (Optional)</label>
                                <textarea {...register('notes')} rows={3} className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-pink-500 transition-all outline-none font-bold text-gray-900 text-sm min-h-[100px] resize-none" placeholder="E.g. Ring the magic doorbell..." />
                            </div>
                        </div>

                        {/* Sidebar Recap */}
                        <div className="lg:col-span-4 lg:sticky lg:top-8 h-fit">
                            <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-bl-[100px] blur-2xl"></div>

                                <h2 className="text-lg font-black mb-8 tracking-tight">Order Insight</h2>

                                <div className="space-y-4 mb-8 pb-8 border-b border-white/10 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                    {cart?.items.map(item => (
                                        <div key={item.id} className="flex gap-3">
                                            <div className="w-12 h-16 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                                                <img src={item.bookCoverImageUrl} className="w-full h-full object-cover" alt={item.bookTitle} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-black text-xs text-white leading-tight truncate">{item.bookTitle}</p>
                                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">Qty: {item.quantity} • {currencySymbol}{item.totalPrice.toFixed(0)}</p>
                                                {item.personalizationChildFirstName && (
                                                    <p className="text-[8px] font-black text-pink-400 uppercase tracking-widest mt-0.5">For {item.personalizationChildFirstName}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        <span>Subtotal</span>
                                        <span className="text-sm text-white">{currencySymbol}{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        <span>Delivery</span>
                                        <span className={`text-sm font-black ${shippingCost === 0 ? 'text-emerald-400' : 'text-white'}`}>
                                            {shippingCost === 0 ? 'FREE' : `${currencySymbol}${shippingCost.toFixed(2)}`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        <span>Taxes (7%)</span>
                                        <span className="text-sm text-white">{currencySymbol}{tax.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">Total Amount</p>
                                    <p className="text-3xl font-black tracking-tighter leading-none">{currencySymbol}{total.toFixed(0)}</p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={checkoutMutation.isPending || !isValid}
                                    className="w-full h-12 bg-white text-gray-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 group"
                                >
                                    {checkoutMutation.isPending ? 'Processing...' : <>Secure Order <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
                                </button>

                                <div className="mt-8 flex items-center justify-center gap-3 text-gray-400">
                                    <ShieldCheck className="w-5 h-5 text-blue-400" />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Protected Checkout</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
                .leaflet-container { border-radius: 0; }
                .leaflet-bar a { border: none !important; }
            ` }} />
        </div>
    );
}
