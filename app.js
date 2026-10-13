const products = [
  { id: "pocket-dragon", name: "Pocket Dragon", category: "Flexi figures", type: "Articulated figure", spec: "30 cm · one-piece print · poseable body", price: 1299, badge: "Poseable", image: "https://makerworld.bblmw.com/makerworld/model/USe84f915ad57d04/design/15e460d6-2370-442d-9ad4-09ecbfe4386b.webp?x-oss-process=image%2Fresize%2Cw_1000%2Fformat%2Cwebp", alt: "Green articulated Chinese dragon 3D print shown in separate segments", swatches: ["green", "blue", "purple"] },
  { id: "mini-t-rex", name: "Mini T. rex", category: "Flexi figures", type: "Desk toy", spec: "Segmented body · bends and poses", price: 499, badge: "Mini", image: "https://gomaker.co.uk/cdn/shop/files/1703118756604.jpg?v=1703118846", alt: "Green articulated 3D-printed dinosaur figure", swatches: ["green", "blue", "orange"] },
  { id: "lava-dragon", name: "Lava Dragon", category: "Flexi figures", type: "Articulated figure", spec: "Flexible spine · coiled or stretched", price: 1799, badge: "", image: "https://i.etsystatic.com/22094297/r/il/a3ab91/7402815554/il_794xN.7402815554_bxs4.jpg", alt: "Red, black, and yellow articulated dragon figure", swatches: ["red", "black", "gold"] },
  { id: "mini-flexis", name: "Mini Flexi Set", category: "Mini figures", type: "Set of six", spec: "2.5–4 cm · small articulated figures", price: 1099, badge: "Set of 6", image: "https://i.etsystatic.com/63658776/r/il/fb8ab0/7723614523/il_fullxfull.7723614523_3ut7.jpg", alt: "Six colorful miniature articulated dinosaur figures", swatches: ["blue", "orange", "purple", "green"] },
  { id: "chinese-dragon", name: "Cloud Dragon", category: "Display pieces", type: "Articulated figure", spec: "Scale texture · flexible segmented body", price: 1499, badge: "", image: "https://i.etsystatic.com/36780899/r/il/fe4328/5832351367/il_1080xN.5832351367_2x10.jpg", alt: "Orange articulated dragon curled on a white tabletop", swatches: ["orange", "blue", "gold"] },
  { id: "winged-dragon", name: "Winged Wyrm", category: "Display pieces", type: "Tabletop figure", spec: "Winged display model · layered finish", price: 1199, badge: "Display", image: "https://makerworld.bblmw.com/makerworld/model/USf32b6f6712c421/design/2025-01-10_741f542e3ca2f.png?x-oss-process=image%2Fresize%2Cw_1000%2Fformat%2Cwebp", alt: "White 3D-printed dragon figurine on a small round base", swatches: ["white", "blue", "black"] },
  { id: "rainbow-octopus", name: "Rainbow Octopus", category: "Desk toys", type: "Articulated desk toy", spec: "Eight movable tentacles · 19 cm wide", price: 899, badge: "Poseable", image: "https://i.etsystatic.com/32646763/r/il/1b2d06/6076574933/il_fullxfull.6076574933_fuww.jpg", alt: "Colorful 3D-printed octopus with movable tentacles", swatches: ["purple", "blue", "orange"] },
  { id: "mini-stego", name: "Stegosaurus Mini", category: "Mini figures", type: "Articulated figure", spec: "About 5 cm · movable body segments", price: 499, badge: "Mini", image: "https://terraandtidecreations.com/cdn/shop/files/UntitledProject-2025-10-01T202828.844.jpg?v=1760286243&width=1238", alt: "Small green articulated stegosaurus with brown plates", swatches: ["green", "blue", "orange"] }
];

const state = { filter: "All", query: "", sort: "featured", bag: new Map() };
const productGrid = document.querySelector("#shop-grid");
const resultCount = document.querySelector("#result-count");
const emptyState = document.querySelector("#empty-state");
const bagPanel = document.querySelector("#bag-panel");
const drawerBackdrop = document.querySelector("#drawer-backdrop");
const toast = document.querySelector("#toast");
let toastTimeout;

const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function swatchMarkup(colors) {
  return `<span class="swatches" aria-label="Available colors">${colors.map(color => `<span class="swatch swatch-${color}" title="${color}"></span>`).join("")}</span>`;
}

function visibleProducts() {
  let list = products.filter(product => {
    const matchesFilter = state.filter === "All" || product.category === state.filter;
    const haystack = `${product.name} ${product.category} ${product.type} ${product.spec}`.toLowerCase();
    return matchesFilter && haystack.includes(state.query.toLowerCase().trim());
  });
  if (state.sort === "price-low") list = [...list].sort((a, b) => a.price - b.price);
  if (state.sort === "price-high") list = [...list].sort((a, b) => b.price - a.price);
  return list;
}

function renderProducts() {
  const list = visibleProducts();
  productGrid.innerHTML = list.map(product => `
    <article class="product-card" data-product-id="${product.id}">
      <div class="product-image-wrap">
        <img src="${product.image}" alt="${product.alt}" loading="lazy" />
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
        <button class="favorite-button" type="button" aria-label="Save ${product.name} to favorites" aria-pressed="false" data-favorite="${product.id}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.4 8.8c0 4.3-8.4 10-8.4 10s-8.4-5.7-8.4-10a4.4 4.4 0 0 1 8.4-1.3 4.4 4.4 0 0 1 8.4 1.3Z" /></svg>
        </button>
        <button class="quick-add" type="button" data-add="${product.id}">Add to bag <span aria-hidden="true">+</span></button>
      </div>
      <div class="product-info">
        <div class="product-meta"><span>${product.type}</span>${swatchMarkup(product.swatches)}</div>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-spec">${product.spec}</p>
        <div class="product-price-line"><span>${currency.format(product.price)}</span></div>
      </div>
    </article>
  `).join("");
  resultCount.textContent = `Showing ${list.length} ${list.length === 1 ? "piece" : "pieces"}${state.filter !== "All" ? ` in ${state.filter.toLowerCase()}` : ""}${state.query ? ` for “${state.query}”` : ""}`;
  emptyState.hidden = list.length > 0;
  productGrid.hidden = list.length === 0;
}

function setFilter(filter) {
  state.filter = filter;
  document.querySelectorAll(".filter-tab").forEach(button => {
    const active = button.dataset.filter === filter;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  renderProducts();
}

function addToBag(productId) {
  const product = products.find(item => item.id === productId);
  if (!product) return;
  const item = state.bag.get(productId) || { product, quantity: 0 };
  item.quantity += 1;
  state.bag.set(productId, item);
  renderBag();
  showToast(`${product.name} added to your bag`);
}

function renderBag() {
  const items = [...state.bag.values()];
  const quantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  document.querySelector(".bag-count").textContent = quantity;
  document.querySelector(".bag-panel-count").textContent = `(${quantity})`;
  document.querySelector("#bag-total").textContent = currency.format(total);
  document.querySelector("#bag-items").innerHTML = items.map(({ product, quantity }) => `
    <div class="bag-item" data-bag-item="${product.id}">
      <img src="${product.image}" alt="" />
      <div class="bag-item-info"><strong>${product.name}</strong><small>${product.type}</small><div class="quantity-control" aria-label="Quantity for ${product.name}"><button type="button" data-quantity="-1" data-id="${product.id}" aria-label="Remove one ${product.name}">−</button><span>${quantity}</span><button type="button" data-quantity="1" data-id="${product.id}" aria-label="Add one ${product.name}">+</button></div></div>
      <div class="bag-item-price">${currency.format(product.price * quantity)}<button type="button" class="remove-item" data-remove="${product.id}">Remove</button></div>
    </div>
  `).join("");
  document.querySelector("#bag-empty").hidden = items.length > 0;
  document.querySelector("#bag-panel-foot").hidden = items.length === 0;
}

function openBag() {
  bagPanel.classList.add("is-open");
  bagPanel.setAttribute("aria-hidden", "false");
  bagPanel.inert = false;
  drawerBackdrop.hidden = false;
  document.body.classList.add("drawer-open");
  document.querySelector(".bag-close").focus();
}

function closeBag() {
  bagPanel.classList.remove("is-open");
  bagPanel.setAttribute("aria-hidden", "true");
  bagPanel.inert = true;
  drawerBackdrop.hidden = true;
  document.body.classList.remove("drawer-open");
  document.querySelector(".bag-toggle").focus();
}

productGrid.addEventListener("click", event => {
  const addButton = event.target.closest("[data-add]");
  if (addButton) addToBag(addButton.dataset.add);
  const favorite = event.target.closest("[data-favorite]");
  if (favorite) {
    const selected = favorite.getAttribute("aria-pressed") !== "true";
    favorite.setAttribute("aria-pressed", String(selected));
    showToast(selected ? "Saved to your favorites" : "Removed from your favorites");
  }
});

document.querySelectorAll(".filter-tab").forEach(button => button.addEventListener("click", () => setFilter(button.dataset.filter)));
document.querySelector("#sort-products").addEventListener("change", event => { state.sort = event.target.value; renderProducts(); });
document.querySelector("#site-search").addEventListener("input", event => { state.query = event.target.value; renderProducts(); });
document.querySelector(".clear-search").addEventListener("click", () => {
  state.query = "";
  document.querySelector("#site-search").value = "";
  setFilter("All");
});

document.querySelectorAll("[data-category-link], [data-nav-category], [data-footer-category]").forEach(link => link.addEventListener("click", () => {
  const category = link.dataset.categoryLink || link.dataset.navCategory || link.dataset.footerCategory;
  if (["Flexi figures", "Mini figures", "Desk toys", "Display pieces"].includes(category)) setFilter(category);
  document.querySelector(".primary-nav").classList.remove("is-open");
  document.querySelector(".menu-toggle").setAttribute("aria-expanded", "false");
}));

document.querySelector(".search-toggle").addEventListener("click", () => {
  const panel = document.querySelector("#search-panel");
  const button = document.querySelector(".search-toggle");
  const opening = panel.hidden;
  panel.hidden = !opening;
  button.setAttribute("aria-expanded", String(opening));
  if (opening) document.querySelector("#site-search").focus();
});
document.querySelector(".search-close").addEventListener("click", () => {
  document.querySelector("#search-panel").hidden = true;
  document.querySelector(".search-toggle").setAttribute("aria-expanded", "false");
  document.querySelector(".search-toggle").focus();
});
document.querySelector("#site-search").addEventListener("keydown", event => {
  if (event.key === "Escape") document.querySelector(".search-close").click();
});

document.querySelector(".bag-toggle").addEventListener("click", openBag);
document.querySelector(".bag-close").addEventListener("click", closeBag);
drawerBackdrop.addEventListener("click", closeBag);
document.querySelector(".bag-shop-link").addEventListener("click", closeBag);
document.querySelector("#bag-items").addEventListener("click", event => {
  const quantityButton = event.target.closest("[data-quantity]");
  if (quantityButton) {
    const id = quantityButton.dataset.id;
    const item = state.bag.get(id);
    if (!item) return;
    item.quantity += Number(quantityButton.dataset.quantity);
    if (item.quantity <= 0) state.bag.delete(id);
    renderBag();
    return;
  }
  const removeButton = event.target.closest("[data-remove]");
  if (removeButton) {
    state.bag.delete(removeButton.dataset.remove);
    renderBag();
  }
});
document.addEventListener("keydown", event => { if (event.key === "Escape" && bagPanel.classList.contains("is-open")) closeBag(); });

document.querySelector(".menu-toggle").addEventListener("click", event => {
  const button = event.currentTarget;
  const nav = document.querySelector(".primary-nav");
  const open = !nav.classList.contains("is-open");
  nav.classList.toggle("is-open", open);
  button.setAttribute("aria-expanded", String(open));
  button.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});

document.querySelector("#newsletter-form").addEventListener("submit", event => {
  event.preventDefault();
  const emailInput = document.querySelector("#newsletter-email");
  if (!emailInput.reportValidity()) return;
  showToast("You're on the list. Thanks for stopping by.");
  event.currentTarget.reset();
});

document.querySelector(".checkout-button").addEventListener("click", () => showToast("Checkout is ready to connect to your store."));

renderProducts();
renderBag();
