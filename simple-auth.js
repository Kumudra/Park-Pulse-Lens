// ===== SIMPLE AUTHENTICATION SYSTEM =====
// Default user (Kip Mudra Thwe)
const DEFAULT_USER = {
    id: 'user_001',
    username: 'kipmudrathwe',
    email: 'kipmudrathwe@gmail.com',
    password: 'password123!',
    fullName: 'Kip Mudra Thwe',
    avatar: 'https://i.pinimg.com/1200x/6f/28/80/6f2880b9f7819eb658ddd12cb544ad23.jpg',
    stats: {
        events: 12,
        hours: 48,
        trees: 36,
        impact: 92,
        ecoPoints: 697,
        streak: 8,
        rank: 2,
        ecoImpact: 67
    },
    preferences: {
        timezone: 'pst',
        participationArea: 'San Francisco',
        notifications: 'all'
    }
};

// ===== STORAGE FUNCTIONS =====
function initStorage() {
    if (!localStorage.getItem('ecoHubUsers')) {
        const users = {};
        users[DEFAULT_USER.email] = DEFAULT_USER;
        localStorage.setItem('ecoHubUsers', JSON.stringify(users));
    }
}

function getCurrentUser() {
    try {
        const userJson = localStorage.getItem('currentUser');
        return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}

function isLoggedIn() {
    return getCurrentUser() !== null;
}

// ===== AUTH FUNCTIONS =====
function login(email, password) {
    const users = JSON.parse(localStorage.getItem('ecoHubUsers') || '{}');
    const user = users[email];
    
    if (!user) {
        return { success: false, message: 'User not found. Please sign up first.' };
    }
    
    if (user.password !== password) {
        return { success: false, message: 'Incorrect password.' };
    }
    
    // Store user without password for security
    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    
    return { 
        success: true, 
        message: 'Login successful!', 
        user: userWithoutPassword 
    };
}

function signup(userData) {
    const users = JSON.parse(localStorage.getItem('ecoHubUsers') || '{}');
    
    // Check if user already exists
    if (users[userData.email]) {
        return { success: false, message: 'Email already registered.' };
    }
    
    // Create new user
    const newUser = {
        id: 'user_' + Date.now(),
        username: userData.email.split('@')[0],
        email: userData.email,
        password: userData.password,
        fullName: `${userData.firstName} ${userData.lastName}`,
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
        stats: {
            events: 0,
            hours: 0,
            trees: 0,
            impact: 0,
            ecoPoints: 0,
            streak: 0,
            rank: 999,
            ecoImpact: 0
        },
        preferences: {
            timezone: 'est',
            participationArea: '',
            notifications: 'all'
        }
    };
    
    // Save user
    users[userData.email] = newUser;
    localStorage.setItem('ecoHubUsers', JSON.stringify(users));
    
    // Login the new user
    const { password: _, ...userWithoutPassword } = newUser;
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    
    return { 
        success: true, 
        message: 'Account created successfully!', 
        user: userWithoutPassword 
    };
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.reload();
}

function updateUserStats(statsUpdate) {
    const currentUser = getCurrentUser();
    if (!currentUser) return false;
    
    // Update stats
    Object.keys(statsUpdate).forEach(key => {
        if (currentUser.stats[key] !== undefined) {
            currentUser.stats[key] = statsUpdate[key];
        }
    });
    
    // Save updated user
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Also update in users database
    const users = JSON.parse(localStorage.getItem('ecoHubUsers') || '{}');
    if (users[currentUser.email]) {
        Object.keys(statsUpdate).forEach(key => {
            if (users[currentUser.email].stats[key] !== undefined) {
                users[currentUser.email].stats[key] = statsUpdate[key];
            }
        });
        localStorage.setItem('ecoHubUsers', JSON.stringify(users));
    }
    
    return true;
}

// ===== UI FUNCTIONS =====
function updateUI() {
    const signInBtn = document.getElementById('mainSignInBtn');
    const userProfile = document.querySelector('.user-profile');
    const currentUser = getCurrentUser();
    
    if (isLoggedIn() && currentUser && signInBtn) {
        // User is logged in
        const firstName = currentUser.fullName.split(' ')[0];
        signInBtn.innerHTML = `<i class="fas fa-user"></i> ${firstName}`;
        signInBtn.setAttribute('data-bs-toggle', 'dropdown');
        signInBtn.classList.add('dropdown-toggle');
        
        // Remove modal attributes
        signInBtn.removeAttribute('data-bs-target');
        
        // Create or update dropdown menu
        updateDropdownMenu(signInBtn);
        
        // Show user profile section
        if (userProfile) {
            userProfile.style.display = 'flex';
        }
    } else if (signInBtn) {
        // User is not logged in
        signInBtn.innerHTML = 'Sign In';
        signInBtn.setAttribute('data-bs-toggle', 'modal');
        signInBtn.setAttribute('data-bs-target', '#authModal');
        signInBtn.classList.remove('dropdown-toggle');
        
        // Remove dropdown menu if exists
        removeDropdownMenu(signInBtn);
        
        // Hide user profile section
        if (userProfile) {
            userProfile.style.display = 'none';
        }
    }
}

function updateDropdownMenu(signInBtn) {
    let dropdownMenu = signInBtn.nextElementSibling;
    
    if (!dropdownMenu || !dropdownMenu.classList.contains('dropdown-menu')) {
        dropdownMenu = document.createElement('div');
        dropdownMenu.className = 'dropdown-menu dropdown-menu-end';
        signInBtn.parentNode.appendChild(dropdownMenu);
    }
    
    dropdownMenu.innerHTML = `
        <a class="dropdown-item" href="Dashboard.html">
            <i class="fas fa-user"></i> Profile
        </a>
        <div class="dropdown-divider"></div>
        <a class="dropdown-item text-danger" href="#" id="logoutBtn">
            <i class="fas fa-sign-out-alt"></i> Logout
        </a>
    `;
    
    // Add logout event listener
    const logoutBtn = dropdownMenu.querySelector('#logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
}

function removeDropdownMenu(signInBtn) {
    const dropdownMenu = signInBtn.nextElementSibling;
    if (dropdownMenu && dropdownMenu.classList.contains('dropdown-menu')) {
        dropdownMenu.remove();
    }
}

// ===== DASHBOARD FUNCTIONS =====
function updateDashboard() {
    const currentUser = getCurrentUser();
    
    if (currentUser) {
        updateDashboardWithUserData(currentUser);
        enableInteractiveFeatures();
    } else {
        showGuestDashboard();
        disableInteractiveFeatures();
    }
}

function updateDashboardWithUserData(user) {
    // Update welcome message
    const welcomeElement = document.querySelector('.welcome strong');
    const usernameElement = document.querySelector('.username');
    const avatarElement = document.querySelector('.avatar');
    
    if (welcomeElement) welcomeElement.textContent = user.fullName;
    if (usernameElement) usernameElement.textContent = user.fullName;
    if (avatarElement) avatarElement.src = user.avatar;
    
    // Update stats display
    updateStatsDisplay(user.stats);
    
    // Update settings form
    updateSettingsForm(user);
}

function showGuestDashboard() {
    // Update welcome message
    const welcomeElement = document.querySelector('.welcome');
    if (welcomeElement) {
        welcomeElement.innerHTML = 'Welcome to Park Pulse Lens, <strong>Guest</strong>';
    }
    
    // Set empty stats
    const emptyStats = {
        events: 0,
        hours: 0,
        trees: 0,
        impact: 0,
        ecoPoints: 0,
        streak: 0,
        rank: 0,
        ecoImpact: 0
    };
    
    updateStatsDisplay(emptyStats);
    
    // Show sign-in prompts
    showSignInPrompts();
}

function updateStatsDisplay(stats) {
    // Update horizontal stats
    document.querySelectorAll('.stat-horizontal-item .value').forEach((element, index) => {
        const values = [
            stats.events || 0,
            stats.hours || 0,
            stats.trees || 0,
            `${stats.impact || 0}%`
        ];
        if (values[index] !== undefined) {
            element.textContent = values[index];
        }
    });
    
    // Update progress bar
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) progressBar.style.width = `${stats.impact || 0}%`;
    
    // Update stat cards
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards.length >= 4) {
        statCards[0].querySelector('.stat-value').textContent = `${stats.ecoImpact || 0}%`;
        statCards[1].querySelector('.stat-value').textContent = stats.ecoPoints || 0;
        statCards[2].querySelector('.stat-value').textContent = stats.streak || 0;
        statCards[3].querySelector('.stat-value').textContent = stats.rank ? `#${stats.rank}` : '#0';
    }
}

// ===== INTERACTIVE FEATURES =====
function enableInteractiveFeatures() {
    const joinBtn = document.querySelector('.join-btn');
    if (joinBtn) {
        joinBtn.disabled = false;
        joinBtn.textContent = 'Join This Event';
        joinBtn.style.backgroundColor = '';
        
        joinBtn.onclick = handleJoinEvent;
    }
    
    // Enable event table rows
    const tableRows = document.querySelectorAll('.participated-events tbody tr');
    tableRows.forEach(row => {
        row.style.cursor = 'pointer';
        row.onclick = function() {
            if (this.classList.contains('highlight')) {
                showEventDetails(this);
            }
        };
    });
}

function disableInteractiveFeatures() {
    const joinBtn = document.querySelector('.join-btn');
    if (joinBtn) {
        joinBtn.disabled = true;
        joinBtn.textContent = 'Sign In to Join';
        joinBtn.style.backgroundColor = '#cccccc';
        
        joinBtn.onclick = function(e) {
            e.preventDefault();
            const modal = new bootstrap.Modal(document.getElementById('authModal'));
            modal.show();
        };
    }
    
    // Disable event table rows
    const tableRows = document.querySelectorAll('.participated-events tbody tr');
    tableRows.forEach(row => {
        row.style.cursor = 'default';
        row.onclick = null;
    });
}

function showSignInPrompts() {
    const tableBody = document.querySelector('.participated-events tbody');
    if (tableBody && !tableBody.querySelector('.sign-in-prompt')) {
        const promptRow = document.createElement('tr');
        promptRow.className = 'sign-in-prompt';
        promptRow.innerHTML = `
            <td colspan="5" style="text-align: center; padding: 40px;">
                <i class="fas fa-sign-in-alt" style="font-size: 2rem; color: #666; margin-bottom: 10px;"></i>
                <p style="color: #666; margin-bottom: 15px;">Sign in to see your events</p>
                <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#authModal">
                    Sign In Now
                </button>
            </td>
        `;
        tableBody.appendChild(promptRow);
    }
}

function handleJoinEvent() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        const modal = new bootstrap.Modal(document.getElementById('authModal'));
        modal.show();
        return;
    }
    
    // Update user stats
    const statsUpdate = {
        events: (currentUser.stats.events || 0) + 1,
        hours: (currentUser.stats.hours || 0) + 4,
        ecoPoints: (currentUser.stats.ecoPoints || 0) + 50,
        streak: (currentUser.stats.streak || 0) + 1,
        impact: Math.min(100, (currentUser.stats.impact || 0) + 5)
    };
    
    if (updateUserStats(statsUpdate)) {
        updateStatsDisplay(getCurrentUser().stats);
        
        showNotification('You have joined the Community Cleanup event! Details have been sent to your email.', 'success');
        
        const joinBtn = document.querySelector('.join-btn');
        joinBtn.textContent = 'Joined ✓';
        joinBtn.style.backgroundColor = '#4caf50';
        joinBtn.disabled = true;
        
        addEventToTable({
            name: 'Community Cleanup',
            date: 'Nov 15',
            time: '240 min',
            points: 50
        });
    }
}

function addEventToTable(event) {
    const tableBody = document.querySelector('.participated-events tbody');
    if (!tableBody) return;
    
    // Remove sign-in prompt if exists
    const prompt = tableBody.querySelector('.sign-in-prompt');
    if (prompt) prompt.remove();
    
    const newRow = document.createElement('tr');
    newRow.className = 'highlight';
    newRow.innerHTML = `
        <td>1</td>
        <td><strong>${event.name}</strong></td>
        <td>${event.date}</td>
        <td>${event.time}</td>
        <td><strong>${event.points}</strong></td>
    `;
    
    // Update existing row numbers
    const existingRows = tableBody.querySelectorAll('tr:not(.sign-in-prompt)');
    existingRows.forEach((row, index) => {
        row.cells[0].textContent = index + 2;
    });
    
    tableBody.insertBefore(newRow, tableBody.firstChild);
    
    // Limit to 6 rows
    const allRows = tableBody.querySelectorAll('tr');
    if (allRows.length > 6) {
        tableBody.removeChild(allRows[allRows.length - 1]);
    }
}

function showEventDetails(eventRow) {
    const eventName = eventRow.querySelector('td:nth-child(2)').textContent;
    const eventDate = eventRow.querySelector('td:nth-child(3)').textContent;
    const eventTime = eventRow.querySelector('td:nth-child(4)').textContent;
    const eventPoints = eventRow.querySelector('td:nth-child(5)').textContent;
    
    showNotification(`Event: ${eventName}\nDate: ${eventDate}\nTime: ${eventTime}\nPoints: ${eventPoints}`, 'info');
}

// ===== FORM HANDLING =====
function setupAuthForms() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            const result = login(email, password);
            
            if (result.success) {
                showNotification(result.message, 'success');
                
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('authModal'));
                if (modal) modal.hide();
                
                // Update UI
                updateUI();
                
                // Update dashboard if on dashboard page
                if (window.location.pathname.includes('Dashboard.html')) {
                    updateDashboard();
                }
            } else {
                showNotification(result.message, 'error');
            }
        });
    }
    
    // Signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const userData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('signupEmail').value,
                password: document.getElementById('signupPassword').value
            };
            
            // Basic validation
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (password !== confirmPassword) {
                showNotification('Passwords do not match!', 'error');
                return;
            }
            
            if (password.length < 6) {
                showNotification('Password must be at least 6 characters.', 'error');
                return;
            }
            
            const result = signup(userData);
            
            if (result.success) {
                showNotification(result.message, 'success');
                
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('authModal'));
                if (modal) modal.hide();
                
                // Update UI
                updateUI();
                
                // Update dashboard if on dashboard page
                if (window.location.pathname.includes('Dashboard.html')) {
                    updateDashboard();
                }
            } else {
                showNotification(result.message, 'error');
            }
        });
    }
}

// ===== FORM SWITCHING =====
function showSignupForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'flex';
    document.getElementById('logoTitle').textContent = "Join Our Community";
    document.getElementById('logoSubtitle').textContent = "Create an account to start your conservation journey";
}

function showLoginForm() {
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'flex';
    document.getElementById('logoTitle').textContent = "Welcome Back";
    document.getElementById('logoSubtitle').textContent = "Sign in to continue your park conservation journey";
}

// ===== UTILITY FUNCTIONS =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    document.querySelectorAll('.simple-notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `simple-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 
                              type === 'error' ? 'fa-exclamation-circle' : 
                              'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles if not already added
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .simple-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'success' ? '#4caf50' : 
                             type === 'error' ? '#f44336' : '#2196f3'};
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                animation: slideIn 0.3s ease-out;
                display: flex;
                align-items: center;
                gap: 10px;
                min-width: 300px;
                max-width: 400px;
            }
            
            .simple-notification i {
                font-size: 1.2rem;
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggleIcon = input.nextElementSibling.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        toggleIcon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        toggleIcon.className = 'fas fa-eye';
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initStorage();
    setupAuthForms();
    updateUI();
    
    // Add form switching event listeners
    const showSignupLink = document.querySelector('.toggle-link a[onclick*="showSignupForm"]');
    const showLoginLink = document.querySelector('.toggle-link a[onclick*="showLoginForm"]');
    
    if (showSignupLink) {
        showSignupLink.removeAttribute('onclick');
        showSignupLink.addEventListener('click', showSignupForm);
    }
    
    if (showLoginLink) {
        showLoginLink.removeAttribute('onclick');
        showLoginLink.addEventListener('click', showLoginForm);
    }
    
    // Update dashboard if on dashboard page
    if (window.location.pathname.includes('Dashboard.html')) {
        updateDashboard();
    }
});

// ===== GLOBAL EXPORTS =====
window.showSignupForm = showSignupForm;
window.showLoginForm = showLoginForm;
window.isLoggedIn = isLoggedIn;
window.getCurrentUser = getCurrentUser;
window.logout = logout;
window.updateUI = updateUI;