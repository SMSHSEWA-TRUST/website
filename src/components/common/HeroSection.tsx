import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useI18n } from '../../lib/i18n';

interface HeroSectionProps {
    // Optional page key to fetch page-specific hero content from i18n files
    pageKey?: string;
    title?: string;
    semiTitle?: string;
    description?: string;
    backgroundImage?: string;
    className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
    pageKey,
    title = "Title",
    semiTitle = "",
    description = "",
    backgroundImage = "",
    className = ""
}) => {
    const { t } = useI18n();

    // If a pageKey is provided, try to resolve title/semiTitle/description/backgroundImage
    // from the i18n `pageHero` section. Fall back to props when not present.
    let resolvedTitle = title;
    let resolvedSemiTitle = semiTitle;
    let resolvedDescription = description;
    let resolvedBackground = backgroundImage;

    if (pageKey) {
        try {
            const hero = t(`pageHero.${pageKey}`) || {};
            // Only override when the translated value exists and is non-empty
            if (hero.title) resolvedTitle = hero.title;
            if (hero.semiTitle) resolvedSemiTitle = hero.semiTitle;
            if (hero.description) resolvedDescription = hero.description;
            if (hero.backgroundImage) resolvedBackground = hero.backgroundImage;
        } catch (e) {
            // t may return the path string when missing; ignore and use props
        }
    }
    return (
        <section
            className={`w-full ${className} `}
            role="banner"
            aria-labelledby="hero-section-title"
        >
            {/* Responsive Image Section */}
            {resolvedBackground && (
                <div className="relative w-full h-[40vh] sm:h-[50vh] md:h-[50vh] lg:h-[60vh] xl:h-[60vh] overflow-hidden">
                    <LazyLoadImage
                        src={resolvedBackground}
                        alt={resolvedTitle}
                        className="w-full h-full object-cover object-center"
                        loading="eager"
                        decoding="async"
                    />
                    {/* Title overlaid on image */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black/30" />
                        <h1
                            id="hero-section-title"
                            className="font-primaryFont relative z-10 font-normal text-[32px] lg:text-[64px] text-white text-center drop-shadow-lg"
                        >
                            {resolvedTitle}
                        </h1>
                    </div>

                    {/* Semi-title below the image */}
                    {resolvedSemiTitle && (
                        <div className="absolute inset-0 flex top-[62%] justify-center">
                            <h2 className="font-primaryFont relative z-10 font-normal textDescription text-white text-center">
                                {resolvedSemiTitle}
                            </h2>
                        </div>
                    )}

                </div>
            )}

            {/* Text Content Section Below Image */}
            {resolvedDescription && resolvedDescription.trim() !== "" && (
                <div className="w-full bg-white ">
                    <div className=" pt-9 px-4 md:px-16 lg:px-24   ">

                        <p className="font-secondaryFont font-normal textDescription text-[rgba(0, 0, 0, 0.5)] leading-relaxed text-center">
                            {resolvedDescription}
                        </p>

                    </div>
                </div>
            )}
        </section>
    );
};

export default HeroSection;
