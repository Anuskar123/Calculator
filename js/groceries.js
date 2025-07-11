/**
 * Groceries Management Module
 */

// Form Handlers
function handleGrocerySubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const groceryData = {
        id: generateId(),
        name: formData.get('name'),
        category: formData.get('category'),
        price: parseFloat(formData.get('price')),
        quantity: parseInt(formData.get('quantity')),
        unit: formData.get('unit'),
        supplier: formData.get('supplier') || 'Not specified',
        description: formData.get('description') || '',
        image: formData.get('image') || '',
        dateAdded: new Date().toISOString()
    };
    
    // Validate required fields
    if (!groceryData.name || !groceryData.category || !groceryData.price || !groceryData.quantity) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Add to state and save
    AppState.groceries.push(groceryData);
    saveToStorage('groceries', AppState.groceries);
    
    // Update UI
    renderGroceries();
    updateAnalytics();
    
    // Reset form and show success
    e.target.reset();
    showNotification(`Added ${groceryData.name} successfully!`, 'success');
    addActivityLog('grocery_added', `Added new grocery item: ${groceryData.name}`);
}

function handleGroceryReset(e) {
    showNotification('Form cleared', 'info');
}

// Render Functions
function renderGroceries(groceriesToRender = null) {
    const groceriesList = document.getElementById('groceries-list');
    if (!groceriesList) return;
    
    const groceries = groceriesToRender || AppState.groceries;
    
    if (groceries.length === 0) {
        groceriesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-basket"></i>
                <h3>No groceries found</h3>
                <p>Add your first grocery item to get started!</p>
            </div>
        `;
        return;
    }
    
    groceriesList.innerHTML = groceries.map(grocery => `
        <div class="grocery-item" data-id="${grocery.id}">
            <div class="grocery-image">
                <img src="${grocery.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=200&fit=crop'}" 
                     alt="${grocery.name}" 
                     onerror="this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=200&fit=crop'">
                <div class="grocery-category-badge">${grocery.category}</div>
            </div>
            
            <div class="grocery-content">
                <div class="grocery-header">
                    <h4 class="grocery-title">${grocery.name}</h4>
                    <div class="grocery-price">
                        ${formatCurrency(grocery.price)} <span>per ${grocery.unit}</span>
                    </div>
                </div>
                
                <div class="grocery-details">
                    <div class="grocery-detail">
                        <i class="fas fa-weight"></i>
                        <span>${grocery.quantity} ${grocery.unit}</span>
                    </div>
                    <div class="grocery-detail">
                        <i class="fas fa-truck"></i>
                        <span>${grocery.supplier}</span>
                    </div>
                    <div class="grocery-detail">
                        <i class="fas fa-calendar"></i>
                        <span>${formatDate(grocery.dateAdded)}</span>
                    </div>
                    <div class="grocery-detail">
                        <i class="fas fa-calculator"></i>
                        <span>Total: ${formatCurrency(grocery.price * grocery.quantity)}</span>
                    </div>
                </div>
                
                ${grocery.description ? `
                    <div class="grocery-description">
                        ${grocery.description}
                    </div>
                ` : ''}
                
                <div class="grocery-actions admin-only">
                    <button class="btn btn-sm btn-edit" onclick="editGrocery('${grocery.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-delete" onclick="deleteGrocery('${grocery.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// CRUD Operations
function editGrocery(id) {
    // Check if user is admin
    if (!AppState.isLoggedIn || AppState.currentUser !== 'admin') {
        showNotification('Access denied. Admin privileges required.', 'error');
        return;
    }
    
    const grocery = AppState.groceries.find(g => g.id === id);
    if (!grocery) return;
    
    // Populate form with existing data
    document.getElementById('name').value = grocery.name;
    document.getElementById('category').value = grocery.category;
    document.getElementById('price').value = grocery.price;
    document.getElementById('quantity').value = grocery.quantity;
    document.getElementById('unit').value = grocery.unit;
    document.getElementById('supplier').value = grocery.supplier;
    document.getElementById('description').value = grocery.description;
    document.getElementById('image').value = grocery.image || '';
    
    // Change form submit behavior
    const form = document.getElementById('grocery-form');
    form.onsubmit = function(e) {
        e.preventDefault();
        updateGrocery(id, e);
    };
    
    // Update form button
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Grocery Item';
    submitBtn.classList.remove('btn-primary');
    submitBtn.classList.add('btn-warning');
    
    // Scroll to form
    document.getElementById('grocery-form').scrollIntoView({ behavior: 'smooth' });
    
    showNotification(`Editing ${grocery.name}`, 'info');
}

function updateGrocery(id, e) {
    const formData = new FormData(e.target);
    const groceryIndex = AppState.groceries.findIndex(g => g.id === id);
    
    if (groceryIndex === -1) {
        showNotification('Grocery item not found', 'error');
        return;
    }
    
    const updatedGrocery = {
        ...AppState.groceries[groceryIndex],
        name: formData.get('name'),
        category: formData.get('category'),
        price: parseFloat(formData.get('price')),
        quantity: parseInt(formData.get('quantity')),
        unit: formData.get('unit'),
        supplier: formData.get('supplier') || 'Not specified',
        description: formData.get('description') || '',
        dateUpdated: new Date().toISOString()
    };
    
    // Validate required fields
    if (!updatedGrocery.name || !updatedGrocery.category || !updatedGrocery.price || !updatedGrocery.quantity) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Update in state
    AppState.groceries[groceryIndex] = updatedGrocery;
    saveToStorage('groceries', AppState.groceries);
    
    // Reset form
    resetGroceryForm();
    
    // Update UI
    renderGroceries();
    updateAnalytics();
    
    showNotification(`Updated ${updatedGrocery.name} successfully!`, 'success');
    addActivityLog('grocery_updated', `Updated grocery item: ${updatedGrocery.name}`);
}

function deleteGrocery(id) {
    // Check if user is admin
    if (!AppState.isLoggedIn || AppState.currentUser !== 'admin') {
        showNotification('Access denied. Admin privileges required.', 'error');
        return;
    }
    
    const grocery = AppState.groceries.find(g => g.id === id);
    if (!grocery) return;
    
    confirmAction(`Are you sure you want to delete "${grocery.name}"?`, () => {
        AppState.groceries = AppState.groceries.filter(g => g.id !== id);
        saveToStorage('groceries', AppState.groceries);
        
        renderGroceries();
        updateAnalytics();
        
        showNotification(`Deleted ${grocery.name} successfully!`, 'success');
        addActivityLog('grocery_deleted', `Deleted grocery item: ${grocery.name}`);
    });
}

function resetGroceryForm() {
    const form = document.getElementById('grocery-form');
    form.reset();
    form.onsubmit = handleGrocerySubmit;
    
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Add Grocery Item';
    submitBtn.classList.remove('btn-warning');
    submitBtn.classList.add('btn-primary');
}

// Grocery Statistics
function getGroceryStats() {
    const stats = {
        totalItems: AppState.groceries.length,
        totalValue: AppState.groceries.reduce((sum, g) => sum + (g.price * g.quantity), 0),
        categories: [...new Set(AppState.groceries.map(g => g.category))].length,
        averagePrice: 0,
        categoryDistribution: {}
    };
    
    if (stats.totalItems > 0) {
        stats.averagePrice = AppState.groceries.reduce((sum, g) => sum + g.price, 0) / stats.totalItems;
    }
    
    // Category distribution
    AppState.groceries.forEach(grocery => {
        stats.categoryDistribution[grocery.category] = 
            (stats.categoryDistribution[grocery.category] || 0) + 1;
    });
    
    return stats;
}

// Search specific groceries
function searchGroceries(query) {
    const searchTerm = query.toLowerCase();
    return AppState.groceries.filter(grocery => 
        grocery.name.toLowerCase().includes(searchTerm) ||
        grocery.category.toLowerCase().includes(searchTerm) ||
        grocery.supplier.toLowerCase().includes(searchTerm) ||
        grocery.description.toLowerCase().includes(searchTerm)
    );
}

// Filter groceries by category
function filterGroceriesByCategory(category) {
    if (!category) return AppState.groceries;
    return AppState.groceries.filter(grocery => grocery.category === category);
}

// Get groceries by price range
function getGroceriesByPriceRange(minPrice, maxPrice) {
    return AppState.groceries.filter(grocery => 
        grocery.price >= minPrice && grocery.price <= maxPrice
    );
}

// Get low stock items (quantity < 5)
function getLowStockItems() {
    return AppState.groceries.filter(grocery => grocery.quantity < 5);
}

// Get expensive items (price > average)
function getExpensiveItems() {
    const stats = getGroceryStats();
    return AppState.groceries.filter(grocery => grocery.price > stats.averagePrice);
}
