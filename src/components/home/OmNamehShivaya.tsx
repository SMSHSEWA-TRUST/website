
const OmNamehShivaya = (): JSX.Element => {
    return (
        <section className="relative w-full aspect-[1440/634] max-h-[90vh] overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: 'url(/bg-shiv.png)' }}
            />

            {/* Content Container */}
            <div className="relative z-10 w-full h-full flex items-center justify-center">

                {/* Om Namah Shivaya Text - Proportional positioning */}
                <div className="absolute left-[8.75%] top-[13.4%] z-10">
                    <h1 className="font-['Tiro_Devanagari_Hindi',serif] text-white font-normal leading-none tracking-wide drop-shadow-[10px_10px_4px_rgba(0,0,0,0.25)]"
                        style={{ fontSize: 'clamp(1rem, 12vw, 173.3px)' }}>
                        ॐ नमः शिवाय
                    </h1>
                </div>

                {/* Shiva Image - Proportional positioning */}
                <div className="absolute right-0 top-0 w-[78%] h-full z-20">
                    <img
                        className="w-full h-full object-cover object-left"
                        alt="Lord Shiva Statue"
                        src="/image-shiv.png"
                        loading="lazy"
                    />
                </div>

            </div>

            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/10 to-transparent pointer-events-none z-5" />
        </section>
    );
};

export default OmNamehShivaya; 