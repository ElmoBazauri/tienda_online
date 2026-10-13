"use strict";


/*
|--------------------------------------------------------------------------
| ELEMENTOS HTML
|--------------------------------------------------------------------------
*/

const productsGrid = document.getElementById("products-grid");

const categoriesContainer = document.getElementById("categories");

const productSearch = document.getElementById("product-search");

const catalogInfo = document.getElementById("catalog-info");

const emptyProducts = document.getElementById("empty-products");

const cartPanel = document.getElementById("cart-panel");

const cartOverlay = document.getElementById("cart-overlay");

const cartItemsContainer = document.getElementById("cart-items");

const cartCount = document.getElementById("cart-count");

const cartSubtotal = document.getElementById("cart-subtotal");

const emptyCart = document.getElementById("empty-cart");

const cartSummary = document.getElementById("cart-summary");

const checkoutButton = document.getElementById("checkout-button");

const openCartButton = document.getElementById("open-cart");

const closeCartButton = document.getElementById("close-cart");

const continueShoppingButton = document.getElementById("continue-shopping");

const clearFiltersButton = document.getElementById("clear-filters");


/*
|--------------------------------------------------------------------------
| ESTADO DE LA INTERFAZ
|--------------------------------------------------------------------------
*/

let selectedCategory = "Todas";

let lastFocusedElement = null;


/*
|--------------------------------------------------------------------------
| ESCAPAR TEXTO ANTES DE INSERTARLO EN HTML
|--------------------------------------------------------------------------
|
| Los nombres y descripciones se insertan en tarjetas HTML.
| Esta función evita que un texto de producto se interprete
| como etiquetas HTML.
|
*/

function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, character => {

        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];

    });

}


/*
|--------------------------------------------------------------------------
| CATEGORÍAS
|--------------------------------------------------------------------------
*/

function getCategories() {

    const uniqueCategories = [
        ...new Set(
            PRODUCTS.map(product => product.category)
        )
    ];

    return ["Todas", ...uniqueCategories];

}


/*
|--------------------------------------------------------------------------
| DIBUJAR LOS BOTONES DE CATEGORÍAS
|--------------------------------------------------------------------------
*/

function renderCategories() {

    const categories = getCategories();

    categoriesContainer.innerHTML = categories
        .map(category => {

            const activeClass =
                category === selectedCategory ? "active" : "";

            return `
                <button
                    type="button"
                    class="category-button ${activeClass}"
                    data-category="${escapeHTML(category)}"
                    aria-pressed="${category === selectedCategory}"
                >
                    ${escapeHTML(category)}
                </button>
            `;

        })
        .join("");

}


/*
|--------------------------------------------------------------------------
| FILTRAR LOS PRODUCTOS
|--------------------------------------------------------------------------
*/

function getFilteredProducts() {

    const searchTerm = productSearch.value
        .trim()
        .toLocaleLowerCase("es");

    return PRODUCTS.filter(product => {

        const matchesCategory =
            selectedCategory === "Todas" ||
            product.category === selectedCategory;

        const searchableText = [
            product.name,
            product.description,
            product.category
        ]
            .join(" ")
            .toLocaleLowerCase("es");

        const matchesSearch =
            searchableText.includes(searchTerm);

        return matchesCategory && matchesSearch;

    });

}


/*
|--------------------------------------------------------------------------
| CREAR UNA TARJETA DE PRODUCTO
|--------------------------------------------------------------------------
*/

function createProductCard(product) {

    const soldOut = product.stock <= 0;

    const badgeHTML = product.badge
        ? `
            <span class="product-badge">
                ${escapeHTML(product.badge)}
            </span>
        `
        : "";

    const availabilityHTML = soldOut
        ? `<span class="product-category">Agotado</span>`
        : `<span class="product-category">${escapeHTML(product.category)}</span>`;

    return `
        <article class="product-card">

            <div class="product-image-container">

                <img
                    class="product-image"
                    src="${escapeHTML(product.image)}"
                    alt="${escapeHTML(product.name)}"
                    loading="lazy"
                    onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22 viewBox=%220 0 400 400%22%3E%3Crect width=%22400%22 height=%22400%22 fill=%22%23f3effa%22/%3E%3Ctext x=%22200%22 y=%22190%22 text-anchor=%22middle%22 font-size=%2270%22%3E%F0%9F%8E%81%3C/text%3E%3Ctext x=%22200%22 y=%22250%22 text-anchor=%22middle%22 font-size=%2218%22 fill=%22%237c3aed%22%3EAgrega tu foto%3C/text%3E%3C/svg%3E';"
                >

                ${badgeHTML}

            </div>

            <div class="product-info">

                ${availabilityHTML}

                <h3 class="product-name">
                    ${escapeHTML(product.name)}
                </h3>

                <p class="product-description">
                    ${escapeHTML(product.description)}
                </p>

                <div class="product-bottom">

                    <span class="product-price">
                        ${formatPrice(product.price)}
                    </span>

                    <button
                        type="button"
                        class="add-cart-button"
                        data-add="${product.id}"
                        ${soldOut ? "disabled" : ""}
                    >
                        ${soldOut ? "Agotado" : "+ Agregar"}
                    </button>

                </div>

            </div>

        </article>
    `;

}


/*
|--------------------------------------------------------------------------
| MOSTRAR LOS PRODUCTOS
|--------------------------------------------------------------------------
*/

function renderProducts() {

    const filteredProducts = getFilteredProducts();

    productsGrid.innerHTML = filteredProducts
        .map(createProductCard)
        .join("");

    const count = filteredProducts.length;

    catalogInfo.textContent =
        `${count} ${count === 1 ? "producto encontrado" : "productos encontrados"}`;

    emptyProducts.classList.toggle(
        "hidden",
        count !== 0
    );

    productsGrid.classList.toggle(
        "hidden",
        count === 0
    );

}


/*
|--------------------------------------------------------------------------
| ABRIR EL CARRITO
|--------------------------------------------------------------------------
*/

function openCart() {

    lastFocusedElement = document.activeElement;

    cartPanel.classList.add("open");

    cartPanel.removeAttribute("inert");

    cartPanel.setAttribute("aria-hidden", "false");

    cartOverlay.hidden = false;

    document.body.classList.add("cart-open");

    closeCartButton.focus();

}


/*
|--------------------------------------------------------------------------
| CERRAR EL CARRITO
|--------------------------------------------------------------------------
*/

function closeCart() {

    cartPanel.classList.remove("open");

    cartPanel.setAttribute("aria-hidden", "true");

    cartPanel.setAttribute("inert", "");

    cartOverlay.hidden = true;

    document.body.classList.remove("cart-open");

    if (lastFocusedElement) {

        lastFocusedElement.focus();

    }

}


/*
|--------------------------------------------------------------------------
| DIBUJAR UN ARTÍCULO DEL CARRITO
|--------------------------------------------------------------------------
*/

function createCartItem(item) {

    return `
        <article class="cart-item">

            <img
                class="cart-item-image"
                src="${escapeHTML(item.image)}"
                alt="${escapeHTML(item.name)}"
                loading="lazy"
                onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2278%22 height=%2278%22 viewBox=%220 0 78 78%22%3E%3Crect width=%2278%22 height=%2278%22 rx=%2212%22 fill=%22%23f3effa%22/%3E%3Ctext x=%2239%22 y=%2250%22 text-anchor=%22middle%22 font-size=%2234%22%3E%F0%9F%8E%81%3C/text%3E%3C/svg%3E';"
            >

            <div class="cart-item-details">

                <h3 class="cart-item-name">
                    ${escapeHTML(item.name)}
                </h3>

                <p class="cart-item-price">
                    ${formatPrice(item.subtotal)}
                </p>

                <div class="cart-item-controls">

                    <div class="quantity-control">

                        <button
                            type="button"
                            class="quantity-button"
                            data-quantity="${item.id}"
                            data-change="-1"
                            aria-label="Disminuir cantidad de ${escapeHTML(item.name)}"
                        >
                            −
                        </button>

                        <span class="quantity-value">
                            ${item.quantity}
                        </span>

                        <button
                            type="button"
                            class="quantity-button"
                            data-quantity="${item.id}"
                            data-change="1"
                            aria-label="Aumentar cantidad de ${escapeHTML(item.name)}"
                            ${item.quantity >= item.stock ? "disabled" : ""}
                        >
                            +
                        </button>

                    </div>

                    <button
                        type="button"
                        class="remove-item-button"
                        data-remove="${item.id}"
                    >
                        Eliminar
                    </button>

                </div>

            </div>

        </article>
    `;

}


/*
|--------------------------------------------------------------------------
| ACTUALIZAR TODO EL CARRITO
|--------------------------------------------------------------------------
*/

function renderCart() {

    const items = getCartDetails();

    const totalItems = getCartCount();

    const total = getCartTotal();

    /*
     * Actualizar el contador del encabezado.
     */

    cartCount.textContent = totalItems;

    cartCount.setAttribute(
        "aria-label",
        `${totalItems} unidades en el carrito`
    );

    /*
     * Mostrar los productos agregados.
     */

    cartItemsContainer.innerHTML = items
        .map(createCartItem)
        .join("");

    /*
     * Mostrar u ocultar el estado vacío.
     */

    const isEmpty = items.length === 0;

    emptyCart.classList.toggle(
        "hidden",
        !isEmpty
    );

    cartSummary.classList.toggle(
        "hidden",
        isEmpty
    );

    cartItemsContainer.classList.toggle(
        "hidden",
        isEmpty
    );

    /*
     * Actualizar subtotal.
     */

    cartSubtotal.textContent = formatPrice(total);

    /*
     * Evitar que se intente comprar con el carrito vacío.
     */

    checkoutButton.disabled = isEmpty;

}


/*
|--------------------------------------------------------------------------
| DELEGACIÓN DE EVENTOS DEL CATÁLOGO
|--------------------------------------------------------------------------
|
| No necesitamos crear un evento individual para cada botón.
| Un único evento permite detectar los botones Agregar.
|
*/

productsGrid.addEventListener("click", event => {

    const button = event.target.closest("[data-add]");

    if (!button) {
        return;
    }

    const productId = Number(button.dataset.add);

    const result = addToCart(productId);

    if (!result.success) {

        alert(result.message);

        return;

    }

    renderCart();

    /*
     * Retroalimentación visual.
     */

    const originalText = button.textContent;

    button.textContent = "✓ Agregado";

    button.disabled = true;

    window.setTimeout(() => {

        button.textContent = originalText;

        button.disabled = false;

    }, 700);

});


/*
|--------------------------------------------------------------------------
| EVENTOS DE LAS CATEGORÍAS
|--------------------------------------------------------------------------
*/

categoriesContainer.addEventListener("click", event => {

    const button = event.target.closest("[data-category]");

    if (!button) {
        return;
    }

    selectedCategory = button.dataset.category;

    renderCategories();

    renderProducts();

});


/*
|--------------------------------------------------------------------------
| BUSCADOR
|--------------------------------------------------------------------------
*/

productSearch.addEventListener("input", () => {

    renderProducts();

});


/*
|--------------------------------------------------------------------------
| LIMPIAR FILTROS
|--------------------------------------------------------------------------
*/

clearFiltersButton.addEventListener("click", () => {

    selectedCategory = "Todas";

    productSearch.value = "";

    renderCategories();

    renderProducts();

});


/*
|--------------------------------------------------------------------------
| EVENTOS DEL CARRITO
|--------------------------------------------------------------------------
*/

cartItemsContainer.addEventListener("click", event => {

    const quantityButton = event.target.closest("[data-quantity]");

    const removeButton = event.target.closest("[data-remove]");

    if (quantityButton) {

        const productId = Number(quantityButton.dataset.quantity);

        const change = Number(quantityButton.dataset.change);

        updateCartQuantity(productId, change);

        renderCart();

        return;

    }

    if (removeButton) {

        const productId = Number(removeButton.dataset.remove);

        removeFromCart(productId);

        renderCart();

    }

});


/*
|--------------------------------------------------------------------------
| ABRIR Y CERRAR EL PANEL
|--------------------------------------------------------------------------
*/

openCartButton.addEventListener("click", openCart);

closeCartButton.addEventListener("click", closeCart);

cartOverlay.addEventListener("click", closeCart);

continueShoppingButton.addEventListener("click", closeCart);


/*
|--------------------------------------------------------------------------
| CERRAR CON LA TECLA ESCAPE
|--------------------------------------------------------------------------
*/

document.addEventListener("keydown", event => {

    if (
        event.key === "Escape" &&
        cartPanel.classList.contains("open")
    ) {

        closeCart();

    }

});


/*
|--------------------------------------------------------------------------
| FINALIZAR PEDIDO
|--------------------------------------------------------------------------
*/

checkoutButton.addEventListener("click", checkoutWhatsApp);


/*
|--------------------------------------------------------------------------
| INICIALIZAR LA TIENDA
|--------------------------------------------------------------------------
*/

function initializeStore() {

    document.getElementById("current-year").textContent =
        new Date().getFullYear();

    renderCategories();

    renderProducts();

    renderCart();

}

initializeStore();