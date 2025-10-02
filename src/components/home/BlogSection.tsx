import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ganeshImage from '@/assets/images/ganesh.webp';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useI18n } from '@/lib/i18n';
import { getBlogPosts } from '@/services/blog.service';

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
    title,
    description,
    articles,
    className = ""
}) => {
    const { t } = useI18n();
    const titleToUse = title ?? (t('home.blogSection.title') as string);
    const descriptionToUse = description ?? (t('home.blogSection.description') as string);
    // If articles not provided, populate first three from translations (BlogPage.Blogs)
    const rawTranslated = t('BlogPage.Blogs');
    const translatedBlogs = Array.isArray(rawTranslated) ? rawTranslated as Array<{ title?: string; date?: string }> : [];
    const defaultArticles: BlogArticle[] = translatedBlogs.slice(0, 3).map((b, idx) => ({
        id: idx + 1,
        title: b.title,
        date: b.date,
        image: ganeshImage,
    }));
    // fetched posts from WP (top 3)
    const [fetchedArticles, setFetchedArticles] = useState<BlogArticle[]>([]);

    const stripHtml = (html?: string) => {
        if (!html) return '';
        return html.replace(/<[^>]*>/g, '').trim();
    };

    useEffect(() => {
        let mounted = true;
        // only fetch if caller didn't provide articles
        if (articles && articles.length > 0) return;
        getBlogPosts({ per_page: 3, _embed: true }).then((response) => {
            if (!mounted) return;
            const mapped = response.data.map((p: any) => {
                const media = p?._embedded?.['wp:featuredmedia']?.[0];
                const image = media?.source_url || p?.jetpack_featured_media_url || undefined;
                return {
                    id: p.id,
                    title: stripHtml(p?.title?.rendered || ''),
                    date: p?.date,
                    image,
                    excerpt: stripHtml(p?.excerpt?.rendered || ''),
                } as BlogArticle;
            });
            setFetchedArticles(mapped);
        }).catch(() => {
            // ignore errors and keep defaults
        });
        return () => { mounted = false; };
    }, [articles]);

    const articlesToShow = (articles && articles.length > 0) ? articles : (fetchedArticles.length > 0 ? fetchedArticles : defaultArticles);
    return (
        <section className={`w-full  px-4 md:px-16 lg:px-24 py-12 lg:py-16 ${className}`}>

            {/* Header Section */}
            <div className="grid  grid-col-1 lg:grid-col-2 xl:grid-cols-3 gap-6 lg:gap-8 xl:gap-12 items-start lg:items-center mb-12 lg:mb-16">

                {/* Title - Left Column */}
                <div className="lg:col-span-1">
                    <h2 className="font-primaryFont text-[#8b0000] textHeadingLg font-normal leading-tight">
                        {titleToUse}
                    </h2>
                </div>

                {/* Description - Center Column */}
                <div className="lg:col-span-1">
                    <p className="font-secondaryFont text-[#1e1e1e]/50 textDescription leading-relaxed">
                        {descriptionToUse}
                    </p>
                </div>

                {/* Button - Right Column */}
                <div className="lg:col-span-1 flex justify-start lg:justify-end items-center">
                    <Link to="/blogs">
                        <Button
                            className="bg-[#8b0000] hover:bg-[#a32d13] text-white px-6 py-3 rounded-sm transition-colors duration-200 font-secondaryFont font-normal textDescription tracking-wide shadow-md hover:shadow-lg "
                            aria-label={t('home.blogSection.readAllAria') as string}
                        >
                            {t('home.blogSection.readAll')}
                        </Button>
                    </Link>
                </div>

            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                {articlesToShow.map((article, index) => (
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
    const { t } = useI18n();

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
                    {article.date ? new Date(article.date).toLocaleDateString() : "Jan 01, 2025"}
                </div>

                {/* Title */}
                <h3 className="text-white textDescription mb-4 font-primaryFont leading-tight">
                    {article.title || "Lorem ipsum dolor sit"}
                </h3>

                {/* Excerpt (if provided) */}
                {/* {article.excerpt && (
                    <p className="text-white/70 textDescription mb-4 line-clamp-2 font-secondaryFont">
                        {article.excerpt}
                    </p>
                )} */}

                {/* Read More Button */}
                <Link to={`/blog-details/${article.id ?? 1}`}>
                    <Button
                        className="w-fit bg-[#8b0000] hover:bg-[#a32d13] text-white px-4 py-2 rounded-lg transition-colors duration-200 font-secondaryFont font-normal textDescription border border-white"
                        aria-label={`${t('home.blogSection.readArticleAria') as string} ${article.title || ''}`}
                    >
                        {t('home.blogSection.readArticle')}
                    </Button>
                </Link>

            </CardContent>
        </Card>
    );
};

export default BlogSection; 