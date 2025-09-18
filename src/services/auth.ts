// Lightweight auth helpers: logout and proactive JWT expiry handling
export const logout = (redirectTo = '/login') => {
  try {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    // keep lang selection
    // redirect to login page
    if (typeof window !== 'undefined') {
      // use location.replace so back button doesn't return to protected page
      window.location.replace(redirectTo);
    }
  } catch (e) {
    console.error('Error during logout', e);
  }
};

// Parse JWT and return payload or null
const parseJwt = (token?: string | null) => {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload;
  } catch (e) {
    return null;
  }
};

let logoutTimer: number | null = null;

export const scheduleAutoLogout = (bufferSeconds = 10) => {
  // clear any existing timer
  if (logoutTimer) {
    window.clearTimeout(logoutTimer);
    logoutTimer = null;
  }

  const token = localStorage.getItem('authToken');
  const payload = parseJwt(token);
  if (!payload || typeof payload.exp !== 'number') return;

  const expMs = payload.exp * 1000;
  const now = Date.now();
  const timeout = Math.max(0, expMs - now - bufferSeconds * 1000);
  // if already expired, logout immediately
  if (timeout <= 0) {
    logout();
    return;
  }

  // schedule logout
  logoutTimer = window.setTimeout(() => {
    logout();
  }, timeout);
};

export const clearScheduledLogout = () => {
  if (logoutTimer) {
    window.clearTimeout(logoutTimer);
    logoutTimer = null;
  }
};

export default {
  logout,
  scheduleAutoLogout,
  clearScheduledLogout,
};
