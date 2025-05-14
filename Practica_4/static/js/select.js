let colaboradores= [];

let fotos = [];
let descripciones = [];
let posicionActual = 0;

document.querySelector('form').addEventListener('submit', function () {
    guardarDescripcion();
    const hiddenInput = document.getElementById('colaboradores-hidden');
    hiddenInput.value = JSON.stringify(colaboradores);
    document.getElementById('foto').value = `url('${fotos[0]}')`;
});

document.getElementById('add-colab').addEventListener('click', function() {
    var select = document.getElementById('colab-select');
    var selectedValue = select.value;
    if (selectedValue !== "" && selectedValue !== "Elige un colaborador...") {
        if(!colaboradores.includes(selectedValue)){
            if(colaboradores.length < 5){
                // nuevo elemento
                var li = document.createElement('li');
                
                // nombre
                var nameSpan = document.createElement('span');
                nameSpan.textContent = selectedValue;
                li.appendChild(nameSpan);

                // eliminar
                var deleteSpan = document.createElement('span');
                deleteSpan.textContent = "×";

                deleteSpan.addEventListener('click', function() {
                    li.remove();
                    //eliminar del array
                    colaboradores = colaboradores.filter(item => item !== selectedValue);
                });

                li.appendChild(deleteSpan);
                colaboradores[colaboradores.length] = selectedValue;
                document.getElementById('colablist').appendChild(li);
            } else{
                alert("No puedes añadir más colaboradores.");
            }
        } else{
            alert("El colaborador ya ha sido añadido.");
        }
    } else {
        alert("Por favor, selecciona un colaborador.");
    }
});


document.getElementById('colaborador-input').addEventListener('input', function() {
    var input = this.value.toLowerCase();
    var options = document.querySelectorAll('#colab-select option');
    options.forEach(option => {
        if (option.value.toLowerCase().includes(input)) {
            option.style.display = 'block';
        } else {
            option.style.display = 'none';
        }
    }
    );

});

document.addEventListener('DOMContentLoaded', function () {
    const hiddenItem = document.querySelector('#colablist .hidden-item');
    const sessionUsername = hiddenItem.textContent.trim();
    colaboradores.push(sessionUsername);
});

const antBoton = document.getElementById('anterior');
const sigBoton = document.getElementById('siguiente');
const delBoton =  document.getElementById('delete-image-btn');

document.getElementById('add-image-btn').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('imagenes').click();
});

// Alternativa para el carrusel de fotos, solo mostramos una foto en vez de todas ya que no hemos sido capaces de incluir varias imagenes en la base de datos
document.getElementById('imagenes').addEventListener('change', function(event) {
  const file = event.target.files[0];
  const myImageDiv = document.getElementById('myImage');

  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = function(e) {
      myImageDiv.innerHTML = '';
      const img = document.createElement('img');
      img.src = e.target.result;
      img.style.maxWidth = '100%';  
      img.style.maxHeight = '300px'; 

      myImageDiv.appendChild(img);
    };

    reader.readAsDataURL(file);
  } else {
    myImageDiv.innerHTML = 'Archivo no válido';
  }
});
/*
document.getElementById('imagenes').addEventListener('change', function(event) {
    const files = event.target.files;
    if (files.length === 0) return;

    for (let file of files) {
        const reader = new FileReader();
        reader.onload = function(e) {
            fotos.push(e.target.result);
            descripciones.push("Introduce un pie de foto...");
            if (fotos.length === 1) {
                posicionActual = 0; 
            }
            renderizarImagen();
        };
        reader.readAsDataURL(file);
    }


    event.target.value = "";
});
*/

document.getElementById('delete-image-btn').addEventListener('click', function() {
    if (fotos.length > 0) {
        fotos.splice(posicionActual, 1); 
        descripciones.splice(posicionActual, 1);
        if (posicionActual >= fotos.length) {
            posicionActual = fotos.length - 1; 
        }
        renderizarImagen();
    }
});

function guardarDescripcion() {
    const descripcionInput = document.getElementById("pie-de-foto");
    if (descripcionInput) {
        descripciones[posicionActual] = descripcionInput.value;
    }
}

function pasarFoto() {
    guardarDescripcion();
    if (posicionActual < fotos.length - 1) {
        posicionActual++;
    } 
    renderizarImagen();
}

function retrocederFoto() {
    guardarDescripcion();
    if (posicionActual > 0) {
        posicionActual--;
    }
    renderizarImagen();
}

function borrarFotos(){
    fotos = [];
    descripciones = [];
    posicionActual = 0;
    renderizarImagen();
}

function renderizarImagen() {
    const imagenContainer = document.getElementById("myImage");
    const descripcionInput = document.getElementById("pie-de-foto");
    // Solo se muestran los botones de siguiente y anterior si hay más de una foto
    if(fotos.length === 0){
        sigBoton.style.opacity = 0;
        antBoton.style.opacity = 0;
        delBoton.style.opacity = 0;
        sigBoton.disabled = true;
        antBoton.disabled = true;
        delBoton.disabled = true;

    }else if (fotos.length === 1){
        sigBoton.style.opacity = 0;
        antBoton.style.opacity = 0;
        delBoton.style.opacity = 1;
        delBoton.disabled = false;
    }else{
        delBoton.style.opacity = 1;
        delBoton.disabled = false;
        // Si hay más de una foto se comprueba si es la primera o última foto para mostrar u ocultar los botones 
        if(posicionActual === 0){
            antBoton.style.opacity = 0;
            sigBoton.style.opacity = 1;
            sigBoton.disabled = false;
        }else if(posicionActual === fotos.length - 1){
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

    if (imagenContainer) {
        imagenContainer.style.backgroundImage = `url('${fotos[posicionActual]}')`;
        imagenContainer.style.backgroundSize = "contain"; 
        imagenContainer.style.backgroundRepeat = "no-repeat";
        imagenContainer.style.backgroundPosition = "center";
        imagenContainer.style.width = "450px";
        imagenContainer.style.height = "450px";
    }
    if (descripcionInput) {
        descripcionInput.value = fotos.length > 0 ? descripciones[posicionActual] : "Introduce un pie de foto...";
    }
}

document.getElementById('anterior').addEventListener('click', retrocederFoto);
document.getElementById('siguiente').addEventListener('click', pasarFoto);
document.getElementById('pie-de-foto').addEventListener('input', guardarDescripcion);

renderizarImagen();