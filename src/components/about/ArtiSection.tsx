
const ArtiSection = () => {
    return (
        <section className="w-full  bg-gray-50 flex items-center justify-center py-8 px-2 sm:px-6 lg:px-12">
            <div className=" w-full bg-white  overflow-hidden">

                {/* Mobile/Small Screen Layout */}
                <div className="md:hidden">
                    {/* Top Content - Mobile */}
                    <div className="p-8">
                        <h1 className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-4">
                            Essence of Hindu Wisdom
                        </h1>
                        <p className="text-gray-600 text-base mb-6 leading-relaxed">
                            Discover the profound teachings and timeless wisdom of ancient Hindu philosophy.
                            Journey through centuries of spiritual knowledge that continues to guide millions
                            in their quest for inner peace and enlightenment.
                        </p>
                        <button className="bg-red-700 hover:bg-red-800 text-white px-6 py-3 text-base font-medium rounded-lg shadow transition-colors duration-200 w-fit">
                            Explore Wisdom
                        </button>
                    </div>

                    {/* Video Section - Mobile */}
                    <div className="bg-gray-800 p-4">
                        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                            <iframe
                                className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                                title="Hindu Wisdom Video"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </div>

                    {/* Bottom Image and Text Section - Mobile */}
                    <div className="grid grid-cols-1">
                        {/* Image */}
                        <div className="relative h-64 bg-gradient-to-br from-amber-800 to-orange-600 flex items-center justify-center overflow-hidden">
                            <img
                                src="/aboutArtiImage.webp"
                                alt="Prayer hands representing spiritual devotion"
                                className="w-full h-full object-cover drop-shadow-xl opacity-90"
                                loading="lazy"
                            />
                        </div>
                        {/* Text */}
                        <div className="bg-gradient-to-br from-orange-500 to-red-500 p-6 text-orange-100">
                            <div className="text-sm leading-relaxed space-y-3 opacity-90">
                                <p>
                                    The ancient scriptures teach us that true wisdom comes from understanding
                                    the interconnectedness of all beings and the divine essence that permeates everything.
                                </p>
                                <p>
                                    Through meditation, self-reflection, and righteous living, we can transcend
                                    the limitations of the material world and achieve spiritual liberation.
                                </p>
                                <p>
                                    These timeless principles offer guidance for navigating life's challenges
                                    while maintaining inner peace and compassion for all living beings.
                                </p>
                                <p>
                                    Join us on this transformative journey of discovery and awaken the divine
                                    wisdom that lies dormant within your soul.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desktop/Large Screen Layout */}
                <div className="hidden md:grid md:grid-cols-2 md:gap-0">
                    {/* Left Side */}
                    <div className="flex flex-col h-full">
                        {/* Top Content */}
                        <div className="flex-1 flex flex-col justify-center p-8 lg:p-12">
                            <h1 className="text-4xl lg:text-5xl font-semibold text-gray-800 mb-6 leading-tight">
                                Essence of Hindu Wisdom
                            </h1>
                            <p className="text-gray-600 text-base lg:text-lg mb-8 leading-relaxed">
                                Discover the profound teachings and timeless wisdom of ancient Hindu philosophy.
                                Journey through centuries of spiritual knowledge that continues to guide millions
                                in their quest for inner peace and enlightenment.
                            </p>
                            <button className="bg-red-700 hover:bg-red-800 text-white px-8 py-4 text-base font-medium rounded-lg shadow-lg transition-all duration-200 w-fit hover:shadow-xl transform hover:-translate-y-0.5">
                                Explore Wisdom
                            </button>
                        </div>

                        {/* Bottom Content */}
                        <div className="flex-1 grid grid-cols-2 h-full">
                            {/* Image */}
                            <div className="relative bg-gradient-to-br from-amber-800 to-orange-600 flex items-center justify-center overflow-hidden">
                                <img
                                    src="/aboutArtiImage.webp"
                                    alt="Prayer hands representing spiritual devotion"
                                    className="w-full h-full object-cover drop-shadow-xl opacity-90"
                                    loading="lazy"
                                />
                            </div>

                            {/* Text */}
                            <div className="flex flex-col justify-center bg-gradient-to-br from-orange-500 to-red-500 p-6 lg:p-8 text-orange-100">
                                <div className="text-sm lg:text-base leading-relaxed space-y-4 opacity-90">
                                    <p>
                                        The ancient scriptures teach us that true wisdom comes from understanding
                                        the interconnectedness of all beings.
                                    </p>
                                    <p>
                                        Through meditation, self-reflection, and righteous living, we can transcend
                                        the limitations of the material world.
                                    </p>
                                    <p>
                                        These timeless principles offer guidance for navigating life's challenges
                                        while maintaining inner peace.
                                    </p>
                                    <p>
                                        Join us on this transformative journey of discovery and awaken the divine
                                        wisdom within your soul.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Video */}
                    <div className="flex items-center justify-center bg-gray-800 p-6 lg:p-8">
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="relative w-full max-w-lg" style={{ paddingBottom: '56.25%' }}>
                                <iframe
                                    className="absolute top-0 left-0 w-full h-full rounded-lg shadow-2xl"
                                    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                                    title="Hindu Wisdom Video"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ArtiSection;
