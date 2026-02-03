const TOKEN = '7990942936:AAG1lRKSS2r1Q2_svd2L41ngtp43LBpFMeo';
const CHAT_ID = '-1002816551291';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TOKEN}`;

// Sound effects
const messageSentSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-message-pop-alert-2354.mp3');
const clickSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3');

// Initialize Particles.js
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: "#e63946" },
                shape: { type: "circle" },
                opacity: { value: 0.5, random: true },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#e63946",
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "repulse" },
                    onclick: { enable: true, mode: "push" }
                }
            },
            retina_detect: true
        });
    }
}

// Counter animation for stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + '+';
            }
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });
}

// Filter cars by category
function initCarFilter() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const carCards = document.querySelectorAll('.car-card-modern');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Play sound
            clickSound.currentTime = 0;
            clickSound.play().catch(() => {});
            
            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const filter = tab.getAttribute('data-filter');
            
            // Filter cars
            carCards.forEach(card => {
                const categories = card.getAttribute('data-category').split(' ');
                if (filter === 'all' || categories.includes(filter)) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Favorite cars functionality
function initFavoriteCars() {
    const favoriteBtns = document.querySelectorAll('.favorite-btn');
    
    favoriteBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const icon = btn.querySelector('i');
            
            // Play sound
            clickSound.currentTime = 0;
            clickSound.play().catch(() => {});
            
            if (btn.classList.contains('active')) {
                btn.classList.remove('active');
                icon.className = 'far fa-heart';
                showNotification('Удалено из избранного', 'info');
            } else {
                btn.classList.add('active');
                icon.className = 'fas fa-heart';
                showNotification('Добавлено в избранное', 'success');
            }
        });
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Form handling
function initForms() {
    // Main form on index.html
    const modernForm = document.getElementById('modernInspectionForm');
    if (modernForm) {
        // Dynamic form fields
        const requestTypeSelect = document.getElementById('modernRequestType');
        const carSelectGroup = document.getElementById('modernCarSelectGroup');
        const budgetGroup = document.getElementById('modernBudgetGroup');
        const desiredCarGroup = document.getElementById('modernDesiredCarGroup');
        const photoGroup = document.getElementById('modernPhotoGroup');
        const photoInput = document.getElementById('modernPhoto');
        const fileNameSpan = document.getElementById('fileName');
        
        // File upload preview
        if (photoInput && fileNameSpan) {
            photoInput.addEventListener('change', function() {
                if (this.files.length > 0) {
                    fileNameSpan.textContent = this.files[0].name;
                    fileNameSpan.style.color = '#4CAF50';
                } else {
                    fileNameSpan.textContent = 'Файл не выбран';
                    fileNameSpan.style.color = '';
                }
            });
        }
        
        // Show/hide fields based on request type
        if (requestTypeSelect) {
            requestTypeSelect.addEventListener('change', function() {
                const value = this.value;
                
                // Reset all fields
                carSelectGroup.style.display = 'none';
                budgetGroup.style.display = 'none';
                desiredCarGroup.style.display = 'none';
                photoGroup.style.display = 'none';
                
                // Show relevant fields
                if (value === 'Автоподбор') {
                    budgetGroup.style.display = 'block';
                    desiredCarGroup.style.display = 'block';
                } else if (value === 'Комиссия' || value === 'Автоломбард') {
                    photoGroup.style.display = 'block';
                } else if (value && value !== '') {
                    carSelectGroup.style.display = 'block';
                }
            });
        }
        
        // Form submission
        modernForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            const formMessage = document.getElementById('modernFormMessage');
            
            // Disable submit button and show loading
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
            submitBtn.disabled = true;
            
            // Get form data
            const formData = new FormData();
            const requestType = document.getElementById('modernRequestType').value;
            const fullName = document.getElementById('modernFullName').value;
            const phone = document.getElementById('modernPhone').value;
            const message = document.getElementById('modernMessage').value;
            
            // Build message for Telegram
            let telegramMessage = `🚗 *Новая заявка с сайта rvDrive*\n\n`;
            telegramMessage += `📋 *Тип заявки:* ${requestType}\n`;
            
            if (requestType === 'Автоподбор') {
                const budget = document.getElementById('modernBudget').value;
                const desiredCar = document.getElementById('modernDesiredCar').value;
                telegramMessage += `💰 *Бюджет:* ${budget}\n`;
                telegramMessage += `🎯 *Желаемый авто:* ${desiredCar}\n`;
            } else if (requestType === 'Комиссия' || requestType === 'Автоломбард') {
                if (photoInput.files.length > 0) {
                    formData.append('photo', photoInput.files[0]);
                }
            } else {
                const car = document.getElementById('modernCarSelect').value;
                if (car) {
                    telegramMessage += `🚘 *Автомобиль:* ${car}\n`;
                }
            }
            
            telegramMessage += `👤 *ФИО:* ${fullName}\n`;
            telegramMessage += `📞 *Телефон:* ${phone}\n`;
            
            if (message) {
                telegramMessage += `💬 *Сообщение:* ${message}\n`;
            }
            
            telegramMessage += `\n⏰ *Время:* ${new Date().toLocaleString('ru-RU')}`;
            
            try {
                // Check if we need to send photo
                if ((requestType === 'Комиссия' || requestType === 'Автоломбард') && photoInput.files.length > 0) {
                    formData.append('chat_id', CHAT_ID);
                    formData.append('photo', photoInput.files[0]);
                    formData.append('caption', telegramMessage);
                    formData.append('parse_mode', 'Markdown');
                    
                    const response = await fetch(`${TELEGRAM_API_URL}/sendPhoto`, {
                        method: 'POST',
                        body: formData
                    });
                    
                    const result = await response.json();
                    
                    if (result.ok) {
                        showSuccess();
                        modernForm.reset();
                        fileNameSpan.textContent = 'Файл не выбран';
                        fileNameSpan.style.color = '';
                    } else {
                        throw new Error(result.description || 'Ошибка отправки');
                    }
                } else {
                    // Send text message only
                    const response = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            chat_id: CHAT_ID,
                            text: telegramMessage,
                            parse_mode: 'Markdown'
                        })
                    });
                    
                    const result = await response.json();
                    
                    if (result.ok) {
                        showSuccess();
                        modernForm.reset();
                    } else {
                        throw new Error(result.description || 'Ошибка отправки');
                    }
                }
            } catch (error) {
                console.error('Ошибка отправки:', error);
                formMessage.textContent = `❌ Ошибка отправки: ${error.message}`;
                formMessage.className = 'form-message error';
                showNotification('Ошибка отправки заявки', 'error');
            } finally {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Quick buy buttons
    const buyButtons = document.querySelectorAll('.btn-buy');
    buyButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const carModel = this.getAttribute('data-car');
            
            // Set car in form if on page
            const carSelect = document.getElementById('modernCarSelect');
            if (carSelect) {
                carSelect.value = carModel;
            }
            
            // Scroll to form
            document.getElementById('request').scrollIntoView({
                behavior: 'smooth'
            });
            
            // Focus on form
            setTimeout(() => {
                document.getElementById('modernRequestType').focus();
            }, 500);
        });
    });
    
    // Offer buttons
    const offerButtons = document.querySelectorAll('.btn-offer');
    offerButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const offer = this.getAttribute('data-offer');
            
            // Set request type
            const requestType = document.getElementById('modernRequestType');
            if (requestType) {
                requestType.value = 'Аренда с выкупом';
                requestType.dispatchEvent(new Event('change'));
            }
            
            // Scroll to form
            document.getElementById('request').scrollIntoView({
                behavior: 'smooth'
            });
            
            // Add offer to message
            setTimeout(() => {
                const message = document.getElementById('modernMessage');
                if (message) {
                    message.value = `Интересует предложение: ${offer}`;
                }
            }, 500);
        });
    });
}

// Success modal
function showSuccess() {
    const modal = document.getElementById('successModal');
    modal.classList.add('active');
    
    // Play success sound
    messageSentSound.currentTime = 0;
    messageSentSound.play().catch(() => {});
    
    // Close modal on button click
    const closeBtn = modal.querySelector('.modal-close-btn');
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    // Close modal on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    // Close modal after 5 seconds
    setTimeout(() => {
        modal.classList.remove('active');
    }, 5000);
}

// Back to top button
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
            backToTopBtn.style.transform = 'translateY(0)';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
            backToTopBtn.style.transform = 'translateY(20px)';
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Play sound
        clickSound.currentTime = 0;
        clickSound.play().catch(() => {});
    });
}

// Mobile menu toggle
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.main-nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
            
            // Play sound
            clickSound.currentTime = 0;
            clickSound.play().catch(() => {});
        });
        
        // Close menu when clicking on links
        const navLinks = nav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
}

// Header scroll effect
function initHeaderScroll() {
    const header = document.querySelector('.modern-header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
            
            if (currentScroll > lastScroll && currentScroll > 200) {
                // Scrolling down
                header.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                header.style.transform = 'translateY(0)';
            }
        } else {
            header.classList.remove('scrolled');
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
}

// Loading screen
function initLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.classList.add('loaded');
            
            // Remove from DOM after animation
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1000);
    });
}

// Intersection Observer for animations
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .car-card-modern, .testimonial-card, .mini-offer');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initLoadingScreen();
    initMobileMenu();
    initHeaderScroll();
    initParticles();
    animateCounters();
    initCarFilter();
    initFavoriteCars();
    initForms();
    initBackToTop();
    initIntersectionObserver();
    
    // Add CSS for notifications
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--card-bg);
            border-left: 4px solid var(--primary-red);
            padding: 15px 20px;
            border-radius: var(--border-radius-md);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 9999;
            transform: translateX(100%);
            opacity: 0;
            transition: all 0.3s ease;
            box-shadow: var(--shadow-card);
            max-width: 350px;
        }
        
        .notification.show {
            transform: translateX(0);
            opacity: 1;
        }
        
        .notification-success {
            border-left-color: #4CAF50;
        }
        
        .notification-error {
            border-left-color: #F44336;
        }
        
        .notification-info {
            border-left-color: #2196F3;
        }
        
        .notification i {
            font-size: 20px;
        }
        
        .notification-success i {
            color: #4CAF50;
        }
        
        .notification-error i {
            color: #F44336;
        }
        
        .notification-info i {
            color: #2196F3;
        }
        
        .animate-in {
            animation: fadeInUp 0.6s ease-out;
        }
    `;
    document.head.appendChild(style);
});

// Add car models to select
function populateCarSelect() {
    const carSelect = document.getElementById('modernCarSelect');
    if (!carSelect) return;
    
    const cars = [
        'Audi Q8 3.0 TFSI quattro (2019)',
        'Mercedes-Benz C180 (2014)',
        'Ford Focus 2',
        'Audi A5 2.0 TFSI (2019)',
        'Ravon R2 1.3 (2016)',
        'Mercedes Coupe Sport (2012)',
        'Porsche Cayenne (2018)',
        'Range Rover 3.0 Diesel (2020)',
        'Mercedes Coupe Sport (2017)',
        'Mercedes GLE Coupe 3.0 Diesel (2016)',
        'Cadillac Escalade (2016)',
        'Ford Explorer (2012)',
        'Mercedes Coupe Sport 2018'
    ];
    
    cars.forEach(car => {
        const option = document.createElement('option');
        option.value = car;
        option.textContent = car;
        carSelect.appendChild(option);
    });
}

// Call this function when needed
populateCarSelect();