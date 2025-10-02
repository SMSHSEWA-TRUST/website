
import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getBlogPosts } from '@/services/blog.service';
// removed static demo images; using WP data instead
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { useI18n } from '@/lib/i18n';

interface BlogPost {
    id: number | string;
    date?: string;
    title: string;
    excerpt?: string;
    image?: string;
    link?: string;
}

const Blogs: React.FC = () => {

    const { t } = useI18n();

    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const postsPerPage = 9;

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        setError(null);

        getBlogPosts({
            per_page: postsPerPage,
            page: currentPage
        }).then((response) => {
            if (!mounted) return;
            const mapped = response.data.map((p: any) => ({
                id: p.id,
                title: p?.title?.rendered ?? `Post ${p.id}`,
                date: p?.date,
                excerpt: p?.excerpt?.rendered,
                image: p?.featured_media ? undefined : undefined,
                link: `/blog-details/${p.id}`
            } as BlogPost));
            setPosts(mapped);
            if (response.totalPages > 0) {
                setTotalPages(response.totalPages);
            }
        }).catch((e) => {
            if (!mounted) return;
            setError(e?.message ?? 'Failed to load posts');
        }).finally(() => {
            if (mounted) setLoading(false);
        });

        return () => { mounted = false; };
    }, [currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const renderPagination = () => {
        const pages = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // Previous button
        pages.push(
            <button
                key="prev"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg textDescription font-secondaryFont transition-colors ${currentPage === 1
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-[#8b0000] border border-[#8b0000] hover:bg-[#8b0000] hover:text-white'
                    }`}
            >
                Previous
            </button>
        );

        // First page
        if (startPage > 1) {
            pages.push(
                <button
                    key={1}
                    onClick={() => handlePageChange(1)}
                    className="px-4 py-2 rounded-lg textDescription font-secondaryFont bg-white text-[#8b0000] border border-[#8b0000] hover:bg-[#8b0000] hover:text-white transition-colors"
                >
                    1
                </button>
            );
            if (startPage > 2) {
                pages.push(
                    <span key="ellipsis1" className="px-2 py-2 text-gray-500">
                        ...
                    </span>
                );
            }
        }

        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-4 py-2 rounded-lg textDescription font-secondaryFont transition-colors ${currentPage === i
                            ? 'bg-[#8b0000] text-white'
                            : 'bg-white text-[#8b0000] border border-[#8b0000] hover:bg-[#8b0000] hover:text-white'
                        }`}
                >
                    {i}
                </button>
            );
        }

        // Last page
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(
                    <span key="ellipsis2" className="px-2 py-2 text-gray-500">
                        ...
                    </span>
                );
            }
            pages.push(
                <button
                    key={totalPages}
                    onClick={() => handlePageChange(totalPages)}
                    className="px-4 py-2 rounded-lg textDescription font-secondaryFont bg-white text-[#8b0000] border border-[#8b0000] hover:bg-[#8b0000] hover:text-white transition-colors"
                >
                    {totalPages}
                </button>
            );
        }

        // Next button
        pages.push(
            <button
                key="next"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg textDescription font-secondaryFont transition-colors ${currentPage === totalPages
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-[#8b0000] border border-[#8b0000] hover:bg-[#8b0000] hover:text-white'
                    }`}
            >
                Next
            </button>
        );

        return pages;
    };

    return (
        <section className="w-full px-6 md:px-16 lg:px-24 py-12  font-secondaryFont">
            <div className=" text-center mb-8">
                <h2 className="font-primaryFont text-[#8b0000] textHeadingLg mb-3">{t('BlogPage.title')}</h2>
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
                    {t('BlogPage.description')}
                </p>
            </div>

            <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading && <div className="col-span-full text-center">Loading...</div>}
                {error && <div className="col-span-full text-center text-red-600">{error}</div>}
                {posts.map((post) => (
                    <Card key={post.id} className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0">

                        <LazyLoadImage
                            src={post.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&auto=format'}
                            alt={post.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                        />

                        <div
                            className="absolute inset-0"
                            style={{
                                background: 'linear-gradient(180deg, #8B000000 0%, #8B0000 )',
                            }}
                        />

                        <CardContent className="relative z-10 flex flex-col justify-end h-64 sm:h-72 lg:h-80 p-6">
                            <div className="text-white/80 textDescription font-secondaryFont mb-2">{post.date ? new Date(post.date).toLocaleDateString() : ''}</div>
                            <h3 className="text-white textDescription mb-4 font-primaryFont leading-tight" dangerouslySetInnerHTML={{ __html: post.title }} />
                            {/* {post.excerpt && (
                                <p className="text-white/70 textDescription mb-4 line-clamp-2 font-secondaryFont" dangerouslySetInnerHTML={{ __html: post.excerpt || '' }} />
                            )} */}
                            <Link to={post.link || '/blog-details'}>
                                <Button className="w-fit bg-[#8b0000] hover:bg-[#a32d13] text-white px-4 py-2 rounded-lg transition-colors duration-200 font-secondaryFont font-normal textDescription border border-white">{t('BlogPage.buttonText')}</Button>
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Pagination Controls */}
            {!loading && !error && posts.length > 0 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                    {renderPagination()}
                </div>
            )}
        </section>
    );
};

export default Blogs;