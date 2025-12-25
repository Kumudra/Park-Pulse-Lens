// ===== HERO SECTION FUNCTIONALITY =====
const sectionsData = [
    {
        number: '01',
        title: 'ECO Guide',
        heroTitles: ['ECO', 'GUIDE'],
        subtitle: 'Learn How to Start Basic',
        sectionId: 'content-section-1',
        rotateText: 'Guide',
        backgroundImage: "url('images/guide-hero.gif')"
    },
    {
        number: '02',
        title: 'ECO Science',
        heroTitles: ['ECO', 'SCIENCE'],
        subtitle: 'Explore Environmental Data',
        sectionId: 'content-section-2',
        rotateText: 'Experiment',
        backgroundImage: "url('images/science-hero.gif')"
    },
    {
        number: '03',
        title: 'Change Wave',
        heroTitles: ['CHANGE', 'WAVE'],
        subtitle: 'Hear Community Stories',
        sectionId: 'content-section-3',
        rotateText: 'Voice',
        backgroundImage: "url('images/change-hero.gif')"
    },
];

let currentSection = 0;

// Function to update hero content
function updateHeroContent(index) {
    const numberElement = document.querySelector('.number .no');
    const numberText = document.querySelector('.number p');
    const heroTitles = document.querySelectorAll('.h1s h1');
    const heroSubtitle = document.querySelector('.titles h5');
    
    if (numberElement) numberElement.textContent = sectionsData[index].number;
    if (numberText) numberText.textContent = sectionsData[index].title;
    
    if (heroTitles.length > 0) {
        heroTitles.forEach((h1, i) => {
            if (sectionsData[index].heroTitles[i]) {
                h1.textContent = sectionsData[index].heroTitles[i];
            }
        });
    }
    
    if (heroSubtitle) heroSubtitle.textContent = sectionsData[index].subtitle;
    
    const rotateText = document.getElementById('rotate-text');
    if (rotateText) rotateText.textContent = sectionsData[index].rotateText;
    
    // Change the background
    changeHeroBackground(index);
}

// Function to change hero background
function changeHeroBackground(index) {
    const hero = document.querySelector('.hero');
    const sectionData = sectionsData[index];
    
    if (sectionData && sectionData.backgroundImage) {
        // Apply the background image directly
        hero.style.backgroundImage = sectionData.backgroundImage;
        hero.style.backgroundSize = 'cover';
        hero.style.backgroundPosition = 'center';
        hero.style.backgroundRepeat = 'no-repeat';
        
        // Optional: Add a smooth transition effect
        hero.style.transition = 'background-image 0.8s ease-in-out';
    }
}

// Function to show a section
function showSection(index) {
    const sections = document.querySelectorAll('.content-section');
    const dotsContainer = document.getElementById('indicator-dots');
    
    // Hide all sections first
    sections.forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
    });
    
    // Show the target section
    const targetSection = document.getElementById(sectionsData[index].sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
        setTimeout(() => {
            targetSection.classList.add('active');
            // Scroll to top of the page
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 10);
    }
    
    // Update navigation dots
    const dots = document.querySelectorAll('.indicator-dots .dot');
    dots.forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === index));
    
    // Update URL hash
    window.history.pushState(null, null, `#${sectionsData[index].sectionId}`);
    
    currentSection = index;
    updateHeroContent(index);
}

// ===== HORIZONTAL ACCORDION =====
function initHorizontalAccordion() {
    const accordionCards = document.querySelectorAll('.accordion-card');
    if (accordionCards.length === 0) return;
    
    // Reset all cards
    accordionCards.forEach(card => card.classList.remove('active'));
    if (accordionCards[0]) accordionCards[0].classList.add('active');
    
    // Add click event listeners
    accordionCards.forEach(card => {
        card.addEventListener('click', function() {
            if (this.classList.contains('active')) return;
            
            // Close all other cards
            accordionCards.forEach(otherCard => otherCard.classList.remove('active'));
            this.classList.add('active');
            
            // Scroll to center the active card
            setTimeout(() => {
                const wrapper = document.querySelector('.horizon-accordion-wrapper');
                if (wrapper) {
                    const cardLeft = this.offsetLeft;
                    const cardWidth = this.offsetWidth;
                    const wrapperWidth = wrapper.offsetWidth;
                    const scrollLeft = cardLeft - (wrapperWidth / 2) + (cardWidth / 2);
                    wrapper.scrollTo({ left: scrollLeft, behavior: 'smooth' });
                }
            }, 300);
        });
    });
}

// ===== BACKGROUND TRANSFORMATION =====
function initBackgroundTransformation() {
    const transformBtn = document.getElementById('transform-btn');
    const bgImages = document.querySelectorAll('.bg-image');
    const navDots = document.querySelectorAll('.bg-nav-dots .dot');
    const currentBgSpan = document.getElementById('current-bg');
    const totalBgSpan = document.getElementById('total-bg');
    
    if (bgImages.length === 0) return;
    
    let currentIndex = 0;
    const totalImages = bgImages.length;
    
    if (totalBgSpan) totalBgSpan.textContent = totalImages;
    
    // Function to change background
    function changeBackground(index) {
        bgImages.forEach(img => img.classList.remove('active'));
        navDots.forEach(dot => dot.classList.remove('active'));
        
        bgImages[index].classList.add('active');
        if (navDots[index]) navDots[index].classList.add('active');
        if (currentBgSpan) currentBgSpan.textContent = index + 1;
        
        currentIndex = index;
    }
    
    // Initialize with first background
    changeBackground(0);
    
    // Transform button click
    if (transformBtn) {
        transformBtn.addEventListener('click', function() {
            const nextIndex = (currentIndex + 1) % totalImages;
            changeBackground(nextIndex);
            this.style.transform = 'scale(0.9) rotate(-5deg)';
            setTimeout(() => this.style.transform = '', 200);
        });
    }
    
    // Navigation dots
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', () => changeBackground(index));
    });
}

// ===== QUIZ FUNCTIONALITY =====
function initQuiz() {
    const quizOptions = document.querySelectorAll('.quiz-option');
    const quizFeedback = document.querySelector('.quiz-feedback');
    
    if (quizOptions.length === 0 || !quizFeedback) return;
    
    quizFeedback.style.display = 'none';
    
    quizOptions.forEach(option => {
        option.addEventListener('click', function() {
            const isCorrect = this.getAttribute('data-correct') === 'true';
            
            // Mark correct/incorrect answers
            quizOptions.forEach(opt => opt.classList.remove('correct', 'incorrect'));
            quizOptions.forEach(opt => {
                if (opt.getAttribute('data-correct') === 'true') {
                    opt.classList.add('correct');
                } else {
                    opt.classList.add('incorrect');
                }
            });
            
            // Show feedback
            quizFeedback.style.display = 'block';
            this.style.transform = 'scale(0.95)';
            setTimeout(() => this.style.transform = '', 200);
        });
    });
}

// ===== MYTH CARD HOVER EFFECTS =====
function initMythCardHover() {
    const mythCards = document.querySelectorAll('.myth-card');
    
    mythCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.myth-icon');
            if (icon) icon.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.myth-icon');
            if (icon) icon.style.transform = '';
        });
    });
}

// ===== DISCOVERY ITEMS FUNCTIONALITY =====
function initDiscoveryItems() {
    const discoveryItems = document.querySelectorAll('.discovery-item');
    const video = document.getElementById('main-video');
    
    if (!video) {
        console.log('Video element not found');
        return;
    }
    
    // Discovery videos data
    const discoveryVideos = {
        "1": {
            src: "images/Sci-Result.mp4",
            poster: "images/sci-result.jpg",
            title: "Bio-Mechanical Energy Harvesting",
            author: "WE BARE BEARS",
            description: "Our team successfully implemented an Arduino-based system that converts human exercise into renewable energy. The system captures mechanical work from stationary bikes and converts it to electricity to power park lighting.",
            tags: ["Renewable Energy", "Biomechanics", "INNOVATIVE!"],
            date: "08 DEC 2025"
        },
        "2": {
            src: "images/sci-video2.mp4",
            poster: "images/sci-video2.jpg",
            title: "Smart Solar Bench MINI",
            author: "Eco Renewable Energy",
            description: "Benches equipped with solar panels offer phone charging, Wi-Fi, and environmental sensors. They promote sustainability and comfort in public spaces.",
            tags: ["Solar Power", "Smart City", "Green Tech"],
            date: "23 DEC 2020"
        },
        "3": {
            src: "images/sci-video3.mp4",
            poster: "images/sci-video3.jpg",
            title: "Waste Sorting Robot Kit Demo Video",
            author: "Hiwonder",
            description: "CleanTech Crew Description: These solar-powered bins use sensors and AI to sort recyclables and notify staff when full, reducing litter and improving recycling rates.",
            tags: ["Waste Management", "AI", "Robotics"],
            date: "20 APR 2022"
        }
    };
    
    // Function to update feature details
    function updateFeatureDetails(featureId) {
        console.log('Updating details for feature:', featureId);
        
        const videoData = discoveryVideos[featureId];
        if (!videoData) return;
        
        // Update date elements
        const dateParts = videoData.date.split(' ');
        const dateDay = document.querySelector('.date-day');
        const dateMonth = document.querySelector('.date-month');
        const dateYear = document.querySelector('.date-year');
        
        if (dateDay && dateParts[0]) dateDay.textContent = dateParts[0];
        if (dateMonth && dateParts[1]) dateMonth.textContent = dateParts[1];
        if (dateYear && dateParts[2]) dateYear.textContent = dateParts[2];
        
        // Update feature content
        const featureTitle = document.querySelector('.feature-title');
        const featureAuthor = document.querySelector('.feature-author');
        const featureDescription = document.querySelector('.feature-description');
        const featureTags = document.querySelector('.feature-tags');
        
        if (featureTitle) featureTitle.textContent = videoData.title;
        if (featureAuthor) featureAuthor.innerHTML = `<i class="fas fa-user"></i> ${videoData.author}`;
        if (featureDescription) featureDescription.textContent = videoData.description;
        
        // Update tags
        if (featureTags) {
            featureTags.innerHTML = '';
            videoData.tags.forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.className = 'tag';
                if (tag === 'INNOVATIVE!') tagElement.classList.add('badge-new');
                tagElement.textContent = tag;
                featureTags.appendChild(tagElement);
            });
        }
        
        // Update the clicked discovery item's details
        const activeItem = document.querySelector(`.discovery-item[data-feature="${featureId}"]`);
        if (activeItem) {
            const itemTitle = activeItem.querySelector('.item-title');
            const itemDate = activeItem.querySelector('.item-date');
            const itemAuthor = activeItem.querySelector('.item-author');
            
            if (itemTitle) itemTitle.textContent = videoData.title;
            if (itemDate) itemDate.textContent = videoData.date;
            if (itemAuthor) itemAuthor.textContent = videoData.author;
        }
        
        // Add visual feedback
        const featureDetails = document.querySelector('.feature-details');
        if (featureDetails) {
            featureDetails.classList.add('updating');
            setTimeout(() => featureDetails.classList.remove('updating'), 300);
        }
    }
    
    // Function to switch discovery content
    function switchDiscovery(featureId) {
        console.log('Switching to feature:', featureId);
        
        const videoData = discoveryVideos[featureId];
        if (!videoData) {
            console.log('No video data for feature:', featureId);
            return;
        }
        
        // Update feature details
        updateFeatureDetails(featureId);
        
        // Update video source
        video.src = videoData.src;
        video.poster = videoData.poster;
        
        // Load the new video
        video.load();
    }
    
    // Add click event listeners to discovery items
    discoveryItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const featureId = this.getAttribute('data-feature');
            
            if (!featureId) {
                console.log('No data-feature attribute found');
                return;
            }
            
            // Update active state
            discoveryItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // Switch discovery content
            switchDiscovery(featureId);
        });
    });
    
    // Initialize with bench item (feature 2) active
    if (discoveryItems.length >= 2) {
        const benchItem = discoveryItems[1]; // Second item (index 1)
        const benchFeatureId = benchItem.getAttribute('data-feature'); // Should be "2"
        
        benchItem.classList.add('active');
        
        if (benchFeatureId && discoveryVideos[benchFeatureId]) {
            updateFeatureDetails(benchFeatureId);
            video.src = discoveryVideos[benchFeatureId].src;
            video.poster = discoveryVideos[benchFeatureId].poster;
            video.load();
        }
    }
}

// ===== ACTIVIST FUNCTIONALITY =====
function initActivistFunctionality() {
    // Greta Thunberg - Direct link to UN speech transcript
    document.querySelector('.greta-btn')?.addEventListener('click', function(e) {
        e.preventDefault();
        window.open("https://www.npr.org/2019/09/23/763452863/transcript-greta-thunbergs-speech-at-the-u-n-climate-action-summit", '_blank');
    });
    
    // David Attenborough - Direct link to YouTube playlist
    document.querySelector('.david-btn')?.addEventListener('click', function(e) {
        e.preventDefault();
        window.open("https://www.youtube.com/playlist?list=PLz58QJ68R9CTFoR1J6dgAc4mwdAmm3kZZ", '_blank');
    });
    
    // Jane Goodall - Direct link to biography
    document.querySelector('.jane-btn')?.addEventListener('click', function(e) {
        e.preventDefault();
        window.open("https://www.biography.com/scientists/jane-goodall", '_blank');
    });
    
    // Activist card entrance animation
    const activistObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelectorAll('.activist-card').forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 200);
                });
                activistObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    const activistsSection = document.querySelector('.activists-section');
    if (activistsSection) {
        document.querySelectorAll('.activist-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
        activistObserver.observe(activistsSection);
    }
}

// ===== TESTIMONIAL SLIDER =====
function initTestimonialSlider() {
    const testimonialSlides = document.querySelectorAll('.testimonial');
    const testimonialDots = document.querySelectorAll('.slider-dots .dot');
    let currentTestimonialSlide = 0;
    
    function showTestimonialSlide(index) {
        testimonialSlides.forEach(slide => slide.classList.remove('active'));
        testimonialDots.forEach(dot => dot.classList.remove('active'));
        
        testimonialSlides[index].classList.add('active');
        testimonialDots[index].classList.add('active');
        currentTestimonialSlide = index;
    }
    
    if (testimonialSlides.length > 0) {
        showTestimonialSlide(0);
        
        // Previous button
        document.querySelector('.slider-prev')?.addEventListener('click', () => {
            let newIndex = currentTestimonialSlide - 1;
            if (newIndex < 0) newIndex = testimonialSlides.length - 1;
            showTestimonialSlide(newIndex);
        });
        
        // Next button
        document.querySelector('.slider-next')?.addEventListener('click', () => {
            let newIndex = currentTestimonialSlide + 1;
            if (newIndex >= testimonialSlides.length) newIndex = 0;
            showTestimonialSlide(newIndex);
        });
        
        // Navigation dots
        testimonialDots.forEach((dot, index) => {
            dot.addEventListener('click', () => showTestimonialSlide(index));
        });
        
        // Auto-slide every 8 seconds
        setInterval(() => {
            let newIndex = currentTestimonialSlide + 1;
            if (newIndex >= testimonialSlides.length) newIndex = 0;
            showTestimonialSlide(newIndex);
        }, 8000);
    }
}

// ===== KEYBOARD NAVIGATION =====
function initKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            let newIndex = currentSection - 1;
            if (newIndex < 0) newIndex = sectionsData.length - 1;
            showSection(newIndex);
        } else if (e.key === 'ArrowRight') {
            let newIndex = currentSection + 1;
            if (newIndex >= sectionsData.length) newIndex = 0;
            showSection(newIndex);
        }
    });
}

// ===== BACK BUTTONS =====
function initBackButtons() {
    const backButtons = document.querySelectorAll('.back-btn a');
    backButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

// ===== FINAL INITIALIZATION =====
function initializeAll() {
    console.log('DOM loaded, initializing all functionality...');
    
    // Get DOM elements
    const sections = document.querySelectorAll('.content-section');
    const dotsContainer = document.getElementById('indicator-dots');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const rotateBtn = document.getElementById('rotate-btn');
    const scrollDownBtn = document.querySelector('.scroll-down a');
    const choiceBtn = document.querySelector('.choice-btn');
    const ctaButton = document.querySelector('.cta-button');
    
    // ===== 1. HERO SECTION SETUP =====
    
    // Create navigation dots
    if (dotsContainer && sections.length > 0) {
        dotsContainer.innerHTML = '';
        sectionsData.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => showSection(index));
            dotsContainer.appendChild(dot);
        });
    }
    
    // Previous button
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            let newIndex = currentSection - 1;
            if (newIndex < 0) newIndex = sectionsData.length - 1;
            showSection(newIndex);
        });
    }
    
    // Next button
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            let newIndex = currentSection + 1;
            if (newIndex >= sectionsData.length) newIndex = 0;
            showSection(newIndex);
        });
    }
    
    // ===== 2. NAVBAR LINK FUNCTIONALITY =====
    document.querySelectorAll('.dropdown-menu a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const sectionId = href.substring(1); // Remove the #
            
            // Find which section this link points to
            const sectionIndex = sectionsData.findIndex(section => section.sectionId === sectionId);
            
            if (sectionIndex !== -1) {
                showSection(sectionIndex);
                
                // Close the dropdown on mobile
                const navbarCollapse = document.getElementById('navbarNavDropdown');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                        toggle: false
                    });
                    bsCollapse.hide();
                }
            }
        });
    });
    
    // ===== 3. INITIAL STATE SETUP =====
    // Check if we came from a navbar link with hash
    const hash = window.location.hash;
    if (hash) {
        const sectionId = hash.substring(1);
        const sectionIndex = sectionsData.findIndex(section => section.sectionId === sectionId);
        if (sectionIndex !== -1) {
            currentSection = sectionIndex;
        }
    }
    
    // Set initial display state for all sections
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Show initial section
    showSection(currentSection);
    
    // ===== 4. ROTATE BUTTON =====
    if (rotateBtn) {
        rotateBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const rotateIcon = this.querySelector('i');
            if (rotateIcon) {
                rotateIcon.style.animation = 'spin 0.6s ease';
                setTimeout(() => rotateIcon.style.animation = '', 600);
            }
            
            let newIndex = currentSection + 1;
            if (newIndex >= sectionsData.length) newIndex = 0;
            showSection(newIndex);
        });
    }
    
    // ===== 5. SCROLL DOWN BUTTON =====
    if (scrollDownBtn) {
        scrollDownBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const activeSection = document.querySelector('.content-section.active');
            if (activeSection) {
                activeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
    
    // ===== 6. INITIALIZE COMPONENTS =====
    initHorizontalAccordion();
    initBackgroundTransformation();
    initQuiz();
    initMythCardHover();
    initDiscoveryItems();
    initActivistFunctionality();
    initTestimonialSlider();
    initKeyboardNavigation();
    initBackButtons();
    
    // Initialize video player only if in science section
    if (currentSection === 1) { // Science section is index 1
        initVideoPlayer();
    }
}

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', initializeAll);