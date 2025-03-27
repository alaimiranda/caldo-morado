let colaboradores= [];

function addColab(){
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
}

//llenar el select
function fillSelect(){
    var select = document.getElementById('colab-select');
    var texto = document.getElementById('colaborador-input').value;
    //var colaboradores = Usuario.getUsuarioLike(texto); // consulta de colaboradores en sql

    //colaboradores= ["COL1", "COL2", "COL3", "COL4", "COL5"];
    colaboradores.forEach(colaborador => {
        var option = document.createElement('option');
        option.value = colaborador;
        option.textContent = colaborador;
        select.appendChild(option);
    });
}

document.getElementById('colab-select').addEventListener('input',fillSelect(this.value));
document.getElementById('add-colab').addEventListener('click',addColab());
