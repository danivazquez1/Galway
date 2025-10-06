const menuContainer = document.querySelector(".menu__items");
const categoriesContainer = document.querySelector(".menu__categories");
const eventosGrid = document.getElementById("eventos-grid");
const galeriaGrid = document.getElementById("galeria-grid");
const form = document.getElementById("reserva-form");
const feedback = document.querySelector(".form__feedback");
const toggle = document.querySelector(".navbar__toggle");
const linksList = document.querySelector(".navbar__links");
const currentYear = document.getElementById("anio");

const siteInfo = window.siteInfo || {};
const menuData = window.menuData || { categorias: [], eventos: [], galeria: [] };

function formatCurrency(value) {
  if (value === null || value === undefined || value === "") return "";
  const numeric = Number(String(value).replace(/[^0-9.,-]+/g, "").replace(/,/g, "."));
  if (Number.isNaN(numeric)) {
    return value;
  }
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numeric);
}

function renderMenuItems(categoryId = "all") {
  if (!menuContainer) return;
  menuContainer.innerHTML = "";

  const items = menuData.categorias.flatMap((categoria) =>
    categoryId === "all" || categoryId === categoria.id
      ? categoria.items.map((item) => ({ ...item, categoria: categoria.nombre }))
      : []
  );

  if (!items.length) {
    menuContainer.innerHTML = `<p>No hay elementos cargados. Edita <code>data/menu.js</code> para agregar tu menú.</p>`;
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
}

function renderCategories() {
  if (!categoriesContainer) return;
  const buttons = menuData.categorias.map(
    (categoria) => `
      <button class="menu__category-btn" data-category="${categoria.id}">
        ${categoria.nombre}
      </button>
    `
  );
  categoriesContainer.insertAdjacentHTML("beforeend", buttons.join(""));
}

function handleCategoryClick(event) {
  const button = event.target.closest(".menu__category-btn");
  if (!button) return;

  categoriesContainer.querySelectorAll(".menu__category-btn").forEach((btn) =>
    btn.classList.toggle("is-active", btn === button)
  );

  renderMenuItems(button.dataset.category);
}

function renderEventos() {
  if (!eventosGrid) return;
  if (!menuData.eventos?.length) {
    eventosGrid.innerHTML = "<p>Agrega tus experiencias en <code>data/menu.js</code>.</p>";
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
    galeriaGrid.innerHTML = "<p>Actualiza la galería en <code>data/menu.js</code>.</p>";
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
      element.textContent = item.contenido || "Actualiza este espacio con tus fotos o frases.";
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

  if (fields.direccion) fields.direccion.textContent = siteInfo.direccion || "Actualiza tu dirección";
  if (fields.barrio) fields.barrio.textContent = siteInfo.barrio || "Ciudad";

  if (fields.telefono) {
    fields.telefono.textContent = siteInfo.telefono || "Completa el teléfono";
    fields.telefono.href = siteInfo.telefono ? `tel:${siteInfo.telefono.replace(/\s+/g, "")}` : "tel:";
  }

  if (fields.whatsapp) {
    fields.whatsapp.textContent = siteInfo.whatsapp || "Completa el número";
    fields.whatsapp.href = siteInfo.whatsapp
      ? `https://wa.me/${siteInfo.whatsapp.replace(/[^0-9]/g, "")}`
      : "https://wa.me/";
  }

  if (fields.correo) {
    fields.correo.textContent = siteInfo.correo || "Completa el correo";
    fields.correo.href = siteInfo.correo ? `mailto:${siteInfo.correo}` : "mailto:";
  }

  if (fields.instagram) {
    fields.instagram.textContent = siteInfo.instagram ? "@galwaybar" : "Instagram";
    fields.instagram.href = siteInfo.instagram || "#";
  }

  if (fields.mapa) {
    fields.mapa.href = siteInfo.mapa || "#";
    fields.mapa.classList.toggle("is-disabled", !siteInfo.mapa);
  }
}

function setupForm() {
  if (!form || !feedback) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const nombre = formData.get("nombre");
    feedback.textContent = `Gracias ${nombre || ""}, pronto nos comunicaremos contigo.`;
    form.reset();
  });
}

function setupNavbar() {
  if (!toggle || !linksList) return;
  toggle.addEventListener("click", () => {
    linksList.classList.toggle("is-open");
  });
}

function init() {
  renderCategories();
  renderMenuItems();
  renderEventos();
  renderGaleria();
  hydrateSiteInfo();
  setupForm();
  setupNavbar();
  if (currentYear) currentYear.textContent = new Date().getFullYear();

  categoriesContainer?.addEventListener("click", handleCategoryClick);
}

init();
