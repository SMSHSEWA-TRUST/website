// Utility functions for donation navigation

/**
 * Create a URL-friendly slug from title
 */
export const createDonationSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .trim();
};

/**
 * Create donation page URL with title
 */
export const createDonationUrl = (category: { title: string; [key: string]: any }): string => {
  const slug = createDonationSlug(category.title || '');
  return `/donation/${slug}`;
};

/**
 * Navigate to donation page with proper URL structure
 */
export const navigateToDonation = (
  navigate: (path: string, options?: any) => void, 
  category: { title: string; [key: string]: any }, 
  returnTo?: string
) => {
  const url = createDonationUrl(category);
  navigate(url, { 
    state: { 
      selectedCategory: category, 
      returnTo: returnTo || 'home' 
    } 
  });
};