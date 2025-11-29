import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import abstractFloral from "@/assets/images/abstract-floral.png";
import tempImageWebp from "@/assets/images/temp-image.webp";
import deityPng from "@/assets/images/deity.png";
import balajiPng from "@/assets/images/balaji.png";

const Hero = (): JSX.Element => {
  const [textIndex, setTextIndex] = useState(0);
  //  const isLoggedIn = Boolean(localStorage.getItem("authToken"));
  const { t } = useI18n();
  const texts: string[] = (t("hero.titles") as unknown as string[]) || ["JAI SHRI MAHAKAL", "JAI SHRI SALASAR BALAJI"];

  // Descriptions that correspond to each text entry and change with textIndex
  const descriptions: string[] = (t("hero.descriptions") as unknown as string[]) || [
    "Experience the divine energy and blessings of Lord Mahakal. Join us in prayers and offerings.",
    "Celebrate the devotion of Salasar Balaji — seek blessings and participate in our community events.",
  ];

  // Array of deity images that will change with the text - using different actual images
  const deityImages = [
    deityPng, // For JAI SHRI MAHAKAL
    balajiPng, // For JAI SHRI SALASAR BALAJI
    // Add more image imports as needed
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex(prevIndex => (prevIndex + 1) % texts.length);
    }, 3000); // Change text every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <section className="w-full mt-4  border-b-4 border-[#daa520] relative">
      {/* Desktop Layout - Responsive Design */}
      <div className="hidden lg:block relative w-full mx-auto">
        <div className="relative w-full h-[610px] overflow-visible">
          {/* Red section - responsive width with no gap */}
          <div className="absolute w-[25%] h-full top-0 right-0 bg-[#8b0000]"></div>{" "}
          {/* Temple image - responsive with slight overlap to prevent gap */}
          <img
            className="absolute w-[100%] h-full top-0 left-0 object-cover object-center"
            alt="Temple Image"
            src={tempImageWebp}
            style={{ objectPosition: "center top" }}
          />
          {/* Desktop Deity Images - responsive positioning and scaling */}
          <div className="absolute w-[40.6%] h-[75%] top-[12%] left-[54.7%] overflow-hidden z-20">
            {deityImages.map((imageSrc, index) => (
              <img
                key={index}
                className={`absolute w-full h-full object-contain transition-all duration-1000 ease-in-out transform ${index === textIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
                  }`}
                alt={`Deity Image ${index + 1}`}
                src={imageSrc}
                style={{
                  filter: index === textIndex ? "brightness(1)" : "brightness(0.8)",
                }}
              />
            ))}
          </div>
          {/* Text content - responsive positioning */}
          <div className="absolute w-[34.4%] h-[39%] top-[35.4%] left-[8%] z-20 ">
            <div className="relative w-full h-full">
              <div className="absolute w-full  lg:top-[-50px] left-0 font-tenor-sans textDescription  text-white tracking-[0] leading-[normal]">
                <span className="font-secondaryFont">{t("hero.subheading")}</span>
                <div className="relative w-full h-full">
                  {texts.map((text, index) => (
                    <div
                      key={index}
                      className={`absolute top-[26px] left-0 w-[110.6%] [-webkit-text-stroke:2px_#daa520] font-primaryFont font-semibold text-white text-[64px] tracking-[0] leading-[normal] transition-all duration-1000 ease-in-out transform origin-left ${index === textIndex
                        ? "opacity-100 scale-100"   // Active: Visible & Full Size
                        : "opacity-0 scale-50"      // Inactive: Invisible & Small (Zoom Effect)
                        }`}
                    >
                      {text}
                    </div>
                  ))}
                </div>
              </div>

              <p
                className="absolute w-full top-[68.5%] left-0 font-secondaryFont textDescription text-[rgba(255,255,255,0.9)] leading-[normal] font-normal tracking-[0]"
                key={`desc-${textIndex}`}
                aria-live="polite"
              >
                {descriptions[textIndex]}
              </p>
            </div>

            {/* Responsive button */}
            {/* {!isLoggedIn ? (
              <Button
                onClick={() => {
                  window.location.href = "/login";
                }}
                className="flex justify-center gap-[6.98px] px-4 xl:px-6 2xl:px-8 py-2 xl:py-3 2xl:py-4 mt-4 xl:mt-6 2xl:mt-8 bg-[#daa520] items-center rounded-none hover:bg-[#b8941c] transition-colors font-secondaryFont">
                <span className="relative [-webkit-text-stroke:0.5px_#ffffff] font-secondaryFont font-normal text-white text-[14px] tracking-[0] leading-[normal] whitespace-nowrap">
                  Register/Login
                </span>
              </Button>
            ) : null
              // <Button
              //   onClick={() => {
              //     localStorage.clear();
              //     window.location.reload();
              //   }}
              //   className="font-secondaryFont w-full bg-[#8b0000] hover:bg-[#660000] text-white py-2 text-[10px] font-normal ">
              //   Logout
              // </Button>
            } */}
          </div>
        </div>
      </div>

      {/* Mobile Layout - Matching your design image */}
      <div className="lg:hidden w-full">
        {/* Top Section - Temple background with text overlay */}
        <div className="relative w-full h-[400px] sm:h-[450px] md:h-[500px] overflow-hidden">
          {/* Background temple image */}
          <img
            className="absolute inset-0 w-full h-full object-cover"
            alt="Temple Image"
            src={tempImageWebp}
          />

          {/* Text overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-20 flex flex-col justify-center items-start px-6 sm:px-8">
            <div className="w-full max-w-sm">
              <p className="text-white textDescription font-tenor-sans font-normal mb-2 sm:mb-3">
                <span className="font-secondaryFont">{t("hero.subheading")}</span>
              </p>

              <div
                className="[-webkit-text-stroke:1px_#daa520] font-primaryFont text-[36px] font-normal text-white   leading-tight mb-4 sm:mb-6 animate-slideUpText"
                key={texts[textIndex]}>
                {texts[textIndex]}
              </div>

              <p
                className="text-white textDescription font-secondaryFont font-normal leading-relaxed mb-6 sm:mb-8 opacity-90"
                key={`mobile-desc-${textIndex}`}
                aria-live="polite"
              >
                {descriptions[textIndex]}
              </p>
              {/* Responsive button */}
              {/* {!isLoggedIn ? (
                <Button className="bg-[#daa520] hover:bg-[#b8941c] text-white px-6 py-2.5 sm:px-8 sm:py-3 text-[7px] font-secondaryFont font-normal rounded-none shadow-lg">
                  Register/Login
                </Button>
              ) : null} */}
            </div>
          </div>
        </div>

        {/* Bottom Section - Red background with abstract floral and deity image */}
        <div
          className="relative w-full bg-[#8b0000] pt-16 pb-10 sm:pt-20 sm:pb-14 md:pt-24 md:pb-20 flex justify-center items-start overflow-visible"
          style={{ minHeight: "160px" }}>
          {/* Abstract floral background - centered and extending beyond top */}
          <img
            className="absolute left-1/2 top-[-15%] -translate-x-1/2 w-[130%] h-[130%] object-cover opacity-30"
            alt="Abstract floral"
            src={abstractFloral}
          />

          {/* Additional abstract floral positioning for better coverage */}
          <img
            className="absolute left-1/2 top-[-25%] -translate-x-1/2 w-[140%] h-[140%] object-cover opacity-20"
            alt="Abstract floral overlay"
            src={abstractFloral}
          />

          {/* Deity image container - half overlaps red and normal section */}
          <div
            className="absolute left-1/2 -translate-x-1/2 z-10 w-56 h-56 sm:w-64 sm:h-64 md:w-64 md:h-64 lg:w-72 lg:h-72 -top-24 sm:-top-28 md:-top-32"
            style={{ minHeight: "0", marginBottom: 0 }}>
            {/* Golden circular frame background */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#daa520] to-[#b8941c] p-1 shadow-2xl">
              <div className="w-full h-full rounded-full overflow-hidden bg-white">
                {/* Deity Images with smooth transitions */}
                {deityImages.map((imageSrc, index) => (
                  <img
                    key={index}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out transform ${index === textIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
                      }`}
                    alt={`Deity Image ${index + 1}`}
                    src={imageSrc}
                    style={{
                      filter: index === textIndex ? "brightness(1)" : "brightness(0.8)",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Decorative glow effect */}
            <div className="absolute inset-0 rounded-full bg-[#daa520] opacity-20 blur-xl scale-110"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
