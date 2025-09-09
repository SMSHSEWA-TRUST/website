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
    return (
        <div className="w-full max-w-[400px] mx-auto  lg:mx-0 font-secondaryFont">
            <div className="bg-white border border-gray-200 rounded-lg ">
                {/* Search Bar */}
                <form className="mb-4">
                    <div className="flex">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="flex-1 border border-gray-300 rounded-l px-3 py-2 text-sm focus:outline-none"
                            style={{ fontFamily: 'inherit' }}
                        />
                        <button type="submit" className="bg-red-700 rounded-r px-4 flex items-center justify-center">
                            <svg width="20" height="20" fill="white" viewBox="0 0 20 20">
                                <circle cx="9" cy="9" r="7" stroke="white" strokeWidth="2" fill="none" />
                                <line x1="15" y1="15" x2="19" y2="19" stroke="white" strokeWidth="2" />
                            </svg>
                        </button>
                    </div>
                </form>

                {/* Latest Posts Header */}
                <h3 className="font-primaryFont textHeadingLg  text-[#8b0000] mb-4">Latest Posts</h3>

                {/* Latest Posts List */}
                <div className="flex flex-col gap-4 mb-6">
                    {latestPosts.map((post) => (
                        <div key={post.id} className="flex gap-3 items-center">
                            <LazyLoadImage
                                src={post.image}
                                alt={post.title}
                                className="w-24 h-24 object-cover rounded flex-shrink-0"
                                loading="lazy"
                            />
                            <div className="flex flex-col justify-center flex-1">
                                <h4 className="font-primaryFont textHeading font-medium text-red-700 mb-1">
                                    {post.title}
                                </h4>
                                <p className="font-secondaryFont textDescription  text-gray-600 leading-relaxed">
                                    {post.description}
                                </p>
                            </div>
                        </div>
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
