function obtenerAmigosDesdeHTML() {
    const amigosHidden = document.getElementById('chat-amigos-data');
    if (!amigosHidden) return [];
    
    try {
        return JSON.parse(amigosHidden.value);
    } catch (error) {
        console.error('Error al parsear amigos:', error);
        return [];
    }
}

let amigos = obtenerAmigosDesdeHTML(); 

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
    document.getElementById('chat-results').innerHTML = "";
    if(result.length > 0){
        for(let i = 0; i < result.length; i++){
            let li = document.createElement('li');
            li.textContent = result[i];
             li.addEventListener('click', function() {
                seleccionarUsuario(result[i]);
            });
            document.getElementById('chat-results').appendChild(li);
        }
    }else{
        let li = document.createElement('li');
        li.textContent = "No se encontraron amigos con nombre: " + query;
        document.getElementById('chat-results').appendChild(li);
    }
}

function seleccionarUsuario(usuario){
    document.getElementById('chat-redirect-form').action = `/chat/${usuario}`;
    document.getElementById('chat-redirect-form').submit();
}
document.getElementById('chat-buscar').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') buscar();
});


