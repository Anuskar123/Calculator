/**
 * Wireframes Management Module
 */

// Form Handlers
function handleWireframeSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const wireframeData = {
        id: generateId(),
        projectName: formData.get('projectName'),
        templateType: formData.get('templateType'),
        pages: parseInt(formData.get('pages')) || 1,
        complexity: formData.get('complexity'),
        priority: formData.get('priority'),
        deadline: formData.get('deadline'),
        features: formData.get('features') || '',
        dateCreated: new Date().toISOString(),
        status: 'Planning'
    };
    
    // Validate required fields
    if (!wireframeData.projectName || !wireframeData.templateType) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Add to state and save
    AppState.wireframes.push(wireframeData);
    saveToStorage('wireframes', AppState.wireframes);
    
    // Update UI
    renderWireframes();
    updateAnalytics();
    
    // Reset form and show success
    e.target.reset();
    showNotification(`Created wireframe "${wireframeData.projectName}" successfully!`, 'success');
    addActivityLog('wireframe_created', `Created wireframe: ${wireframeData.projectName}`);
}

function handleWireframeReset(e) {
    showNotification('Wireframe form cleared', 'info');
}

// Render Functions
function renderWireframes(wireframesToRender = null) {
    const wireframesList = document.getElementById('wireframes-list');
    if (!wireframesList) return;
    
    const wireframes = wireframesToRender || AppState.wireframes;
    
    if (wireframes.length === 0) {
        wireframesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-project-diagram"></i>
                <h3>No wireframes found</h3>
                <p>Create your first wireframe to get started!</p>
            </div>
        `;
        return;
    }
    
    wireframesList.innerHTML = wireframes.map(wireframe => `
        <div class="wireframe-item" data-id="${wireframe.id}">
            <div class="wireframe-header">
                <div>
                    <h4 class="wireframe-title">${wireframe.projectName}</h4>
                    <span class="wireframe-type">${wireframe.templateType}</span>
                </div>
            </div>
            
            <div class="wireframe-meta">
                <div class="wireframe-meta-item">
                    <i class="fas fa-file-alt"></i>
                    <span>${wireframe.pages} pages</span>
                </div>
                <div class="wireframe-meta-item">
                    <i class="fas fa-layer-group"></i>
                    <span>${wireframe.complexity}</span>
                </div>
                <div class="wireframe-meta-item">
                    <i class="fas fa-flag"></i>
                    <span class="priority-${wireframe.priority.toLowerCase()}">${wireframe.priority}</span>
                </div>
                <div class="wireframe-meta-item">
                    <i class="fas fa-calendar"></i>
                    <span>${wireframe.deadline ? formatDate(wireframe.deadline) : 'No deadline'}</span>
                </div>
            </div>
            
            <div class="wireframe-features">
                ${wireframe.features || 'No features specified'}
            </div>
            
            <div class="wireframe-footer">
                <small class="text-muted">
                    <i class="fas fa-clock"></i>
                    Created ${formatDateTime(wireframe.dateCreated)}
                </small>
            </div>
            
            <div class="wireframe-actions">
                <button class="btn btn-sm btn-edit" onclick="editWireframe('${wireframe.id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-sm btn-info" onclick="viewWireframe('${wireframe.id}')">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="btn btn-sm btn-delete" onclick="deleteWireframe('${wireframe.id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

// CRUD Operations
function editWireframe(id) {
    const wireframe = AppState.wireframes.find(w => w.id === id);
    if (!wireframe) return;
    
    // Populate form with existing data
    document.getElementById('project-name').value = wireframe.projectName;
    document.getElementById('template-type').value = wireframe.templateType;
    document.getElementById('pages').value = wireframe.pages;
    document.getElementById('complexity').value = wireframe.complexity;
    document.getElementById('priority').value = wireframe.priority;
    document.getElementById('deadline').value = wireframe.deadline;
    document.getElementById('features').value = wireframe.features;
    
    // Change form submit behavior
    const form = document.getElementById('wireframe-form');
    form.onsubmit = function(e) {
        e.preventDefault();
        updateWireframe(id, e);
    };
    
    // Update form button
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Wireframe';
    submitBtn.classList.remove('btn-primary');
    submitBtn.classList.add('btn-warning');
    
    // Scroll to form
    document.getElementById('wireframe-form').scrollIntoView({ behavior: 'smooth' });
    
    showNotification(`Editing ${wireframe.projectName}`, 'info');
}

function updateWireframe(id, e) {
    const formData = new FormData(e.target);
    const wireframeIndex = AppState.wireframes.findIndex(w => w.id === id);
    
    if (wireframeIndex === -1) {
        showNotification('Wireframe not found', 'error');
        return;
    }
    
    const updatedWireframe = {
        ...AppState.wireframes[wireframeIndex],
        projectName: formData.get('projectName'),
        templateType: formData.get('templateType'),
        pages: parseInt(formData.get('pages')) || 1,
        complexity: formData.get('complexity'),
        priority: formData.get('priority'),
        deadline: formData.get('deadline'),
        features: formData.get('features') || '',
        dateUpdated: new Date().toISOString()
    };
    
    // Validate required fields
    if (!updatedWireframe.projectName || !updatedWireframe.templateType) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Update in state
    AppState.wireframes[wireframeIndex] = updatedWireframe;
    saveToStorage('wireframes', AppState.wireframes);
    
    // Reset form
    resetWireframeForm();
    
    // Update UI
    renderWireframes();
    updateAnalytics();
    
    showNotification(`Updated "${updatedWireframe.projectName}" successfully!`, 'success');
    addActivityLog('wireframe_updated', `Updated wireframe: ${updatedWireframe.projectName}`);
}

function deleteWireframe(id) {
    const wireframe = AppState.wireframes.find(w => w.id === id);
    if (!wireframe) return;
    
    confirmAction(`Are you sure you want to delete "${wireframe.projectName}"?`, () => {
        AppState.wireframes = AppState.wireframes.filter(w => w.id !== id);
        saveToStorage('wireframes', AppState.wireframes);
        
        renderWireframes();
        updateAnalytics();
        
        showNotification(`Deleted "${wireframe.projectName}" successfully!`, 'success');
        addActivityLog('wireframe_deleted', `Deleted wireframe: ${wireframe.projectName}`);
    });
}

function viewWireframe(id) {
    const wireframe = AppState.wireframes.find(w => w.id === id);
    if (!wireframe) return;
    
    // Create a detailed view modal or new window
    const wireframeDetails = `
        <div class="wireframe-details-modal">
            <h2>${wireframe.projectName}</h2>
            <div class="details-grid">
                <div><strong>Template Type:</strong> ${wireframe.templateType}</div>
                <div><strong>Pages:</strong> ${wireframe.pages}</div>
                <div><strong>Complexity:</strong> ${wireframe.complexity}</div>
                <div><strong>Priority:</strong> ${wireframe.priority}</div>
                <div><strong>Deadline:</strong> ${wireframe.deadline ? formatDate(wireframe.deadline) : 'Not set'}</div>
                <div><strong>Created:</strong> ${formatDateTime(wireframe.dateCreated)}</div>
            </div>
            <div class="features-section">
                <h3>Features & Requirements:</h3>
                <p>${wireframe.features || 'No features specified'}</p>
            </div>
        </div>
    `;
    
    // For now, show in alert (could be enhanced with modal)
    alert(`Wireframe Details:\n\nProject: ${wireframe.projectName}\nType: ${wireframe.templateType}\nPages: ${wireframe.pages}\nComplexity: ${wireframe.complexity}\nPriority: ${wireframe.priority}\nFeatures: ${wireframe.features}`);
    
    addActivityLog('wireframe_viewed', `Viewed wireframe: ${wireframe.projectName}`);
}

function resetWireframeForm() {
    const form = document.getElementById('wireframe-form');
    form.reset();
    form.onsubmit = handleWireframeSubmit;
    
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-plus"></i> Create Wireframe';
    submitBtn.classList.remove('btn-warning');
    submitBtn.classList.add('btn-primary');
}

// Wireframe Statistics
function getWireframeStats() {
    const stats = {
        totalWireframes: AppState.wireframes.length,
        byTemplateType: {},
        byComplexity: {},
        byPriority: {},
        byStatus: {},
        averagePages: 0,
        upcomingDeadlines: 0
    };
    
    if (stats.totalWireframes > 0) {
        // Calculate averages and distributions
        stats.averagePages = AppState.wireframes.reduce((sum, w) => sum + (w.pages || 1), 0) / stats.totalWireframes;
        
        // Group by template type
        AppState.wireframes.forEach(wireframe => {
            stats.byTemplateType[wireframe.templateType] = 
                (stats.byTemplateType[wireframe.templateType] || 0) + 1;
            stats.byComplexity[wireframe.complexity] = 
                (stats.byComplexity[wireframe.complexity] || 0) + 1;
            stats.byPriority[wireframe.priority] = 
                (stats.byPriority[wireframe.priority] || 0) + 1;
            stats.byStatus[wireframe.status || 'Planning'] = 
                (stats.byStatus[wireframe.status || 'Planning'] || 0) + 1;
        });
        
        // Count upcoming deadlines
        stats.upcomingDeadlines = getUpcomingDeadlines().length;
    }
    
    return stats;
}

// Get wireframes by status
function getWireframesByStatus(status) {
    return AppState.wireframes.filter(wireframe => wireframe.status === status);
}

// Get high priority wireframes
function getHighPriorityWireframes() {
    return AppState.wireframes.filter(wireframe => wireframe.priority === 'High');
}

// Get wireframes with upcoming deadlines (within 7 days)
function getUpcomingDeadlines() {
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    
    return AppState.wireframes.filter(wireframe => {
        if (!wireframe.deadline) return false;
        const deadline = new Date(wireframe.deadline);
        return deadline <= sevenDaysFromNow && deadline >= new Date();
    });
}
