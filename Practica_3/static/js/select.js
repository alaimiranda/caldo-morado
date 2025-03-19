import { Usuario } from "../../src/usuarios/Usuario.js";

async function fillSelectWithUsers() {
    const select = document.getElementById("colab-select");
    if (!select) return;
    //select.appendChild("<option value=''>Selecciona un colaborador</option>");
    try {
        
        console.log("Intentando obtener los usuarios...");
        const usuarios = await Usuario.getAllUsers();   // no consigue acceder a la clase usuario
        console.log("Usuarios obtenidos:", usuarios);
        select.innerHTML = "<option value=''>Selecciona un colaborador</option>";
        usuarios.forEach(usuario => {
            const option = document.createElement("option");
            option.value = usuario.id;
            option.textContent = usuario.nombre;
            select.appendChild(option);
        });
        
    } catch (error) {
        console.error("Error al cargar los usuarios en el select:", error);
    }
}

document.addEventListener("DOMContentLoaded", fillSelectWithUsers);
