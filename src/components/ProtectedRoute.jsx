import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  // If there is no token, redirect them to the login page.
  // We use "replace" so they don't get stuck in a back-button loop!
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If they have a token, render the requested page
  return children;
}