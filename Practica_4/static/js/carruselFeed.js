document.addEventListener("DOMContentLoaded", function () {

            const multimediaData = JSON.parse('<%- multimediaPorPost %>');

            document.querySelectorAll(".feed_post").forEach(post => {
                const postId = post.getAttribute("post_id");
                const multimedia = multimediaData[postId] || [];

                console.log("Multimedia para post", postId, multimedia);
                if (!multimedia || multimedia.length === 0) return;

                let posicionActual = 1;

                const antBoton = document.getElementById(`feed_anterior_${postId}`);
                const sigBoton = document.getElementById(`feed_siguiente_${postId}`);
                const imagenContainer = document.getElementById(`feed_image_${postId}`);
                const pieDeFoto = document.getElementById(`feed_pie-de-foto_${postId}`);

                console.log("imagenContainer", imagenContainer);

                function renderizarImagen() {
                    console.log("renderizando imagen para post", postId);
                    const actual = multimedia.find(m => m.pos === posicionActual);
                    console.log("imagen actual", actual);
                    if (!actual) return;

                    imagenContainer.style.backgroundImage = `url('/imagen/${actual.archivo}')`;
                    imagenContainer.style.backgroundSize = "contain";
                    imagenContainer.style.backgroundRepeat = "no-repeat";
                    imagenContainer.style.backgroundPosition = "center";
                    imagenContainer.style.width = "450px";
                    imagenContainer.style.height = "450px";

                    pieDeFoto.textContent = actual.pie || ""; // Asume que hay una propiedad "pie"

                    // Control de botones
                    antBoton.style.opacity = posicionActual === 1 ? 0 : 1;
                    sigBoton.style.opacity = posicionActual === multimedia.length ? 0 : 1;
                }

                function pasarFoto() {
                    if (posicionActual < multimedia.length) {
                        posicionActual++;
                        renderizarImagen();
                    }
                }

                function retrocederFoto() {
                    if (posicionActual > 1) {
                        posicionActual--;
                        renderizarImagen();
                    }
                }

                antBoton.addEventListener("click", retrocederFoto);
                sigBoton.addEventListener("click", pasarFoto);

                renderizarImagen();
            });
        });
