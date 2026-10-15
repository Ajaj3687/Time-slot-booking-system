import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MyNavbar from './components/MyNavbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import AdminDashboard from './pages/AdminDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import ServiceList from './pages/ServiceList';
import BookingPage from './pages/BookingPage';
import PaymentPage from './pages/PaymentPage';
import MyBookings from './pages/MyBookings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <MyNavbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/provider/dashboard" element={<ProviderDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* User Routes */}
          <Route path="/services" element={<ServiceList />} />
          <Route path="/book/:serviceId" element={<BookingPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/bookings" element={<MyBookings />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
