import { HashRouter as Router } from "react-router-dom";
import { Suspense, useEffect } from "react";
import Layout from "./layout/Layout";
import AppRoutes from "./routes";
import { AppLoader } from "./components/ui/LoadingComponents";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { I18nProvider } from "./lib/i18n";
import { scheduleAutoLogout, clearScheduledLogout } from "./services/auth";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

export const App = (): JSX.Element => {
  useEffect(() => {
    // Prefer manual scroll restoration so browser doesn't restore old scroll on refresh/back.
    try {
      if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
        // set manual to prevent browser from restoring scroll position automatically
        // (we will control scroll programmatically)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.history.scrollRestoration = 'manual';
      }
    } catch (e) {
      // ignore
    }

    // ensure we start at the top on cold load
    try {
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'auto' });
    } catch (e) {
      // ignore
    }

    // schedule auto logout if token present
    try {
      scheduleAutoLogout(10); // logout 10s before expiry as buffer
    } catch (e) {
      // ignore scheduling errors
    }

    // also clear scheduled timer on unmount and restore scrollRestoration to auto if possible
    return () => {
      try {
        clearScheduledLogout();
      } catch (e) {
        // ignore
      }
      try {
        if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          window.history.scrollRestoration = 'auto';
        }
      } catch (e) {
        // ignore
      }
    };
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Suspense fallback={<AppLoader />}>
          <I18nProvider>
            <Layout>
              <AppRoutes />
            </Layout>
          </I18nProvider>
        </Suspense>
      </Router>
      <Toaster position="bottom-center" />
    </QueryClientProvider>
  );
};

export default App;
