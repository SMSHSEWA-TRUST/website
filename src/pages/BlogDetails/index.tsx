import Header from "../../components/common/Header";
import HeroSection from "../../components/common/HeroSection";
import { Footer } from "../../components/common/Footer";
import BlogDetails from "@/components/Blogs/BlogDetails";
export const BlogDetailsPage = (): JSX.Element => {
    return (
        <div className="bg-white flex flex-row justify-center w-full">
            <div className="bg-white overflow-hidden ">
                {/* Header Section */}
                <Header />

                {/* Hero Section */}
                <HeroSection
                    title="Blogs "
                    backgroundImage="/Blogdetail.webp"
                />
                <BlogDetails/>
                <Footer />
            </div>
        </div>
    );
};