const TOKEN = '7990942936:AAG1lRKSS2r1Q2_svd2L41ngtp43LBpFMeo';
const CHAT_ID = '-1002816551291'; // Замените на актуальный CHAT_ID супергруппы
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TOKEN}`;

// Sound effect for successful form submission
const messageSentSound = new Audio('https://www.soundjay.com/buttons/beep-01a.mp3'); // Public domain "message sent" sound

document.addEventListener('DOMContentLoaded', () => {
    // Мобильное меню
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', nav.classList.contains('active'));
        });
    }

    // Динамическое заполнение списка автомобилей на index.html
    const carSelect = document.getElementById('car');
    if (carSelect) {
        const cars = document.querySelectorAll('.cars-grid .car-item h3');
        carSelect.innerHTML = '<option value="">-- Выберите автомобиль --</option>';
        cars.forEach(car => {
            const option = document.createElement('option');
            option.value = car.textContent;
            option.textContent = car.textContent;
            carSelect.appendChild(option);
        });
    }

    // Скрытие/показ полей формы на index.html
    const requestTypeSelect = document.getElementById('requestType');
    if (requestTypeSelect) {
        requestTypeSelect.addEventListener('change', function () {
            const uploadField = document.getElementById('uploadField');
            const carSelect = document.getElementById('car');
            const fullNameField = document.getElementById('fullName');
            const phoneField = document.getElementById('phone');
            const photoField = document.getElementById('photo');

            let budgetLabel = document.querySelector('label[for="budget"]');
            let budgetInput = document.getElementById('budget');
            let desiredCarLabel = document.querySelector('label[for="desiredCar"]');
            let desiredCarInput = document.getElementById('desiredCar');

            // Удаляем поля бюджета и желаемой машины, если они есть
            if (budgetLabel) budgetLabel.remove();
            if (budgetInput) budgetInput.remove();
            if (desiredCarLabel) desiredCarLabel.remove();
            if (desiredCarInput) desiredCarInput.remove();

            // Сбрасываем настройки полей
            carSelect.disabled = false;
            uploadField.style.display = 'none';
            fullNameField.disabled = false;
            phoneField.disabled = false;
            photoField.disabled = false;

            if (this.value === 'Комиссия' || this.value === 'Автоломбард') {
                carSelect.disabled = true;
                uploadField.style.display = 'block';
            } else if (this.value === 'Автоподбор') {
                budgetLabel = document.createElement('label');
                budgetLabel.setAttribute('for', 'budget');
                budgetLabel.textContent = 'Бюджет:';
                budgetInput = document.createElement('input');
                budgetInput.type = 'text';
                budgetInput.id = 'budget';
                budgetInput.required = true;

                desiredCarLabel = document.createElement('label');
                desiredCarLabel.setAttribute('for', 'desiredCar');
                desiredCarLabel.textContent = 'Желаемая машина:';
                desiredCarInput = document.createElement('input');
                desiredCarInput.type = 'text';
                desiredCarInput.id = 'desiredCar';
                desiredCarInput.required = true;

                const fullNameLabel = document.querySelector('label[for="fullName"]');
                this.form.insertBefore(budgetLabel, fullNameLabel);
                this.form.insertBefore(budgetInput, fullNameLabel);
                this.form.insertBefore(desiredCarLabel, fullNameLabel);
                this.form.insertBefore(desiredCarInput, fullNameLabel);

                carSelect.disabled = true;
                uploadField.style.display = 'none';
            }
        });
    }

    // Обработка формы на index.html
    const inspectionForm = document.getElementById('inspectionForm');
    if (inspectionForm) {
        inspectionForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const formMessage = document.getElementById('formMessage');
            formMessage.textContent = 'Отправка...';

            const requestType = document.getElementById('requestType').value;
            const car = document.getElementById('car').value;
            const fullName = document.getElementById('fullName').value;
            const phone = document.getElementById('phone').value;
            const photoFile = document.getElementById('photo').files[0];
            const budget = document.getElementById('budget') ? document.getElementById('budget').value : '';
            const desiredCar = document.getElementById('desiredCar') ? document.getElementById('desiredCar').value : '';

            // Проверка обязательных полей
            if (requestType === 'Автоподбор') {
                if (!budget || !desiredCar || !fullName || !phone) {
                    formMessage.textContent = '❌ Пожалуйста, заполните все обязательные поля.';
                    return;
                }
            } else if (requestType === 'Комиссия' || requestType === 'Автоломбард') {
                if (!fullName || !phone) {
                    formMessage.textContent = '❌ Пожалуйста, заполните все обязательные поля (ФИО и телефон).';
                    return;
                }
            } else {
                if (!car || !fullName || !phone) {
                    formMessage.textContent = '❌ Пожалуйста, заполните все обязательные поля.';
                    return;
                }
            }

            // Формируем сообщение
            let message = `
🚗 *Новая заявка с сайта*  
Тип: ${requestType}  
${requestType === 'Автоподбор' ? `Бюджет: ${budget}  \nЖелаемая машина: ${desiredCar}` : (car ? `Авто: ${car}` : 'Авто: не выбрано')}  
ФИО: ${fullName}  
Телефон: ${phone}
            `;

            if (photoFile && (requestType === 'Комиссия' || requestType === 'Автоломбард')) {
                const formData = new FormData();
                formData.append('chat_id', CHAT_ID);
                formData.append('photo', photoFile);
                formData.append('caption', message);
                formData.append('parse_mode', 'Markdown');

                fetch(`${TELEGRAM_API_URL}/sendPhoto`, {
                    method: 'POST',
                    body: formData
                })
                    .then(response => response.json())
                    .then(result => {
                        if (result.ok) {
                            formMessage.textContent = '✅ Заявка отправлена!';
                            this.reset();
                            document.getElementById('uploadField').style.display = 'none';
                            document.getElementById('car').disabled = false;
                            if (document.querySelector('label[for="budget"]')) document.querySelector('label[for="budget"]').remove();
                            if (document.getElementById('budget')) document.getElementById('budget').remove();
                            if (document.querySelector('label[for="desiredCar"]')) document.querySelector('label[for="desiredCar"]').remove();
                            if (document.getElementById('desiredCar')) document.getElementById('desiredCar').remove();
                            messageSentSound.play().catch(error => console.error('Error playing sound:', error));
                        } else {
                            formMessage.textContent = `❌ Ошибка отправки: ${result.description || 'Неизвестная ошибка'}`;
                        }
                    })
                    .catch(error => {
                        formMessage.textContent = `❌ Ошибка отправки: ${error.message}`;
                        console.error('Ошибка отправки:', error);
                    });
            } else {
                fetch(`${TELEGRAM_API_URL}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: CHAT_ID,
                        text: message,
                        parse_mode: 'Markdown'
                    })
                })
                    .then(response => response.json())
                    .then(result => {
                        if (result.ok) {
                            formMessage.textContent = '✅ Заявка отправлена!';
                            this.reset();
                            document.getElementById('uploadField').style.display = 'none';
                            document.getElementById('car').disabled = false;
                            if (document.querySelector('label[for="budget"]')) document.querySelector('label[for="budget"]').remove();
                            if (document.getElementById('budget')) document.getElementById('budget').remove();
                            if (document.querySelector('label[for="desiredCar"]')) document.querySelector('label[for="desiredCar"]').remove();
                            if (document.getElementById('desiredCar')) document.getElementById('desiredCar').remove();
                            messageSentSound.play().catch(error => console.error('Error playing sound:', error));
                        } else {
                            formMessage.textContent = `❌ Ошибка отправки: ${result.description || 'Неизвестная ошибка'}`;
                        }
                    })
                    .catch(error => {
                        formMessage.textContent = `❌ Ошибка отправки: ${error.message}`;
                        console.error('Ошибка отправки:', error);
                    });
            }
        });
    }

    // Обработка формы на model*.html
    const carInquiryForm = document.getElementById('carInquiryForm');
    if (carInquiryForm) {
        carInquiryForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const formMessage = document.getElementById('formMessage');
            formMessage.textContent = 'Отправка...';

            const fullName = document.getElementById('fullName').value;
            const phone = document.getElementById('phone').value;
            const messageText = document.getElementById('message').value;
            const carModel = document.querySelector('h1').textContent;

            // Проверка обязательных полей
            if (!fullName || !phone) {
                formMessage.textContent = '❌ Пожалуйста, заполните все обязательные поля.';
                return;
            }

            // Формируем сообщение
            const message = `
🚗 *Заявка на автомобиль*  
Модель: ${carModel}  
ФИО: ${fullName}  
Телефон: ${phone}  
${messageText ? `Сообщение: ${messageText}` : ''}
            `;

            fetch(`${TELEGRAM_API_URL}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: message,
                    parse_mode: 'Markdown'
                })
            })
                .then(response => response.json())
                .then(result => {
                    if (result.ok) {
                        formMessage.textContent = '✅ Заявка отправлена!';
                        this.reset();
                        messageSentSound.play().catch(error => console.error('Error playing sound:', error));
                    } else {
                        formMessage.textContent = `❌ Ошибка отправки: ${result.description || 'Неизвестная ошибка'}`;
                    }
                })
                .catch(error => {
                    formMessage.textContent = `❌ Ошибка отправки: ${error.message}`;
                    console.error('Ошибка отправки:', error);
                });
        });
    }

    // Слайдер и модальное окно
    const carSlider = document.querySelector('.car-slider');
    if (carSlider) {
        const slides = document.querySelectorAll('.car-slide');
        const thumbnails = document.querySelectorAll('.car-slider-thumbnails .thumbnail');
        const indicators = document.querySelectorAll('.car-slider-indicators .indicator');
        const prevCar = document.getElementById('prevCar');
        const nextCar = document.getElementById('nextCar');
        const modal = document.getElementById('imageModal');
        const modalImage = document.getElementById('modalImage');
        const modalClose = document.querySelector('.modal-close');
        const modalPrev = document.querySelector('.modal-prev');
        const modalNext = document.querySelector('.modal-next');
        let currentIndex = 0;
        let autoSlideInterval;
        let touchStartX = 0;
        let touchEndX = 0;

        // Ensure modal is hidden on initialization
        if (modal) {
            modal.style.display = 'none'; // Гарантируем, что модальное окно скрыто при загрузке
        }

        const updateSlider = (index) => {
            if (index >= 0 && index < slides.length) {
                carSlider.style.transform = `translateX(-${index * 100}%)`;
                slides.forEach((slide, i) => {
                    slide.setAttribute('aria-current', i === index ? 'true' : 'false');
                });
                indicators.forEach((indicator, i) => {
                    indicator.classList.toggle('active', i === index);
                });
                thumbnails.forEach((thumbnail, i) => {
                    thumbnail.classList.toggle('active', i === index);
                });
                currentIndex = index;
            }
        };

        const startAutoSlide = () => {
            autoSlideInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % slides.length;
                updateSlider(currentIndex);
            }, 5000);
        };

        const stopAutoSlide = () => {
            clearInterval(autoSlideInterval);
        };

        // Инициализация слайдера только после полной загрузки DOM
        if (slides.length > 0) {
            updateSlider(0); // Устанавливаем первый слайд
            startAutoSlide(); // Запускаем автопрокрутку
        }

        // Обработчики событий только для кликов пользователя
        if (prevCar) prevCar.addEventListener('click', () => {
            stopAutoSlide();
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateSlider(currentIndex);
            startAutoSlide();
        });

        if (nextCar) nextCar.addEventListener('click', () => {
            stopAutoSlide();
            currentIndex = (currentIndex + 1) % slides.length;
            updateSlider(currentIndex);
            startAutoSlide();
        });

        if (thumbnails.length > 0) thumbnails.forEach((thumbnail, index) => {
            thumbnail.addEventListener('click', () => {
                stopAutoSlide();
                updateSlider(index);
                startAutoSlide();
            });
        });

        if (indicators.length > 0) indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                stopAutoSlide();
                updateSlider(index);
                startAutoSlide();
            });
        });

        if (slides.length > 0) slides.forEach((slide, index) => {
            slide.addEventListener('click', (e) => {
                // Проверяем, что клик был именно по изображению, а не по слайду
                const img = slide.querySelector('img');
                if (e.target === img) {
                    stopAutoSlide();
                    modalImage.src = img.src;
                    modalImage.alt = img.alt;
                    modal.style.display = 'flex';
                    modal.focus();
                    currentIndex = index;
                }
            });
        });

        if (modalClose) modalClose.addEventListener('click', () => {
            modal.style.display = 'none';
            startAutoSlide();
            if (prevCar) prevCar.focus();
        });

        if (modalPrev) modalPrev.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            modalImage.src = slides[currentIndex].querySelector('img').src;
            modalImage.alt = slides[currentIndex].querySelector('img').alt;
        });

        if (modalNext) modalNext.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            modalImage.src = slides[currentIndex].querySelector('img').src;
            modalImage.alt = slides[currentIndex].querySelector('img').alt;
        });

        // Обработка touch-событий для слайдера
        if (carSlider) {
            carSlider.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                stopAutoSlide();
            });

            carSlider.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                if (touchStartX - touchEndX > 50) {
                    currentIndex = (currentIndex + 1) % slides.length;
                    updateSlider(currentIndex);
                } else if (touchEndX - touchStartX > 50) {
                    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                    updateSlider(currentIndex);
                }
                startAutoSlide();
            });
        }

        // Обработка клавиш
        document.addEventListener('keydown', (e) => {
            if (modal && modal.style.display === 'flex') {
                if (e.key === 'ArrowLeft') {
                    if (modalPrev) modalPrev.click();
                } else if (e.key === 'ArrowRight') {
                    if (modalNext) modalNext.click();
                } else if (e.key === 'Escape') {
                    if (modalClose) modalClose.click();
                }
            }
        });

        // Закрытие модального окна при клике вне изображения
        if (modal) modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                if (modalClose) modalClose.click();
            }
        });

        // Остановка автопрокрутки при взаимодействии
        if (carSlider) {
            carSlider.addEventListener('mouseenter', stopAutoSlide);
            carSlider.addEventListener('mouseleave', startAutoSlide);
        }
    }
});