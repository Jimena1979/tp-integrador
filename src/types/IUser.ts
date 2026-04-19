import type { Rol } from "./Rol.ts";

export interface IUser {
    nombre: string;     // Agregado
    apellido: string;   // Agregado
    email: string;
    password: string;
    rol: Rol;
    loggedIn: boolean;
}