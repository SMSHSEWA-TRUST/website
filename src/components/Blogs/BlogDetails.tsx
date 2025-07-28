import BlogSidebar from "./BlogSidebar";


const latestPosts = [
    {
        id: 1,
        title: "Title",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=80&h=60&fit=crop",
        link: "#"
    },
    {
        id: 2,
        title: "Title",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=80&h=60&fit=crop",
        link: "#"
    },
    {
        id: 3,
        title: "Title",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
        image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=80&h=60&fit=crop",
        link: "#"
    }
];

const BlogDetails = () => {
    return (
        <div className="mx-auto p-6 bg-white">
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Main Blog Details Section */}
                <div className="w-full max-w-3xl mx-auto mb-8">
                    <div className="flex flex-col gap-6">
                        <p className="text-xs text-gray-700 leading-relaxed">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                        <h2 className="text-lg font-serif text-[#B91C1C] mb-1 mt-2">Sub Heading 1</h2>
                        <p className="text-xs text-gray-700 leading-relaxed">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                        <div className="flex justify-center">
                            <div className="w-full max-w-[729px] aspect-[4/3]  overflow-hidden flex items-center justify-center">
                                <img src="BlogDetails1.webp" alt="Main" className="w-full h-full object-cover object-center" />
                            </div>
                        </div>
                        <h2 className="text-lg font-serif text-[#B91C1C] mb-1 mt-2">Sub Heading 2</h2>
                        <p className="text-xs text-gray-700 leading-relaxed">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <img src="/BlogDetails2.webp" alt="Sub1" className="rounded-lg w-full sm:w-1/2 object-cover" />
                            <img src="/BlogDetaills3.webp" alt="Sub2" className="rounded-lg w-full sm:w-1/2 object-cover" />
                        </div>
                        <p className="text-xs text-gray-700 leading-relaxed mt-2">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                    </div>
                </div>


                {/* Sidebar */}
                <BlogSidebar latestPosts={latestPosts} />
            </div>
        </div>
    );
};

export default BlogDetails;