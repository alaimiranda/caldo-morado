let colaboradores= [];


document.querySelector('form').addEventListener('submit', function () {
    const hiddenInput = document.getElementById('colaboradores-hidden');
    hiddenInput.value = JSON.stringify(colaboradores);
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
                document.getElementById('cocinar-colablist').appendChild(li);
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