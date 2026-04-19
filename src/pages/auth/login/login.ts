import { verificarAcceso } from '@/main';
import type { IUser } from "@/types/IUser";

// Verificación inicial
verificarAcceso(); 

const formLogin = document.getElementById("form") as HTMLFormElement; 

if (formLogin) {
    formLogin.addEventListener("submit", (e: Event) => {
        e.preventDefault();

        // --- USO DE FORMDATA ---
        const data = new FormData(formLogin);
        const email = data.get("email") as string;
        const password = data.get("password") as string;

        // 1. Traemos los usuarios
        const users: IUser[] = JSON.parse(localStorage.getItem("users") || "[]");

        // 2. Buscamos al usuario
        const userFound = users.find(u => u.email === email && u.password === password);

        if (userFound) {
            // 3. Guardamos sesión
            const sessionData: IUser = {
                ...userFound,
                loggedIn: true
            };
            
            localStorage.setItem("userData", JSON.stringify(sessionData));

            alert(`¡Bienvenido de nuevo, ${userFound.email}!`);

            // 4. Redirección centralizada
            verificarAcceso(); 
            
        } else {
            alert("Email o contraseña incorrectos.");
        }
    });
}