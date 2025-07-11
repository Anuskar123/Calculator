/**
 * Navigation and UI Management
 */

// Navigation Management
function initializeNavigation() {
    // Add click handlers to navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('href').substring(1);
            showSection(targetSection);
            
            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Mobile menu toggle (if needed)
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            document.querySelector('.nav-menu').classList.toggle('active');
        });
    }
}

// Section Management
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
        AppState.currentSection = sectionId;
        
        // Special handling for analytics section
        if (sectionId === 'analytics') {
            updateAnalytics();
            renderCharts();
        }
    }
    
    // Update page title
    updatePageTitle(sectionId);
}

function updatePageTitle(sectionId) {
    const titles = {
        home: 'Home',
        groceries: 'Groceries Management',
        wireframes: 'Wireframe Workshop',
        analytics: 'Analytics Dashboard',
        about: 'About DokoNepal',
        login: 'Login'
    };
    
    const title = titles[sectionId] || 'DokoNepal';
    document.title = `${title} - DokoNepal`;
}

// Form Initialization
function initializeForms() {
    // Grocery form
    const groceryForm = document.getElementById('grocery-form');
    if (groceryForm) {
        groceryForm.addEventListener('submit', handleGrocerySubmit);
        groceryForm.addEventListener('reset', handleGroceryReset);
    }
    
    // Wireframe form
    const wireframeForm = document.getElementById('wireframe-form');
    if (wireframeForm) {
        wireframeForm.addEventListener('submit', handleWireframeSubmit);
        wireframeForm.addEventListener('reset', handleWireframeReset);
    }
    
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
}

// Filter Initialization
function initializeFilters() {
    // Search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    // Category filter
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', handleCategoryFilter);
    }
}

// Search and Filter Handlers
function handleSearch() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const categoryFilter = document.getElementById('category-filter').value;
    
    let filteredGroceries = AppState.groceries;
    
    // Apply search filter
    if (searchTerm) {
        filteredGroceries = filteredGroceries.filter(grocery => 
            grocery.name.toLowerCase().includes(searchTerm) ||
            grocery.supplier.toLowerCase().includes(searchTerm) ||
            grocery.description.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply category filter
    if (categoryFilter) {
        filteredGroceries = filteredGroceries.filter(grocery => 
            grocery.category === categoryFilter
        );
    }
    
    renderGroceries(filteredGroceries);
}

function handleCategoryFilter() {
    handleSearch(); // Reuse search logic
}

// Utility Functions
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.toggle('hidden');
    }
}

// Loading States
function showLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading...</p>
            </div>
        `;
    }
}

function hideLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        const loadingSpinner = container.querySelector('.loading-spinner');
        if (loadingSpinner) {
            loadingSpinner.remove();
        }
    }
}

// Modal Management (if needed for future features)
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.classList.add('modal-open');
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
    }
}

// Confirmation Dialog
function confirmAction(message, callback) {
    if (confirm(message)) {
        callback();
    }
}

// Export functionality
function exportGroceries() {
    try {
        const dataStr = JSON.stringify(AppState.groceries, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `groceries_export_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        showNotification('Groceries data exported successfully!', 'success');
        addActivityLog('export', 'Exported groceries data');
    } catch (error) {
        console.error('Export error:', error);
        showNotification('Error exporting data', 'error');
    }
}

// Print functionality
function printSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>DokoNepal - ${sectionId}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        .card { border: 1px solid #ddd; margin: 10px 0; padding: 15px; }
                        .card-header { font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 10px; }
                        .card-body { padding-top: 10px; }
                    </style>
                </head>
                <body>
                    ${section.innerHTML}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }
}
