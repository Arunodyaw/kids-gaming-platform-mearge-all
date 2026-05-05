// src/components/Schedule.jsx - VIEW-ONLY FOR PARENT & CHILD
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../App';
import {
  Calendar as CalendarIcon, Plus, Clock, MapPin,
  Users, Bell, Video, Phone, Edit2, Trash2,
  ChevronLeft, ChevronRight, Filter, Search,
  CheckCircle, XCircle, AlertCircle, FileText,
  Download, Share2, RefreshCw, MoreVertical,
  Eye, Lock, UserCheck
} from 'lucide-react';

// Mock schedule service
const ScheduleService = {
  getSchedule: async (date, userRole) => {
    const events = [
      {
        id: 1,
        type: 'therapy',
        title: 'Behavioral Therapy Session',
        description: 'Weekly progress review and focus exercises',
        date: new Date().toISOString().split('T')[0],
        startTime: '15:00',
        endTime: '16:00',
        duration: 60,
        participants: ['Jamie', 'Dr. Sarah Johnson'],
        location: 'Therapy Room 3',
        status: 'confirmed',
        reminders: ['1 hour before'],
        notes: 'Bring progress journal',
        color: 'purple',
        createdBy: 'therapist',
        editable: false // Only therapist can edit
      },
      {
        id: 2,
        type: 'school',
        title: 'Math Tutoring',
        description: 'One-on-one math support',
        date: new Date().toISOString().split('T')[0],
        startTime: '16:30',
        endTime: '17:30',
        duration: 60,
        participants: ['Jamie', 'Ms. Anderson'],
        location: 'Sunshine Elementary',
        status: 'confirmed',
        reminders: ['30 minutes before'],
        notes: 'Focus on multiplication',
        color: 'green',
        createdBy: 'therapist',
        editable: false
      },
      {
        id: 3,
        type: 'routine',
        title: 'Homework Time',
        description: 'Complete math worksheet and reading',
        date: new Date().toISOString().split('T')[0],
        startTime: '17:00',
        endTime: '17:45',
        duration: 45,
        participants: ['Jamie'],
        location: 'Home',
        status: 'scheduled',
        reminders: ['15 minutes before'],
        notes: 'Use focus timer',
        color: 'blue',
        createdBy: 'therapist',
        editable: false
      },
      {
        id: 4,
        type: 'therapy',
        title: 'Parent-Therapist Meeting',
        description: 'Monthly review of treatment plan',
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        startTime: '10:00',
        endTime: '11:00',
        duration: 60,
        participants: ['Parent', 'Dr. Sarah Johnson'],
        location: 'Conference Room',
        status: 'confirmed',
        reminders: ['1 day before', '1 hour before'],
        notes: 'Review medication effectiveness',
        color: 'indigo',
        createdBy: 'therapist',
        editable: false
      },
    ];

    return events.filter(event => event.date === date);
  },

  createEvent: async (eventData, userRole) => {
    console.log('Creating event as:', userRole, eventData);
    return { 
      success: true, 
      id: Date.now(), 
      ...eventData,
      createdBy: userRole,
      editable: false // Only therapist can edit
    };
  },

  updateEvent: async (eventId, updates, userRole) => {
    console.log('Updating event as:', userRole, updates);
    return { success: true, updatedBy: userRole };
  },

  deleteEvent: async (eventId, userRole) => {
    console.log('Deleting event as:', userRole);
    return { success: true, deletedBy: userRole };
  }
};

const Schedule = () => {
  const { userRole } = useContext(AuthContext);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [viewMode, setViewMode] = useState('day');
  const [filterType, setFilterType] = useState('all');

  // Load schedule data
  useEffect(() => {
    loadScheduleData();
  }, [currentDate, userRole]);

  const loadScheduleData = async () => {
    setIsLoading(true);
    try {
      const dateStr = currentDate.toISOString().split('T')[0];
      const scheduleData = await ScheduleService.getSchedule(dateStr, userRole);
      setEvents(scheduleData);
    } catch (error) {
      console.error('Error loading schedule:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Navigation functions
  const goToPreviousDay = () => {
    setCurrentDate(prev => new Date(prev.setDate(prev.getDate() - 1)));
  };

  const goToNextDay = () => {
    setCurrentDate(prev => new Date(prev.setDate(prev.getDate() + 1)));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Format date
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get event color
  const getEventColor = (color) => {
    switch(color) {
      case 'purple': return 'bg-purple-500';
      case 'blue': return 'bg-blue-500';
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-500';
      case 'red': return 'bg-red-500';
      case 'indigo': return 'bg-indigo-500';
      case 'orange': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  // Get event type icon
  const getEventTypeIcon = (type) => {
    switch(type) {
      case 'therapy': return '🧠';
      case 'school': return '🏫';
      case 'routine': return '🔄';
      case 'appointment': return '🏥';
      default: return '📅';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Role Badge */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                  Schedule & Calendar
                </h1>
                <span className={`ml-3 px-3 py-1 rounded-full text-sm font-medium ${
                  userRole === 'therapist' 
                    ? 'bg-purple-100 text-purple-800 border border-purple-300' 
                    : userRole === 'parent'
                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                    : 'bg-green-100 text-green-800 border border-green-300'
                }`}>
                  {userRole === 'therapist' ? 'Therapist View' : 
                   userRole === 'parent' ? 'Parent View' : 'Child View'}
                </span>
              </div>
              <p className="text-gray-600">
                {userRole === 'therapist' 
                  ? 'Manage therapy schedules and appointments'
                  : userRole === 'parent'
                  ? 'View your child\'s schedule and daily routines'
                  : 'See your daily activities and appointments'}
              </p>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              {/* Only therapist can create new events */}
              {userRole === 'therapist' && (
                <button
                  onClick={() => setShowEventModal(true)}
                  className="adhd-button px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Event
                </button>
              )}
              
              <button className="adhd-button px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Navigation */}
        <div className="mb-8 adhd-card bg-white p-6 rounded-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <button
                onClick={goToPreviousDay}
                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <button
                onClick={goToToday}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
              >
                Today
              </button>
              
              <button
                onClick={goToNextDay}
                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              
              <h2 className="text-xl font-bold text-gray-800 ml-4">
                {formatDate(currentDate)}
              </h2>
            </div>
          </div>

          {/* Permission Notice */}
          {userRole !== 'therapist' && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-center">
                <Eye className="w-5 h-5 text-blue-500 mr-3" />
                <div>
                  <p className="font-medium text-blue-800">
                    View-Only Access
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    You can view the schedule but cannot make changes. Contact your therapist for scheduling.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Event Type Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {['all', 'therapy', 'school', 'routine'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                  filterType === type
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type === 'all' ? 'All Events' : type}
              </button>
            ))}
          </div>
        </div>

        {/* Schedule Display */}
        <div className="adhd-card bg-white rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Today's Schedule</h3>
          
          {events.length === 0 ? (
            <div className="text-center py-12">
              <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-bold text-gray-800 mb-2">No Events Scheduled</h4>
              <p className="text-gray-600 mb-6">
                {userRole === 'therapist' 
                  ? 'Add therapy sessions and appointments'
                  : 'Therapist will schedule activities soon'}
              </p>
              {userRole === 'therapist' && (
                <button
                  onClick={() => setShowEventModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600"
                >
                  Schedule First Event
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {events
                .filter(event => filterType === 'all' || event.type === filterType)
                .map((event) => (
                  <div key={event.id} className="border border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-start">
                      {/* Event Icon & Time */}
                      <div className="flex items-start mb-4 md:mb-0 md:mr-6">
                        <div className={`w-12 h-12 ${getEventColor(event.color)} rounded-lg flex items-center justify-center text-white text-xl mr-4`}>
                          {getEventTypeIcon(event.type)}
                        </div>
                        <div>
                          <div className="text-lg font-bold text-gray-800">{event.startTime} - {event.endTime}</div>
                          <div className="text-sm text-gray-500">{event.duration} minutes</div>
                        </div>
                      </div>
                      
                      {/* Event Details */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start justify-between mb-2">
                          <div>
                            <h4 className="text-xl font-bold text-gray-800">{event.title}</h4>
                            <p className="text-gray-600 mt-1">{event.description}</p>
                          </div>
                          
                          {/* Edit/Delete Buttons - Only for therapist */}
                          {userRole === 'therapist' && (
                            <div className="flex space-x-2 mt-3 md:mt-0">
                              <button
                                onClick={() => setSelectedEvent(event)}
                                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm('Are you sure you want to delete this event?')) {
                                    // Handle delete event
                                  }
                                }}
                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                          
                          {/* View-only indicator for parent/child */}
                          {userRole !== 'therapist' && (
                            <div className="mt-3 md:mt-0 flex items-center">
                              <Eye className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-500">View Only</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Event Metadata */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                          <div className="flex items-center text-gray-600">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>{event.location}</span>
                          </div>
                          
                          <div className="flex items-center text-gray-600">
                            <Users className="w-4 h-4 mr-2" />
                            <span>{event.participants.join(', ')}</span>
                          </div>
                          
                          <div className="flex items-center text-gray-600">
                            <Lock className="w-4 h-4 mr-2" />
                            <span className="text-sm">
                              Therapist managed
                            </span>
                          </div>
                        </div>
                        
                        {/* Notes */}
                        {event.notes && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">{event.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="adhd-card bg-white p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {events.filter(e => e.type === 'therapy').length}
            </div>
            <div className="text-sm text-gray-600">Therapy Sessions</div>
          </div>
          
          <div className="adhd-card bg-white p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {events.filter(e => e.status === 'confirmed').length}
            </div>
            <div className="text-sm text-gray-600">Confirmed Events</div>
          </div>
          
          <div className="adhd-card bg-white p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {events.filter(e => e.type === 'routine').length}
            </div>
            <div className="text-sm text-gray-600">Daily Routines</div>
          </div>
        </div>
      </div>

      {/* Create Event Modal - Only for therapist */}
      {showEventModal && userRole === 'therapist' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Create New Event
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Title</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., Therapy Session"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Description</label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="2"
                  placeholder="Describe the event"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Type</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="therapy">Therapy Session</option>
                  <option value="school">School Activity</option>
                  <option value="routine">Daily Routine</option>
                  <option value="appointment">Appointment</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Date</label>
                  <input
                    type="date"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Time</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="time"
                      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <input
                      type="time"
                      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowEventModal(false)}
                className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700"
              >
                Create Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;