// src/components/Patient.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { 
  User, Brain, Calendar, Target, TrendingUp, 
  Award, Activity, Heart, Star, Clock, 
  Edit2, Save, X, Phone, Mail, Home,
  Briefcase, School, AlertCircle, CheckCircle,
  FileText, Pill, Users, Stethoscope,
  ChevronRight, Download, Share2, Printer,
  Bell, Plus, Trash2, Eye, BarChart3
} from 'lucide-react';

// Mock API Service
const PatientService = {
  getPatientData: async (patientId) => {
    // In real app, fetch from API
    return {
      id: patientId,
      name: 'Jamie Smith',
      age: 7,
      gender: 'Male',
      birthDate: '2016-08-15',
      diagnosisDate: '2023-05-15',
      adhdType: 'Combined Type',
      severity: 'Moderate',
      currentMedication: 'Behavioral Therapy + Methylphenidate (10mg)',
      nextAppointment: '2024-01-25',
      doctor: 'Dr. Sarah Johnson',
      school: 'Sunshine Elementary',
      grade: '2nd Grade',
      parentName: 'Michael Smith',
      parentEmail: 'michael@example.com',
      parentPhone: '+1 (555) 123-4567',
      emergencyContact: 'Emily Smith',
      emergencyPhone: '+1 (555) 987-6543',
      allergies: 'None reported',
      notes: 'Responds well to visual schedules and immediate positive reinforcement'
    };
  },

  updatePatientData: async (patientId, data) => {
    // In real app, send to API
    console.log('Updating patient:', patientId, data);
    return { success: true, data };
  },

  getPatientStats: async (patientId) => ({
    focusScore: 68,
    taskCompletion: 72,
    emotionalRegulation: 65,
    socialSkills: 60,
    dailyStreak: 5,
    totalPoints: 425,
    weeklyProgress: '+12%',
    monthlyTrend: 'Improving'
  }),

  getActivities: async (patientId) => [
    { id: 1, type: 'task', description: 'Completed math worksheet', time: '2 hours ago', points: 15, icon: '📚' },
    { id: 2, type: 'game', description: 'Played focus matching game', time: 'Yesterday', points: 10, icon: '🎮' },
    { id: 3, type: 'mood', description: 'Reported feeling calm and focused', time: '2 days ago', points: 5, icon: '😊' },
    { id: 4, type: 'therapy', description: 'Attended behavioral therapy session', time: '3 days ago', points: 20, icon: '🧠' },
  ],

  getTreatmentPlan: async (patientId) => ({
    goals: [
      'Increase sustained attention to 15 minutes',
      'Complete morning routine independently',
      'Improve emotional regulation during transitions',
      'Reduce impulsive behaviors by 30%',
      'Improve social interactions with peers'
    ],
    strategies: [
      'Visual schedule with picture cues',
      '5-minute warning before transitions',
      'Focus timer with breaks every 20 minutes',
      'Positive reinforcement system',
      'Social stories for challenging situations'
    ],
    accommodations: [
      'Preferential seating in classroom',
      'Extended time for assignments',
      'Use of fidget tools when needed',
      'Quiet workspace available',
      'Modified homework assignments'
    ],
    medications: [
      { name: 'Methylphenidate', dosage: '10mg', frequency: 'Once daily', time: 'Morning' },
      { name: 'Behavioral Therapy', dosage: 'N/A', frequency: 'Weekly', time: 'Wednesday 3 PM' }
    ]
  })
};

const Patient = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { userRole } = useContext(AuthContext);
  
  // State management
  const [patient, setPatient] = useState(null);
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [treatmentPlan, setTreatmentPlan] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPatient, setEditedPatient] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [newNote, setNewNote] = useState('');
  const [patientNotes, setPatientNotes] = useState([
    { id: 1, date: '2024-01-15', content: 'Had a great day at school. Completed homework without reminders.', author: 'Parent' },
    { id: 2, date: '2024-01-14', content: 'Struggled with transitions between activities. Used timer technique successfully.', author: 'Teacher' },
    { id: 3, date: '2024-01-12', content: 'Excellent focus during reading time. Earned 30 minutes of game time.', author: 'Parent' },
    { id: 4, date: '2024-01-10', content: 'Social skills improving. Shared toys during playtime.', author: 'Therapist' },
  ]);

  // Load patient data
  useEffect(() => {
    loadPatientData();
  }, [patientId]);

  const loadPatientData = async () => {
    setIsLoading(true);
    try {
      const [patientData, statsData, activitiesData, planData] = await Promise.all([
        PatientService.getPatientData(patientId || '1'),
        PatientService.getPatientStats(patientId || '1'),
        PatientService.getActivities(patientId || '1'),
        PatientService.getTreatmentPlan(patientId || '1')
      ]);

      setPatient(patientData);
      setEditedPatient(patientData);
      setStats(statsData);
      setActivities(activitiesData);
      setTreatmentPlan(planData);
    } catch (error) {
      console.error('Error loading patient data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setEditedPatient(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Save edited data
  const handleSave = async () => {
    try {
      await PatientService.updatePatientData(patient.id, editedPatient);
      setPatient(editedPatient);
      setIsEditing(false);
      showNotification('Patient information updated successfully!');
    } catch (error) {
      showNotification('Error updating patient information', 'error');
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditedPatient({ ...patient });
    setIsEditing(false);
  };

  // Add new note
  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const newNoteObj = {
      id: patientNotes.length + 1,
      date: new Date().toISOString().split('T')[0],
      content: newNote,
      author: userRole === 'parent' ? 'Parent' : userRole === 'therapist' ? 'Therapist' : 'Teacher'
    };

    setPatientNotes([newNoteObj, ...patientNotes]);
    setNewNote('');
    showNotification('Note added successfully!');
  };

  // Delete note
  const handleDeleteNote = (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setPatientNotes(patientNotes.filter(note => note.id !== noteId));
      showNotification('Note deleted successfully!');
    }
  };

  // Show notification
  const showNotification = (message, type = 'success') => {
    // In a real app, use a toast notification system
    alert(`${type === 'success' ? '✅' : '⚠️'} ${message}`);
  };

  // Calculate age from birthdate
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Get progress color based on percentage
  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Get severity color
  const getSeverityColor = (severity) => {
    switch(severity?.toLowerCase()) {
      case 'mild': return 'bg-green-100 text-green-800 border-green-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'severe': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Loading state
  if (isLoading || !patient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading patient information...</p>
        </div>
      </div>
    );
  }

  // User permissions
  const canEdit = userRole === 'parent' || userRole === 'therapist';
  const canViewSensitive = userRole === 'parent' || userRole === 'therapist';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center text-gray-600 text-sm mb-2">
            <button 
              onClick={() => navigate('/dashboard')}
              className="hover:text-purple-600 flex items-center"
            >
              <Home className="w-4 h-4 mr-1" />
              Dashboard
            </button>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-gray-800 font-medium">Patient Profile</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                {patient.name}'s Profile
              </h1>
              <p className="text-gray-600">
                Comprehensive overview and management
              </p>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              {canEdit && (
                <>
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        className="adhd-button px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all flex items-center"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancel}
                        className="adhd-button px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all flex items-center"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="adhd-button px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all flex items-center"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </button>
                  )}
                </>
              )}
              
              <button className="adhd-button px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </button>
              
              <button className="adhd-button px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
            {['overview', 'treatment', 'progress', 'notes', 'documents'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 capitalize ${
                  activeTab === tab 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab === 'overview' && <User className="inline w-4 h-4 mr-2" />}
                {tab === 'treatment' && <Briefcase className="inline w-4 h-4 mr-2" />}
                {tab === 'progress' && <TrendingUp className="inline w-4 h-4 mr-2" />}
                {tab === 'notes' && <FileText className="inline w-4 h-4 mr-2" />}
                {tab === 'documents' && <Download className="inline w-4 h-4 mr-2" />}
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Patient Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Patient Card */}
              <div className="adhd-card bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                  <div className="flex items-start space-x-4 mb-4 md:mb-0">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold">
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center border-4 border-white">
                        <Brain className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h2 className="text-2xl font-bold text-gray-800">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editedPatient.name}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                              className="border-b-2 border-purple-500 focus:outline-none bg-transparent text-2xl font-bold"
                            />
                          ) : patient.name}
                        </h2>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(patient.severity)}`}>
                          {patient.severity}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-gray-600">
                          <User className="inline w-4 h-4 mr-2" />
                          {isEditing ? (
                            <select
                              value={editedPatient.gender}
                              onChange={(e) => handleInputChange('gender', e.target.value)}
                              className="ml-2 border rounded px-2 py-1"
                            >
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          ) : (
                            `${patient.gender}, ${calculateAge(patient.birthDate || '2016-08-15')} years`
                          )}
                        </p>
                        <p className="text-gray-600">
                          <Target className="inline w-4 h-4 mr-2" />
                          {isEditing ? (
                            <input
                              type="text"
                              value={editedPatient.adhdType}
                              onChange={(e) => handleInputChange('adhdType', e.target.value)}
                              className="border-b-2 border-purple-500 focus:outline-none bg-transparent ml-2"
                            />
                          ) : patient.adhdType}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <div className="text-right mb-4">
                      <p className="text-sm text-gray-500">Patient ID</p>
                      <p className="font-mono font-bold text-gray-800">{patient.id}</p>
                    </div>
                    {canViewSensitive && (
                      <div className="flex space-x-2">
                        <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                          <Bell className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200">
                          <Phone className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Patient Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                    <div className="flex items-center mb-2">
                      <Calendar className="w-5 h-5 text-purple-500 mr-2" />
                      <h3 className="font-semibold text-gray-700">Diagnosis Date</h3>
                    </div>
                    <p className="text-gray-800 font-medium">
                      {isEditing ? (
                        <input
                          type="date"
                          value={editedPatient.diagnosisDate}
                          onChange={(e) => handleInputChange('diagnosisDate', e.target.value)}
                          className="w-full border rounded px-2 py-1"
                        />
                      ) : formatDate(patient.diagnosisDate)}
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <div className="flex items-center mb-2">
                      <Pill className="w-5 h-5 text-blue-500 mr-2" />
                      <h3 className="font-semibold text-gray-700">Current Medication</h3>
                    </div>
                    <p className="text-gray-800 font-medium">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedPatient.currentMedication}
                          onChange={(e) => handleInputChange('currentMedication', e.target.value)}
                          className="w-full border rounded px-2 py-1"
                        />
                      ) : patient.currentMedication}
                    </p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                    <div className="flex items-center mb-2">
                      <Calendar className="w-5 h-5 text-green-500 mr-2" />
                      <h3 className="font-semibold text-gray-700">Next Appointment</h3>
                    </div>
                    <p className="text-gray-800 font-medium">
                      {isEditing ? (
                        <input
                          type="date"
                          value={editedPatient.nextAppointment}
                          onChange={(e) => handleInputChange('nextAppointment', e.target.value)}
                          className="w-full border rounded px-2 py-1"
                        />
                      ) : formatDate(patient.nextAppointment)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <Stethoscope className="inline w-3 h-3 mr-1" />
                      {patient.doctor}
                    </p>
                  </div>
                </div>

                {/* Contact Information */}
                {canViewSensitive && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-5 rounded-xl border border-indigo-100">
                      <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                        <Users className="w-5 h-5 mr-2 text-indigo-500" />
                        Parent Information
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600">Name</p>
                          <p className="font-semibold text-gray-800">{patient.parentName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-semibold text-gray-800 flex items-center">
                            <Mail className="w-4 h-4 mr-2 text-gray-400" />
                            {patient.parentEmail}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-semibold text-gray-800 flex items-center">
                            <Phone className="w-4 h-4 mr-2 text-gray-400" />
                            {patient.parentPhone}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-pink-50 to-red-50 p-5 rounded-xl border border-pink-100">
                      <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                        <AlertCircle className="w-5 h-5 mr-2 text-pink-500" />
                        Emergency Contact
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600">Contact</p>
                          <p className="font-semibold text-gray-800">{patient.emergencyContact}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-semibold text-gray-800 flex items-center">
                            <Phone className="w-4 h-4 mr-2 text-gray-400" />
                            {patient.emergencyPhone}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Allergies</p>
                          <p className="font-semibold text-gray-800">{patient.allergies}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* School Information */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-5 rounded-xl border border-amber-100">
                  <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                    <School className="w-5 h-5 mr-2 text-amber-500" />
                    School Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">School</p>
                      <p className="font-semibold text-gray-800">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedPatient.school}
                            onChange={(e) => handleInputChange('school', e.target.value)}
                            className="w-full border-b-2 border-amber-300 focus:outline-none bg-transparent"
                          />
                        ) : patient.school}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Grade</p>
                      <p className="font-semibold text-gray-800">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedPatient.grade}
                            onChange={(e) => handleInputChange('grade', e.target.value)}
                            className="w-full border-b-2 border-amber-300 focus:outline-none bg-transparent"
                          />
                        ) : patient.grade}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="adhd-card bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <BarChart3 className="w-6 h-6 mr-2 text-purple-500" />
                  Quick Stats
                </h3>
                {stats && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-purple-50 rounded-xl">
                      <div className="text-3xl font-bold text-purple-600 mb-2">{stats.focusScore}%</div>
                      <p className="text-sm text-gray-600">Focus Score</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-xl">
                      <div className="text-3xl font-bold text-blue-600 mb-2">{stats.taskCompletion}%</div>
                      <p className="text-sm text-gray-600">Task Completion</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-xl">
                      <div className="text-3xl font-bold text-green-600 mb-2">{stats.dailyStreak}</div>
                      <p className="text-sm text-gray-600">Day Streak</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-xl">
                      <div className="text-3xl font-bold text-yellow-600 mb-2">{stats.totalPoints}</div>
                      <p className="text-sm text-gray-600">Total Points</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Stats & Activities */}
            <div className="space-y-6">
              {/* Progress Overview */}
              <div className="adhd-card bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2 text-purple-500" />
                  Progress Overview
                </h3>
                
                {stats && (
                  <div className="space-y-4">
                    {Object.entries(stats).map(([key, value]) => (
                      key !== 'totalPoints' && key !== 'dailyStreak' && key !== 'weeklyProgress' && key !== 'monthlyTrend' && (
                        <div key={key} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-700 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className="font-semibold text-gray-800">{value}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${getProgressColor(value)}`}
                              style={{ width: `${value}%` }}
                            ></div>
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                )}
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Award className="w-5 h-5 text-yellow-500 mr-2" />
                      <span className="text-gray-700">Daily Streak</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-gray-800 mr-2">{stats?.dailyStreak || 0}</span>
                      <span className="text-gray-500">days</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activities */}
              <div className="adhd-card bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Activity className="w-6 h-6 mr-2 text-blue-500" />
                  Recent Activities
                </h3>
                
                <div className="space-y-4">
                  {activities.map(activity => (
                    <div key={activity.id} className="flex items-start p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 text-xl ${
                        activity.type === 'task' ? 'bg-green-100' :
                        activity.type === 'game' ? 'bg-blue-100' :
                        activity.type === 'mood' ? 'bg-purple-100' : 'bg-yellow-100'
                      }`}>
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{activity.description}</p>
                        <div className="flex items-center mt-1">
                          <Clock className="w-3 h-3 text-gray-400 mr-1" />
                          <span className="text-xs text-gray-500">{activity.time}</span>
                          <span className="mx-2 text-gray-300">•</span>
                          <span className="text-xs font-medium text-yellow-600">+{activity.points} points</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Important Notes */}
              <div className="adhd-card bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <AlertCircle className="w-6 h-6 mr-2 text-pink-500" />
                  Important Notes
                </h3>
                
                <div className="space-y-3">
                  <div className="p-3 bg-pink-50 rounded-lg border border-pink-100">
                    <p className="text-gray-700">{patient.notes}</p>
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="font-medium text-gray-700">Strengths</span>
                    </div>
                    <p className="text-sm text-gray-600">Excellent visual memory, creative problem-solving, enthusiastic learner</p>
                  </div>
                  
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                    <div className="flex items-center mb-2">
                      <Target className="w-4 h-4 text-amber-500 mr-2" />
                      <span className="font-medium text-gray-700">Focus Areas</span>
                    </div>
                    <p className="text-sm text-gray-600">Transition management, impulse control during group activities</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Treatment Plan Tab */}
        {activeTab === 'treatment' && treatmentPlan && (
          <div className="adhd-card bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Briefcase className="w-6 h-6 mr-2 text-purple-500" />
              Treatment Plan
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Goals */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-purple-600 flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Goals
                </h3>
                <ul className="space-y-3">
                  {treatmentPlan.goals.map((goal, index) => (
                    <li key={index} className="flex items-start p-3 bg-purple-50 rounded-lg">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="font-bold text-purple-600">{index + 1}</span>
                      </div>
                      <span className="text-gray-700">{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Strategies */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-blue-600 flex items-center">
                  <Brain className="w-5 h-5 mr-2" />
                  Strategies
                </h3>
                <ul className="space-y-3">
                  {treatmentPlan.strategies.map((strategy, index) => (
                    <li key={index} className="flex items-start p-3 bg-blue-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="font-bold text-blue-600">{index + 1}</span>
                      </div>
                      <span className="text-gray-700">{strategy}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Medications & Accommodations */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-green-600 flex items-center">
                    <Pill className="w-5 h-5 mr-2" />
                    Medications
                  </h3>
                  <div className="space-y-3">
                    {treatmentPlan.medications.map((med, index) => (
                      <div key={index} className="p-3 bg-green-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-bold text-gray-800">{med.name}</span>
                          <span className="text-sm font-medium text-green-600">{med.dosage}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="block">{med.frequency} • {med.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-amber-600 flex items-center">
                    <School className="w-5 h-5 mr-2" />
                    Accommodations
                  </h3>
                  <ul className="space-y-2">
                    {treatmentPlan.accommodations.map((accommodation, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-amber-500 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{accommodation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="adhd-card bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <FileText className="w-6 h-6 mr-2 text-purple-500" />
                  Clinical Notes & Observations
                </h2>
                
                <div className="space-y-6">
                  {patientNotes.map(note => (
                    <div key={note.id} className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span className="text-sm font-medium text-purple-600">{note.author}</span>
                          <span className="text-sm text-gray-500 mx-2">•</span>
                          <span className="text-sm text-gray-500">{formatDate(note.date)}</span>
                        </div>
                        {canEdit && (
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="p-1 text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <p className="text-gray-700">{note.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Add Note */}
              <div className="adhd-card bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Plus className="w-6 h-6 mr-2 text-green-500" />
                  Add New Note
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Note Content</label>
                    <textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      rows="4"
                      placeholder="Enter your observations..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Category</label>
                    <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option>General Observation</option>
                      <option>Behavior Note</option>
                      <option>Progress Update</option>
                      <option>Concern</option>
                      <option>Medication Update</option>
                    </select>
                  </div>
                  
                  <button
                    onClick={handleAddNote}
                    className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all"
                  >
                    <Plus className="inline w-4 h-4 mr-2" />
                    Add Note
                  </button>
                </div>
              </div>
              
              {/* Note Statistics */}
              <div className="adhd-card bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Notes Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-gray-700">Total Notes</span>
                    <span className="font-bold text-blue-600">{patientNotes.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-gray-700">This Month</span>
                    <span className="font-bold text-green-600">4</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-gray-700">By Parent</span>
                    <span className="font-bold text-purple-600">2</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                    <span className="text-gray-700">By Therapist</span>
                    <span className="font-bold text-amber-600">1</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="adhd-card bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Download className="w-6 h-6 mr-2 text-purple-500" />
              Documents & Reports
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Diagnosis Report', date: '2023-05-15', type: 'PDF', size: '2.4 MB' },
                { name: 'Treatment Plan', date: '2023-06-10', type: 'PDF', size: '1.8 MB' },
                { name: 'Progress Report Q4', date: '2023-12-20', type: 'PDF', size: '3.2 MB' },
                { name: 'School IEP', date: '2023-09-05', type: 'DOC', size: '1.5 MB' },
                { name: 'Medication Log', date: '2024-01-10', type: 'XLS', size: '0.8 MB' },
                { name: 'Therapy Notes', date: '2024-01-15', type: 'PDF', size: '1.2 MB' },
              ].map((doc, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded">
                      {doc.type}
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-800 mb-1">{doc.name}</h4>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{formatDate(doc.date)}</span>
                    <span>{doc.size}</span>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <button className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
                      <Eye className="inline w-3 h-3 mr-1" />
                      View
                    </button>
                    <button className="flex-1 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 text-sm">
                      <Download className="inline w-3 h-3 mr-1" />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button className="adhd-button w-full py-3 border-2 border-dashed border-gray-300 text-gray-500 hover:border-purple-400 hover:text-purple-600 rounded-xl transition-all">
                <Plus className="inline w-4 h-4 mr-2" />
                Upload New Document
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Patient;