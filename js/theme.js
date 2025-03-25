/**
 * Управление темой приложения
 */

// Ключ для хранения темы в localStorage
const THEME_STORAGE_KEY = 'bible_reader_theme';

// Возможные значения темы
const THEMES = {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system'
};

// Текущая тема
let currentTheme = localStorage.getItem(THEME_STORAGE_KEY) || THEMES.SYSTEM;

/**
 * Проверка предпочтений системы на темную тему
 * @returns {boolean} true если система предпочитает темную тему
 */
function isSystemDarkTheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Установка темы
 * @param {string} theme - тема для установки (light, dark или system)
 */
function setTheme(theme) {
    // Сохраняем выбор в localStorage
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    currentTheme = theme;
    
    // Определяем нужно ли применять темную тему
    let shouldApplyDark = theme === THEMES.DARK || 
                          (theme === THEMES.SYSTEM && isSystemDarkTheme());
    
    // Применяем соответствующий класс к body
    if (shouldApplyDark) {
        document.body.classList.add('dark-theme');
        document.querySelector('meta[name="theme-color"]').setAttribute('content', '#121212');
    } else {
        document.body.classList.remove('dark-theme');
        document.querySelector('meta[name="theme-color"]').setAttribute('content', '#6200ee');
    }
    
    // Обновляем иконку переключателя темы
    updateThemeToggleIcon();
}

/**
 * Обновление иконки переключателя темы
 */
function updateThemeToggleIcon() {
    const themeToggle = document.getElementById('theme-toggle');
    
    if (!themeToggle) return;
    
    // Выбираем иконку в зависимости от текущей темы
    if (currentTheme === THEMES.LIGHT) {
        themeToggle.textContent = 'wb_sunny';
    } else if (currentTheme === THEMES.DARK) {
        themeToggle.textContent = 'nightlight';
    } else {
        themeToggle.textContent = 'brightness_auto';
    }
}

/**
 * Переключение темы
 */
function toggleTheme() {
    // Циклический переход между темами
    if (currentTheme === THEMES.LIGHT) {
        setTheme(THEMES.DARK);
    } else if (currentTheme === THEMES.DARK) {
        setTheme(THEMES.SYSTEM);
    } else {
        setTheme(THEMES.LIGHT);
    }
}

/**
 * Инициализация обработчиков темы
 */
function initThemeHandlers() {
    // Применяем сохраненную тему при загрузке
    setTheme(currentTheme);
    
    // Обработчик клика по кнопке переключения темы
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Обработчик изменения системной темы
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (currentTheme === THEMES.SYSTEM) {
            setTheme(THEMES.SYSTEM);
        }
    });
}

// Когда DOM полностью загружен, инициализируем обработчики темы
document.addEventListener('DOMContentLoaded', initThemeHandlers);
