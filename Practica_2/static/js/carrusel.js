let fotos = [];
let posicionActual = 0;

document.getElementById('add-image-btn').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('imagenes').click();
});

document.getElementById('imagenes').addEventListener('change', function(event) {
    const files = event.target.files;
    if (files.length === 0) return;

    for (let file of files) {
        const reader = new FileReader();
        reader.onload = function(e) {
            fotos.push(e.target.result); 
            if (fotos.length === 1) {
                posicionActual = 0; 
            }
            renderizarImagen();
        };
        reader.readAsDataURL(file);
    }

   
    event.target.value = "";
});

document.getElementById('delete-image-btn').addEventListener('click', function() {
    if (fotos.length > 0) {
        fotos.splice(posicionActual, 1); 
        if (posicionActual >= fotos.length) {
            posicionActual = fotos.length - 1; 
        }
        renderizarImagen();
    }
});

function pasarFoto() {
    if (posicionActual >= fotos.length - 1) {
        posicionActual = 0;
    } else {
        posicionActual++;
    }
    renderizarImagen();
}

function retrocederFoto() {
    if (posicionActual <= 0) {
        posicionActual = fotos.length - 1;
    } else {
        posicionActual--;
    }
    renderizarImagen();
}

function borrarFotos(){
    fotos = [];
    posicionActual = 0;
    renderizarImagen();
}

function renderizarImagen() {
    const imagenContainer = document.getElementById("myImage");
    if (imagenContainer) {
        imagenContainer.style.backgroundImage = `url('${fotos[posicionActual]}')`;
        imagenContainer.style.backgroundSize = "contain"; 
        imagenContainer.style.backgroundRepeat = "no-repeat";
        imagenContainer.style.backgroundPosition = "center";
        imagenContainer.style.width = "450px";
        imagenContainer.style.height = "450px";
    }
}

document.getElementById('anterior').addEventListener('click', retrocederFoto);
document.getElementById('siguiente').addEventListener('click', pasarFoto);

renderizarImagen();