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

// Populate hidden metadata fields for lead collection
const populateHiddenFields = async function () {
  const pageUrlInput = document.getElementById("hidden_page_url");
  const referrerUrlInput = document.getElementById("hidden_referrer_url");
  const utmParamsInput = document.getElementById("hidden_utm_params");
  const submissionTimeInput = document.getElementById("hidden_submission_time");
  const deviceTypeInput = document.getElementById("hidden_device_type");
  const browserInput = document.getElementById("hidden_browser");
  const approxLocationInput = document.getElementById("hidden_approx_location");

  if (pageUrlInput) pageUrlInput.value = window.location.href;
  if (referrerUrlInput) referrerUrlInput.value = document.referrer || "Direct";

  // Parse UTM parameters
  const urlParams = new URLSearchParams(window.location.search);
  const utmFields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  const utmObj = {};
  utmFields.forEach(param => {
    if (urlParams.has(param)) {
      utmObj[param] = urlParams.get(param);
    }
  });
  if (utmParamsInput) utmParamsInput.value = Object.keys(utmObj).length > 0 ? JSON.stringify(utmObj) : "None";

  // Date and Time
  if (submissionTimeInput) submissionTimeInput.value = new Date().toLocaleString();

  // Device Type
  let deviceType = "Desktop";
  if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
    deviceType = "Mobile";
  } else if (/iPad|Tablet/i.test(navigator.userAgent)) {
    deviceType = "Tablet";
  }
  if (deviceTypeInput) deviceTypeInput.value = deviceType;

  // Browser
  let browser = "Unknown Browser";
  const ua = navigator.userAgent;
  if (ua.indexOf("Firefox") > -1) {
    browser = "Mozilla Firefox";
  } else if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) {
    browser = "Opera";
  } else if (ua.indexOf("Chrome") > -1) {
    browser = "Google Chrome";
  } else if (ua.indexOf("Safari") > -1) {
    browser = "Apple Safari";
  } else if (ua.indexOf("Edge") > -1) {
    browser = "Microsoft Edge";
  }
  if (browserInput) browserInput.value = browser;

  // Location Geolocation API
  if (approxLocationInput) {
    try {
      const response = await fetch("https://freeipapi.com/api/json");
      if (response.ok) {
        const geoData = await response.json();
        approxLocationInput.value = `${geoData.cityName || "Unknown City"}, ${geoData.countryName || "Unknown Country"}`;
      } else {
        approxLocationInput.value = "Unknown (API error)";
      }
    } catch (e) {
      approxLocationInput.value = "Unknown (Blocked/Adblock)";
    }
  }
};

// Send visitor alert notification on page load (once per session to avoid spam)
const reportVisit = async function () {
  if (sessionStorage.getItem("visit_reported")) return;
  sessionStorage.setItem("visit_reported", "true");

  const pageUrl = window.location.href;
  const referrer = document.referrer || "Direct";
  
  const urlParams = new URLSearchParams(window.location.search);
  const utmFields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  const utmObj = {};
  utmFields.forEach(param => {
    if (urlParams.has(param)) {
      utmObj[param] = urlParams.get(param);
    }
  });
  const utmParamsStr = Object.keys(utmObj).length > 0 ? JSON.stringify(utmObj) : "None";

  let deviceType = "Desktop";
  if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
    deviceType = "Mobile";
  } else if (/iPad|Tablet/i.test(navigator.userAgent)) {
    deviceType = "Tablet";
  }

  let browser = "Unknown Browser";
  const ua = navigator.userAgent;
  if (ua.indexOf("Firefox") > -1) {
    browser = "Mozilla Firefox";
  } else if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) {
    browser = "Opera";
  } else if (ua.indexOf("Chrome") > -1) {
    browser = "Google Chrome";
  } else if (ua.indexOf("Safari") > -1) {
    browser = "Apple Safari";
  } else if (ua.indexOf("Edge") > -1) {
    browser = "Microsoft Edge";
  }

  let location = "Unknown";
  try {
    const response = await fetch("https://freeipapi.com/api/json");
    if (response.ok) {
      const geoData = await response.json();
      location = `${geoData.cityName || "Unknown City"}, ${geoData.countryName || "Unknown Country"}`;
    }
  } catch (e) {
    location = "Unknown (Blocked/Adblock)";
  }

  try {
    await fetch("https://formsubmit.co/ajax/4c2147eaca0ce78c681deb9cf3ab2bf6", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: "⚡ Live Visit Alert: New Visitor!",
        message: "A user has entered your portfolio website.",
        page_url: pageUrl,
        referrer_url: referrer,
        utm_params: utmParamsStr,
        device_type: deviceType,
        browser: browser,
        approx_location: location,
        time: new Date().toLocaleString()
      })
    });
  } catch (err) {
    console.error("Failed to send visit alert", err);
  }
};

window.addEventListener("load", async function() {
  await populateHiddenFields();
  await reportVisit();
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
    for (let j = 0; j < pages.length; j++) {
      if (this.innerHTML.toLowerCase() === pages[j].dataset.page) {
        pages[j].classList.add("active");
        window.scrollTo(0, 0);
      }
    }

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

    // Track project view event
    trackGAEvent("view_project", { project_name: projectTitle, project_file: fileName });

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

// Click trackers for contacts and downloads
document.addEventListener("DOMContentLoaded", function () {
  // Track WhatsApp Clicks
  document.getElementById("whatsapp-link")?.addEventListener("click", function() {
    trackGAEvent("click_whatsapp");
  });

  // Track Email Link Clicks
  document.querySelectorAll("a[href^='mailto:']").forEach(link => {
    link.addEventListener("click", function() {
      trackGAEvent("click_email", { email_address: this.getAttribute("href") });
    });
  });

  // Track CV Download Clicks
  document.querySelector(".download-cv-btn")?.addEventListener("click", function() {
    trackGAEvent("download_cv");
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
