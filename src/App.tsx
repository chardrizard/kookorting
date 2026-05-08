
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Selection from './pages/Selection';
import Results from './pages/Results';
import About from './pages/About';
import Aanbiedingen from './pages/Aanbiedingen';
import NotFound from './pages/NotFound';
import { LanguageProvider } from './contexts/LanguageContext';
import { Toaster } from 'sonner';
import './App.css';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Toaster position="top-center" richColors closeButton />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/selection" element={<Selection />} />
          <Route path="/results" element={<Results />} />
          <Route path="/about" element={<About />} />
          <Route path="/aanbiedingen" element={<Aanbiedingen />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
