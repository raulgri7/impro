// script.js

// ====================================================================================
// 1. CONFIGURACIÓN DE IA Y VARIABLES GLOBALES
// ====================================================================================

// --- CONFIGURACIÓN DE LA API DE GOOGLE GEMINI ---
// CLAVE API VÁLIDA INTEGRADA
const IA_API_KEY = 'AIzaSyCzEdHp8-GzOtexcjxT1I6FSv6YQpVOdVA'; 
const MODEL_NAME = 'gemini-2.5-flash';
const IA_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${IA_API_KEY}`;
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
    
    // Lógica del sorteo (Primer Sorteo, Parejas, Tríos, etc.)
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

// FUNCIÓN PRINCIPAL DE INTERRUPTOR
function generar() {
    
    const modeSwitch = document.getElementById("modeSwitch");
    if (!modeSwitch) {
        document.getElementById("resultado").innerHTML = "<strong style='color:red;'>ERROR JS CRÍTICO:</strong> No se encuentra el elemento HTML con **id='modeSwitch'**. ¡Verifica tu HTML!";
        return;
    }
    
    if (selectNum.disabled || alumnosRestantes.length === 0) return;

    if (modeSwitch.checked) {
        // En modo Online, verificamos si la clave es de ejemplo
        if (IA_API_KEY === 'AIzaSyB5crkbLAoit8e1B_6qb78zLyT3qWPw3RU') {
            document.getElementById("resultado").innerHTML = `
                <p style="color:red; font-weight:bold; text-align: left; padding: 15px; border: 1px solid red; background-color: #ffeaea;">
                    <strong style="font-size: 1.1em;">⚠️ DIAGNÓSTICO CLAVE API:</strong><br>
                    ¡La clave API de ejemplo está activa! **AIzaSyB5crkbLAoit8e1B_6qb78zLyT3qWPw3RU**<br>
                    <strong>EJECUCIÓN DETENIDA.</strong> Por favor, sustituye la clave en la línea 13 de **script.js** y vuelve a subir el código.
                </p>
            `;
            return; 
        }
        
        generarOnline();
    } else {
        generarOffline();
    }
}

// MODO OFFLINE: Lógica de sorteo de listas locales
function generarOffline() {
    if (typeof lugares === 'undefined') return;
    
    const num = parseInt(selectNum.value, 10);
    lastSelected = num;
    
    // 1. Sorteo de Participantes
    const { participantes, poolSorteable } = sortearParticipantes(num);
    alumnosRestantes = poolSorteable; 
    poblarSelect();
    
    // 2. Generación de Ideas OFFLINE
    const lugar = azar(lugares);
    const objeto = azar(objetos);
    const objetoRaro = azar(objetosRaros);
    const formato = azar(formatos);
    const sentimiento = azar(sentimientos);
    
    // Personaje (lógica de personajes múltiples OFFLINE)
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

    // 3. Mostrar Resultado
    mostrarResultado(participantes, lugar, personajeResultado, objeto, objetoRaro, formato, sentimiento, false);
}


// MODO ONLINE: Conexión a la API de IA (Con Fallback y Temperatura ajustada)
async function generarOnline() {
    document.getElementById("resultado").innerHTML = '<span class="cargando">Conectando con la IA... generando ideas únicas...</span>';
    
    const num = parseInt(selectNum.value, 10);
    lastSelected = num;

    // 1. Sorteo de Participantes
    const { participantes, poolSorteable } = sortearParticipantes(num);
    alumnosRestantes = poolSorteable; 
    poblarSelect();
    
    // 2. Construcción del Prompt (¡SIMPLIFICADO!)
    
    // INSTRUCCIÓN DE SISTEMA: Máxima obediencia al formato
    const systemInstruction = "ERES UN GENERADOR ESTRICTO DE IDEAS. TU RESPUESTA DEBE CONTENER EXCLUSIVAMENTE 6 ELEMENTOS SEPARADOS POR PUNTO Y COMA (;). NO USES INTRODUCCIONES, EXPLICACIONES O TEXTO ADICIONAL. FORMATO OBLIGATORIO: Lugar;Personaje;Objeto;Objeto Raro (descripción);Formato;Sentimiento.";

    // PROMPT DE USUARIO: Simplemente pide la generación
    const userPromptText = `
        Genera una idea única y creativa para cada una de las 6 categorías solicitadas. La respuesta debe ser apropiada para una clase de improvisación.
        
        EJEMPLO DE RESPUESTA PERFECTA: La Luna;Un astronauta jubilado;Una aspiradora;Un mapa que se desintegra al leerlo;Thriller medieval;Pánico
    `;
    
    const finalPrompt = systemInstruction + '\n\n' + userPromptText;


    try {
        const response = await fetch(IA_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                // Usamos el prompt combinado
                contents: [{ role: "user", parts: [{ text: finalPrompt }] }],
                generationConfig: { 
                    temperature: 0.6, // Ajuste para obediencia al formato
                    maxOutputTokens: 4096,
                },
                // ELIMINADO: systemInstruction
            })
        });

        // --- 3. CHECK HTTP STATUS Y ERRORES COMUNES ---
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            let errorMessage = errorData.error ? errorData.error.message : response.statusText;
            let diagnosis = `Status: ${response.status}. `;

            if (response.status === 400 || response.status === 403) {
                diagnosis += `Error de API: Revisa cuota o validez de la clave. Mensaje: ${errorMessage}`;
            } else {
                 diagnosis += `Error desconocido: ${errorMessage}`;
            }
            throw new Error(diagnosis);
        }
        
        const data = await response.json();
        let ia_result_text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "ERROR: CANDIDATO VACÍO O BLOQUEADO POR POLÍTICA DE SEGURIDAD";

        // --- 4. PARSING CHECK ---
        const elementos = ia_result_text.split(';').map(e => e.trim());

        // Si el modelo falla (incluido el error de "CANDIDATO VACÍO/BLOQUEADO"), lanza un error de formato.
        if (elementos.length !== 6 || elementos.some(e => e === '') || ia_result_text.startsWith("ERROR:")) {
             throw new Error(`Error de formato de IA. La respuesta no contiene 6 elementos separados por punto y coma (';') o uno está vacío. Respuesta de la IA: "${ia_result_text}"`);
        }
        
        const [lugar, personajePrincipal, objeto, objetoRaro, formato, sentimiento] = elementos;

        // Lógica de Personaje para Online: un principal + aviso de extras
        let personajeResultado = personajePrincipal; 
        if (participantes.length > 1) {
             personajeResultado += ` (y ${participantes.length - 1} más)`;
        }

        // 5. Mostrar Resultado
        mostrarResultado(participantes, lugar, personajeResultado, objeto, objetoRaro, formato, sentimiento, true); 

    } catch (error) {
        // Muestra el error de diagnóstico (solo en caso de fallo crítico) pero siempre cae a Offline
        document.getElementById("resultado").innerHTML = `<p style="color:red; font-weight:bold; text-align: left; padding: 15px; border: 1px solid red; background-color: #ffeaea;">
            ⚠️ **DIAGNÓSTICO AUTOMÁTICO - FALLO IA** ⚠️<br><br>
            **Motivo:** La IA falló al generar el formato o fue bloqueada. Detalles: ${error.message}.<br><br>
            Generando automáticamente en modo **Offline** como respaldo.
        </p>`;
        // FALLBACK SEGURO
        generarOffline();
    }
}


// ====================================================================================
// 5. FUNCIÓN DE PRESENTACIÓN Y REGENERACIÓN (sin cambios)
// ====================================================================================

function mostrarResultado(participantes, lugar, personajeResultado, objeto, objetoRaro, formato, sentimiento, isOnline = false) {
    let aviso = "";
    if (alumnosRestantes.length === 0) {
        aviso = `<div style="color:crimson; font-weight:bold; text-align:center; margin-top:10px;">
                    No quedan participantes. Pulsa "Reiniciar Sorteo" para volver a empezar.
                  </div>`;
    }
    
    const modeMessage = isOnline 
        ? '<span style="color:#4CAF50; font-weight:bold;"> &nbsp;[Online (IA) 🤖]</span>'
        : '<span style="color:#5f6368; font-weight:bold;"> &nbsp;[Offline 💾]</span>';

    const btn = (categoria) => 
        `<button class="regenerate-btn" onclick="regenerarCategoria('${categoria}')" title="Generar solo ${categoria} (Offline)">🔄</button>`;

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

    const btn = (cat) => 
        `<button class="regenerate-btn" onclick="regenerarCategoria('${cat}')" title="Generar solo ${cat} (Offline)">🔄</button>`;
    
    if (categoria === 'personaje') {
        const participantesParrafo = document.querySelector('#resultado-content p:nth-child(2)');
        if (!participantesParrafo) return; 

        const participantesTexto = participantesParrafo.textContent.split(':').pop().trim().replace(/\s*\(.*\)$/, '');
        const numParticipantes = participantesTexto ? participantesTexto.split(',').length : 1;

        let personajePrincipal = azar(personajes);
        let nuevoPersonaje = personajePrincipal;
        
        if (numParticipantes > 1) {
             const textoActualPersonaje = document.getElementById('personaje').textContent;
             const isOnlineFormat = textoActualPersonaje.includes('y 1 más') || textoActualPersonaje.includes('y 2 más');

             if(isOnlineFormat) {
                 nuevoPersonaje += ` (y ${numParticipantes - 1} más)`;
             } else {
                 const numPersonajesAdicionales = numParticipantes - 1;
                 let personajesExtras = [];
                 let personajesDisponibles = [...personajes].filter(p => p !== personajePrincipal); 
                 for (let i = 0; i < numPersonajesAdicionales; i++) {
                     const idx = Math.floor(Math.random() * personajesDisponibles.length);
                     personajesExtras.push(personajesDisponibles.splice(idx, 1)[0]); 
                 }
                 if (personajesExtras.length > 0) {
                     nuevoPersonaje += ` (${personajesExtras.join(", ")})`;
                 }
             }
        }
        nuevoValor = nuevoPersonaje;

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

// Inicialización de la aplicación
if (typeof ALUMNOS_POR_CLASE !== 'undefined') {
    mostrarModalAusentes();
} else {
    document.getElementById("resultado").innerHTML = "Error al inicializar la aplicación. Verifica que **data.js** esté cargado con las variables globales (usando window.nombre_variable).";
}