/* =======================================
   switch_mode.js (Versión con Observer)
   ======================================= */
document.addEventListener('DOMContentLoaded', () => {

  // --- Configuración ---
  const emojiSol = '☀️'; // Se muestra en modo oscuro
  const emojiLuna = '🌙'; // Se muestra en modo claro
  const body = document.body;
  const storageKey = 'tema';

  // --- FUNCIÓN DE ACTUALIZACIÓN ---
  // Esta función pone el emoji correcto en el botón
  function actualizarEmoji() {
    const botonTema = document.getElementById('btn-tema');
    // Si el botón no existe (ej. en el primer milisegundo), no hace nada
    if (!botonTema) return; 

    if (body.classList.contains('tema-claro')) {
      botonTema.textContent = emojiLuna;
      botonTema.title = "Cambiar a modo oscuro"; // Tooltip
    } else {
      botonTema.textContent = emojiSol;
      botonTema.title = "Cambiar a modo claro"; // Tooltip
    }
  }

  // --- PARTE 1: APLICAR TEMA GUARDADO AL CARGAR ---
  // (Esto es lo primero que pasa, antes de que se vea la página)
  const temaGuardado = localStorage.getItem(storageKey);
  if (temaGuardado === 'tema-claro') {
    body.classList.add('tema-claro');
  }
  
  // --- PARTE 2: "OBSERVAR" EL NAVBAR ---
  // Como tu navbar se carga con load_base.js (tarde),
  // tenemos que "vigilar" el contenedor hasta que aparezca.
  const navbarContenedor = document.getElementById('navbar-container');
  
  if (navbarContenedor) {
    // Creamos un "observador"
    const observer = new MutationObserver((mutationsList, observer) => {
      // Revisa si se añadieron nodos (es decir, se cargó el navbar)
      for(const mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          
          // ¡El navbar se cargó! Ahora SÍ podemos actualizar el emoji.
          actualizarEmoji();
          
          // Ya no necesitamos observar, así que nos desconectamos
          observer.disconnect();
          break;
        }
      }
    });

    // Empezamos a observar el contenedor
    observer.observe(navbarContenedor, { childList: true });
  } else {
    // Fallback por si el contenedor no existe
    actualizarEmoji();
  }

  // --- PARTE 3: EL CLIC (con Delegación de Eventos) ---
  // Escuchamos clics en TODO el body
  body.addEventListener('click', (event) => {
    
    // Usamos .closest() para ver si donde hicimos clic
    // (o su "padre" o "abuelo") es el botón #btn-tema
    const boton = event.target.closest('#btn-tema');

    // Si no hiciste clic en el botón, 'boton' será null y esto no se ejecuta
    if (boton) {
      event.preventDefault(); // ¡Sí era el botón! Evitamos el salto del href="#"
      
      // 1. Cambia el tema en el <body>
      body.classList.toggle('tema-claro');
      
      // 2. Guarda la nueva preferencia
      let temaActual = body.classList.contains('tema-claro') ? 'tema-claro' : 'tema-oscuro';
      localStorage.setItem(storageKey, temaActual);
      
      // 3. Actualiza el emoji
      actualizarEmoji();
    }
  });
});