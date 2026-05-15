import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Ban } from "lucide-react";

const RestrictedRoute = ({ children }) => {
  const { isAuthenticated, isInitialized, user } = useSelector(
    (state) => state.auth,
  );

  if (!isInitialized) {
    return null;
  }

  return !isAuthenticated ? children : <Navigate to="/chat" replace />;
};

export default RestrictedRoute;
