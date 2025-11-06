
import { useParams } from 'react-router-dom';
import React, { useEffect, useState, useMemo } from 'react';
import { getBlogPostById, getBlogPosts } from '@/services/blog.service';
import BlogSidebar from './BlogSidebar';
import { BlogDetailsLoader, ComponentLoader } from '@/components/ui/LoadingComponents';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import '@/styles/wordpress-content.css';

// helper to strip HTML tags from WP-rendered strings for sidebar display
const stripHtml = (html?: string) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').trim();
};


interface Props {
    id?: string | number | undefined;
    blogPost?: any; // optionally receive pre-fetched blog post from parent
}

const BlogDetails: React.FC<Props> = (props) => {
    const { id: propId, blogPost: preFetchedPost } = props;
    const params = useParams();
    const id = propId ?? params.id;

    // const { t } = useI18n(); // not used here
    const [entry, setEntry] = useState<any | null>(preFetchedPost || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [latestPosts, setLatestPosts] = useState<Array<any>>([]);
    const [latestLoading, setLatestLoading] = useState<boolean>(false);

    // Prepare sanitized+parsed blog HTML once per content change to avoid reparsing each render
    const rawContent = entry?.content?.rendered ?? '';
    const parsedContent = useMemo(() => {
        if (!rawContent) return null;
        const sanitized = DOMPurify.sanitize(rawContent, { USE_PROFILES: { html: true } });
        return parse(sanitized);
    }, [rawContent]);

    // fetch latest 3 posts for sidebar
    useEffect(() => {
        let mounted = true;
        setLatestLoading(true);
        getBlogPosts({ per_page: 3, _embed: true }).then((response) => {
            if (!mounted) return;
            const mapped = response.data.map((p: any) => {
                // get featured image from embedded media if present
                const media = p?._embedded?.['wp:featuredmedia']?.[0];
                const image = media?.source_url || (p?.jetpack_featured_media_url) || '';
                return {
                    id: p.id,
                    title: stripHtml(p?.title?.rendered || ''),
                    description: stripHtml(p?.excerpt?.rendered || ''),
                    image,
                    link: `/blog-details/${p.id}`
                };
            });
            setLatestPosts(mapped);
        }).catch(() => {
            // ignore sidebar failure
        }).finally(() => {
            if (!mounted) return;
            setLatestLoading(false);
        });
        return () => { mounted = false; };
    }, []);

    useEffect(() => {
        // Sync the entry state when preFetchedPost changes
        if (preFetchedPost) {
            setEntry(preFetchedPost);
        }
    }, [preFetchedPost]);

    useEffect(() => {
        let mounted = true;
        // If we already have a pre-fetched post, don't fetch again
        if (preFetchedPost) {
            return () => { mounted = false; };
        }
        if (!id) {
            setError('No blog ID provided');
            return () => { mounted = false; };
        }

        setLoading(true);
        setError(null); // Clear previous errors

        console.log('Fetching blog post with ID:', id); // Debug log

        getBlogPostById(id as string)
            .then((data) => {
                if (!mounted) return;
                console.log('Blog post loaded successfully:', data); // Debug log
                setEntry(data);
                setError(null);
            })
            .catch((e) => {
                if (!mounted) return;
                console.error('Error loading blog post:', e); // Debug log
                const errorMessage = e?.response?.data?.message
                    || e?.message
                    || 'Failed to load blog post. Please check your connection and try again.';
                setError(errorMessage);
            })
            .finally(() => {
                if (!mounted) return;
                setLoading(false);
            });
        return () => { mounted = false; };
    }, [id, preFetchedPost]);

    // While the main post is loading, show the full blog-details skeleton so
    // the page does not look blank or partially rendered on refresh/direct load.
    if (loading) {
        return <BlogDetailsLoader />;
    }

    return (
        <div className="px-4 md:px-16 lg:px-24 py-10 lg:py-20 flex flex-col xl:flex-row gap-10 xl:gap-20 justify-center items-start ">
            {/* Main Blog Details Section */}
            <div className="flex flex-col gap-6 xl:w-[80%]">
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <p className="text-red-600 font-secondaryFont textDescription mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-[#8b0000] hover:bg-[#a32d13] text-white px-6 py-2 rounded-lg transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                )}
                {!error && entry ? (
                    <article>
                        {/* Render sanitized & parsed content with WordPress styling */}
                        <div className="wp-content">{parsedContent}</div>
                    </article>
                ) : !error && !loading ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                        <p className="font-secondaryFont textDescription text-gray-700 leading-relaxed">No blog found.</p>
                    </div>
                ) : null}
            </div>

            {/* Sidebar */}
            <div className=" xl:w-[40%] mx-auto">
                {latestLoading ? (
                    <ComponentLoader height="h-64" className="w-full" />
                ) : (
                    <BlogSidebar latestPosts={latestPosts} />
                )}
            </div>
        </div>
    );
};

export default BlogDetails;