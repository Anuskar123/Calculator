/**
 * Team Members Data
 * Update this file with your actual team member information
 */

const TEAM_MEMBERS = [
    {
        name: 'Ayush Karanjit',
        role: 'Team Leader & Project Manager',
        studentId: '24812931',
        email: 'aayush.2024105@nami.edu.np',
        graduation: '2024',
        responsibilities: [
            'Project planning and coordination',
            'Team leadership and management',
            'Code review and quality assurance',
            'Client communication and presentation'
        ],
        skills: ['Leadership', 'Project Management', 'Full-stack Development', 'Communication']
    },
    {
        name: 'Anuskar Sigdel',
        role: 'Frontend Developer & UI/UX Designer',
        studentId: '24812606',
        email: 'anuskar.2024106@nami.edu.np',
        graduation: '2024',
        responsibilities: [
            'User interface design and development',
            'Frontend architecture and implementation',
            'Responsive design and user experience',
            'Cross-browser compatibility testing'
        ],
        skills: ['HTML/CSS', 'JavaScript', 'UI/UX Design', 'Responsive Design']
    },
    {
        name: 'Utsab Thami Magar',
        role: 'Backend Developer & System Architect',
        studentId: '24814107',
        email: 'utsab.2024107@nami.edu.np',
        graduation: '2024',
        responsibilities: [
            'Backend system architecture',
            'Database design and optimization',
            'API development and integration',
            'Server-side logic implementation'
        ],
        skills: ['Backend Development', 'Database Management', 'API Design', 'System Architecture']
    },
    {
        name: 'Sandhaya Kumari',
        role: 'Quality Assurance & Testing Specialist',
        studentId: '24812945',
        email: 'sandhaya.2024108@nami.edu.np',
        graduation: '2024',
        responsibilities: [
            'Software testing and quality assurance',
            'Bug tracking and reporting',
            'Test case development and execution',
            'Performance and usability testing'
        ],
        skills: ['Software Testing', 'Quality Assurance', 'Bug Tracking', 'Test Documentation']
    },
    {
        name: 'Jesina Bastola',
        role: 'Documentation Lead & Research Analyst',
        studentId: '24812923',
        email: 'jesina.2024109@nami.edu.np',
        graduation: '2024',
        responsibilities: [
            'Technical documentation and user guides',
            'Research and analysis',
            'Content management and writing',
            'Academic report preparation'
        ],
        skills: ['Technical Writing', 'Research', 'Documentation', 'Content Management']
    }
];

// Project Information
const PROJECT_INFO = {
    title: 'DokoNepal - Groceries & Wireframes Management System',
    description: 'A comprehensive web application for managing grocery inventory and creating wireframes for software projects.',
    course: 'CSY2088 - Computer Science Level 5',
    institution: 'NAMI College',
    location: 'Kathmandu, Nepal',
    academicYear: '2024-2025',
    semester: 'Spring',
    submissionDate: '2025-08-15',
    version: '1.0.0',
    teamLeader: 'Ayush Karanjit',
    teamSize: 5,
    
    objectives: [
        'Develop a functional web application with CRUD operations',
        'Implement responsive design for multiple device types',
        'Create an intuitive user interface for grocery management',
        'Build a wireframe creation and management tool',
        'Integrate real-time analytics and reporting features',
        'Ensure data persistence using local storage',
        'Implement user authentication and session management',
        'Follow software engineering best practices',
        'Create comprehensive documentation',
        'Demonstrate teamwork and project management skills'
    ],
    
    technologies: [
        { name: 'HTML5', description: 'Semantic markup and structure' },
        { name: 'CSS3', description: 'Modern styling with flexbox and grid' },
        { name: 'JavaScript (ES6+)', description: 'Interactive functionality and DOM manipulation' },
        { name: 'Chart.js', description: 'Data visualization and analytics charts' },
        { name: 'Font Awesome', description: 'Icons and visual elements' },
        { name: 'Google Fonts', description: 'Typography and font styling' },
        { name: 'Local Storage API', description: 'Client-side data persistence' },
        { name: 'Responsive Design', description: 'Mobile-first responsive layouts' }
    ],
    
    features: [
        'Grocery inventory management with full CRUD operations',
        'Advanced search and filtering capabilities',
        'Wireframe creation and project management tools',
        'Real-time analytics dashboard with interactive charts',
        'User authentication system',
        'Data export functionality',
        'Activity logging and tracking',
        'Responsive design for all devices',
        'Modern and intuitive user interface',
        'Data persistence across sessions'
    ]
};

// Academic Requirements Mapping
const ACADEMIC_REQUIREMENTS = {
    'Software Engineering Principles': [
        'Requirements analysis and specification',
        'System design and architecture',
        'Implementation following coding standards',
        'Testing and quality assurance',
        'Documentation and user manuals'
    ],
    'Web Development Skills': [
        'HTML5 semantic markup',
        'CSS3 advanced styling and animations',
        'JavaScript ES6+ programming',
        'Responsive web design',
        'Cross-browser compatibility'
    ],
    'Database Management': [
        'Data modeling and structure design',
        'CRUD operations implementation',
        'Data validation and integrity',
        'Query optimization (simulated with filtering)',
        'Data export and backup features'
    ],
    'Project Management': [
        'Team collaboration and communication',
        'Version control with Git',
        'Task planning and time management',
        'Regular progress tracking',
        'Documentation and reporting'
    ],
    'User Experience Design': [
        'User interface design principles',
        'Usability testing and feedback',
        'Accessibility considerations',
        'Interactive prototyping',
        'User journey mapping'
    ]
};

// Export functions for use in other modules
function getProjectInfo() {
    return PROJECT_INFO;
}

function getTeamMembersData() {
    return TEAM_MEMBERS;
}

function getAcademicRequirements() {
    return ACADEMIC_REQUIREMENTS;
}
