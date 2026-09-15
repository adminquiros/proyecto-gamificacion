/**
 * FinGo - Motor Principal del Videojuego (GameEngine)
 * Coordina el bucle de renderizado (requestAnimationFrame), máquina de estados,
 * progresión de niveles, colisiones, puntuaciones y disparadores de hitos académicos.
 */

class GameEngine {
  constructor(canvas, soundSynth, uiManager) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.sound = soundSynth;
    this.ui = uiManager;

    // Subsistemas
    this.camera = new Camera3D(canvas);
    this.track = new TrackRenderer(canvas, this.camera);
    this.particles = new ParticleSystem(canvas, this.camera);
    this.player = new Player(canvas, this.camera, this.particles);
    this.obstacles = new ObstacleManager(canvas, this.camera);
    this.collectibles = new CollectibleManager(canvas, this.camera, this.particles);

    // Estados: 'MENU', 'PLAYING', 'PAUSED', 'MILESTONE', 'GAME_OVER', 'VICTORY'
    this.state = "MENU";

    // Progresión - Dificultad Media Equilibrada (~25 segundos por nivel)
    this.currentLevel = 1;
    this.maxLevels = 6;
    this.levelTargetDistance = 260; // 260 metros: ritmo óptimo para disfrutar mecánicas y ver obstáculos
    this.distanceInLevel = 0;
    this.totalDistance = 0;

    this.score = 0;
    this.coins = 0;
    this.baseSpeed = 18;           // Velocidad media ágil y balanceada
    this.speed = this.baseSpeed;

    this.lastTime = 0;
    this.animationFrameId = null;

    // Ajuste de resolución
    this.resize();
    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = (rect.width || window.innerWidth) * dpr;
    this.canvas.height = (rect.height || window.innerHeight) * dpr;
    this.camera.focalLength = this.canvas.width < 768 ? 320 : 420;
  }

  startLevel(levelNum = 1) {
    this.currentLevel = levelNum;
    this.distanceInLevel = 0;
    this.speed = this.baseSpeed + (this.currentLevel - 1) * 1.2;

    this.obstacles.reset();
    this.collectibles.reset();
    this.player.reset();

    this.state = "PLAYING";
    this.sound.playMusic();

    this.ui.updateHUD({
      score: this.score,
      coins: this.coins,
      lives: this.player.lives,
      maxLives: this.player.maxLives,
      level: this.currentLevel,
      progress: 0,
      multiplier: this.player.multiplier,
      hasShield: this.player.hasShield
    });

    const levelData = ACADEMIC_DATA.deliverables.find(d => d.levelNumber === this.currentLevel);
    this.ui.showLevelIntroBanner(levelData);
    this.ui.updateSidePanels(levelData, this.score, this.coins);
  }

  restartCurrentLevel() {
    this.startLevel(this.currentLevel);
  }

  nextLevel() {
    if (this.currentLevel < this.maxLevels) {
      this.startLevel(this.currentLevel + 1);
    } else {
      this.state = "VICTORY";
      this.sound.playLevelComplete();
      this.ui.showVictoryScreen();
    }
  }

  togglePause() {
    if (this.state === "PLAYING") {
      this.state = "PAUSED";
      this.sound.stopMusic();
      this.ui.showPauseModal(true);
    } else if (this.state === "PAUSED") {
      this.state = "PLAYING";
      this.sound.playMusic();
      this.ui.showPauseModal(false);
    }
  }

  // Bucle de juego a 60 FPS
  loop(timestamp) {
    if (!this.lastTime) this.lastTime = timestamp;
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
    this.lastTime = timestamp;

    if (this.state === "PLAYING") {
      this.update(dt);
    }

    this.render();

    this.animationFrameId = requestAnimationFrame((t) => this.loop(t));
  }

  update(dt) {
    // 1. Progresión de distancia y puntuación
    const distDelta = this.speed * dt;
    this.distanceInLevel += distDelta;
    this.totalDistance += distDelta;

    const scoreDelta = Math.round(distDelta * 2 * this.player.multiplier);
    this.score += scoreDelta;

    // 2. Actualizar jugador
    this.player.update(dt, this.speed);
    this.camera.update(this.player.x);

    // 3. Actualizar entorno y pista
    this.track.update(this.speed, dt);
    this.particles.update(dt);

    // 4. Actualizar obstáculos y coleccionables limpios (sin superposición)
    this.obstacles.update(dt, this.speed, this.currentLevel, this.distanceInLevel);
    this.collectibles.update(dt, this.speed, this.obstacles.activeObstacles);

    // 5. Verificar colisiones con obstáculos
    const hitInfo = this.obstacles.checkCollisions(this.player);
    if (hitInfo) {
      if (hitInfo.damageResult === "shield_absorbed") {
        this.sound.playPowerup();
        this.ui.showToast(`🛡️ ¡Escudo activado! Bloqueaste: ${hitInfo.obstacle.name}`, "info");
      } else if (hitInfo.damageResult === "hit") {
        this.sound.playCrash();
        this.ui.showEducationalAlert(hitInfo.obstacle);

        if (this.player.lives <= 0) {
          this.gameOver();
          return;
        }
      }
    }

    // 6. Verificar recolección de monedas y powerups
    const collected = this.collectibles.checkCollisions(this.player);
    for (const item of collected) {
      if (item.type === "coin") {
        this.sound.playCoin();
        this.coins++;
        this.score += item.points * this.player.multiplier;
        this.ui.updateSidePanels(ACADEMIC_DATA.deliverables.find(d => d.levelNumber === this.currentLevel), this.score, this.coins);
      } else if (item.type === "shield") {
        this.sound.playPowerup();
        this.player.activateShield(item.duration);
        this.ui.showToast("🛡️ ¡Escudo Antifraude Activado!", "success");
      } else if (item.type === "multiplier") {
        this.sound.playPowerup();
        this.player.activateMultiplier(item.multiplier, item.duration);
        this.ui.showToast("⚡ ¡Método Avalancha Activo! Puntos x2", "success");
      } else if (item.type === "gem") {
        this.sound.playLevelComplete();
        this.score += item.points * this.player.multiplier;
        this.ui.showToast("💎 ¡Gema de Salud Financiera! +75 Puntos", "special");
      } else if (item.type === "heart") {
        this.sound.playPowerup();
        if (this.player.addLife()) {
          this.ui.showToast("❤️ ¡Fondo de Emergencia! +1 Vida recuperada", "success");
        }
      }
    }

    // 7. Actualizar HUD
    const progress = Math.min(100, (this.distanceInLevel / this.levelTargetDistance) * 100);
    this.ui.updateHUD({
      score: this.score,
      coins: this.coins,
      lives: this.player.lives,
      maxLives: this.player.maxLives,
      level: this.currentLevel,
      progress,
      multiplier: this.player.multiplier,
      hasShield: this.player.hasShield
    });

    // 8. Chequeo de Hito Académico del Nivel
    if (this.distanceInLevel >= this.levelTargetDistance) {
      this.triggerAcademicMilestone();
    }
  }

  triggerAcademicMilestone() {
    this.state = "MILESTONE";
    this.sound.playLevelComplete();
    this.sound.stopMusic();

    // Cada hito completado abre directamente la presentación ejecutiva en la siguiente diapositiva
    if (window.pitchViewer) {
      const nextSlide = Math.min(7, this.currentLevel + 1);
      window.pitchViewer.show(nextSlide, true);
    } else {
      const deliverable = ACADEMIC_DATA.deliverables.find(d => d.levelNumber === this.currentLevel);
      this.ui.showAcademicMilestoneModal(deliverable, this.currentLevel < this.maxLevels);
    }
  }

  gameOver() {
    this.state = "GAME_OVER";
    this.sound.stopMusic();
    this.sound.playGameOver();

    this.ui.showGameOverModal({
      level: this.currentLevel,
      score: this.score,
      coins: this.coins,
      distance: Math.round(this.totalDistance)
    });
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const levelData = ACADEMIC_DATA.deliverables.find(d => d.levelNumber === this.currentLevel);

    // 1. Pista y Rascacielos
    this.track.render(levelData);

    // 2. Obstáculos
    this.obstacles.render();

    // 3. Coleccionables
    this.collectibles.render();

    // 4. Jugador
    this.player.render();

    // 5. Partículas y efectos
    this.particles.render();
  }
}
