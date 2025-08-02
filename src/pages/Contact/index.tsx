import HeroSection from "../../components/common/HeroSection";
import ContactCards from "../../components/home/ContactCards";
import OmNamehShivaya from "../../components/home/OmNamehShivaya";
import ScrollingBanner from "../../components/home/ScrollingBanner";
import { ContactSection } from "../../components/home/ContactSection";
export const ContactPage = (): JSX.Element => {
  return (
   
    <>
     

      {/* Hero Section */}
      <HeroSection
        title="contact "
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        backgroundImage="/membership.png"
      />

      {/* Contact Section */}
      <ContactCards />


      <OmNamehShivaya />

      {/* Scrolling Banner */}
      <ScrollingBanner />

      {/* Contact Section */}
      <ContactSection />



    

    </>
       
  );
};