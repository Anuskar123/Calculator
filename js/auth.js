/**
 * Authentication and User Management
 */

// Login Handler
function handleLoginSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const username = formData.get('username');
    const password = formData.get('password');
    const rememberMe = formData.get('remember-me');
    
    // Simple authentication (in production, this would be server-side)
    if (authenticateUser(username, password)) {
        AppState.isLoggedIn = true;
        AppState.currentUser = username;
        AppState.userRole = getUserRole(username);
        
        // Save login state
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', username);
        localStorage.setItem('userRole', AppState.userRole);
        
        if (rememberMe) {
            localStorage.setItem('rememberUser', username);
        }
        
        // Add admin class to body if admin user
        if (username === 'admin') {
            document.body.classList.add('admin-logged-in');
        }
        
        showTeamLoginSuccess(username);
        addActivityLog('login', `User ${username} logged in`);
        
        // Redirect to home
        showSection('home');
        updateNavigation();
        
    } else {
        showNotification('Invalid username or password', 'error');
    }
}

function authenticateUser(username, password) {
    // Demo credentials including team members
    const validCredentials = [
        { username: 'admin', password: 'admin123' },
        { username: 'ayush', password: 'leader123' },
        { username: 'anuskar', password: 'frontend123' },
        { username: 'utsab', password: 'backend123' },
        { username: 'sandhaya', password: 'qa123' },
        { username: 'jesina', password: 'docs123' },
        { username: 'demo', password: 'demo123' }
    ];
    
    return validCredentials.some(cred => 
        cred.username === username && cred.password === password
    );
}

function getUserRole(username) {
    const adminUsers = ['admin'];
    return adminUsers.includes(username) ? 'admin' : 'user';
}

function logout() {
    AppState.isLoggedIn = false;
    AppState.currentUser = null;
    AppState.userRole = null;
    
    // Remove admin class from body
    document.body.classList.remove('admin-logged-in');
    
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    
    showNotification('Logged out successfully', 'info');
    addActivityLog('logout', 'User logged out');
    
    showSection('login');
    updateNavigation();
}

function updateNavigation() {
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        if (AppState.isLoggedIn) {
            const adminBadge = AppState.currentUser === 'admin' ? '<span class="admin-badge">Admin</span>' : '';
            loginBtn.innerHTML = `<i class="fas fa-user"></i> ${AppState.currentUser}${adminBadge}`;
            loginBtn.onclick = showUserMenu;
        } else {
            loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
            loginBtn.onclick = () => showSection('login');
        }
    }
}

function showUserMenu() {
    // Simple user menu (could be enhanced with dropdown)
    const userActions = confirm(`Logged in as ${AppState.currentUser}\n\nClick OK to logout, Cancel to stay`);
    if (userActions) {
        logout();
    }
}

// Team Members Data and Rendering
function renderTeamMembers() {
    const teamContainer = document.getElementById('team-members');
    if (!teamContainer) return;
    
    const teamMembers = getTeamMembers();
    
    teamContainer.innerHTML = teamMembers.map(member => `
        <div class="team-member">
            <div class="team-avatar">
                ${member.name.charAt(0)}
            </div>
            <div class="team-name">${member.name}</div>
            <div class="team-role">${member.role}</div>
            <div class="team-id">${member.studentId}</div>
        </div>
    `).join('');
}

function getTeamMembers() {
    // Updated with actual team member information
    return [
        {
            name: 'Ayush Karanjit',
            role: 'Team Leader & Project Manager',
            studentId: '24812931',
            email: 'aayush.2024105@nami.edu.np'
        },
        {
            name: 'Anuskar Sigdel',
            role: 'Frontend Developer & UI/UX Designer',
            studentId: '24812606',
            email: 'anuskar.2024106@nami.edu.np'
        },
        {
            name: 'Utsab Thami Magar',
            role: 'Backend Developer & System Architect',
            studentId: '24814107',
            email: 'utsab.2024107@nami.edu.np'
        },
        {
            name: 'Sandhaya Kumari',
            role: 'Quality Assurance & Testing Specialist',
            studentId: '24812945',
            email: 'sandhaya.2024108@nami.edu.np'
        },
        {
            name: 'Jesina Bastola',
            role: 'Documentation Lead & Research Analyst',
            studentId: '24812923',
            email: 'jesina.2024109@nami.edu.np'
        }
    ];
}

// Team-specific welcome messages
function getTeamWelcomeMessage(username) {
    const teamWelcomes = {
        'ayush': '🎯 Welcome back, Team Leader! Ready to coordinate the project?',
        'anuskar': '🎨 Welcome, Frontend Developer! Time to create amazing UIs!',
        'utsab': '⚙️ Welcome, Backend Developer! Let\'s build robust systems!',
        'sandhaya': '🔍 Welcome, QA Specialist! Ready to ensure quality?',
        'jesina': '📝 Welcome, Documentation Lead! Let\'s create great docs!',
        'admin': '👑 Welcome, Administrator! Full system access granted.',
        'demo': '👋 Welcome to the Demo! Explore all features freely.'
    };
    
    return teamWelcomes[username] || `Welcome to DokoNepal, ${username}!`;
}

// Enhanced login success message
function showTeamLoginSuccess(username) {
    const message = getTeamWelcomeMessage(username);
    showNotification(message, 'success');
    
    // Update hero section with personalized content
    updatePersonalizedHero(username);
}

// Personalized hero content
function updatePersonalizedHero(username) {
    const heroLabel = document.querySelector('.hero-label');
    const roleMessages = {
        'ayush': 'Team Leader Dashboard',
        'anuskar': 'Frontend Developer Workspace',
        'utsab': 'Backend Developer Console',
        'sandhaya': 'Quality Assurance Center',
        'jesina': 'Documentation Hub',
        'admin': 'Administrator Panel',
        'demo': 'Demo Environment'
    };
    
    if (heroLabel && roleMessages[username]) {
        heroLabel.textContent = roleMessages[username];
        heroLabel.style.background = 'rgba(255, 255, 255, 0.25)';
        heroLabel.style.animation = 'pulse 2s ease-in-out';
    }
}

// User Preferences (could be expanded)
function saveUserPreferences(preferences) {
    localStorage.setItem(`preferences_${AppState.currentUser}`, JSON.stringify(preferences));
}

function loadUserPreferences() {
    const saved = localStorage.getItem(`preferences_${AppState.currentUser}`);
    return saved ? JSON.parse(saved) : getDefaultPreferences();
}

function getDefaultPreferences() {
    return {
        theme: 'light',
        notifications: true,
        autoSave: true,
        defaultCategory: '',
        defaultUnit: 'kg'
    };
}

// Session Management
function checkSession() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const currentUser = localStorage.getItem('currentUser');
    
    if (isLoggedIn && currentUser) {
        AppState.isLoggedIn = true;
        AppState.currentUser = currentUser;
        updateNavigation();
        return true;
    }
    
    return false;
}

function extendSession() {
    if (AppState.isLoggedIn) {
        localStorage.setItem('lastActivity', new Date().toISOString());
    }
}

// Auto-logout after inactivity (30 minutes)
let inactivityTimer;

function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    
    if (AppState.isLoggedIn) {
        inactivityTimer = setTimeout(() => {
            showNotification('Session expired due to inactivity', 'warning');
            logout();
        }, 30 * 60 * 1000); // 30 minutes
    }
}

// Track user activity
document.addEventListener('click', resetInactivityTimer);
document.addEventListener('keypress', resetInactivityTimer);
document.addEventListener('scroll', resetInactivityTimer);

// Initialize session check
document.addEventListener('DOMContentLoaded', function() {
    checkSession();
    resetInactivityTimer();
});
