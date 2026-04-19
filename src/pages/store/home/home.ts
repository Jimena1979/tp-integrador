import { verificarAcceso } from "@/main";
import { logout } from "@/utils/auths";
import type { IUser } from "@/types/IUser";
import { PRODUCTS, categorias } from "@/data/data"; 
import type { ICategory } from "@/types/categoria";
import type { Product } from "@/types/product"; 
import {obtenerCarrito, agregarAlCarrito } from "../cart/cart.ts";

verificarAcceso('client');

// Copia esto en tu home.ts
const getEmail = (): string => {
    const userData = localStorage.getItem("userData");
    
    // Si no hay nada, devolvemos un string vacío
    if (!userData) return "";
    
    // Parseamos el string a objeto
    const user: IUser = JSON.parse(userData);
    
    // Retornamos el email
    return user.email;
};

export const actualizarContador = (): void => {
    // Pasamos el email para que obtenga solo los productos de este usuario
    const email = getEmail();
    const carrito = obtenerCarrito(email); 
    const spanCount = document.getElementById("cart-count");
    
    if (spanCount) {
        // Como cantidad ya es un número en tu interfaz, no hace falta el Number() || 1
        const total = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        spanCount.textContent = total.toString();
    }
};

// Función de búsqueda
const buscarProductos = (termino: string): void => {
    const contenedor = document.getElementById("contenedor-productos");
    // Normalizamos el término: quitamos espacios extras y pasamos a minúsculas
    const busqueda = termino.toLowerCase().trim();

    // Filtramos sobre el array original PRODUCTS
    const productosFiltrados = PRODUCTS.filter((prod: Product) => 
        prod.nombre.toLowerCase().includes(busqueda)
    );

    // Si no hay productos, mostramos un mensaje visual
    if (productosFiltrados.length === 0) {
        if (contenedor) {
            contenedor.innerHTML = `
                <div class="mensaje-vacio">
                    <p>No se encontraron productos con el nombre "${termino}".</p>
                </div>
            `;
        }
    } else {
        // Si hay, renderizamos normalmente
        cargarProductos(productosFiltrados);
    }
};



const filtrarProductos = (nombreCategoria: string): void => {
    // Si elige "Todas", volvemos a cargar todos los productos originales
    if (nombreCategoria === "Todas") {
        cargarProductos(PRODUCTS);
        return;
    }
    // Filtramos el array global PRODUCTS
    // .some() devuelve true si al menos una categoría coincide con el nombre
    const productosFiltrados = PRODUCTS.filter((prod: Product) => 
        prod.categorias.some((cat: ICategory) => cat.nombre === nombreCategoria)
    );

    // Re-renderizamos el catálogo solo con los filtrados
    cargarProductos(productosFiltrados);
};


const cargarCategorias = (): void => {
    const listaCategorias = document.getElementById("lista-categorias") as HTMLUListElement | null; 
    
    if (listaCategorias) {
        listaCategorias.innerHTML = ""; 
        
        // 1. opción "Todas" para el catálogo completo
        const liTodas = document.createElement("li");
        liTodas.innerHTML = `<a href="#" class="filtro-cat" data-categoria="Todas">Todas</a>`;
        listaCategorias.appendChild(liTodas);

        // 2. Renderizar categorías dinámicamente
        categorias.forEach((cat: ICategory) => {
            const li = document.createElement("li");
            li.innerHTML = `<a href="#" class="filtro-cat" data-categoria="${cat.nombre}">${cat.nombre}</a>`; 
            listaCategorias.appendChild(li); 
        });

        // 3. Delegación de eventos: Escuchamos el clic en el contenedor (ul)
        listaCategorias.addEventListener("click", (e: Event) => {
            // Buscamos el elemento clickeado
            const target = e.target as HTMLElement;
            
            // Verificamos si es un enlace de filtro
            if (target.classList.contains("filtro-cat")) {
                e.preventDefault();
                const categoriaSeleccionada = target.getAttribute("data-categoria");
                
                if (categoriaSeleccionada) {
                    filtrarProductos(categoriaSeleccionada);
                }
            }
        });
    }
};



const cargarProductos = (productosAMostrar: Product[] = PRODUCTS): void => {
     const email = getEmail();

    const contenedor = document.getElementById("contenedor-productos") as HTMLElement | null;
    
    if (!contenedor) return;
    
    contenedor.innerHTML = "";
    
    productosAMostrar.forEach((prod: Product) => {
        const article = document.createElement("article");
        article.classList.add("card-producto");
        
        article.innerHTML = `
            <img src="${prod.imagen}" alt="${prod.nombre}">
            <div class="card-body">
                <h3>${prod.nombre}</h3>
                <p>${prod.descripcion}</p>
                <div class="card-footer">
                    <span class="precio">$${prod.precio.toLocaleString('es-AR')}</span>
                    <button class="btn-disponible" type="button" id="btn-prod-${prod.id}">
                        Comprar
                    </button>
                </div>
            </div>
        `;
        
        contenedor.appendChild(article);

        // 2. Conectamos el botón con la lógica del carrito
        const btn = article.querySelector(`#btn-prod-${prod.id}`);
      btn?.addEventListener("click", () => {
    // 1. Guardamos el producto con su cantidad
    agregarAlCarrito(prod, email);
    
    // 2. Actualizamos la interfaz (esto se encarga de todo)
    actualizarContador(); 

// 1. Buscamos el elemento
    const feedback = document.getElementById('feedback-msg');
    
    if (feedback) {
        // 2. Le ponemos el texto
        feedback.textContent = `¡${prod.nombre} añadido al carrito!`;
        
        // 3. Lo borramos a los 2 segundos para que no quede ahí siempre
        setTimeout(() => {
            feedback.textContent = '';
        }, 1500);
    }

});
    });
};

const initHomePage = () => {
        const btnLogout = document.getElementById("logoutButton");
    if (btnLogout) {
        // Usamos { once: true } para asegurar que el evento no se duplique 
        // en memoria durante las redirecciones de Vite
        btnLogout.addEventListener("click", () => {
            logout(); 
        }, { once: true });
    }

    // NUEVO: Escuchar el input de búsqueda
    const inputBusqueda = document.getElementById("busqueda") as HTMLInputElement | null;
    if (inputBusqueda) {
        inputBusqueda.addEventListener("input", (e: Event) => {
            const target = e.target as HTMLInputElement;
            buscarProductos(target.value);
        });
    }
actualizarContador();
    cargarCategorias();
    cargarProductos();
};



document.addEventListener("DOMContentLoaded", initHomePage);
