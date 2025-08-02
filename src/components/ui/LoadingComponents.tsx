// App-level loading component
export const AppLoader = () => (
    <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center space-y-4">
            <div className="relative w-20 h-20">
                <div className="absolute inset-2 bg-[#8b0000] rounded-full animate-spin"></div>
                <img
                    src="/temp-logo.png"
                    alt="Shree Mahakaleshwar Logo"
                    className="relative w-full h-full object-cover rounded-full"
                />
            </div>
            <h2 className="text-[#8b0000] font-marcellus text-lg text-center max-w-md">
                Shree Mahakaleshwar Salasar Hanuman Sewa Trust
            </h2>
            <p className="text-[#8b0000] font-tenor-sans text-sm">Loading...</p>
        </div>
    </div>
);

// Page-level loading component
export const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center space-y-4">
            <div className="relative w-16 h-16">
                <div className="absolute inset-2 bg-[#8b0000] rounded-full animate-spin"></div>
                <img
                    src="/temp-logo.png"
                    alt="Loading"
                    className="relative w-full h-full object-cover rounded-full"
                />
            </div>
            <p className="text-[#8b0000] font-tenor-sans text-sm">Loading page...</p>
        </div>
    </div>
);

// Component-level loading skeleton
export const ComponentLoader = ({ className = "", height = "h-48" }: { className?: string; height?: string }) => (
    <div className={`animate-pulse bg-gray-200 rounded-lg ${height} ${className}`}>
        <div className={`${height} bg-gray-300 rounded`}></div>
    </div>
);

// Section loading skeleton
export const SectionLoader = ({ className = "" }: { className?: string }) => (
    <div className={`animate-pulse space-y-4 p-8 ${className}`}>
        <div className="h-6 bg-gray-300 rounded w-1/3 mx-auto"></div>
        <div className="h-32 bg-gray-300 rounded"></div>
        <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
    </div>
);

// Live Darshan specific loader
export const LiveDarshanLoader = () => (
    <section className="relative w-full bg-red-800 overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="text-center mb-8 lg:mb-12">
                <div className="h-8 bg-red-700 rounded w-64 mx-auto mb-4 animate-pulse"></div>
                <div className="h-0.5 bg-white max-w-xs mx-auto animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 aspect-video bg-red-700 rounded-lg animate-pulse"></div>
                <div className="bg-white rounded-lg p-4 animate-pulse">
                    <div className="h-6 bg-gray-300 rounded mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-300 rounded"></div>
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

// Services section loader
export const ServicesLoader = () => (
    <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <div className="h-8 bg-gray-300 rounded w-48 mx-auto mb-4 animate-pulse"></div>
                <div className="h-0.5 bg-gray-300 w-32 mx-auto animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((item) => (
                    <div key={item} className="bg-white rounded-lg p-6 shadow-lg animate-pulse">
                        <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
                        <div className="h-6 bg-gray-300 rounded mb-3"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-300 rounded"></div>
                            <div className="h-4 bg-gray-300 rounded w-4/5"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

// Subscription plans loader
export const SubscriptionLoader = () => (
    <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <div className="h-8 bg-gray-300 rounded w-56 mx-auto mb-4 animate-pulse"></div>
                <div className="h-0.5 bg-gray-300 w-40 mx-auto animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((item) => (
                    <div key={item} className="bg-white border-2 border-gray-200 rounded-xl p-8 animate-pulse">
                        <div className="text-center mb-6">
                            <div className="h-6 bg-gray-300 rounded mb-2"></div>
                            <div className="h-8 bg-gray-300 rounded w-20 mx-auto mb-1"></div>
                            <div className="h-4 bg-gray-300 rounded w-16 mx-auto"></div>
                        </div>
                        <div className="space-y-3 mb-8">
                            {[1, 2, 3, 4].map((feature) => (
                                <div key={feature} className="flex items-center">
                                    <div className="w-5 h-5 bg-gray-300 rounded-full mr-3"></div>
                                    <div className="h-4 bg-gray-300 rounded flex-1"></div>
                                </div>
                            ))}
                        </div>
                        <div className="h-12 bg-gray-300 rounded-lg"></div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

// Blog details specific loader
export const BlogDetailsLoader = () => (
    <div className="container mx-auto px-4 py-8 lg:py-16">
        <div className="max-w-4xl mx-auto animate-pulse">
            {/* Blog header */}
            <div className="mb-8">
                <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="flex items-center space-x-4 mb-6">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    <div className="flex-1">
                        <div className="h-4 bg-gray-300 rounded w-32 mb-1"></div>
                        <div className="h-3 bg-gray-300 rounded w-24"></div>
                    </div>
                </div>
            </div>
            
            {/* Featured image */}
            <div className="aspect-video bg-gray-300 rounded-lg mb-8"></div>
            
            {/* Content */}
            <div className="space-y-4 mb-8">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                <div className="h-4 bg-gray-300 rounded w-4/5"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
                {[1, 2, 3].map((tag) => (
                    <div key={tag} className="h-8 bg-gray-300 rounded-full w-16"></div>
                ))}
            </div>
            
            {/* Related posts */}
            <div className="border-t pt-8">
                <div className="h-6 bg-gray-300 rounded w-48 mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((post) => (
                        <div key={post} className="space-y-3">
                            <div className="aspect-video bg-gray-300 rounded-lg"></div>
                            <div className="h-5 bg-gray-300 rounded"></div>
                            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

// Blog listing page loader
export const BlogListingLoader = () => (
    <div className="container mx-auto px-4 py-8 lg:py-16">
        <div className="animate-pulse">
            {/* Search and filter section */}
            <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="h-10 bg-gray-300 rounded w-64"></div>
                <div className="flex gap-3">
                    <div className="h-10 bg-gray-300 rounded w-24"></div>
                    <div className="h-10 bg-gray-300 rounded w-20"></div>
                </div>
            </div>
            
            {/* Blog grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((blog) => (
                    <div key={blog} className="bg-white rounded-lg shadow-lg overflow-hidden">
                        {/* Blog image */}
                        <div className="aspect-video bg-gray-300"></div>
                        
                        {/* Blog content */}
                        <div className="p-6 space-y-4">
                            {/* Category and date */}
                            <div className="flex justify-between items-center">
                                <div className="h-6 bg-gray-300 rounded w-20"></div>
                                <div className="h-4 bg-gray-300 rounded w-16"></div>
                            </div>
                            
                            {/* Title */}
                            <div className="h-6 bg-gray-300 rounded w-full"></div>
                            <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                            
                            {/* Excerpt */}
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-300 rounded w-full"></div>
                                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                                <div className="h-4 bg-gray-300 rounded w-4/5"></div>
                            </div>
                            
                            {/* Author and read more */}
                            <div className="flex justify-between items-center pt-4 border-t">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                                </div>
                                <div className="h-8 bg-gray-300 rounded w-24"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Pagination */}
            <div className="flex justify-center items-center space-x-2">
                <div className="h-10 bg-gray-300 rounded w-10"></div>
                {[1, 2, 3, 4, 5].map((page) => (
                    <div key={page} className="h-10 bg-gray-300 rounded w-10"></div>
                ))}
                <div className="h-10 bg-gray-300 rounded w-10"></div>
            </div>
        </div>
    </div>
);
