import HeroSection from "../../components/common/HeroSection";
import BlogDetails from "@/components/Blogs/BlogDetails";
export const BlogDetailsPage = (): JSX.Element => {
    return (
        <>
            <HeroSection
                title="Blog Details"
                backgroundImage="/Blogdetail.webp"
            />
            <BlogDetails />
            
        </>
    );
};