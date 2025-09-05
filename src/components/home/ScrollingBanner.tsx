



const ScrollingBanner = (): JSX.Element => {
    // Two phrases to alternate in the scrolling banner
    const phrases = [
        "JAI SHREE MAHAKALESHWAR",
        "JAI SHREE SALASAR BALAJI",
    ];

    // Build a repeated sequence of phrase pairs so ॐ appears centered between the two phrases
    const repeatedPairs = Array.from({ length: 20 }, () => ({
        left: `|| ${phrases[0]} ||`,
        right: `|| ${phrases[1]} ||`,
    }));

    return (
        <div className="w-full h-[82px] bg-[#8b0000] overflow-hidden relative">
            {/* Scrolling Container */}
            <div className="flex items-center h-full">
                {/* Continuous scrolling text */}
                <div className="flex items-center whitespace-nowrap"
                    style={{
                        animation: 'scroll-left 60s linear infinite',
                        minWidth: 'max-content'
                    }}>
                    {repeatedPairs.map((pair, index) => (
                        <span
                            key={index}
                            className="flex items-center font-primaryFont font-normal text-white textDescription tracking-wider "
                        >
                            {/* Render left, Om, right, and trailing Om so repeats also have an Om between them */}
                            <>
                                {pair.left}
                                <span className="text-yellow-500 font-semibold textHeading mx-4" aria-hidden="true">ॐ</span>
                                {pair.right}
                                <span className="text-yellow-500 font-semibold textHeading mx-4" aria-hidden="true">ॐ</span>
                            </>
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