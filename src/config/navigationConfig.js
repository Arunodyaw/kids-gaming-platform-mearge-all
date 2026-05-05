// src/config/navigationConfig.js
export const navigationConfig = {
  parent: {
    main: [
      { path: '/dashboard', label: 'Dashboard', icon: 'Home' },
      {path: '/results-dashboard', label: 'Results Dashboard', icon: 'BarChart3' },
      { path: '/patient', label: 'Child Profile', icon: 'User' },
      { path: '/activities', label: 'Activities', icon: 'Activity' },
      { path: '/progress', label: 'Progress', icon: 'TrendingUp' },
      { path: '/schedule', label: 'Schedule', icon: 'Calendar' },
       { path: '/games', label: 'Games', icon: 'Gamepad2' },
      { path: '/children', label: 'Children', icon: 'Users' },
      { path: '/reports', label: 'Reports', icon: 'FileText' },
      { path: '/messages', label: 'Messages', icon: 'MessageSquare' },
    ],
    quickActions: [
      { action: 'addTask', label: 'Add Task', icon: 'Plus' },
      { action: 'viewProgress', label: 'View Progress', icon: 'TrendingUp' },
      { action: 'scheduleAppointment', label: 'Schedule', icon: 'Calendar' },
       { action: 'playGame', label: 'Play Game', icon: 'Gamepad2' },
      { action: 'sendMessage', label: 'Message', icon: 'MessageSquare' },
    ]
  },
  
  therapist: {
    main: [
      { path: '/dashboard', label: 'Dashboard', icon: 'Home' },
      {path: '/admin-dashboard', label: 'Admin Dashboard', icon: 'Home' },
      {path: '/results-dashboard', label: 'Results Dashboard', icon: 'BarChart3' },
      { path: '/patient', label: 'Patient Profile', icon: 'User' },
      { path: '/activities', label: 'Activities', icon: 'Activity' },
      { path: '/progress', label: 'Progress', icon: 'TrendingUp' },
      { path: '/schedule', label: 'Schedule', icon: 'Calendar' },
      { path: '/patients', label: 'Patients', icon: 'Users' },
      { path: '/reports', label: 'Reports', icon: 'FileText' },
      { path: '/messages', label: 'Messages', icon: 'MessageSquare' },
    ],
    quickActions: [
      { action: 'addSession', label: 'Add Session', icon: 'Plus' },
      { action: 'viewProgress', label: 'View Progress', icon: 'TrendingUp' },
      { action: 'scheduleAppointment', label: 'Schedule', icon: 'Calendar' },
      { action: 'writeNote', label: 'Write Note', icon: 'FileText' },
    ]
  },
  
  child: {
    main: [
      { path: '/dashboard', label: 'Dashboard', icon: 'Home' },
      
      { path: '/games', label: 'Games', icon: 'Gamepad2' },
      { path: '/rewards', label: 'Rewards', icon: 'Award' },
      { path: '/stories', label: 'Stories', icon: 'BookOpen' },
    ],
    quickActions: [
      { action: 'startFocus', label: 'Focus Timer', icon: 'PlayCircle' },
      { action: 'playGame', label: 'Play Game', icon: 'Gamepad2' },
      { action: 'viewRewards', label: 'Rewards', icon: 'Award' },
      { action: 'checkMood', label: 'Mood Check', icon: 'Heart' },
    ]
  }
};