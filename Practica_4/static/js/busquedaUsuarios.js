function obtenerAmigosDesdeHTML() {
    const amigosHidden = document.getElementById('feed-amigos-data');
    if (!amigosHidden) return [];
    
    try {
        return JSON.parse(amigosHidden.value);
    } catch (error) {
        console.error('Error al parsear usuarios:', error);
        return [];
    }
}

let amigos = obtenerAmigosDesdeHTML(); 

function buscar(){
    console.log(amigos);
    let query = document.getElementById('feed-buscar').value;
    document.getElementById('feed-results').innerHTML = "";
    if(query.trim() === ""){
        return;
    }
    let result = [];
    for(let i = 0; i < amigos.length; i++){
        if(amigos[i].toLowerCase().includes(query.toLowerCase())){
            result.push(amigos[i]);
        }
    }
    document.getElementById('feed-results').innerHTML = "";
    if(result.length > 0){
        for(let i = 0; i < result.length; i++){
            let li = document.createElement('li');
            li.textContent = result[i];
             li.addEventListener('click', function() {
                seleccionarUsuario(result[i]);
            });
            document.getElementById('feed-results').appendChild(li);
        }
    }else{
        let li = document.createElement('li');
        li.textContent = "No se encontraron usuarios con nombre: " + query;
        document.getElementById('feed-results').appendChild(li);
    }
}

function seleccionarUsuario(usuario){
    document.getElementById('feed-redirect-form').action = `/perfil/${usuario}`;
    document.getElementById('feed-redirect-form').method = 'GET';
    document.getElementById('feed-redirect-form').submit();
}
document.getElementById('feed-buscar').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') buscar();
});


