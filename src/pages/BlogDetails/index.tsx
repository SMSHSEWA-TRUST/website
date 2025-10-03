import React, { Suspense, useEffect, useState } from "react";
import { ComponentLoader, BlogDetailsLoader } from "../../components/ui/LoadingComponents";
import BlogdetailWebp from '@/assets/images/Blogdetail.webp';
import { useParams } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { getBlogPostById } from '@/services/blog.service';

// Lazy load components
const HeroSection = React.lazy(() => import("../../components/common/HeroSection"));
const BlogDetails = React.lazy(() => import("@/components/Blogs/BlogDetails"));

export const BlogDetailsPage = (): JSX.Element => {

    const { t } = useI18n();
    const params = useParams();
    const id = params.id;

    // read translated blog list and pick entry by id
    const raw = t('BlogDetailsPage.Blog');
    const blogs = Array.isArray(raw) ? raw as Array<{ title?: string; subtitle?: string; content?: string[] }> : [];
    const idx = id ? Number(id) - 1 : 0;
    const selected = blogs[idx] || blogs[0] || null;

    // fetch actual blog post from WP by id so we can show real title/date in hero
    const [apiPost, setApiPost] = useState<any | null>(null);
    const [loadingPost, setLoadingPost] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        if (!id) {
            setError('No blog ID provided');
            return;
        }

        setLoadingPost(true);
        setError(null);

        console.log('BlogDetailsPage: Fetching blog post ID:', id); // Debug log

        getBlogPostById(id as string)
            .then((data) => {
                if (!mounted) return;
                console.log('BlogDetailsPage: Blog post loaded successfully'); // Debug log
                setApiPost(data);
                setError(null);
            })
            .catch((e) => {
                if (!mounted) return;
                console.error('BlogDetailsPage: Failed to load blog post:', e); // Debug log
                const errorMsg = e?.response?.data?.message
                    || e?.message
                    || 'Failed to load blog post';
                setError(errorMsg);
                // Don't fail silently - still set apiPost to null so BlogDetails can handle it
                setApiPost(null);
            })
            .finally(() => {
                if (!mounted) return;
                setLoadingPost(false);
            });
        return () => { mounted = false; };
    }, [id]);

    return (
        <>
            {/* Hero Section */}
            <Suspense fallback={<ComponentLoader height="h-96" />}>
                {loadingPost ? (
                    // show a hero-sized loader while the API fetch for the post is in-flight
                    <ComponentLoader height="h-96" />
                ) : error ? (
                    // Show error state in hero
                    <div className="h-96 flex items-center justify-center bg-gray-100">
                        <div className="text-center p-6">
                            <p className="text-red-600 textDescription font-secondaryFont mb-4">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-[#8b0000] hover:bg-[#a32d13] text-white px-6 py-2 rounded-lg transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                ) : (
                    <HeroSection
                        title={(apiPost?.title?.rendered as string) ?? (selected?.title ?? '')}
                        // subtitle for this blog — prefer API date (formatted), then selected subtitle, then translations
                        semiTitle={
                            apiPost?.date ? new Date(apiPost.date).toLocaleDateString() : (selected?.subtitle ?? (t('pageHero.blogDetails.semiTitle') as string) ?? (t('BlogDetailsPage.semiTitle') as string))
                        }
                        backgroundImage={BlogdetailWebp}
                    />
                )}
            </Suspense>

            {/* Blog Details Section */}
            <Suspense fallback={<BlogDetailsLoader />}>
                <BlogDetails id={id} blogPost={apiPost} />
            </Suspense>
        </>
    );
};