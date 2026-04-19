// src/utils/auths.ts
import { removeUser } from "@/utils/localStorage";
import { navigate } from "@/utils/navigate";

/**
 * Cierra la sesión del usuario eliminando los datos del localStorage
 * y redirigiéndolo a la página de login.
 */
export const logout = (): void => {
    // 1. Eliminamos el "userData" de la sesión actual
    removeUser(); 
    
    // 2. Redirigimos al login (Ruta absoluta para evitar errores en Vite)
    navigate("/src/pages/auth/login/login.html");
};