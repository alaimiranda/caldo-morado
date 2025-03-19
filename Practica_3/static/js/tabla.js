import { Publicacion } from "./src/publicaciones/Publicacion.js";

async function fillTableWithUsers() {
    const table = document.getElementById("tabla-clasificacion");
    
    //entradas de tabla
    const row = table.insertRow();
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);
    const cell4 = row.insertCell(3);
    cell1.textContent = "1";
    cell2.textContent =  "usuario1, usuario2";
    cell3.textContent = "pie de foto.........................";
    cell4.textContent = 4;
    //

    if (!table) return;

    try {
        
        console.log("Intentando obtener las publicaciones de la tabla...");
        const publicaciones = await Publicacion.getMejoresPublicaciones();   // no consigue acceder a la clase usuario
        console.log("Publicaciones obtenidos:", publicaciones);
        let i =0;
        publicaciones.forEach(publicacion => {
            const row = table.insertRow();
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            const cell3 = row.insertCell(2);
            cell1.textContent = i;
            cell2.textContent = publicacion.creators_tostring();
            cell3.textContent = publicacion.titulo;
            cell4.textContent = usuario.likes;
            i++;
        });

    } catch (error) {
        console.error("Error al cargar los usuarios en la tabla", error);
    }
}

document.addEventListener("DOMContentLoaded", fillTableWithUsers);
