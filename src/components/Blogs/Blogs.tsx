
import BlogSidebar from "./BlogSidebar";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Link } from 'react-router-dom';
import blogArti1 from '@/assets/images/blogarti1.webp';
import blogArti2 from '@/assets/images/blogarti2.webp';
import blogArti3 from '@/assets/images/blogarti3.webp';

const blogPosts = [
    {
        id: 1,
        title: "Essence of Hindu Wisdom",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Read More",
        image: blogArti1,
        link: "/blog-details"
    },
    {
        id: 2,
        title: "Essence of Hindu Wisdom",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Read More",
        image: blogArti2,
        link: "/blog-details"
    },
    {
        id: 3,
        title: "Essence of Hindu Wisdom",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Read More",
        image: blogArti3,
        link: "/blog-details"
    }
];

const latestPosts = [
    {
        id: 1,
        title: "Title",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=80&h=60&fit=crop",
        link: "/blog-details"
    },
    {
        id: 2,
        title: "Title",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=80&h=60&fit=crop",
        link: "/blog-details"
    },
    {
        id: 3,
        title: "Title",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
        image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=80&h=60&fit=crop",
        link: "/blog-details"
    }
];

const Blogs = () => {
    return (
        <div className="mx-auto pt-2 lg:pl-14 lg:pt-10 md:pb-10 bg-white font-secondaryFont">
            <div className="flex flex-col lg:flex-row  gap-10 lg:gap-12 lg:mr-44">
                {/* Main Blog Posts Section */}
                <div className="w-[90%] md:w-full lg:pl-10 lg:max-w-[729px] m-auto">
                    <div className="space-y-6">
                        {blogPosts.map((post) => (
                            <div key={post.id} className="bg-white   overflow-hidden flex flex-col">
                                <div className="w-full aspect-[16/10] bg-gray-100 flex items-center justify-center">
                                    <LazyLoadImage
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover object-center rounded-t"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="pt-6 pb-2 flex flex-col items-center justify-center flex-1">
                                    <h2 className="font-primaryFont text-xl text-red-700 mb-2 text-center w-full">
                                        {post.title}
                                    </h2>
                                    <p className="font-secondaryFont text-sm text-gray-700 leading-relaxed mb-3 text-center w-full">
                                        {post.description}
                                    </p>
                                    <div className="flex justify-center w-full">
                                        <Link
                                            to={post.link}
                                            className="font-secondaryFont bg-red-700 text-white px-4 py-2 text-sm font-medium rounded hover:bg-red-800 transition-colors"
                                        >
                                            Read Article
                                        </Link>
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