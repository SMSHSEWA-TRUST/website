import Header from "../../components/common/Header";
import HeroSection from "../../components/common/HeroSection";
import { Footer } from "../../components/common/Footer";
import Blogs  from "@/components/Blogs/Blogs";

export const BlogPage = (): JSX.Element => {
    return (
        <div className="bg-white flex flex-row justify-center w-full">
            <div className="bg-white overflow-hidden ">
                {/* Header Section */}
                <Header />

                {/* Hero Section */}
                <HeroSection
                    title="Blogs "
                    backgroundImage="/BlogImage.webp"
                    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. "
                />
                <Blogs />
                <Footer />
            </div>
        </div>
    );
};