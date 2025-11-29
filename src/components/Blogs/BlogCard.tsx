import { LazyLoadImage } from "react-lazy-load-image-component";
import { Card, CardContent } from "../ui/card";
import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";

type Post = {
    id: string | number;
    title: string;
    image?: string;
    date?: string | number | Date;
    link?: string;
    [key: string]: any;
}

type BlogCardProps = {
    post: Post;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
    const { t } = useI18n();
    return (
        <div key={post.id} className="group relative h-full w-full">
            {/* <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-[#8B0000] via-[#D05E2D] to-[#AD2F16] opacity-0 blur-md transition duration-500 group-hover:opacity-75 group-hover:scale-105" /> */}
            <Card className="relative h-full overflow-hidden rounded-lg border-0 shadow-lg transition-all duration-300 bg-transparent group-hover:scale-105">
                <LazyLoadImage
                    src={
                        post.image ||
                        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&auto=format"
                    }
                    alt={post.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#e4d4d400] to-[#860202]" />
                <CardContent className="relative z-10 flex h-64 flex-col justify-end p-6 sm:h-72 lg:h-80">
                    <div className="textDescription font-secondaryFont mb-2 text-white/80">
                        {post.date ? new Date(post.date).toLocaleDateString() : ""}
                    </div>
                    <h3
                        className="textDescription font-primaryFont mb-4 text-white leading-tight"
                        dangerouslySetInnerHTML={{ __html: post.title }}
                    />
                    <Link to={post.link || "/blog-details"} className="w-fit">
                        <div className="flex items-center">
                            <span className="w-0 overflow-hidden whitespace-nowrap font-secondaryFont font-medium text-white opacity-0 transition-all duration-500 group-hover:w-20 group-hover:opacity-100">
                                {t("BlogPage.buttonText") || "Read more"}
                            </span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                className="ml-1 h-6 w-6 text-white transition-transform duration-300"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                                />
                            </svg>
                        </div>
                    </Link>
                </CardContent>
            </Card>
        </div>
    )
}
export default BlogCard;