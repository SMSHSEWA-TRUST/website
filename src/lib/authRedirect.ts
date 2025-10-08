/**
 * Auth redirect utility to handle redirecting users back to their intended destination
 * after successful login/authentication
 */

export interface RedirectState {
  path: string;
  state?: any;
}

const REDIRECT_KEY = 'auth_redirect_destination';

/**
 * Save the intended destination before redirecting to login
 */
export const saveRedirectDestination = (path: string, state?: any): void => {
  const redirectData: RedirectState = { path, state };
  localStorage.setItem(REDIRECT_KEY, JSON.stringify(redirectData));
};

/**
 * Get the saved redirect destination
 */
export const getRedirectDestination = (): RedirectState | null => {
  try {
    const saved = localStorage.getItem(REDIRECT_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error parsing redirect destination:', error);
  }
  return null;
};

/**
 * Clear the saved redirect destination
 */
export const clearRedirectDestination = (): void => {
  localStorage.removeItem(REDIRECT_KEY);
};

/**
 * Handle redirect after successful authentication
 * Returns the path to redirect to, or null if no redirect is needed
 */
export const handlePostAuthRedirect = (): RedirectState | null => {
  const destination = getRedirectDestination();
  if (destination) {
    clearRedirectDestination();
    return destination;
  }
  return null;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('authToken');
  return !!token;
};

/**
 * Require authentication for a specific action
 * If not authenticated, saves the intended destination and redirects to login
 */
export const requireAuth = (
  navigate: (path: string, options?: any) => void,
  intendedPath: string = '/',
  intendedState?: any
): boolean => {
  if (!isAuthenticated()) {
    saveRedirectDestination(intendedPath, intendedState);
    navigate('/login');
    return false;
  }
  return true;
};

/**
 * Handle navigation after authentication completion
 * This should be called after successful login/OTP verification or family details completion
 */
export const navigateAfterAuth = (
  navigate: (path: string, options?: any) => void,
  defaultPath: string = '/'
): void => {
  // Check if there's a saved redirect destination
  const redirectDestination = localStorage.getItem(REDIRECT_KEY);
  
  if (redirectDestination) {
    try {
      const parsed = JSON.parse(redirectDestination);
      const intendedPath = parsed.path || defaultPath;
      const intendedState = parsed.state;
      
      // Clear the saved destination
      localStorage.removeItem(REDIRECT_KEY);
      
      // Redirect to the intended destination
      navigate(intendedPath, { 
        replace: true, 
        state: intendedState 
      });
    } catch (error) {
      console.error('Error parsing redirect destination:', error);
      navigate(defaultPath, { replace: true });
    }
  } else {
    navigate(defaultPath, { replace: true });
  }
};