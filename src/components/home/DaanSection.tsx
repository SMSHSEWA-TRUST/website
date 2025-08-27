import {Gift, Utensils, GraduationCap, Heart, Coins} from "lucide-react";
import {useState} from "react";
import CommonDonationDialog from "../commonDonationDialog";
import {useGetAllDaan} from "@/api/DaanQueries";

const DonationSection = () => {
  const {data, isFetching} = useGetAllDaan();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const iconMap: Record<string, React.ElementType> = {
    Gift,
    Heart,
    Utensils,
    GraduationCap,
    Coins,
  };
  if (isFetching) return null;
  return (
    <>
      {openDialog && (
        <CommonDonationDialog selectedCategory={selectedCategory} setOpenDialog={setOpenDialog} />
      )}

      <section
        className="relative w-full overflow-hidden py-16"
        style={{
          background: "linear-gradient(135deg, #8B0000 0%, #B22222 50%, #DC143C 100%)",
        }}>
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/5 rounded-full translate-x-20 translate-y-20"></div>
          <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-1/3 left-1/4 w-4 h-4 bg-white/10 rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-wide">
              DONATIONS
            </h2>
            <div className="flex items-center justify-center mb-6">
              <div className="h-px bg-white/30 flex-1 max-w-32"></div>
              <div className="flex space-x-1 mx-4">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="h-px bg-white/30 flex-1 max-w-32"></div>
            </div>
            <p className="text-white/90 text-lg max-w-4xl mx-auto leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>

          {/* Donation Cards */}
          <div className="flex gap-6 flex-wrap sm:flex-nowrap justify-center">
            {data?.data?.map((category: any) => {
              const IconComponent = iconMap[category.icon] || Gift; // fallback to Gift if undefined

              return (
                <div
                  key={category.id}
                  className={
                    "group relative overflow-hidden rounded-xl transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl  bg-gradient-to-b from-orange-600/90 to-orange-600/90 hover:bg-white *:hover:bg-white hover:shadow-x"
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
                      className={`text-xl font-light mb-2 transition-colors duration-300 text-white group-hover:text-red-800 hover:text-red-800`}>
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
                      className={`text-xs leading-relaxed mb-6 transition-colors duration-300 text-white/90 group-hover:text-gray-600 
                      `}>
                      {category.description}
                    </p>

                    {/* Donate Button */}
                    <button
                      onClick={() => {
                        setSelectedCategory(category);
                        setOpenDialog(true);
                      }}
                      className={`w-full py-2.5 px-4 rounded font-semibold text-xs transition-all duration-300  "bg-red-800 text-white bg-red-900 group-hover:bg-red-800 hover:text-white hover:shadow-lg   
                      `}>
                      Donate Now
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
