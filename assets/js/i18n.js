/**
 * i18n.js — Internationalization Engine for Ahmed's Portfolio
 * Supports: English (en), Arabic (ar), Turkish (tr), Spanish (es)
 * Default language: English
 */

(function () {
  "use strict";

  const SUPPORTED_LANGS = ["en", "ar", "tr", "es"];
  const DEFAULT_LANG = "en";
  const LANG_STORAGE_KEY = "portfolio_lang";

  let currentLang = DEFAULT_LANG;
  let translations = {};

  /**
   * Get a nested value from an object using a dot-separated key path
   * e.g. getValue(obj, "sidebar.title")
   */
  function getValue(obj, keyPath) {
    return keyPath.split(".").reduce(function (o, k) {
      return o && o[k] !== undefined ? o[k] : null;
    }, obj);
  }

  /**
   * Apply translations to all elements with data-i18n attribute
   */
  function applyTranslations(langData) {
    const elements = document.querySelectorAll("[data-i18n]");
    elements.forEach(function (el) {
      const key = el.getAttribute("data-i18n");
      const value = getValue(langData, key);
      if (value !== null) {
        el.textContent = value;
      }
    });

    // Handle placeholder translations
    const placeholderEls = document.querySelectorAll("[data-i18n-placeholder]");
    placeholderEls.forEach(function (el) {
      const key = el.getAttribute("data-i18n-placeholder");
      const value = getValue(langData, key);
      if (value !== null) {
        el.setAttribute("placeholder", value);
      }
    });

    // Handle title attribute translations
    const titleEls = document.querySelectorAll("[data-i18n-title]");
    titleEls.forEach(function (el) {
      const key = el.getAttribute("data-i18n-title");
      const value = getValue(langData, key);
      if (value !== null) {
        el.setAttribute("title", value);
      }
    });
  }

  /**
   * Set text direction and font based on language metadata
   */
  function applyDirection(langData) {
    const meta = langData._meta || {};
    const dir = meta.dir || "ltr";
    const font = meta.font || "Poppins";

    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", meta.code || DEFAULT_LANG);

    // Apply font family if different from default
    if (font !== "Poppins") {
      // Load the Arabic font dynamically if not already loaded
      if (!document.querySelector('link[href*="' + font + '"]')) {
        const fontLink = document.createElement("link");
        fontLink.rel = "stylesheet";
        fontLink.href = "https://fonts.googleapis.com/css2?family=" + font + ":wght@300;400;500;600;700&display=swap";
        document.head.appendChild(fontLink);
      }
      document.body.style.fontFamily = "'" + font + "', sans-serif";
    } else {
      document.body.style.fontFamily = "";
    }
  }

  /**
   * Update the language switcher buttons to show active state
   */
  function updateSwitcherUI(langCode) {
    const buttons = document.querySelectorAll(".lang-btn");
    buttons.forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === langCode);
    });
  }

  /**
   * Load a language JSON file and apply it
   */
  async function loadLanguage(langCode) {
    if (!SUPPORTED_LANGS.includes(langCode)) {
      langCode = DEFAULT_LANG;
    }

    try {
      const response = await fetch("./assets/lang/" + langCode + ".json?v=" + Date.now());
      if (!response.ok) throw new Error("Failed to load language file");
      const langData = await response.json();

      translations = langData;
      currentLang = langCode;

      applyTranslations(langData);
      applyDirection(langData);
      updateSwitcherUI(langCode);

      // Save preference
      localStorage.setItem(LANG_STORAGE_KEY, langCode);

    } catch (err) {
      console.error("i18n: Error loading language '" + langCode + "':", err);
      // Fallback to English if another language fails
      if (langCode !== DEFAULT_LANG) {
        loadLanguage(DEFAULT_LANG);
      }
    }
  }

  /**
   * Get current language code
   */
  function getCurrentLang() {
    return currentLang;
  }

  /**
   * Get a translation string by key
   */
  function t(key) {
    return getValue(translations, key) || key;
  }

  /**
   * Initialize: bind click events on inline language buttons and load saved language
   */
  function init() {
    // Determine initial language from: localStorage → browser → default
    let savedLang = localStorage.getItem(LANG_STORAGE_KEY);
    if (!savedLang || !SUPPORTED_LANGS.includes(savedLang)) {
      savedLang = DEFAULT_LANG;
    }

    // Bind click events on inline flag buttons
    const langButtons = document.querySelectorAll(".lang-btn");
    langButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        const lang = this.getAttribute("data-lang");
        loadLanguage(lang);
      });
    });

    // Load initial language
    loadLanguage(savedLang);
  }

  // Expose to global scope
  window.i18n = {
    init: init,
    loadLanguage: loadLanguage,
    getCurrentLang: getCurrentLang,
    t: t
  };

  // Auto-init when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
