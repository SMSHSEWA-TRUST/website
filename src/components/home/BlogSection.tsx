import React from 'react';
import { Link } from 'react-router-dom';
import ganeshImage from '@/assets/images/ganesh.webp';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { LazyLoadImage } from 'react-lazy-load-image-component';

interface BlogArticle {
    id?: string | number;
    date?: string;
    title?: string;
    image?: string;
    excerpt?: string;
}

interface BlogSectionProps {
    title?: string;
    description?: string;
    articles?: BlogArticle[];
    className?: string;
}

export const BlogSection: React.FC<BlogSectionProps> = ({
    title = "Lorem ipsum dolor sit amet, consectetur adipiscing eli",
    description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    articles = [
        {
            id: 1,
            date: "Jan 01, 2025",
            title: "Lorem ipsum dolor sit",
            image: ganeshImage,
        },
        {
            id: 2,
            date: "Jan 02, 2025",
            title: "Lorem ipsum dolor sit",
            image: ganeshImage,
        },
        {
            id: 3,
            date: "Jan 03, 2025",
            title: "Lorem ipsum dolor sit",
            image: ganeshImage
        },
    ],
    className = ""
}) => {
    return (
        <section className={`w-full  px-4 md:px-16 lg:px-24 py-12 lg:py-16 ${className}`}>

            {/* Header Section */}
            <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:gap-8 xl:gap-12 items-start lg:items-center mb-12 lg:mb-16">

                {/* Title - Left Column */}
                <div className="lg:col-span-1">
                    <h2 className="font-primaryFont text-[#8b0000] textHeadingLg font-normal leading-tight">
                        {title}
                    </h2>
                </div>

                {/* Description - Center Column */}
                <div className="lg:col-span-1">
                    <p className="font-secondaryFont text-[#1e1e1e]/50 textDescription leading-relaxed">
                        {description}
                    </p>
                </div>

                {/* Button - Right Column */}
                <div className="lg:col-span-1 flex justify-start lg:justify-end items-center">
                    <Link to="/blogs">
                        <Button
                            className="bg-[#8b0000] hover:bg-[#a32d13] text-white px-6 py-3 rounded-sm transition-colors duration-200 font-secondaryFont font-normal textDescription tracking-wide shadow-md hover:shadow-lg "
                            aria-label="Read all articles"
                        >
                            Read  All Blogs
                        </Button>
                    </Link>
                </div>

            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {articles.map((article, index) => (
                    <BlogCard
                        key={article.id || index}
                        article={article}
                    />
                ))}
            </div>

        </section>
    );
};

// Separate BlogCard component for better maintainability
interface BlogCardProps {
    article: BlogArticle;
}

const BlogCard: React.FC<BlogCardProps> = ({ article }) => {
    return (
        <Card className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0">

            {/* Background Image (Lazy Loaded) */}
            <LazyLoadImage
                src={article.image || ganeshImage}
                alt={article.title || 'Blog image'}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
            />

            {/* Overlay */}
            <div className="absolute inset-0 "
                style={{
                    background: 'linear-gradient(180deg, #8B000000 0%, #8B0000 )',
                }}
            />


            {/* Content */}
            <CardContent className="relative z-10 flex flex-col justify-end h-64 sm:h-72 lg:h-80 p-6">

                {/* Date */}
                <div className="text-white/90 textDescription font-secondaryFont mb-2">
                    {article.date || "Jan 01, 2025"}
                </div>

                {/* Title */}
                <h3 className="text-white textHeading  mb-4 font-primaryFont leading-tight">
                    {article.title || "Lorem ipsum dolor sit"}
                </h3>

                {/* Excerpt (if provided) */}
                {article.excerpt && (
                    <p className="text-white/70 textDescription mb-4 line-clamp-2 font-secondaryFont">
                        {article.excerpt}
                    </p>
                )}

                {/* Read More Button */}
                <Link to="/blog-details">
                    <Button
                        className="w-fit bg-[#8b0000] hover:bg-[#a32d13] text-white px-4 py-2 rounded-lg transition-colors duration-200 font-secondaryFont font-normal textDescription border border-white"
                        aria-label={`Read article: ${article.title}`}
                    >
                        Read Articles
                    </Button>
                </Link>

            </CardContent>
        </Card>
    );
};

export default BlogSection; 