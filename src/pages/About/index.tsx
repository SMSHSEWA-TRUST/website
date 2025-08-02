import HeroSection from "../../components/common/HeroSection";
import AboutWorship from "@/components/about/AboutWorship";
import ImageSection from "@/components/about/ImageSection";
import OmNamehShivaya from "../../components/home/OmNamehShivaya";
import ScrollingBanner from "../../components/home/ScrollingBanner";
import { ContactSection } from "../../components/home/ContactSection";
import { BlogSection } from "../../components/home/BlogSection";
import ArtiSection from "@/components/about/ArtiSection";
import TeamSection from "@/components/about/Team";

export const AboutPage = (): JSX.Element => {
    return (
        <>
          

            {/* Hero Section */}
            <HeroSection
                title="About"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                backgroundImage="/About.webp"
            />
            <AboutWorship />
            <ImageSection />
            <ArtiSection />
            <TeamSection />
            {/* Om Namah Shivaya Section */}
            <OmNamehShivaya />

            {/* Scrolling Banner */}
            <ScrollingBanner />

            {/* Contact Section */}
            <ContactSection />

            {/* Blog Articles Section */}
            <BlogSection />
            {/* Info Cards Section */}
            {/* <InfoCards /> */}

            {/* Footer Section */}

           
        </>
              
         
    );
};