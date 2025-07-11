/**
 * DokoNepal - Main Application JavaScript
 * Groceries & Wireframes Management System
 */

// Application State
const AppState = {
    currentSection: 'home',
    groceries: JSON.parse(localStorage.getItem('groceries')) || [],
    wireframes: JSON.parse(localStorage.getItem('wireframes')) || [],
    activityLog: JSON.parse(localStorage.getItem('activityLog')) || [],
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
    currentUser: localStorage.getItem('currentUser') || null,
    userRole: localStorage.getItem('userRole') || null
};

// Application Configuration
const AppConfig = {
    version: '1.0.0',
    appName: 'DokoNepal',
    storageKeys: {
        groceries: 'groceries',
        wireframes: 'wireframes',
        activityLog: 'activityLog',
        isLoggedIn: 'isLoggedIn',
        currentUser: 'currentUser'
    }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    console.log(`${AppConfig.appName} v${AppConfig.version} - Initializing Professional Prototype...`);
    
    // Check for admin login state
    if (AppState.isLoggedIn && AppState.currentUser === 'admin') {
        document.body.classList.add('admin-logged-in');
    }
    
    // Load sample data if empty
    if (AppState.groceries.length === 0) {
        loadSampleGroceries();
    }
    
    if (AppState.wireframes.length === 0) {
        loadSampleWireframes();
    }
    
    if (AppState.activityLog.length === 0) {
        loadSampleActivity();
    }
    
    // Initialize UI components
    initializeNavigation();
    initializeForms();
    initializeFilters();
    initializeSearch();
    initializeAnimations();
    
    // Render initial content
    renderGroceries();
    renderWireframes();
    renderTeamMembers();
    updateAnalytics();
    updateHeroStats();
    renderActivityLog();
    
    // Show default section
    showSection('home');
    
    // Initialize hero section
    initializeHeroSection();
    initializeScrollEffects();
    
    // Start real-time updates
    setInterval(() => {
        updateHeroStats();
        updateAnalytics();
    }, 10000); // Update every 10 seconds
    
    console.log(`${AppConfig.appName} Professional Prototype initialized successfully!`);
    showNotification('DokoNepal Professional Prototype Loaded!', 'success', 3000);
}

// Sample Data Loaders
function loadSampleGroceries() {
    const sampleGroceries = [
        {
            id: generateId(),
            name: 'Organic Basmati Rice',
            category: 'Grains',
            price: 850,
            quantity: 25,
            unit: 'kg',
            supplier: 'Nepal Organic Foods',
            description: 'Premium quality organic basmati rice from the Himalayan region',
            image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop',
            dateAdded: new Date().toISOString()
        },
        {
            id: generateId(),
            name: 'Fresh Buffalo Milk',
            category: 'Dairy',
            price: 80,
            quantity: 50,
            unit: 'ltr',
            supplier: 'Kathmandu Dairy',
            description: 'Fresh buffalo milk delivered daily from local farms',
            image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&h=200&fit=crop',
            dateAdded: new Date().toISOString()
        },
        {
            id: generateId(),
            name: 'Himalayan Apples',
            category: 'Fruits',
            price: 320,
            quantity: 15,
            unit: 'kg',
            supplier: 'Mustang Apple Farm',
            description: 'Sweet and crispy apples from the Himalayan region',
            image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=200&fit=crop',
            dateAdded: new Date().toISOString()
        },
        {
            id: generateId(),
            name: 'Fresh Spinach',
            category: 'Vegetables',
            price: 45,
            quantity: 10,
            unit: 'kg',
            supplier: 'Local Vegetable Market',
            description: 'Fresh green spinach rich in iron and vitamins',
            image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&h=200&fit=crop',
            dateAdded: new Date().toISOString()
        },
        {
            id: generateId(),
            name: 'Himalayan Salt',
            category: 'Spices',
            price: 120,
            quantity: 20,
            unit: 'kg',
            supplier: 'Salt Trading Company',
            description: 'Pure pink Himalayan salt with natural minerals',
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
            dateAdded: new Date().toISOString()
        },
        {
            id: generateId(),
            name: 'Local Honey',
            category: 'Others',
            price: 650,
            quantity: 12,
            unit: 'kg',
            supplier: 'Himalayan Honey Co.',
            description: 'Pure wild honey from mountain regions',
            image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&h=200&fit=crop',
            dateAdded: new Date().toISOString()
        },
        {
            id: generateId(),
            name: 'Organic Tomatoes',
            category: 'Vegetables',
            price: 90,
            quantity: 8,
            unit: 'kg',
            supplier: 'Organic Valley Farm',
            description: 'Fresh organic tomatoes grown without pesticides',
            image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&h=200&fit=crop',
            dateAdded: new Date().toISOString()
        },
        {
            id: generateId(),
            name: 'Fresh Chicken',
            category: 'Meat',
            price: 450,
            quantity: 5,
            unit: 'kg',
            supplier: 'Local Poultry Farm',
            description: 'Fresh free-range chicken meat',
            image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=300&h=200&fit=crop',
            dateAdded: new Date().toISOString()
        }
    ];
    
    AppState.groceries = sampleGroceries;
    saveToStorage('groceries', AppState.groceries);
}

function loadSampleWireframes() {
    const sampleWireframes = [
        {
            id: generateId(),
            projectName: 'E-commerce Mobile App',
            templateType: 'Mobile App',
            pages: 8,
            complexity: 'Complex',
            priority: 'High',
            deadline: '2025-08-15',
            features: 'User authentication, product catalog, shopping cart, payment integration, order tracking',
            dateCreated: new Date().toISOString()
        },
        {
            id: generateId(),
            projectName: 'Restaurant Dashboard',
            templateType: 'Dashboard',
            pages: 5,
            complexity: 'Medium',
            priority: 'Medium',
            deadline: '2025-07-30',
            features: 'Order management, inventory tracking, sales analytics, staff management',
            dateCreated: new Date().toISOString()
        },
        {
            id: generateId(),
            projectName: 'Portfolio Website',
            templateType: 'Portfolio',
            pages: 4,
            complexity: 'Simple',
            priority: 'Low',
            deadline: '2025-08-01',
            features: 'About section, project gallery, contact form, blog section',
            dateCreated: new Date().toISOString()
        }
    ];
    
    AppState.wireframes = sampleWireframes;
    saveToStorage('wireframes', AppState.wireframes);
}

function loadSampleActivity() {
    const sampleActivity = [
        {
            id: generateId(),
            type: 'grocery_added',
            message: 'Added new grocery item: Organic Basmati Rice',
            timestamp: new Date().toISOString()
        },
        {
            id: generateId(),
            type: 'wireframe_created',
            message: 'Created wireframe: E-commerce Mobile App',
            timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
            id: generateId(),
            type: 'grocery_updated',
            message: 'Updated grocery item: Fresh Buffalo Milk',
            timestamp: new Date(Date.now() - 7200000).toISOString()
        }
    ];
    
    AppState.activityLog = sampleActivity;
    saveToStorage('activityLog', AppState.activityLog);
}

// Utility Functions
function generateId() {
    return 'id_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        showNotification('Error saving data', 'error');
    }
}

function formatCurrency(amount) {
    return `NPR ${amount.toLocaleString()}`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString();
}

// Real-time Hero Updates
function updateHeroStats() {
    const totalItems = AppState.groceries.length;
    const totalValue = AppState.groceries.reduce((sum, g) => sum + (g.price * g.quantity), 0);
    const activeProjects = 6; // Static for demo
    
    const heroItems = document.getElementById('hero-total-items');
    const heroValue = document.getElementById('hero-total-value');
    const heroProjects = document.getElementById('hero-projects');
    
    if (heroItems) {
        heroItems.textContent = totalItems;
        heroItems.classList.add('updating');
        setTimeout(() => heroItems.classList.remove('updating'), 600);
    }
    
    if (heroValue) {
        heroValue.textContent = formatCurrency(totalValue);
        heroValue.classList.add('updating');
        setTimeout(() => heroValue.classList.remove('updating'), 600);
    }
    
    if (heroProjects) {
        heroProjects.textContent = activeProjects;
    }
}

// Professional Notification System
function showNotification(message, type = 'info', duration = 4000) {
    // Remove existing notifications
    const existing = document.querySelectorAll('.notification');
    existing.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto remove
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Enhanced Animation System
function initializeAnimations() {
    // Stagger animation for cards
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 100}ms`;
        card.classList.add('fade-in-up');
    });
    
    // Parallax effect for hero
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            heroSection.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Professional Data Export
function exportGroceries() {
    const data = {
        metadata: {
            exportDate: new Date().toISOString(),
            totalItems: AppState.groceries.length,
            totalValue: AppState.groceries.reduce((sum, g) => sum + (g.price * g.quantity), 0),
            exportedBy: AppState.currentUser || 'Anonymous',
            version: AppConfig.version
        },
        groceries: AppState.groceries,
        categories: [...new Set(AppState.groceries.map(g => g.category))],
        suppliers: [...new Set(AppState.groceries.map(g => g.supplier))]
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dokonepal-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Data exported successfully!', 'success');
    addActivityLog('data_export', 'Grocery data exported');
}

// Enhanced Search with Real-time Results
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(performSearch, 300));
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', performSearch);
    }
}

function performSearch() {
    const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';
    const selectedCategory = document.getElementById('category-filter')?.value || '';
    
    let filteredGroceries = AppState.groceries;
    
    // Apply search filter
    if (searchTerm) {
        filteredGroceries = filteredGroceries.filter(grocery =>
            grocery.name.toLowerCase().includes(searchTerm) ||
            grocery.category.toLowerCase().includes(searchTerm) ||
            grocery.supplier.toLowerCase().includes(searchTerm) ||
            grocery.description.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply category filter
    if (selectedCategory) {
        filteredGroceries = filteredGroceries.filter(grocery => 
            grocery.category === selectedCategory
        );
    }
    
    renderGroceries(filteredGroceries);
    
    // Show search results count
    const resultsCount = filteredGroceries.length;
    const totalCount = AppState.groceries.length;
    
    if (searchTerm || selectedCategory) {
        showNotification(`Found ${resultsCount} of ${totalCount} items`, 'info', 2000);
    }
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Hero Section Management
let currentSlide = 0;

// Initialize Hero Section
function initializeHeroSection() {
    initializeInfiniteBackground();
    updateHeroStats();
    initializeHeroAnimations();
}

// Infinite Background Slideshow
function initializeInfiniteBackground() {
    const backgroundTrack = document.getElementById("background-track");
    if (!backgroundTrack) return;

    // Optimize performance
    backgroundTrack.style.willChange = 'transform';
    backgroundTrack.style.backfaceVisibility = 'hidden';

    console.log('Infinite background slideshow initialized - continuous movement');
}

// Update Hero Statistics
function updateHeroStats() {
    const totalItems = AppState.groceries.length;
    const totalValue = AppState.groceries.reduce((sum, g) => sum + (g.price * g.quantity), 0);
    const activeProjects = 6; // Static for demo
    
    const heroItems = document.getElementById('hero-total-items');
    const heroValue = document.getElementById('hero-total-value');
    const heroProjects = document.getElementById('hero-projects');
    
    if (heroItems) {
        heroItems.textContent = totalItems;
        heroItems.classList.add('updating');
        setTimeout(() => heroItems.classList.remove('updating'), 600);
    }
    
    if (heroValue) {
        heroValue.textContent = formatCurrency(totalValue);
        heroValue.classList.add('updating');
        setTimeout(() => heroValue.classList.remove('updating'), 600);
    }
    
    if (heroProjects) {
        heroProjects.textContent = activeProjects;
    }
}

// Animate Numbers
function animateNumber(element, targetValue, duration, isCurrency = false) {
    const startValue = 0;
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutQuart);
        
        if (isCurrency) {
            element.textContent = formatCurrency(currentValue);
        } else {
            element.textContent = currentValue;
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        } else {
            // Ensure final value is correct
            if (isCurrency) {
                element.textContent = formatCurrency(targetValue);
            } else {
                element.textContent = targetValue;
            }
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Hero Animations and Interactions
function initializeHeroAnimations() {
    // Parallax effect for floating elements
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        const floatingElements = document.querySelectorAll('.floating-card');
        floatingElements.forEach((element, index) => {
            const speed = 0.3 + (index * 0.1);
            element.style.transform = `translateY(${rate * speed}px)`;
        });
    });
    
    // Hover effects for hero buttons
    const heroButtons = document.querySelectorAll('.hero-btn');
    heroButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe hero elements
    const heroElements = document.querySelectorAll('.hero-text-content, .hero-stats, .floating-card');
    heroElements.forEach(el => observer.observe(el));
}

// Initialize scroll progress indicator
function initializeScrollProgress() {
    const progressBar = document.getElementById('scroll-progress-bar');
    if (!progressBar) return;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / documentHeight) * 100;
        
        progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
    });
}

// Enhanced scroll effects for better UX
function initializeScrollEffects() {
    // Add smooth scroll to navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add scroll-based animations for cards and elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe cards and sections
    document.querySelectorAll('.card, .stat-card, .floating-card').forEach(el => {
        scrollObserver.observe(el);
    });
}

// Manual slide controls (optional)
function goToSlide(index) {
    const slides = document.querySelectorAll('.hero-background-slider .slide');
    if (index >= 0 && index < slides.length) {
        slides[currentSlide].classList.remove('active');
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        
        // Reset timer
        clearInterval(slideInterval);
        startImageSlider();
    }
}

// Pause slider on hover (optional)
function pauseSlider() {
    clearInterval(slideInterval);
}

function resumeSlider() {
    startImageSlider();
}

// Handle window resize for responsive adjustments
window.addEventListener('resize', () => {
    // Adjust floating elements position on resize
    const floatingElements = document.querySelectorAll('.floating-card');
    floatingElements.forEach(element => {
        element.style.transform = 'translateY(0px)';
    });
});

// Cleanup function
function cleanupHeroSection() {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
}
