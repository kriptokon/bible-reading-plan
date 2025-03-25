/**
 * Данные о книгах Библии
 */
const bibleData = {
    hebrew: [
        { id: "genesis", name: "Бытие", chapters: 50 },
        { id: "exodus", name: "Исход", chapters: 40 },
        { id: "leviticus", name: "Левит", chapters: 27 },
        { id: "numbers", name: "Числа", chapters: 36 },
        { id: "deuteronomy", name: "Второзаконие", chapters: 34 },
        { id: "joshua", name: "Иисус Навин", chapters: 24 },
        { id: "judges", name: "Судей", chapters: 21 },
        { id: "ruth", name: "Руфь", chapters: 4 },
        { id: "1samuel", name: "1 Самуила", chapters: 31 },
        { id: "2samuel", name: "2 Самуила", chapters: 24 },
        { id: "1kings", name: "1 Царей", chapters: 22 },
        { id: "2kings", name: "2 Царей", chapters: 25 },
        { id: "1chronicles", name: "1 Летопись", chapters: 29 },
        { id: "2chronicles", name: "2 Летопись", chapters: 36 },
        { id: "ezra", name: "Ездра", chapters: 10 },
        { id: "nehemiah", name: "Неемия", chapters: 13 },
        { id: "esther", name: "Эсфирь", chapters: 10 },
        { id: "job", name: "Иов", chapters: 42 },
        { id: "psalms", name: "Псалмы", chapters: 150 },
        { id: "proverbs", name: "Притчи", chapters: 31 },
        { id: "ecclesiastes", name: "Экклезиаст", chapters: 12 },
        { id: "songofsolomon", name: "Песня Соломона", chapters: 8 },
        { id: "isaiah", name: "Исайя", chapters: 66 },
        { id: "jeremiah", name: "Иеремия", chapters: 52 },
        { id: "lamentations", name: "Плач Иеремии", chapters: 5 },
        { id: "ezekiel", name: "Иезекииль", chapters: 48 },
        { id: "daniel", name: "Даниил", chapters: 12 },
        { id: "hosea", name: "Осия", chapters: 14 },
        { id: "joel", name: "Иоиль", chapters: 3 },
        { id: "amos", name: "Амос", chapters: 9 },
        { id: "obadiah", name: "Авдий", chapters: 1 },
        { id: "jonah", name: "Иона", chapters: 4 },
        { id: "micah", name: "Михей", chapters: 7 },
        { id: "nahum", name: "Наум", chapters: 3 },
        { id: "habakkuk", name: "Аввакум", chapters: 3 },
        { id: "zephaniah", name: "Софония", chapters: 3 },
        { id: "haggai", name: "Аггей", chapters: 2 },
        { id: "zechariah", name: "Захария", chapters: 14 },
        { id: "malachi", name: "Малахия", chapters: 4 }
    ],
    greek: [
        { id: "matthew", name: "Матфея", chapters: 28 },
        { id: "mark", name: "Марка", chapters: 16 },
        { id: "luke", name: "Луки", chapters: 24 },
        { id: "john", name: "Иоанна", chapters: 21 },
        { id: "acts", name: "Деяния", chapters: 28 },
        { id: "romans", name: "Римлянам", chapters: 16 },
        { id: "1corinthians", name: "1 Коринфянам", chapters: 16 },
        { id: "2corinthians", name: "2 Коринфянам", chapters: 13 },
        { id: "galatians", name: "Галатам", chapters: 6 },
        { id: "ephesians", name: "Эфесянам", chapters: 6 },
        { id: "philippians", name: "Филиппийцам", chapters: 4 },
        { id: "colossians", name: "Колоссянам", chapters: 4 },
        { id: "1thessalonians", name: "1 Фессалоникийцам", chapters: 5 },
        { id: "2thessalonians", name: "2 Фессалоникийцам", chapters: 3 },
        { id: "1timothy", name: "1 Тимофею", chapters: 6 },
        { id: "2timothy", name: "2 Тимофею", chapters: 4 },
        { id: "titus", name: "Титу", chapters: 3 },
        { id: "philemon", name: "Филимону", chapters: 1 },
        { id: "hebrews", name: "Евреям", chapters: 13 },
        { id: "james", name: "Иакова", chapters: 5 },
        { id: "1peter", name: "1 Петра", chapters: 5 },
        { id: "2peter", name: "2 Петра", chapters: 3 },
        { id: "1john", name: "1 Иоанна", chapters: 5 },
        { id: "2john", name: "2 Иоанна", chapters: 1 },
        { id: "3john", name: "3 Иоанна", chapters: 1 },
        { id: "jude", name: "Иуды", chapters: 1 },
        { id: "revelation", name: "Откровение", chapters: 22 }
    ]
};

// Общее количество глав в каждом разделе
const totalHebrewChapters = bibleData.hebrew.reduce((sum, book) => sum + book.chapters, 0);
const totalGreekChapters = bibleData.greek.reduce((sum, book) => sum + book.chapters, 0);

/**
 * Функция для создания ключа для локального хранилища
 * @param {string} bookId - ID книги
 * @param {number} chapter - номер главы
 * @returns {string} ключ для хранения
 */
function getStorageKey(bookId, chapter) {
    return `bible_read_${bookId}_${chapter}`;
}

/**
 * Загрузить данные о прочитанных главах из localStorage
 * @returns {Object} объект с информацией о прочитанных главах
 */
function loadReadingProgress() {
    const readingProgress = {
        hebrew: {},
        greek: {},
        lastBook: localStorage.getItem('bible_last_book') || null,
        lastTab: localStorage.getItem('bible_last_tab') || 'hebrew'
    };
    
    // Загрузка прогресса для еврейских писаний
    bibleData.hebrew.forEach(book => {
        readingProgress.hebrew[book.id] = {};
        for (let i = 1; i <= book.chapters; i++) {
            const key = getStorageKey(book.id, i);
            readingProgress.hebrew[book.id][i] = localStorage.getItem(key) === 'true';
        }
    });
    
    // Загрузка прогресса для греческих писаний
    bibleData.greek.forEach(book => {
        readingProgress.greek[book.id] = {};
        for (let i = 1; i <= book.chapters; i++) {
            const key = getStorageKey(book.id, i);
            readingProgress.greek[book.id][i] = localStorage.getItem(key) === 'true';
        }
    });
    
    return readingProgress;
}

/**
 * Сохранить статус прочтения главы в localStorage
 * @param {string} bookId - ID книги
 * @param {number} chapter - номер главы
 * @param {boolean} isRead - статус прочтения
 */
function saveReadingStatus(bookId, chapter, isRead) {
    const key = getStorageKey(bookId, chapter);
    localStorage.setItem(key, isRead);
}

/**
 * Сохранить последнюю открытую книгу
 * @param {string} bookId - ID книги
 */
function saveLastBook(bookId) {
    localStorage.setItem('bible_last_book', bookId);
}

/**
 * Сохранить последнюю открытую вкладку
 * @param {string} tabId - ID вкладки ('hebrew' или 'greek')
 */
function saveLastTab(tabId) {
    localStorage.setItem('bible_last_tab', tabId);
}

/**
 * Сбросить весь прогресс чтения
 * @returns {Object} новый пустой объект с прогрессом
 */
function resetAllProgress() {
    // Сначала удаляем все элементы локального хранилища, связанные с чтением
    bibleData.hebrew.forEach(book => {
        for (let i = 1; i <= book.chapters; i++) {
            const key = getStorageKey(book.id, i);
            localStorage.removeItem(key);
        }
    });
    
    bibleData.greek.forEach(book => {
        for (let i = 1; i <= book.chapters; i++) {
            const key = getStorageKey(book.id, i);
            localStorage.removeItem(key);
        }
    });
    
    // Сохраняем только информацию о последней открытой вкладке
    const lastTab = localStorage.getItem('bible_last_tab') || 'hebrew';
    localStorage.removeItem('bible_last_book');
    localStorage.setItem('bible_last_tab', lastTab);
    
    // Возвращаем новый объект с пустым прогрессом
    return loadReadingProgress();
}

/**
 * Получить прогресс чтения для книги
 * @param {string} bookId - ID книги
 * @param {Object} readingProgress - объект с прогрессом чтения
 * @returns {Object} объект с информацией о прогрессе
 */
function getBookProgress(bookId, readingProgress) {
    const section = bibleData.hebrew.some(book => book.id === bookId) ? 'hebrew' : 'greek';
    const book = bibleData[section].find(book => book.id === bookId);
    
    if (!book) return { read: 0, total: 0, percentage: 0 };
    
    let readChapters = 0;
    const bookProgress = readingProgress[section][bookId];
    
    if (bookProgress) {
        for (let i = 1; i <= book.chapters; i++) {
            if (bookProgress[i]) readChapters++;
        }
    }
    
    return {
        read: readChapters,
        total: book.chapters,
        percentage: Math.round((readChapters / book.chapters) * 100)
    };
}

/**
 * Получить общий прогресс чтения для раздела
 * @param {string} section - раздел ('hebrew' или 'greek')
 * @param {Object} readingProgress - объект с прогрессом чтения
 * @returns {Object} объект с информацией о прогрессе
 */
function getSectionProgress(section, readingProgress) {
    const totalChapters = section === 'hebrew' ? totalHebrewChapters : totalGreekChapters;
    let readChapters = 0;
    
    bibleData[section].forEach(book => {
        for (let i = 1; i <= book.chapters; i++) {
            if (readingProgress[section][book.id][i]) readChapters++;
        }
    });
    
    return {
        read: readChapters,
        total: totalChapters,
        percentage: Math.round((readChapters / totalChapters) * 100)
    };
}
