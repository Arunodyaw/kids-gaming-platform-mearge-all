// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import App from "./App";
// import "./index.css"; // Import our global styles
// import "bootstrap/dist/css/bootstrap.min.css";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </React.StrictMode>
// );


import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// --- Global Styles ---
// Import Bootstrap first so your custom Tailwind classes can override it if needed
// import 'bootstrap/dist/css/bootstrap.min.css';
// Import your custom CSS (which should contain your @tailwind directives)
// import './index.css'; 

import "./public/css/style.css";
// import "./public/css/bootstrap.min.css";
import "./public/lib/animate/animate.min.css";
import "./public/lib/lightbox/css/lightbox.min.css";
import "./public/lib/owlcarousel/assets/owl.carousel.min.css";
// import "./public/css/bootstrap.min.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);