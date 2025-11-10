import { useNavigate } from "react-router-dom";
import { useI18n } from '@/lib/i18n';
import { useGetAllDaan } from "@/api/DaanQueries";
import { navigateToDonation } from '@/lib/donationUtils';
import mandal from '@/assets/images/mand-7.png';
import CarouselContent from './CarouselContent';

const BhudaanSection: React.FC = () => {
    const navigate = useNavigate();
    const { data: allDaanData, isFetching } = useGetAllDaan();

    const { t } = useI18n();

    return (
        <div id="bhudaan-section">
            <div className="bg-[#8B0000] py-6  flex flex-col items-center w-full relative overflow-hidden px-4 md:px-16 lg:px-24 ">
                {/* decorative background ornament (subtle, behind content) */}
                <img
                    src={mandal}
                    alt="ornament"
                    className="pointer-events-none absolute left-[10px] transform -translate-x-1/2 -top-8 opacity-2  w-64 h-64 md:w-96 md:h-96 lg:w-[480px] lg:h-[480px]"
                />

                <div className="relative z-10 text-center">
                    <h2
                        className="text-5xl md:text-6xl font-bold font-primaryFont"
                        style={{
                            color: '#fff',
                            WebkitTextStroke: '2px #d05e2d',
                            textShadow: '0px 2px 4px rgba(139,0,0,0.5), 0px 0.5px 0px #fff',
                            letterSpacing: '0.04em',
                        }}
                    >
                        {t('bhudaan.title')}
                    </h2>
                    <div className="flex items-center justify-center py-2 w-full">
                        <div className="flex items-center w-full max-w-md">
                            {/* Left arrow/diamond with connecting line */}
                            <div className="flex items-center flex-1">
                                <div className="w-2 h-2 bg-secondaryColor transform rotate-45"></div>
                                <div className="flex-1 h-px bg-secondaryColor"></div>
                            </div>

                            {/* Center dots with continuous line: small-small-big-small-small */}
                            <div className="flex items-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-white border-2" style={{ borderColor: '#d05e2d' }}></div>
                                <div className="w-3 h-px bg-secondaryColor"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-white border-2" style={{ borderColor: '#d05e2d' }}></div>
                                <div className="w-3 h-px bg-secondaryColor"></div>
                                <div className="w-3 h-3 rounded-full bg-white border-2" style={{ borderColor: '#d05e2d' }}></div>
                                <div className="w-3 h-px bg-secondaryColor"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-white border-2" style={{ borderColor: '#d05e2d' }}></div>
                                <div className="w-3 h-px bg-secondaryColor"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-white border-2" style={{ borderColor: '#d05e2d' }}></div>
                            </div>

                            {/* Right arrow/diamond with connecting line */}
                            <div className="flex items-center flex-1">
                                <div className="flex-1 h-px bg-secondaryColor"></div>
                                <div className="w-2 h-2 bg-secondaryColor transform rotate-45"></div>
                            </div>
                        </div>
                    </div>
                    <p className="text-[#FFE4C4] textDescription leading-relaxed mb-2 font-light font-secondaryFont">
                        {t('bhudaan.lead')}
                    </p>
                    <p className="text-white textHeading font-semibold mb-4 font-primaryFont">
                        {t('bhudaan.subtitle')}
                    </p>
                    <button
                        onClick={() => {
                            // Don't proceed if data is still loading
                            if (isFetching) return;

                            // Find the Bhumi Daan category from API data
                            const categories = allDaanData?.data ?? [];
                            const bhumiCategory = categories.find((c: any) => {
                                const title = String(c?.title || '').toLowerCase();
                                return title.includes('bhumi') || title.includes('bhud') || title.includes('bhum');
                            });

                            // Require login before allowing access to donation flow
                            const token = localStorage.getItem("authToken");
                            if (!token) {
                                // Save the intended destination before redirecting to login
                                if (bhumiCategory) {
                                    localStorage.setItem('auth_redirect_destination', JSON.stringify({
                                        path: '/donation',
                                        state: { selectedCategory: bhumiCategory, returnTo: 'bhudaan' }
                                    }));
                                } else {
                                    // Fallback to focus approach if category not found
                                    localStorage.setItem('auth_redirect_destination', JSON.stringify({
                                        path: '/donation',
                                        state: { focus: 'bhumi', returnTo: 'bhudaan' }
                                    }));
                                }
                                navigate('/login');
                                return;
                            }

                            // Navigate directly to the donation page
                            if (bhumiCategory) {
                                navigateToDonation(navigate, bhumiCategory, 'bhudaan');
                            } else {
                                // Fallback to focus approach if category not found
                                navigate('/donation', { state: { focus: 'bhumi', returnTo: 'bhudaan' } });
                            }
                        }}
                        className={`textDescription font-bold py-2 px-6 rounded shadow transition font-secondaryFont ${isFetching
                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            : 'bg-white text-[#8B0000] hover:bg-[#FFE4C4]'
                            }`}
                        disabled={isFetching}
                    >
                        {isFetching ? 'Loading...' : t('bhudaan.button')}
                    </button>
                </div>

            </div>

            {/* Carousel: infinite autoplay slides (each slide contains the full 3-column layout) */}
            <div className="w-full">
                <div
                    className="relative overflow-hidden"
                >
                    {/* Track */}
                    <CarouselContent />
                </div>
            </div>
        </div>
    );
};


export default BhudaanSection;
