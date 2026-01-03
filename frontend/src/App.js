import { useState, useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CustomerPortal from "@/pages/CustomerPortal";
import SellerDashboard from "@/pages/SellerDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import AuthPage from "@/pages/AuthPage";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

function PrivateRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/auth" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }
  
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/" element={
        user ? (
          user.role === 'admin' ? <Navigate to="/admin" /> :
          user.role === 'seller' ? <Navigate to="/seller" /> :
          <CustomerPortal />
        ) : <CustomerPortal />
      } />
      <Route path="/customer/*" element={<CustomerPortal />} />
      <Route path="/seller/*" element={
        <PrivateRoute allowedRoles={['seller']}>
          <SellerDashboard />
        </PrivateRoute>
      } />
      <Route path="/admin/*" element={
        <PrivateRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </PrivateRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
