import { verificarAcceso } from '@/main'; // Usamos el middleware centralizado
import type { IUser } from "@/types/IUser";

// 1. Verificación inicial: Si ya está logueado, lo sacamos de aquí
verificarAcceso();

const formRegistro = document.getElementById("registroForm") as HTMLFormElement;

if (formRegistro) {
    formRegistro.addEventListener("submit", (e: Event) => {
        e.preventDefault();

        // --- USO DE FORMDATA 
        const data = new FormData(formRegistro);
        const email = data.get("email") as string;
        const password = data.get("password") as string;
        const nombre = data.get("nombre") as string;
        const apellido = data.get("apellido") as string;

        // 2. Traemos la lista de usuarios existente
        const users: IUser[] = JSON.parse(localStorage.getItem("users") || "[]");

        // 3. Validación de usuario duplicado
        if (users.find(u => u.email === email)) {
            alert("Este email ya está registrado.");
            return;
        }

        // 4. Crear el nuevo usuario (Por defecto es 'client')
        const newUser: IUser = { 
              email: email, 
            password: password, 
            nombre: nombre,
            apellido: apellido,
            rol: 'client', 
            loggedIn: false 
        };

        // 5. Guardar en localStorage
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        alert("Registro exitoso. ¡Ahora podés iniciar sesión!");
        
        // 6. Redirección usando ruta absoluta (Mejor para Vite)
        window.location.href = "/src/pages/auth/login/login.html";
    });
}