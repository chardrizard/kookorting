
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Selection from './pages/Selection';
import Results from './pages/Results';
import About from './pages/About';
import Aanbiedingen from './pages/Aanbiedingen';
import NotFound from './pages/NotFound';
import Atelier from './pages/Atelier';
import { Toaster } from 'sonner';
import './App.css';

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

function App() {
  return (
    <Router basename={routerBasename}>
      <Toaster position="top-center" richColors closeButton />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/selection" element={<Selection />} />
        <Route path="/results" element={<Results />} />
        <Route path="/about" element={<About />} />
        <Route path="/aanbiedingen" element={<Aanbiedingen />} />
        <Route path="/atelier" element={<Atelier />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
