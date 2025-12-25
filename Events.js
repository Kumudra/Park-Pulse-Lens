// ==============================
// DATA & CONFIGURATION
// ==============================

// Image mapping
const imageMap = {
    'thakhinmya': 'url(./images/upcoming1.jpg)',
    'ahlon': 'url(./images/upcoming2.jpg)',
    'kengtung': 'url(./images/hosting1.jpg)',
    'trail': 'url(./images/hosting2.jpg)',
    'ahlon2': 'url(./images/hosted1.jpg)',
    'kengtung2': 'url(./images/hosted2.jpg)',
};

// Search aliases for flexible matching
const searchAliases = {
    'clean up': ['cleansup', 'cleanup', 'cleaning', 'clean', 'cleans up', 'trash', 'garbage', 'litter', 'waste', 'debris', 'pollution'],
    'planting': ['plant', 'plants', 'tree planting', 'gardening', 'garden', 'reforestation', 'greenery', 'vegetation', 'flora', 'tree', 'trees'],
    'rebuilding': ['rebuild', 'reconstruction', 'restoration', 'renovation', 'repair', 'fix', 'construction', 'building', 'structure', 'improvement']
};

// Sample data for park revitalization projects
const projectsData = {
    upcoming: [
        {
            title: "Tha Khin Mya Park Cleanup",
            location: "Tha Khin Mya Park, Yangon",
            date: "Jan 15, 2026",
            description: "Organizing a park-wide cleanup to remove litter and restore the beauty of Maha Tha Khin Mya Park. We'll focus on plastic waste removal and recycling education.",
            tags: ["cleansup", "planting"],
            progress: 10,
            image: "thakhinmya"
        },
        {
            title: "Ahlone Playground Restoration",
            location: "Ahlone Park, Yangon",
            date: "Jan 5, 2026",
            description: "Repairing damaged benches and playground equipment to make the park safe and welcoming again for children and families.",
            tags: ["rebuilding"],
            progress: 5,
            image: "ahlon"
        }
    ],
    hosting: [
        {
            title: "Native Species Planting",
            location: "Keng Tung Park, Yangon",
            date: "Dec 10, 2025",
            description: "Planting native trees and shrubs to restore the park's natural ecosystem and provide habitat for local wildlife.",
            tags: ["planting"],
            progress: 35,
            image: "kengtung"
        },
        {
            title: "Greenway Trail Maintenance",
            location: "Yangon Greenway System",
            date: "Ongoing",
            description: "Maintaining walking trails, clearing overgrowth, and installing educational signage along Yangon's greenway network.",
            tags: ["cleansup", "rebuilding"],
            progress: 67,
            image: "trail"
        }
    ],
    hosted: [
        {
            title: "Park Eco-Revitalization",
            location: "Ahlone Park, Yangon",
            date: "Aug 23, 2025",
            description: "Complete park revitalization including new eco-friendly playground equipment, solar-powered lighting, and native plant gardens.",
            tags: ["planting", "cleansup", "rebuilding"],
            progress: 100,
            image: "ahlon2"
        },
        {
            title: "Park Waterfront Cleanup",
            location: "Keng Tung Park, Yangon",
            date: "May 5, 2025",
            description: "Volunteers removed 2 tons of debris from the park's waterfront area and installed new waste separation stations.",
            tags: ["cleansup"],
            progress: 100,
            image: "kengtung2"
        }
    ]
};

// Detailed modal descriptions
const detailedDescriptions = {
    "Tha Khin Mya Park Cleanup": "This comprehensive cleanup initiative targets one of Yangon's largest public parks. Over three days, volunteers will remove plastic waste, segregate recyclables, and restore natural areas. The project includes educational workshops on waste management and installing permanent recycling stations throughout the park. We expect to collect and properly dispose of over 3 tons of waste while engaging 500+ community volunteers.",
    
    "Ahlone Park Playground Restoration": "This safety-focused restoration will completely refurbish Ahlone Park's aging playground. We're replacing worn equipment with modern, inclusive play structures, installing rubberized safety surfacing, and adding shaded seating areas for parents. The project also includes repairing park benches, installing solar-powered lighting for evening safety, and creating educational signage about playground safety rules.",
    
    "Keng Tung Park Native Species Planting": "This ecological restoration focuses on reintroducing native Myanmar flora to Keng Tung Park. Volunteers will plant over 300 native trees including teak, padauk, and pyinkado, along with medicinal plants traditionally used in Myanmar. The project includes installing irrigation systems, protective tree guards, and educational signs about each species' cultural and ecological importance.",
    
    "Yangon Greenway Trail Maintenance": "Our team maintains 15km of Yangon's greenway trails, ensuring safe access for walkers, joggers, and cyclists. Work includes clearing monsoon-season overgrowth, repairing erosion damage, improving drainage systems, and installing bilingual (Burmese/English) directional signage. We're also adding rest areas with traditional bamboo benches and creating wildlife observation points.",
    
    "Ahlone Park Eco-Revitalization": "This successful project transformed Ahlone Park into an eco-friendly community space. Achievements include: installing solar-powered lighting throughout the park, creating a medicinal plant garden with 50 native species, building a rainwater harvesting system, and constructing an eco-friendly playground using recycled materials. Post-project surveys show a 200% increase in park usage and improved community pride.",
    
    "Keng Tung Park Waterfront Cleanup": "This intensive cleanup successfully restored Keng Tung Park's waterfront area. Volunteers removed 2 tons of debris including plastic bottles, fishing nets, and construction waste. The project installed 10 new waste separation stations, created riparian buffers with native plants to prevent erosion, and established a community monitoring program to maintain the area's cleanliness."
};

// ==============================
// GLOBAL STATE
// ==============================
let currentFilter = 'all';
let currentSearchTerm = '';

// ==============================
// UTILITY FUNCTIONS
// ==============================

/**
 * Get display name for category
 */
function getCategoryDisplayName(category) {
    const names = {
        'upcoming': 'Upcoming',
        'hosting': 'Current',
        'hosted': 'Completed'
    };
    return names[category] || category;
}

/**
 * Calculate end date based on start date
 */
function getEndDate(startDate) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + 90);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Calculate responsive card width
 */
function calculateCardWidth() {
    const screenWidth = window.innerWidth;
    if (screenWidth < 576) return 300;
    if (screenWidth < 768) return 280;
    if (screenWidth < 992) return 260;
    return 320;
}

/**
 * Calculate cards per slide based on screen width
 */
function calculateCardsPerSlide(containerWidth) {
    const screenWidth = window.innerWidth;
    const cardWidth = calculateCardWidth();
    const cardsPerSlide = Math.max(1, Math.floor(containerWidth / cardWidth));
    
    // Ensure minimum 2 cards on tablet and larger
    if (screenWidth >= 768 && cardsPerSlide < 2) {
        return 2;
    }
    return cardsPerSlide;
}

// ==============================
// CARD CREATION FUNCTIONS
// ==============================

/**
 * Create a card element for a project
 */
function createCard(project, category, index) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.projectIndex = index;
    card.dataset.category = category;
    card.dataset.tags = project.tags.join(' ');
    
    // Determine status class and text
    const { statusClass, statusText } = getStatusInfo(category);
    
    // Create tags HTML
    const tagsHTML = createTagsHTML(project.tags);
    
    // Create progress bar HTML
    const progressBarHTML = createProgressBarHTML(project, category);
    
    // Create card HTML
    card.innerHTML = `
        <div class="card-image" style="background: ${imageMap[project.image]}"></div>
        <div class="card-content">
            <div class="card-header">
                <div>
                    <h3 class="card-title">${project.title}</h3>
                    <p class="location"><i class="fas fa-map-marker-alt"></i> ${project.location}</p>
                    <p class="date"><i class="far fa-calendar-alt"></i> ${project.date}</p>
                </div>
                <span class="status ${statusClass}">${statusText}</span>
            </div>
            <p class="card-description">${project.description}</p>
            <div class="card-actions">
                <button class="btn btn-primary participate-btn" data-bs-toggle="modal" data-bs-target="#participateModal">Check Info</button>
            </div>
            ${progressBarHTML}
            <div class="tags">
                ${tagsHTML}
            </div>
        </div>
    `;
    
    return card;
}

/**
 * Get status information for a category
 */
function getStatusInfo(category) {
    switch (category) {
        case 'upcoming':
            return { statusClass: 'status-upcoming', statusText: 'Upcoming' };
        case 'hosting':
            return { statusClass: 'status-hosting', statusText: 'In Progress' };
        case 'hosted':
            return { statusClass: 'status-hosted', statusText: 'Completed' };
        default:
            return { statusClass: '', statusText: '' };
    }
}

/**
 * Create HTML for tags
 */
function createTagsHTML(tags) {
    return tags.map(tag => {
        let tagClass = 'tag';
        let tagIcon = '';
        
        if (tag === 'planting') {
            tagClass += ' tag-planting';
            tagIcon = '<i class="fas fa-seedling"></i>';
        } else if (tag === 'cleansup') {
            tagClass += ' tag-cleansup';
            tagIcon = '<i class="fas fa-broom"></i>';
        } else if (tag === 'rebuilding') {
            tagClass += ' tag-rebuilding';
            tagIcon = '<i class="fas fa-hammer"></i>';
        }
        
        const displayText = tag.charAt(0).toUpperCase() + tag.slice(1);
        return `<span class="${tagClass}">${tagIcon} ${displayText}</span>`;
    }).join('');
}

/**
 * Create HTML for progress bar
 */
function createProgressBarHTML(project, category) {
    if (category === 'hosted') return '';
    
    let progressClass = 'progress-fill';
    if (project.tags.includes('planting')) progressClass += ' progress-planting';
    else if (project.tags.includes('cleansup')) progressClass += ' progress-cleansup';
    else if (project.tags.includes('rebuilding')) progressClass += ' progress-rebuilding';
    
    return `
        <div class="progress-container">
            <div class="progress-label">
                <span>Progress</span>
                <span>${project.progress}%</span>
            </div>
            <div class="progress-bar">
                <div class="${progressClass}" style="width: ${project.progress}%"></div>
            </div>
        </div>
    `;
}

// ==============================
// FILTERING & SEARCH FUNCTIONS
// ==============================

/**
 * Filter projects based on current filter and search term
 */
function filterProjects() {
    const allCards = document.querySelectorAll('.card');
    let visibleCount = 0;
    
    allCards.forEach(card => {
        const cardTags = card.dataset.tags.toLowerCase();
        const cardTitle = card.querySelector('.card-title').textContent.toLowerCase();
        const cardDescription = card.querySelector('.card-description').textContent.toLowerCase();
        const cardLocation = card.querySelector('.location').textContent.toLowerCase();
        
        // Check filter
        const filterPass = checkFilterPass(cardTags);
        
        // Check search
        const searchPass = checkSearchPass(cardTitle, cardDescription, cardLocation, cardTags);
        
        // Show or hide card based on both filters
        if (filterPass && searchPass) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    updateCarouselsAfterFilter();
    showNoProjectsMessage(visibleCount === 0);
}

/**
 * Check if card passes the current filter
 */
function checkFilterPass(cardTags) {
    if (currentFilter === 'all') return true;
    
    switch (currentFilter) {
        case 'cleansup':
            return cardTags.includes('cleansup');
        case 'planting':
            return cardTags.includes('planting');
        case 'rebuilding':
            return cardTags.includes('rebuilding');
        default:
            return true;
    }
}

/**
 * Check if card passes the current search term
 */
function checkSearchPass(cardTitle, cardDescription, cardLocation, cardTags) {
    if (!currentSearchTerm) return true;
    
    const searchTerm = currentSearchTerm.toLowerCase().trim();
    
    // Direct text matching
    let directMatch = cardTitle.includes(searchTerm) || 
                     cardDescription.includes(searchTerm) || 
                     cardLocation.includes(searchTerm) ||
                     cardTags.includes(searchTerm);
    
    // If no direct match, check aliases
    if (!directMatch && searchAliases) {
        directMatch = checkAliasMatch(searchTerm, cardTags, cardTitle, cardDescription);
    }
    
    return directMatch;
}

/**
 * Check if search term matches any aliases
 */
function checkAliasMatch(searchTerm, cardTags, cardTitle, cardDescription) {
    for (const [mainTerm, aliases] of Object.entries(searchAliases)) {
        const allTerms = [mainTerm, ...aliases];
        
        // Check if search term matches any of the terms
        const termMatches = allTerms.some(term => {
            const termLower = term.toLowerCase();
            const searchLower = searchTerm.toLowerCase();
            
            return termLower === searchLower || 
                   termLower.includes(searchLower) || 
                   searchLower.includes(termLower);
        });
        
        if (termMatches) {
            // Map the main term to the actual tag
            let tagToCheck = '';
            switch (mainTerm) {
                case 'clean up':
                    tagToCheck = 'cleansup';
                    break;
                case 'planting':
                    tagToCheck = 'planting';
                    break;
                case 'rebuilding':
                    tagToCheck = 'rebuilding';
                    break;
            }
            
            // Check if card has this tag
            if (tagToCheck && cardTags.includes(tagToCheck)) {
                return true;
            }
            
            // Also check if any alias appears in card text
            for (const alias of allTerms) {
                if (cardTitle.includes(alias.toLowerCase()) || 
                    cardDescription.includes(alias.toLowerCase())) {
                    return true;
                }
            }
        }
    }
    
    return false;
}

/**
 * Clear all filters and search
 */
function clearAllFilters() {
    currentFilter = 'all';
    currentSearchTerm = '';
    
    // Update radial filter UI
    document.querySelectorAll('.radial-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Clear search input
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Apply filter
    filterProjects();
    
    // Scroll to filter section
    document.querySelector('#filter').scrollIntoView({ behavior: 'smooth' });
}

// ==============================
// CAROUSEL FUNCTIONS
// ==============================

/**
 * Initialize carousels with projects data
 */
function initializeCarousels() {
    for (const category in projectsData) {
        const carousel = document.getElementById(`${category}-carousel`);
        const indicator = document.getElementById(`${category}-indicator`);
        
        if (!carousel) continue;
        
        // Clear existing content
        carousel.innerHTML = '';
        if (indicator) indicator.innerHTML = '';
        
        // Add cards to carousel
        projectsData[category].forEach((project, index) => {
            const card = createCard(project, category, index);
            carousel.appendChild(card);
        });
        
        // Check if carousel is empty after filtering
        checkAndAddEmptyState(carousel, category);
        
        // Calculate number of slides
        const cardsPerSlide = calculateCardsPerSlide(carousel.parentElement.offsetWidth);
        const totalSlides = Math.ceil(projectsData[category].length / cardsPerSlide);
        
        // Create indicators if needed
        if (indicator && totalSlides > 1) {
            createIndicators(indicator, totalSlides, category);
        }
        
        // Store carousel state
        carousel.dataset.currentSlide = 0;
        carousel.dataset.totalSlides = totalSlides;
        carousel.dataset.cardsPerSlide = cardsPerSlide;
        carousel.dataset.cardWidth = calculateCardWidth();
    }
    
    // Apply any existing filters
    filterProjects();
}

/**
 * Create carousel indicators
 */
function createIndicators(indicator, totalSlides, category) {
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = i === 0 ? 'dot active' : 'dot';
        dot.addEventListener('click', () => {
            goToSlide(category, i);
        });
        indicator.appendChild(dot);
    }
}

/**
 * Navigate to specific slide in carousel
 */
function goToSlide(category, slideIndex) {
    const carousel = document.getElementById(`${category}-carousel`);
    const indicator = document.getElementById(`${category}-indicator`);
    
    if (!carousel) return;
    
    const currentSlide = parseInt(carousel.dataset.currentSlide);
    const totalSlides = parseInt(carousel.dataset.totalSlides);
    
    // Ensure slide index is within bounds
    if (slideIndex < 0) slideIndex = totalSlides - 1;
    if (slideIndex >= totalSlides) slideIndex = 0;
    
    // Calculate translation
    const cardWidth = calculateCardWidth();
    const cardsPerSlide = parseInt(carousel.dataset.cardsPerSlide);
    const translateX = -slideIndex * cardsPerSlide * cardWidth;
    carousel.style.transform = `translateX(${translateX}px)`;
    
    // Update active indicator
    if (indicator) {
        const dots = indicator.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.className = index === slideIndex ? 'dot active' : 'dot';
        });
    }
    
    // Update current slide
    carousel.dataset.currentSlide = slideIndex;
}

/**
 * Handle carousel navigation button clicks
 */
function handleCarouselNavigation(e) {
    const button = e.target.closest('.carousel-btn');
    if (!button) return;
    
    const category = button.dataset.category;
    const carousel = document.getElementById(`${category}-carousel`);
    
    if (!carousel) return;
    
    const currentSlide = parseInt(carousel.dataset.currentSlide);
    
    if (button.classList.contains('next-btn')) {
        goToSlide(category, currentSlide + 1);
    } else if (button.classList.contains('prev-btn')) {
        goToSlide(category, currentSlide - 1);
    }
}

/**
 * Update carousels after filtering
 */
function updateCarouselsAfterFilter() {
    const categories = ['upcoming', 'hosting', 'hosted'];
    
    categories.forEach(category => {
        const carousel = document.getElementById(`${category}-carousel`);
        const indicator = document.getElementById(`${category}-indicator`);
        
        if (!carousel) return;
        
        // Check and update empty state
        checkAndAddEmptyState(carousel, category);
        
        // Get visible cards in this carousel
        const visibleCards = Array.from(carousel.querySelectorAll('.card')).filter(card => 
            card.style.display !== 'none'
        );
        
        // Hide indicator if carousel is empty
        if (indicator) {
            indicator.style.display = visibleCards.length > 0 ? 'flex' : 'none';
        }
        
        // Clear and rebuild indicators if needed
        if (indicator && visibleCards.length > 0) {
            indicator.innerHTML = '';
            
            const cardsPerSlide = calculateCardsPerSlide(carousel.parentElement.offsetWidth);
            const totalSlides = Math.ceil(visibleCards.length / cardsPerSlide);
            
            createIndicators(indicator, totalSlides, category);
            
            // Store carousel state
            carousel.dataset.currentSlide = 0;
            carousel.dataset.totalSlides = totalSlides;
            carousel.dataset.cardsPerSlide = cardsPerSlide;
            
            // Reset carousel position
            carousel.style.transform = 'translateX(0px)';
        }
        
        // Hide carousel controls if empty
        const categoryHeader = carousel.closest('.category').querySelector('.category-header');
        if (categoryHeader) {
            const carouselControls = categoryHeader.querySelector('.carousel-controls');
            if (carouselControls) {
                carouselControls.style.display = visibleCards.length > 0 ? 'flex' : 'none';
            }
        }
    });
}

/**
 * Check if carousel is empty and add placeholder
 */
function checkAndAddEmptyState(carousel, category) {
    // Remove any existing empty state
    const existingEmptyState = carousel.querySelector('.empty-carousel-state');
    if (existingEmptyState) {
        existingEmptyState.remove();
    }
    
    // Check if carousel has any visible cards
    const hasVisibleCards = Array.from(carousel.querySelectorAll('.card')).some(card => 
        card.style.display !== 'none'
    );
    
    if (!hasVisibleCards) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-carousel-state';
        emptyState.innerHTML = `
            <div class="empty-state-content">
                <div class="empty-state-image">
                    <img src="images/events-no.png" alt="No projects found" />
                </div>
                <div class="empty-state-message">
                    <h4>No ${getCategoryDisplayName(category)} Projects Found</h4>
                    <p>Try adjusting your filters or check back later for new projects.</p>
                </div>
            </div>
        `;
        carousel.appendChild(emptyState);
    }
}

// ==============================
// RADIAL FILTER FUNCTIONS
// ==============================

/**
 * Initialize radial filter functionality
 */
function initializeRadialFilter() {
    const radialItems = document.querySelectorAll('.radial-item');
    const centerHub = document.querySelector('.center-hub');
    
    // Make the center hub clickable (clear all filter)
    if (centerHub) {
        centerHub.style.cursor = 'pointer';
        centerHub.title = 'Clear all filters';
        centerHub.addEventListener('click', () => {
            clearAllFilters();
            
            // Add visual feedback
            centerHub.style.transform = 'translate(-50%, -50%) scale(1.1)';
            setTimeout(() => {
                centerHub.style.transform = 'translate(-50%, -50%) scale(1)';
            }, 200);
        });
    }
    
    radialItems.forEach(item => {
        item.addEventListener('click', function() {
            const filterText = this.querySelector('span').textContent.toLowerCase();
            
            // Map filter text to tag names
            let filterType = 'all';
            if (filterText.includes('clean')) {
                filterType = 'cleansup';
            } else if (filterText.includes('plant')) {
                filterType = 'planting';
            } else if (filterText.includes('rebuild')) {
                filterType = 'rebuilding';
            }
            
            // Toggle active state
            if (currentFilter === filterType) {
                // Clicking the same filter clears it
                currentFilter = 'all';
                this.classList.remove('active');
            } else {
                // Set new filter
                currentFilter = filterType;
                radialItems.forEach(ri => ri.classList.remove('active'));
                this.classList.add('active');
            }
            
            // Apply filter
            filterProjects();
        });
    });
}

// ==============================
// SEARCH FUNCTIONS
// ==============================

/**
 * Initialize search functionality
 */
function initializeSearch() {
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.querySelector('.search-input');
    
    // Initialize search recommendations
    initializeSearchRecommendations();
    
    if (searchInput) {
        // Listen for the 'search' event (native clear button)
        searchInput.addEventListener('search', () => {
            clearAllFilters();
            
            // Hide recommendations
            const searchRecommendations = document.querySelector('.search-recommendations');
            if (searchRecommendations) {
                searchRecommendations.style.display = 'none';
            }
        });
        
        // Listen for input changes
        searchInput.addEventListener('input', () => {
            currentSearchTerm = searchInput.value.trim();
            filterProjects();
        });
    }
    
    if (searchForm && searchInput) {
        // Handle form submission
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            performSearch();
        });
        
        // Handle Enter key
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });
    }
    
    function performSearch() {
        currentSearchTerm = searchInput.value.trim();
        filterProjects();
        
        // Hide recommendations after search
        const searchRecommendations = document.querySelector('.search-recommendations');
        if (searchRecommendations) {
            searchRecommendations.style.display = 'none';
        }
        
        // Scroll to results if there's a search term
        if (currentSearchTerm) {
            document.querySelector('#filter').scrollIntoView({ behavior: 'smooth' });
        }
    }
}

/**
 * Initialize search recommendations
 */
function initializeSearchRecommendations() {
    const searchInput = document.querySelector('.search-input');
    const searchRecommendations = document.querySelector('.search-recommendations');
    
    if (!searchInput || !searchRecommendations) return;
    
    // Keep the original 3 recommendations in HTML
    const originalItems = Array.from(searchRecommendations.querySelectorAll('.recommendation-item'));
    
    // Show recommendations when input is focused
    searchInput.addEventListener('focus', () => {
        searchRecommendations.style.display = 'block';
    });
    
    // Hide recommendations when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchRecommendations.contains(e.target)) {
            searchRecommendations.style.display = 'none';
        }
    });
    
    // Handle recommendation item clicks
    originalItems.forEach(item => {
        item.addEventListener('click', () => {
            const clickedText = item.textContent.trim().toLowerCase();
            searchInput.value = clickedText;
            
            // When clicking a recommendation, search for ALL its aliases
            currentSearchTerm = clickedText;
            filterProjects();
            searchRecommendations.style.display = 'none';
            
            // Scroll to results
            document.querySelector('#filter').scrollIntoView({ 
                behavior: 'smooth' 
            });
        });
    });
    
    // Show recommendations on input click
    searchInput.addEventListener('click', () => {
        searchRecommendations.style.display = 'block';
    });
}

// ==============================
// MODAL FUNCTIONS
// ==============================

/**
 * Populate modal with project details
 */
function populateModal(project) {
    resetModal();
    setBasicInfo(project);
    setModalImage(project);
    setStatusAndProgress(project);
    setQuickStats(project);
    setProjectTags(project);
    document.getElementById('formProjectTitle').textContent = project.title;
    document.getElementById('project_startdate').textContent = project.date;
    document.getElementById('project_enddate').textContent = getEndDate(project.date);
    setDetailedDescription(project);
}

/**
 * Reset modal to default state
 */
function resetModal() {
    document.getElementById('details-view').style.display = 'flex';
    document.getElementById('form-view').style.display = 'none';
    document.getElementById('modal-footer').style.display = 'none';
    document.getElementById('participateModalLabel').textContent = 'Project Details';
    
    // Reset the participate button text
    document.getElementById('participateActionText').textContent = 'Participate';
    
    // Reset form
    const formElements = [
        'participantName', 'participantEmail', 'participantPhone',
        'participantAvailability', 'participantExperience', 'participantMessage'
    ];
    
    formElements.forEach(id => {
        document.getElementById(id).value = '';
    });
}

/**
 * Set basic information in modal
 */
function setBasicInfo(project) {
    document.getElementById('modalProjectTitle').textContent = project.title;
    document.getElementById('modalProjectLocation').textContent = project.location;
    document.getElementById('modalProjectStart').textContent = project.date;
    document.getElementById('modalProjectEnd').textContent = getEndDate(project.date);
}

/**
 * Set modal image
 */
function setModalImage(project) {
    const modalImage = document.getElementById('modalProjectImage');
    modalImage.style.backgroundImage = imageMap[project.image];
    modalImage.style.backgroundSize = 'cover';
    modalImage.style.backgroundPosition = 'center';
    modalImage.style.backgroundRepeat = 'no-repeat';
}

/**
 * Set status and progress in modal
 */
function setStatusAndProgress(project) {
    const statusBadge = document.getElementById('modalProjectStatus');
    const progressContainer = document.getElementById('modalProgressContainer');
    
    // Set status based on progress
    if (project.progress === 100) {
        statusBadge.textContent = 'Completed';
        statusBadge.className = 'status-badge status-hosted';
        progressContainer.style.display = 'none';
    } else if (project.progress > 0) {
        statusBadge.textContent = 'In Progress';
        statusBadge.className = 'status-badge status-hosting';
        progressContainer.style.display = 'block';
    } else {
        statusBadge.textContent = 'Upcoming';
        statusBadge.className = 'status-badge status-upcoming';
        progressContainer.style.display = 'none';
    }
    
    // Progress bar
    document.getElementById('modalProjectProgress').textContent = `${project.progress}%`;
    const progressFill = document.getElementById('modalProgressFill');
    progressFill.style.width = `${project.progress}%`;
    
    // Reset and set progress fill classes
    progressFill.className = 'progress-fill';
    if (project.tags.includes('planting')) {
        progressFill.classList.add('progress-planting');
    } else if (project.tags.includes('cleansup')) {
        progressFill.classList.add('progress-cleansup');
    } else if (project.tags.includes('rebuilding')) {
        progressFill.classList.add('progress-rebuilding');
    }
}

/**
 * Set quick stats in modal
 */
function setQuickStats(project) {
    document.getElementById('modalVolunteers').textContent = Math.floor(project.progress * 0.8 + 20);
    document.getElementById('modalDuration').textContent = Math.floor(project.progress * 1.5 + 30);
    document.getElementById('modalImpact').textContent = Math.floor(project.progress * 8 + 100);
}

/**
 * Set project tags in modal
 */
function setProjectTags(project) {
    const tagsContainer = document.getElementById('modalProjectTags');
    tagsContainer.innerHTML = '';
    
    project.tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'modal-tag';
        
        switch (tag) {
            case 'planting':
                tagElement.classList.add('tag-planting');
                tagElement.innerHTML = '<i class="fas fa-seedling"></i> Planting';
                break;
            case 'cleansup':
                tagElement.classList.add('tag-cleansup');
                tagElement.innerHTML = '<i class="fas fa-broom"></i> Clean Up';
                break;
            case 'rebuilding':
                tagElement.classList.add('tag-rebuilding');
                tagElement.innerHTML = '<i class="fas fa-hammer"></i> Rebuilding';
                break;
        }
        
        tagsContainer.appendChild(tagElement);
    });
}

/**
 * Set detailed description in modal
 */
function setDetailedDescription(project) {
    const modalDescription = detailedDescriptions[project.title] || project.description;
    document.getElementById('modalProjectDescription').textContent = modalDescription;
}

/**
 * Handle participate button click
 */
function handleParticipateClick(e) {
    const participateBtn = e.target.closest('.participate-btn');
    if (!participateBtn) return;
    
    const card = participateBtn.closest('.card');
    const carousel = card.closest('.carousel');
    const category = carousel.id.split('-')[0];
    const projectIndex = parseInt(card.dataset.projectIndex);
    
    const project = projectsData[category][projectIndex];
    
    if (project) {
        // Store the project data in the modal element for later use if needed
        const modal = document.getElementById('participateModal');
        modal.dataset.currentProject = JSON.stringify(project);
        
        // Populate the modal with project data
        populateModal(project);
    }
}

/**
 * Handle form submission
 */
function handleFormSubmission() {
    const name = document.getElementById('participantName').value;
    const email = document.getElementById('participantEmail').value;
    
    if (!name || !email) {
        alert('Please fill in all required fields (Name and Email)');
        return;
    }
    
    alert('Thank you for your interest! Your participation request has been submitted.');
    
    // Close the modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('participateModal'));
    modal.hide();
}

// ==============================
// NO PROJECTS MESSAGE FUNCTIONS
// ==============================

/**
 * Show/hide "no projects" message
 */
function showNoProjectsMessage(show) {
    let message = document.getElementById('no-projects-message');
    
    if (show) {
        if (!message) {
            createNoProjectsMessage();
        }
    } else if (message) {
        message.remove();
    }
}

/**
 * Create "no projects" message element
 */
function createNoProjectsMessage() {
    const message = document.createElement('div');
    message.id = 'no-projects-message';
    message.className = 'no-projects-container';
    message.innerHTML = `
        <div class="row align-items-center">
            <div class="col-md-6">
                <div class="no-projects-image">
                    <img src="images/events-think.gif" alt="No projects found" class="img-fluid">
                </div>
            </div>
            <div class="col-md-6" style="text-align: left; justify-content: baseline;">
                <div class="no-projects-content">
                    <h3 class="mb-2">No Projects Found</h3>
                    <p class="text-muted mb-4">Try adjusting your filter or search term to find what you're looking for.</p>
                    <button class="btn btn-outline-primary mt-3 animated-button" id="clear-filters-btn">
                        <span><i class="fas fa-times me-2"></i>Clear All Filters</span>
                        <span></span>
                    </button>
                    <div class="mt-4 suggestions">
                        <p class="mb-2"><strong>Try searching for:</strong></p>
                        <div class="suggestion-tags">
                            <span class="suggestion-tag" data-filter="planting">planting</span> /
                            <span class="suggestion-tag" data-filter="cleansup">clean up</span> /
                            <span class="suggestion-tag" data-filter="rebuilding">rebuilding</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Insert after the library container
    const library = document.querySelector('.library');
    library.appendChild(message);
    
    // Add event listener to clear filters button
    document.getElementById('clear-filters-btn').addEventListener('click', () => {
        clearAllFilters();
    });
    
    // Add event listeners to suggestion tags
    document.querySelectorAll('.suggestion-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            const filter = tag.dataset.filter;
            currentFilter = filter;
            
            // Update radial filter UI
            document.querySelectorAll('.radial-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Find and activate the corresponding radial item
            const radialItems = document.querySelectorAll('.radial-item');
            radialItems.forEach(item => {
                const span = item.querySelector('span');
                if (span) {
                    const text = span.textContent.toLowerCase();
                    if ((filter === 'cleansup' && text.includes('clean')) ||
                        (filter === 'planting' && text.includes('plant')) ||
                        (filter === 'rebuilding' && text.includes('rebuild'))) {
                        item.classList.add('active');
                    }
                }
            });
            
            // Clear search input
            const searchInput = document.querySelector('.search-input');
            if (searchInput) {
                searchInput.value = '';
                currentSearchTerm = '';
            }
            
            // Apply filter
            filterProjects();
        });
    });
}

// ==============================
// EVENT HANDLERS
// ==============================

/**
 * Handle back to top button click
 */
function handleBackToTop() {
    const backToTopBtn = document.querySelector('.bottom-actions .button');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ==============================
// INITIALIZATION
// ==============================

/**
 * Initialize the page
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initializeRadialFilter();
    initializeSearch();
    initializeCarousels();
    
    // Add event listeners to navigation buttons
    document.querySelectorAll('.carousel-btn').forEach(button => {
        button.addEventListener('click', handleCarouselNavigation);
    });
    
    // Use event delegation for participate buttons
    document.querySelector('.library').addEventListener('click', (e) => {
        if (e.target.closest('.participate-btn')) {
            handleParticipateClick(e);
        }
    });
    
    // Add event listener to participate main button
    document.getElementById('participateActionBtn').addEventListener('click', function() {
        document.getElementById('details-view').style.display = 'none';
        document.getElementById('form-view').style.display = 'block';
        document.getElementById('modal-footer').style.display = 'flex';
        document.getElementById('participateModalLabel').textContent = 'Join this Project';
    });
    
    // Reset modal when opened (Bootstrap event)
    const modalElement = document.getElementById('participateModal');
    modalElement.addEventListener('show.bs.modal', function() {
        resetModal();
    });
    
    // Add event listener to go back button
    document.getElementById('goBackBtn').addEventListener('click', function() {
        document.getElementById('details-view').style.display = 'flex';
        document.getElementById('form-view').style.display = 'none';
        document.getElementById('modal-footer').style.display = 'none';
        document.getElementById('participateModalLabel').textContent = 'Project Details';
    });
    
    // Add event listener to form submission
    document.getElementById('submitParticipation').addEventListener('click', handleFormSubmission);
    
    // Reset modal when closed
    modalElement.addEventListener('hidden.bs.modal', () => {
        resetModal();
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        initializeCarousels();
        filterProjects();
    });
    
    // Initialize back to top functionality
    handleBackToTop();
});