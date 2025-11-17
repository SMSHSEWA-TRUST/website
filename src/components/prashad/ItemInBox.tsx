import React from 'react';
import { useI18n } from '@/lib/i18n';
import { LazyLoadImage } from 'react-lazy-load-image-component';

interface ItemInBoxProps {
    // Accept either the internal shape or the API `itemsIncluded` shape.
    items?: Array<
        | {
            id: number | string;
            image?: string;
            name?: string;
            description?: string;
        }
        | {
            _id?: string;
            itemImage?: string;
            itemName?: string;
            itemDescription?: string;
        }
    >;
}

const ItemInBox: React.FC<ItemInBoxProps> = ({ items }) => {
    const { t } = useI18n();

    // Default items if none provided
    const defaultItems = [
        {
            id: '1',
            image: '',
            name: t('prashad.itemInBox.defaultItemName'),
            description: t('prashad.itemInBox.defaultItemDescription')
        },
        {
            id: '2',
            image: '',
            name: 'Item Name',
            description: ''
        },
        {
            id: '3',
            image: '',
            name: 'Item Name',
            description: ''
        },
        {
            id: '4',
            image: '',
            name: 'Item Name',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco commodo consequat.'
        }
    ];

    // Normalize incoming items so component can render either internal shape or API `itemsIncluded` shape
    const displayItems = (items && items.length > 0
        ? items.map((it) => {
            // If API shape
            const itemAny = it as any;
            return {
                id: itemAny._id ?? itemAny.id ?? itemAny.itemId ?? itemAny.id,
                image: itemAny.itemImage ?? itemAny.image ?? '',
                name: itemAny.itemName ?? itemAny.name ?? 'Item Name',
                description: itemAny.itemDescription ?? itemAny.description ?? '',
            };
        })
        : defaultItems);

    return (
        <div className="w-full py-16 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Title */}
                <div className="text-center mb-4">
                    <h2 className="text-3xl md:text-4xl font-primaryFont text-[#8b0000] inline-block border-b-[4px] border-[#D05E2D] pb-2">
                        {t('prashad.itemInBox.title')}
                    </h2>
                </div>

                {/* Subtitle */}
                <p className="text-center text-gray-500 font-secondaryFont text-sm md:text-base mb-12 max-w-4xl mx-auto">
                    {t('prashad.itemInBox.subtitle')}
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
