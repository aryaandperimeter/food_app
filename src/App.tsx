import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import RestaurantDashboard from './pages/RestaurantDashboard';
import ShelterDashboard from './pages/ShelterDashboard';
import Login from './pages/Login';
import Register from './pages/Register';

// Protected Route component
const ProtectedRoute = ({ children, roles }: { children: React.ReactNode; roles?: string[] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    // Redirect to the appropriate dashboard based on user role
    return <Navigate to={user.role === 'restaurant' ? '/restaurant' : '/shelter'} />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/restaurant"
              element={
                <ProtectedRoute roles={['restaurant']}>
                  <RestaurantDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shelter"
              element={
                <ProtectedRoute roles={['shelter']}>
                  <ShelterDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
