import { type Product } from "@/types/product.ts"; 
import { type CartItem } from "@/types/product.ts"; 
import type { IUser } from "@/types/IUser";

const STORAGE_KEY = "carrito_food_store";

const getEmail = (): string => {
    const userData = localStorage.getItem("userData");
    
    // Si no hay nada, devolvemos un string vacío
    if (!userData) return "";
    
    // Parseamos el string a objeto
    const user: IUser = JSON.parse(userData);
    
    // Retornamos el email
    return user.email;
};



// 1. Obtener carrito FILTRADO por email
export const obtenerCarrito = (email: string): CartItem[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    
    if (!data) return [];
    
    try {
        const todosLosItems: CartItem[] = JSON.parse(data);
        // Filtramos para traer solo los del usuario que nos piden
        return todosLosItems.filter(item => item.usuario_email === email);
    } catch (error) {
        console.error("Error al leer el carrito:", error);
        return [];
    }
};

// 2. Guardar carrito (necesitamos traer todos, mezclar los nuevos y guardar)
const guardarCarrito = (nuevosItems: CartItem[], email: string): void => {
    const data = localStorage.getItem(STORAGE_KEY);
    const todosLosItems: CartItem[] = data ? JSON.parse(data) : [];
    
    // Filtramos los items que NO son del usuario actual (para mantener los de otros usuarios intactos)
    const itemsDeOtrosUsuarios = todosLosItems.filter(item => item.usuario_email !== email);
    
    // Combinamos y guardamos todo
    const carritoFinal = [...itemsDeOtrosUsuarios, ...nuevosItems];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(carritoFinal));
};

// 3. Lógica de agregar producto
export const agregarAlCarrito = (producto: Product, email: string): void => {
    // Obtenemos SOLO los items de este usuario
    const carrito = obtenerCarrito(email);
    
    const index = carrito.findIndex(item => item.producto.id === producto.id);

    if (index !== -1) {
        carrito[index].cantidad += 1;
        carrito[index].subtotal = carrito[index].cantidad * carrito[index].producto.precio;
    } else {
        // Agregamos con el usuario_email
        carrito.push({ 
            id: Date.now(),
            producto: producto, 
            cantidad: 1,
            observaciones: "",
            subtotal: producto.precio,
            usuario_email: email // <--- Aquí se guarda correctamente
        });
    }
    
    guardarCarrito(carrito, email);
};

// 4. Calcular total para un usuario específico
export const calcularTotal = (email: string): number => {
    const carrito = obtenerCarrito(email);
    return carrito.reduce((acc, item) => acc + item.subtotal, 0);
};

// --- NUEVAS FUNCIONES PARA LA UI DEL CARRITO ---

// 1. Actualizar cantidad (+ o -)
export const actualizarCantidad = (email: string, itemId: number, delta: number): void => {
    const carrito = obtenerCarrito(email);
    const index = carrito.findIndex(item => item.id === itemId);

    if (index !== -1) {
        carrito[index].cantidad += delta;

        // Si la cantidad llega a 0, lo eliminamos, sino actualizamos subtotal
        if (carrito[index].cantidad <= 0) {
            carrito.splice(index, 1);
        } else {
            carrito[index].subtotal = carrito[index].cantidad * carrito[index].producto.precio;
        }
        guardarCarrito(carrito, email);
    }
};

// 2. Eliminar ítem del carrito
export const eliminarDelCarrito = (email: string, itemId: number): void => {
    let carrito = obtenerCarrito(email);
    carrito = carrito.filter(item => item.id !== itemId);
    guardarCarrito(carrito, email);
};

// ACTUALIZA EL CONTADOR
const actualizarContador = (): void => {
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

// 3. Vaciar carrito completo
export const vaciarCarrito = (email: string): void => {
    guardarCarrito([], email);
};


// --- 2. LÓGICA DE INTERFAZ (UI) PARA LLENAR EL CARRITO---

const renderCart = () => {
    const email=getEmail()
    const listContainer = document.getElementById('cart-items-list') as HTMLDivElement;
    if (!listContainer) return;

    const carrito = obtenerCarrito(email);
    listContainer.innerHTML = ''; // Limpiamos

    if (carrito.length === 0) {
        listContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
    } else {
        carrito.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            itemDiv.innerHTML = `
                <img src="${item.producto.imagen}" alt="${item.producto.nombre}">
                <div class="item-info">
                    <h3>${item.producto.nombre}</h3>
                    <p>${item.producto.descripcion}</p>
                    <span class="precio">$${item.producto.precio.toFixed(2)} c/u</span>
                </div>
                <div class="item-controls">
                    <button class="btn-qty btn-minus" data-id="${item.id}">-</button>
                    <span class="qty-display">${item.cantidad}</span>
                    <button class="btn-qty btn-plus" data-id="${item.id}">+</button>
                </div>
                <span class="item-subtotal">$${item.subtotal.toFixed(2)}</span>
                <button class="btn-delete-item" data-id="${item.id}" title="Eliminar">🗑️</button>
            `;
            listContainer.appendChild(itemDiv);
        });
    }
    updateTotals();

};

const updateTotals = () => {
    const email=getEmail()
    const subtotalDisplay = document.getElementById('subtotal-display');
    const totalDisplay = document.getElementById('total-display');
    
    const subtotal = obtenerCarrito(email).reduce((acc, item) => acc + item.subtotal, 0);
    const envio = 500;
    const total = subtotal + envio;

    if (subtotalDisplay) subtotalDisplay.textContent = `$${subtotal.toFixed(2)}`;
    if (totalDisplay) totalDisplay.textContent = `$${total.toFixed(2)}`;
    actualizarContador()
};

// --- 3. EVENTOS ---

document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    const email=getEmail()
    // Delegación de eventos para botones dinámicos
    document.getElementById('cart-items-list')?.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const id = Number(target.getAttribute('data-id'));

        if (!id) return;

        if (target.classList.contains('btn-plus')) {
            actualizarCantidad(email, id, 1);
        } else if (target.classList.contains('btn-minus')) {
            actualizarCantidad(email, id, -1);
        } else if (target.classList.contains('btn-delete-item')) {
            eliminarDelCarrito(email, id);
        }
        renderCart();
    });

    // Botón vaciar carrito
    document.getElementById('btn-clear-cart')?.addEventListener('click', () => {
        vaciarCarrito(email);
        renderCart();
    });
});

