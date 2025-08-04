

import omScrollPng from '@/assets/images/om-scroll.png';
import omPng from '@/assets/images/om.png';

const ScrollingBanner = (): JSX.Element => {
    // Create array of repeated text for seamless scrolling
    const scrollText = "|| JAI SHREE SALASAR BALAJI ||";
    const repeatedText = Array(15).fill(scrollText);

    return (
        <div className="w-full h-[82px] bg-[#8b0000] overflow-hidden relative">
            {/* Scrolling Container */}
            <div className="flex items-center h-full">
                {/* Continuous scrolling text */}
                <div className="flex items-center gap-8 whitespace-nowrap"
                    style={{
                        animation: 'scroll-left 25s linear infinite',
                        minWidth: 'max-content'
                    }}>
                    {repeatedText.map((text, index) => (
                        <span
                            key={index}
                            className="flex items-center font-['Tenor_Sans',sans-serif] font-normal text-white text-sm tracking-wider px-6"
                        >
                            <img
                                className="w-7 h-7 object-contain text-yellow-500 mr-2"
                                alt="Om Symbol"
                                src={omScrollPng}
                                style={{ filter: 'invert(16%) sepia(97%) saturate(7492%) hue-rotate(353deg) brightness(90%) contrast(98%)' }}
                            />
                            {text}
                        </span>
                    ))}
                    {/* Duplicate for seamless loop */}
                    {repeatedText.map((text, index) => (
                        <span
                            key={`duplicate-${index}`}
                            className="flex items-center font-tenor-sans lg:text-[14px] text-[6px] font-normal text-white text-sm tracking-wider px-6"
                        >
                            <img
                                className="w-7 h-7 object-contain text-red-800 mr-2"
                                alt="Om Symbol"
                                src={omPng}
                                style={{ filter: 'invert(16%) sepia(97%) saturate(7492%) hue-rotate(353deg) brightness(90%) contrast(98%)' }}
                            />
                            {text}
                        </span>
                    ))}
                </div>
            </div>

            {/* Add keyframes styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes scroll-left {
                        0% {
                            transform: translateX(0%);
                        }
                        100% {
                            transform: translateX(-50%);
                        }
                    }
                `
            }} />
        </div>
    );
};

export default ScrollingBanner; 