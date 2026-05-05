// src/components/Dashboard.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import {
  Activity, Brain, Calendar, Target, TrendingUp,
  Award, Heart, Clock, Users, BarChart3,
  CheckCircle, AlertCircle, PlayCircle, Gamepad2,
  Bell, Plus, ChevronRight, Star, TargetIcon,
  Zap, Moon, Sun, Coffee, BookOpen,
  PieChart, LineChart, CalendarDays, FileText,
  MessageSquare, Settings, Download, Share2
} from 'lucide-react';

// Mock data service
const DashboardService = {
  // Get dashboard stats based on user role
  getDashboardStats: async (role) => {
    const baseStats = {
      focusTime: '3.2h',
      tasksCompleted: '12/15',
      streak: 5,
      points: 425,
      moodScore: 7.5,
      focusSessions: 8,
      avgFocusDuration: '24min'
    };

    if (role === 'parent') {
      return {
        ...baseStats,
        childName: 'Jamie',
        weeklyProgress: '+12%',
        alerts: 2,
        upcomingAppointments: 1
      };
    } else if (role === 'therapist') {
      return {
        ...baseStats,
        patients: 8,
        sessionsThisWeek: 12,
        notesToReview: 3,
        upcomingAppointments: 4
      };
    } else { // child
      return {
        ...baseStats,
        dailyGoal: 'Complete 3 tasks',
        rewardsAvailable: 2,
        nextGameUnlock: 'Pattern Master',
        funFact: 'You focused for 12 minutes longer than yesterday!'
      };
    }
  },

  // Get recent activities
  getRecentActivities: async (role) => {
    if (role === 'parent') {
      return [
        { id: 1, type: 'progress', title: 'Math worksheet completed', description: 'Jamie completed all problems correctly', time: '2 hours ago', points: 15 },
        { id: 2, type: 'mood', title: 'Mood check-in', description: 'Reported feeling calm and focused', time: 'Yesterday', points: 5 },
        { id: 3, type: 'alert', title: 'Focus alert', description: 'Quick break needed during reading time', time: '2 days ago' },
        { id: 4, type: 'achievement', title: 'New streak record!', description: '5 consecutive days of completed tasks', time: '3 days ago', points: 25 },
      ];
    } else if (role === 'therapist') {
      return [
        { id: 1, type: 'session', title: 'Therapy session completed', description: 'Progress review with Jamie', time: 'Today', points: 20 },
        { id: 2, type: 'note', title: 'New observation added', description: 'Social interaction improvements noted', time: 'Yesterday' },
        { id: 3, type: 'progress', title: 'Focus metrics updated', description: 'Attention span increased by 15%', time: '2 days ago' },
        { id: 4, type: 'appointment', title: 'Upcoming session reminder', description: 'Parent meeting scheduled', time: 'Tomorrow' },
      ];
    } else {
      return [
        { id: 1, type: 'game', title: 'Pattern Master unlocked!', description: 'New focus game available', time: 'Today', points: 10 },
        { id: 2, type: 'reward', title: '30min game time earned', description: 'Completed daily challenge', time: 'Yesterday', points: 30 },
        { id: 3, type: 'achievement', title: 'Focus Master badge', description: '5 perfect focus sessions', time: '2 days ago', points: 50 },
        { id: 4, type: 'task', title: 'Reading time completed', description: '15 minutes of focused reading', time: '3 days ago', points: 15 },
      ];
    }
  },

  // Get focus data for charts
  getFocusData: async () => {
    return {
      weekly: [25, 40, 35, 50, 45, 30, 55],
      monthly: [120, 135, 145, 130, 155, 160, 175, 180, 165, 170, 185, 190],
      categories: {
        academic: 45,
        games: 25,
        therapy: 20,
        other: 10
      }
    };
  },

  // Get upcoming tasks/events
  getUpcomingItems: async (role) => {
    const items = [
      { id: 1, type: 'appointment', title: 'Therapy Session', time: 'Today, 3:00 PM', with: 'Dr. Sarah Johnson', priority: 'high' },
      { id: 2, type: 'task', title: 'Math Homework', time: 'Tomorrow, 4:00 PM', duration: '20 min', points: 15 },
      { id: 3, type: 'game', title: 'Focus Challenge', time: 'Available now', duration: '5 min', points: 10 },
      { id: 4, type: 'reminder', title: 'Medication Time', time: 'Daily, 8:00 AM', priority: 'medium' },
    ];

    if (role === 'therapist') {
      return [
        ...items,
        { id: 5, type: 'meeting', title: 'Parent-Teacher Meeting', time: 'Friday, 2:00 PM', with: 'Ms. Anderson' },
        { id: 6, type: 'review', title: 'Progress Report Due', time: 'Next Monday', priority: 'medium' },
      ];
    }

    return items;
  },

  // Get patient list (for therapist/parent)
  getPatients: async () => {
    return [
      { id: 1, name: 'Jamie Smith', age: 7, focusScore: 68, streak: 5, lastActivity: '2 hours ago' },
      { id: 2, name: 'Alex Johnson', age: 6, focusScore: 72, streak: 3, lastActivity: 'Yesterday' },
      { id: 3, name: 'Taylor Brown', age: 8, focusScore: 65, streak: 7, lastActivity: 'Today' },
      { id: 4, name: 'Morgan Lee', age: 7, focusScore: 75, streak: 4, lastActivity: '2 days ago' },
    ];
  }
};

const Dashboard = () => {
  const { userRole } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // State management
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [focusData, setFocusData] = useState(null);
  const [upcomingItems, setUpcomingItems] = useState([]);
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTimeFrame, setActiveTimeFrame] = useState('week');
  const [todaysMood, setTodaysMood] = useState('happy');
  const [energyLevel, setEnergyLevel] = useState(7);

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      // In real app, this would be WebSocket or polling
      loadDashboardData();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [userRole]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [statsData, activitiesData, focusData, upcomingData, patientsData] = await Promise.all([
        DashboardService.getDashboardStats(userRole),
        DashboardService.getRecentActivities(userRole),
        DashboardService.getFocusData(),
        DashboardService.getUpcomingItems(userRole),
        userRole !== 'child' ? DashboardService.getPatients() : Promise.resolve([])
      ]);

      setStats(statsData);
      setActivities(activitiesData);
      setFocusData(focusData);
      setUpcomingItems(upcomingData);
      setPatients(patientsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle mood selection
  const handleMoodSelect = (mood) => {
    setTodaysMood(mood);
    // In real app, save to API
    console.log('Mood saved:', mood);
  };

  // Handle quick actions
  const handleQuickAction = (action) => {
    switch(action) {
      case 'addTask':
        navigate('/tasks/new');
        break;
      case 'startFocus':
        navigate('/focus-session');
        break;
      case 'viewProgress':
        navigate('/progress');
        break;
      case 'sendMessage':
        navigate('/messages');
        break;
      default:
        break;
    }
  };

  // Get activity icon
  const getActivityIcon = (type) => {
    switch(type) {
      case 'progress': return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'mood': return <Heart className="w-5 h-5 text-pink-500" />;
      case 'alert': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'achievement': return <Award className="w-5 h-5 text-yellow-500" />;
      case 'session': return <Activity className="w-5 h-5 text-blue-500" />;
      case 'note': return <FileText className="w-5 h-5 text-purple-500" />;
      case 'game': return <Gamepad2 className="w-5 h-5 text-indigo-500" />;
      case 'reward': return <Star className="w-5 h-5 text-amber-500" />;
      case 'task': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      default: return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get time of day greeting
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                {getTimeGreeting()}, {userRole === 'child' ? 'Jamie' : userRole === 'parent' ? 'Parent' : 'Doctor'}!
              </h1>
              <p className="text-gray-600">
                {userRole === 'child' 
                  ? 'Ready for today\'s focus adventures?' 
                  : userRole === 'parent'
                  ? 'Track your child\'s progress and activities'
                  : 'Monitor your patients\' progress and schedule'
                }
              </p>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <button className="adhd-button px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center">
                <CalendarDays className="w-4 h-4 mr-2" />
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </button>
              
              <button className="adhd-button px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center relative">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
                {stats?.alerts && stats.alerts > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {stats.alerts}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="adhd-card bg-gradient-to-r from-purple-500 to-pink-500 text-white p-5 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <Brain className="w-8 h-8 opacity-80" />
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-1">{stats?.focusTime || '0h'}</div>
            <p className="text-purple-100 text-sm">Focus Time</p>
            <div className="mt-3 text-xs opacity-80">
              {stats?.weeklyProgress || '+0%'} this week
            </div>
          </div>

          <div className="adhd-card bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-5 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="w-8 h-8 opacity-80" />
              <TargetIcon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-1">{stats?.tasksCompleted || '0/0'}</div>
            <p className="text-blue-100 text-sm">Tasks Completed</p>
            <div className="mt-3 text-xs opacity-80">
              {userRole === 'child' ? 'Daily goal' : 'Completion rate'}
            </div>
          </div>

          <div className="adhd-card bg-gradient-to-r from-green-500 to-emerald-500 text-white p-5 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <Award className="w-8 h-8 opacity-80" />
              <Zap className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-1">{stats?.streak || 0}</div>
            <p className="text-green-100 text-sm">Day Streak</p>
            <div className="mt-3 text-xs opacity-80">
              Keep going for weekly reward!
            </div>
          </div>

          <div className="adhd-card bg-gradient-to-r from-amber-500 to-orange-500 text-white p-5 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <Star className="w-8 h-8 opacity-80" />
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-1">{stats?.points || 0}</div>
            <p className="text-amber-100 text-sm">Total Points</p>
            <div className="mt-3 text-xs opacity-80">
              {userRole === 'child' ? 'Spend in rewards shop' : 'Child earned'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Focus & Activities */}
          <div className="lg:col-span-2 space-y-6">
            {/* Focus Chart */}
            <div className="adhd-card bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <LineChart className="w-5 h-5 mr-2 text-purple-500" />
                  Focus Analytics
                </h2>
                <div className="flex space-x-2">
                  {['day', 'week', 'month'].map((timeFrame) => (
                    <button
                      key={timeFrame}
                      onClick={() => setActiveTimeFrame(timeFrame)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium capitalize ${
                        activeTimeFrame === timeFrame
                          ? 'bg-purple-100 text-purple-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {timeFrame}
                    </button>
                  ))}
                </div>
              </div>

              {focusData && (
                <div className="h-64 flex items-center justify-center">
                  <div className="w-full">
                    {/* Simple bar chart visualization */}
                    <div className="flex items-end justify-between h-48 px-4">
                      {(activeTimeFrame === 'week' ? focusData.weekly : focusData.monthly.slice(0, 7)).map((value, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div 
                            className="w-8 bg-gradient-to-t from-purple-400 to-purple-600 rounded-t-lg transition-all hover:opacity-80"
                            style={{ height: `${(value / 200) * 100}%` }}
                          />
                          <span className="text-xs text-gray-500 mt-2">
                            {activeTimeFrame === 'week' ? ['M', 'T', 'W', 'T', 'F', 'S', 'S'][index] : `Day ${index + 1}`}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-lg font-bold text-purple-600">{stats?.focusSessions || 0}</div>
                        <p className="text-sm text-gray-600">Sessions</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">{stats?.avgFocusDuration || '0min'}</div>
                        <p className="text-sm text-gray-600">Avg. Duration</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">{stats?.moodScore || 0}/10</div>
                        <p className="text-sm text-gray-600">Mood Score</p>
                      </div>
                      <div className="text-center p-3 bg-amber-50 rounded-lg">
                        <div className="text-lg font-bold text-amber-600">{stats?.weeklyProgress || '+0%'}</div>
                        <p className="text-sm text-gray-600">Progress</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Activities */}
            <div className="adhd-card bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-blue-500" />
                  Recent Activities
                </h2>
                <Link to="/activities" className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center">
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              <div className="space-y-4">
                {activities.slice(0, 4).map((activity) => (
                  <div key={activity.id} className="flex items-start p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex-shrink-0 mr-4">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-gray-800">{activity.title}</h4>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">{activity.description}</p>
                      {activity.points && (
                        <div className="flex items-center mt-2">
                          <Star className="w-3 h-3 text-yellow-500 mr-1" />
                          <span className="text-xs font-medium text-amber-600">+{activity.points} points</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {userRole === 'child' && (
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <Zap className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{stats?.funFact || 'You\'re doing great!'}</p>
                      <p className="text-sm text-gray-600">Keep up the good work!</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="adhd-card bg-white rounded-2xl p-6 shadow-lg">
  <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
    <Zap className="w-5 h-5 mr-2 text-amber-500" />
    Quick Actions
  </h2>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    <Link
      to="/activities"
      className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
    >
      <Activity className="w-8 h-8 text-purple-600 mb-2" />
      <span className="font-medium text-gray-800">Activities</span>
    </Link>

    <Link
      to="/progress"
      className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
    >
      <TrendingUp className="w-8 h-8 text-blue-600 mb-2" />
      <span className="font-medium text-gray-800">Progress</span>
    </Link>

    <Link
      to="/schedule"
      className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
    >
      <Calendar className="w-8 h-8 text-green-600 mb-2" />
      <span className="font-medium text-gray-800">Schedule</span>
    </Link>

    <button
      onClick={() => handleQuickAction('sendMessage')}
      className="flex flex-col items-center justify-center p-4 bg-pink-50 rounded-xl hover:bg-pink-100 transition-colors"
    >
      <MessageSquare className="w-8 h-8 text-pink-600 mb-2" />
      <span className="font-medium text-gray-800">Messages</span>
    </button>
  </div>
</div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Mood & Energy Tracker */}
            <div className="adhd-card bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-pink-500" />
                Today's Check-in
              </h2>

              <div className="mb-6">
                <p className="text-gray-700 mb-3">How are you feeling?</p>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { mood: 'sad', emoji: '😔', label: 'Sad' },
                    { mood: 'okay', emoji: '😐', label: 'Okay' },
                    { mood: 'happy', emoji: '😊', label: 'Happy' },
                    { mood: 'excited', emoji: '🤩', label: 'Excited' },
                    { mood: 'calm', emoji: '😌', label: 'Calm' }
                  ].map((item) => (
                    <button
                      key={item.mood}
                      onClick={() => handleMoodSelect(item.mood)}
                      className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                        todaysMood === item.mood
                          ? 'bg-pink-100 border-2 border-pink-300'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-2xl mb-1">{item.emoji}</span>
                      <span className="text-xs text-gray-600">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">Energy Level</span>
                  <span className="font-bold text-gray-800">{energyLevel}/10</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={energyLevel}
                  onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>

              <button className="w-full mt-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all">
                Save Check-in
              </button>
            </div>

            {/* Upcoming Schedule */}
            <div className="adhd-card bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-green-500" />
                  Upcoming
                </h2>
                <span className="text-sm text-gray-500">
                  {stats?.upcomingAppointments || 0} items
                </span>
              </div>

              <div className="space-y-4">
                {upcomingItems.slice(0, 3).map((item) => (
                  <div key={item.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        {item.type === 'appointment' && <Calendar className="w-4 h-4 text-blue-500 mr-2" />}
                        {item.type === 'task' && <CheckCircle className="w-4 h-4 text-green-500 mr-2" />}
                        {item.type === 'game' && <Gamepad2 className="w-4 h-4 text-purple-500 mr-2" />}
                        {item.type === 'reminder' && <Bell className="w-4 h-4 text-amber-500 mr-2" />}
                        <span className="font-medium text-gray-800">{item.title}</span>
                      </div>
                      {item.priority && (
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(item.priority)}`}>
                          {item.priority}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      <Clock className="inline w-3 h-3 mr-1" />
                      {item.time}
                      {item.with && (
                        <>
                          <span className="mx-2">•</span>
                          <Users className="inline w-3 h-3 mr-1" />
                          {item.with}
                        </>
                      )}
                    </div>
                    {item.points && (
                      <div className="mt-2 flex items-center text-sm">
                        <Star className="w-3 h-3 text-yellow-500 mr-1" />
                        <span className="text-amber-600 font-medium">+{item.points} points</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <Link
                to="/schedule"
                className="mt-4 w-full py-3 border-2 border-dashed border-gray-300 text-gray-500 hover:border-purple-400 hover:text-purple-600 rounded-lg transition-all flex items-center justify-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Item
              </Link>
            </div>

            {/* Patients List (for therapist/parent) */}
            {(userRole === 'therapist' || userRole === 'parent') && patients.length > 0 && (
              <div className="adhd-card bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-indigo-500" />
                    {userRole === 'therapist' ? 'My Patients' : 'Children'}
                  </h2>
                  <span className="text-sm text-gray-500">
                    {patients.length} total
                  </span>
                </div>

                <div className="space-y-4">
                  {patients.slice(0, 3).map((patient) => (
                    <Link
                      key={patient.id}
                      to={`/patient/${patient.id}`}
                      className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold mr-3">
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-800">{patient.name}</span>
                          <span className="text-xs text-gray-500">{patient.age} yrs</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <div className="w-16 bg-gray-200 rounded-full h-1.5 mr-2">
                            <div 
                              className="bg-green-500 h-1.5 rounded-full"
                              style={{ width: `${patient.focusScore}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-600">{patient.focusScore}% focus</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          <Clock className="inline w-3 h-3 mr-1" />
                          Active {patient.lastActivity}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                <Link
                  to={userRole === 'therapist' ? '/patients' : '/children'}
                  className="mt-4 w-full py-3 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 hover:from-indigo-100 hover:to-purple-100 rounded-lg transition-all flex items-center justify-center"
                >
                  View All {userRole === 'therapist' ? 'Patients' : 'Children'}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            )}

            {/* Rewards & Games (for child) */}
            {userRole === 'child' && (
              <div className="adhd-card bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <Gamepad2 className="w-5 h-5 mr-2 text-purple-500" />
                  Available Games
                </h2>

                <div className="space-y-4">
                  <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-xl">🧩</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-800">Pattern Master</p>
                        <p className="text-sm text-gray-600">Unlocked! 5 min game</p>
                      </div>
                    </div>
                    <button className="w-full mt-2 py-2 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600">
                      Play Now
                    </button>
                  </div>

                  <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-xl">🎯</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-800">Focus Target</p>
                        <p className="text-sm text-gray-600">Locked - Need 50 more points</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                      <Award className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{stats?.rewardsAvailable || 0} Rewards Available</p>
                      <p className="text-sm text-gray-600">Spend your points!</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section - Additional Insights */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Focus Tips */}
          <div className="adhd-card bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-blue-500" />
              Focus Tip of the Day
            </h3>
            <div className="p-4 bg-white rounded-xl shadow-sm">
              <p className="text-gray-700">
                "Try the 5-4-3-2-1 grounding technique: Name 5 things you can see, 
                4 things you can feel, 3 things you can hear, 2 things you can smell, 
                and 1 thing you can taste."
              </p>
            </div>
            <button className="w-full mt-4 py-2 bg-white border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50">
              More Tips
            </button>
          </div>

          {/* Progress Summary */}
          <div className="adhd-card bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
              Weekly Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Focus Time</span>
                <span className="font-bold text-green-600">+12%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Tasks Completed</span>
                <span className="font-bold text-green-600">+8%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Positive Mood Days</span>
                <span className="font-bold text-green-600">5/7</span>
              </div>
            </div>
            <button className="w-full mt-4 py-2 bg-white border border-green-300 text-green-600 rounded-lg hover:bg-green-50">
              View Full Report
            </button>
          </div>

          {/* Quick Resources */}
          <div className="adhd-card bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-purple-500" />
              Quick Resources
            </h3>
            <div className="space-y-2">
              <a href="#" className="flex items-center p-2 text-gray-700 hover:text-purple-600">
                <FileText className="w-4 h-4 mr-2" />
                ADHD Parenting Guide
              </a>
              <a href="#" className="flex items-center p-2 text-gray-700 hover:text-purple-600">
                <Activity className="w-4 h-4 mr-2" />
                Focus Exercises PDF
              </a>
              <a href="#" className="flex items-center p-2 text-gray-700 hover:text-purple-600">
                <MessageSquare className="w-4 h-4 mr-2" />
                Therapist Contact
              </a>
            </div>
            <button className="w-full mt-4 py-2 bg-white border border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50">
              All Resources
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;