// ===== GLOBAL INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize sidebar functionality
    initializeSidebar();
    
    // Wait for auth system to initialize
    setTimeout(() => {
        initializeDashboard();
        initializeDashboardSettings();
    }, 100);
});

// ===== SIDEBAR FUNCTIONS =====
function initializeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle') || document.getElementById('toggle-btn');
    const logoImg = document.querySelector('.logo-toggle img');
    
    if (!sidebar || !toggleBtn) return;
    
    // Initialize sidebar state
    let isExpanded = localStorage.getItem('sidebarExpanded') === 'true';
    if (isExpanded) {
        sidebar.classList.add('expanded');
    }
    
    // Toggle sidebar when clicking on logo/header
    toggleBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Toggle expanded state
        sidebar.classList.toggle('expanded');
        isExpanded = sidebar.classList.contains('expanded');
        localStorage.setItem('sidebarExpanded', isExpanded);
        
        // Add animation to logo
        if (logoImg) {
            logoImg.classList.add('clicked');
            setTimeout(() => logoImg.classList.remove('clicked'), 500);
        }
        
        // Dispatch custom event for other components
        document.dispatchEvent(new CustomEvent('sidebarToggle', { 
            detail: { expanded: isExpanded } 
        }));
        
        updateToggleIcon();
    });
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(event.target) && 
                !toggleBtn.contains(event.target) &&
                event.target !== toggleBtn) {
                sidebar.classList.remove('expanded');
                localStorage.setItem('sidebarExpanded', 'false');
                updateToggleIcon();
            }
        }
    });
    
    // Handle navigation clicks
    document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
            }
            
            // Set active state
            document.querySelectorAll('.main-nav li').forEach(item => {
                item.classList.remove('active');
            });
            this.closest('li').classList.add('active');
            
            // Close sidebar on mobile after click
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('expanded');
                updateToggleIcon();
            }
            
            // Scroll to section if needed
            scrollToSection(this);
        });
    });
    
    updateNotificationCounts();
    
    window.addEventListener('resize', handleSidebarResize);
    handleSidebarResize(); // Initial call
}

function updateToggleIcon() {
    const toggleBtn = document.getElementById('toggle-btn');
    if (!toggleBtn) return;
    
    const sidebar = document.getElementById('sidebar');
    const icon = toggleBtn.querySelector('i');
    if (icon && sidebar) {
        icon.className = sidebar.classList.contains('expanded') 
            ? 'fas fa-chevron-left' 
            : 'fas fa-chevron-right';
    }
}

function updateNotificationCounts() {
    const eventCount = 5; 
    const communityCount = 12; 
    
    const badges = document.querySelectorAll('.nav-badge');
    if (badges[0]) badges[0].textContent = eventCount;
    if (badges[1]) badges[1].textContent = communityCount;
}

function handleSidebarResize() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    
    if (window.innerWidth > 768) {
        // On desktop, ensure sidebar is visible
        sidebar.style.transform = 'translateX(0)';
    } else {
        // On mobile, collapse sidebar by default
        if (!sidebar.classList.contains('expanded')) {
            sidebar.style.transform = 'translateX(-100%)';
        } else {
            sidebar.style.transform = 'translateX(0)';
        }
    }
}

function scrollToSection(linkElement) {
    const sectionName = linkElement.querySelector('span')?.textContent.trim();
    if (!sectionName) return;
    
    const sections = {
        'Dashboard': '.dashboard-header',
        'Events Calendar': '.calendar-section',
        'Field Projects': '.field-projects-section'
    };
    
    const sectionSelector = sections[sectionName];
    if (sectionSelector) {
        const element = document.querySelector(sectionSelector);
        if (element) {
            setTimeout(() => {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, window.innerWidth <= 768 ? 300 : 100);
        }
    }
}

// ===== DASHBOARD INITIALIZATION =====
function initializeDashboard() {
    // Check if auth system is loaded
    if (typeof isLoggedIn === 'undefined' || typeof getCurrentUser === 'undefined') {
        console.error('Auth system not loaded');
        return;
    }
    
    // Update dashboard based on login state
    if (isLoggedIn()) {
        const user = getCurrentUser();
        updateDashboardWithUserData(user);
        enableInteractiveFeatures();
    } else {
        showGuestDashboard();
        disableInteractiveFeatures();
    }
    
    // Initialize other components
    initializeDashboardComponents();
    updateJoinButtonEvent();
}

function initializeDashboardComponents() {
    // Initialize existing components if functions exist
    if (typeof initializeTimeFilters === 'function') initializeTimeFilters();
    if (typeof initializeDashboardCarousel === 'function') initializeDashboardCarousel();
    if (typeof initializeCalendar === 'function') initializeCalendar();
    if (typeof initializeGraphInteractions === 'function') initializeGraphInteractions();
    if (typeof initializeFieldProjects === 'function') initializeFieldProjects();
    if (typeof fixSidebarPosition === 'function') fixSidebarPosition();
    
    initializeProfilePicture();
    initializeEventJoining();
}

// ===== USER DATA FUNCTIONS =====
function updateDashboardWithUserData(user) {
    // Update welcome message
    const welcomeElement = document.querySelector('.welcome strong');
    const usernameElement = document.querySelector('.username');
    const avatarElement = document.querySelector('.avatar');
    
    if (welcomeElement) welcomeElement.textContent = user.fullName;
    if (usernameElement) usernameElement.textContent = user.fullName;
    if (avatarElement && user.avatar) avatarElement.src = user.avatar;
    
    updateStatsDisplay(user.stats || {});
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

function updateSettingsForm(user) {
    if (!user) return;
    
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const timezoneSelect = document.getElementById('timezone');
    const participationInput = document.getElementById('participation-area');
    const notificationsSelect = document.getElementById('notifications');
    
    if (nameInput) nameInput.value = user.fullName || '';
    if (emailInput) emailInput.value = user.email || '';
    if (timezoneSelect) timezoneSelect.value = user.preferences?.timezone || 'est';
    if (participationInput) participationInput.value = user.preferences?.participationArea || '';
    if (notificationsSelect) notificationsSelect.value = user.preferences?.notifications || 'all';
}

// ===== INTERACTIVE FEATURES =====
function updateJoinButtonEvent() {
    const joinBtn = document.querySelector('.join-btn');
    if (joinBtn) {
        joinBtn.onclick = function() {
            if (isLoggedIn && isLoggedIn()) {
                handleJoinEvent();
            } else {
                const modal = new bootstrap.Modal(document.getElementById('authModal'));
                modal.show();
            }
        };
    }
}

function enableInteractiveFeatures() {
    const joinBtn = document.querySelector('.join-btn');
    if (joinBtn) {
        joinBtn.disabled = false;
        joinBtn.textContent = 'Join This Event';
        joinBtn.style.backgroundColor = '';
    }
    
    // Enable event table rows if they exist
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
                <button class="btn btn-sm btn-success" data-bs-toggle="modal" data-bs-target="#authModal">
                    Sign In Now
                </button>
            </td>
        `;
        tableBody.appendChild(promptRow);
    }
}

// ===== EVENT HANDLING =====
function initializeEventJoining() {
    const joinBtn = document.querySelector('.join-btn');
    if (joinBtn) {
        joinBtn.addEventListener('click', handleJoinEvent);
    }
}

function handleJoinEvent() {
    if (typeof getCurrentUser === 'undefined' || !getCurrentUser()) {
        const modal = new bootstrap.Modal(document.getElementById('authModal'));
        modal.show();
        return;
    }
    
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // Update user stats using the auth system function
    const statsUpdate = {
        events: (currentUser.stats?.events || 0) + 1,
        hours: (currentUser.stats?.hours || 0) + 4,
        ecoPoints: (currentUser.stats?.ecoPoints || 0) + 50,
        streak: (currentUser.stats?.streak || 0) + 1,
        impact: Math.min(100, (currentUser.stats?.impact || 0) + 5)
    };
    
    if (typeof updateUserStats === 'function' && updateUserStats(statsUpdate)) {
        updateStatsDisplay(getCurrentUser().stats);
        
        // Use the auth system's notification function if available, otherwise use fallback
        if (typeof showNotification === 'function') {
            showNotification('You have joined the Community Cleanup event! Details have been sent to your email.', 'success');
        } else {
            alert('You have joined the Community Cleanup event! Details have been sent to your email.');
        }
        
        const joinBtn = document.querySelector('.join-btn');
        if (joinBtn) {
            joinBtn.textContent = 'Joined ✓';
            joinBtn.style.backgroundColor = '#4caf50';
            joinBtn.disabled = true;
        }
        
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
    
    // Use the auth system's notification function if available
    if (typeof showNotification === 'function') {
        showNotification(`Event: ${eventName}\nDate: ${eventDate}\nTime: ${eventTime}\nPoints: ${eventPoints}`, 'info');
    } else {
        alert(`Event: ${eventName}\nDate: ${eventDate}\nTime: ${eventTime}\nPoints: ${eventPoints}`);
    }
}

// ===== CALENDAR FUNCTIONS =====
function initializeCalendar() {
    const currentMonthElement = document.getElementById('current-month');
    const calendarDaysElement = document.getElementById('calendar-days');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const todayBtn = document.getElementById('today-btn');
    const eventList = document.getElementById('event-list');
    const eventsCount = document.getElementById('events-count');
    const monthSelect = document.getElementById('month-select');
    const yearSelect = document.getElementById('year-select');
    const eventSearch = document.getElementById('event-search');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const viewToggleButtons = document.querySelectorAll('.view-toggle-btn');
    const quickAddBtn = document.getElementById('quick-add-btn');
    
    if (!currentMonthElement || !calendarDaysElement) return;
    
    let currentDate = new Date();
    let currentFilter = 'all';
    let searchQuery = '';
    
    initializeYearSelect();
    updateCalendar();
    updateEventList();
    
    // Event Listeners
    if (prevMonthBtn) prevMonthBtn.addEventListener('click', () => {
        fadeCalendar(() => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            updateSelects();
            updateCalendar();
            updateEventList();
        });
    });
    
    if (nextMonthBtn) nextMonthBtn.addEventListener('click', () => {
        fadeCalendar(() => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            updateSelects();
            updateCalendar();
            updateEventList();
        });
    });
    
    if (todayBtn) todayBtn.addEventListener('click', () => {
        fadeCalendar(() => {
            currentDate = new Date();
            updateSelects();
            updateCalendar();
            updateEventList();
        });
    });
    
    if (monthSelect) monthSelect.addEventListener('change', () => {
        fadeCalendar(() => {
            currentDate.setMonth(parseInt(monthSelect.value));
            updateCalendar();
            updateEventList();
        });
    });
    
    if (yearSelect) yearSelect.addEventListener('change', () => {
        fadeCalendar(() => {
            currentDate.setFullYear(parseInt(yearSelect.value));
            updateCalendar();
            updateEventList();
        });
    });
    
    if (eventSearch) eventSearch.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        updateEventList();
    });
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.dataset.filter;
            updateEventList();
        });
    });
    
    if (viewToggleButtons.length > 0) {
        viewToggleButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (!button.classList.contains('active')) {
                    viewToggleButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    if (typeof showNotification === 'function') {
                        showNotification(`Switched to ${button.dataset.view} view`);
                    }
                }
            });
        });
    }
    
    if (quickAddBtn) {
        quickAddBtn.addEventListener('click', () => {
            openEventModal(new Date(), []);
        });
    }
    
    // Helper Functions
    function initializeYearSelect() {
        if (!yearSelect) return;
        
        yearSelect.innerHTML = '';
        const currentYear = new Date().getFullYear();
        
        for (let year = currentYear - 5; year <= currentYear + 5; year++) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            if (year === currentDate.getFullYear()) option.selected = true;
            yearSelect.appendChild(option);
        }
    }
    
    function updateSelects() {
        if (monthSelect) monthSelect.value = currentDate.getMonth();
        if (yearSelect) yearSelect.value = currentDate.getFullYear();
    }
    
    function fadeCalendar(callback) {
        const calendarContainer = document.querySelector('.calendar-days-container');
        if (calendarContainer) {
            calendarContainer.classList.add('fade-out');
            setTimeout(() => {
                callback();
                setTimeout(() => {
                    calendarContainer.classList.remove('fade-out');
                }, 50);
            }, 150);
        } else callback();
    }
    
    function updateCalendar() {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];
        currentMonthElement.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
        
        calendarDaysElement.innerHTML = '';
        
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        let startingDay = firstDay.getDay();
        
        // Empty cells for days before the first of the month
        for (let i = 0; i < startingDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'day-cell empty';
            calendarDaysElement.appendChild(emptyCell);
        }
        
        const today = new Date();
        const isCurrentMonth = today.getMonth() === currentDate.getMonth() && 
                              today.getFullYear() === currentDate.getFullYear();
        
        // Create cells for each day of the month
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'day-cell';
            
            const cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const dayOfWeek = cellDate.getDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) dayCell.classList.add('weekend');
            if (isCurrentMonth && day === today.getDate()) dayCell.classList.add('today');
            
            const eventsForDay = getEventsForDate(cellDate);
            
            const dayNumber = document.createElement('div');
            dayNumber.className = 'day-number';
            dayNumber.textContent = day;
            dayCell.appendChild(dayNumber);
            
            // Add event indicators
            if (eventsForDay.length > 0) {
                const eventIndicators = document.createElement('div');
                eventIndicators.className = 'event-indicators';
                
                eventsForDay.slice(0, 3).forEach(event => {
                    const indicator = document.createElement('div');
                    indicator.className = `event-indicator ${event.type}`;
                    indicator.title = event.title;
                    eventIndicators.appendChild(indicator);
                });
                
                if (eventsForDay.length > 3) {
                    const moreIndicator = document.createElement('div');
                    moreIndicator.className = 'event-indicator more';
                    moreIndicator.title = `+${eventsForDay.length - 3} more events`;
                    eventIndicators.appendChild(moreIndicator);
                }
                
                dayCell.appendChild(eventIndicators);
            }
            
            // Add "Today" badge if applicable
            if (isCurrentMonth && day === today.getDate()) {
                const todayBadge = document.createElement('div');
                todayBadge.className = 'today-badge';
                todayBadge.textContent = 'Today';
                dayCell.appendChild(todayBadge);
            }
            
            // Day cell event listeners
            dayCell.addEventListener('click', () => {
                if (eventsForDay.length > 0) {
                    showDayEvents(cellDate, eventsForDay);
                } else {
                    openEventModal(cellDate, []);
                }
                
                document.querySelectorAll('.day-cell').forEach(cell => {
                    cell.classList.remove('selected');
                });
                dayCell.classList.add('selected');
            });
            
            calendarDaysElement.appendChild(dayCell);
        }
        
        // Fill remaining cells to complete the grid
        const totalCells = startingDay + lastDay.getDate();
        const remainingCells = 42 - totalCells;
        
        for (let i = 0; i < remainingCells; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'day-cell empty';
            calendarDaysElement.appendChild(emptyCell);
        }
    }
    
    function updateEventList() {
        if (!eventList || !eventsCount) return;
        
        // Show loading state
        eventList.innerHTML = `
            <div class="loading-events">
                <div class="loading-spinner"></div>
                <div class="loading-text">Loading events...</div>
            </div>
        `;
        
        // Simulate loading and then render events
        setTimeout(() => {
            const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
            
            let eventsThisMonth = [];
            
            // Collect all events for the month
            for (let day = 1; day <= lastDay.getDate(); day++) {
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                const events = getEventsForDate(date);
                events.forEach(event => {
                    eventsThisMonth.push({
                        ...event,
                        day: day,
                        dayOfWeek: date.getDay()
                    });
                });
            }
            
            // Apply filters
            if (currentFilter !== 'all') {
                eventsThisMonth = eventsThisMonth.filter(event => event.type === currentFilter);
            }
            
            // Apply search query
            if (searchQuery) {
                eventsThisMonth = eventsThisMonth.filter(event => 
                    event.title.toLowerCase().includes(searchQuery) ||
                    event.description.toLowerCase().includes(searchQuery) ||
                    event.location.toLowerCase().includes(searchQuery)
                );
            }
            
            // Update events count
            eventsCount.textContent = `${eventsThisMonth.length} event${eventsThisMonth.length !== 1 ? 's' : ''}`;
            eventList.innerHTML = '';
            
            // Show empty state if no events
            if (eventsThisMonth.length === 0) {
                eventList.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">
                            <i class="far fa-calendar-times"></i>
                        </div>
                        <div class="empty-state-title">No events found</div>
                        <div class="empty-state-description">
                            ${searchQuery ? 'Try a different search term' : 
                              currentFilter !== 'all' ? 'Try changing the filter' : 
                              'No events scheduled for this month'}
                        </div>
                        <button class="btn btn-primary" style="padding: 8px 16px;" 
                                onclick="openEventModal(new Date(), [])">
                            Add New Event
                        </button>
                    </div>
                `;
                return;
            }
            
            // Sort events by day
            eventsThisMonth.sort((a, b) => a.day - b.day);
            
            // Group events by week
            const eventsByWeek = {};
            eventsThisMonth.forEach(event => {
                const weekNumber = Math.floor((event.day - 1) / 7);
                if (!eventsByWeek[weekNumber]) eventsByWeek[weekNumber] = [];
                eventsByWeek[weekNumber].push(event);
            });
            
            // Render events grouped by week
            Object.keys(eventsByWeek).forEach(week => {
                const weekEvents = eventsByWeek[week];
                
                if (weekEvents.length > 0) {
                    // Add week header
                    const weekHeader = document.createElement('div');
                    weekHeader.className = 'week-header';
                    const firstDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), weekEvents[0].day);
                    const lastDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), weekEvents[weekEvents.length - 1].day);
                    
                    weekHeader.innerHTML = `
                        <div class="week-title">
                            <i class="far fa-calendar-week"></i>
                            Week ${parseInt(week) + 1} 
                            <span class="week-dates">
                                (${firstDate.getDate()} - ${lastDate.getDate()} ${firstDate.toLocaleString('default', { month: 'short' })})
                            </span>
                        </div>
                    `;
                    eventList.appendChild(weekHeader);
                }
                
                // Add events for this week
                weekEvents.forEach(event => {
                    const eventItem = createEventItem(event);
                    eventList.appendChild(eventItem);
                });
            });
        }, 300);
    }
    
    function createEventItem(event) {
        const item = document.createElement('div');
        item.className = 'event-item';
        item.dataset.eventId = event.id;
        item.draggable = true;
        
        const eventDate = new Date(event.date);
        const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const weekday = weekdayNames[eventDate.getDay()];
        const monthName = eventDate.toLocaleString('default', { month: 'short' });
        const priority = event.participants < 10 ? 'high' : event.participants < 20 ? 'medium' : 'low';
        
        item.innerHTML = `
            <div class="event-color" style="background-color: ${event.color}"></div>
            <div class="priority-dot ${priority}"></div>
            <div class="event-info">
                <div class="event-title">${event.title}</div>
                <div class="event-desc">
                    <i class="far fa-clock"></i> ${event.time} • 
                    <i class="fas fa-map-marker-alt"></i> ${event.location}
                </div>
                <div class="event-date-badge">
                    ${weekday}, ${eventDate.getDate()} ${monthName}
                </div>
                <div class="event-time-badge">
                    <i class="fas fa-users"></i> ${event.participants} participants
                </div>
            </div>
            <div class="event-duration">${event.duration}</div>
            <div class="event-status status-upcoming">Upcoming</div>
        `;
        
        // Drag and drop functionality
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', event.id);
            item.classList.add('dragging');
        });
        
        item.addEventListener('dragend', () => item.classList.remove('dragging'));
        
        // Click to view event details
        item.addEventListener('click', (e) => {
            if (!e.target.classList.contains('event-duration') && 
                !e.target.classList.contains('event-status')) {
                showEventDetailsModal(event);
            }
        });
        
        return item;
    }
    
    function getEventsForDate(date) {
        // Sample events database
        const eventsDatabase = [
            {
                id: 1,
                title: "Community Cleanup",
                date: getFormattedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), 5)),
                time: "09:00",
                duration: "4h",
                type: "cleanup",
                location: "Central Park",
                participants: 24,
                description: "Join us for a community cleanup event at Central Park.",
                color: "#4caf50"
            },
            {
                id: 2,
                title: "Tree Planting Day",
                date: getFormattedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), 8)),
                time: "10:00",
                duration: "5h",
                type: "planting",
                location: "Green Valley",
                participants: 18,
                description: "Plant native trees to restore the local ecosystem.",
                color: "#8bc34a"
            },
            {
                id: 3,
                title: "Eco Workshop",
                date: getFormattedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), 12)),
                time: "14:00",
                duration: "2h",
                type: "workshop",
                location: "Community Center",
                participants: 12,
                description: "Learn about sustainable living practices.",
                color: "#ff9800"
            },
            {
                id: 4,
                title: "Bird Watching",
                date: getFormattedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), 15)),
                time: "07:00",
                duration: "3h",
                type: "wildlife",
                location: "Wildlife Sanctuary",
                participants: 8,
                description: "Morning bird watching with expert guides.",
                color: "#9c27b0"
            },
            {
                id: 5,
                title: "Park Maintenance",
                date: getFormattedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), 20)),
                time: "08:30",
                duration: "4h",
                type: "community",
                location: "Various Parks",
                participants: 30,
                description: "General park maintenance and improvements.",
                color: "#3f51b5"
            }
        ];
        
        const formattedDate = getFormattedDate(date);
        return eventsDatabase.filter(event => event.date === formattedDate);
    }
    
    function getFormattedDate(date) {
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    }
}

function showDayEvents(date, events) {
    const eventList = events.map(event => `• ${event.title} (${event.time})`).join('\n');
    showNotification(`Events on ${date.toLocaleDateString()}:\n${eventList}`);
}

function showEventDetailsModal(event) {
    const modal = document.createElement('div');
    modal.className = 'event-details-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal">&times;</button>
            <h3>${event.title}</h3>
            <p><strong>Date:</strong> ${event.date}</p>
            <p><strong>Time:</strong> ${event.time}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            <p><strong>Participants:</strong> ${event.participants}</p>
            <p><strong>Description:</strong> ${event.description}</p>
            <button class="btn btn-primary" onclick="joinCalendarEvent(${event.id})">Join Event</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Style the modal
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    modal.querySelector('.modal-content').style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 10px;
        max-width: 500px;
        width: 100%;
        position: relative;
    `;
    
    // Close button functionality
    modal.querySelector('.close-modal').onclick = () => modal.remove();
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
}

function joinCalendarEvent(eventId) {
    showNotification('Joined the event successfully!');
}

function openEventModal(date, events) {
    showNotification(`Add event to ${date.toLocaleDateString()}`);
}

// ===== PROFILE PICTURE FUNCTIONS =====
function initializeProfilePicture() {
    const changePicBtn = document.getElementById('change-pic-btn');
    const profileImg = document.getElementById('profile-img');
    
    if (!changePicBtn || !profileImg) return;
    
    createProfilePictureModal();
    
    changePicBtn.addEventListener('click', () => {
        showProfilePictureOptions();
    });
    
    // Load saved avatar
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
        profileImg.src = savedAvatar;
        // Update user account if exists
        if (typeof getCurrentUser === 'function') {
            const user = getCurrentUser();
            if (user) user.avatar = savedAvatar;
        }
    }
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.custom-notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `custom-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 
                          type === 'error' ? 'fa-exclamation-circle' : 
                          type === 'info' ? 'fa-info-circle' : 
                          'fa-bell'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .custom-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'success' ? '#4caf50' : 
                            type === 'error' ? '#f44336' : 
                            type === 'info' ? '#2196f3' : '#ff9800'};
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                animation: slideIn 0.3s ease-out;
                display: flex;
                align-items: center;
                justify-content: space-between;
                min-width: 300px;
                max-width: 400px;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
                flex: 1;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
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
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ===== UTILITY FUNCTIONS =====
// Export for debugging if needed
window.getUserAccount = () => getCurrentUser ? getCurrentUser() : null;
window.resetAccount = () => {
    localStorage.removeItem('ecoHubUserAccount');
    localStorage.removeItem('userAvatar');
    location.reload();
};