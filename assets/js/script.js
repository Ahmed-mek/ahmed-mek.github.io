'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);




// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {
    const categories = filterItems[i].dataset.category.split(',').map(c => c.trim().toLowerCase());

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (categories.includes(selectedValue)) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// Google Analytics 4 (GA4) Custom Event Tracker
const trackGAEvent = function (eventName, eventParams = {}) {
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, eventParams);
  }
};

// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// check form validation function
const checkFormValidity = function () {
  if (form && form.checkValidity()) {
    formBtn.removeAttribute("disabled");
  } else if (formBtn) {
    formBtn.setAttribute("disabled", "");
  }
};

// add event to all form input fields (input and change for select/checkbox)
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", checkFormValidity);
  formInputs[i].addEventListener("change", checkFormValidity);
}

// ── Shared Visitor Data Utilities ──

// Generate or retrieve a unique session ID (per browser tab/session)
const getSessionId = function () {
  let sessionId = sessionStorage.getItem("visitor_session_id");
  if (!sessionId) {
    sessionId = "sess_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now().toString(36);
    sessionStorage.setItem("visitor_session_id", sessionId);
  }
  return sessionId;
};

// Check if this is a new or returning visitor (persisted across sessions via localStorage)
const checkReturningVisitor = function () {
  const hasVisited = localStorage.getItem("portfolio_visited");
  if (!hasVisited) {
    localStorage.setItem("portfolio_visited", Date.now().toString());
    return "New Visitor";
  }
  return "Returning Visitor";
};

// Detect operating system from User Agent
const detectOS = function () {
  const ua = navigator.userAgent;
  if (/Windows NT 10/i.test(ua)) return "Windows 10/11";
  if (/Windows NT/i.test(ua)) return "Windows";
  if (/Mac OS X/i.test(ua)) return "macOS";
  if (/Android/i.test(ua)) return "Android";
  if (/iPhone|iPad|iPod/i.test(ua)) return "iOS";
  if (/Linux/i.test(ua)) return "Linux";
  if (/CrOS/i.test(ua)) return "Chrome OS";
  return "Unknown OS";
};

// Detect browser name
const detectBrowser = function () {
  const ua = navigator.userAgent;
  if (ua.indexOf("Edg") > -1) return "Microsoft Edge";
  if (ua.indexOf("OPR") > -1 || ua.indexOf("Opera") > -1) return "Opera";
  if (ua.indexOf("Firefox") > -1) return "Mozilla Firefox";
  if (ua.indexOf("Chrome") > -1) return "Google Chrome";
  if (ua.indexOf("Safari") > -1) return "Apple Safari";
  return "Unknown Browser";
};

// Detect device type
const detectDevice = function () {
  if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) return "Mobile";
  if (/iPad|Tablet/i.test(navigator.userAgent)) return "Tablet";
  return "Desktop";
};

// Get geolocation with multiple HTTPS fallbacks
const getGeoLocation = async function () {
  // Primary: ipapi.co (HTTPS, CORS enabled, free 1000/day)
  try {
    const res = await fetch("https://ipapi.co/json/");
    if (res.ok) {
      const data = await res.json();
      if (!data.error) {
        return {
          location: `${data.city || "Unknown"}, ${data.region || ""}, ${data.country_name || "Unknown"}`.replace(/, ,/g, ","),
          ip: data.ip || "Unknown",
          isp: data.org || "Unknown"
        };
      }
    }
  } catch (e) { /* fallback */ }

  // Fallback: ipwho.is (HTTPS, CORS enabled, no key needed)
  try {
    const res = await fetch("https://ipwho.is/");
    if (res.ok) {
      const data = await res.json();
      if (data.success !== false) {
        return {
          location: `${data.city || "Unknown"}, ${data.region || ""}, ${data.country || "Unknown"}`.replace(/, ,/g, ","),
          ip: data.ip || "Unknown",
          isp: data.connection?.isp || "Unknown"
        };
      }
    }
  } catch (e) { /* fallback */ }

  return { location: "Unknown", ip: "Unknown", isp: "Unknown" };
};

// Build complete visitor metadata object
const buildVisitorData = async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const utmFields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  const utmObj = {};
  utmFields.forEach(param => {
    if (urlParams.has(param)) utmObj[param] = urlParams.get(param);
  });

  const geo = await getGeoLocation();

  return {
    event_type: "page_visit",
    session_id: getSessionId(),
    visitor_type: checkReturningVisitor(),
    page_url: window.location.href,
    referrer_url: document.referrer || "Direct",
    utm_params: Object.keys(utmObj).length > 0 ? JSON.stringify(utmObj) : "None",
    time: new Date().toLocaleString(),
    device_type: detectDevice(),
    browser: detectBrowser(),
    operating_system: detectOS(),
    screen_resolution: `${screen.width}x${screen.height}`,
    browser_language: navigator.language || navigator.userLanguage || "Unknown",
    color_scheme: window.matchMedia("(prefers-color-scheme: dark)").matches ? "Dark Mode" : "Light Mode",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown",
    approx_location: geo.location,
    ip_address: geo.ip,
    isp: geo.isp
  };
};

// Populate hidden metadata fields for lead collection
const populateHiddenFields = async function () {
  const data = await buildVisitorData();

  const fieldMap = {
    hidden_page_url: data.page_url,
    hidden_referrer_url: data.referrer_url,
    hidden_utm_params: data.utm_params,
    hidden_submission_time: data.time,
    hidden_device_type: data.device_type,
    hidden_browser: data.browser,
    hidden_os: data.operating_system,
    hidden_screen: data.screen_resolution,
    hidden_language: data.browser_language,
    hidden_timezone: data.timezone,
    hidden_approx_location: data.approx_location
  };

  for (const [id, value] of Object.entries(fieldMap)) {
    const el = document.getElementById(id);
    if (el) el.value = value;
  }
};

// ── Google Sheets Visitor Logger ──
const GOOGLE_SHEET_WEBHOOK = "https://script.google.com/macros/s/AKfycbygeH3fl3Omq9L4VoXLiLwKGISj_FjA0SCEHvrUVsJ5cvVmWnlhvLO0MEQxiTxPuQ/exec";

// Send any data object to Google Sheets as a POST (no-cors mode to avoid redirect issues)
const logToGoogleSheets = function (data) {
  if (!GOOGLE_SHEET_WEBHOOK) return;
  try {
    navigator.sendBeacon(
      GOOGLE_SHEET_WEBHOOK,
      new URLSearchParams(Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)])))
    );
  } catch (err) {
    // Fallback: fire-and-forget fetch
    fetch(GOOGLE_SHEET_WEBHOOK, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)])))
    }).catch(() => {});
  }
};

// ── Engagement Event Logger ──
// Sends a lightweight event row to Google Sheets (session_id + event details)
const logEngagementEvent = function (eventType, details = {}) {
  const payload = {
    event_type: eventType,
    session_id: getSessionId(),
    time: new Date().toLocaleString(),
    ...details
  };
  logToGoogleSheets(payload);

  // Also fire to GA4
  trackGAEvent(eventType, details);
};

// Send visitor alert notification on page load (once per session)
const reportVisit = async function () {
  if (sessionStorage.getItem("visit_reported")) return;
  sessionStorage.setItem("visit_reported", "true");

  const data = await buildVisitorData();

  // Run email alert and Google Sheets log in parallel
  await Promise.allSettled([
    // Email alert via FormSubmit
    fetch("https://formsubmit.co/ajax/4c2147eaca0ce78c681deb9cf3ab2bf6", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: "⚡ Live Visit Alert: New Visitor!",
        message: "A user has entered your portfolio website.",
        page_url: data.page_url,
        referrer_url: data.referrer_url,
        utm_params: data.utm_params,
        device_type: data.device_type,
        browser: data.browser,
        operating_system: data.operating_system,
        screen_resolution: data.screen_resolution,
        browser_language: data.browser_language,
        timezone: data.timezone,
        approx_location: data.approx_location,
        ip_address: data.ip_address,
        isp: data.isp,
        time: data.time
      })
    }).catch(err => console.error("Failed to send visit alert", err)),

    // Google Sheets log
    logToGoogleSheets(data)
  ]);
};

window.addEventListener("load", async function () {
  await populateHiddenFields();
  await reportVisit(); // ✅ visit tracking enabled
});

// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    // Remove active class from all pages and nav links first
    for (let j = 0; j < pages.length; j++) {
      pages[j].classList.remove("active");
    }
    for (let k = 0; k < navigationLinks.length; k++) {
      navigationLinks[k].classList.remove("active");
    }

    // Add active class to clicked nav link and corresponding page
    this.classList.add("active");
    const targetPage = this.getAttribute("data-nav-link") || this.innerHTML.toLowerCase().trim();
    for (let j = 0; j < pages.length; j++) {
      if (targetPage === pages[j].dataset.page) {
        pages[j].classList.add("active");
        window.scrollTo(0, 0);
      }
    }

    // ── Track tab navigation ──
    logEngagementEvent("tab_view", { tab_name: targetPage });

  });
}

// Privacy Policy link click routing
const privacyLink = document.getElementById("privacy-link");
privacyLink?.addEventListener("click", function (e) {
  e.preventDefault();
  // Deactivate all pages and nav links
  for (let j = 0; j < pages.length; j++) {
    pages[j].classList.remove("active");
  }
  for (let k = 0; k < navigationLinks.length; k++) {
    navigationLinks[k].classList.remove("active");
  }

  // Show privacy policy page
  const privacyPage = document.querySelector("[data-page='privacy']");
  if (privacyPage) {
    privacyPage.classList.add("active");
    window.scrollTo(0, 0);
  }
});

// project details fetch routing
const projectDetailsArticle = document.querySelector("[data-page='project-details']");
const projectItems = document.querySelectorAll("[data-filter-item]");
const markdownContainer = document.querySelector("[data-markdown-container]");
const projectDetailsBackBtn = document.querySelector("[data-project-details-back]");
const projectPageTitle = document.querySelector("[data-project-page-title]");

for (let i = 0; i < projectItems.length; i++) {
  projectItems[i].addEventListener("click", async function (e) {
    e.preventDefault();

    const fileName = this.dataset.projectFile;
    const projectTitle = this.querySelector(".project-title").innerText;

    if (!fileName) {
      alert("Project details not available yet.");
      return;
    }

    // Track project view event (GA4 + Google Sheets)
    logEngagementEvent("project_view", { project_name: projectTitle, project_file: fileName });

    // Set title and loading text
    projectPageTitle.innerText = projectTitle;
    markdownContainer.innerHTML = "<p>Loading project details...</p>";

    // Hide all other pages
    for (let j = 0; j < pages.length; j++) {
      pages[j].classList.remove("active");
      navigationLinks[j]?.classList.remove("active");
    }

    // Show project details page
    projectDetailsArticle.classList.add("active");
    window.scrollTo(0, 0);

    // Fetch and parse markdown
    try {
      const response = await fetch(`./projects-md/${fileName}.md`);
      if (!response.ok) throw new Error("File not found");
      const text = await response.text();
      markdownContainer.innerHTML = marked.parse(text);
    } catch (error) {
      markdownContainer.innerHTML = `<p>Error loading project details: ${error.message}. Please try again later.</p>`;
    }
  });
}

// Back button functionality
projectDetailsBackBtn?.addEventListener("click", function () {
  projectDetailsArticle.classList.remove("active");

  // Reactivate portfolio page
  for (let j = 0; j < pages.length; j++) {
    if (pages[j].dataset.page === "portfolio") {
      pages[j].classList.add("active");
      for (let k = 0; k < navigationLinks.length; k++) {
        if (navigationLinks[k].innerHTML.toLowerCase() === "portfolio") {
          navigationLinks[k].classList.add("active");
        }
      }
    }
  }
  window.scrollTo(0, 0);
});

// ── Click Trackers for Contacts, Social Links & Downloads ──
document.addEventListener("DOMContentLoaded", function () {

  // Track WhatsApp Clicks
  document.getElementById("whatsapp-link")?.addEventListener("click", function () {
    logEngagementEvent("click_whatsapp");
  });

  // Track Email Link Clicks
  document.querySelectorAll("a[href^='mailto:']").forEach(link => {
    link.addEventListener("click", function () {
      logEngagementEvent("click_email", { link_target: this.getAttribute("href") });
    });
  });

  // Track Phone Clicks
  document.querySelectorAll("a[href^='tel:']").forEach(link => {
    link.addEventListener("click", function () {
      logEngagementEvent("click_phone");
    });
  });

  // Track CV Download Clicks
  document.querySelector(".download-cv-btn")?.addEventListener("click", function () {
    logEngagementEvent("download_cv");
  });

  // Track LinkedIn Click
  document.querySelector("a[href*='linkedin']")?.addEventListener("click", function () {
    logEngagementEvent("click_linkedin");
  });

  // Track GitHub Click
  document.querySelector("a[href*='github']")?.addEventListener("click", function () {
    logEngagementEvent("click_github");
  });

});

// Contact form AJAX submission
form?.addEventListener("submit", async function (e) {
  e.preventDefault();

  const originalBtnText = formBtn.innerHTML;
  formBtn.setAttribute("disabled", "");
  formBtn.innerHTML = `<ion-icon name="sync-outline" class="spin"></ion-icon> <span>Sending...</span>`;

  // Make sure hidden fields are populated
  await populateHiddenFields();

  const formData = new FormData(form);
  const data = {};
  formData.forEach((value, key) => data[key] = value);

  // Track lead form submission event
  trackGAEvent("lead_form_submit", {
    service_type: data.service || "unknown",
    preferred_contact: data.preferred_contact || "unknown"
  });

  try {
    const response = await fetch("https://formsubmit.co/ajax/4c2147eaca0ce78c681deb9cf3ab2bf6", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      // Clear form inputs
      form.reset();
      formBtn.setAttribute("disabled", "");

      // Trigger toast notification
      const toast = document.getElementById("toast-notification");
      toast.classList.add("show");
      setTimeout(() => {
        toast.classList.remove("show");
      }, 4000);
    } else {
      throw new Error("Failed to send message.");
    }
  } catch (error) {
    alert("Oops! There was a problem sending your message. Please try again later.");
  } finally {
    formBtn.innerHTML = originalBtnText;
    // Recheck validity for button state
    checkFormValidity();
  }
});
