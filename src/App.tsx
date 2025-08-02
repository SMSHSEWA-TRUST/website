import { BrowserRouter as Router } from 'react-router-dom';
import Layout from "./layout/Layout";
import AppRoutes from "./routes";

export const App = (): JSX.Element => {
    return (
        <Router>
            <Layout>
                <AppRoutes />
            </Layout>
        </Router>
    );
};

export default App;