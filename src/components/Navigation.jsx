// src/components/Navigation.jsx - FIXED VERSION
import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../App';
import { 
  Home, User, Brain, BarChart3, Calendar, 
  Activity, Target, TrendingUp, Clock,
  Settings, LogOut, Bell, Award,
  Gamepad2, BookOpen, Users as UsersIcon,
  MessageSquare, FileText, Download,
  Puzzle      // ← ADD THIS IMPORT
} from 'lucide-react';

const Navigation = () => {
  const { userRole, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Common navigation items for all roles
  const commonNavItems = [
    { path: '/dashboard', icon: <Home className="w-5 h-5" />, label: 'Dashboard' },
    { path: '/patient', icon: <User className="w-5 h-5" />, label: 'Patient Profile' },
    { path: '/activities', icon: <Activity className="w-5 h-5" />, label: 'Activities' },
    { path: '/progress', icon: <TrendingUp className="w-5 h-5" />, label: 'Progress' },
    { path: '/schedule', icon: <Calendar className="w-5 h-5" />, label: 'Schedule' },
    // In Navigation.jsx
    { path: '/games/puzzle/report', icon: <FileText className="w-5 h-5" />, label: 'Puzzle Report' }
  ];

  // Additional items for specific roles
  const roleSpecificItems = {
    therapist: [
      { path: '/patients', icon: <UsersIcon className="w-5 h-5" />, label: 'Patients' },
      { path: '/reports', icon: <FileText className="w-5 h-5" />, label: 'Reports' },
      { path: '/messages', icon: <MessageSquare className="w-5 h-5" />, label: 'Messages' },
    ],
    parent: [
      { path: '/children', icon: <UsersIcon className="w-5 h-5" />, label: 'Children' },
      { path: '/reports', icon: <FileText className="w-5 h-5" />, label: 'Reports' },
      { path: '/games', icon: <Gamepad2 className="w-5 h-5" />, label: 'Games' },
      { path: '/messages', icon: <MessageSquare className="w-5 h-5" />, label: 'Messages' },
    ]
  };

  // Combine common items with role-specific items
  const navItems = [
    ...commonNavItems,
    ...(roleSpecificItems[userRole] || [])
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get current page title for mobile view
  const getCurrentPageTitle = () => {
    const currentItem = navItems.find(item => location.pathname === item.path) ||
                       navItems.find(item => location.pathname.startsWith(item.path));
    return currentItem?.label || 'Dashboard';
  };

  return (
    <nav className="bg-white shadow-md">
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-xl">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">ADHD Focus Zone</h1>
                <p className="text-sm text-gray-500 capitalize">{userRole} Dashboard</p>
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
                    location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
              
              {/* Points Display */}
              <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-lg">
                <Award className="w-5 h-5" />
                <span className="font-bold">425</span>
              </button>
              
              {/* Settings */}
              <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                <Settings className="w-5 h-5" />
              </button>
              
              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800">{getCurrentPageTitle()}</h2>
              <p className="text-xs text-gray-500 capitalize">{userRole}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Points Badge */}
            <div className="relative">
              <div className="bg-yellow-100 text-yellow-800 font-bold rounded-full w-10 h-10 flex items-center justify-center">
                <span>425</span>
              </div>
            </div>
            
            {/* Menu Button */}
            <button
              className="p-2 rounded-lg bg-gray-100"
              onClick={() => document.getElementById('mobile-menu').classList.toggle('hidden')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div id="mobile-menu" className="hidden bg-white border-t border-gray-200">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => document.getElementById('mobile-menu').classList.add('hidden')}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
            
            {/* Mobile User Actions */}
            <div className="pt-4 mt-4 border-t border-gray-200 space-y-2">
              <button className="flex items-center space-x-3 w-full px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </button>
              
              <button className="flex items-center space-x-3 w-full px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 w-full px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;