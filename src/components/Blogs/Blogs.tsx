
import BlogSidebar from "./BlogSidebar";
import blogArti1 from '@/assets/images/blogarti1.webp';
import blogArti2 from '@/assets/images/blogarti2.webp';
import blogArti3 from '@/assets/images/blogarti3.webp';

const blogPosts = [
    {
        id: 1,
        title: "Essence of Hindu Wisdom",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Read More",
        image: blogArti1,
        link: "#"
    },
    {
        id: 2,
        title: "Essence of Hindu Wisdom",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Read More",
        image: blogArti2,
        link: "#"
    },
    {
        id: 3,
        title: "Essence of Hindu Wisdom",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Read More",
        image: blogArti3,
        link: "#"
    }
];

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

const Blogs = () => {
    return (
        <div className="mx-auto p-6 bg-white">
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Main Blog Posts Section */}
                <div className="w-full max-w-[729px] mx-auto">
                    <div className="space-y-6">
                        {blogPosts.map((post) => (
                            <div key={post.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col">
                                <div className="w-full aspect-[16/10] bg-gray-100 flex items-center justify-center">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover object-center rounded-t"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="p-6 flex flex-col items-center justify-center flex-1">
                                    <h2 className="text-xl font-serif text-red-700 mb-2 text-center w-full">
                                        {post.title}
                                    </h2>
                                    <p className="text-sm text-gray-700 leading-relaxed mb-3 text-center w-full">
                                        {post.description}
                                    </p>
                                    <div className="flex justify-center w-full">
                                        <a
                                            href={post.link}
                                            className="bg-red-700 text-white px-4 py-2 text-sm font-medium rounded hover:bg-red-800 transition-colors"
                                        >
                                            Read Article
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <BlogSidebar latestPosts={latestPosts} />
            </div>
        </div>
    );
};

export default Blogs;