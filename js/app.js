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
    icon.textContent = bookProgress.percentage === 100 ? 'check_circle' : 'arrow_forward';
    
    bookInfo.appendChild(title);
    bookInfo.appendChild(progress);
    card.appendChild(bookInfo);
    card.appendChild(icon);
    
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

/**
 * Отображение модального окна с главами книги
 */
function showBookDetail(bookId, mdcComponents) {
    const section = bibleData.hebrew.some(book => book.id === bookId) ? 'hebrew' : 'greek';
    const book = bibleData[section].find(book => book.id === bookId);
    
    if (!book) return;
    
    // Устанавливаем текущую книгу
    currentBook = bookId;
    saveLastBook(bookId);
    
    // Заполняем модальное окно
    document.getElementById('book-detail-title').textContent = book.name;
    
    const chaptersGrid = document.getElementById('chapters-grid');
    chaptersGrid.innerHTML = '';
    
    // Создаем кнопки для каждой главы
    for (let i = 1; i <= book.chapters; i++) {
        const chapterItem = document.createElement('div');
        chapterItem.className = 'chapter-item';
        if (readingProgress[section][bookId][i]) {
            chapterItem.classList.add('read');
        }
        chapterItem.setAttribute('data-chapter', i);
        chapterItem.textContent = i;
        chaptersGrid.appendChild(chapterItem);
    }
    
    // Обновляем прогресс для книги
    const bookProgress = getBookProgress(bookId, readingProgress);
    mdcComponents.bookProgressBar.progress = bookProgress.percentage / 100;
    document.getElementById('book-progress-text').textContent = `${bookProgress.percentage}%`;
    
    // Отображаем модальное окно
    document.getElementById('book-detail-modal').classList.add('active');
}

/**
 * Добавление обработчиков событий
 */
function addEventListeners(mdcComponents) {
    // Обработчик клика по книге для отображения детальной информации
    document.querySelectorAll('.book-card').forEach(card => {
        card.addEventListener('click', () => {
            const bookId = card.getAttribute('data-book-id');
            showBookDetail(bookId, mdcComponents);
        });
    });
    
    // Обработчик клика по главе для изменения статуса прочтения
    document.getElementById('chapters-grid').addEventListener('click', (event) => {
        if (event.target.classList.contains('chapter-item')) {
            const chapter = parseInt(event.target.getAttribute('data-chapter'));
            const section = bibleData.hebrew.some(book => book.id === currentBook) ? 'hebrew' : 'greek';
            
            // Инвертируем статус
            const isCurrentlyRead = readingProgress[section][currentBook][chapter];
            readingProgress[section][currentBook][chapter] = !isCurrentlyRead;
            
            // Сохраняем изменения
            saveReadingStatus(currentBook, chapter, !isCurrentlyRead);
            
            // Обновляем визуальное отображение
            if (!isCurrentlyRead) {
                event.target.classList.add('read');
            } else {
                event.target.classList.remove('read');
            }
            
            // Обновляем индикаторы прогресса
            updateProgressBars(mdcComponents);
            
            // Обновляем списки книг
            renderBooksList();
        }
    });
    
    // Обработчик закрытия модального окна
    document.getElementById('close-modal').addEventListener('click', () => {
        document.getElementById('book-detail-modal').classList.remove('active');
    });
    
    // Обработчики кнопок "Отметить все как прочитанное/непрочитанное"
    document.getElementById('mark-all-read').addEventListener('click', () => {
        markAllChapters(true, mdcComponents);
    });
    
    document.getElementById('mark-all-unread').addEventListener('click', () => {
        markAllChapters(false, mdcComponents);
    });
    
    // Закрытие модального окна при клике на затемненную область
    document.getElementById('book-detail-modal').addEventListener('click', (event) => {
        if (event.target === document.getElementById('book-detail-modal')) {
            document.getElementById('book-detail-modal').classList.remove('active');
        }
    });
}

/**
 * Отметить все главы текущей книги как прочитанные/непрочитанные
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
                bookCard.click();
            }
        }, 300);
    }
}

// Запускаем приложение после загрузки DOM
document.addEventListener('DOMContentLoaded', initApp);
