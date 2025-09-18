import { BrowserRouter as Router } from "react-router-dom";
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
    // schedule auto logout if token present
    try {
      scheduleAutoLogout(10); // logout 10s before expiry as buffer
    } catch (e) {
      // ignore scheduling errors
    }

    // also clear scheduled timer on unmount
    return () => {
      try {
        clearScheduledLogout();
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
