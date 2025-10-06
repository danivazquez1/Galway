const menuContainer = document.querySelector(".menu__items");
const categoriesContainer = document.querySelector(".menu__categories");
const eventosGrid = document.getElementById("eventos-grid");
const galeriaGrid = document.getElementById("galeria-grid");
const toggle = document.querySelector(".navbar__toggle");
const linksList = document.querySelector(".navbar__links");
const currentYear = document.getElementById("anio");
const languageSelector = document.getElementById("language-switcher");
const scheduleList = document.getElementById("horario-list");
const htmlElement = document.documentElement;

const siteInfo = window.siteInfo || {};
const menuData = window.menuData || { categorias: [], eventos: [], galeria: [] };
const translations = window.translations || {};
const availableLanguages = Object.keys(translations);
const DEFAULT_LANGUAGE = availableLanguages.includes("es")
  ? "es"
  : availableLanguages[0] || "es";
let currentLanguage = DEFAULT_LANGUAGE;
let activeCategoryId = null;

function getTranslationConfig(lang = currentLanguage) {
  return translations[lang] || {};
}

function t(key, fallback = "") {
  const segments = key.split(".");
  let value = getTranslationConfig();
  for (const segment of segments) {
    if (value && Object.prototype.hasOwnProperty.call(value, segment)) {
      value = value[segment];
    } else {
      value = undefined;
      break;
    }
  }
  return value !== undefined ? value : fallback;
}

function populateLanguageSelector() {
  if (!languageSelector || !availableLanguages.length) return;
  languageSelector.innerHTML = "";
  availableLanguages.forEach((lang) => {
    const option = document.createElement("option");
    option.value = lang;
    option.textContent = translations[lang]?.languageName || lang;
    languageSelector.appendChild(option);
  });

  languageSelector.value = currentLanguage;
  languageSelector.addEventListener("change", (event) => {
    setLanguage(event.target.value);
  });
}

function getFirstCategoryId() {
  return menuData.categorias?.[0]?.id || null;
}

function getLocalizedCategoryLabel(categoria) {
  if (!categoria) return "";
  const overrides = t("menu.categoryLabels", {});
  return overrides?.[categoria.id] || categoria.nombre || categoria.id || "";
}

function formatCurrency(value) {
  if (value === null || value === undefined || value === "") return "";
  const numeric = Number(String(value).replace(/[^0-9.,-]+/g, "").replace(/,/g, "."));
  if (Number.isNaN(numeric)) {
    return value;
  }
  const locale = t("numberLocale", "es-ES");
  const currency = t("currency", "EUR");
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numeric);
}

function updateActiveCategoryButton() {
  if (!categoriesContainer) return;
  categoriesContainer.querySelectorAll(".menu__category-btn").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.category === activeCategoryId);
  });
}

function renderMenuItems(categoryId = null) {
  if (!menuContainer) return;
  menuContainer.innerHTML = "";

  if (!menuData.categorias?.length) {
    menuContainer.innerHTML = `<p>${t(
      "menu.emptyItems",
      "No hay elementos cargados. Edita data/menu.js para agregar tu menú."
    )}</p>`;
    return;
  }

  const selectedId = categoryId || activeCategoryId || getFirstCategoryId();
  activeCategoryId = selectedId;

  const categoriaSeleccionada = menuData.categorias.find((categoria) => categoria.id === selectedId);

  if (!categoriaSeleccionada) {
    menuContainer.innerHTML = `<p>${t(
      "menu.selectCategory",
      "Selecciona una categoría para ver sus opciones."
    )}</p>`;
    updateActiveCategoryButton();
    return;
  }

  const categoriaNombre = getLocalizedCategoryLabel(categoriaSeleccionada);
  const items = categoriaSeleccionada.items.map((item) => ({ ...item, categoria: categoriaNombre }));

  if (!items.length) {
    menuContainer.innerHTML = `<p>${t(
      "menu.emptyItems",
      "No hay elementos cargados. Edita data/menu.js para agregar tu menú."
    )}</p>`;
    updateActiveCategoryButton();
    return;
  }

  const fragment = document.createDocumentFragment();
  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "menu-item";
    card.innerHTML = `
      <header class="menu-item__header">
        <h3>${item.nombre}</h3>
        <span class="menu-item__price">${formatCurrency(item.precio)}</span>
      </header>
      <p class="menu-item__description">${item.descripcion || ""}</p>
      <div class="menu-item__tags">
        ${(item.tags || [])
          .map((tag) => `<span class="tag" aria-label="Etiqueta">${tag}</span>`)
          .join("")}
      </div>
      <p class="menu-item__category">${item.categoria}</p>
    `;
    fragment.appendChild(card);
  });

  menuContainer.appendChild(fragment);
  updateActiveCategoryButton();
}

function renderCategories() {
  if (!categoriesContainer) return;
  categoriesContainer.innerHTML = "";

  if (!menuData.categorias?.length) {
    categoriesContainer.innerHTML = `<p>${t(
      "menu.emptyCategories",
      "No hay categorías disponibles."
    )}</p>`;
    return;
  }

  const fragment = document.createDocumentFragment();
  activeCategoryId = activeCategoryId || getFirstCategoryId();

  menuData.categorias.forEach((categoria) => {
    const button = document.createElement("button");
    button.className = "menu__category-btn";
    button.dataset.category = categoria.id;
    button.textContent = getLocalizedCategoryLabel(categoria);
    if (categoria.id === activeCategoryId) {
      button.classList.add("is-active");
    }
    fragment.appendChild(button);
  });

  categoriesContainer.appendChild(fragment);
}

function handleCategoryClick(event) {
  const button = event.target.closest(".menu__category-btn");
  if (!button) return;

  activeCategoryId = button.dataset.category;
  renderMenuItems(activeCategoryId);
}

function renderEventos() {
  if (!eventosGrid) return;
  if (!menuData.eventos?.length) {
    eventosGrid.innerHTML = `<p>${t(
      "events.empty",
      "Agrega tus experiencias en data/menu.js."
    )}</p>`;
    return;
  }
  const fragment = document.createDocumentFragment();
  menuData.eventos.forEach((evento) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <h3 class="card__title">${evento.titulo}</h3>
      <p class="card__description">${evento.descripcion || ""}</p>
    `;
    fragment.appendChild(card);
  });
  eventosGrid.appendChild(fragment);
}

function renderGaleria() {
  if (!galeriaGrid) return;
  if (!menuData.galeria?.length) {
    galeriaGrid.innerHTML = `<p>${t(
      "gallery.empty",
      "Actualiza la galería en data/menu.js."
    )}</p>`;
    return;
  }
  const fragment = document.createDocumentFragment();
  menuData.galeria.forEach((item) => {
    const element = document.createElement("div");
    element.className = "gallery__item";
    if (item.tipo === "imagen" && item.src) {
      const img = document.createElement("img");
      img.src = item.src;
      img.alt = item.alt || "Imagen del bar";
      element.appendChild(img);
    } else {
      element.textContent =
        item.contenido || t("gallery.fallbackText", "Actualiza este espacio con tus fotos o frases.");
    }
    fragment.appendChild(element);
  });
  galeriaGrid.appendChild(fragment);
}

function hydrateSiteInfo() {
  const fields = {
    direccion: document.getElementById("direccion"),
    barrio: document.getElementById("barrio"),
    telefono: document.getElementById("telefono"),
    whatsapp: document.getElementById("whatsapp"),
    correo: document.getElementById("correo"),
    instagram: document.getElementById("instagram"),
    mapa: document.getElementById("mapa"),
  };

  if (fields.direccion) {
    fields.direccion.textContent = siteInfo.direccion || t("info.addressPlaceholder", "Actualiza tu dirección");
  }
  if (fields.barrio) {
    fields.barrio.textContent = siteInfo.barrio || t("info.cityPlaceholder", "Ciudad");
  }

  if (fields.telefono) {
    const fallback = t("contact.placeholders.phone", "Completa el teléfono");
    fields.telefono.textContent = siteInfo.telefono || fallback;
    fields.telefono.href = siteInfo.telefono ? `tel:${siteInfo.telefono.replace(/\s+/g, "")}` : "tel:";
  }

  if (fields.whatsapp) {
    const fallback = t("contact.placeholders.whatsapp", "Completa el número");
    fields.whatsapp.textContent = siteInfo.whatsapp || fallback;
    fields.whatsapp.href = siteInfo.whatsapp
      ? `https://wa.me/${siteInfo.whatsapp.replace(/[^0-9]/g, "")}`
      : "https://wa.me/";
  }

  if (fields.correo) {
    const fallback = t("contact.placeholders.email", "Completa el correo");
    fields.correo.textContent = siteInfo.correo || fallback;
    fields.correo.href = siteInfo.correo ? `mailto:${siteInfo.correo}` : "mailto:";
  }

  if (fields.instagram) {
    const fallback = t("contact.placeholders.instagram", "Instagram");
    let displayHandle = fallback;
    if (siteInfo.instagramTexto) {
      displayHandle = siteInfo.instagramTexto;
    } else if (siteInfo.instagram) {
      displayHandle = siteInfo.instagram
        .replace(/https?:\/\/(www\.)?instagram\.com\//i, "@")
        .replace(/\/?$/, "");
    }
    fields.instagram.textContent = displayHandle || fallback;
    fields.instagram.href = siteInfo.instagram || "#";
  }

  if (fields.mapa) {
    fields.mapa.textContent = t("info.mapLink", "Ver en Google Maps");
    fields.mapa.href = siteInfo.mapa || "#";
    fields.mapa.classList.toggle("is-disabled", !siteInfo.mapa);
  }
}

function renderSchedule() {
  if (!scheduleList) return;
  scheduleList.innerHTML = "";

  const scheduleConfig = getTranslationConfig().schedule || {};
  const entries = Array.isArray(scheduleConfig.entries) ? scheduleConfig.entries : [];
  const separator = scheduleConfig.separator ?? ": ";

  entries.forEach((entry) => {
    const li = document.createElement("li");
    const daySpan = document.createElement("span");
    daySpan.textContent = entry.day || "";
    li.appendChild(daySpan);
    if (entry.hours) {
      li.append(document.createTextNode(`${separator}${entry.hours}`));
    }
    scheduleList.appendChild(li);
  });
}

function applyTranslations() {
  const config = getTranslationConfig();

  if (htmlElement) {
    htmlElement.lang = config.htmlLang || currentLanguage;
  }

  if (config.meta?.title) {
    document.title = config.meta.title;
  } else {
    document.title = "Galway Bar";
  }

  const brand = document.querySelector(".navbar__brand");
  if (brand) {
    brand.textContent = config.nav?.brand || "Galway";
  }

  if (toggle) {
    toggle.setAttribute("aria-label", config.nav?.toggleLabel || "Toggle navigation");
  }

  if (languageSelector) {
    languageSelector.setAttribute(
      "aria-label",
      config.language?.selectorLabel || languageSelector.getAttribute("aria-label") || "Language"
    );
  }

  if (categoriesContainer) {
    categoriesContainer.setAttribute(
      "aria-label",
      config.menu?.categoriesAria || categoriesContainer.getAttribute("aria-label") || "Categorías del menú"
    );
  }

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (!key) return;
    const translated = t(key, element.textContent || "");
    if (translated !== undefined) {
      element.textContent = translated;
    }
  });

  renderSchedule();
}

function setLanguage(lang) {
  const targetLang = translations[lang] ? lang : DEFAULT_LANGUAGE;
  currentLanguage = targetLang;

  if (languageSelector && languageSelector.value !== targetLang) {
    languageSelector.value = targetLang;
  }

  applyTranslations();
  renderCategories();
  renderMenuItems();
  renderEventos();
  renderGaleria();
  hydrateSiteInfo();
}

function setupNavbar() {
  if (!toggle || !linksList) return;
  toggle.addEventListener("click", () => {
    linksList.classList.toggle("is-open");
  });
}

function init() {
  populateLanguageSelector();
  setLanguage(currentLanguage);
  setupNavbar();
  if (currentYear) currentYear.textContent = new Date().getFullYear();

  categoriesContainer?.addEventListener("click", handleCategoryClick);
}

init();
