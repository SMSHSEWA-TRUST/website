
import { useI18n } from '@/lib/i18n';
import { useParams } from 'react-router-dom';
import React from 'react';




interface Props {
    id?: string | number | undefined;
}

const BlogDetails: React.FC<Props> = (props) => {
    const { id: propId } = props;
    const params = useParams();
    const id = propId ?? params.id;

    const { t } = useI18n();

    const raw = t('BlogDetailsPage.Blog');
    const blogs = Array.isArray(raw) ? raw as Array<{ title?: string; subtitle?: string; content?: string[] }> : [];

    // id is expected to be 1-based index as used in Blogs list
    const index = id ? (Number(id) - 1) : 0;
    const entry = blogs[index] || blogs[0] || null;
    return (
        <div className="px-4 md:px-16 lg:px-24 py-10  lg:py-20 ">
           
                {/* Main Blog Details Section */}
              
                    <div className="flex flex-col gap-6">
                        {entry ? (
                            <>
                                {entry.content && entry.content.map((para, i) => (
                                    <p key={i} className="font-secondaryFont textDescription text-gray-700 leading-relaxed">{para}</p>
                                ))}

                                {/* <div className="flex justify-center">
                                    <div className="w-full max-w-[900px] aspect-[4/3]  overflow-hidden flex items-center justify-center">
                                        <LazyLoadImage src={blogDetails1} alt="Main" className="w-full h-full object-cover object-center" loading="lazy" />
                                    </div>
                                </div> */}

                                {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <LazyLoadImage src={blogDetails2} alt="Sub1" className="rounded-lg w-full sm:w-1/2 object-cover" loading="lazy" />
                                    <LazyLoadImage src={blogDetails3} alt="Sub2" className="rounded-lg w-full sm:w-1/2 object-cover" loading="lazy" />
                                </div> */}
                            </>
                        ) : (
                            <p className="font-secondaryFont textDescription text-gray-700 leading-relaxed">No blog found.</p>
                        )}
                    </div>


                {/* Sidebar */}
                {/* <BlogSidebar latestPosts={latestPosts} /> */}
            </div>
    );
};

export default BlogDetails;