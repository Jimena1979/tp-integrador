import type { ICategory } from "./categoria";

export interface Product {
   id: number;
   eliminado: boolean;
   createdAt: string,
   nombre: string;
   descripcion: string;
   stock: number;
   precio: number;
   imagen: string;
   disponible:boolean;
   categorias: ICategory[];
}


export interface CartItem {
    id: number;
    producto: Product; // El objeto producto completo vive aquí adentro
    cantidad: number;   // Propiedad específica de la compra
    observaciones: string;
    subtotal: number;
    usuario_email:string;
    
}

