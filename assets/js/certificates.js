"use strict";

(function () {
  const grid = document.querySelector("[data-certificates-grid]");

  if (!grid) return;

  const createIcon = function (name) {
    const icon = document.createElement("ion-icon");
    icon.setAttribute("name", name);
    return icon;
  };

  const createAction = function (href, label, iconName, isDownload) {
    const link = document.createElement("a");
    link.className = "certificate-btn" + (isDownload ? " primary" : "");
    link.href = href;

    if (isDownload) {
      link.setAttribute("download", "");
    } else {
      link.target = "_blank";
      link.rel = "noopener";
    }

    link.append(createIcon(iconName));

    const text = document.createElement("span");
    text.textContent = label;
    link.append(text);

    return link;
  };

  const createCertificateCard = function (certificate) {
    const filePath = "./assets/certificates/" + certificate.file;
    const card = document.createElement("div");
    card.className = "certificate-card";

    const preview = document.createElement("div");
    preview.className = "certificate-preview";

    const iframe = document.createElement("iframe");
    iframe.src = filePath + "#toolbar=0&navpanes=0";
    iframe.title = certificate.title + " PDF preview";
    iframe.loading = "lazy";
    preview.append(iframe);

    const content = document.createElement("div");
    content.className = "certificate-content";

    const heading = document.createElement("div");
    heading.className = "certificate-heading";

    const title = document.createElement("h3");
    title.className = "h3";
    title.textContent = certificate.title;

    const year = document.createElement("span");
    year.className = "certificate-year";
    year.textContent = certificate.year;

    heading.append(title, year);

    const description = document.createElement("p");
    description.className = "certificate-description";
    description.textContent = certificate.description;

    const actions = document.createElement("div");
    actions.className = "certificate-actions";
    actions.append(
      createAction(filePath, "View PDF", "eye-outline", false),
      createAction(filePath, "Download", "download-outline", true)
    );

    content.append(heading, description, actions);
    card.append(preview, content);

    return card;
  };

  const certificates = window.CERTIFICATES_DATA || [];

  if (certificates.length === 0) {
    const status = document.createElement("p");
    status.className = "certificates-status";
    status.textContent = "Certificates could not be loaded.";
    grid.replaceChildren(status);
    return;
  }

  grid.replaceChildren(...certificates.map(createCertificateCard));
})();
