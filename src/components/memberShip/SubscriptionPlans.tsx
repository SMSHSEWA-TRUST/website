
import diamondOrange from '@/assets/images/om-scroll.png'; // Example decorative image, replace with actual if needed
import { LazyLoadImage } from 'react-lazy-load-image-component';

const SubscriptionPlans = () => {
    const features = [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    ];

    const SubscriptionCard = ({ highlight = false, price = "₹1199" }) => {
        return (
            <div className={`rounded-lg shadow-lg p-6 w-full max-w-[280px] min-h-[400px] ${highlight
                ? "bg-gradient-to-b from-red-800 to-red-900 text-white"
                : "bg-white text-gray-700"
                }`}>
                {/* Plan Name */}
                <h3 className={`text-xl font-medium mb-3 ${highlight ? "text-white" : "text-orange-500"}`}>
                    Plan Name
                </h3>

                {/* Description */}
                <p className={`text-sm mb-4 leading-relaxed ${highlight ? "text-white/90" : "text-gray-600"}`}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>

                {/* Price */}
                <div className="mb-4">
                    <span className={`text-4xl font-bold ${highlight ? "text-white" : "text-red-700"}`}>
                        {price}
                    </span>
                    <span className={`text-sm ml-1 ${highlight ? "text-white/80" : "text-gray-500"}`}>
                        /month
                    </span>
                </div>

                {/* Plan Type Buttons */}
                <div className="flex gap-2 mb-4">
                    <button className={`px-3 py-1.5 text-xs font-medium rounded ${highlight
                        ? "bg-yellow-400 text-red-800"
                        : "bg-yellow-400 text-red-800"
                        }`}>
                        Monthly
                    </button>
                    <button className={`px-3 py-1.5 text-xs font-medium rounded ${highlight
                        ? "bg-yellow-400 text-red-800"
                        : "bg-yellow-400 text-red-800"
                        }`}>
                        20% Off
                    </button>
                </div>

                {/* Buy Now Button */}
                <button className={`w-full py-2.5 rounded font-medium text-sm mb-4 ${highlight
                    ? "bg-white text-red-800 hover:bg-gray-100"
                    : "bg-red-800 text-white hover:bg-red-900"
                    }`}>
                    Buy Now
                </button>

                {/* Features List */}
                <ul className="space-y-2">
                    {features.map((feature, idx) => (
                        <li key={idx} className={`text-xs leading-relaxed flex items-start ${highlight ? "text-white/90" : "text-gray-600"
                            }`}>
                            <span className={`inline-block w-1.5 h-1.5 rounded-full mt-1.5 mr-2 flex-shrink-0 ${highlight ? "bg-white" : "bg-red-600"
                                }`}></span>
                            {feature}
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 py-12 px-4">
            {/* Title */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-serif text-orange-600 mb-4">Subscription Plans</h1>

                {/* Decorative line with dots and image */}
                <div className="flex items-center justify-center py-8 w-full">
                    <div className="flex items-center w-full max-w-md">
                        {/* Left arrow/diamond with connecting line */}
                        <div className="flex items-center flex-1">
                            <div className="w-2 h-2 bg-orange-500 transform rotate-45"></div>
                            <div className="flex-1 h-px bg-orange-500"></div>
                        </div>

                        {/* Center dots with continuous line: small-small-big-small-small */}
                        <div className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                            <div className="w-3 h-px bg-orange-500"></div>
                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                            <div className="w-3 h-px bg-orange-500"></div>
                            <LazyLoadImage src={diamondOrange} alt="Decorative" className="w-6 h-6 mx-2" loading="lazy" />
                            <div className="w-3 h-px bg-orange-500"></div>
                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                            <div className="w-3 h-px bg-orange-500"></div>
                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                        </div>

                        {/* Right arrow/diamond with connecting line */}
                        <div className="flex items-center flex-1">
                            <div className="flex-1 h-px bg-orange-500"></div>
                            <div className="w-2 h-2 bg-orange-500 transform rotate-45"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cards Container */}
            <div className="max-w-6xl mx-auto">
                {/* Top Row - 3 Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    <SubscriptionCard highlight={true} />
                    <SubscriptionCard />
                    <SubscriptionCard />
                </div>
                {/* Bottom Row - 2 Cards, centered on large screens */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 justify-center lg:mx-auto lg:w-2/3">
                    <SubscriptionCard price="₹1109" />
                    <SubscriptionCard price="₹1109" />
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPlans;