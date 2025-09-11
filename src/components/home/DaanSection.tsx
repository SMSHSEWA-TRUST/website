import { Gift, Utensils, GraduationCap, Heart, Coins } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import CommonDonationDialog from "../commonDonationDialog";
import { useGetAllDaan } from "@/api/DaanQueries";
import { useI18n } from '@/lib/i18n';

const DonationSection = () => {
  const { data, isFetching } = useGetAllDaan();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
  // Handler for donate button: opens dialog and for Bhumi-specific card scrolls to the donations section
  const handleDonate = (category: any) => {
    // If user is not authenticated, send to login page (do not track/attach return path)
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate('/login');
      return;
    }

    setSelectedCategory(category);
    setOpenDialog(true);

    try {
      const title = String(category?.title || "").toLowerCase();
      // If this is the Bhumi daan card, also scroll/redirect to the donations section
      if (title.includes("bhumi")) {
        const el = document.getElementById("donations");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          // fallback: set hash so anchor navigation works if element not present yet
          window.location.hash = "#donations";
        }
      }
    } catch (e) {
      // ignore in case of SSR or unexpected errors
    }
  };
  const iconMap: Record<string, React.ElementType> = {
    Gift,
    Heart,
    Utensils,
    GraduationCap,
    Coins,
  };

  const { t } = useI18n();
  // fallback localized items from locales when API data is not present
  const localizedItems = (t('donations.items') as any[]) || [];

  // If navigated here with state.focus === 'bhumi', open the Bhumi dialog automatically
  useEffect(() => {
    if (isFetching) return;
    try {
      const focus = (location.state as any)?.focus;
      if (focus && String(focus).toLowerCase() === 'bhumi' && data?.data?.length) {
        const match = data.data.find((c: any) => {
          const t = String(c?.title || '').toLowerCase();
          return t.includes('bhumi') || t.includes('bhudaan') || t.includes('bhumi daan');
        });
        if (match) {
          setSelectedCategory(match);
          setOpenDialog(true);
        }

        // clear the navigation state so this doesn't reopen on further renders
        try {
          navigate(location.pathname + (location.hash || ''), { replace: true, state: {} });
        } catch (e) {
          // ignore
        }
      }
    } catch (e) {
      // ignore
    }
  }, [data, isFetching, location, navigate]);
  if (isFetching) return null;
  return (
    <>
      {openDialog && (
        <CommonDonationDialog selectedCategory={selectedCategory} setOpenDialog={setOpenDialog} />
      )}

      <section
        id="donations"
        className="relative w-full overflow-hidden py-16  "
        style={{
          background: "rgba(139, 0, 0, 1)",
        }}>
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
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
              const IconComponent = iconMap[category.icon] || Gift; // fallback to Gift if undefined

              return (
                <div
                  key={category.id}
                  className={
                    "group relative overflow-hidden rounded-xl transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl  bg-[#AD2F16] hover:bg-white *:hover:bg-white hover:shadow-x"
                  }>
                  {/* Card Content */}
                  <div className="p-6 text-center">
                    {/* Icon */}
                    <div
                      className={`inline-flex items-center justify-center w-14 h-14 rounded-lg mb-4 transition-all duration-300 border-orange-300 border bg-red-800 text-white group-hover:bg-red-800 group-hover:text-white text-white"   
                    }`}>
                      <IconComponent size={24} />
                    </div>

                    {/* Title */}
                    <h3
                      className={`textHeading  mb-2 transition-colors duration-300 text-white group-hover:text-red-800 hover:text-red-800 font-bold`}>
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
                      className={`textDescription leading-relaxed mb-6 transition-colors duration-300 text-white/90 group-hover:text-gray-600 
                      `}>
                      {category.description}
                    </p>

                    {/* Donate Button */}
                    <button
                      onClick={() => handleDonate(category)}
                      className={`w-full py-2.5 px-4 rounded font-semibold textDescription transition-all duration-300  "bg-red-800 text-white bg-red-900 group-hover:bg-red-800 hover:text-white hover:shadow-lg   
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
    </>
  );
};

export default DonationSection;
