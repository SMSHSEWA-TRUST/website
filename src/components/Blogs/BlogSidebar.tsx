import React from "react";
import { Link } from "react-router-dom";
import { LazyLoadImage } from 'react-lazy-load-image-component';

interface LatestPost {
    id: number;
    title: string;
    description: string;
    image: string;
    link: string;
}

interface BlogSidebarProps {
    latestPosts: LatestPost[];
}

const BlogSidebar: React.FC<BlogSidebarProps> = ({ latestPosts }) => {
    // truncate helper: shortens text to maxLength and adds ellipsis
    const truncate = (text?: string, maxLength = 120) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        // try to cut at the last space before maxLength to avoid mid-word cut
        const truncated = text.slice(0, maxLength + 1);
        const lastSpace = truncated.lastIndexOf(' ');
        if (lastSpace > 0) return `${truncated.slice(0, lastSpace)}...`;
        return `${text.slice(0, maxLength)}...`;
    };
    return (
        <div className="w-full   lg:mx-0 font-secondaryFont">
            <div className="bg-white  rounded-lg ">

                {/* Latest Posts Header */}
                <h3 className="font-primaryFont textHeadingLg  text-[#8b0000] mb-4">Latest Posts</h3>

                {/* Latest Posts List */}
                <div className="flex flex-col gap-4 mb-6">
                    {latestPosts.map((post) => (
                        <Link
                            key={post.id}
                            to={post.link}
                            className="flex gap-3 items-center hover:opacity-95 no-underline"
                        >
                            <LazyLoadImage
                                src={post.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=80&h=60&fit=crop&auto=format'} // fallback image if none
                                alt={post.title}
                                className="w-24 h-24 object-cover rounded flex-shrink-0"
                                loading="lazy"
                            />
                            <div className="flex flex-col justify-center flex-1">
                                <h4 className="font-primaryFont textHeading font-medium text-red-700 mb-1">
                                    {truncate(post.title, 15)}
                                </h4>
                                <p className="font-secondaryFont textDescription  text-gray-600 leading-relaxed">
                                    {truncate(post.description, 80)}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* See All Blogs Button */}
                <Link
                    to="/blogs"
                    className="font-secondaryFont textDescription block w-full bg-orange-500 text-white text-center py-2 text-sm font-medium hover:bg-orange-600 transition-colors"
                >
                    See All Blogs
                </Link>
            </div>
        </div>
    );
};

export default BlogSidebar;
