// Back to Top Button
        document.addEventListener('DOMContentLoaded', function() {
            const backToTop = document.getElementById('backToTop');
            
            window.addEventListener('scroll', function() {
                if (window.pageYOffset > 300) {
                    backToTop.classList.add('visible');
                } else {
                    backToTop.classList.remove('visible');
                }
            });

            // Smooth scrolling
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    if (targetId === '#') return;
                    
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 100,
                            behavior: 'smooth'
                        });
                    }
                });
            });

            // Feedback form submission
            document.getElementById('accessibilityFeedback').addEventListener('submit', function(e) {
                e.preventDefault();
                const formData = new FormData(this);
                
                // In a real implementation, this would send to a server
                // For now, show a confirmation message
                alert('Thank you for your feedback! Your input helps us improve accessibility for everyone.');
                this.reset();
                
                // Log to console for demonstration
                console.log('Accessibility feedback submitted:', Object.fromEntries(formData));
            });

            // Initialize any saved accessibility preferences
            if (localStorage.getItem('highContrast') === 'true') {
                document.body.classList.add('high-contrast');
            }
            if (localStorage.getItem('fontSize')) {
                document.documentElement.style.fontSize = localStorage.getItem('fontSize');
            }

            // ARIA live region for dynamic content
            const liveRegion = document.createElement('div');
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.className = 'sr-only';
            document.body.appendChild(liveRegion);

            // Announce accessibility tool activation
            window.announceAccessibility = function(message) {
                liveRegion.textContent = message;
                setTimeout(() => {
                    liveRegion.textContent = '';
                }, 3000);
            };
        });