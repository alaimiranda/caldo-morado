document.getElementById("add-colab").addEventListener("click", function() {
    const select = document.getElementById("colab-select");
    const collaboratorName = select.options[select.selectedIndex].text;
    document.getElementById("collaborator-name").textContent = collaboratorName;
});

document.getElementById('add-colab').addEventListener('click', function() {
    var select = document.getElementById('colab-select');
    var selectedValue = select.value;
    if (selectedValue !== "") {
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
        });
        li.appendChild(deleteSpan);
        
        document.getElementById('colab-list').appendChild(li);
    } else {
        alert("Por favor, selecciona un colaborador.");
    }
});