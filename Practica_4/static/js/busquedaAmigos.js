let amigos = []; // Falta importar la lista de seguidores

function buscar(){
    let query = document.getElementById('chat-buscar').value;
    if(query.trim() === ""){
        return;
    }
    let result = [];

    for(let i = 0; i < amigos.length; i++){
        if(amigos[i].toLowerCase().includes(query.toLowerCase())){
            result.push(amigos[i]);
        }
    }

    document.getElementById('results').innerHTML = "";
    if(result.length > 0){
        for(let i; i < result.length; i++){
            let li = document.createElement('li');
            li.textContent = result[i];
            document.getElementById('results').appendChild(li);
        }
    }else{
        let li = document.createElement('li');
        li.textContent = "No se encontraron amigos con nombre: " + query;
        document.getElementById('results').appendChild(li);
    }
}
