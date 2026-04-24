import { verificarAcceso } from "@/main"; 
import { logout } from "@/utils/auths";

// 1. PROTECCIÓN INMEDIATA
// Se ejecuta antes que cualquier otra cosa para validar el rol.
verificarAcceso('admin');

/**
 * Inicialización del Panel de Administración
 */
const initAdminPage = () => {
    // 2. Manejo del Logout
    const buttonLogout = document.getElementById("logoutButton");
    
    if (buttonLogout) {
        buttonLogout.addEventListener("click", () => {
            logout();
        }, { once: true });
    }

    console.log("🛡️ Panel de administración verificado y cargado");
    
};

// 3. Esperar a que el DOM esté listo
document.addEventListener("DOMContentLoaded", initAdminPage);