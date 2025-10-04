export const statsData = {
  totalProjects: 24,
  activeTasks: 47,
  completedTasks: 156,
  teamMembers: 12,
};

export const projectProgressData = [
  { month: 'Jan', progress: 30 },
  { month: 'Feb', progress: 45 },
  { month: 'Mar', progress: 60 },
  { month: 'Apr', progress: 55 },
  { month: 'May', progress: 75 },
  { month: 'Jun', progress: 85 },
];

export const taskCompletionData = [
  { name: 'Completed', value: 156 },
  { name: 'In Progress', value: 47 },
  { name: 'Pending', value: 23 },
];

export const projects = [
  {
    id: 1,
    name: 'Website Redesign',
    deadline: '2025-11-15',
    status: 'In Progress',
    members: ['John Doe', 'Jane Smith'],
    progress: 65,
  },
  {
    id: 2,
    name: 'Mobile App Development',
    deadline: '2025-12-30',
    status: 'In Progress',
    members: ['Mike Johnson', 'Sarah Williams'],
    progress: 40,
  },
  {
    id: 3,
    name: 'Marketing Campaign',
    deadline: '2025-10-20',
    status: 'Completed',
    members: ['Emily Brown', 'David Lee'],
    progress: 100,
  },
  {
    id: 4,
    name: 'Database Migration',
    deadline: '2025-11-30',
    status: 'Pending',
    members: ['Alex Turner', 'Lisa Anderson'],
    progress: 15,
  },
];

export const tasks = [
  {
    id: 1,
    title: 'Design homepage mockup',
    priority: 'High',
    status: 'In Progress',
    assignedTo: 'John Doe',
    deadline: '2025-10-18',
  },
  {
    id: 2,
    title: 'Implement authentication',
    priority: 'High',
    status: 'In Progress',
    assignedTo: 'Mike Johnson',
    deadline: '2025-10-20',
  },
  {
    id: 3,
    title: 'Write API documentation',
    priority: 'Medium',
    status: 'Pending',
    assignedTo: 'Sarah Williams',
    deadline: '2025-10-25',
  },
  {
    id: 4,
    title: 'User testing',
    priority: 'Low',
    status: 'Pending',
    assignedTo: 'Emily Brown',
    deadline: '2025-11-01',
  },
  {
    id: 5,
    title: 'Bug fixes',
    priority: 'High',
    status: 'Completed',
    assignedTo: 'David Lee',
    deadline: '2025-10-10',
  },
];

export const teamMembers = [
  {
    id: 1,
    name: 'John Doe',
    role: 'Frontend Developer',
    email: 'john.doe@workstream.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    status: 'active',
  },
  {
    id: 2,
    name: 'Jane Smith',
    role: 'UI/UX Designer',
    email: 'jane.smith@workstream.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    status: 'active',
  },
  {
    id: 3,
    name: 'Mike Johnson',
    role: 'Backend Developer',
    email: 'mike.johnson@workstream.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    status: 'active',
  },
  {
    id: 4,
    name: 'Sarah Williams',
    role: 'Project Manager',
    email: 'sarah.williams@workstream.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    status: 'active',
  },
  {
    id: 5,
    name: 'Emily Brown',
    role: 'QA Engineer',
    email: 'emily.brown@workstream.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    status: 'active',
  },
  {
    id: 6,
    name: 'David Lee',
    role: 'DevOps Engineer',
    email: 'david.lee@workstream.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    status: 'away',
  },
];

export const attendanceRecords = [
  {
    id: 1,
    name: 'John Doe',
    date: '2025-10-15',
    checkIn: '09:00 AM',
    checkOut: '05:30 PM',
    status: 'Present',
  },
  {
    id: 2,
    name: 'Jane Smith',
    date: '2025-10-15',
    checkIn: '09:15 AM',
    checkOut: '05:45 PM',
    status: 'Present',
  },
  {
    id: 3,
    name: 'Mike Johnson',
    date: '2025-10-15',
    checkIn: '09:05 AM',
    checkOut: '05:20 PM',
    status: 'Present',
  },
  {
    id: 4,
    name: 'Sarah Williams',
    date: '2025-10-15',
    checkIn: '-',
    checkOut: '-',
    status: 'Absent',
  },
  {
    id: 5,
    name: 'Emily Brown',
    date: '2025-10-15',
    checkIn: '10:00 AM',
    checkOut: '04:00 PM',
    status: 'Half Day',
  },
];

export const workloadData = [
  { name: 'Design', value: 30 },
  { name: 'Development', value: 45 },
  { name: 'Testing', value: 15 },
  { name: 'Documentation', value: 10 },
];

export const teamPerformanceData = [
  { name: 'John Doe', tasks: 45 },
  { name: 'Jane Smith', tasks: 38 },
  { name: 'Mike Johnson', tasks: 52 },
  { name: 'Sarah Williams', tasks: 41 },
  { name: 'Emily Brown', tasks: 35 },
  { name: 'David Lee', tasks: 48 },
];
