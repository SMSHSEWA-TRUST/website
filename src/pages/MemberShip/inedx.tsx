import Header from "../../components/common/Header";
import HeroSection from "../../components/common/HeroSection";

import ScrollingBanner from "../../components/home/ScrollingBanner";
import { ContactSection } from "../../components/home/ContactSection";
import { BlogSection } from "../../components/home/BlogSection";
import { Footer } from "../../components/common/Footer";

import SubscriptionPlans from "@/components/memberShip/SubscriptionPlans";

export const MemberShipPage = (): JSX.Element => {
    return (
        <div className="bg-white flex flex-row justify-center w-full">
            <div className="bg-white overflow-hidden ">
                {/* Header Section */}
                <Header />

                {/* Hero Section */}
                <HeroSection
                    title="Subscription"
                    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                    backgroundImage="/membership.png"
                />

                <SubscriptionPlans />
                {/* Scrolling Banner */}
                <ScrollingBanner />

                {/* Contact Section */}
                <ContactSection />

                {/* Blog Articles Section */}
                <BlogSection />
                {/* Info Cards Section */}
                {/* <InfoCards /> */}

                {/* Footer Section */}

                <Footer />
            </div>
        </div>
    );
};