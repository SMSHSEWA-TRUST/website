import { BrowserRouter as Router } from 'react-router-dom';
import { Suspense } from 'react';
import Layout from "./layout/Layout";
import AppRoutes from "./routes";
import { AppLoader } from './components/ui/LoadingComponents';

export const App = (): JSX.Element => {
    return (
        <Router>
            <Suspense fallback={<AppLoader />}>
                <Layout>
                    <AppRoutes />
                </Layout>
            </Suspense>
        </Router>
    );
};

export default App;