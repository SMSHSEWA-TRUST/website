import { useNavigate } from 'react-router-dom';
import { useGetAllDaan } from "@/api/DaanQueries";
import { useI18n } from '@/lib/i18n';
import { navigateToDonation } from '@/lib/donationUtils';
import mandal from '@/assets/images/mand-7.png';
import gaudaan from "../../assets/images/gaudaan.png";
import bhojandaan from "../../assets/images/bhojandaan.png";
import anndaan from "../../assets/images/anndaan.png";
import rashidaan from "../../assets/images/rashidaan.png";
import bhumiddan from "../../assets/images/bhumiddan.png";

const DonationSection = () => {
  const { data } = useGetAllDaan();
  const navigate = useNavigate();
  // Handler for donate button: navigates to donation page
  const handleDonate = (category: any) => {
    // If user is not authenticated, save the intended action and redirect to login
    const token = localStorage.getItem("authToken");
    if (!token) {
      // Save the intended donation category to localStorage for redirect after login
      localStorage.setItem('auth_redirect_destination', JSON.stringify({
        path: '/donation',
        state: { selectedCategory: category, returnTo: 'donations' }
      }));
      navigate('/login');
      return;
    }

    // Navigate to the donation page with the selected category
    navigateToDonation(navigate, category, 'donations');
  };


  // Map localized/static images for donation categories. We match by checking
  // substrings on the category title (lowercased) so it works with API data or
  // localized fallbacks.
  const imageMap: Record<string, string> = {
    gaudaan,
    bhojandaan,
    anndaan,
    rashidaan,
    bhumiddan,
  };

  const getImageForCategory = (category: any): string | undefined => {
    const title = String(category?.title || '').toLowerCase();
    if (!title) return undefined;

    // Try to match common substrings for each image
    if (title.includes('gau') || title.includes('gaud')) return imageMap.gaudaan;
    if (title.includes('bhoj') || title.includes('bhojda') || title.includes('bhojand')) return imageMap.bhojandaan;
    if (title.includes('ann') || title.includes('anndaan')) return imageMap.anndaan;
    if (title.includes('rash') || title.includes('rashid')) return imageMap.rashidaan;
    if (title.includes('bhumi') || title.includes('bhud') || title.includes('bhum')) return imageMap.bhumiddan;

    return undefined;
  };

  const { t } = useI18n();
  // fallback localized items from locales when API data is not present
  const localizedItems = (t('donations.items') as any[]) || [];

  // If navigated here with state.focus, scroll to donations section


  return (
    <section
      id="donations"
      className="relative w-full overflow-hidden py-16  "
      style={{
        background: "rgba(139, 0, 0, 1)",
      }}>
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* subtle gradient/ornament image centered */}
        <img
          src={mandal}
          alt="ornament"
          className="pointer-events-none absolute left-[25%] top-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-2 w-[810px] h-[632px]"
        />
        <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/5 rounded-full translate-x-20 translate-y-20"></div>
        <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-1/3 left-1/4 w-4 h-4 bg-white/10 rounded-full"></div>
      </div>

      <div className="relative z-10   px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2
            className="text-5xl md:text-6xl font-bold font-primaryFont"
            style={{
              color: '#fff',
              WebkitTextStroke: '2px #d05e2d',
              textShadow: '0px 2px 4px rgba(139,0,0,0.5), 0px 0.5px 0px #fff',
              letterSpacing: '0.04em',
            }}
          >
            {t('donations.heading')}

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
          <p className="text-white/90 textDescription max-w-4xl mx-auto leading-relaxed">
            {t('donations.lead')}
          </p>
        </div>

        {/* Donation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 justify-center">
          {(data?.data?.length ? data.data : localizedItems).map((category: any) => {
            const imageForCard = getImageForCategory(category);

            return (
              <div
                key={category.id}
                className={
                  "group relative overflow-hidden rounded-xl transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl bg-[#AD2F16] hover:bg-white *:hover:bg-white hover:shadow-x flex flex-col"
                }>
                {/* Card Content */}
                <div className="p-6 text-center flex flex-col flex-grow">
                  {/* Icon */}
                  <div className="flex justify-center mb-4">
                    <div
                      className={`inline-flex items-center justify-center w-14 h-14 rounded-lg transition-all duration-300 border-orange-300 border bg-red-800 text-white group-hover:bg-red-800 group-hover:text-white text-white"   
                      }`}>

                      <img src={imageForCard} alt={category.title || 'donation'} className="w-8 h-8 object-contain" />

                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    className={`textHeading mb-2 transition-colors duration-300 text-white group-hover:text-red-800 hover:text-red-800 font-bold`}>
                    {category.title}
                  </h3>

                  {/* Decorative Line */}
                  <div className="flex items-center justify-center mb-4 ">
                    <div
                      className={`w-2 h-2 rounded-full transition-colors duration-300 bg-white/60 group-hover:bg-orange-500 hover:bg-orange-500 
                          `}></div>
                    <div
                      className={`h-px flex-1 max-w-full transition-colors duration-300 bg-orange-300 group-hover:bg-orange-300 hover:bg-orange-300 `}></div>
                    <div
                      className={`w-2 h-2 rounded-full transition-colors duration-300 bg-white/60 group-hover:bg-orange-500 hover:bg-orange-500 
                          `}></div>
                  </div>

                  {/* Description */}
                  <p
                    className={`textDescription leading-relaxed mb-6 transition-colors duration-300 text-white/90 group-hover:text-gray-600 flex-grow
                      `}>
                    {category.description}
                  </p>

                  {/* Donate Button */}
                  <button
                    onClick={() => handleDonate(category)}
                    className={`w-full py-2.5 px-4 rounded font-semibold textDescription transition-all duration-300 bg-red-800 text-white bg-red-900 group-hover:bg-red-800 hover:text-white hover:shadow-lg mt-auto
                      `}>
                    {t('donations.button')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DonationSection;
