"use strict";

/*
|--------------------------------------------------------------------------
| CATÁLOGO DE PRODUCTOS
|--------------------------------------------------------------------------
|
| Cada producto tiene:
| id          = identificador único
| name        = nombre
| description = descripción breve
| price       = precio en soles
| category    = categoría
| image       = imagen del producto
| badge       = etiqueta promocional opcional
| stock       = unidades disponibles para esta demo
|
*/

const PRODUCTS = [

    {
        id: 1,
        name: "Luces navideñas LED",
        description: "Ilumina tus espacios con luces decorativas.",
        price: 15.00,
        category: "Luces navideñas",
        image: "assets/images/luces-navidenas.jpg",
        badge: "Popular",
        stock: 15
    },

    {
        id: 2,
        name: "Luces de copos de nieve",
        description: "Una decoración especial para Navidad.",
        price: 20.00,
        category: "Luces navideñas",
        image: "assets/images/luces-copos.jpg",
        badge: "Especial",
        stock: 5
    },

    {
        id: 3,
        name: "Luces LED decorativas",
        description: "Dale un toque especial a tus ambientes.",
        price: 12.00,
        category: "Luces navideñas",
        image: "assets/images/luces-led.jpg",
        badge: "",
        stock: 10
    },

    {
        id: 4,
        name: "Carrito de colección",
        description: "Un detalle ideal para los amantes de los autos.",
        price: 35.00,
        category: "Juguetes",
        image: "assets/images/carrito.jpg",
        badge: "Favorito",
        stock: 8
    },

    {
        id: 5,
        name: "Juguete sorpresa",
        description: "Un regalo divertido para sorprender.",
        price: 25.00,
        category: "Juguetes",
        image: "assets/images/juguete.jpg",
        badge: "",
        stock: 10
    },

    {
        id: 6,
        name: "Taza de regalo",
        description: "Una taza especial para regalar.",
        price: 25.00,
        category: "Regalos",
        image: "assets/images/taza-regalo.jpg",
        badge: "Regalo",
        stock: 6
    },

    {
        id: 7,
        name: "Cajita de regalo con luces",
        description: "Una decoración luminosa para momentos especiales.",
        price: 30.00,
        category: "Regalos",
        image: "assets/images/cajita-regalo.jpg",
        badge: "Especial",
        stock: 5
    },

    {
        id: 8,
        name: "Luz decorativa para el hogar",
        description: "Un detalle bonito para tus espacios.",
        price: 18.00,
        category: "Hogar",
        image: "assets/images/luz-hogar.jpg",
        badge: "",
        stock: 8
    }

];