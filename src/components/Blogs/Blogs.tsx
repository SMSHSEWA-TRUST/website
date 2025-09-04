
import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Link } from 'react-router-dom';
import blogArti1 from '@/assets/images/blogarti1.webp';
import blogArti2 from '@/assets/images/blogarti2.webp';
import blogArti3 from '@/assets/images/blogarti3.webp';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';

interface BlogPost {
    id: number | string;
    date?: string;
    title: string;
    excerpt?: string;
    image: string;
    link?: string;
}

const posts: BlogPost[] = [
    { id: 1, date: 'Jan 01, 2025', title: 'Lorem ipsum dolor sit', excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', image: blogArti1, link: '/blog-details' },
    { id: 2, date: 'Jan 02, 2025', title: 'Lorem ipsum dolor sit', excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', image: blogArti2, link: '/blog-details' },
    { id: 3, date: 'Jan 03, 2025', title: 'Lorem ipsum dolor sit', excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', image: blogArti3, link: '/blog-details' },
    { id: 4, date: 'Jan 04, 2025', title: 'Lorem ipsum dolor sit', excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', image: blogArti1, link: '/blog-details' },
    { id: 5, date: 'Jan 05, 2025', title: 'Lorem ipsum dolor sit', excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', image: blogArti2, link: '/blog-details' },
    { id: 6, date: 'Jan 06, 2025', title: 'Lorem ipsum dolor sit', excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', image: blogArti3, link: '/blog-details' },
    { id: 7, date: 'Jan 07, 2025', title: 'Lorem ipsum dolor sit', excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', image: blogArti1, link: '/blog-details' }
];

const Blogs: React.FC = () => {
    return (
        <section className="w-full px-6 md:px-16 lg:px-24 py-12  font-secondaryFont">
            <div className=" text-center mb-8">
                <h2 className="font-primaryFont text-[#8b0000] textHeadingLg mb-3">All Blogs</h2>
                <div className="flex items-center justify-center  w-full">
                    <div className="flex items-center w-full max-w-md">
                        {/* Left arrow/diamond with connecting line */}
                        <div className="flex items-center flex-1">
                            <div className="w-2 h-2" style={{ backgroundColor: 'rgba(139, 0, 0, 1)', transform: 'rotate(45deg)' }}></div>
                            <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(139, 0, 0, 1)' }}></div>
                        </div>

                        {/* Center dots with continuous line: small-small-big-small-small */}
                        <div className="flex items-center">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'rgba(139, 0, 0, 1)' }}></div>
                            <div className="w-1.5 h-px" style={{ backgroundColor: 'rgba(139, 0, 0, 1)' }}></div>
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'rgba(139, 0, 0, 1)' }}></div>
                            <div className="w-1.5 h-px" style={{ backgroundColor: 'rgba(139, 0, 0, 1)' }}></div>
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgba(139, 0, 0, 1)' }}></div>
                            <div className="w-1.5 h-px" style={{ backgroundColor: 'rgba(139, 0, 0, 1)' }}></div>
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'rgba(139, 0, 0, 1)' }}></div>
                            <div className="w-1.5 h-px" style={{ backgroundColor: 'rgba(139, 0, 0, 1)' }}></div>
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'rgba(139, 0, 0, 1)' }}></div>
                        </div>

                        {/* Right arrow/diamond with connecting line */}
                        <div className="flex items-center flex-1">
                            <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(139, 0, 0, 1)' }}></div>
                            <div className="w-2 h-2" style={{ backgroundColor: 'rgba(139, 0, 0, 1)', transform: 'rotate(45deg)' }}></div>
                        </div>
                    </div>
                </div>
                <p className=" textDescription mt-4 mb-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
            </div>

            <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <Card key={post.id} className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0">

                        <LazyLoadImage
                            src={post.image}
                            alt={post.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                        />

                        <div
                            className="absolute inset-0"
                            style={{
                                background: 'linear-gradient(180deg, rgba(139, 0, 0, 0) 0%, rgba(139, 0, 0, 0.75) 64.9%)',
                            }}
                        />

                        <CardContent className="relative z-10 flex flex-col justify-end h-64 sm:h-72 lg:h-80 p-6">
                            <div className="text-white/80 textDescription font-secondaryFont mb-2">{post.date}</div>
                            <h3 className="text-white textHeading font-semibold mb-4 font-primaryFont leading-tight">{post.title}</h3>
                            {post.excerpt && (
                                <p className="text-white/70 textDescription mb-4 line-clamp-2 font-secondaryFont">{post.excerpt}</p>
                            )}
                            <Link to={post.link || '/blog-details'}>
                                <Button className="w-fit bg-[#8b0000] hover:bg-[#a32d13] text-white px-4 py-2 rounded-lg transition-colors duration-200 font-secondaryFont font-normal textDescription border border-white">Read Blog</Button>
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
};

export default Blogs;