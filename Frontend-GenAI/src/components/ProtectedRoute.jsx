import React from "react";
import { Navigate } from "react-router-dom";

// Example: expects an isAuthenticated prop or context
const ProtectedRoute = ({ children }) => {
  // Replace with your actual auth logic (context, localStorage, etc.)
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
