import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RestaurantDashboard from './pages/RestaurantDashboard';
import ShelterDashboard from './pages/ShelterDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/restaurant" element={<RestaurantDashboard />} />
          <Route path="/shelter" element={<ShelterDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
