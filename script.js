// script.js

// ====================================================================================
// 1. CONFIGURACIÓN DE IA Y VARIABLES GLOBALES
// ====================================================================================

// --- CONFIGURACIÓN DEL WORKER (LLAMADA A CLOUDFLARE) ---
const WORKER_URL = 'https://generador-impro.raul-grigelmo3.workers.dev';
// -----------------------------------------------------------------------------------

let ausentesSeleccionados = []; 
let alumnosBase = []; 
let alumnosRestantes = []; 
let alumnosPresentesEnClase = []; 

const selectNum = document.getElementById("numParticipantes");
const modalAusentes = document.getElementById("modalAusentes");
const listaAusentesDiv = document.getElementById("listaAusentes");
const selectClase = document.getElementById("selectClase");

let lastSelected = 1;

// Alias para las listas globales cargadas de data.js
const ALUMNOS_POR_CLASE = window.ALUMNOS_POR_CLASE;
const lugares = window.lugares;
const personajes = window.personajes;
const objetos = window.objetos;
const objetosRaros = window.objetosRaros;
const formatos = window.formatos;
const sentimientos = window.sentimientos;

// ====================================================================================
// 2. FUNCIONES DE LÓGICA CORE (Helpers, Modal y Reinicio)
// ====================================================================================

function parsearAlumno(alumnoConNivel) {
    const parts = alumnoConNivel.split('|');
    return {
        nombre: parts[0].trim(),
        nivel: parts.length > 1 ? parseInt(parts[1], 10) : 1
    };
}

function azar(lista) {
    return lista[Math.floor(Math.random() * lista.length)];
}

function poblarSelect() {
    if (alumnosRestantes.length === 0) {
        selectNum.innerHTML = '<option value="0">0 (sin alumnos)</option>';
        selectNum.disabled = true;
        document.querySelector('button[onclick="generar()"]').disabled = true;
        return;
    }
    const max = alumnosRestantes.length;
    selectNum.innerHTML = "";
    for (let i = 1; i <= max; i++) {
        const opt = document.createElement("option");
        opt.value = i;
        opt.textContent = i;
        selectNum.appendChild(opt);
    }
    const want = (typeof lastSelected === "number" && lastSelected >= 1) ? Math.min(lastSelected, max) : 1;
    selectNum.value = want;
    selectNum.disabled = false;
    document.querySelector('button[onclick="generar()"]').disabled = false;
}

function poblarSelectClases() {
    if (typeof ALUMNOS_POR_CLASE === 'undefined') return; 
    
    selectClase.innerHTML = "";
    const clases = Object.keys(ALUMNOS_POR_CLASE);
    clases.forEach(clase => {
        const opt = document.createElement("option");
        opt.value = clase;
        opt.textContent = clase;
        selectClase.appendChild(opt);
    });
    const lastClass = localStorage.getItem('lastClass') || clases[0];
    selectClase.value = lastClass;
}

function actualizarListaAlumnos() {
    if (typeof ALUMNOS_POR_CLASE === 'undefined') return; 
    
    const claseSeleccionada = selectClase.value;
    localStorage.setItem('lastClass', claseSeleccionada);
    alumnosBase = ALUMNOS_POR_CLASE[claseSeleccionada] || [];
    
    listaAusentesDiv.innerHTML = "";
    if (alumnosBase.length === 0) {
        listaAusentesDiv.innerHTML = "<p>No hay alumnos definidos para esta clase.</p>";
        return;
    }

    alumnosBase.forEach(alumnoConNivel => {
        const { nombre } = parsearAlumno(alumnoConNivel);
        const label = document.createElement("label");
        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.value = nombre;
        
        if(ausentesSeleccionados.includes(nombre)) {
            cb.checked = true;
        }

        label.appendChild(cb);
        label.appendChild(document.createTextNode(" " + nombre));
        listaAusentesDiv.appendChild(label);
    });
}

function mostrarModalAusentes() {
    poblarSelectClases();
    actualizarListaAlumnos(); 
    
    modalAusentes.style.display = "flex";
    modalAusentes.setAttribute("aria-hidden", "false");
    selectNum.innerHTML = '<option>--</option>';
    selectNum.disabled = true;
    document.querySelector('button[onclick="generar()"]').disabled = true;
}

function confirmarAusentes(todosPresentes = false) {
    if (alumnosBase.length === 0) {
        alert("Por favor, selecciona una clase válida.");
        return;
    }
    
    if (todosPresentes) {
        ausentesSeleccionados = [];
    } else {
        const checks = Array.from(listaAusentesDiv.querySelectorAll("input[type=checkbox]"));
        ausentesSeleccionados = checks.filter(c => c.checked).map(c => c.value);
    }

    alumnosRestantes = alumnosBase.filter(alumnoConNivel => {
        const { nombre } = parsearAlumno(alumnoConNivel);
        return !ausentesSeleccionados.includes(nombre);
    });
    
    alumnosPresentesEnClase = [...alumnosRestantes]; 
    
    modalAusentes.style.display = "none";
    modalAusentes.setAttribute("aria-hidden", "true");
    lastSelected = 1;
    poblarSelect();
    document.getElementById("resultado").innerHTML = `Clase: ${selectClase.value}. ¡Listo para generar!`;
    if (alumnosRestantes.length === 0) {
        document.getElementById("resultado").innerHTML = `<p style="color:crimson;">No hay alumnos presentes en la clase ${selectClase.value}.</p>`;
    }
}

function reiniciarSorteo() {
    if (typeof ALUMNOS_POR_CLASE === 'undefined') return; 
    
    alumnosBase = ALUMNOS_POR_CLASE[selectClase.value] || [];
    alumnosRestantes = alumnosBase.filter(alumnoConNivel => {
        const { nombre } = parsearAlumno(alumnoConNivel);
        return !ausentesSeleccionados.includes(nombre);
    });
    
    alumnosPresentesEnClase = [...alumnosRestantes];
    
    lastSelected = 1;
    poblarSelect();
    document.getElementById("resultado").innerHTML = `Sorteo de ${selectClase.value} reiniciado. ¡A elegir de nuevo!`;
    if (alumnosRestantes.length === 0) {
        document.getElementById("resultado").innerHTML = `<p style="color:crimson;">No hay alumnos presentes en la clase ${selectClase.value}.</p>`;
    }
}

// ====================================================================================
// 3. LÓGICA DE SORTEO COMPARTIDA (Participantes)
// ====================================================================================

function sortearParticipantes(num) {
    if (alumnosRestantes.length === 0) return { participantes: [], poolSorteable: [] };

    const participantes = []; 
    let alumnosSorteadosConNivel = []; 
    let poolSorteable = [...alumnosRestantes]; 
    let spotsToFill = num;
    
    const esPrimerSorteo = alumnosRestantes.length === alumnosPresentesEnClase.length;
    const isVeteran = (a) => parsearAlumno(a).nivel !== 0;
    const isAnyone = () => true;

    const seleccionarYRemover = (filterFn) => {
        const candidatos = poolSorteable.filter(filterFn);
        if (candidatos.length === 0) return null; 

        const alumno = azar(candidatos);
        
        const idxInPool = poolSorteable.findIndex(a => parsearAlumno(a).nombre === parsearAlumno(alumno).nombre);
        if (idxInPool > -1) {
            poolSorteable.splice(idxInPool, 1); 
        }
        
        alumnosSorteadosConNivel.push(alumno);
        spotsToFill--;
        return alumno;
    };
    
    if (esPrimerSorteo) {
        const veteranosRestantes = poolSorteable.filter(isVeteran);
        const numVeteranos = veteranosRestantes.length;
        const numVeteranosAReunir = Math.min(spotsToFill, numVeteranos);
        for(let i=0; i < numVeteranosAReunir; i++) { seleccionarYRemover(isVeteran); }
        while (spotsToFill > 0 && poolSorteable.length > 0) { seleccionarYRemover(isAnyone); }
    } else {
        if (num === 1) {
            while (spotsToFill > 0 && poolSorteable.length > 0) { seleccionarYRemover(isAnyone); }
        } 
        else if (num === 2) {
            seleccionarYRemover(isVeteran); 
            while (spotsToFill > 0 && poolSorteable.length > 0) { seleccionarYRemover(isAnyone); }
        } 
        else if (num >= 3) {
            seleccionarYRemover(isVeteran);
            while (spotsToFill > 0 && poolSorteable.length > 0) { seleccionarYRemover(isAnyone); }
        }
    } 
    
    alumnosSorteadosConNivel.forEach(alumnoConNivel => {
        participantes.push(parsearAlumno(alumnoConNivel).nombre);
    });

    return { participantes, poolSorteable };
}

// ====================================================================================
// 4. GENERACIÓN DE IDEAS (Offline/Online)
// ====================================================================================

function generar() {
    const modeSwitch = document.getElementById("modeSwitch");
    if (!modeSwitch) {
        document.getElementById("resultado").innerHTML = "<strong style='color:red;'>ERROR JS:</strong> Falta el interruptor Online/Offline.";
        return;
    }
    
    if (selectNum.disabled || alumnosRestantes.length === 0) return;

    if (modeSwitch.checked) {
        generarOnline();
    } else {
        generarOffline();
    }
}

function generarOffline() {
    if (typeof lugares === 'undefined') return;
    const num = parseInt(selectNum.value, 10);
    lastSelected = num;
    const { participantes, poolSorteable } = sortearParticipantes(num);
    alumnosRestantes = poolSorteable; 
    poblarSelect();
    
    const lugar = azar(lugares);
    const objeto = azar(objetos);
    const objetoRaro = azar(objetosRaros);
    const formato = azar(formatos);
    const sentimiento = azar(sentimientos);
    
    let personajePrincipal = azar(personajes);
    let personajesExtras = [];
    let personajesDisponibles = [...personajes].filter(p => p !== personajePrincipal); 
    const numPersonajesAdicionales = participantes.length > 1 ? participantes.length - 1 : 0;
    
    for (let i = 0; i < numPersonajesAdicionales; i++) {
        const idx = Math.floor(Math.random() * personajesDisponibles.length);
        personajesExtras.push(personajesDisponibles.splice(idx, 1)[0]); 
    }
    let personajeResultado = personajePrincipal;
    if (personajesExtras.length > 0) {
        personajeResultado += ` (${personajesExtras.join(", ")})`;
    }

    mostrarResultado(participantes, lugar, personajeResultado, objeto, objetoRaro, formato, sentimiento, false);
}

// --- CAMBIO AQUÍ: CONEXIÓN AL WORKER ---
async function generarOnline() {
    document.getElementById("resultado").innerHTML = '<span class="cargando">Conectando con la IA...</span>';
    
    const num = parseInt(selectNum.value, 10);
    lastSelected = num;
    const { participantes, poolSorteable } = sortearParticipantes(num);
    alumnosRestantes = poolSorteable; 
    poblarSelect();
    
    // Prompt estricto para el parseo por ";"
    const prompt = "Actúa como un generador de teatro de improvisación. Tu respuesta debe ser EXCLUSIVAMENTE 6 elementos separados por punto y coma (;) sin numeración ni texto adicional. FORMATO: Lugar;Personaje;Objeto;Objeto Raro;Género/Formato;Sentimiento.";

    try {
        const response = await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (!response.ok) throw new Error('Worker falló');
        
        const data = await response.json();
        const ia_result_text = data.candidates[0].content.parts[0].text.trim();

        const elementos = ia_result_text.split(';').map(e => e.trim());

        if (elementos.length < 6) {
             throw new Error("Formato de IA incorrecto.");
        }
        
        const [lugar, personajePrincipal, objeto, objetoRaro, formato, sentimiento] = elementos;

        let personajeResultado = personajePrincipal; 
        if (participantes.length > 1) {
             personajeResultado += ` (y ${participantes.length - 1} más)`;
        }

        mostrarResultado(participantes, lugar, personajeResultado, objeto, objetoRaro, formato, sentimiento, true); 

    } catch (error) {
        console.error(error);
        document.getElementById("resultado").innerHTML = `<p style="color:red;">Fallo IA: ${error.message}. Activando respaldo Offline...</p>`;
        generarOffline();
    }
}

// ====================================================================================
// 5. FUNCIÓN DE PRESENTACIÓN Y REGENERACIÓN
// ====================================================================================

function mostrarResultado(participantes, lugar, personajeResultado, objeto, objetoRaro, formato, sentimiento, isOnline = false) {
    let aviso = "";
    if (alumnosRestantes.length === 0) {
        aviso = `<div style="color:crimson; font-weight:bold; text-align:center; margin-top:10px;">No quedan participantes. Pulsa "Reiniciar Sorteo".</div>`;
    }
    
    const modeMessage = isOnline 
        ? '<span style="color:#4CAF50; font-weight:bold;"> &nbsp;[Online 🤖]</span>'
        : '<span style="color:#5f6368; font-weight:bold;"> &nbsp;[Offline 💾]</span>';

    const btn = (categoria) => 
        `<button class="regenerate-btn" onclick="regenerarCategoria('${categoria}')" title="Regenerar Offline">🔄</button>`;

    document.getElementById("resultado").innerHTML = `
        <div id="resultado-content">
          <p><span class="category">CLASE:</span> ${selectClase.value} ${modeMessage}</p>
          <p><span class="category">👥 Participantes: </span> ${participantes.join(", ")}</p>
          <p id="lugar">${btn('lugar')}<span class="category">🌍 Lugar: </span> ${lugar}</p>
          <p id="personaje">${btn('personaje')}<span class="category">👤 Personaje: </span> ${personajeResultado}</p>
          <p id="objeto">${btn('objeto')}<span class="category">📦 Objeto: </span> ${objeto}</p>
          <p id="objetoRaro">${btn('objetoRaro')}<span class="category">✨ Objeto raro: </span> ${objetoRaro}</p>
          <p id="formato">${btn('formato')}<span class="category">🎬 Formato: </span> ${formato}</p>
          <p id="sentimiento">${btn('sentimiento')}<span class="category">💭 Sentimiento: </span> ${sentimiento}</p>
        </div>
        ${aviso}
    `;
}

function regenerarCategoria(categoria) {
    if (typeof lugares === 'undefined') return; 
    const elemento = document.getElementById(categoria);
    let nuevoValor = "";
    let prefijo = "";
    let lista = [];

    switch (categoria) {
        case 'lugar': lista = lugares; prefijo = '🌍 Lugar:'; break;
        case 'personaje': lista = personajes; prefijo = '👤 Personaje:'; break;
        case 'objeto': lista = objetos; prefijo = '📦 Objeto:'; break;
        case 'objetoRaro': lista = objetosRaros; prefijo = '✨ Objeto raro:'; break;
        case 'formato': lista = formatos; prefijo = '🎬 Formato:'; break;
        case 'sentimiento': lista = sentimientos; prefijo = '💭 Sentimiento:'; break;
        default: return; 
    }

    const btn = (cat) => `<button class="regenerate-btn" onclick="regenerarCategoria('${cat}')">🔄</button>`;
    
    if (categoria === 'personaje') {
        const participantesParrafo = document.querySelector('#resultado-content p:nth-child(2)');
        if (!participantesParrafo) return; 
        const participantesTexto = participantesParrafo.textContent.split(':').pop().trim().replace(/\s*\(.*\)$/, '');
        const numParticipantes = participantesTexto ? participantesTexto.split(',').length : 1;
        let personajePrincipal = azar(personajes);
        nuevoValor = personajePrincipal + (numParticipantes > 1 ? ` (y ${numParticipantes - 1} más)` : "");
    } else {
        nuevoValor = azar(lista);
    }
    
    elemento.innerHTML = `${btn(categoria)}<span class="category">${prefijo}</span> ${nuevoValor}`;
}

// ====================================================================================
// 6. INICIALIZACIÓN
// ====================================================================================

selectNum.addEventListener('change', () => {
    const v = parseInt(selectNum.value, 10);
    if (!isNaN(v)) lastSelected = v;
});

if (typeof ALUMNOS_POR_CLASE !== 'undefined') {
    mostrarModalAusentes();
} else {
    document.getElementById("resultado").innerHTML = "Error al cargar data.js.";
}