// Initialize navbar when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateNavbar();
    handleDashboardAccess();
});

document.addEventListener('DOMContentLoaded', function() {
    // Initialize modal if it exists
    const authModal = document.getElementById('authModal');
    if (authModal) {
        // Bootstrap modal is automatically initialized by data attributes
        // But we need to ensure form handlers are set up
        setupAuthForms();
        updateUI();
    }
});

// Update navbar based on login status
function updateNavbar() {
    const currentUser = getCurrentUserFromStorage();
    const isLoggedIn = currentUser !== null;
    const signInBtn = document.getElementById('mainSignInBtn');
    
    if (!signInBtn) return;
    
    if (isLoggedIn && currentUser) {
        // User is logged in - show user's first name
        const firstName = currentUser.fullName.split(' ')[0];
        signInBtn.innerHTML = `<i class="fas fa-user"></i> ${firstName}`;
        signInBtn.setAttribute('data-bs-toggle', 'dropdown');
        signInBtn.classList.add('dropdown-toggle');
        
        // Create or update dropdown menu
        updateDropdownMenu(signInBtn, currentUser);
    } else {
        // User is not logged in - show sign in button
        signInBtn.innerHTML = 'Sign In';
        signInBtn.setAttribute('data-bs-toggle', 'modal');
        signInBtn.setAttribute('data-bs-target', '#authModal');
        signInBtn.classList.remove('dropdown-toggle');
        
        // Remove dropdown menu if exists
        removeDropdownMenu(signInBtn);
    }
}

// Get current user from storage
function getCurrentUserFromStorage() {
    try {
        const userJson = localStorage.getItem('currentUser');
        return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}

// Update dropdown menu
function updateDropdownMenu(signInBtn, currentUser) {
    let dropdownMenu = signInBtn.nextElementSibling;
    
    if (!dropdownMenu || !dropdownMenu.classList.contains('dropdown-menu')) {
        dropdownMenu = document.createElement('div');
        dropdownMenu.className = 'dropdown-menu dropdown-menu-end';
        signInBtn.parentNode.appendChild(dropdownMenu);
    }
    
    // Update dropdown menu content
    dropdownMenu.innerHTML = `
        <a class="dropdown-item" href="Dashboard.html">
            <i class="fas fa-tachometer-alt"></i> My Profile
        </a>
        <div class="dropdown-divider"></div>
        <a class="dropdown-item text-danger" href="#" id="logoutBtn">
            <i class="fas fa-sign-out-alt"></i> Logout
        </a>
    `;
    
    setupDropdownEvents(dropdownMenu);
}

// Remove dropdown menu
function removeDropdownMenu(signInBtn) {
    const dropdownMenu = signInBtn.nextElementSibling;
    if (dropdownMenu && dropdownMenu.classList.contains('dropdown-menu')) {
        dropdownMenu.remove();
    }
}

// Setup dropdown events
function setupDropdownEvents(dropdownMenu) {
    // Logout button
    const logoutBtn = dropdownMenu.querySelector('#logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    }
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('currentUser');
    
    // Show notification
    showSimpleNotification('Logged out successfully', 'success');
    
    // Redirect to home page after logout
    setTimeout(() => {
        if (!window.location.pathname.includes('index.html')) {
            window.location.href = 'index.html';
        } else {
            window.location.reload();
        }
    }, 1000);
}

// Handle dashboard access
function handleDashboardAccess() {
    // If user is on dashboard page but not logged in
    if (window.location.pathname.includes('Dashboard.html')) {
        const currentUser = getCurrentUserFromStorage();
        
        if (!currentUser) {
            // Show login modal
            const modalElement = document.getElementById('authModal');
            if (modalElement) {
                const modal = new bootstrap.Modal(modalElement);
                modal.show();
                
                // Redirect to home after modal is hidden if still not logged in
                modalElement.addEventListener('hidden.bs.modal', function() {
                    if (!getCurrentUserFromStorage()) {
                        window.location.href = 'index.html';
                    }
                });
            } else {
                // If no modal, redirect immediately
                window.location.href = 'index.html';
            }
        }
    }
}

// Show notification
function showSimpleNotification(message, type = 'info') {
    // Remove existing notifications
    document.querySelectorAll('.simple-notif').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `simple-notif ${type}`;
    notification.innerHTML = `
        <div class="notif-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 
                           type === 'error' ? 'fa-exclamation-circle' : 
                           'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    if (!document.getElementById('simple-notif-styles')) {
        const style = document.createElement('style');
        style.id = 'simple-notif-styles';
        style.textContent = `
            .simple-notif {
                position: fixed;
                top: 80px;
                right: 20px;
                background: ${type === 'success' ? '#4caf50' : 
                             type === 'error' ? '#f44336' : '#2196f3'};
                color: white;
                padding: 12px 18px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 9999;
                animation: slideDown 0.3s ease-out;
                display: flex;
                align-items: center;
                gap: 10px;
                min-width: 250px;
                max-width: 300px;
            }
            
            .simple-notif i {
                font-size: 1.1rem;
            }
            
            @keyframes slideDown {
                from {
                    transform: translateY(-20px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

window.updateNavbar = updateNavbar;


// Newsletter form submission
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const emailInput = this.querySelector('input[type="email"]');
        if (emailInput && emailInput.value) {
            alert(`Thank you for subscribing with ${emailInput.value}!`);
            emailInput.value = '';
        }
    });
}