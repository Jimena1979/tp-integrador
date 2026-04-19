import type { IUser } from "@/types/IUser";
export const verificarAcceso = (rolPermitido?: 'admin' | 'client'): void => {
    const userData = localStorage.getItem("userData");
    const path = window.location.pathname;

    // 1. Si no hay sesión, al login
    if (!userData) {
        if (!path.includes("/auth/")) {
            window.location.href = "/src/pages/auth/login/login.html";
        }
        return;
    }

    const user: IUser = JSON.parse(userData);

    // 2. Si está en login/registro, mandarlo a su home correspondiente
    if (path.includes("/auth/")) {
        redirigirSegunRol(user.rol);
        return;
    }

    // 3. VALIDACIÓN ESTRICTA:
    // Si la página pide un rol (ej: 'client') y mi rol es distinto (ej: 'admin'), REBOTE.
    if (rolPermitido && user.rol !== rolPermitido) {
        alert(`Acceso restringido. Tu rol de ${user.rol} no permite entrar aquí.`);
        redirigirSegunRol(user.rol); 
        return; // Importante para detener la ejecución
    }
};

const redirigirSegunRol = (rol: string): void => {
    const adminPath = "/src/pages/admin/home/home.html";
    const clientPath = "/src/pages/store/home/home.html";
    const actualPath = window.location.pathname;

    if (rol === 'admin' && actualPath !== adminPath) {
        window.location.href = adminPath;
    } else if (rol === 'client' && actualPath !== clientPath) {
        window.location.href = clientPath;
    }
};