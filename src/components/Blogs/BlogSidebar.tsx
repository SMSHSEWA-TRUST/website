import React from "react";

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
        <div className="w-full max-w-[320px] mx-auto lg:w-80 lg:mx-0">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
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
                <h3 className="text-lg font-serif text-gray-800 mb-4">Latest Posts</h3>

                {/* Latest Posts List */}
                <div className="flex flex-col gap-4 mb-6">
                    {latestPosts.map((post) => (
                        <div key={post.id} className="flex gap-3 items-center">
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-16 h-12 object-cover rounded flex-shrink-0"
                            />
                            <div className="flex flex-col justify-center flex-1">
                                <h4 className="text-sm font-medium text-red-700 mb-1">
                                    {post.title}
                                </h4>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    {post.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* See All Blogs Button */}
                <a
                    href="#"
                    className="block w-full bg-orange-500 text-white text-center py-2 text-sm font-medium hover:bg-orange-600 transition-colors"
                >
                    See All Blogs
                </a>
            </div>
        </div>
    );
};

export default BlogSidebar;
