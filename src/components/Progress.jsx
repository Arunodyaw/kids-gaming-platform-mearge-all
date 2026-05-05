// src/components/Progress.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { AuthContext } from '../App';
import {
  TrendingUp, BarChart3, PieChart, Target,
  Award, Clock, Calendar, Download,
  Filter, ChevronRight, TrendingDown,
  CheckCircle, AlertCircle, Star, Zap,
  Brain, Heart, Users, TargetIcon
} from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Mock progress service
const ProgressService = {
  getProgressData: async (timeframe = 'week') => {
    const data = {
      focusTime: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Focus Time (min)',
          data: [25, 40, 35, 50, 45, 30, 55],
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          borderWidth: 3,
          tension: 0.4,
          fill: true
        }]
      },
      
      taskCompletion: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
          label: 'Task Completion Rate',
          data: [65, 72, 68, 78],
          backgroundColor: '#10b981',
          borderRadius: 6
        }]
      },
      
      moodTrends: {
        labels: ['Morning', 'Noon', 'Afternoon', 'Evening'],
        datasets: [{
          label: 'Average Mood Score',
          data: [6.5, 7.2, 6.8, 7.5],
          borderColor: '#ec4899',
          backgroundColor: 'rgba(236, 72, 153, 0.1)',
          borderWidth: 3,
          tension: 0.4
        }]
      },
      
      activityDistribution: {
        labels: ['Academic', 'Games', 'Therapy', 'Life Skills', 'Creative'],
        datasets: [{
          data: [35, 25, 20, 12, 8],
          backgroundColor: [
            '#3b82f6', // blue
            '#8b5cf6', // purple
            '#10b981', // green
            '#f59e0b', // yellow
            '#ec4899'  // pink
          ],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      
      focusAreas: {
        labels: ['Focus', 'Emotions', 'Social', 'Organization', 'Independence'],
        datasets: [{
          label: 'Current Score',
          data: [68, 65, 60, 72, 58],
          backgroundColor: 'rgba(139, 92, 246, 0.2)',
          borderColor: '#8b5cf6',
          borderWidth: 2
        }, {
          label: 'Goal',
          data: [80, 75, 70, 80, 70],
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          borderColor: '#10b981',
          borderWidth: 2
        }]
      }
    };

    if (timeframe === 'month') {
      data.focusTime.labels = Array.from({length: 30}, (_, i) => `Day ${i + 1}`);
      data.focusTime.data = Array.from({length: 30}, () => Math.floor(Math.random() * 60) + 20);
    }

    return data;
  },

  getProgressStats: async () => ({
    overallProgress: 68,
    weeklyGrowth: '+12%',
    streak: 5,
    totalPoints: 425,
    achievements: 8,
    focusImprovement: '+15%',
    taskCompletionRate: '78%',
    moodAverage: 7.2,
    bestDay: 'Thursday',
    bestTime: 'Morning'
  }),

  getAchievements: async () => [
    { id: 1, title: 'Focus Master', description: '5 perfect focus sessions', earned: true, date: '2024-01-10', icon: '🎯' },
    { id: 2, title: 'Task Champion', description: 'Complete 50 tasks', earned: true, date: '2024-01-05', icon: '🏆' },
    { id: 3, title: 'Mood Expert', description: '7 days of positive mood', earned: true, date: '2024-01-12', icon: '😊' },
    { id: 4, title: 'Streak King', description: '10 day streak', earned: false, progress: 5, required: 10, icon: '🔥' },
    { id: 5, title: 'Early Bird', description: 'Complete 5 morning tasks', earned: false, progress: 3, required: 5, icon: '🌅' },
    { id: 6, title: 'Game Master', description: 'Play all focus games', earned: false, progress: 2, required: 5, icon: '🎮' }
  ],

  getInsights: async () => [
    { id: 1, type: 'positive', title: 'Focus Time Increased', description: 'Average focus time increased by 15% this week', icon: '📈' },
    { id: 2, type: 'improvement', title: 'Morning Routine', description: 'Morning tasks completed faster by 8 minutes', icon: '⏰' },
    { id: 3, type: 'alert', title: 'Afternoon Slump', description: 'Focus dips around 3 PM. Consider scheduling breaks', icon: '⚠️' },
    { id: 4, type: 'positive', title: 'Social Skills', description: 'Improved peer interactions during group activities', icon: '👥' },
    { id: 5, type: 'goal', title: 'Weekly Target', description: 'On track to beat last week\'s focus time record', icon: '🎯' }
  ]
};

const Progress = () => {
  const { userRole } = useContext(AuthContext);
  const [timeframe, setTimeframe] = useState('week');
  const [progressData, setProgressData] = useState(null);
  const [stats, setStats] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [insights, setInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProgressData();
  }, [timeframe]);

  const loadProgressData = async () => {
    setIsLoading(true);
    try {
      const [data, statsData, achievementsData, insightsData] = await Promise.all([
        ProgressService.getProgressData(timeframe),
        ProgressService.getProgressStats(),
        ProgressService.getAchievements(),
        ProgressService.getInsights()
      ]);
      
      setProgressData(data);
      setStats(statsData);
      setAchievements(achievementsData);
      setInsights(insightsData);
    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }
    }
  };

  // Get insight color
  const getInsightColor = (type) => {
    switch(type) {
      case 'positive': return 'bg-green-50 border-green-200';
      case 'alert': return 'bg-red-50 border-red-200';
      case 'improvement': return 'bg-blue-50 border-blue-200';
      case 'goal': return 'bg-purple-50 border-purple-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading progress data...</p>
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
                Progress & Analytics
              </h1>
              <p className="text-gray-600">
                Track growth, analyze patterns, and celebrate achievements
              </p>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
                {['day', 'week', 'month', 'year'].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-3 py-1 rounded-md text-sm font-medium capitalize ${
                      timeframe === tf
                        ? 'bg-white text-purple-600 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
              
              <button className="adhd-button px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
            <div className="adhd-card bg-white p-5 rounded-2xl">
              <div className="flex items-center mb-4">
                <TrendingUp className="w-8 h-8 text-purple-500 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-gray-800">{stats.overallProgress}%</div>
                  <p className="text-sm text-gray-600">Overall Progress</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: `${stats.overallProgress}%` }}
                />
              </div>
            </div>
            
            <div className="adhd-card bg-white p-5 rounded-2xl">
              <div className="flex items-center mb-4">
                <Target className="w-8 h-8 text-green-500 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-gray-800">{stats.weeklyGrowth}</div>
                  <p className="text-sm text-gray-600">Weekly Growth</p>
                </div>
              </div>
              <div className="text-green-600 text-sm flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                Positive trend
              </div>
            </div>
            
            <div className="adhd-card bg-white p-5 rounded-2xl">
              <div className="flex items-center mb-4">
                <Zap className="w-8 h-8 text-yellow-500 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-gray-800">{stats.streak}</div>
                  <p className="text-sm text-gray-600">Day Streak</p>
                </div>
              </div>
              <div className="text-yellow-600 text-sm">Keep it going!</div>
            </div>
            
            <div className="adhd-card bg-white p-5 rounded-2xl">
              <div className="flex items-center mb-4">
                <Award className="w-8 h-8 text-blue-500 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-gray-800">{stats.achievements}</div>
                  <p className="text-sm text-gray-600">Achievements</p>
                </div>
              </div>
              <div className="text-blue-600 text-sm">Unlocked</div>
            </div>
            
            <div className="adhd-card bg-white p-5 rounded-2xl">
              <div className="flex items-center mb-4">
                <Brain className="w-8 h-8 text-pink-500 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-gray-800">{stats.focusImprovement}</div>
                  <p className="text-sm text-gray-600">Focus Improvement</p>
                </div>
              </div>
              <div className="text-pink-600 text-sm flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                Great progress
              </div>
            </div>
          </div>
        )}

        {/* Charts Grid */}
        {progressData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Focus Time Chart */}
            <div className="adhd-card bg-white p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-purple-500" />
                  Focus Time
                </h3>
                <span className="text-sm text-gray-500">{timeframe} view</span>
              </div>
              <div className="h-64">
                <Line data={progressData.focusTime} options={chartOptions} />
              </div>
            </div>

            {/* Task Completion Chart */}
            <div className="adhd-card bg-white p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  Task Completion
                </h3>
                <span className="text-green-600 font-bold">{stats?.taskCompletionRate}</span>
              </div>
              <div className="h-64">
                <Bar data={progressData.taskCompletion} options={chartOptions} />
              </div>
            </div>

            {/* Activity Distribution */}
            <div className="adhd-card bg-white p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800 flex items-center">
                  <PieChart className="w-5 h-5 mr-2 text-blue-500" />
                  Activity Distribution
                </h3>
                <span className="text-sm text-gray-500">This {timeframe}</span>
              </div>
              <div className="h-64">
                <Doughnut data={progressData.activityDistribution} options={chartOptions} />
              </div>
            </div>

            {/* Focus Areas Radar */}
            <div className="adhd-card bg-white p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800 flex items-center">
                  <TargetIcon className="w-5 h-5 mr-2 text-amber-500" />
                  Focus Areas
                </h3>
                <span className="text-sm text-gray-500">Current vs Goal</span>
              </div>
              <div className="h-64">
                <Bar data={progressData.focusAreas} options={chartOptions} />
              </div>
            </div>
          </div>
        )}

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Insights & Recommendations */}
          <div className="lg:col-span-2">
            <div className="adhd-card bg-white rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-purple-500" />
                Insights & Recommendations
              </h3>
              
              <div className="space-y-4">
                {insights.map((insight) => (
                  <div key={insight.id} className={`p-4 rounded-xl border ${getInsightColor(insight.type)}`}>
                    <div className="flex items-start">
                      <div className="text-2xl mr-3">{insight.icon}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-gray-800">{insight.title}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            insight.type === 'positive' ? 'bg-green-100 text-green-800' :
                            insight.type === 'alert' ? 'bg-red-100 text-red-800' :
                            insight.type === 'improvement' ? 'bg-blue-100 text-blue-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {insight.type}
                          </span>
                        </div>
                        <p className="text-gray-600 mt-2">{insight.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Best Times */}
              {stats && (
                <div className="mt-8 p-5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                  <h4 className="font-bold text-gray-800 mb-3">Peak Performance Times</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white rounded-lg">
                      <p className="text-sm text-gray-600">Best Day</p>
                      <p className="font-bold text-gray-800">{stats.bestDay}</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg">
                      <p className="text-sm text-gray-600">Best Time</p>
                      <p className="font-bold text-gray-800">{stats.bestTime}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Achievements */}
          <div>
            <div className="adhd-card bg-white rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <Award className="w-5 h-5 mr-2 text-yellow-500" />
                Achievements
              </h3>
              
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-start">
                      <div className="text-2xl mr-3">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-gray-800">{achievement.title}</h4>
                          {achievement.earned ? (
                            <span className="text-green-600 text-sm">✅ Earned</span>
                          ) : (
                            <span className="text-amber-600 text-sm">
                              {achievement.progress}/{achievement.required}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mt-1">{achievement.description}</p>
                        {achievement.earned && (
                          <p className="text-xs text-gray-500 mt-2">
                            Earned on {new Date(achievement.date).toLocaleDateString()}
                          </p>
                        )}
                        {!achievement.earned && (
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-amber-500 h-2 rounded-full"
                                style={{ width: `${(achievement.progress / achievement.required) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Summary */}
            <div className="adhd-card bg-white rounded-2xl p-6 mt-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Progress Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Focus Duration</span>
                  <span className="font-bold text-gray-800">↑ 15%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Task Accuracy</span>
                  <span className="font-bold text-gray-800">↑ 8%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Positive Mood</span>
                  <span className="font-bold text-gray-800">↑ 12%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Social Interactions</span>
                  <span className="font-bold text-gray-800">↑ 5%</span>
                </div>
              </div>
              
              <button className="w-full mt-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600">
                View Detailed Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;