import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { AuthProvider } from './contexts/AuthContext';
import theme from './theme';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage/HomePage';
import AnalyzePage from './pages/AnalyzePage/AnalyzePage';
import FeaturesPage from './pages/FeaturesPage/FeaturesPage';
import AboutPage from './pages/AboutPage/AboutPage';
import AuthPage from './pages/AuthenticationPage/AuthPage';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/analyze" element={
              <ProtectedRoute>
                <AnalyzePage />
              </ProtectedRoute>
            } />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;