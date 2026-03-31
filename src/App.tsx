import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ResponsiveShell from './components/ResponsiveShell';

// Pages
import OnboardingPage from './pages/OnboardingPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomeScreen from './pages/HomeScreen';
import ServicesPage from './pages/ServicesPage';
import PharmacyPage from './pages/PharmacyPage';
import AssistantPage from './pages/AssistantPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import SchedulePage from './pages/SchedulePage';
import DeliveryPage from './pages/DeliveryPage';
import PaymentPage from './pages/PaymentPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ResponsiveShell>
        <Routes>
          <Route path="/" element={<Navigate to="/onboarding" replace />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/pharmacy" element={<PharmacyPage />} />
          <Route path="/assistant" element={<AssistantPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/delivery" element={<DeliveryPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </ResponsiveShell>
    </BrowserRouter>
  );
};

export default App;
