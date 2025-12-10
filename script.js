// --- script.js (ACTUALIZADO PARA FRACCIONAR HTML) ---

// **********************************************
// 0. FUNCIÓN PARA CARGAR FRAGMENTOS HTML
// **********************************************

/**
 * Carga el contenido de un archivo HTML parcial y lo inyecta en el contenedor dado.
 * @param {string} sectionId - ID del contenedor en index.html (ej: 'content-home').
 * @param {string} filePath - Ruta del archivo HTML a cargar (ej: 'sections/home.html').
 */
async function loadSection(sectionId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Error al cargar la sección ${filePath}: ${response.statusText}`);
        }
        const html = await response.text();
        document.getElementById(sectionId).innerHTML = html;
        
        // Ejecutar funciones específicas tras cargar una sección, si es necesario.
        // Por ejemplo, para iniciar el carrusel de Bootstrap, aunque Bootstrap JS ya lo hace.
        
    } catch (error) {
        console.error("Error al cargar la sección:", error);
        document.getElementById(sectionId).innerHTML = 
            `<p class="text-danger text-center">Error al cargar el contenido. ${error.message}</p>`;
    }
}


// **********************************************
// 1. CONFIGURACIÓN INICIAL
// **********************************************

// **1.1. FECHA DEL CONTADOR**
const fechaImportante = new Date("March 15, 2023 00:00:00").getTime(); 

// **1.2. CITAS ALEATORIAS**
const citas = [
    "Tu sonrisa es mi sol en un día nublado.",
    // ... (Mantener tus citas aquí)
    "El mundo es un lugar mejor solo porque existes.",
];

// **1.3. CONFIGURACIÓN DE LA PLAYLIST**
const playlist = [
    { title: "Canción 1: Siempre Juntos", artist: "Artista Favorito", src: "canciones/cancion1.mp3" },
    // ... (Mantener tu playlist aquí)
    { title: "Canción 3: Feliz Cumpleaños", artist: "El Tema del Día", src: "canciones/cancion3.mp3" },
];

// **********************************************
// 2. VARIABLES GLOBALES DE MÚSICA
// **********************************************

let currentSongIndex = 0;
// Las referencias a elementos (audioPlayer, songTitle, etc.) se inicializarán
// en la función 'initAllFeatures' después de que el HTML haya cargado.
let audioPlayer, playPauseIcon, songTitle, playlistList;


// **********************************************
// 3. FUNCIONES PRINCIPALES
// **********************************************

/**
 * Inicializa todas las características interactivas después de cargar el HTML.
 */
function initAllFeatures() {
    // Inicializa referencias DOM después de que el HTML haya sido inyectado
    audioPlayer = document.getElementById('audio-player');
    playPauseIcon = document.getElementById('play-pause-icon');
    songTitle = document.getElementById('song-title');
    playlistList = document.getElementById('playlist-list');
    
    // Iniciar el contador y la playlist
    startCountdown();
    if (audioPlayer) { // Verifica si la sección de música se cargó correctamente
        loadPlaylist();
    }
}

// FUNCIONES DEL CONTADOR (Tiempo Juntos)
function startCountdown() {
    const x = setInterval(function() {
        // ... (Cálculo del contador se mantiene igual, usando getElementById("tiempo-juntos")) ...
        const ahora = new Date().getTime();
        const distancia = ahora - fechaImportante;
        
        const anios = Math.floor(distancia / (1000 * 60 * 60 * 24 * 365.25));
        const dias = Math.floor((distancia % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24));
        const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((distancia % (1000 * 60)) / 1000);
        
        const countdownElement = document.getElementById("tiempo-juntos");
        if (countdownElement) {
            countdownElement.innerHTML = `${anios} años, ${dias} días, ${horas} hrs, ${minutos} min, y ${segundos} seg`;
        }

        if (distancia < 0) {
            clearInterval(x);
            if (countdownElement) countdownElement.innerHTML = "¡Feliz Cumpleaños! 🎉";
        }
    }, 1000);
}


// FUNCIONES DE INTERACTIVIDAD (Citas y Confeti)
window.mostrarCitaAleatoria = function() {
    const indiceAleatorio = Math.floor(Math.random() * citas.length);
    document.getElementById("cita-aleatoria").innerHTML = `"${citas[indiceAleatorio]}"`;
}

window.lanzarConfeti = function() {
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
}


// FUNCIONES DE MÚSICA Y PLAYLIST (Las hacemos globales para que el HTML inyectado pueda llamarlas)
window.loadPlaylist = function() {
    // ... (Mismo código de loadPlaylist, ahora usando las variables globales)
    playlistList.innerHTML = ''; 
    playlist.forEach((song, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        listItem.innerHTML = `
            <div><strong>${song.title}</strong><br><small class="text-muted">${song.artist}</small></div>
            ${index === currentSongIndex ? '<span class="badge bg-danger rounded-pill">Reproduciendo</span>' : ''}
        `;
        listItem.onclick = () => window.playSong(index);
        
        if (index === currentSongIndex) {
            listItem.classList.add('current-song');
        }

        playlistList.appendChild(listItem);
    });
    if (playlist.length > 0) {
        loadSong(currentSongIndex);
    } else {
        songTitle.textContent = "No hay canciones cargadas.";
    }
}

window.loadSong = function(index) {
    currentSongIndex = index;
    audioPlayer.src = playlist[index].src;
    songTitle.textContent = `${playlist[index].title} - ${playlist[index].artist}`;
    loadPlaylist(); 
}

window.togglePlayPause = function() {
    if (audioPlayer.paused) {
        audioPlayer.play();
        audioPlayer.addEventListener('ended', window.playNext); // Vuelve a enganchar el evento ended
        playPauseIcon.className = 'bi bi-pause-fill';
    } else {
        audioPlayer.pause();
        playPauseIcon.className = 'bi bi-play-fill';
    }
}

window.playSong = function(index) {
    loadSong(index);
    audioPlayer.play();
    audioPlayer.addEventListener('ended', window.playNext);
    playPauseIcon.className = 'bi bi-pause-fill';
}

window.playNext = function() {
    const nextIndex = (currentSongIndex + 1) % playlist.length;
    playSong(nextIndex);
}

window.playPrevious = function() {
    let prevIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    playSong(prevIndex);
}

window.setVolume = function(volume) {
    audioPlayer.volume = volume;
}


// **********************************************
// 4. EJECUCIÓN INICIAL Y CARGA DE SECCIONES
// **********************************************

document.addEventListener('DOMContentLoaded', async () => {
    // Cargar todas las secciones de manera asíncrona
    await loadSection('content-home', 'sections/home.html');
    await loadSection('content-linda', 'sections/linda.html');
    await loadSection('content-mundito', 'sections/mundito.html');
    await loadSection('content-musica', 'sections/musica.html');
    await loadSection('content-recuerdos', 'sections/recuerdos.html');
    await loadSection('content-manias', 'sections/manias.html');
    await loadSection('content-gracias', 'sections/gracias.html');
    
    // Una vez que todo el contenido HTML está cargado, inicializamos la interactividad
    initAllFeatures();
});