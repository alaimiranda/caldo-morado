let colaboradores= [];


document.querySelector('form').addEventListener('submit', function () {
    const hiddenInput = document.getElementById('colaboradores-hidden');
    hiddenInput.value = JSON.stringify(colaboradores);
});

document.getElementById('add-colab').addEventListener('click', function() {
    var select = document.getElementById('colab-select');
    var selectedValue = select.value;
    console.log(selectedValue);
    if (selectedValue !== "") {
        if(!colaboradores.includes(selectedValue)){
            if(colaboradores.length <4){
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

    // to-do: filtrar los colaboradores en la lista desplegable
});