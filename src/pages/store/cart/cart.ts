import { type Product } from "@/types/product.ts"; 
import { type CartItem } from "@/types/product.ts"; 

const STORAGE_KEY = "carrito_food_store";

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