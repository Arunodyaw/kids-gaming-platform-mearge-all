// src/components/Login.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { 
  Brain, Eye, EyeOff, Mail, Lock, 
  User, Calendar, Phone, AlertCircle,
  CheckCircle, ArrowRight, UserPlus,
  LogIn, Baby, Users, Stethoscope
} from 'lucide-react';

const Login = () => {
  // Auth context
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  // Tab state
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginRole, setLoginRole] = useState('parent');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Registration form state
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [regRole, setRegRole] = useState('parent');
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [therapistId, setTherapistId] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  // Handle login submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    if (!loginEmail || !loginPassword) {
      setLoginError('Please fill in all fields');
      setIsLoggingIn(false);
      return;
    }

    try {
      // 1. Actually talk to the backend to get the data
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword
        })
      });

      const data = await response.json();

      // 2. Check if the backend said "Success!"
      if (response.ok && data.success) {
        // Grab the token and user data from the backend's response
        const actualToken = data.data.token;
        const actualUserData = data.data;

        // 3. Pass the REAL token to App.jsx
        login(actualToken, actualUserData);
        
        navigate('/dashboard');
      } else {
        setLoginError(data.message || 'Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error("Login Error:", error);
      setLoginError('Login failed. Please check your connection.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // In Login.jsx - Replace the handleRegisterSubmit function

const handleRegisterSubmit = async (e) => {
  e.preventDefault();
  setRegError('');
  setRegSuccess('');

  // Validation
  if (!regEmail || !regPassword || !confirmPassword || !childName) {
    setRegError('Please fill in all required fields');
    return;
  }

  if (regPassword.length < 6) {
    setRegError('Password must be at least 6 characters long');
    return;
  }

  if (regPassword !== confirmPassword) {
    setRegError('Passwords do not match');
    return;
  }

  if (!agreeTerms) {
    setRegError('Please agree to the Terms of Service');
    return;
  }

  setIsRegistering(true);

  try {
    // Prepare registration data matching backend schema EXACTLY
    const registrationData = {
      email: regEmail,
      password: regPassword,
      childName: childName,                    // Must match schema field name
      childAge: childAge ? parseInt(childAge) : null,  // Convert to number
      role: regRole,                            // 'parent' or 'therapist'
    };

    // Add parent-specific fields
    if (regRole === 'parent') {
      registrationData.parentName = parentName || null;
      registrationData.parentPhone = parentPhone || null;
    }

    // Add therapist-specific fields
    if (regRole === 'therapist') {
      registrationData.therapistId = therapistId || null;
    }

    console.log('📤 Sending registration data:', JSON.stringify(registrationData, null, 2));

    const response = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData)
    });

    const data = await response.json();
    console.log('📥 Registration response:', data);

    if (response.ok && data.success) {
      setRegSuccess('Registration successful! You can now login.');
      
      // Auto-fill login form with registered email
      setLoginEmail(regEmail);
      
      // Clear registration form
      setTimeout(() => {
        setActiveTab('login');
        setRegEmail('');
        setRegPassword('');
        setConfirmPassword('');
        setChildName('');
        setChildAge('');
        setParentName('');
        setParentPhone('');
        setTherapistId('');
      }, 2000);
    } else {
      // Show validation errors if any
      if (data.errors && data.errors.length > 0) {
        setRegError(data.errors.join(', '));
      } else {
        setRegError(data.message || 'Registration failed. Please try again.');
      }
    }
  } catch (error) {
    console.error('❌ Registration error:', error);
    setRegError('Cannot connect to server. Please make sure the backend is running.');
  } finally {
    setIsRegistering(false);
  }

  const handleLoginSubmit = async (e) => {
  e.preventDefault();
  setLoginError('');
  setIsLoggingIn(true);

  if (!loginEmail || !loginPassword) {
    setLoginError('Please fill in all fields');
    setIsLoggingIn(false);
    return;
  }

  try {
    // ✅ FIXED: Changed from /api/users/login to /api/auth/login
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: loginEmail,
        password: loginPassword
      })
    });

    const data = await response.json();
    console.log('📥 Login response:', data);

    if (response.ok && data.success) {
     // Safely grab the token whether it is directly on 'data' or nested inside 'data.data'
      const actualToken = data.token || (data.data && data.data.token);
      
      // Safely grab the user info
      const actualUserData = data.data || data;

      // Send the real token to App.jsx
      login(actualToken, actualUserData);
      
      // Navigate to dashboard
      navigate('/dashboard');
    } else {
      setLoginError(data.message || 'Invalid credentials. Please try again.');
    }
  } catch (error) {
    console.error('❌ Login error:', error);
    setLoginError('Login failed. Please check your connection.');
  } finally {
    setIsLoggingIn(false);
  }
};
};


  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-4xl w-full flex flex-col md:flex-row shadow-2xl rounded-2xl overflow-hidden">
        {/* Left Panel - Branding */}
        <div className="md:w-2/5 bg-gradient-to-br from-purple-600 to-indigo-700 text-white p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center mb-6">
              <div className="bg-white p-3 rounded-xl mr-3">
                <Brain className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">ADHD Focus</h1>
                <p className="text-purple-200 text-sm">Zone</p>
              </div>
            </div>
            
            <p className="text-purple-200 mb-8">Supporting children ages 5-8 with ADHD</p>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-white bg-opacity-20 p-3 rounded-full mr-4">
                  <span className="text-xl">🎯</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Focus Tracking</h3>
                  <p className="text-purple-100 text-sm">Monitor attention spans and progress</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-white bg-opacity-20 p-3 rounded-full mr-4">
                  <span className="text-xl">🏆</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Gamified Learning</h3>
                  <p className="text-purple-100 text-sm">Engage through rewards and challenges</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-white bg-opacity-20 p-3 rounded-full mr-4">
                  <span className="text-xl">📊</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Progress Analytics</h3>
                  <p className="text-purple-100 text-sm">Visual insights for better understanding</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-purple-400">
            <p className="text-sm text-purple-200">
              Secure platform • COPPA compliant • HIPAA ready
            </p>
          </div>
        </div>

        {/* Right Panel - Forms */}
        <div className="md:w-3/5 bg-white p-8 md:p-12">
          {/* Tabs */}
          <div className="flex mb-8 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-3 rounded-lg font-medium transition-all flex items-center justify-center ${
                activeTab === 'login'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <LogIn className="w-5 h-5 mr-2" />
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-3 rounded-lg font-medium transition-all flex items-center justify-center ${
                activeTab === 'register'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Register
            </button>
          </div>

          {/* Login Form */}
          {activeTab === 'login' && (
            <div className="fade-in">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
              <p className="text-gray-600 mb-6">Sign in to access the dashboard</p>

              {loginError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start">
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Login As</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setLoginRole('parent')}
                      className={`py-3 rounded-xl border transition-all flex items-center justify-center ${
                        loginRole === 'parent'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent shadow-md'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Parent
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginRole('therapist')}
                      className={`py-3 rounded-xl border transition-all flex items-center justify-center ${
                        loginRole === 'therapist'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent shadow-md'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Stethoscope className="w-4 h-4 mr-2" />
                      Therapist
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showLoginPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" className="w-4 h-4 text-purple-600 rounded" />
                    <span className="ml-2 text-gray-700">Remember me</span>
                  </label>
                  <a href="#" className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoggingIn ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Registration Form */}
          {activeTab === 'register' && (
            <div className="fade-in">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h2>
              <p className="text-gray-600 mb-6">Join ADHD Focus Zone today</p>

              {regError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start">
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{regError}</span>
                </div>
              )}

              {regSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-start">
                  <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{regSuccess}</span>
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {/* Role Selection */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">I am a</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRegRole('parent')}
                      className={`py-3 rounded-xl border transition-all flex items-center justify-center ${
                        regRole === 'parent'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent shadow-md'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Parent
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegRole('therapist')}
                      className={`py-3 rounded-xl border transition-all flex items-center justify-center ${
                        regRole === 'therapist'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent shadow-md'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Stethoscope className="w-4 h-4 mr-2" />
                      Therapist
                    </button>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Min. 6 characters"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showRegPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Re-enter password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Child's Name */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Child's Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Baby className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter child's full name"
                      required
                    />
                  </div>
                </div>

                {/* Child's Age */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Child's Age</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      min="2"
                      max="18"
                      value={childAge}
                      onChange={(e) => setChildAge(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., 7"
                    />
                  </div>
                </div>

                {/* Parent Name (for parents) */}
                {regRole === 'parent' && (
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={parentName}
                        onChange={(e) => setParentName(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Parent Phone */}
                {regRole === 'parent' && (
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={parentPhone}
                        onChange={(e) => setParentPhone(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>
                )}

                {/* Therapist ID (for therapists) */}
                {regRole === 'therapist' && (
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">License/ID Number</label>
                    <input
                      type="text"
                      value={therapistId}
                      onChange={(e) => setTherapistId(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter your professional license number"
                    />
                  </div>
                )}

                {/* Terms Agreement */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded mt-1"
                    required
                  />
                  <label htmlFor="terms" className="ml-2 text-gray-600 text-sm">
                    I agree to the <a href="#" className="text-purple-600 hover:underline">Terms of Service</a> and 
                    <a href="#" className="text-purple-600 hover:underline ml-1">Privacy Policy</a>. 
                    I confirm I am the parent or legal guardian of the child.
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isRegistering}
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-6"
                >
                  {isRegistering ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Login;