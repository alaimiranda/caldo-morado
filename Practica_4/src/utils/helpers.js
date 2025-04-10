export function error(errores, propiedad) {
    if (propiedad in errores) return ` <span class="error">${errores[propiedad].msg}`;
    return '';
}
