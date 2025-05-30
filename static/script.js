// Portfolio JavaScript - Complete Interactive Features
// Author: Shailendra Gupta Portfolio

class PortfolioApp {
    constructor() {
        this.isLoading = true;
        this.currentSection = 'about';
        this.scrollTimeout = null;
        this.animations = new Map();
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeIntroAnimation();
        this.setupScrollAnimations();
        this.initializeCounters();
        this.setupSkillBars();
        this.setupContactForm();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupActiveNavigation();
        this.setupTypewriterEffect();
        this.initializeParallaxEffects();
    }

    setupEventListeners() {
        // Window events
        window.addEventListener('load', () => this.handlePageLoad());
        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('resize', () => this.handleResize());
        
        // Intro animation skip
        document.addEventListener('click', (e) => {
            if (e.target.closest('#intro-animation')) {
                this.skipIntroAnimation();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyNavigation(e));
    }

    initializeIntroAnimation() {
        const introElement = document.getElementById('intro-animation');
        const mainContent = document.getElementById('main-content');
        
        if (!introElement || !mainContent) return;

        // Auto-advance intro after 6 seconds
        setTimeout(() => {
            if (this.isLoading) {
                this.completeIntroAnimation();
            }
        }, 6000);

        // Manual skip on scroll or click
        let introSkipped = false;
        const skipIntro = () => {
            if (!introSkipped) {
                introSkipped = true;
                this.skipIntroAnimation();
            }
        };

        window.addEventListener('wheel', skipIntro, { once: true });
        window.addEventListener('touchstart', skipIntro, { once: true });
        introElement.addEventListener('click', skipIntro, { once: true });
    }

    completeIntroAnimation() {
        const introElement = document.getElementById('intro-animation');
        const mainContent = document.getElementById('main-content');
        const header = document.getElementById('main-header');
        
        if (!introElement || !mainContent) return;

        // Fade out intro
        introElement.style.transition = 'opacity 1s ease, transform 1s ease';
        introElement.style.opacity = '0';
        introElement.style.transform = 'scale(1.1)';
        
        setTimeout(() => {
            introElement.style.display = 'none';
            mainContent.classList.add('show');
            header?.classList.add('show');
            this.isLoading = false;
            
            // Trigger initial animations
            this.animateInitialElements();
            this.startCounterAnimations();
        }, 1000);
    }

    skipIntroAnimation() {
        const introElement = document.getElementById('intro-animation');
        const mainContent = document.getElementById('main-content');
        const header = document.getElementById('main-header');
        
        if (!introElement || !mainContent) return;

        introElement.style.display = 'none';
        mainContent.classList.add('show');
        header?.classList.add('show');
        this.isLoading = false;
        
        this.animateInitialElements();
        this.startCounterAnimations();
    }

    animateInitialElements() {
        // Animate about section elements
        const aboutElements = document.querySelectorAll('#about .animate-on-scroll');
        aboutElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('animated');
            }, index * 100);
        });
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    
                    // Trigger specific animations based on element type
                    if (entry.target.classList.contains('skill-category')) {
                        this.animateSkillBars(entry.target);
                    }
                    
                    if (entry.target.classList.contains('stat-item')) {
                        this.animateCounter(entry.target.querySelector('.stat-number'));
                    }
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animatedElements = document.querySelectorAll(`
            .highlight-card,
            .project-card,
            .skill-category,
            .timeline-item,
            .contact-card,
            .stat-item
        `);

        animatedElements.forEach(el => {
            el.classList.add('animate-on-scroll');
            observer.observe(el);
        });
    }

    initializeCounters() {
        this.counters = document.querySelectorAll('.stat-number[data-count]');
    }

    startCounterAnimations() {
        this.counters.forEach(counter => {
            this.animateCounter(counter);
        });
    }

    animateCounter(counter) {
        if (!counter || counter.dataset.animated) return;
        
        const target = parseInt(counter.dataset.count);
        const duration = 2000; // 2 seconds
        const start = performance.now();
        const startValue = 0;
        
        counter.dataset.animated = 'true';
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart);
            
            counter.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        requestAnimationFrame(updateCounter);
    }

    setupSkillBars() {
        this.skillBars = document.querySelectorAll('.skill-fill[data-level]');
    }

    animateSkillBars(skillCategory) {
        const skillBars = skillCategory.querySelectorAll('.skill-fill[data-level]');
        
        skillBars.forEach((bar, index) => {
            if (bar.dataset.animated) return;
            
            setTimeout(() => {
                const level = bar.dataset.level;
                bar.style.width = level + '%';
                bar.dataset.animated = 'true';
            }, index * 200);
        });
    }

    setupContactForm() {
        const form = document.querySelector('.contact-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(form);
        });

        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    validateField(field) {
        const formGroup = field.closest('.form-group');
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove existing error states
        formGroup.classList.remove('error', 'success');
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) existingError.remove();

        // Validation rules
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Apply validation state
        if (!isValid) {
            formGroup.classList.add('error');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = errorMessage;
            formGroup.appendChild(errorDiv);
        } else if (value) {
            formGroup.classList.add('success');
        }

        return isValid;
    }

    clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        formGroup.classList.remove('error');
        const errorMessage = formGroup.querySelector('.error-message');
        if (errorMessage) errorMessage.remove();
    }

    async handleFormSubmission(form) {
        const submitBtn = form.querySelector('.btn-primary');
        const originalText = submitBtn.textContent;
        
        // Validate all fields
        const inputs = form.querySelectorAll('input, textarea');
        let allValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                allValid = false;
            }
        });

        if (!allValid) return;

        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            // Simulate form submission (replace with actual endpoint)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Success state
            submitBtn.textContent = 'Message Sent!';
            submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            
            // Reset form
            setTimeout(() => {
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
                
                // Clear validation states
                inputs.forEach(input => {
                    const formGroup = input.closest('.form-group');
                    formGroup.classList.remove('success', 'error');
                });
            }, 3000);
            
        } catch (error) {
            console.error('Form submission error:', error);
            submitBtn.textContent = 'Error - Try Again';
            submitBtn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
            }, 3000);
        }
    }

    setupMobileMenu() {
        const menuBtn = document.getElementById('mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');
        
        if (!menuBtn || !navLinks) return;

        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            navLinks.classList.toggle('mobile-open');
        });

        // Close menu when clicking nav links
        navLinks.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link')) {
                menuBtn.classList.remove('active');
                navLinks.classList.remove('mobile-open');
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('nav')) {
                menuBtn.classList.remove('active');
                navLinks.classList.remove('mobile-open');
            }
        });
    }

    setupSmoothScrolling() {
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('header')?.offsetHeight || 0;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupActiveNavigation() {
        const sections = document.querySelectorAll('.content-section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-100px 0px -50% 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    this.updateActiveNavigation(sectionId);
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    }

    updateActiveNavigation(activeSection) {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${activeSection}`) {
                link.classList.add('active');
            }
        });
        
        this.currentSection = activeSection;
    }

    setupTypewriterEffect() {
        const typewriterElement = document.querySelector('.typewriter-text');
        if (!typewriterElement) return;

        const texts = [
            'Data Analyst & Visualization Specialist',
            'Machine Learning Enthusiast',
            'Business Intelligence Expert',
            'Statistical Analysis Professional'
        ];

        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let isPaused = false;

        const typeSpeed = 50;
        const deleteSpeed = 30;
        const pauseTime = 2000;

        const typeWriter = () => {
            const currentText = texts[textIndex];
            
            if (!isDeleting && charIndex < currentText.length) {
                // Typing
                typewriterElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
                setTimeout(typeWriter, typeSpeed);
            } else if (isDeleting && charIndex > 0) {
                // Deleting
                typewriterElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                setTimeout(typeWriter, deleteSpeed);
            } else if (!isDeleting && charIndex === currentText.length) {
                // Pause before deleting
                isPaused = true;
                setTimeout(() => {
                    isPaused = false;
                    isDeleting = true;
                    typeWriter();
                }, pauseTime);
            } else if (isDeleting && charIndex === 0) {
                // Move to next text
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                setTimeout(typeWriter, typeSpeed);
            }
        };

        // Start typewriter effect after intro
        setTimeout(() => {
            typeWriter();
        }, 7000);
    }

    initializeParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.floating-particles, .profile-rings');
        
        window.addEventListener('scroll', () => {
            if (this.isLoading) return;
            
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            parallaxElements.forEach(el => {
                el.style.transform = `translateY(${rate}px)`;
            });
        });
    }

    handleScroll() {
        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
        }

        this.scrollTimeout = setTimeout(() => {
            this.updateScrollProgress();
            this.handleHeaderVisibility();
        }, 10);
    }

    updateScrollProgress() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        // Update progress bar if exists
        const progressBar = document.querySelector('.scroll-progress');
        if (progressBar) {
            progressBar.style.width = scrolled + '%';
        }
    }

    handleHeaderVisibility() {
        const header = document.getElementById('main-header');
        if (!header || this.isLoading) return;

        const scrollY = window.scrollY;
        
        if (scrollY > 100) {
            header.style.background = 'rgba(10, 10, 10, 0.98)';
            header.style.backdropFilter = 'blur(20px)';
        } else {
            header.style.background = 'rgba(10, 10, 10, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        }
    }

    handleResize() {
        // Recalculate positions and sizes on resize
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this.updateResponsiveElements();
        }, 250);
    }

    updateResponsiveElements() {
        // Update any elements that need responsive adjustments
        const isMobile = window.innerWidth <= 768;
        
        // Adjust animations for mobile
        if (isMobile) {
            document.body.classList.add('mobile-view');
        } else {
            document.body.classList.remove('mobile-view');
        }
    }

    handleKeyNavigation(e) {
        // Keyboard shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case '1':
                    e.preventDefault();
                    this.scrollToSection('about');
                    break;
                case '2':
                    e.preventDefault();
                    this.scrollToSection('projects');
                    break;
                case '3':
                    e.preventDefault();
                    this.scrollToSection('skills');
                    break;
                case '4':
                    e.preventDefault();
                    this.scrollToSection('experience');
                    break;
                case '5':
                    e.preventDefault();
                    this.scrollToSection('contact');
                    break;
            }
        }

        // Escape key functionality
        if (e.key === 'Escape') {
            const mobileMenu = document.querySelector('.mobile-menu-btn');
            const navLinks = document.querySelector('.nav-links');
            
            if (mobileMenu?.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                navLinks?.classList.remove('mobile-open');
            }
        }
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const headerHeight = document.querySelector('header')?.offsetHeight || 0;
            const targetPosition = section.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    handlePageLoad() {
        // Page loaded completely
        document.body.classList.add('loaded');
        
        // Preload images
        this.preloadImages();
        
        // Initialize any additional features
        this.setupErrorHandling();
    }

    preloadImages() {
        const images = [
            'images/project1.jpg',
            'images/project2.jpg',
            'images/project3.jpg',
            'images/project4.jpg'
        ];

        images.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    setupErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('JavaScript error:', e.error);
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
        });
    }

    // Public methods for external use
    showSection(sectionId) {
        this.scrollToSection(sectionId);
    }

    getCurrentSection() {
        return this.currentSection;
    }

    isIntroActive() {
        return this.isLoading;
    }
}

// Enhanced utility functions
const Utils = {
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    getElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    animate(element, properties, duration = 300) {
        return new Promise(resolve => {
            const start = performance.now();
            const initialStyles = {};
            
            // Get initial values
            Object.keys(properties).forEach(prop => {
                initialStyles[prop] = getComputedStyle(element)[prop];
            });
            
            const animate = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                
                // Apply easing
                const easeOutCubic = 1 - Math.pow(1 - progress, 3);
                
                Object.keys(properties).forEach(prop => {
                    const initialValue = parseFloat(initialStyles[prop]) || 0;
                    const targetValue = parseFloat(properties[prop]);
                    const currentValue = initialValue + (targetValue - initialValue) * easeOutCubic;
                    
                    element.style[prop] = currentValue + (prop.includes('opacity') ? '' : 'px');
                });
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            
            requestAnimationFrame(animate);
        });
    }
};

// Initialize the portfolio app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioApp = new PortfolioApp();
});

// Additional features for enhanced user experience
document.addEventListener('DOMContentLoaded', () => {
    // Add smooth scroll behavior for browsers that don't support CSS scroll-behavior
    if (!CSS.supports('scroll-behavior', 'smooth')) {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    // Add loading animation for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });
    });

    // Add copy to clipboard functionality for contact info
    const contactCards = document.querySelectorAll('.contact-card');
    contactCards.forEach(card => {
        card.addEventListener('click', () => {
            const text = card.querySelector('p')?.textContent;
            if (text && navigator.clipboard) {
                navigator.clipboard.writeText(text).then(() => {
                    // Show temporary feedback
                    const feedback = document.createElement('div');
                    feedback.textContent = 'Copied!';
                    feedback.style.cssText = `
                        position: absolute;
                        background: var(--accent-color);
                        color: var(--dark-bg);
                        padding: 0.5rem 1rem;
                        border-radius: 4px;
                        font-size: 0.8rem;
                        z-index: 1000;
                        pointer-events: none;
                        opacity: 0;
                        transition: opacity 0.3s ease;
                    `;
                    
                    card.style.position = 'relative';
                    card.appendChild(feedback);
                    
                    setTimeout(() => feedback.style.opacity = '1', 10);
                    setTimeout(() => {
                        feedback.style.opacity = '0';
                        setTimeout(() => feedback.remove(), 300);
                    }, 2000);
                });
            }
        });
    });
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PortfolioApp, Utils };
}