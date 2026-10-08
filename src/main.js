import './style.css';

const quoteDatabase = [
  { id: 'q1', text: 'Date permiso para no tener todo resuelto hoy. El progreso sigue siendo progreso, por pequeño que parezca.', author: 'Amor Propio', category: 'amor_propio' },
  { id: 'q2', text: 'No te compares con el capítulo 20 de otra persona cuando tú estás en tu capítulo 1.', author: 'Crecimiento Personal', category: 'amor_propio' },
  { id: 'q3', text: 'La persona más importante con la que hablarás hoy eres tú misma. Trátate con ternura y respeto.', author: 'Fuerza Espiritual', category: 'amor_propio' },
  { id: 'q4', text: 'Poner límites no es egoísmo, es el acto de amor propio más valiente que puedes ejercer.', author: 'Sabiduría Emocional', category: 'amor_propio' },
  { id: 'q5', text: 'Eres suficiente exactamente como eres hoy, mientras sigues trabajando en quien quieres ser mañana.', author: 'Autoestima', category: 'amor_propio' },
  { id: 'q6', text: 'Las tormentas no duran para siempre. Has superado cada uno de tus días difíciles hasta hoy: tu récord es del 100%.', author: 'Superación', category: 'superacion' },
  { id: 'q7', text: 'A veces caer es necesario para recordar qué es lo que de verdad vale la pena defender al levantarse.', author: 'Resiliencia', category: 'superacion' },
  { id: 'q8', text: 'El coraje no siempre ruge. A veces es esa voz pequeña al final del día que dice: lo intentaré de nuevo mañana.', author: 'Mary Anne Radmacher', category: 'superacion' },
  { id: 'q9', text: 'No tienes que ser invencible para ser valiente; solo tienes que dar un paso más.', author: 'Fuerza Interior', category: 'superacion' },
  { id: 'q10', text: 'Detrás de tus mayores miedos siempre te espera la versión más fuerte y auténtica de ti.', author: 'Transformación', category: 'superacion' },
  { id: 'q11', text: 'Inhala paz, exhala el peso de lo que no puedes controlar. Este momento presente es todo lo que necesitas sostener.', author: 'Paz Interior', category: 'calma' },
  { id: 'q12', text: 'No tienes que responder a todas las urgencias del mundo hoy. Cuidar tu calma también es productivo.', author: 'Serenidad', category: 'calma' },
  { id: 'q13', text: 'La mente que se precipita al futuro se llena de miedos que aún no existen. Vuelve aquí, estás a salvo.', author: 'Mindfulness', category: 'calma' },
  { id: 'q14', text: 'Permítete una pausa. Descansar no significa rendirse, significa renovar fuerzas para volar más alto.', author: 'Bienestar', category: 'calma' },
  { id: 'q15', text: 'El secreto de avanzar es simplemente comenzar. No esperes el momento perfecto, haz perfecto el momento.', author: 'Mark Twain', category: 'metas' },
  { id: 'q16', text: 'La disciplina es el puente entre tus sueños de hoy y tu realidad de mañana.', author: 'Enfoque', category: 'metas' },
  { id: 'q17', text: 'Hazlo con miedo, hazlo con dudas, pero hazlo. La acción disuelve la incertidumbre.', author: 'Impulso Emprendedor', category: 'metas' },
  { id: 'q18', text: 'Pequeñas acciones constantes derrotan a las grandes intenciones esporádicas. Paso a paso.', author: 'Hábitos Ganadores', category: 'metas' },
  { id: 'q19', text: 'Cuando comienzas a agradecer lo que ya tienes, abres la puerta para que lleguen cosas aún más hermosas.', author: 'Gratitud', category: 'gratitud' },
  { id: 'q20', text: 'La felicidad no es tener todo, es saber encontrar belleza y milagros en los detalles más sencillos.', author: 'Plenitud', category: 'gratitud' }
];

const cardGradients = [
  'from-purple-900/80 via-indigo-900/70 to-slate-900 border-purple-500/30',
  'from-rose-900/80 via-purple-950 to-slate-900 border-rose-500/30',
  'from-emerald-950 via-teal-900/70 to-slate-900 border-emerald-500/30',
  'from-blue-950 via-indigo-950 to-slate-900 border-blue-500/30',
  'from-amber-950/80 via-purple-950 to-slate-900 border-amber-500/30'
];

let currentGradientIndex = 0;
let currentCategory = 'todas';
let currentQuote = null;
let savedFavorites = [];
let customAffirmations = [];
let deferredInstallPrompt = null;

let breatheTimer = null;
let breatheActive = false;

let audioCtx = null;
let rainSourceNode = null;
let rainGainNode = null;
let isRainPlaying = false;
let dropletTimer = null;

function getAppHTML() {
  return `
    <header class="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 sm:px-6">
      <div class="max-w-xl mx-auto flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="relative w-14 h-14 rounded-2xl p-0.5 bg-gradient-to-tr from-amber-400 via-purple-500 to-indigo-500 shadow-xl shadow-purple-950/70 flex-shrink-0 flex items-center justify-center">
            <img src="/logo.jpg" alt="Logo Fuerza Espiritual" class="w-full h-full object-cover rounded-xl bg-slate-950" />
          </div>

          <div>
            <h1 class="text-base sm:text-lg font-bold leading-tight text-white tracking-wide">Fuerza Espiritual</h1>
            <p class="text-[11px] text-purple-300 font-medium">Inspiración y paz para tu alma</p>
          </div>
        </div>

        <div class="flex items-center gap-1.5">
          <button id="btnInstallApp" title="Instalar en celular" class="flex items-center gap-1 text-xs font-semibold bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 rounded-xl px-2 py-1.5 transition-colors">
            <i data-lucide="download" class="w-3.5 h-3.5"></i>
            <span class="hidden sm:inline">Instalar</span>
          </button>
          <button id="btnShareApp" title="Compartir app por WhatsApp" class="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            <i data-lucide="share-2" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    </header>

    <main class="flex-1 overflow-y-auto pb-24 max-w-xl w-full mx-auto p-4 sm:p-5 space-y-5">
      <section id="view-quotes" class="tab-view block space-y-4">
        <div class="flex gap-2 overflow-x-auto no-scrollbar pb-1 pt-0.5">
          <button data-category="todas" class="cat-pill active-cat text-xs font-semibold px-3 py-1.5 rounded-full bg-purple-600 text-white whitespace-nowrap transition-all shadow-sm">
            ✨ Todas
          </button>
          <button data-category="amor_propio" class="cat-pill text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 whitespace-nowrap transition-all">
            💖 Amor Propio
          </button>
          <button data-category="superacion" class="cat-pill text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 whitespace-nowrap transition-all">
            🦁 Fuerza & Superación
          </button>
          <button data-category="calma" class="cat-pill text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 whitespace-nowrap transition-all">
            🍃 Calma & Ansiedad
          </button>
          <button data-category="metas" class="cat-pill text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 whitespace-nowrap transition-all">
            🎯 Motivación & Éxito
          </button>
          <button data-category="gratitud" class="cat-pill text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 whitespace-nowrap transition-all">
            🌸 Gratitud
          </button>
        </div>

        <div id="quoteCardContainer" class="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-purple-900/70 via-indigo-900/60 to-slate-900 border border-purple-500/30 shadow-[0_30px_80px_rgba(76,29,149,0.45)] flex flex-col justify-between">
          <div class="absolute -top-16 -right-16 w-44 h-44 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute -bottom-16 -left-16 w-44 h-44 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

          <div class="relative z-10 flex items-center justify-between">
            <span id="quoteCardCategory" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-purple-200 border border-white/10 backdrop-blur-md">
              ✨ Inspiración Diaria
            </span>

            <div class="flex items-center gap-1">
              <button id="btnToggleTheme" title="Cambiar color de fondo" class="p-2 text-purple-200/80 hover:text-white bg-white/5 hover:bg-white/10 rounded-full backdrop-blur-md transition-colors">
                <i data-lucide="palette" class="w-4 h-4"></i>
              </button>
              <button id="btnVoiceListen" title="Escuchar frase con voz" class="p-2 text-purple-200/80 hover:text-white bg-white/5 hover:bg-white/10 rounded-full backdrop-blur-md transition-colors">
                <i data-lucide="volume-2" class="w-4 h-4"></i>
              </button>
            </div>
          </div>

          <div class="relative z-10 my-6 text-center">
            <i data-lucide="quote" class="w-7 h-7 text-purple-400/40 mx-auto mb-3"></i>
            <p id="quoteCardText" class="font-serif-quote italic text-xl sm:text-2xl font-medium text-purple-50 leading-relaxed drop-shadow-sm">
              "Cargando tu frase motivacional..."
            </p>
            <p id="quoteCardAuthor" class="mt-4 text-xs sm:text-sm font-semibold text-purple-300 tracking-wider uppercase">
              — Autor
            </p>
          </div>

          <div class="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between gap-2">
            <button id="btnFavQuote" class="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all active:scale-95 backdrop-blur-md">
              <i id="favIcon" data-lucide="heart" class="w-4 h-4"></i>
              <span id="favText">Guardar</span>
            </button>

            <div class="flex items-center gap-1.5">
              <button id="btnShareQuote" class="flex items-center gap-1 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-all active:scale-95 shadow-lg shadow-emerald-900/30">
                <i data-lucide="message-circle" class="w-4 h-4"></i>
                <span>WhatsApp</span>
              </button>

              <button id="btnDownloadQuote" title="Descargar como imagen para Estados" class="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95 backdrop-blur-md">
                <i data-lucide="download" class="w-4 h-4"></i>
              </button>
            </div>
          </div>
        </div>

        <button id="btnRandomQuote" class="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold py-3.5 px-5 rounded-2xl shadow-lg shadow-purple-900/40 transition-all active:scale-[0.99] flex items-center justify-center gap-2">
          <i data-lucide="sparkle" class="w-4 h-4 animate-spin" style="animation-duration: 4s;"></i>
          <span>Descubrir Otra Frase</span>
        </button>

        <div class="pt-2">
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
            <i data-lucide="compass" class="w-3.5 h-3.5 text-purple-400"></i>
            ¿Qué necesita tu corazón hoy?
          </h3>
          <div class="grid grid-cols-2 gap-2.5">
            <button data-mood="ansiedad" class="mood-btn p-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-purple-500/40 rounded-xl text-left transition-all group">
              <span class="text-xl mb-1 block">🌿</span>
              <strong class="text-xs text-slate-200 block group-hover:text-purple-300">Tengo ansiedad o miedo</strong>
              <span class="text-[10px] text-slate-400">Paz mental y tranquilidad</span>
            </button>

            <button data-mood="cansancio" class="mood-btn p-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-purple-500/40 rounded-xl text-left transition-all group">
              <span class="text-xl mb-1 block">🔋</span>
              <strong class="text-xs text-slate-200 block group-hover:text-purple-300">Me siento agotada/o</strong>
              <span class="text-[10px] text-slate-400">Recarga de energía y ánimo</span>
            </button>

            <button data-mood="dudas" class="mood-btn p-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-purple-500/40 rounded-xl text-left transition-all group">
              <span class="text-xl mb-1 block">💎</span>
              <strong class="text-xs text-slate-200 block group-hover:text-purple-300">Dudo de mi capacidad</strong>
              <span class="text-[10px] text-slate-400">Autoestima y valor personal</span>
            </button>

            <button data-mood="arrancar" class="mood-btn p-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-purple-500/40 rounded-xl text-left transition-all group">
              <span class="text-xl mb-1 block">🚀</span>
              <strong class="text-xs text-slate-200 block group-hover:text-purple-300">Necesito empezar ya</strong>
              <span class="text-[10px] text-slate-400">Disciplina y enfoque</span>
            </button>
          </div>
        </div>
      </section>

      <section id="view-calm" class="tab-view hidden space-y-4">
        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-5">
          <div>
            <span class="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Respiración Guiada 4-4-4
            </span>
            <h2 class="text-lg font-bold text-white mt-2">Pausa para tu Mente</h2>
            <p class="text-xs text-slate-400 max-w-xs mx-auto">Regálate 1 minuto. Inhala escuchando el aire al crecer el círculo, retén y exhala suavemente al vaciarte.</p>
          </div>

          <div class="py-4 flex flex-col items-center justify-center">
            <div class="relative w-48 h-48 flex items-center justify-center">
              <div id="breathePulseRing" class="absolute inset-0 rounded-full bg-purple-500/20 blur-xl"></div>
              <div id="breatheMainCircle" class="w-36 h-36 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-500 to-emerald-400 flex flex-col items-center justify-center text-white shadow-[0_20px_60px_rgba(120,119,198,0.45)] transition-transform duration-1000 ease-in-out">
                <span id="breathePhaseText" class="text-sm font-extrabold uppercase tracking-widest">Inhala</span>
                <span id="breatheSecondsCount" class="text-2xl font-black mt-0.5">4</span>
              </div>
            </div>
          </div>

          <div class="flex flex-col items-center gap-3">
            <button id="btnStartBreath" class="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2">
              <i id="breatheIcon" data-lucide="play" class="w-4 h-4"></i>
              <span id="breatheBtnText">Iniciar Respiración</span>
            </button>
          </div>

          <div class="pt-4 border-t border-slate-800 mt-2">
            <div class="flex items-center justify-between bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3.5">
              <div class="flex items-center gap-2.5 text-left">
                <div class="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <i data-lucide="cloud-rain" class="w-5 h-5"></i>
                </div>
                <div>
                  <h4 class="text-xs font-bold text-slate-200">Lluvia en el Bosque</h4>
                  <p class="text-[11px] text-slate-400">Sonido natural y relajante</p>
                </div>
              </div>

              <button id="btnToggleRain" class="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 transition-all active:scale-95">
                <i id="rainBtnIcon" data-lucide="play" class="w-3.5 h-3.5"></i>
                <span id="rainBtnText">Escuchar</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="view-favorites" class="tab-view hidden space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-base font-bold text-white">Tus Frases Guardadas</h2>
            <p class="text-xs text-slate-400">Palabras que te inspiran en tus momentos clave.</p>
          </div>
          <span id="favCountBadge" class="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
            0 frases
          </span>
        </div>

        <div id="favoritesListContainer" class="space-y-3"></div>
      </section>

      <section id="view-custom" class="tab-view hidden space-y-4">
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div>
            <h2 class="text-base font-bold text-white">Escribe tu Propia Afirmación</h2>
            <p class="text-xs text-slate-400">Escribe las palabras que hoy necesitas repetirte a ti misma/o.</p>
          </div>

          <div class="space-y-3">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Tu frase o afirmación positiva *</label>
              <textarea id="customQuoteInput" rows="3" placeholder="Ej. Hoy elijo confiar en mi camino y recordar lo fuerte que soy..." class="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"></textarea>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Firma / Autor (o déjalo como 'Yo')</label>
              <input type="text" id="customAuthorInput" placeholder="Ej. Mi yo del futuro, Celeste..." class="w-full text-xs sm:text-sm px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
            </div>
          </div>

          <button id="btnSaveCustomAffirmation" class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-purple-900/30">
            <i data-lucide="plus-circle" class="w-4 h-4"></i> Guardar mi afirmación
          </button>
        </div>

        <div id="customListContainer" class="space-y-3"></div>
      </section>
    </main>

    <nav class="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-3 py-2">
      <div class="max-w-md mx-auto grid grid-cols-4 gap-1">
        <button data-tab="quotes" class="nav-tab-btn flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-purple-400 font-semibold transition-all">
          <i data-lucide="sparkles" class="w-5 h-5 mb-0.5"></i>
          <span class="text-[10px]">Frases</span>
        </button>
        <button data-tab="calm" class="nav-tab-btn flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-slate-400 font-medium hover:text-white transition-all">
          <i data-lucide="wind" class="w-5 h-5 mb-0.5"></i>
          <span class="text-[10px]">Calma</span>
        </button>
        <button data-tab="favorites" class="nav-tab-btn flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-slate-400 font-medium hover:text-white transition-all">
          <i data-lucide="heart" class="w-5 h-5 mb-0.5"></i>
          <span class="text-[10px]">Favoritas</span>
        </button>
        <button data-tab="custom" class="nav-tab-btn flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-slate-400 font-medium hover:text-white transition-all">
          <i data-lucide="feather" class="w-5 h-5 mb-0.5"></i>
          <span class="text-[10px]">Escribir</span>
        </button>
      </div>
    </nav>
  `;
}

function renderApp() {
  const app = document.getElementById('app');
  app.innerHTML = getAppHTML();
  setupEvents();
  initAppState();
}

function setupEvents() {
  document.querySelectorAll('.cat-pill').forEach((button) => {
    button.addEventListener('click', () => {
      currentCategory = button.dataset.category;
      document.querySelectorAll('.cat-pill').forEach((btn) => {
        btn.classList.remove('bg-purple-600', 'text-white');
        btn.classList.add('bg-slate-800', 'text-slate-300');
      });
      button.classList.remove('bg-slate-800', 'text-slate-300');
      button.classList.add('bg-purple-600', 'text-white');
      generateRandomQuote(true);
    });
  });

  document.querySelectorAll('.mood-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const mood = button.dataset.mood;
      switchTab('quotes');
      let category = 'calma';
      if (mood === 'ansiedad') category = 'calma';
      else if (mood === 'cansancio') category = 'superacion';
      else if (mood === 'dudas') category = 'amor_propio';
      else if (mood === 'arrancar') category = 'metas';

      currentCategory = category;
      document.querySelectorAll('.cat-pill').forEach((btn) => {
        btn.classList.remove('bg-purple-600', 'text-white');
        btn.classList.add('bg-slate-800', 'text-slate-300');
      });

      const selected = document.querySelector(`.cat-pill[data-category="${category}"]`);
      if (selected) {
        selected.classList.remove('bg-slate-800', 'text-slate-300');
        selected.classList.add('bg-purple-600', 'text-white');
      }

      generateRandomQuote(true);
      showToast('Seleccionamos una frase especialmente para este momento');
    });
  });

  document.getElementById('btnInstallApp').addEventListener('click', handleInstallApp);
  document.getElementById('btnShareApp').addEventListener('click', shareAppWhatsApp);
  document.getElementById('btnRandomQuote').addEventListener('click', () => generateRandomQuote(true));
  document.getElementById('btnToggleTheme').addEventListener('click', toggleCardTheme);
  document.getElementById('btnVoiceListen').addEventListener('click', readQuoteAloud);
  document.getElementById('btnFavQuote').addEventListener('click', toggleCurrentFavorite);
  document.getElementById('btnShareQuote').addEventListener('click', shareQuoteWhatsApp);
  document.getElementById('btnDownloadQuote').addEventListener('click', downloadQuoteImage);
  document.getElementById('btnStartBreath').addEventListener('click', toggleBreatheGuide);
  document.getElementById('btnToggleRain').addEventListener('click', toggleRainSound);
  document.getElementById('btnSaveCustomAffirmation').addEventListener('click', saveCustomAffirmation);

  document.querySelectorAll('.nav-tab-btn').forEach((button) => {
    button.addEventListener('click', () => {
      switchTab(button.dataset.tab);
    });
  });

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
  });
}

function initAppState() {
  const storedFavs = localStorage.getItem('fuerza_espiritual_favorites');
  if (storedFavs) {
    try {
      savedFavorites = JSON.parse(storedFavs);
    } catch (error) {
      savedFavorites = [];
    }
  }

  const storedCustom = localStorage.getItem('fuerza_espiritual_custom');
  if (storedCustom) {
    try {
      customAffirmations = JSON.parse(storedCustom);
    } catch (error) {
      customAffirmations = [];
    }
  }

  if (typeof lucide !== 'undefined') lucide.createIcons();
  generateRandomQuote(false);
  renderFavoritesList();
  renderCustomList();
  switchTab('quotes');
}

function getAllAvailableQuotes() {
  return [...quoteDatabase, ...customAffirmations];
}

function generateRandomQuote(animate = true) {
  let pool = getAllAvailableQuotes();
  if (currentCategory !== 'todas') {
    pool = pool.filter((quote) => quote.category === currentCategory);
  }
  if (pool.length === 0) {
    pool = quoteDatabase;
  }

  if (currentQuote && pool.length > 1) {
    pool = pool.filter((quote) => quote.id !== currentQuote.id);
  }

  const selected = pool[Math.floor(Math.random() * pool.length)];
  displayQuote(selected, animate);
}

function displayQuote(quote, animate = true) {
  currentQuote = quote;
  const textEl = document.getElementById('quoteCardText');

  if (animate) {
    textEl.classList.add('opacity-0', 'scale-95');
    setTimeout(() => {
      updateQuoteCardContent(quote);
      textEl.classList.remove('opacity-0', 'scale-95');
    }, 180);
  } else {
    updateQuoteCardContent(quote);
  }
}

function updateQuoteCardContent(quote) {
  const textEl = document.getElementById('quoteCardText');
  const authorEl = document.getElementById('quoteCardAuthor');
  const categoryEl = document.getElementById('quoteCardCategory');

  textEl.textContent = `"${quote.text}"`;
  authorEl.textContent = `— ${quote.author}`;

  const catNames = {
    amor_propio: '💖 Amor Propio',
    superacion: '🦁 Superación',
    calma: '🍃 Calma & Ansiedad',
    metas: '🎯 Motivación',
    gratitud: '🌸 Gratitud',
    propia: '✍️ Afirmación Personal'
  };

  categoryEl.textContent = catNames[quote.category] || '✨ Fuerza Espiritual';

  updateFavButtonState();
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function toggleCardTheme() {
  currentGradientIndex = (currentGradientIndex + 1) % cardGradients.length;
  const container = document.getElementById('quoteCardContainer');
  container.className = `relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br ${cardGradients[currentGradientIndex]} border shadow-2xl shadow-purple-950/50 flex flex-col justify-between`;
}

function updateFavButtonState() {
  if (!currentQuote) return;

  const icon = document.getElementById('favIcon');
  const text = document.getElementById('favText');

  const isFav = savedFavorites.some((item) => item.id === currentQuote.id || item.text === currentQuote.text);

  if (isFav) {
    icon.classList.add('text-rose-400', 'fill-rose-400');
    text.textContent = 'Guardada';
  } else {
    icon.classList.remove('text-rose-400', 'fill-rose-400');
    text.textContent = 'Guardar';
  }
}

function toggleCurrentFavorite() {
  if (!currentQuote) return;

  const index = savedFavorites.findIndex((item) => item.id === currentQuote.id || item.text === currentQuote.text);

  if (index >= 0) {
    savedFavorites.splice(index, 1);
    showToast('Frase eliminada de favoritas');
  } else {
    savedFavorites.unshift(currentQuote);
    showToast('¡Frase guardada en tus favoritas! ❤️', 'success');
  }

  localStorage.setItem('fuerza_espiritual_favorites', JSON.stringify(savedFavorites));
  updateFavButtonState();
  renderFavoritesList();
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function renderFavoritesList() {
  const container = document.getElementById('favoritesListContainer');
  const badge = document.getElementById('favCountBadge');

  if (!container || !badge) return;

  badge.textContent = `${savedFavorites.length} frase${savedFavorites.length === 1 ? '' : 's'}`;

  if (savedFavorites.length === 0) {
    container.innerHTML = `
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
        <i data-lucide="heart-off" class="w-10 h-10 mx-auto mb-2 text-slate-600"></i>
        <p class="text-sm font-semibold text-slate-300">Aún no tienes frases guardadas</p>
        <p class="text-xs text-slate-500 mt-1">Toca el botón "Guardar" en la frase que te inspire para tenerla siempre a mano.</p>
      </div>
    `;
    if (typeof lucide !== 'undefined') lucide.createIcons();
    return;
  }

  container.innerHTML = '';

  savedFavorites.forEach((fav, index) => {
    const item = document.createElement('div');
    item.className = 'bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 relative';

    item.innerHTML = `
      <p class="font-serif-quote italic text-sm sm:text-base text-slate-200">"${fav.text}"</p>
      <div class="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
        <span class="font-semibold text-purple-400">— ${fav.author}</span>
        <div class="flex items-center gap-2">
          <button data-share-fav="${encodeURIComponent(fav.text)}|${encodeURIComponent(fav.author)}" class="text-emerald-400 hover:text-emerald-300 p-1" title="Compartir en WhatsApp">
            <i data-lucide="message-circle" class="w-4 h-4"></i>
          </button>
          <button data-remove-fav="${index}" class="text-slate-500 hover:text-rose-400 p-1" title="Eliminar de favoritos">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    `;

    item.querySelector('[data-share-fav]').addEventListener('click', (event) => {
      const value = event.currentTarget.dataset.shareFav;
      const [text, author] = value.split('|');
      shareSpecificQuote(text, author);
    });

    item.querySelector('[data-remove-fav]').addEventListener('click', () => {
      removeFavorite(index);
    });

    container.appendChild(item);
  });

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function removeFavorite(index) {
  savedFavorites.splice(index, 1);
  localStorage.setItem('fuerza_espiritual_favorites', JSON.stringify(savedFavorites));
  renderFavoritesList();
  updateFavButtonState();
  showToast('Eliminada de favoritos');
}

function readQuoteAloud() {
  if (!('speechSynthesis' in window)) {
    showToast('Tu navegador no admite lectura de voz', 'info');
    return;
  }

  const utterance = new SpeechSynthesisUtterance(`${currentQuote.text}. ${currentQuote.author}`);
  utterance.lang = 'es-ES';
  utterance.rate = 0.88;
  utterance.pitch = 1.1;

  const voices = window.speechSynthesis.getVoices();
  const spanishVoice = voices.find((voice) => voice.lang.startsWith('es'));
  if (spanishVoice) utterance.voice = spanishVoice;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
  showToast('Reproduciendo frase con voz...');
}

function shareSpecificQuote(textEncoded, authorEncoded) {
  const text = decodeURIComponent(textEncoded);
  const author = decodeURIComponent(authorEncoded);
  const message = encodeURIComponent(`✨ *Fuerza Espiritual*\n\n"${text}"\n\n— *${author}*\n\n🌿 _Inspiración y fuerza para cada día._`);
  window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
}

function shareQuoteWhatsApp() {
  if (!currentQuote) return;
  shareSpecificQuote(encodeURIComponent(currentQuote.text), encodeURIComponent(currentQuote.author));
}

function shareAppWhatsApp() {
  const url = window.location.href;
  const msg = encodeURIComponent(`✨ Te comparto esta aplicación de calma, motivación y autoayuda: *Fuerza Espiritual* ${url}`);
  window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
}

function downloadQuoteImage() {
  if (!currentQuote) return;
  showToast('Generando tarjeta para tus estados...');

  const canvas = document.getElementById('quoteCanvas');
  const ctx = canvas.getContext('2d');

  canvas.width = 1080;
  canvas.height = 1920;

  const gradient = ctx.createLinearGradient(0, 0, 1080, 1920);
  gradient.addColorStop(0, '#1e1b4b');
  gradient.addColorStop(0.45, '#2e1065');
  gradient.addColorStop(1, '#09090b');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1080, 1920);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.beginPath();
  ctx.arc(200, 300, 250, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(900, 1600, 300, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = 'bold 38px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#facc15';
  ctx.fillText('✨ FUERZA ESPIRITUAL ✨', 540, 480);

  ctx.font = 'italic 52px serif';
  ctx.fillStyle = '#ffffff';

  const words = `"${currentQuote.text}"`.split(' ');
  let line = '';
  const lines = [];
  const maxWidth = 860;
  const lineHeight = 80;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && i > 0) {
      lines.push(line);
      line = words[i] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line);

  const totalBlockHeight = lines.length * lineHeight;
  let startY = 960 - totalBlockHeight / 2;

  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], 540, startY + i * lineHeight);
  }

  ctx.font = 'bold 40px sans-serif';
  ctx.fillStyle = '#d8b4fe';
  ctx.fillText(`— ${currentQuote.author}`, 540, startY + totalBlockHeight + 70);

  ctx.font = '30px sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.fillText('Inspiración y fuerza para cada día', 540, 1720);

  const link = document.createElement('a');
  link.download = `fuerza_espiritual_${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();

  showToast('¡Imagen descargada! Lista para tus estados 📸', 'success');
}

function saveCustomAffirmation() {
  const text = document.getElementById('customQuoteInput').value.trim();
  let author = document.getElementById('customAuthorInput').value.trim();

  if (!text) {
    showToast('Escribe una afirmación antes de guardar', 'error');
    return;
  }

  if (!author) author = 'Mi afirmación';

  const newAffirmation = {
    id: 'cust_' + Date.now(),
    text,
    author,
    category: 'propia'
  };

  customAffirmations.unshift(newAffirmation);
  localStorage.setItem('fuerza_espiritual_custom', JSON.stringify(customAffirmations));

  document.getElementById('customQuoteInput').value = '';
  document.getElementById('customAuthorInput').value = '';

  renderCustomList();
  showToast('¡Tu afirmación ha sido guardada!', 'success');
}

function renderCustomList() {
  const container = document.getElementById('customListContainer');
  if (!container) return;

  if (customAffirmations.length === 0) {
    container.innerHTML = `
      <p class="text-xs text-slate-500 italic text-center py-3">Aún no has escrito tus propias afirmaciones.</p>
    `;
    return;
  }

  container.innerHTML = '<h3 class="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Tus afirmaciones escritas</h3>';

  customAffirmations.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2';

    card.innerHTML = `
      <p class="text-xs sm:text-sm text-purple-100 font-medium italic">"${item.text}"</p>
      <div class="flex items-center justify-between text-[11px] text-slate-400 pt-1">
        <span>— ${item.author}</span>
        <div class="flex items-center gap-2">
          <button data-show-custom="${item.id}" class="text-purple-400 hover:underline">Ver en tarjeta</button>
          <button data-delete-custom="${index}" class="text-slate-500 hover:text-rose-400">Eliminar</button>
        </div>
      </div>
    `;

    card.querySelector('[data-show-custom]').addEventListener('click', () => {
      const found = customAffirmations.find((affirmation) => affirmation.id === item.id);
      if (found) {
        switchTab('quotes');
        displayQuote(found, true);
      }
    });

    card.querySelector('[data-delete-custom]').addEventListener('click', () => {
      deleteCustom(index);
    });

    container.appendChild(card);
  });
}

function deleteCustom(index) {
  customAffirmations.splice(index, 1);
  localStorage.setItem('fuerza_espiritual_custom', JSON.stringify(customAffirmations));
  renderCustomList();
  showToast('Afirmación eliminada');
}

function toggleBreatheGuide() {
  const btnText = document.getElementById('breatheBtnText');
  const icon = document.getElementById('breatheIcon');
  const circle = document.getElementById('breatheMainCircle');
  const phase = document.getElementById('breathePhaseText');
  const counter = document.getElementById('breatheSecondsCount');

  if (breatheActive) {
    clearInterval(breatheTimer);
    breatheActive = false;
    btnText.textContent = 'Iniciar Respiración';
    icon.setAttribute('data-lucide', 'play');
    phase.textContent = 'Listo';
    counter.textContent = '4';
    circle.style.transform = 'scale(1)';
    if (typeof lucide !== 'undefined') lucide.createIcons();
    return;
  }

  breatheActive = true;
  btnText.textContent = 'Pausar';
  icon.setAttribute('data-lucide', 'pause');
  if (typeof lucide !== 'undefined') lucide.createIcons();

  let currentPhase = 'inhale';
  let sec = 4;

  playBreatheAirSound('inhale');

  function updateCycle() {
    counter.textContent = sec;

    if (currentPhase === 'inhale') {
      phase.textContent = 'Inhala...';
      circle.style.transform = 'scale(1.35)';
    } else if (currentPhase === 'hold') {
      phase.textContent = 'Sostén...';
    } else if (currentPhase === 'exhale') {
      phase.textContent = 'Exhala...';
      circle.style.transform = 'scale(1)';
    }

    sec--;

    if (sec < 0) {
      sec = 4;

      if (currentPhase === 'inhale') {
        currentPhase = 'hold';
      } else if (currentPhase === 'hold') {
        currentPhase = 'exhale';
        playBreatheAirSound('exhale');
      } else if (currentPhase === 'exhale') {
        currentPhase = 'inhale';
        playBreatheAirSound('inhale');
      }
    }
  }

  updateCycle();
  breatheTimer = setInterval(updateCycle, 1000);
}

function playBreatheAirSound(type) {
  try {
    const ctx = getAudioContext();
    const duration = 3.8;
    const bufferSize = ctx.sampleRate * duration;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    if (type === 'inhale') {
      filter.type = 'bandpass';
      filter.Q.setValueAtTime(2.0, now);
      filter.frequency.setValueAtTime(320, now);
      filter.frequency.exponentialRampToValueAtTime(1100, now + duration);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.35, now + duration * 0.75);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    } else {
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(280, now + duration);

      gain.gain.setValueAtTime(0.32, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    }

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + duration);
  } catch (error) {
    console.warn('Audio respiración:', error);
  }
}

function getAudioContext() {
  if (!audioCtx) {
    const AudioClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioClass();
  }

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  return audioCtx;
}

function toggleRainSound() {
  if (isRainPlaying) {
    stopRainSound();
  } else {
    startRainSound();
  }
}

function startRainSound() {
  try {
    const ctx = getAudioContext();
    isRainPlaying = true;

    const bufferSize = ctx.sampleRate * 3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555;
      b1 = 0.99332 * b1 + white * 0.0750;
      b2 = 0.96900 * b2 + white * 0.1538;
      b3 = 0.86650 * b3 + white * 0.3104;
      b4 = 0.55000 * b4 + white * 0.5329;
      data[i] = (b0 + b1 + b2 + b3 + b4) * 0.05;
    }

    rainSourceNode = ctx.createBufferSource();
    rainSourceNode.buffer = buffer;
    rainSourceNode.loop = true;

    const rainFilter = ctx.createBiquadFilter();
    rainFilter.type = 'lowpass';
    rainFilter.frequency.setValueAtTime(1400, ctx.currentTime);

    rainGainNode = ctx.createGain();
    rainGainNode.gain.setValueAtTime(0.001, ctx.currentTime);
    rainGainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 1.2);

    rainSourceNode.connect(rainFilter);
    rainFilter.connect(rainGainNode);
    rainGainNode.connect(ctx.destination);
    rainSourceNode.start(0);

    dropletTimer = setInterval(() => {
      if (!isRainPlaying) return;
      playRainDroplet();
    }, 220);

    updateRainBtnUI(true);
    showToast('🌧️ Lluvia en el bosque activada', 'success');
  } catch (error) {
    console.error('Error lluvia:', error);
  }
}

function playRainDroplet() {
  if (!isRainPlaying || !audioCtx) return;

  try {
    const osc = audioCtx.createOscillator();
    const dropGain = audioCtx.createGain();
    const baseFreq = 800 + Math.random() * 900;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.4, audioCtx.currentTime + 0.04);

    dropGain.gain.setValueAtTime(0.02 + Math.random() * 0.02, audioCtx.currentTime);
    dropGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.05);

    osc.connect(dropGain);
    dropGain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.06);
  } catch (error) {
    // Silencio
  }
}

function stopRainSound() {
  isRainPlaying = false;

  if (dropletTimer) {
    clearInterval(dropletTimer);
    dropletTimer = null;
  }

  if (rainGainNode && audioCtx) {
    rainGainNode.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.6);
    setTimeout(() => {
      if (rainSourceNode) {
        try {
          rainSourceNode.stop();
          rainSourceNode.disconnect();
        } catch (error) {
          // nada
        }
        rainSourceNode = null;
      }
    }, 650);
  }

  updateRainBtnUI(false);
  showToast('Lluvia pausada');
}

function updateRainBtnUI(isPlaying) {
  const btn = document.getElementById('btnToggleRain');
  const text = document.getElementById('rainBtnText');
  const icon = document.getElementById('rainBtnIcon');

  if (!btn || !text || !icon) return;

  if (isPlaying) {
    btn.classList.add('bg-rose-500/20', 'text-rose-300', 'border-rose-500/40');
    btn.classList.remove('text-emerald-400', 'border-emerald-500/30');
    text.textContent = 'Pausar';
    icon.setAttribute('data-lucide', 'pause');
  } else {
    btn.classList.remove('bg-rose-500/20', 'text-rose-300', 'border-rose-500/40');
    btn.classList.add('text-emerald-400', 'border-emerald-500/30');
    text.textContent = 'Escuchar';
    icon.setAttribute('data-lucide', 'play');
  }

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function switchTab(tabId) {
  document.querySelectorAll('.tab-view').forEach((el) => el.classList.add('hidden'));
  document.querySelectorAll('.nav-tab-btn').forEach((button) => {
    button.classList.remove('text-purple-400', 'font-semibold');
    button.classList.add('text-slate-400', 'font-medium');
  });

  const target = document.getElementById(`view-${tabId}`);
  if (target) target.classList.remove('hidden');

  const currentButton = document.querySelector(`.nav-tab-btn[data-tab="${tabId}"]`);
  if (currentButton) {
    currentButton.classList.remove('text-slate-400', 'font-medium');
    currentButton.classList.add('text-purple-400', 'font-semibold');
  }

  if (tabId === 'favorites') renderFavoritesList();
  if (tabId === 'custom') renderCustomList();

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  const bg = type === 'error'
    ? 'bg-rose-950/90 text-rose-200 border border-rose-800'
    : type === 'success'
      ? 'bg-emerald-950/90 text-emerald-200 border border-emerald-800'
      : 'bg-slate-900/90 text-slate-100 border border-slate-700';

  toast.className = `${bg} backdrop-blur-md px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 transform transition-all duration-300 translate-y-2 opacity-0 pointer-events-none`;

  const icon = type === 'error' ? 'alert-circle' : type === 'success' ? 'check' : 'sparkles';
  toast.innerHTML = `<i data-lucide="${icon}" class="w-4 h-4"></i><span>${message}</span>`;

  container.appendChild(toast);

  if (typeof lucide !== 'undefined') lucide.createIcons();

  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function handleInstallApp() {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    deferredInstallPrompt.userChoice.then(() => {
      deferredInstallPrompt = null;
    });
    return;
  }

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  if (isIOS) {
    showToast('En iPhone: toca "Compartir" y luego "Agregar a Inicio" 📲');
  } else {
    showToast('En Android: usa el menú del navegador y elige "Instalar aplicación" 📲');
  }
}

renderApp();
