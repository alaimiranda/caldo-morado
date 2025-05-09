import { Multimedia } from "../../src/multimedia/Multimedia";


let posicionActual = 1;
let multimedia = Multimedia.getMultimediaById(post_id);

const antBoton = document.getElementById('feed_anterior');
const sigBoton = document.getElementById('feed_siguiente');



function pasarFoto() {
    if (posicionActual < multimedia.length) {
        posicionActual++;
    } 
    renderizarImagen();
}

function retrocederFoto() {
    if (posicionActual > 1) {
        posicionActual--;
    }
    renderizarImagen();
}

function renderizarImagen() {
    const imagenContainer = document.getElementById("feed_image");
    // Solo se muestran los botones de siguiente y anterior si hay más de una foto
    if (multimedia.length === 1){
        sigBoton.style.opacity = 0;
        antBoton.style.opacity = 0;
    }else{
        // Si hay más de una foto se comprueba si es la primera o última foto para mostrar u ocultar los botones 
        if(posicionActual === 1){
            antBoton.style.opacity = 0;
            sigBoton.style.opacity = 1;
            sigBoton.disabled = false;
        }else if(posicionActual === multimedia.length){
            antBoton.style.opacity = 1;
            sigBoton.style.opacity = 0;
            antBoton.disabled = false;
        }else{
            antBoton.style.opacity = 1;
            sigBoton.style.opacity = 1;
            antBoton.disabled = false;
            sigBoton.disabled = false;
        }
    } 

    let found = false;
    let i = 1;
    let actual;
    while(!found || i <= multimedia.length){
        if(multimedia[i].pos === posicionActual){
            actual = multimedia[i];
            found = true;
        }
        else i++;
    }

    if (imagenContainer) {
        imagenContainer.style.backgroundImage = `url('${/imagen/actual.archivo}')`;
        imagenContainer.style.backgroundSize = "contain"; 
        imagenContainer.style.backgroundRepeat = "no-repeat";
        imagenContainer.style.backgroundPosition = "center";
        imagenContainer.style.width = "450px";
        imagenContainer.style.height = "450px";
    }
}

document.getElementById('feed_anterior').addEventListener('click', retrocederFoto);
document.getElementById('feed_siguiente').addEventListener('click', pasarFoto);
renderizarImagen();