"use strict";

/*
|--------------------------------------------------------------------------
| CONFIGURACIÓN DE WHATSAPP
|--------------------------------------------------------------------------
|
| Reemplaza el número de ejemplo por el número real de tu negocio.
|
| Perú: código de país 51.
| Escribe únicamente números, sin +, espacios ni guiones.
|
*/

const WHATSAPP_NUMBER = "51981079735";


/*
|--------------------------------------------------------------------------
| CLAVE DEL ALMACENAMIENTO LOCAL
|--------------------------------------------------------------------------
*/

const CART_STORAGE_KEY = "laulishop_cart_v1";


/*
|--------------------------------------------------------------------------
| FORMATO DE PRECIOS
|--------------------------------------------------------------------------
*/

const currencyFormatter = new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN"
});


function formatPrice(price) {
    return currencyFormatter.format(price);
}


/*
|--------------------------------------------------------------------------
| CARGAR EL CARRITO GUARDADO
|--------------------------------------------------------------------------
*/

function loadCart() {

    try {

        const savedCart = localStorage.getItem(CART_STORAGE_KEY);

        if (!savedCart) {
            return [];
        }

        const parsedCart = JSON.parse(savedCart);

        if (!Array.isArray(parsedCart)) {
            return [];
        }

        const normalizedCart = [];

        for (const item of parsedCart) {

            const product = PRODUCTS.find(
                product => product.id === item.id
            );

            if (!product || product.stock <= 0) {
                continue;
            }

            if (
                !Number.isSafeInteger(item.quantity) ||
                item.quantity < 1
            ) {
                continue;
            }

            normalizedCart.push({
                id: product.id,
                quantity: Math.min(item.quantity, product.stock)
            });

        }

        return normalizedCart;

    } catch (error) {

        console.error("No se pudo cargar el carrito:", error);

        return [];

    }

}


/*
|--------------------------------------------------------------------------
| ESTADO DEL CARRITO
|--------------------------------------------------------------------------
*/

let cart = loadCart();


/*
|--------------------------------------------------------------------------
| GUARDAR EL CARRITO
|--------------------------------------------------------------------------
*/

function saveCart() {

    try {

        localStorage.setItem(
            CART_STORAGE_KEY,
            JSON.stringify(cart)
        );

    } catch (error) {

        console.error("No se pudo guardar el carrito:", error);

    }

}


/*
|--------------------------------------------------------------------------
| BUSCAR UN PRODUCTO POR SU ID
|--------------------------------------------------------------------------
*/

function findProduct(productId) {

    return PRODUCTS.find(
        product => product.id === productId
    );

}


/*
|--------------------------------------------------------------------------
| OBTENER LA CANTIDAD DE UN PRODUCTO
|--------------------------------------------------------------------------
*/

function getProductQuantity(productId) {

    const item = cart.find(
        item => item.id === productId
    );

    return item ? item.quantity : 0;

}


/*
|--------------------------------------------------------------------------
| AGREGAR UN PRODUCTO AL CARRITO
|--------------------------------------------------------------------------
*/

function addToCart(productId) {

    const product = findProduct(productId);

    if (!product) {
        return {
            success: false,
            message: "No encontramos ese producto."
        };
    }

    if (product.stock <= 0) {
        return {
            success: false,
            message: "Este producto no tiene unidades disponibles."
        };
    }

    const existingItem = cart.find(
        item => item.id === productId
    );

    if (existingItem) {

        if (existingItem.quantity >= product.stock) {

            return {
                success: false,
                message: "No hay más unidades disponibles."
            };

        }

        existingItem.quantity += 1;

    } else {

        cart.push({
            id: productId,
            quantity: 1
        });

    }

    saveCart();

    return {
        success: true,
        message: `${product.name} se agregó al carrito.`
    };

}


/*
|--------------------------------------------------------------------------
| CAMBIAR LA CANTIDAD
|--------------------------------------------------------------------------
*/

function updateCartQuantity(productId, change) {

    const item = cart.find(
        item => item.id === productId
    );

    const product = findProduct(productId);

    if (!item || !product) {
        return;
    }

    const newQuantity = item.quantity + change;

    if (newQuantity <= 0) {

        removeFromCart(productId);
        return;

    }

    if (newQuantity > product.stock) {
        return;
    }

    item.quantity = newQuantity;

    saveCart();

}


/*
|--------------------------------------------------------------------------
| ELIMINAR UN PRODUCTO
|--------------------------------------------------------------------------
*/

function removeFromCart(productId) {

    cart = cart.filter(
        item => item.id !== productId
    );

    saveCart();

}


/*
|--------------------------------------------------------------------------
| VACIAR EL CARRITO
|--------------------------------------------------------------------------
*/

function clearCart() {

    cart = [];

    saveCart();

}


/*
|--------------------------------------------------------------------------
| OBTENER LOS PRODUCTOS DEL CARRITO
|--------------------------------------------------------------------------
|
| Consultamos siempre el catálogo para obtener los precios actuales
| definidos en PRODUCTS.
|
*/

function getCartDetails() {

    return cart
        .map(item => {

            const product = findProduct(item.id);

            if (!product) {
                return null;
            }

            return {
                ...product,
                quantity: item.quantity,
                subtotal: product.price * item.quantity
            };

        })
        .filter(Boolean);

}


/*
|--------------------------------------------------------------------------
| CONTAR TODAS LAS UNIDADES
|--------------------------------------------------------------------------
*/

function getCartCount() {

    return cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

}


/*
|--------------------------------------------------------------------------
| CALCULAR EL SUBTOTAL
|--------------------------------------------------------------------------
*/

function getCartTotal() {

    return getCartDetails().reduce(
        (total, item) => total + item.subtotal,
        0
    );

}


/*
|--------------------------------------------------------------------------
| CREAR EL MENSAJE PARA WHATSAPP
|--------------------------------------------------------------------------
*/

function createWhatsAppMessage() {

    const items = getCartDetails();

    if (items.length === 0) {
        return null;
    }

    const lines = [

        "¡Hola, LauliShop! 👋",

        "",

        "Quiero realizar el siguiente pedido:",

        "",

        "🛍️ *MI PEDIDO*",

        "--------------------------------"

    ];

    for (const item of items) {

        lines.push(
            `${item.quantity} x ${item.name}`
        );

        lines.push(
            `   Precio unitario: ${formatPrice(item.price)}`
        );

        lines.push(
            `   Subtotal: ${formatPrice(item.subtotal)}`
        );

        lines.push("");

    }

    lines.push("--------------------------------");

    lines.push(
        `*TOTAL: ${formatPrice(getCartTotal())}*`
    );

    lines.push("");

    lines.push(
        "📦 Quisiera coordinar la entrega de mi pedido."
    );

    lines.push("");

    lines.push(
        "¡Gracias por su atención!"
    );

    return lines.join("\n");

}


/*
|--------------------------------------------------------------------------
| ABRIR WHATSAPP CON EL PEDIDO
|--------------------------------------------------------------------------
*/

function checkoutWhatsApp() {

    const items = getCartDetails();

    if (items.length === 0) {

        alert("Agrega al menos un producto antes de comprar.");

        return;

    }

    /*
     * Validamos que el número esté configurado.
     */

    if (!/^\d{8,15}$/.test(WHATSAPP_NUMBER)) {

        alert(
            "Configura el número de WhatsApp de LauliShop en js/cart.js."
        );

        return;

    }

    const message = createWhatsAppMessage();

    const whatsappURL =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    /*
     * Abrimos WhatsApp.
     *
     * El carrito no se vacía automáticamente.
     * El cliente podrá conservar su pedido si todavía
     * necesita modificarlo.
     */

    window.open(
        whatsappURL,
        "_blank",
        "noopener,noreferrer"
    );

}