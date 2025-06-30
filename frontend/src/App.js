import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage/HomePage';
import AnalyzePage from './pages/AnalyzePage/AnalyzePage';
import FeaturesPage from './pages/FeaturesPage/FeaturesPage';
import AboutPage from './pages/AboutPage/AboutPage';
import AuthPage from './pages/AuthenticationPage/AuthPage';


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/analyze" element={<AnalyzePage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;