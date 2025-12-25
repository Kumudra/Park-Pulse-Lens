document.addEventListener('DOMContentLoaded', () => {
     setTimeout(function() {
        // Get all progress circles
        const progressCircles = document.querySelectorAll('.circle-progress-bar');
        
        progressCircles.forEach(circle => {
            const percentage = circle.dataset.percentage;
            const circumference = 251.2; // 2 * π * r (r = 40)
            const offset = circumference - (circumference * percentage / 100);
            
            // Set CSS custom property for animation
            circle.style.setProperty('--percentage', percentage + '%');
            
            // Animate the circle
            circle.style.strokeDashoffset = circumference;
            setTimeout(() => {
                circle.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
                circle.style.strokeDashoffset = offset;
            }, 300);
        });
        
        // Add counter animation to percentage displays
        const percentageDisplays = document.querySelectorAll('.percentage-display');
        percentageDisplays.forEach(display => {
            const finalValue = display.textContent.replace('%', '');
            display.textContent = '0%';
            
            let current = 0;
            const increment = finalValue / 50; // 50 steps over 1.5 seconds
            
            const counter = setInterval(() => {
                current += increment;
                if (current >= finalValue) {
                    current = finalValue;
                    clearInterval(counter);
                }
                display.textContent = Math.round(current) + '%';
            }, 30);
        });
        
        // Add hover effect enhancement
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                const progressBar = this.querySelector('.circle-progress-bar');
                if (progressBar) {
                    progressBar.style.strokeWidth = '12';
                    progressBar.style.filter = 'drop-shadow(0 0 8px rgba(0,0,0,0.2))';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                const progressBar = this.querySelector('.circle-progress-bar');
                if (progressBar) {
                    progressBar.style.strokeWidth = '10';
                    progressBar.style.filter = 'none';
                }
            });
        });
        
    }, 500); // Delay to ensure page is loaded

    // Notification for team cards section
    const teamSection = document.querySelector('.wtextcontainer');
    const notification = document.getElementById('notification');
    if (teamSection && notification) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    notification.style.display = 'block';
                    setTimeout(() => {
                        notification.style.display = 'none';
                    }, 5000); // Hide after 5 seconds
                    observer.unobserve(entry.target); // Stop observing after first trigger
                }
            });
        }, { threshold: 0.8 }); // Trigger when 80% of the section is visible
        observer.observe(teamSection);
    }

    // Initialize the map
    const map = L.map('map').setView([16.8053, 96.1551], 13); // Coordinates for Tha Khin Mya Park, Yangon, Myanmar, zoomed out to show more parks

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // List of parks in Yangon with their coordinates
    const parks = [
        { name: 'Tha Khin Mya Park', lat: 16.8053, lng: 96.1551 },
        { name: 'Kandawgyi Lake Park', lat: 16.7835, lng: 96.1492 },
        { name: 'People\'s Park', lat: 16.7778, lng: 96.1583 },
        { name: 'Inya Lake Park', lat: 16.8278, lng: 96.1325 },
        { name: 'Hlawga National Park', lat: 17.0833, lng: 96.0833 },
        { name: 'Aung San Suu Kyi Park', lat: 16.8050, lng: 96.1550 },
        { name: 'Maha Bandula Park', lat: 16.7830, lng: 96.1580 },
        { name: 'Yangon Zoological Gardens', lat: 16.7830, lng: 96.1490 }
    ];

    // Add markers for all parks
    let thaKhinMyaMarker;
    parks.forEach(park => {
        const marker = L.marker([park.lat, park.lng]).addTo(map)
            .bindPopup(`${park.name}<br>Yangon, Myanmar`);
        if (park.name === 'Tha Khin Mya Park') {
            thaKhinMyaMarker = marker;
        }
    });

    // Open popup for Tha Khin Mya Park by default
    if (thaKhinMyaMarker) {
        thaKhinMyaMarker.openPopup();
    }

    // Card animation code (existing functionality)
    const cards = document.querySelectorAll('.card');
    let activeIndex = 1; // Initially, the middle card (index 1) is active
    let hovered = null;
    
    // Function to calculate a dynamic radius based on screen size for responsive scaling
    function getDynamicRadius() {
        const screenWidth = window.innerWidth;
            // Phone (0-480px)
            if (screenWidth <= 480) {
                return screenWidth * 0.18; // Larger percentage for smaller screens
            }
            // Larger Phone / Small Tablet (481-768px)
            else if (screenWidth <= 768) {
                return screenWidth * 0.16;
            }
            // Tablet (769-1024px)
            else if (screenWidth <= 1024) {
                return screenWidth * 0.14;
            }
            // Desktop (1025px+)
            else {
                return 150;
            }
}
    
    function updatePositions() {
        const radius = getDynamicRadius(); // Get the radius dynamically
        cards.forEach((card, index) => {
            // Calculate circular position: 0 = center, 1 = right, 2 = left
            const pos = (index - activeIndex + 3) % 3;
            let angle = 0;
            let scale = 1.2;
            let zIndex = 10; // Center on top
            if (pos === 1) { // right
                angle = 60; // degrees
                scale = 0.8;
                zIndex = 5;
            } else if (pos === 2) { // left
                angle = -60;
                scale = 0.8;
                zIndex = 5;
            }
            // Calculate x and y for arc positioning (2D arc for bottoms)
            const rad = (angle * Math.PI) / 180; // Convert to radians
            const x = radius * Math.sin(rad);
            const y = radius * (1 - Math.cos(rad)); // Adjust so bottoms are at y=0 relative to center
            let rotate = angle; // Tilt matches the angle for arch effect
            let translateYHover = (hovered === card) ? -10 : 0; // Lift on hover
            card.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg) scale(${scale}) translateY(${translateYHover}px)`;
            card.style.zIndex = zIndex;
        });
    }
    // Initial setup
    updatePositions();
    
    // Recalculate positions on window resize to ensure responsiveness
    window.addEventListener('resize', updatePositions);
    
    // Event listeners
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            hovered = card;
            updatePositions();
        });
        card.addEventListener('mouseleave', () => {
            hovered = null;
            updatePositions();
        });
        card.addEventListener('click', () => {
            activeIndex = parseInt(card.dataset.index);
            updatePositions();
        });
    });
});