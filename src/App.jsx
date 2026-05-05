// import React, { useRef } from "react";
// import { Routes, Route, Outlet } from "react-router-dom";
// import { Container } from "react-bootstrap"; // Import Container
// import Header from "./components/Header";
// import Footer from "./components/Footer";
// import Home from "./pages/Home";
// import About from "./pages/About";
// import Game from "./components/Game";
// import GemMatchGame from "./components/GemMatchGame";
// import BlueprintGame from "./components/BlueprintGame";
// import MemoryGame from "./MemoryGame/MemoryGame";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import ProtectedRoute from "./components/ProtectedRoute";


// // This is our main layout component
// function Layout() {
//   return (
//     <div className="d-flex flex-column min-vh-100">
//       <Header />

//       {/* Container centers our content and makes it responsive */}
//       <Container as="main" className="flex-grow-1 py-4">
//         <Outlet /> {/* Pages (Home, About) will be rendered here */}
//       </Container>

//       <Footer />
//     </div>
//   );
// }

// // This is where we define our routes (no change here)
// export default function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<Layout />}>
//         <Route index element={<Home />} />
//         <Route path="about" element={<About />} />
//         <Route path="game" element={<Game />} />
//         {/* <Route path="gem-match" element={<GemMatchGame />} /> */}
//         {/* <Route path="blueprint-builder" element={<BlueprintGame />} /> */}
//         <Route path='memorygame' element = {
//           <ProtectedRoute>
//               <MemoryGame />
//             </ProtectedRoute>} />
            
//         <Route path="login" element={<Login />} />
//         <Route path="register" element={<Register />} />
//       </Route>
//       {/* <Route path="/magic-gems" element={<Game />} /> */}
//     </Routes>
//   );
// }


import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link, Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";

// --- Layout & UI Components ---

import Footer from "./components/Footer";
import Navigation from "./components/Navigation";

import Home from "./template/Home";
import About from "./template/About";
import Blog from "./template/Blog";
import Contact from "./template/Contact";
import Event from "./template/Event";
import Program from "./template/Program";
import Service from "./template/Service";
import Testimonial from "./template/Testimonial";
import Games from "./template/Games";

// --- Template UI Components ---
import TemplateHeader from "./template/Header"; // <-- Change to your actual file name
import TemplateFooter from "./template/Footer"; // <-- Change to your actual file name

// --- Public Pages ---
// import Home from "./pages/Home";
// import About from "./pages/About";
import Login from "./components/Login"; // Ensure you only have one Login component in your merged folder
import Register from "./pages/Register";

// --- Protected Dashboards & Features ---
import Patient from "./components/Patient";
import Dashboard from "./components/Dashboard";
import Activity from "./components/Activity";
import Progress from "./components/Progress";
import Schedule from "./components/Schedule";
import ResultsDashboard from "./components/ResultsDashboard";
import AdminDashboard from "./components/AdminDashboard";

// --- Games ---
import Game from "./components/Game";
// import Games from "./components/Games";
import MemoryGame from "./MemoryGame/MemoryGame";
import JigsawPuzzle from "./components/games/JigsawPuzzle";
import PuzzleReport from "./components/games/PuzzleReport";
import ScrollToTop from './components/ScrollToTop';
import GamePage from "./pages/GamePage";
import NOGOGame from './pages/NOGOGame';
import Header from "./components/Header";
import npmBootstrap from 'bootstrap/dist/css/bootstrap.min.css?inline';
// import GemMatchGame from "./components/GemMatchGame";
// import BlueprintGame from "./components/BlueprintGame";

// 1. Create Auth Context
export const AuthContext = React.createContext();

// 2. Main Layout Component for Public/General Pages
function Layout() {

  useEffect(() => {
    // 1. Create a <style> tag when the layout loads
    const styleTag = document.createElement("style");
    styleTag.id = "npm-bootstrap-override";
    
    // 2. Pour the NPM Bootstrap CSS inside it
    styleTag.innerHTML = npmBootstrap;

    // 3. Append it to the document head. 
    // Because it is added last, it gets PRIORITY over your other CSS!
    document.head.appendChild(styleTag);

    // 4. CLEANUP: Delete the styles the second the user leaves the template
    return () => {
      const tagToRemove = document.getElementById("npm-bootstrap-override");
      if (tagToRemove) {
        document.head.removeChild(tagToRemove);
      }
    };
  }, []);

  // Grab the auth state so we know whether to show the secondary navigation
  const { isAuthenticated } = React.useContext(AuthContext);

  return (
    // We moved the Tailwind background classes here!
    <div className="d-flex flex-column min-vh-100 w-100 bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Navigation only shows on Dashboard pages when logged in */}
      {isAuthenticated && <Navigation />}
      
      {/* <Header /> */}
      <Container as="main" className="flex-grow-1 py-4">
        <Outlet /> {/* Login, Register, and Dashboard load here */}
      </Container>
      <Footer />
    </div>
  );
}

// 2B. NEW Layout for the Public Template Pages
function TemplateLayout() {
  return (
    <div className="template-wrapper">
      <TemplateHeader />
      {/* The template pages (Home, About, etc.) will load inside this Outlet */}
      <main>
        <Outlet /> 
      </main>
      <TemplateFooter />
    </div>
  );
}

// 3. Main App Component
export default function App() {
  // --- Global Authentication State ---
const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  
  // Safely parse the user role from storage, defaulting to "parent" if anything is missing or broken
  const [userRole, setUserRole] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? (JSON.parse(savedUser).role || "parent") : "parent";
    } catch (e) {
      return "parent";
    }
  });
  
  const [users, setUsers] = useState([]);// Mock user database

  // 2. Updated Auth Functions to handle the real token
  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUserRole(userData?.role || 'parent');
    return true;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUserRole("parent");
    window.location.href = "/";
  };

  const register = async (userData) => {
    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await response.json();
      if (data.success) {
        return { success: true, message: 'Registration successful' };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Registration failed' };
    }
  };

  // --- Protected Route Wrapper ---
  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    if (allowedRoles && !allowedRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" replace />;
    }
    return children;
  };

  return (
    
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout, register }}>
      <Router>
       <ScrollToTop />
        

          <Routes>
          <Route element={<TemplateLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="blog" element={<Blog />} />
              <Route path="contact" element={<Contact />} />
              <Route path="event" element={<Event />} />
              <Route path="program" element={<Program />} />
              <Route path="service" element={<Service />} />
              <Route path="testimonial" element={<Testimonial />} />
              <Route path="games" element={<Games />} />

<Route path="/memorygame" element={
              <ProtectedRoute allowedRoles={["parent", "therapist", "child"]}>
                <MemoryGame />
              </ProtectedRoute>
            } />
            </Route>

            {/* --- SECTION 1: Standard Layout Routes --- */}
            {/* <Route path="/" element={<Layout />}>
              <Route index element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Home />} />
              <Route path="about" element={<About />} /> */}
              <Route element={<Layout />}>
              <Route 
                path="login" 
                element={isAuthenticated ? <Navigate to="/games" replace /> : <Login />} 
              />
              {/* <Route path="register" element={<Register />} /> */}

              {/* General Game Access */}
              <Route path="game" element={<Game />} />
            {/* </Route> */}

            {/* --- SECTION 2: Protected Dashboard & Feature Routes --- */}
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={["parent", "therapist", "child"]}>
                <Dashboard />
              </ProtectedRoute>
            } />

            <Route path="/patient" element={
              <ProtectedRoute allowedRoles={["parent", "therapist"]}>
                <Patient />
              </ProtectedRoute>
            } />
            
            <Route path="/patient/:patientId" element={
              <ProtectedRoute allowedRoles={["parent", "therapist"]}>
                <Patient />
              </ProtectedRoute>
            } />

            <Route path="/activities" element={
              <ProtectedRoute allowedRoles={["parent", "therapist", "child"]}>
                <Activity />
              </ProtectedRoute>
            } />

            <Route path="/progress" element={
              <ProtectedRoute allowedRoles={["parent", "therapist"]}>
                <Progress />
              </ProtectedRoute>
            } />

            <Route path="/schedule" element={
              <ProtectedRoute allowedRoles={["parent", "therapist"]}>
                <Schedule />
              </ProtectedRoute>
            } />

            <Route path="/results" element={
              <ProtectedRoute allowedRoles={["parent", "therapist"]}>
                <ResultsDashboard />
              </ProtectedRoute>
            } />

            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={["parent","therapist"]}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            {/* --- SECTION 3: Protected Game Routes --- */}
            <Route path="/games" element={
              <ProtectedRoute allowedRoles={["parent", "therapist", "child"]}>
                <Games />
              </ProtectedRoute>
            } />
            {/* Add the new Fish Game Route here */}
            <Route path="/games/fish-attention" element={
              <ProtectedRoute allowedRoles={["parent", "therapist", "child"]}>
                <GamePage />
              </ProtectedRoute>
            } />
            {/* <Route path="/nogo-game" element={<NOGOGame />} /> */}

            <Route path="/nogo-game" element={
              <ProtectedRoute allowedRoles={["parent", "therapist", "child"]}>
                <NOGOGame />
              </ProtectedRoute>
            } />

            <Route path="/games/puzzle" element={
              <ProtectedRoute allowedRoles={["parent", "therapist", "child"]}>
                <JigsawPuzzle />
              </ProtectedRoute>
            } />

            <Route path="/games/puzzle/report" element={
              <ProtectedRoute allowedRoles={["parent", "therapist"]}>
                <PuzzleReport childName="Jamie" />
              </ProtectedRoute>
            } />

            {/* --- SECTION 4: Error Handling Routes --- */}
            <Route path="/unauthorized" element={
              <div className="flex items-center justify-center flex-grow p-4">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
                  <div className="text-6xl mb-4">🚫</div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
                  <p className="text-gray-600 mb-6">You don't have permission to view this page.</p>
                  <Link to="/dashboard" className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600">
                    Go to Dashboard
                  </Link>
                </div>
              </div>
            } />

            <Route path="*" element={
              <div className="flex items-center justify-center flex-grow p-4">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
                  <div className="text-6xl mb-4">404</div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h1>
                  <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
                  <Link to="/dashboard" className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600">
                    Go to Dashboard
                  </Link>
                </div>
              </div>
            } />
            </Route>
          </Routes>
       
      </Router>
    </AuthContext.Provider>
  );
}