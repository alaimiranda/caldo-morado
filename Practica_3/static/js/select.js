export let colaboradores = [];



document.getElementById('add-colab').addEventListener('click', function() {
    var select = document.getElementById('colab-select');
    var selectedValue = select.value;
    if (selectedValue !== "") {
        if(!colaboradores.includes(selectedValue)){
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
            document.getElementById('colab-list').appendChild(li);
        } else{
            alert("El colaborador ya ha sido añadido.");
        }
    } else {
        alert("Por favor, selecciona un colaborador.");
    }
});