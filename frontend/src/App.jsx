import { Routes, Route, BrowserRouter } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/AdminDashboard';
import BookingPage from './pages/BookingPage';
import './App.css';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/event/:slug" element={<BookingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
