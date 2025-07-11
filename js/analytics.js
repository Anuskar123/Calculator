
/**
 * Analytics and Charts Module
 */

let categoryChart = null;
let valueChart = null;

// Gantt Chart Variables
let ganttTasks = [];
let performanceChart = null;
let trendsChart = null;

// Update Analytics Dashboard
function updateAnalytics() {
    updateStatCards();
    updateHeroStats(); // Update hero section stats too
    renderActivityLog();
}

function updateStatCards() {
    const groceryStats = getGroceryStats();
    const wireframeStats = getWireframeStats();
    
    // Update main stat cards
    const totalGroceries = document.getElementById('total-groceries');
    if (totalGroceries) {
        totalGroceries.textContent = groceryStats.totalItems;
    }
    
    const totalValue = document.getElementById('total-value');
    if (totalValue) {
        totalValue.textContent = formatCurrency(groceryStats.totalValue);
    }
    
    const totalWireframes = document.getElementById('total-wireframes');
    if (totalWireframes) {
        totalWireframes.textContent = wireframeStats.totalWireframes;
    }
    
    const totalCategories = document.getElementById('total-categories');
    if (totalCategories) {
        totalCategories.textContent = groceryStats.categories;
    }
    
    // Update quick stats
    const avgPrice = document.getElementById('avg-price');
    if (avgPrice) {
        avgPrice.textContent = formatCurrency(groceryStats.averagePrice);
    }
    
    const mostExpensive = document.getElementById('most-expensive');
    if (mostExpensive) {
        const expensiveItem = AppState.groceries.reduce((max, item) => 
            item.price > (max?.price || 0) ? item : max, null);
        mostExpensive.textContent = expensiveItem ? 
            `${expensiveItem.name} (${formatCurrency(expensiveItem.price)})` : '-';
    }
    
    const lowStock = document.getElementById('low-stock');
    if (lowStock) {
        const lowStockCount = AppState.groceries.filter(item => item.quantity < 5).length;
        lowStock.textContent = lowStockCount;
        lowStock.style.color = lowStockCount > 0 ? '#ef4444' : '#22c55e';
    }
    
    const totalSuppliers = document.getElementById('total-suppliers');
    if (totalSuppliers) {
        const uniqueSuppliers = [...new Set(AppState.groceries.map(item => item.supplier))].length;
        totalSuppliers.textContent = uniqueSuppliers;
    }
}

function renderCharts() {
    renderCategoryChart();
    renderValueChart();
    renderTrendsChart();
    initializeRealTime();
}

function renderCategoryChart() {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;
    
    const groceryStats = getGroceryStats();
    const categoryData = groceryStats.categoryDistribution;
    
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded');
        return;
    }
    
    // Destroy existing chart
    if (categoryChart) {
        categoryChart.destroy();
    }
    
    // If no data, show empty state
    if (Object.keys(categoryData).length === 0) {
        ctx.parentElement.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-chart-pie"></i>
                <p>No category data available</p>
            </div>
        `;
        return;
    }
    
    // Prepare data
    const labels = Object.keys(categoryData);
    const data = Object.values(categoryData);
    const colors = [
        '#6366f1', '#10b981', '#f59e0b', '#ef4444',
        '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
    ];
    
    try {
        categoryChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors.slice(0, labels.length),
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const percentage = ((context.parsed / data.reduce((a, b) => a + b, 0)) * 100).toFixed(1);
                                return `${context.label}: ${context.parsed} items (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error creating chart:', error);
        ctx.parentElement.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Error loading chart</p>
            </div>
        `;
    }
}

function renderValueChart() {
    const ctx = document.getElementById('valueChart');
    if (!ctx) return;
    
    const groceryStats = getGroceryStats();
    
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded');
        return;
    }
    
    // Destroy existing chart
    if (valueChart) {
        valueChart.destroy();
    }
    
    // Calculate value by category
    const categoryValues = {};
    AppState.groceries.forEach(grocery => {
        const value = grocery.price * grocery.quantity;
        categoryValues[grocery.category] = (categoryValues[grocery.category] || 0) + value;
    });
    
    // If no data, show empty state
    if (Object.keys(categoryValues).length === 0) {
        ctx.parentElement.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-chart-bar"></i>
                <p>No value data available</p>
            </div>
        `;
        return;
    }
    
    // Prepare data
    const labels = Object.keys(categoryValues);
    const data = Object.values(categoryValues);
    const colors = [
        '#6366f1', '#10b981', '#f59e0b', '#ef4444',
        '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
    ];
    
    try {
        valueChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Inventory Value (NPR)',
                    data: data,
                    backgroundColor: colors.slice(0, labels.length),
                    borderWidth: 1,
                    borderColor: colors.slice(0, labels.length)
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Value: ${formatCurrency(context.parsed.y)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return formatCurrency(value);
                            }
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error creating value chart:', error);
        ctx.parentElement.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Error loading chart</p>
            </div>
        `;
    }
}

function renderActivityLog() {
    const activityLogContainer = document.getElementById('activity-log');
    if (!activityLogContainer) return;
    
    if (AppState.activityLog.length === 0) {
        activityLogContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-history"></i>
                <p>No recent activity</p>
            </div>
        `;
        return;
    }
    
    activityLogContainer.innerHTML = AppState.activityLog
        .slice(0, 10) // Show only last 10 activities
        .map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-${getActivityIcon(activity.type)}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-text">${activity.message}</div>
                    <div class="activity-time">${formatDateTime(activity.timestamp)}</div>
                </div>
            </div>
        `).join('');
}

function getActivityIcon(type) {
    const icons = {
        grocery_added: 'plus',
        grocery_updated: 'edit',
        grocery_deleted: 'trash',
        wireframe_created: 'project-diagram',
        wireframe_updated: 'edit',
        wireframe_deleted: 'trash',
        wireframe_viewed: 'eye',
        export: 'download',
        login: 'sign-in-alt',
        logout: 'sign-out-alt'
    };
    return icons[type] || 'info';
}

// Advanced Analytics Functions
function getGroceryTrends() {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    
    const recentGroceries = AppState.groceries.filter(grocery => 
        new Date(grocery.dateAdded) >= last30Days
    );
    
    return {
        totalAdded: recentGroceries.length,
        averagePrice: recentGroceries.reduce((sum, g) => sum + g.price, 0) / recentGroceries.length || 0,
        mostPopularCategory: getMostPopularCategory(recentGroceries)
    };
}

function getMostPopularCategory(groceries = AppState.groceries) {
    const categoryCount = {};
    groceries.forEach(grocery => {
        categoryCount[grocery.category] = (categoryCount[grocery.category] || 0) + 1;
    });
    
    return Object.keys(categoryCount).reduce((a, b) => 
        categoryCount[a] > categoryCount[b] ? a : b, ''
    );
}

function getInventoryInsights() {
    const groceryStats = getGroceryStats();
    const lowStockItems = getLowStockItems();
    const expensiveItems = getExpensiveItems();
    
    return {
        totalValue: groceryStats.totalValue,
        averageItemValue: groceryStats.averagePrice,
        lowStockCount: lowStockItems.length,
        expensiveItemsCount: expensiveItems.length,
        categoryCount: groceryStats.categories,
        recommendations: generateRecommendations(lowStockItems, expensiveItems)
    };
}

function generateRecommendations(lowStockItems, expensiveItems) {
    const recommendations = [];
    
    if (lowStockItems.length > 0) {
        recommendations.push({
            type: 'warning',
            message: `${lowStockItems.length} items are running low on stock`,
            action: 'Consider restocking these items'
        });
    }
    
    if (expensiveItems.length > AppState.groceries.length * 0.3) {
        recommendations.push({
            type: 'info',
            message: 'Many items are above average price',
            action: 'Review pricing strategy'
        });
    }
    
    if (AppState.groceries.length === 0) {
        recommendations.push({
            type: 'info',
            message: 'No groceries in inventory',
            action: 'Start adding grocery items'
        });
    }
    
    return recommendations;
}

function exportAnalyticsReport() {
    const groceryStats = getGroceryStats();
    const wireframeStats = getWireframeStats();
    const insights = getInventoryInsights();
    const trends = getGroceryTrends();
    
    const report = {
        generatedAt: new Date().toISOString(),
        summary: {
            totalGroceries: groceryStats.totalItems,
            totalWireframes: wireframeStats.totalWireframes,
            inventoryValue: groceryStats.totalValue,
            categories: groceryStats.categories
        },
        groceryAnalytics: {
            stats: groceryStats,
            trends: trends,
            insights: insights
        },
        wireframeAnalytics: {
            stats: wireframeStats
        },
        recommendations: insights.recommendations
    };
    
    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `analytics_report_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showNotification('Analytics report exported successfully!', 'success');
    addActivityLog('export', 'Exported analytics report');
}

// Initialize Real-time Features
function initializeRealTime() {
    updateRealTimeData();
    setInterval(updateRealTimeData, 5000); // Update every 5 seconds
    initializePerformanceChart();
    loadGanttTasks();
    renderGanttChart();
}

// Real-time Data Updates
function updateRealTimeData() {
    const now = new Date();
    document.getElementById('last-updated').textContent = now.toLocaleTimeString();
    
    // Simulate random active sessions (1-5)
    const sessions = Math.floor(Math.random() * 5) + 1;
    document.getElementById('active-sessions').textContent = sessions;
    
    // Update performance chart
    updatePerformanceChart();
}

// Performance Chart
function initializePerformanceChart() {
    const ctx = document.getElementById('performanceChart');
    if (!ctx) return;
    
    const data = {
        labels: [],
        datasets: [{
            label: 'System Performance',
            data: [],
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
        }]
    };
    
    // Initialize with 20 data points
    for (let i = 19; i >= 0; i--) {
        const time = new Date(Date.now() - i * 15000); // 15 seconds intervals
        data.labels.push(time.toLocaleTimeString());
        data.datasets[0].data.push(Math.floor(Math.random() * 30) + 70); // 70-100% performance
    }
    
    performanceChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    display: false
                },
                y: {
                    beginAtZero: false,
                    min: 0,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            elements: {
                point: {
                    radius: 0
                }
            }
        });
}

function updatePerformanceChart() {
    if (!performanceChart) return;
    
    const now = new Date();
    const newPerformance = Math.floor(Math.random() * 30) + 70; // 70-100%
    
    // Add new data point
    performanceChart.data.labels.push(now.toLocaleTimeString());
    performanceChart.data.datasets[0].data.push(newPerformance);
    
    // Remove old data points (keep last 20)
    if (performanceChart.data.labels.length > 20) {
        performanceChart.data.labels.shift();
        performanceChart.data.datasets[0].data.shift();
    }
    
    performanceChart.update('none');
}

// Trends Chart
function renderTrendsChart() {
    const ctx = document.getElementById('trendsChart');
    if (!ctx) return;
    
    // Generate trend data based on groceries
    const last7Days = [];
    const trendData = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        last7Days.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        
        // Simulate trend data based on current inventory
        const baseValue = AppState.groceries.length;
        const variation = Math.floor(Math.random() * 6) - 3; // -3 to +3
        trendData.push(Math.max(0, baseValue + variation));
    }
    
    try {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: last7Days,
                datasets: [{
                    label: 'Inventory Items',
                    data: trendData,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#10b981',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error creating trends chart:', error);
    }
}

// Gantt Chart Implementation
function loadGanttTasks() {
    ganttTasks = [
        // Phase 1: Project Initiation & Planning (May 30 - June 13)
        {
            id: 1,
            name: 'Topic Discussion',
            startDate: '2025-05-30',
            endDate: '2025-06-06',
            priority: 'high',
            progress: 100,
            assignee: 'Team',
            phase: 'Planning',
            details: 'Initial topic discussion and brainstorming for Online Grocery Website'
        },
        {
            id: 2,
            name: 'Proposal Made',
            startDate: '2025-06-07',
            endDate: '2025-06-13',
            priority: 'high',
            progress: 100,
            assignee: 'Ayush',
            phase: 'Planning',
            details: 'Project proposal creation and submission'
        },
        {
            id: 3,
            name: 'Group Discussion',
            startDate: '2025-06-14',
            endDate: '2025-06-20',
            priority: 'high',
            progress: 100,
            assignee: 'Team',
            phase: 'Planning',
            details: 'Team discussion on project scope and requirements'
        },
        {
            id: 4,
            name: 'Design and Wireframe Discussion',
            startDate: '2025-06-21',
            endDate: '2025-06-26',
            priority: 'high',
            progress: 100,
            assignee: 'Anuskar',
            phase: 'Design',
            details: 'UI/UX design planning and wireframe creation'
        },
        
        // Phase 2: Development Phase (June 26 - August 15)
        {
            id: 5,
            name: 'Database Design & Setup',
            startDate: '2025-06-26',
            endDate: '2025-07-01',
            priority: 'high',
            progress: 90,
            assignee: 'Utsab',
            phase: 'Development',
            details: 'Database schema design and initial setup'
        },
        {
            id: 6,
            name: 'Frontend Development - Landing Page',
            startDate: '2025-07-01',
            endDate: '2025-07-07',
            priority: 'high',
            progress: 85,
            assignee: 'Anuskar',
            phase: 'Development',
            details: 'Hero section, navigation, and basic layout'
        },
        {
            id: 7,
            name: 'Grocery Management System',
            startDate: '2025-07-07',
            endDate: '2025-07-12',
            priority: 'high',
            progress: 80,
            assignee: 'Team',
            phase: 'Development',
            details: 'CRUD operations for grocery inventory'
        },
        {
            id: 8,
            name: 'User Authentication System',
            startDate: '2025-07-12',
            endDate: '2025-07-19',
            priority: 'high',
            progress: 70,
            assignee: 'Utsab',
            phase: 'Development',
            details: 'Login, registration, and session management'
        },
        {
            id: 9,
            name: 'Shopping Cart & Checkout',
            startDate: '2025-07-19',
            endDate: '2025-07-26',
            priority: 'high',
            progress: 60,
            assignee: 'Anuskar',
            phase: 'Development',
            details: 'Cart functionality and payment integration'
        },
        {
            id: 10,
            name: 'Order Management System',
            startDate: '2025-07-26',
            endDate: '2025-08-02',
            priority: 'medium',
            progress: 50,
            assignee: 'Utsab',
            phase: 'Development',
            details: 'Order tracking and management features'
        },
        {
            id: 11,
            name: 'Analytics Dashboard',
            startDate: '2025-08-02',
            endDate: '2025-08-09',
            priority: 'medium',
            progress: 40,
            assignee: 'Ayush',
            phase: 'Development',
            details: 'Charts, reports, and business analytics'
        },
        {
            id: 12,
            name: 'Mobile Responsiveness',
            startDate: '2025-08-09',
            endDate: '2025-08-15',
            priority: 'medium',
            progress: 30,
            assignee: 'Anuskar',
            phase: 'Development',
            details: 'Mobile optimization and responsive design'
        },
        
        // Phase 3: Testing & Quality Assurance (August 15 - August 29)
        {
            id: 13,
            name: 'Unit Testing',
            startDate: '2025-08-15',
            endDate: '2025-08-22',
            priority: 'high',
            progress: 25,
            assignee: 'Sandhaya',
            phase: 'Testing',
            details: 'Individual component testing and bug fixes'
        },
        {
            id: 14,
            name: 'Integration Testing',
            startDate: '2025-08-22',
            endDate: '2025-08-29',
            priority: 'high',
            progress: 15,
            assignee: 'Sandhaya',
            phase: 'Testing',
            details: 'System integration and end-to-end testing'
        },
        
        // Phase 4: Documentation & Deployment (August 29 - September 5)
        {
            id: 15,
            name: 'Technical Documentation',
            startDate: '2025-08-29',
            endDate: '2025-09-02',
            priority: 'medium',
            progress: 10,
            assignee: 'Jesina',
            phase: 'Documentation',
            details: 'API documentation and technical guides'
        },
        {
            id: 16,
            name: 'User Manual & Training',
            startDate: '2025-09-02',
            endDate: '2025-09-05',
            priority: 'medium',
            progress: 5,
            assignee: 'Jesina',
            phase: 'Documentation',
            details: 'User guides and training materials'
        },
        {
            id: 17,
            name: 'Final Deployment & Launch',
            startDate: '2025-09-05',
            endDate: '2025-09-05',
            priority: 'high',
            progress: 0,
            assignee: 'Team',
            phase: 'Deployment',
            details: 'Final presentation and university demonstration'
        }
    ];
}

function renderGanttChart() {
    const container = document.getElementById('gantt-chart');
    if (!container) return;
    
    // Generate weekly timeline from May 30 to September 5, 2025
    const weeks = [
        { label: 'May 30-Jun 6', start: '2025-05-30', end: '2025-06-06' },
        { label: 'Jun 7-Jun 13', start: '2025-06-07', end: '2025-06-13' },
        { label: 'Jun 14-Jun 20', start: '2025-06-14', end: '2025-06-20' },
        { label: 'Jun 21-Jun 26', start: '2025-06-21', end: '2025-06-26' },
        { label: 'Jun 26-Jul 1', start: '2025-06-26', end: '2025-07-01' },
        { label: 'Jul 1-Jul 7', start: '2025-07-01', end: '2025-07-07' },
        { label: 'Jul 7-Jul 12', start: '2025-07-07', end: '2025-07-12' },
        { label: 'Jul 12-Jul 19', start: '2025-07-12', end: '2025-07-19' },
        { label: 'Jul 19-Jul 26', start: '2025-07-19', end: '2025-07-26' },
        { label: 'Jul 26-Aug 2', start: '2025-07-26', end: '2025-08-02' },
        { label: 'Aug 2-Aug 9', start: '2025-08-02', end: '2025-08-09' },
        { label: 'Aug 9-Aug 15', start: '2025-08-09', end: '2025-08-15' },
        { label: 'Aug 15-Aug 22', start: '2025-08-15', end: '2025-08-22' },
        { label: 'Aug 22-Aug 29', start: '2025-08-22', end: '2025-08-29' },
        { label: 'Aug 29-Sep 2', start: '2025-08-29', end: '2025-09-02' },
        { label: 'Sep 2-Sep 5', start: '2025-09-02', end: '2025-09-05' }
    ];
    
    const projectStart = new Date('2025-05-30');
    const projectEnd = new Date('2025-09-05');
    const totalDays = Math.ceil((projectEnd - projectStart) / (1000 * 60 * 60 * 24));
    
    let html = `
        <div class="gantt-header">
            <div class="gantt-task-column">
                <div style="font-weight: 600; margin-bottom: 5px;">Online Grocery Website (E-commerce)</div>
                <div style="font-size: 11px; color: #666;">Task / Assignee / Phase</div>
            </div>
            <div class="gantt-timeline-column">
                <div class="gantt-timeline">
                    ${weeks.map(week => `<div class="gantt-week">${week.label}</div>`).join('')}
                </div>
            </div>
        </div>
        <div class="gantt-body">
    `;
    
    // Group tasks by phase
    const phases = {
        'Planning': [],
        'Design': [],
        'Development': [],
        'Testing': [],
        'Documentation': [],
        'Deployment': []
    };
    
    ganttTasks.forEach(task => {
        const phase = task.phase || 'Development';
        if (!phases[phase]) phases[phase] = [];
        phases[phase].push(task);
    });
    
    // Render tasks grouped by phase
    Object.entries(phases).forEach(([phaseName, tasks]) => {
        if (tasks.length === 0) return;
        
        // Phase header
        html += `
            <div class="gantt-phase-header">
                <div class="gantt-task-column">
                    <strong>${phaseName} Phase</strong>
                </div>
                <div class="gantt-timeline-column"></div>
            </div>
        `;
        
        tasks.forEach(task => {
            const startDate = new Date(task.startDate);
            const endDate = new Date(task.endDate);
            const taskDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
            
            // Calculate position and width as percentages
            const startOffset = Math.ceil((startDate - projectStart) / (1000 * 60 * 60 * 24));
            const leftPercent = (startOffset / totalDays) * 100;
            const widthPercent = (taskDays / totalDays) * 100;
            
            let statusClass = 'priority-' + task.priority;
            if (task.progress === 100) statusClass = 'completed';
            else if (task.progress >= 80) statusClass = 'near-complete';
            
            // Current date indicator
            const currentDate = new Date('2025-07-11');
            const isCurrentTask = startDate <= currentDate && endDate >= currentDate;
            const currentClass = isCurrentTask ? 'current-task' : '';
            
            html += `
                <div class="gantt-row ${currentClass}">
                    <div class="gantt-task-info">
                        <div class="gantt-task-name" title="${task.details}">${task.name}</div>
                        <div class="gantt-task-meta">
                            <span class="assignee">${task.assignee}</span> • 
                            <span class="progress">${task.progress}%</span> • 
                            <span class="dates">${formatDate(task.startDate)} - ${formatDate(task.endDate)}</span>
                        </div>
                        <div class="gantt-task-details">${task.details}</div>
                    </div>
                    <div class="gantt-timeline-area">
                        <div class="gantt-bar ${statusClass}" 
                             style="left: ${leftPercent}%; width: ${widthPercent}%;"
                             title="${task.name}: ${task.progress}% complete (${formatDate(task.startDate)} - ${formatDate(task.endDate)})">
                            <span class="gantt-bar-text">${task.progress}%</span>
                        </div>
                        ${isCurrentTask ? '<div class="current-indicator" title="Currently Active"></div>' : ''}
                    </div>
                </div>
            `;
        });
    });
    
    // Add current date line
    const currentDate = new Date('2025-07-11');
    const currentOffset = Math.ceil((currentDate - projectStart) / (1000 * 60 * 60 * 24));
    const currentPercent = (currentOffset / totalDays) * 100;
    
    html += `
        </div>
        <div class="current-date-line" style="left: ${currentPercent}%;" title="Current Date: July 11, 2025">
            <div class="current-date-label">Today</div>
        </div>
    `;
    
    container.innerHTML = html;
}

function addGanttTask() {
    const taskName = prompt('Enter task name:');
    if (!taskName) return;
    
    const startDate = prompt('Enter start date (YYYY-MM-DD):');
    if (!startDate) return;
    
    const endDate = prompt('Enter end date (YYYY-MM-DD):');
    if (!endDate) return;
    
    const priority = prompt('Enter priority (high/medium/low):') || 'medium';
    const assignee = prompt('Enter assignee name:') || 'Team';
    
    const newTask = {
        id: ganttTasks.length + 1,
        name: taskName,
        startDate: startDate,
        endDate: endDate,
        priority: priority.toLowerCase(),
        progress: 0,
        assignee: assignee
    };
    
    ganttTasks.push(newTask);
    renderGanttChart();
    showNotification(`Task "${taskName}" added to Gantt chart!`, 'success');
}

function resetGanttView() {
    loadGanttTasks();
    renderGanttChart();
    showNotification('Gantt chart reset to default view', 'info');
}
