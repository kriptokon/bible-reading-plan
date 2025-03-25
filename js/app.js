/**
 * Основной файл приложения План чтения Библии
 */

// Инициализация глобальных переменных
let readingProgress;
let currentBook = null;

/**
 * Инициализация Material Design компонентов
 */
function initializeMDC() {
    // Инициализация верхней панели
    const topAppBar = new mdc.topAppBar.MDCTopAppBar(document.querySelector('.mdc-top-app-bar'));
    
    // Инициализация вкладок
    const tabBar = new mdc.tabBar.MDCTabBar(document.querySelector('.mdc-tab-bar'));
    
    // Инициализация линейных индикаторов прогресса
    const hebrewProgressBar = new mdc.linearProgress.MDCLinearProgress(document.getElementById('hebrew-progress'));
    const greekProgressBar = new mdc.linearProgress.MDCLinearProgress(document.getElementById('greek-progress'));
    const bookProgressBar = new mdc.linearProgress.MDCLinearProgress(document.getElementById('book-progress'));
    
    // Обработчик для переключения между вкладками
    tabBar.listen('MDCTabBar:activated', (event) => {
        const tabIndex = event.detail.index;
        const tabPanels = document.querySelectorAll('.tab-panel');
        
        // Скрыть все панели
        tabPanels.forEach(panel => panel.classList.remove('active'));
        
        // Показать выбранную панель
        if (tabIndex === 0) {
            document.getElementById('hebrew-panel').classList.add('active');
            saveLastTab('hebrew');
        } else {
            document.getElementById('greek-panel').classList.add('active');
            saveLastTab('greek');
        }
    });
    
    return { tabBar, hebrewProgressBar, greekProgressBar, bookProgressBar };
}

/**
 * Обновление индикаторов прогресса
 */
function updateProgressBars(mdcComponents) {
    // Получаем прогресс для еврейских писаний
    const hebrewProgress = getSectionProgress('hebrew', readingProgress);
    mdcComponents.hebrewProgressBar.progress = hebrewProgress.percentage / 100;
    document.getElementById('hebrew-progress-text').textContent = `${hebrewProgress.percentage}%`;
    
    // Получаем прогресс для греческих писаний
    const greekProgress = getSectionProgress('greek', readingProgress);
    mdcComponents.greekProgressBar.progress = greekProgress.percentage / 100;
    document.getElementById('greek-progress-text').textContent = `${greekProgress.percentage}%`;
    
    // Обновляем прогресс для текущей открытой книги (если есть)
    if (currentBook) {
        const bookProgress = getBookProgress(currentBook, readingProgress);
        mdcComponents.bookProgressBar.progress = bookProgress.percentage / 100;
        document.getElementById('book-progress-text').textContent = `${bookProgress.percentage}%`;
    }
}

/**
 * Создание карточки для книги
 */
function createBookCard(book, sectionType, readingProgress) {
    const bookProgress = getBookProgress(book.id, readingProgress);
    
    const card = document.createElement('div');
    card.className = 'book-card';
    card.setAttribute('data-book-id', book.id);
    card.setAttribute('data-section', sectionType);
    
    // Создаем заголовок карточки (часть, которая всегда видна)
    const header = document.createElement('div');
    header.className = 'book-header';
    
    const bookInfo = document.createElement('div');
    bookInfo.className = 'book-info';
    
    const title = document.createElement('h3');
    title.className = 'book-title';
    title.textContent = book.name;
    
    const progress = document.createElement('div');
    progress.className = 'book-progress';
    progress.textContent = `Прочитано ${bookProgress.read} из ${bookProgress.total} (${bookProgress.percentage}%)`;
    
    const icon = document.createElement('span');
    icon.className = 'material-icons book-icon';
    icon.textContent = 'arrow_forward';
    
    bookInfo.appendChild(title);
    bookInfo.appendChild(progress);
    header.appendChild(bookInfo);
    header.appendChild(icon);
    
    // Создаем разворачивающуюся часть с главами
    const chaptersContainer = document.createElement('div');
    chaptersContainer.className = 'book-chapters';
    
    // Добавляем прогресс-бар для книги
    const progressBarContainer = document.createElement('div');
    progressBarContainer.className = 'progress-summary book-progress-bar';
    
    const progressBar = document.createElement('div');
    progressBar.className = 'mdc-linear-progress';
    progressBar.setAttribute('role', 'progressbar');
    
    progressBar.innerHTML = `
        <div class="mdc-linear-progress__buffer"></div>
        <div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
            <span class="mdc-linear-progress__bar-inner"></span>
        </div>
        <div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
            <span class="mdc-linear-progress__bar-inner"></span>
        </div>
    `;
    
    const progressText = document.createElement('div');
    progressText.className = 'progress-text';
    progressText.textContent = `${bookProgress.percentage}%`;
    
    progressBarContainer.appendChild(progressBar);
    progressBarContainer.appendChild(progressText);
    chaptersContainer.appendChild(progressBarContainer);
    
    // Создаем сетку глав
    const chaptersGrid = document.createElement('div');
    chaptersGrid.className = 'chapters-grid';
    
    // Создаем кнопки для каждой главы
    for (let i = 1; i <= book.chapters; i++) {
        const chapterItem = document.createElement('div');
        chapterItem.className = 'chapter-item';
        if (readingProgress[sectionType][book.id][i]) {
            chapterItem.classList.add('read');
        }
        chapterItem.setAttribute('data-chapter', i);
        chapterItem.textContent = i;
        chaptersGrid.appendChild(chapterItem);
    }
    
    chaptersContainer.appendChild(chaptersGrid);
    
    // Кнопки для маркировки всех глав
    const actionsContainer = document.createElement('div');
    actionsContainer.className = 'modal-actions';
    
    const markAllReadBtn = document.createElement('button');
    markAllReadBtn.className = 'mdc-button mdc-button--raised mark-all-read-btn';
    markAllReadBtn.innerHTML = '<span class="mdc-button__label">Отметить все как прочитанное</span>';
    markAllReadBtn.setAttribute('data-book-id', book.id);
    
    const markAllUnreadBtn = document.createElement('button');
    markAllUnreadBtn.className = 'mdc-button mark-all-unread-btn';
    markAllUnreadBtn.innerHTML = '<span class="mdc-button__label">Отметить все как непрочитанное</span>';
    markAllUnreadBtn.setAttribute('data-book-id', book.id);
    
    actionsContainer.appendChild(markAllReadBtn);
    actionsContainer.appendChild(markAllUnreadBtn);
    chaptersContainer.appendChild(actionsContainer);
    
    // Добавляем все элементы в карточку
    card.appendChild(header);
    card.appendChild(chaptersContainer);
    
    return card;
}

/**
 * Отображение книг в списке
 */
function renderBooksList() {
    const hebrewBooksContainer = document.getElementById('hebrew-books-list');
    const greekBooksContainer = document.getElementById('greek-books-list');
    
    // Очищаем контейнеры
    hebrewBooksContainer.innerHTML = '';
    greekBooksContainer.innerHTML = '';
    
    // Отображаем еврейские книги
    bibleData.hebrew.forEach(book => {
        const card = createBookCard(book, 'hebrew', readingProgress);
        hebrewBooksContainer.appendChild(card);
    });
    
    // Отображаем греческие книги
    bibleData.greek.forEach(book => {
        const card = createBookCard(book, 'greek', readingProgress);
        greekBooksContainer.appendChild(card);
    });
}

// Функция showBookDetail удалена, так как теперь мы используем разворачивающиеся карточки

/**
 * Добавление обработчиков событий
 */
function addEventListeners(mdcComponents) {
    // Инициализируем линейные индикаторы прогресса для каждой книги
    document.querySelectorAll('.book-card .mdc-linear-progress').forEach(progressBar => {
        new mdc.linearProgress.MDCLinearProgress(progressBar);
    });
    
    // Обработчик клика по заголовку книги для разворачивания/сворачивания глав
    document.addEventListener('click', (event) => {
        let headerElement = event.target.closest('.book-header');
        if (headerElement) {
            const card = headerElement.closest('.book-card');
            const bookId = card.getAttribute('data-book-id');
            
            // Сохраняем ID книги
            currentBook = bookId;
            saveLastBook(bookId);
            
            // Разворачиваем/сворачиваем карточку
            if (card.classList.contains('expanded')) {
                card.classList.remove('expanded');
            } else {
                // Сворачиваем все другие карточки
                document.querySelectorAll('.book-card.expanded').forEach(expandedCard => {
                    if (expandedCard !== card) {
                        expandedCard.classList.remove('expanded');
                    }
                });
                
                card.classList.add('expanded');
            }
        }
    });
    
    // Обработчик клика по главе для изменения статуса прочтения
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('chapter-item')) {
            const chapter = parseInt(event.target.getAttribute('data-chapter'));
            const card = event.target.closest('.book-card');
            const bookId = card.getAttribute('data-book-id');
            const section = card.getAttribute('data-section');
            
            // Инвертируем статус
            const isCurrentlyRead = readingProgress[section][bookId][chapter];
            readingProgress[section][bookId][chapter] = !isCurrentlyRead;
            
            // Сохраняем изменения
            saveReadingStatus(bookId, chapter, !isCurrentlyRead);
            
            // Обновляем визуальное отображение
            if (!isCurrentlyRead) {
                event.target.classList.add('read');
            } else {
                event.target.classList.remove('read');
            }
            
            // Обновляем индикаторы прогресса
            updateProgressBars(mdcComponents);
            
            // Обновляем содержимое карточки
            const bookProgress = getBookProgress(bookId, readingProgress);
            card.querySelector('.book-progress').textContent = 
                `Прочитано ${bookProgress.read} из ${bookProgress.total} (${bookProgress.percentage}%)`;
            
            // Обновляем прогресс-бар книги
            const progressBar = card.querySelector('.mdc-linear-progress');
            if (progressBar && progressBar.MDCLinearProgress) {
                progressBar.MDCLinearProgress.progress = bookProgress.percentage / 100;
            }
            card.querySelector('.progress-text').textContent = `${bookProgress.percentage}%`;
            
            // Если все главы прочитаны, обновляем иконку книги
            const bookIcon = card.querySelector('.book-icon');
            if (bookProgress.percentage === 100) {
                bookIcon.textContent = 'check_circle';
            } else {
                bookIcon.textContent = 'arrow_forward';
            }
        }
    });
    
    // Обработчики кнопок "Отметить все как прочитанное/непрочитанное"
    document.addEventListener('click', (event) => {
        if (event.target.closest('.mark-all-read-btn')) {
            const btn = event.target.closest('.mark-all-read-btn');
            const bookId = btn.getAttribute('data-book-id');
            const card = btn.closest('.book-card');
            const section = card.getAttribute('data-section');
            
            markAllChaptersInCard(bookId, section, true, card, mdcComponents);
            event.stopPropagation();
        } else if (event.target.closest('.mark-all-unread-btn')) {
            const btn = event.target.closest('.mark-all-unread-btn');
            const bookId = btn.getAttribute('data-book-id');
            const card = btn.closest('.book-card');
            const section = card.getAttribute('data-section');
            
            markAllChaptersInCard(bookId, section, false, card, mdcComponents);
            event.stopPropagation();
        }
    });
}

/**
 * Отметить все главы в открытой карточке книги как прочитанные/непрочитанные
 */
function markAllChaptersInCard(bookId, section, isRead, card, mdcComponents) {
    const book = bibleData[section].find(book => book.id === bookId);
    
    if (!book) return;
    
    // Обновляем статус всех глав
    for (let i = 1; i <= book.chapters; i++) {
        readingProgress[section][bookId][i] = isRead;
        saveReadingStatus(bookId, i, isRead);
    }
    
    // Обновляем отображение глав в этой карточке
    const chapterItems = card.querySelectorAll('.chapter-item');
    chapterItems.forEach(item => {
        if (isRead) {
            item.classList.add('read');
        } else {
            item.classList.remove('read');
        }
    });
    
    // Обновляем индикаторы прогресса
    updateProgressBars(mdcComponents);
    
    // Обновляем содержимое карточки
    const bookProgress = getBookProgress(bookId, readingProgress);
    card.querySelector('.book-progress').textContent = 
        `Прочитано ${bookProgress.read} из ${bookProgress.total} (${bookProgress.percentage}%)`;
    
    // Обновляем прогресс-бар книги
    const progressBar = card.querySelector('.mdc-linear-progress');
    if (progressBar && progressBar.MDCLinearProgress) {
        progressBar.MDCLinearProgress.progress = bookProgress.percentage / 100;
    }
    card.querySelector('.progress-text').textContent = `${bookProgress.percentage}%`;
    
    // Если все главы прочитаны, обновляем иконку книги
    const bookIcon = card.querySelector('.book-icon');
    if (bookProgress.percentage === 100) {
        bookIcon.textContent = 'check_circle';
    } else {
        bookIcon.textContent = 'arrow_forward';
    }
}

/**
 * Отметить все главы текущей книги как прочитанные/непрочитанные (устаревшая функция для модального окна)
 */
function markAllChapters(isRead, mdcComponents) {
    if (!currentBook) return;
    
    const section = bibleData.hebrew.some(book => book.id === currentBook) ? 'hebrew' : 'greek';
    const book = bibleData[section].find(book => book.id === currentBook);
    
    if (!book) return;
    
    // Обновляем статус всех глав
    for (let i = 1; i <= book.chapters; i++) {
        readingProgress[section][currentBook][i] = isRead;
        saveReadingStatus(currentBook, i, isRead);
    }
    
    // Обновляем отображение глав
    const chapterItems = document.querySelectorAll('.chapter-item');
    chapterItems.forEach(item => {
        if (isRead) {
            item.classList.add('read');
        } else {
            item.classList.remove('read');
        }
    });
    
    // Обновляем индикаторы прогресса
    updateProgressBars(mdcComponents);
    
    // Обновляем списки книг
    renderBooksList();
}

/**
 * Инициализация приложения
 */
function initApp() {
    // Загружаем данные о прогрессе
    readingProgress = loadReadingProgress();
    
    // Инициализируем компоненты Material Design
    const mdcComponents = initializeMDC();
    
    // Отображаем списки книг
    renderBooksList();
    
    // Обновляем индикаторы прогресса
    updateProgressBars(mdcComponents);
    
    // Добавляем обработчики событий
    addEventListeners(mdcComponents);
    
    // Открываем последнюю вкладку
    if (readingProgress.lastTab === 'greek') {
        mdcComponents.tabBar.activateTab(1);
    }
    
    // Открываем последнюю книгу, если есть
    if (readingProgress.lastBook) {
        setTimeout(() => {
            const bookCard = document.querySelector(`[data-book-id="${readingProgress.lastBook}"]`);
            if (bookCard) {
                const headerElement = bookCard.querySelector('.book-header');
                if (headerElement) {
                    headerElement.click();
                }
            }
        }, 300);
    }
}

// Запускаем приложение после загрузки DOM
document.addEventListener('DOMContentLoaded', initApp);
