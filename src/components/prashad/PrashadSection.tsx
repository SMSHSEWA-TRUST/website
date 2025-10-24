import React, { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import lineImage from "@/assets/images/line.png";
import PrashadDetailModal from './PrashadDetailModal';

export interface PrashadPlan {
    id: number;
    name: string;
    price: number;
    image?: string;
    description?: string;
    whatsInBox?: string;
    gallery?: string[];
}

interface PrashadSectionProps {
    title: string;
    description?: string;
    plans: PrashadPlan[];
    className?: string;
}

const PrashadSection: React.FC<PrashadSectionProps> = ({
    title,
    description,
    plans,
    className = ""
}) => {
    const [selectedPlan, setSelectedPlan] = useState<PrashadPlan | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCardClick = (plan: PrashadPlan) => {
        setSelectedPlan(plan);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedPlan(null), 300);
    };

    return (
        <>
            <section className={`w-full bg-white py-8 md:py-12 ${className}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Title */}
                    <div className="text-center mb-8">
                        <h2 className="font-primaryFont text-[28px] sm:text-[36px] lg:text-[42px] text-[#8b0000] mb-3">
                            {title}
                        </h2>

                        {/* Decorative Line */}
                        <div className="relative mb-4 mt-3 flex justify-center">
                            <div className="relative w-full max-w-md h-3">
                                <LazyLoadImage
                                    className="w-full h-3 object-cover"
                                    alt="Decorative Line"
                                    src={lineImage}
                                    loading="lazy"
                                />
                                <div className="absolute w-3 h-3 top-0 left-1/2 transform -translate-x-1/2 bg-secondaryColor rounded-full" />
                                <div className="absolute w-2 h-2 top-0.5 left-[calc(50%+12px)] transform -translate-x-1/2 bg-secondaryColor rounded-full" />
                                <div className="absolute w-2 h-2 top-0.5 left-[calc(50%-12px)] transform -translate-x-1/2 bg-secondaryColor rounded-full" />
                                <div className="absolute w-1.5 h-1.5 top-1 left-[calc(50%+24px)] transform -translate-x-1/2 bg-secondaryColor rounded-full" />
                                <div className="absolute w-1.5 h-1.5 top-1 left-[calc(50%-24px)] transform -translate-x-1/2 bg-secondaryColor rounded-full" />
                                <div className="absolute w-3 h-3 top-0 left-0 bg-secondaryColor rounded-full" />
                                <div className="absolute w-3 h-3 top-0 right-0 bg-secondaryColor rounded-full" />
                            </div>
                        </div>

                        {description && (
                            <p className="font-secondaryFont text-sm sm:text-base text-gray-600 max-w-3xl mx-auto">
                                {description}
                            </p>
                        )}
                    </div>

                    {/* Prashad Plans Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {plans.map((plan) => (
                            <div
                                key={plan.id}
                                onClick={() => handleCardClick(plan)}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 cursor-pointer hover:scale-105"
                            >
                                <div className="aspect-square bg-gray-200 relative">
                                    {plan.image ? (
                                        <LazyLoadImage
                                            src={plan.image}
                                            alt={plan.name}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                                            <svg className="w-16 h-16 sm:w-20 sm:h-20" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-secondaryFont text-base sm:text-lg text-gray-700 mb-1">
                                        {plan.name}
                                    </h3>
                                    <p className="font-secondaryFont text-xl sm:text-2xl  text-[#8b0000] font-semibold">
                                        ₹{plan.price}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Modal */}
            <PrashadDetailModal
                plan={selectedPlan}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </>
    );
};

export default PrashadSection;
