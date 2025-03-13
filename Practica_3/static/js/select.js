async function fillSelectWithUsers() {
    const select = document.getElementById("colab-select");
    if (!select) return;

    try {
        const usuarios = await Usuario.getAllUsers(); // Asegurar que se espera la respuesta
        console.log(usuarios);
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
