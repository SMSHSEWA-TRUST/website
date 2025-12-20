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
    const { t, lang } = useI18n();

    // If no items provided, render nothing
    if (!items || items.length === 0) {
        return null;
    }

    // Normalize incoming items
    const displayItems = items.map((it) => {
        // If API shape
        const itemAny = it as any;
        return {
            id: itemAny._id ?? itemAny.id ?? itemAny.itemId ?? itemAny.id,
            image: itemAny.itemImage ?? itemAny.image ?? '',
            name: itemAny.itemName?.[lang] ?? itemAny.name?.[lang] ?? 'Item Name',
            description: itemAny.itemDescription?.[lang] ?? itemAny.description?.[lang] ?? '',
        };
    });

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
                            className="relative rounded-3xl overflow-hidden group h-[320px] w-full shadow-lg hover:shadow-[10px_10px_20px_0px_#0000001A] transition-shadow duration-300"
                        >
                            {/* Normal State: Image + Name at bottom */}
                            <div className="absolute inset-0 w-full h-full">
                                {item.image ? (
                                    <LazyLoadImage
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-400">No Image</span>
                                    </div>
                                )}
                                {/* Gradient overlay for text readability in normal state */}
                                <div
                                    className="absolute inset-0 group-hover:opacity-0 transition-opacity duration-300"
                                    style={{ background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(173, 47, 22, 0.75) 100%)' }}
                                />

                                {/* Name in Normal State */}
                                <div className="absolute bottom-6 left-6 right-6 transition-all duration-300 transform translate-y-0 opacity-100 group-hover:translate-y-4 group-hover:opacity-0">
                                    <h3 className="text-2xl font-primaryFont text-white font-medium tracking-wide">
                                        {item.name}
                                    </h3>
                                </div>
                            </div>

                            {/* Hover State: Red Overlay + Name at Top + Description */}
                            <div className="absolute inset-0 bg-[#8B0000BF] opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out flex flex-col p-8">
                                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                                    <h3 className="text-2xl font-primaryFont text-white font-medium mb-4 border-b border-orange-400/50 pb-2 inline-block">
                                        {item.name}
                                    </h3>
                                    <div className="text-white/90 font-secondaryFont text-sm leading-relaxed overflow-y-auto max-h-[200px] pr-2 custom-scrollbar">
                                        {item.description || "No description available."}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ItemInBox;
