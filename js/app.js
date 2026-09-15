/**
 * FinGo - Inicializador Principal de la Aplicación (app.js)
 * Conecta el motor de juego, la interfaz de usuario, el sintetizador de audio,
 * el visor de pitch y gestiona los eventos de la barra superior y selector de niveles.
 */

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("game-canvas");
  if (!canvas) return;

  // 1. Instanciar Subsistemas
  const soundSynth = new SoundSynthesizer();
  const uiManager = new UIManager();
  const pitchViewer = new PitchViewer("pitch-modal-container");
  const gameEngine = new GameEngine(canvas, soundSynth, uiManager);
  const inputHandler = new InputHandler(gameEngine);

  // Hacer accesibles globalmente para eventos inline
  window.soundSynth = soundSynth;
  window.uiManager = uiManager;
  window.pitchViewer = pitchViewer;
  window.gameEngine = gameEngine;
  window.inputHandler = inputHandler;

  // 2. Control de Audio Mute
  const btnSound = document.getElementById("btn-toggle-sound");
  const updateSoundIcon = (isMuted) => {
    if (btnSound) {
      btnSound.innerHTML = isMuted ? "🔇 <span class='nav-btn-label'>Mute</span>" : "🔊 <span class='nav-btn-label'>Audio</span>";
    }
  };
  updateSoundIcon(soundSynth.isMuted);

  if (btnSound) {
    btnSound.addEventListener("click", () => {
      const isMuted = soundSynth.toggleMute();
      updateSoundIcon(isMuted);
    });
  }

  // 3. Botones de Modo de Juego en el Menú Principal
  const btnStartPlay = document.getElementById("btn-play-game");
  if (btnStartPlay) {
    btnStartPlay.addEventListener("click", () => {
      soundSynth.init();
      uiManager.hideMainMenu();
      pitchViewer.show(0);
    });
  }

  // Botón Presentación Ejecutiva / Matriz ERIC
  const btnOpenPitch = document.getElementById("btn-open-pitch");
  const btnNavPitch = document.getElementById("btn-nav-pitch");
  const openPitchDeck = () => {
    soundSynth.init();
    soundSynth.stopMusic();
    pitchViewer.show(0);
  };
  if (btnOpenPitch) btnOpenPitch.addEventListener("click", openPitchDeck);
  if (btnNavPitch) btnNavPitch.addEventListener("click", openPitchDeck);

  // Selector de Niveles
  const btnSelectLevel = document.getElementById("btn-select-level");
  const levelSelectModal = document.getElementById("level-select-modal");
  const btnCloseLevelSelect = document.getElementById("btn-close-level-select");

  if (btnSelectLevel && levelSelectModal) {
    btnSelectLevel.addEventListener("click", () => {
      levelSelectModal.classList.remove("hidden");
    });
  }

  if (btnCloseLevelSelect && levelSelectModal) {
    btnCloseLevelSelect.addEventListener("click", () => {
      levelSelectModal.classList.add("hidden");
    });
  }

  // Tarjetas del Selector de Niveles
  document.querySelectorAll(".level-card-btn").forEach(card => {
    card.addEventListener("click", (e) => {
      const targetLvl = parseInt(card.getAttribute("data-level"), 10);
      if (targetLvl >= 1 && targetLvl <= 6) {
        soundSynth.init();
        levelSelectModal.classList.add("hidden");
        uiManager.hideMainMenu();
        gameEngine.startLevel(targetLvl);
      }
    });
  });

  // Modal Cómo Jugar / Controles
  const btnHelp = document.getElementById("btn-help");
  const helpModal = document.getElementById("help-modal");
  const btnCloseHelp = document.getElementById("btn-close-help");

  if (btnHelp && helpModal) {
    btnHelp.addEventListener("click", () => helpModal.classList.remove("hidden"));
  }
  if (btnCloseHelp && helpModal) {
    btnCloseHelp.addEventListener("click", () => helpModal.classList.add("hidden"));
  }

  // Botón Pausa en HUD
  const btnPauseHud = document.getElementById("btn-hud-pause");
  if (btnPauseHud) {
    btnPauseHud.addEventListener("click", () => {
      gameEngine.togglePause();
    });
  }

  // Botón Reanudar en Modal de Pausa
  const btnResume = document.getElementById("btn-resume-game");
  if (btnResume) {
    btnResume.addEventListener("click", () => {
      gameEngine.togglePause();
    });
  }

  const btnPauseMenu = document.getElementById("btn-pause-main-menu");
  if (btnPauseMenu) {
    btnPauseMenu.addEventListener("click", () => {
      uiManager.showPauseModal(false);
      uiManager.showMainMenu();
    });
  }

  // 4. Iniciar bucle de animación
  requestAnimationFrame((t) => gameEngine.loop(t));

  console.log("🚀 FinGo Runner iniciado correctamente. Listo para desplegar en GitHub Pages.");
});
