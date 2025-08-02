import HeroSection from "../../components/common/HeroSection";
import ScrollingBanner from "../../components/home/ScrollingBanner";
import { ContactSection } from "../../components/home/ContactSection";
import { BlogSection } from "../../components/home/BlogSection";
import Puja from "../../components/puja/Puja";

export const PujaPage = (): JSX.Element => {
    return (
       
        <>

          

            {/* Hero Section */}
            <HeroSection
                title="Puja'S"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                backgroundImage="/puja.webp"
            />
            {/* Puja Section */}
            <div className="mb-10 lg:mb-[200px]">
                <Puja />
            </div>
            {/* Scrolling Banner */}
            <ScrollingBanner />

            {/* Contact Section */}
            <ContactSection />

            {/* Blog Articles Section */}
            <BlogSection />
           

      


        </>);
};