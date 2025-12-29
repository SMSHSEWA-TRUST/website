// Utility functions for donation navigation

/**
 * Create a URL-friendly slug from title
 */
export const createDonationSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .trim();
};

/**
 * Create donation page URL with title
 */
export const createDonationUrl = (category: {title: any; [key: string]: any}): string => {
  const slug = createDonationSlug(category?.title?.en || "");
  return `/donation/${slug}`;
};

/**
 * Navigate to donation page with proper URL structure
 */
export const navigateToDonation = (
  navigate: (path: string, options?: any) => void,
  category: {title: string; [key: string]: any},
  returnTo?: string
) => {
  // Update current history entry to include focus state for return
  if (returnTo) {
    try {
      const currentState = window.history.state;
      // React Router v6 stores user state in 'usr' property of history state
      if (currentState && typeof currentState === "object") {
        const usr = currentState.usr || {};
        const newState = {
          ...currentState,
          usr: {...usr, focus: returnTo},
        };
        window.history.replaceState(newState, "");
      }
    } catch (e) {
      console.error("Failed to update history state", e);
    }
  }

  const url = createDonationUrl(category);
  console.log(url);
  navigate(url, {
    state: {
      selectedCategory: category,
      returnTo: returnTo || "home",
    },
  });
};
