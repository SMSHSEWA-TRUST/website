import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ganeshImage from '@/assets/images/ganesh.webp';
import { Button } from '../ui/button';
import { useI18n } from '@/lib/i18n';
import { getBlogPosts } from '@/services/blog.service';
import BlogCard from '../Blogs/BlogCard';

interface BlogPost {
    id: number | string;
    date?: string;
    title: string;
    excerpt?: string;
    image?: string;
    link?: string;
}

interface BlogSectionProps {
    title?: string;
    description?: string;
    articles?: BlogPost[];
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

    // If articles not provided, populate first three from translations
    const rawTranslated = t('BlogPage.Blogs');
    const translatedBlogs = Array.isArray(rawTranslated) ? rawTranslated as Array<{ title?: string; date?: string }> : [];

    const defaultArticles: BlogPost[] = translatedBlogs.slice(0, 3).map((b, idx) => ({
        id: idx + 1,
        title: b.title ?? '',
        date: b.date,
        excerpt: undefined,
        image: ganeshImage,
        link: '/blogs'
    }));

    // fetched posts from WP (top 3)
    const [fetchedArticles, setFetchedArticles] = useState<BlogPost[]>([]);

    useEffect(() => {
        let mounted = true;
        // only fetch if caller didn't provide articles
        if (articles && articles.length > 0) return;

        getBlogPosts({ per_page: 3, _embed: true }).then((response) => {
            if (!mounted) return;
            const mapped = response.data.map((p: any) => {
                // Try to get featured image from embedded media
                const featuredMedia = p?._embedded?.['wp:featuredmedia']?.[0];
                const image = featuredMedia?.source_url || p?.jetpack_featured_media_url || '';

                return {
                    id: p.id,
                    title: p?.title?.rendered ?? `Post ${p.id}`,
                    date: p?.date,
                    excerpt: p?.excerpt?.rendered,
                    image: image,
                    link: `/blog-details/${p.id}`
                } as BlogPost;
            });
            setFetchedArticles(mapped);
        }).catch(() => {
            // ignore errors and keep defaults
        });
        return () => { mounted = false; };
    }, [articles]);

    const articlesToShow = (articles && articles.length > 0) ? articles : (fetchedArticles.length > 0 ? fetchedArticles : defaultArticles);

    return (
        <section className={`w-full px-4 md:px-16 lg:px-24 py-12 lg:py-16 ${className}`}>

            {/* Header Section */}
            {/* FIX: Changed grid-col-1 to grid-cols-1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 xl:gap-12 items-start lg:items-center mb-12 lg:mb-16">

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
                            className="bg-[#8b0000] hover:bg-[#a32d13] text-white px-6 py-3 rounded-sm transition-colors duration-200 font-secondaryFont font-normal textDescription tracking-wide shadow-md hover:shadow-lg"
                            aria-label={t('home.blogSection.readAllAria') as string}
                        >
                            {t('home.blogSection.readAll')}
                        </Button>
                    </Link>
                </div>

            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                {articlesToShow.map((post) => (
                    <BlogCard post={post as BlogPost} />
                ))}
            </div>

        </section>
    );
};

export default BlogSection;