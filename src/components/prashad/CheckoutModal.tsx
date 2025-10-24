import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Trash2, Minus, Plus, Edit } from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import OrderPrasadModal, { OrderFormData } from './OrderPrasadModal';

interface CartItem {
    id: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
    image?: string;
}

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    cartItems?: CartItem[];
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, cartItems = [] }) => {
    const [items, setItems] = useState<CartItem[]>(cartItems.length > 0 ? cartItems : [
        {
            id: 1,
            name: "Vintage Sport Jacket",
            description: "Vintage Highschool Jock Bully 1950 Classic Edition",
            price: 165.00,
            quantity: 2,
        },
        {
            id: 2,
            name: "Pamela's Jacket",
            description: "Vintage Winter WEARS 1975 Classic Edition",
            price: 140.00,
            quantity: 1,
        }
    ]);

    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

    const [deliveryAddress] = useState({
        address: "Jalan By Pass Ngurah Rai, Denpasar, Bali, 80228",
        name: "Dexter Morgan",
        phone: "+62 851 8819 0911"
    });

    // Dummy "You Might also like" products
    const suggestedProducts = [
        { id: 1, name: "Prasad Plan 1", price: 400 },
        { id: 2, name: "Prasad Plan 2", price: 999 },
        { id: 3, name: "Prasad Plan 1", price: 400 },
        { id: 4, name: "Prasad Plan 1", price: 400 }
    ];

    const handleQuantityChange = (id: number, change: number) => {
        setItems(prevItems =>
            prevItems.map(item =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + change) }
                    : item
            )
        );
    };

    const handleRemoveItem = (id: number) => {
        setItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    const handleOrderSubmit = (formData: OrderFormData) => {
        console.log('Order form submitted:', formData);
        console.log('Cart items:', items);
        // Here you can process the payment with both cart items and delivery info
        // For example, send to your API endpoint
        setIsOrderModalOpen(false);
        onClose();
        // Show success message or redirect to payment gateway
    };

    const calculateSubtotal = () => {
        return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const shipping = 5084.00;
    const vatax = 5084.00;
    const subtotal = calculateSubtotal();
    const total = subtotal + shipping + vatax;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl my-8 mx-4">
                {/* Header */}
                <div className="flex items-center gap-4 px-6 py-5 border-b border-gray-200">
                    <button
                        onClick={onClose}
                        className="text-gray-700 hover:text-gray-900"
                        aria-label="Close"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <h2 className="font-secondaryFont text-2xl font-semibold text-gray-900">
                        Checkout
                    </h2>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                    {/* Left Side - Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Delivery Address */}
                        <div className="border border-gray-200 rounded-2xl p-5">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 2a6 6 0 00-6 6c0 3.75 6 10 6 10s6-6.25 6-10a6 6 0 00-6-6zm0 8a2 2 0 110-4 2 2 0 010 4z" />
                                        </svg>
                                    </div>
                                    <span className="font-secondaryFont text-sm text-gray-500">Delivery address</span>
                                </div>
                                <button className="px-4 py-1 text-xs font-semibold text-red-600 border border-red-600 rounded-full hover:bg-red-50">
                                    Home
                                </button>
                            </div>
                            <div className="mb-2">
                                <p className="font-secondaryFont text-base font-semibold text-gray-900">
                                    {deliveryAddress.address}
                                </p>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="font-secondaryFont text-sm text-gray-700">
                                        {deliveryAddress.name}
                                    </span>
                                    <span className="font-secondaryFont text-sm text-gray-400">
                                        {deliveryAddress.phone}
                                    </span>
                                </div>
                                <button className="text-red-600 hover:text-red-700">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Special Request */}
                        <div className="border border-gray-200 rounded-2xl p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <Edit className="w-5 h-5 text-red-600" />
                                <span className="font-secondaryFont text-sm text-gray-700">
                                    Got a special request? <span className="text-red-600 font-semibold">Write a note</span>
                                </span>
                            </div>
                            <input
                                type="text"
                                placeholder="Write Note (Optional)"
                                className="w-full font-secondaryFont text-sm text-gray-400 border-0 outline-none bg-transparent"
                            />
                        </div>

                        {/* You Might also like */}
                        <div>
                            <h3 className="font-secondaryFont text-base font-semibold text-gray-900 mb-4">
                                You Might also like
                            </h3>
                            <div className="grid grid-cols-4 gap-3">
                                {suggestedProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="bg-white rounded-xl overflow-hidden"
                                    >
                                        <div className="aspect-square bg-gray-200 relative">
                                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="p-2 text-center">
                                            <p className="font-secondaryFont text-xs text-gray-700 mb-1">
                                                {product.name}
                                            </p>
                                            <p className="font-secondaryFont text-sm font-bold text-red-600">
                                                ₹{product.price}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Proceed to Payment Button */}
                        <button
                            onClick={() => setIsOrderModalOpen(true)}
                            className="w-full bg-[#8b0000] hover:bg-[#660000] text-white font-secondaryFont font-semibold py-4 rounded-2xl transition-colors"
                        >
                            Proceed to Payment
                        </button>
                    </div>

                    {/* Right Side - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6">
                            <h3 className="font-secondaryFont text-lg font-semibold text-gray-900 mb-6">
                                Your Order
                            </h3>

                            {/* Cart Items */}
                            <div className="space-y-6 mb-6">
                                {items.map((item) => (
                                    <div key={item.id} className="relative border-b border-gray-100 pb-4">
                                        {/* Item Header with Name and Delete */}
                                        <div className="flex items-start justify-between mb-3">
                                            <h4 className="font-secondaryFont text-sm font-semibold text-gray-900">
                                                {item.name}
                                            </h4>
                                            <button
                                                onClick={() => handleRemoveItem(item.id)}
                                                className="text-red-600 hover:text-red-700"
                                                aria-label="Remove item"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Item Image and Description */}
                                        <div className="flex gap-3 mb-3">
                                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                                                {item.image ? (
                                                    <LazyLoadImage
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-secondaryFont text-xs text-gray-500 leading-relaxed">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Quantity and Price */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="font-secondaryFont text-xs text-gray-500">Quantity</span>
                                                <div className="flex items-center gap-1 border border-gray-300 rounded">
                                                    <button
                                                        onClick={() => handleQuantityChange(item.id, -1)}
                                                        className="w-6 h-6 flex items-center justify-center hover:bg-gray-100"
                                                        aria-label="Decrease quantity"
                                                    >
                                                        <Minus className="w-3 h-3 text-gray-600" />
                                                    </button>
                                                    <span className="font-secondaryFont text-sm font-semibold w-8 text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleQuantityChange(item.id, 1)}
                                                        className="w-6 h-6 flex items-center justify-center hover:bg-gray-100"
                                                        aria-label="Increase quantity"
                                                    >
                                                        <Plus className="w-3 h-3 text-gray-600" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Price */}
                                            <div className="font-secondaryFont text-base font-bold text-gray-900">
                                                ${item.price.toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order Summary */}
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center justify-between">
                                    <span className="font-secondaryFont text-sm text-gray-600">Subtotal</span>
                                    <span className="font-secondaryFont text-sm font-semibold text-gray-900">
                                        ${subtotal.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-secondaryFont text-sm text-gray-600">Shipping</span>
                                    <span className="font-secondaryFont text-sm font-semibold text-gray-900">
                                        ${shipping.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                                    <span className="font-secondaryFont text-sm text-gray-600">Vatax</span>
                                    <span className="font-secondaryFont text-sm font-semibold text-gray-900">
                                        ${vatax.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="flex items-center justify-between">
                                <span className="font-secondaryFont text-base font-bold text-gray-900">Total</span>
                                <span className="font-secondaryFont text-lg font-bold text-gray-900">
                                    ${total.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Prasad Modal */}
            <OrderPrasadModal
                isOpen={isOrderModalOpen}
                onClose={() => setIsOrderModalOpen(false)}
                onSubmit={handleOrderSubmit}
            />
        </div>
    );
};

export default CheckoutModal;
