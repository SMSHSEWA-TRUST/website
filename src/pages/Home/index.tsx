import Header from "../../components/common/Header";
import Hero from "../../components/home/Hero";
import About from "../../components/home/About";
import Services from "../../components/home/Services";
import LiveDarshan from "../../components/home/LiveDarshan";
import DivinePower from "../../components/home/DivinePower";
import ContactCards from "../../components/home/ContactCards";
import DonationSection from "../../components/home/DonationSection";
import GridLayout from "../../components/home/GridLayout";
import OmNamehShivaya from "../../components/home/OmNamehShivaya";
import ScrollingBanner from "../../components/home/ScrollingBanner";
import { ContactSection } from "../../components/home/ContactSection";
import { BlogSection } from "../../components/home/BlogSection";
import { Footer } from "../../components/common/Footer";
import BhudaanSection from "@/components/home/BhudaanSection";

export const HomePage = (): JSX.Element => {
    return (
        <div className="bg-white flex flex-row justify-center w-full">
            <div className="bg-white overflow-hidden ">
                {/* Header Section */}
                <Header />

                {/* Hero Section */}
                <Hero />

                {/* About Section */}
                <About />
                {/* Bhudaan Section */}
                {<BhudaanSection />}

                {/* Services Section */}
                {/* Live Darshan Section */}
                <LiveDarshan />

                {/* Services Section */}
                <Services />

                {/* Divine Power Section */}
                <DivinePower />

                {/* Contact Cards Section */}
                <ContactCards />
                {/* Donation Section */}
                <DonationSection />

                {/* Grid Layout Section */}
                <GridLayout />

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

                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
};