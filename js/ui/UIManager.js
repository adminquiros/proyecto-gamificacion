/**
 * FinGo - Gestor de Interfaz de Usuario (UIManager)
 * Administra el HUD del juego, barras de progreso, vidas, modales de pausa,
 * game over, alertas educativas al colisionar y menús principales.
 */

class UIManager {
  constructor() {
    // Elementos del HUD
    this.hudScore = document.getElementById("hud-score");
    this.hudCoins = document.getElementById("hud-coins");
    this.hudLevel = document.getElementById("hud-level");
    this.hudProgressBar = document.getElementById("hud-progress-fill");
    this.hudProgressText = document.getElementById("hud-progress-text");
    this.hudLivesContainer = document.getElementById("hud-lives");
    this.hudPowerups = document.getElementById("hud-powerups");

    // Modales y Vistas
    this.mainMenu = document.getElementById("main-menu");
    this.pauseModal = document.getElementById("pause-modal");
    this.gameOverModal = document.getElementById("game-over-modal");
    this.victoryModal = document.getElementById("victory-modal");
    this.toastContainer = document.getElementById("toast-container");
    this.eduAlertModal = document.getElementById("edu-alert-modal");
    this.levelBanner = document.getElementById("level-intro-banner");

    // Submódulo de Hitos Académicos
    this.academicModal = new AcademicModal("academic-modal-container", (nextLvl) => {
      if (window.gameEngine) {
        window.gameEngine.nextLevel();
      }
    });

    this.toastTimeout = null;
  }

  updateHUD(state) {
    if (this.hudScore) this.hudScore.textContent = Number(state.score).toLocaleString("es-CO");
    if (this.hudCoins) this.hudCoins.textContent = state.coins;
    if (this.hudLevel) this.hudLevel.textContent = `NIVEL ${state.level}`;

    if (this.hudProgressBar) {
      this.hudProgressBar.style.width = `${state.progress}%`;
    }
    if (this.hudProgressText) {
      this.hudProgressText.textContent = `${Math.round(state.progress)}%`;
    }

    // Actualizar corazones (4 vidas)
    if (this.hudLivesContainer) {
      let heartsHtml = "";
      const totalLives = state.maxLives || 4;
      for (let i = 0; i < totalLives; i++) {
        if (i < state.lives) {
          heartsHtml += `<span class="heart active">❤️</span>`;
        } else {
          heartsHtml += `<span class="heart empty">🖤</span>`;
        }
      }
      this.hudLivesContainer.innerHTML = heartsHtml;
    }

    // Powerups activos
    if (this.hudPowerups) {
      let powerupsHtml = "";
      if (state.hasShield) {
        powerupsHtml += `<span class="powerup-badge shield">🛡️ Escudo</span>`;
      }
      if (state.multiplier > 1) {
        powerupsHtml += `<span class="powerup-badge mult">⚡ 2x Avalancha</span>`;
      }
      this.hudPowerups.innerHTML = powerupsHtml;
    }
  }

  updateSidePanels(levelData, score = 0, coins = 0) {
    if (!levelData) return;

    const leftBadge = document.getElementById("side-left-badge");
    const leftTitle = document.getElementById("side-left-title");
    const leftDesc = document.getElementById("side-left-desc");
    const threatsList = document.getElementById("side-threats-list");

    if (leftBadge) leftBadge.textContent = `${levelData.badge} · NIVEL ${levelData.levelNumber}`;
    if (leftTitle) leftTitle.textContent = levelData.title;
    if (leftDesc) leftDesc.textContent = levelData.summary;

    if (threatsList && typeof OBSTACLES_DATA !== "undefined") {
      const levelKey = `level${levelData.levelNumber}`;
      const threats = OBSTACLES_DATA[levelKey] || [];
      threatsList.innerHTML = threats.map(t => `
        <div class="side-threat-item" style="border-left: 3px solid ${t.color}">
          <span class="threat-icon">${t.icon}</span>
          <div class="threat-info">
            <strong>${t.name}</strong>
            <small>Evasión: ${t.dodgeType === 'slide' ? 'Deslizarse (▼)' : (t.dodgeType === 'jump' ? 'Saltar (▲)' : 'Cambio de Carril (◀▶)')}</small>
          </div>
        </div>
      `).join("");
    }

    const rightSavings = document.getElementById("side-right-score");
    if (rightSavings) {
      const savingsEstimated = Math.max(120000, score * 1650).toLocaleString("es-CO");
      rightSavings.textContent = `$${savingsEstimated} COP Ahorrados`;
    }
  }

  showLevelIntroBanner(levelData) {
    if (!this.levelBanner || !levelData) return;

    this.levelBanner.innerHTML = `
      <div class="banner-box animate-slide-down" style="border-left: 5px solid ${levelData.themeColor};">
        <span class="banner-badge">${levelData.badge}</span>
        <h3 class="banner-title">${levelData.icon} ${levelData.title}</h3>
        <p class="banner-sub">${levelData.subtitle}</p>
      </div>
    `;
    this.levelBanner.classList.remove("hidden");

    setTimeout(() => {
      this.levelBanner.classList.add("hidden");
    }, 2800);
  }

  showToast(message, type = "info") {
    if (!this.toastContainer) return;

    const toast = document.createElement("div");
    toast.className = `toast-item toast-${type} animate-fade-in`;
    toast.innerHTML = message;
    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("fade-out");
      setTimeout(() => toast.remove(), 400);
    }, 2200);
  }

  showEducationalAlert(obstacle) {
    if (!this.eduAlertModal) return;

    this.eduAlertModal.innerHTML = `
      <div class="edu-alert-card animate-shake" style="border-left: 6px solid ${obstacle.color};">
        <div class="edu-alert-header">
          <span class="edu-icon">${obstacle.icon}</span>
          <div>
            <strong class="edu-title">¡Impacto con Amenaza Financiera!</strong>
            <span class="edu-name">${obstacle.name}</span>
          </div>
          <span class="edu-risk-tag" style="background: ${obstacle.color}25; color: ${obstacle.color}">
            Riesgo ${obstacle.riskLevel}
          </span>
        </div>
        <p class="edu-desc">${obstacle.description}</p>
        <div class="edu-tip">
          <strong>💡 Lección Ágil FinGo:</strong> ${obstacle.tip}
        </div>
      </div>
    `;

    this.eduAlertModal.classList.remove("hidden");

    setTimeout(() => {
      this.eduAlertModal.classList.add("hidden");
    }, 3800);
  }

  showAcademicMilestoneModal(deliverable, hasNextLevel) {
    this.academicModal.show(deliverable, hasNextLevel);
  }

  showGameOverModal(stats) {
    if (!this.gameOverModal) return;

    this.gameOverModal.innerHTML = `
      <div class="modal-card animate-scale-up">
        <div class="modal-icon-header">⚠️</div>
        <h2 class="modal-title">Sobreendeudamiento Crítico</h2>
        <p class="modal-subtitle">Has agotado tus fondos de emergencia y vidas financieras.</p>

        <div class="game-over-stats-grid">
          <div class="stat-box">
            <span class="stat-num">${stats.level}</span>
            <small>Nivel Alcanzado</small>
          </div>
          <div class="stat-box">
            <span class="stat-num">${stats.score.toLocaleString("es-CO")}</span>
            <small>Puntos</small>
          </div>
          <div class="stat-box">
            <span class="stat-num">${stats.coins}</span>
            <small>Monedas FinGo</small>
          </div>
          <div class="stat-box">
            <span class="stat-num">${stats.distance} m</span>
            <small>Distancia</small>
          </div>
        </div>

        <div class="modal-buttons-column">
          <button id="btn-restart-level" class="btn-primary-fingo">
            🔄 Reintentar Nivel ${stats.level}
          </button>
          <button id="btn-goto-pitch" class="btn-secondary-fingo">
            📊 Ir a Presentación Ejecutiva / Matriz ERIC
          </button>
          <button id="btn-gameover-menu" class="btn-outline-fingo">
            🏠 Volver al Menú Principal
          </button>
        </div>
      </div>
    `;

    this.gameOverModal.classList.remove("hidden");

    document.getElementById("btn-restart-level")?.addEventListener("click", () => {
      this.gameOverModal.classList.add("hidden");
      window.gameEngine.restartCurrentLevel();
    });

    document.getElementById("btn-goto-pitch")?.addEventListener("click", () => {
      this.gameOverModal.classList.add("hidden");
      window.pitchViewer.show(0);
    });

    document.getElementById("btn-gameover-menu")?.addEventListener("click", () => {
      this.gameOverModal.classList.add("hidden");
      this.showMainMenu();
    });
  }

  showVictoryScreen() {
    if (!this.victoryModal) return;

    this.victoryModal.innerHTML = `
      <div class="modal-card animate-scale-up victory-card">
        <div class="modal-icon-header">🏆</div>
        <h2 class="modal-title text-mint">¡Misión Cumplida: Libertad Financiera!</h2>
        <p class="modal-subtitle">Has superado todos los riesgos financieros y completado los 6 entregables de FinGo.</p>

        <div class="victory-highlight-box">
          <h3>Especialización en FinTech · Universidad de La Salle</h3>
          <p>Tu estrategia en Metodologías Ágiles, Lean Startup, Scrumban y Matriz ERIC ha creado un Océano Azul en Colombia.</p>
        </div>

        <div class="modal-buttons-column">
          <button id="btn-victory-pitch" class="btn-primary-fingo" style="background: #059669">
            ✨ Abrir Pitch Deck & Matriz ERIC Gamma
          </button>
          <button id="btn-victory-replay" class="btn-secondary-fingo">
            🎮 Jugar de Nuevo desde el Nivel 1
          </button>
        </div>
      </div>
    `;

    this.victoryModal.classList.remove("hidden");

    document.getElementById("btn-victory-pitch")?.addEventListener("click", () => {
      this.victoryModal.classList.add("hidden");
      window.pitchViewer.show(7);
    });

    document.getElementById("btn-victory-replay")?.addEventListener("click", () => {
      this.victoryModal.classList.add("hidden");
      window.gameEngine.startLevel(1);
    });
  }

  showPauseModal(show) {
    if (!this.pauseModal) return;
    if (show) {
      this.pauseModal.classList.remove("hidden");
    } else {
      this.pauseModal.classList.add("hidden");
    }
  }

  showMainMenu() {
    if (this.mainMenu) {
      this.mainMenu.classList.remove("hidden");
    }
    if (window.gameEngine) {
      window.gameEngine.state = "MENU";
      window.gameEngine.sound.stopMusic();
    }
  }

  hideMainMenu() {
    if (this.mainMenu) {
      this.mainMenu.classList.add("hidden");
    }
  }
}
