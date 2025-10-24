import React, { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Minus, Plus } from 'lucide-react';
import CheckoutModal from './CheckoutModal';

interface PrashadPlan {
    id: number;
    name: string;
    price: number;
    image?: string;
    description?: string;
    whatsInBox?: string;
    gallery?: string[];
}

interface PrashadDetailModalProps {
    plan: PrashadPlan | null;
    isOpen: boolean;
    onClose: () => void;
}

const PrashadDetailModal: React.FC<PrashadDetailModalProps> = ({ plan, isOpen, onClose }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    if (!isOpen || !plan) return null;

    const handleQuantityChange = (change: number) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1) {
            setQuantity(newQuantity);
        }
    };

    const handleAddToCart = () => {
        // Add to cart logic here
        console.log('Added to cart:', { plan, quantity });
        alert(`Added ${quantity} x ${plan.name} to cart`);
        // Open checkout modal
        setIsCheckoutOpen(true);
    };

    const handleGoToCart = () => {
        // Open checkout modal
        setIsCheckoutOpen(true);
    };

    const handleCloseCheckout = () => {
        setIsCheckoutOpen(false);
        onClose();
    };

    // Generate gallery images or use placeholder
    const galleryImages = plan.gallery || [plan.image, plan.image, plan.image].filter(Boolean);

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 rounded-3xl shadow-2xl w-full max-w-4xl my-8">
                {/* Scrollable Content */}
                <div className="overflow-hidden rounded-3xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[600px]">
                        {/* Left Side - Images */}
                        <div className="bg-white/80 backdrop-blur-sm p-8 lg:p-10 flex flex-col">
                            {/* Back Button */}
                            <button
                                onClick={onClose}
                                className="flex items-center gap-2 text-gray-700 mb-6 hover:text-[#8b0000] transition-colors group"
                            >
                                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                <span className="font-secondaryFont text-base font-medium">Plan Details</span>
                            </button>

                            {/* Main Image */}
                            <div className="bg-gray-200 rounded-2xl overflow-hidden mb-5 aspect-square shadow-md">
                                {galleryImages[selectedImage] ? (
                                    <LazyLoadImage
                                        src={galleryImages[selectedImage]}
                                        alt={plan.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gradient-to-br from-gray-100 to-gray-200">
                                        <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Gallery Thumbnails */}
                            <div className="grid grid-cols-3 gap-4 mt-auto">
                                {galleryImages.slice(0, 3).map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`bg-gray-200 rounded-xl overflow-hidden aspect-square border-3 transition-all shadow-sm hover:shadow-md ${selectedImage === index
                                                ? 'border-[#8b0000] ring-2 ring-[#8b0000] ring-offset-2'
                                                : 'border-transparent hover:border-gray-300'
                                            }`}
                                    >
                                        {img ? (
                                            <LazyLoadImage
                                                src={img}
                                                alt={`${plan.name} ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gradient-to-br from-gray-100 to-gray-200">
                                                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right Side - Details */}
                        <div className="bg-white p-8 lg:p-10 flex flex-col relative">
                            {/* Title */}
                            <h2 className="font-primaryFont text-3xl lg:text-4xl text-gray-900 mb-5 tracking-tight">
                                {plan.name}
                            </h2>

                            {/* Price and Quantity */}
                            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
                                <div className="text-4xl font-bold text-[#8b0000] tracking-tight">
                                    ${plan.price}
                                </div>
                                <div className="flex items-center gap-0 border-2 border-[#8b0000] rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => handleQuantityChange(-1)}
                                        className="p-3 hover:bg-[#8b0000] hover:text-white transition-colors border-r-2 border-[#8b0000]"
                                        aria-label="Decrease quantity"
                                    >
                                        <Minus className="w-5 h-5" />
                                    </button>
                                    <span className="font-secondaryFont text-xl font-bold min-w-[50px] text-center text-gray-900 px-4">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => handleQuantityChange(1)}
                                        className="p-3 hover:bg-[#8b0000] hover:text-white transition-colors border-l-2 border-[#8b0000]"
                                        aria-label="Increase quantity"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <h3 className="font-secondaryFont text-xl font-bold text-gray-900 mb-3">
                                    Description
                                </h3>
                                <p className="font-secondaryFont text-sm text-gray-500 leading-relaxed">
                                    {plan.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}
                                </p>
                            </div>

                            {/* What's in the box */}
                            <div className="mb-8 flex-grow">
                                <h3 className="font-secondaryFont text-xl font-bold text-gray-900 mb-3">
                                    What's in the box
                                </h3>
                                <p className="font-secondaryFont text-sm text-gray-500 leading-relaxed">
                                    {plan.whatsInBox || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-2 gap-4 mt-auto">
                                <button
                                    onClick={handleGoToCart}
                                    className="font-secondaryFont py-4 px-6 rounded-xl border-2 border-[#8b0000] text-[#8b0000] text-base font-semibold hover:bg-[#8b0000] hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
                                >
                                    Go to Cart
                                </button>
                                <button
                                    onClick={handleAddToCart}
                                    className="font-secondaryFont py-4 px-6 rounded-xl bg-[#8b0000] text-white text-base font-semibold hover:bg-[#660000] transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                                >
                                    Add to cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Checkout Modal */}
            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={handleCloseCheckout}
                cartItems={plan ? [{
                    id: plan.id,
                    name: plan.name,
                    description: plan.description || '',
                    price: plan.price,
                    quantity: quantity,
                    image: plan.image
                }] : []}
            />
        </div>
    );
};

export default PrashadDetailModal;
