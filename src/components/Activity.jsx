// src/components/Activity.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import {
  Plus, CheckCircle, Clock, Target, Brain, 
  Gamepad2, BookOpen, Music, Palette, Utensils,
  Filter, Search, Calendar, Star, Award,
  TrendingUp, Zap, Bell, Edit2, Trash2,
  ChevronRight, ChevronDown, PlayCircle,
  Timer, PauseCircle, StopCircle, RefreshCw,
  BarChart3, FileText, Download, Share2
} from 'lucide-react';

// Mock activity service
const ActivityService = {
  getActivities: async (role, filter = 'all') => {
    const allActivities = [
      // Academic Activities
      { 
        id: 1, 
        type: 'academic', 
        title: 'Math Worksheet', 
        description: 'Complete addition and subtraction problems',
        duration: 20, 
        points: 15, 
        difficulty: 'medium',
        status: 'completed',
        completedAt: '2024-01-15 14:30',
        childRating: 4,
        notes: 'Completed with 100% accuracy',
        tags: ['math', 'homework', 'focus']
      },
      { 
        id: 2, 
        type: 'academic', 
        title: 'Reading Practice', 
        description: 'Read aloud for 15 minutes',
        duration: 15, 
        points: 10, 
        difficulty: 'easy',
        status: 'in-progress',
        progress: 60,
        childRating: null,
        tags: ['reading', 'literacy', 'speech']
      },
      
      // Focus Games
      { 
        id: 3, 
        type: 'game', 
        title: 'Pattern Master', 
        description: 'Match shapes and colors',
        duration: 5, 
        points: 10, 
        difficulty: 'easy',
        status: 'available',
        childRating: null,
        tags: ['game', 'visual', 'memory']
      },
      { 
        id: 4, 
        type: 'game', 
        title: 'Focus Target', 
        description: 'Hit targets before they disappear',
        duration: 10, 
        points: 20, 
        difficulty: 'hard',
        status: 'locked',
        requiredPoints: 50,
        childRating: null,
        tags: ['game', 'reaction', 'focus']
      },
      
      // Therapy Activities
      { 
        id: 5, 
        type: 'therapy', 
        title: 'Breathing Exercise', 
        description: '5-minute calm breathing practice',
        duration: 5, 
        points: 5, 
        difficulty: 'easy',
        status: 'completed',
        completedAt: '2024-01-14 09:15',
        childRating: 3,
        notes: 'Helped with morning transition',
        tags: ['therapy', 'calm', 'breathing']
      },
      { 
        id: 6, 
        type: 'therapy', 
        title: 'Emotion Cards', 
        description: 'Identify emotions from pictures',
        duration: 10, 
        points: 10, 
        difficulty: 'medium',
        status: 'available',
        childRating: null,
        tags: ['therapy', 'emotions', 'social']
      },
      
      // Life Skills
      { 
        id: 7, 
        type: 'life-skill', 
        title: 'Morning Routine', 
        description: 'Complete morning checklist',
        duration: 30, 
        points: 20, 
        difficulty: 'medium',
        status: 'completed',
        completedAt: '2024-01-15 08:00',
        childRating: 5,
        notes: 'Completed independently',
        tags: ['routine', 'independence', 'chore']
      },
      { 
        id: 8, 
        type: 'life-skill', 
        title: 'Toy Cleanup', 
        description: 'Organize toys in their places',
        duration: 15, 
        points: 15, 
        difficulty: 'easy',
        status: 'available',
        childRating: null,
        tags: ['chore', 'organization', 'responsibility']
      },
      
      // Creative Activities
      { 
        id: 9, 
        type: 'creative', 
        title: 'Drawing Time', 
        description: 'Draw a picture of your favorite animal',
        duration: 25, 
        points: 15, 
        difficulty: 'easy',
        status: 'completed',
        completedAt: '2024-01-13 16:00',
        childRating: 5,
        notes: 'Very creative drawing!',
        tags: ['art', 'creative', 'fun']
      },
      { 
        id: 10, 
        type: 'creative', 
        title: 'Music Practice', 
        description: 'Practice piano for 20 minutes',
        duration: 20, 
        points: 20, 
        difficulty: 'hard',
        status: 'in-progress',
        progress: 30,
        childRating: null,
        tags: ['music', 'practice', 'discipline']
      }
    ];

    if (filter === 'all') return allActivities;
    return allActivities.filter(activity => activity.type === filter);
  },

  startActivity: async (activityId) => {
    console.log('Starting activity:', activityId);
    return { success: true, startTime: new Date() };
  },

  completeActivity: async (activityId, rating, notes) => {
    console.log('Completing activity:', activityId, rating, notes);
    return { success: true, points: 15, streakBonus: 5 };
  },

  createActivity: async (activityData) => {
    console.log('Creating activity:', activityData);
    return { success: true, id: Date.now(), ...activityData };
  },

  getActivityStats: async () => ({
    totalCompleted: 24,
    averageRating: 4.2,
    totalPoints: 425,
    favoriteActivity: 'Pattern Master',
    mostProductiveDay: 'Wednesday',
    weeklyCompletionRate: '78%'
  })
};

const Activity = () => {
  const { userRole } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // State management
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activityStats, setActivityStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeActivity, setActiveActivity] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  // New activity form
  const [newActivity, setNewActivity] = useState({
    title: '',
    description: '',
    type: 'academic',
    duration: 15,
    points: 10,
    difficulty: 'medium',
    tags: []
  });

  // Load activities
  useEffect(() => {
    loadActivities();
    loadStats();
  }, [filter]);

  const loadActivities = async () => {
    setIsLoading(true);
    try {
      const data = await ActivityService.getActivities(userRole, filter);
      setActivities(data);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const stats = await ActivityService.getActivityStats();
      setActivityStats(stats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  // Filter activities by search
  const filteredActivities = activities.filter(activity => 
    activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Get activity type icon
  const getTypeIcon = (type) => {
    switch(type) {
      case 'academic': return <BookOpen className="w-5 h-5" />;
      case 'game': return <Gamepad2 className="w-5 h-5" />;
      case 'therapy': return <Brain className="w-5 h-5" />;
      case 'life-skill': return <Target className="w-5 h-5" />;
      case 'creative': return <Palette className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  // Get activity type color
  const getTypeColor = (type) => {
    switch(type) {
      case 'academic': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'game': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'therapy': return 'bg-green-100 text-green-600 border-green-200';
      case 'life-skill': return 'bg-amber-100 text-amber-600 border-amber-200';
      case 'creative': return 'bg-pink-100 text-pink-600 border-pink-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'available': return 'bg-gray-100 text-gray-800';
      case 'locked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle starting an activity
  const handleStartActivity = async (activity) => {
    if (activity.status === 'locked') {
      alert(`This activity is locked. You need ${activity.requiredPoints} more points to unlock it.`);
      return;
    }

    setActiveActivity(activity);
    setTimer(activity.duration * 60); // Convert minutes to seconds
    setIsTimerRunning(true);
    
    await ActivityService.startActivity(activity.id);
  };

  // Timer functions
  useEffect(() => {
    let interval;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      alert('Activity time complete! Please rate your experience.');
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle creating new activity
  const handleCreateActivity = async () => {
    if (!newActivity.title.trim()) {
      alert('Please enter a title for the activity');
      return;
    }

    try {
      await ActivityService.createActivity(newActivity);
      setShowCreateModal(false);
      setNewActivity({
        title: '',
        description: '',
        type: 'academic',
        duration: 15,
        points: 10,
        difficulty: 'medium',
        tags: []
      });
      loadActivities(); // Refresh list
    } catch (error) {
      console.error('Error creating activity:', error);
    }
  };

  // Handle activity completion
  const handleCompleteActivity = async (activityId, rating, notes) => {
    try {
      await ActivityService.completeActivity(activityId, rating, notes);
      setActiveActivity(null);
      setIsTimerRunning(false);
      setTimer(0);
      loadActivities(); // Refresh list
      loadStats(); // Refresh stats
    } catch (error) {
      console.error('Error completing activity:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading activities...</p>
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
                Activities & Tasks
              </h1>
              <p className="text-gray-600">
                Engage in focus-building activities and track progress
              </p>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              {userRole !== 'child' && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="adhd-button px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Activity
                </button>
              )}
              
              <button className="adhd-button px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        {activityStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="adhd-card bg-white p-5 rounded-2xl">
              <div className="flex items-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-gray-800">{activityStats.totalCompleted}</div>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
              </div>
            </div>
            
            <div className="adhd-card bg-white p-5 rounded-2xl">
              <div className="flex items-center mb-4">
                <Star className="w-8 h-8 text-yellow-500 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-gray-800">{activityStats.averageRating}/5</div>
                  <p className="text-sm text-gray-600">Avg. Rating</p>
                </div>
              </div>
            </div>
            
            <div className="adhd-card bg-white p-5 rounded-2xl">
              <div className="flex items-center mb-4">
                <TrendingUp className="w-8 h-8 text-blue-500 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-gray-800">{activityStats.weeklyCompletionRate}</div>
                  <p className="text-sm text-gray-600">Completion Rate</p>
                </div>
              </div>
            </div>
            
            <div className="adhd-card bg-white p-5 rounded-2xl">
              <div className="flex items-center mb-4">
                <Award className="w-8 h-8 text-purple-500 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-gray-800">{activityStats.totalPoints}</div>
                  <p className="text-sm text-gray-600">Total Points</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Timer */}
        {activeActivity && (
          <div className="mb-8 adhd-card bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-bold mb-2">Active Activity</h3>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
                    {getTypeIcon(activeActivity.type)}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{activeActivity.title}</h4>
                    <p className="text-purple-100">{activeActivity.description}</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{formatTime(timer)}</div>
                <div className="flex space-x-3">
                  {isTimerRunning ? (
                    <button
                      onClick={() => setIsTimerRunning(false)}
                      className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg flex items-center"
                    >
                      <PauseCircle className="w-4 h-4 mr-2" />
                      Pause
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsTimerRunning(true)}
                      className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg flex items-center"
                    >
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Resume
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setIsTimerRunning(false);
                      setActiveActivity(null);
                      setTimer(0);
                    }}
                    className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg flex items-center"
                  >
                    <StopCircle className="w-4 h-4 mr-2" />
                    Stop
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters & Search */}
        <div className="mb-8 adhd-card bg-white p-6 rounded-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div className="flex flex-wrap gap-2">
              {['all', 'academic', 'game', 'therapy', 'life-skill', 'creative'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                    filter === type
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type === 'all' ? 'All Activities' : type.replace('-', ' ')}
                </button>
              ))}
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search activities..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity) => (
            <div key={activity.id} className="adhd-card bg-white rounded-2xl overflow-hidden">
              {/* Activity Header */}
              <div className={`p-5 ${getTypeColor(activity.type).split(' ')[0]} border-b`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3">
                      {getTypeIcon(activity.type)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{activity.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(activity.difficulty)}`}>
                        {activity.difficulty}
                      </span>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(activity.status)}`}>
                    {activity.status}
                  </span>
                </div>
                <p className="text-gray-600">{activity.description}</p>
              </div>
              
              {/* Activity Details */}
              <div className="p-5">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{activity.duration} min</span>
                  </div>
                  <div className="flex items-center text-amber-600">
                    <Star className="w-4 h-4 mr-1" />
                    <span className="font-bold">{activity.points} points</span>
                  </div>
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {activity.tags.map((tag, index) => (
                    <span key={index} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* Progress or Lock Message */}
                {activity.status === 'locked' ? (
                  <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                    <p className="text-sm text-red-700">
                      🔒 Needs {activity.requiredPoints} more points to unlock
                    </p>
                  </div>
                ) : activity.status === 'in-progress' ? (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{activity.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${activity.progress}%` }}
                      />
                    </div>
                  </div>
                ) : activity.status === 'completed' ? (
                  <div className="space-y-2">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-green-700">✅ Completed</span>
                        <span className="text-sm text-gray-600">{activity.childRating}/5 ⭐</span>
                      </div>
                      {activity.notes && (
                        <p className="text-sm text-gray-600 mt-2">{activity.notes}</p>
                      )}
                    </div>
                  </div>
                ) : null}
                
                {/* Action Buttons */}
                <div className="flex space-x-3 mt-4">
                  {activity.status === 'available' ? (
                    <button
                      onClick={() => handleStartActivity(activity)}
                      className="flex-1 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 flex items-center justify-center"
                    >
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Start
                    </button>
                  ) : activity.status === 'in-progress' ? (
                    <button
                      onClick={() => handleStartActivity(activity)}
                      className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 flex items-center justify-center"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Continue
                    </button>
                  ) : activity.status === 'completed' ? (
                    <button
                      onClick={() => handleStartActivity(activity)}
                      className="flex-1 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 flex items-center justify-center"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Repeat
                    </button>
                  ) : (
                    <button className="flex-1 py-2 bg-gray-200 text-gray-600 rounded-lg cursor-not-allowed flex items-center justify-center">
                      🔒 Locked
                    </button>
                  )}
                  
                  <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No activities found</h3>
            <p className="text-gray-600 mb-6">Try changing your filters or search terms</p>
            <button
              onClick={() => {
                setFilter('all');
                setSearchQuery('');
              }}
              className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            >
              View All Activities
            </button>
          </div>
        )}
      </div>

      {/* Create Activity Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Create New Activity</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={newActivity.title}
                  onChange={(e) => setNewActivity({...newActivity, title: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter activity title"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Description</label>
                <textarea
                  value={newActivity.description}
                  onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="3"
                  placeholder="Describe the activity"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Type</label>
                  <select
                    value={newActivity.type}
                    onChange={(e) => setNewActivity({...newActivity, type: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="academic">Academic</option>
                    <option value="game">Game</option>
                    <option value="therapy">Therapy</option>
                    <option value="life-skill">Life Skill</option>
                    <option value="creative">Creative</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Duration (min)</label>
                  <input
                    type="number"
                    value={newActivity.duration}
                    onChange={(e) => setNewActivity({...newActivity, duration: parseInt(e.target.value) || 15})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min="1"
                    max="60"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Points</label>
                  <input
                    type="number"
                    value={newActivity.points}
                    onChange={(e) => setNewActivity({...newActivity, points: parseInt(e.target.value) || 10})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min="1"
                    max="100"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Difficulty</label>
                  <select
                    value={newActivity.difficulty}
                    onChange={(e) => setNewActivity({...newActivity, difficulty: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateActivity}
                className="px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700"
              >
                Create Activity
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Activity;