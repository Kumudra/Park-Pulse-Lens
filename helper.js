// helper.js - Simple helper functions
function showAuthNotification(message, type = 'info') {
    // Simple alert for now
    if (type === 'error') {
        alert('Error: ' + message);
    } else if (type === 'success') {
        alert('Success: ' + message);
    } else {
        alert(message);
    }
}

function redirectToDashboard() {
    window.location.href = 'Dashboard.html';
}

function redirectToHome() {
    window.location.href = 'index.html';
}

// Add to window object
window.showAuthNotification = showAuthNotification;
window.redirectToDashboard = redirectToDashboard;
window.redirectToHome = redirectToHome;