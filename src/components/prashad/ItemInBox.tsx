import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

interface ItemInBoxProps {
    items?: Array<{
        id: number;
        image: string;
        name: string;
        description?: string;
    }>;
}

const ItemInBox: React.FC<ItemInBoxProps> = ({ items }) => {
    // Default items if none provided
    const defaultItems = [
        {
            id: 1,
            image: '',
            name: 'Item Name',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.'
        },
        {
            id: 2,
            image: '',
            name: 'Item Name',
            description: ''
        },
        {
            id: 3,
            image: '',
            name: 'Item Name',
            description: ''
        },
        {
            id: 4,
            image: '',
            name: 'Item Name',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco commodo consequat.'
        }
    ];

    const displayItems = items || defaultItems;

    return (
        <div className="w-full py-16 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Title */}
                <div className="text-center mb-4">
                    <h2 className="text-3xl md:text-4xl font-primaryFont text-[#8b0000] inline-block border-b-[4px] border-[#D05E2D] pb-2">
                        About the items in the box
                    </h2>
                </div>

                {/* Subtitle */}
                <p className="text-center text-gray-500 font-secondaryFont text-sm md:text-base mb-12 max-w-4xl mx-auto">
                    A Detailed List of Everything Included in Your Shipment. See Exactly What Comes in the Box. Your Complete Inventory The Full Set of Components
                </p>

                {/* Items Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {displayItems.map((item) => (
                        <div
                            key={item.id}
                            className="relative rounded-2xl overflow-hidden shadow-lg group h-[280px]"
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0">
                                {item.image ? (
                                    <LazyLoadImage
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                        effect="blur"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-orange-200 to-red-300"></div>
                                )}
                            </div>

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <h3 className="text-xl font-primaryFont font-semibold mb-2">
                                    {item.name}
                                </h3>
                                {item.description && (
                                    <p className="text-sm font-secondaryFont leading-relaxed opacity-90">
                                        {item.description}
                                    </p>
                                )}
                            </div>

                            {/* Decorative Corner (for items with description) */}
                            {item.description && (
                                <div className="absolute top-0 right-0 w-16 h-16">
                                    <div className="absolute top-0 right-0 w-0 h-0 border-t-[60px] border-t-[#8b0000]/80 border-l-[60px] border-l-transparent"></div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ItemInBox;
