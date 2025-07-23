import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {  HomePage } from "./pages/Home";
import { AboutPage } from './pages/About';
import {  MemberShipPage } from './pages/MemberShip/inedx';
import {  ContactPage } from './pages/Contact';
import { BlogPage } from './pages/Blog';
import { BlogDetailsPage } from './pages/BlogDetails';
import { PujaPage } from './pages/Puja';


export const App = (): JSX.Element => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/membership" element={<MemberShipPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/blogs" element={<BlogPage />} />
                <Route path="/blog-details" element={<BlogDetailsPage />} />
                <Route path="/puja" element={<PujaPage />} />
            </Routes>
        </Router>
    );
};

export default App;