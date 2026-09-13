/**
 * FinGo - Gestor de Obstáculos y Riesgos Financieros Tridimensionales
 * Genera amenazas financieras según el nivel activo, verifica colisiones 3D
 * y renderiza cada obstáculo con su icono, nombre y efectos visuales.
 */

class ObstacleManager {
  constructor(canvas, camera) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.camera = camera;
    this.laneWidth = 2.2;
    this.activeObstacles = [];

    this.spawnDistance = 105;    // Distancia Z en el horizonte donde nacen
    this.minSpacing = 44;        // Mayor espacio entre obstáculos para reacción cómoda
    this.lastSpawnZ = 0;
  }

  reset() {
    this.activeObstacles = [];
    this.lastSpawnZ = 0;
  }

  update(dt, speed, currentLevel, distanceTravelled) {
    // 1. Mover obstáculos hacia el jugador
    for (let i = this.activeObstacles.length - 1; i >= 0; i--) {
      const obs = this.activeObstacles[i];
      obs.z -= speed * dt;

      // Descartar obstáculos que ya quedaron atrás
      if (obs.z < -4) {
        this.activeObstacles.splice(i, 1);
      }
    }

    // 2. Generación procedural de obstáculos
    const levelKey = `level${Math.min(6, Math.max(1, currentLevel))}`;
    const levelCatalog = OBSTACLES_DATA[levelKey] || OBSTACLES_DATA.level1;

    // Verificar si el último obstáculo generado ya avanzó lo suficiente
    let furthestZ = 0;
    for (const obs of this.activeObstacles) {
      if (obs.z > furthestZ) furthestZ = obs.z;
    }

    if (furthestZ < this.spawnDistance - this.minSpacing) {
      this.spawnWave(levelCatalog, currentLevel);
    }
  }

  spawnWave(levelCatalog, currentLevel) {
    const lanes = [-1, 0, 1];
    // Modo accesible: 1 solo carril ocupado por ola, dejando siempre 2 carriles completamente libres
    const count = (currentLevel >= 5 && Math.random() > 0.85) ? 2 : 1;

    // Barajar carriles aleatoriamente
    const shuffledLanes = [...lanes].sort(() => Math.random() - 0.5);
    const occupiedLanes = shuffledLanes.slice(0, count);

    for (const lane of occupiedLanes) {
      const template = levelCatalog[Math.floor(Math.random() * levelCatalog.length)];
      const xPos = lane * this.laneWidth;

      this.activeObstacles.push({
        ...template,
        lane,
        x: xPos,
        y: template.yPos,
        z: this.spawnDistance + (Math.random() * 3),
        hit: false
      });
    }
  }

  checkCollisions(player) {
    if (player.isInvulnerable) return null;

    const pBounds = player.getBounds();

    for (const obs of this.activeObstacles) {
      if (obs.hit) continue;

      // Caja de colisión del obstáculo
      const obsMinX = obs.x - obs.width / 2;
      const obsMaxX = obs.x + obs.width / 2;
      const obsMinY = obs.y;
      const obsMaxY = obs.y + obs.height;
      const obsMinZ = obs.z - 0.7;
      const obsMaxZ = obs.z + 0.7;

      // Chequeo de intersección AABB 3D
      const overlapX = pBounds.maxX >= obsMinX && pBounds.minX <= obsMaxX;
      const overlapY = pBounds.maxY >= obsMinY && pBounds.minY <= obsMaxY;
      const overlapZ = pBounds.maxZ >= obsMinZ && pBounds.minZ <= obsMaxZ;

      if (overlapX && overlapY && overlapZ) {
        obs.hit = true;
        const damageResult = player.takeDamage();
        return {
          obstacle: obs,
          damageResult
        };
      }
    }
    return null;
  }

  render() {
    const ctx = this.ctx;
    // Ordenar de mayor profundidad Z a menor profundidad (de lejos a cerca)
    const sorted = [...this.activeObstacles].sort((a, b) => b.z - a.z);

    for (const obs of sorted) {
      if (obs.dodgeType === "slide") {
        this.renderLaserBarrier(obs);
      } else if (obs.dodgeType === "jump") {
        this.renderHurdle(obs);
      } else {
        this.renderMonolith(obs);
      }
    }
  }

  // 1. Barrera Aérea de Láser (Exige agacharse / Slide)
  renderLaserBarrier(obs) {
    const ctx = this.ctx;
    const baseP = this.camera.project(obs.x, 0, obs.z);
    const laserP = this.camera.project(obs.x, obs.y, obs.z);
    const topP = this.camera.project(obs.x, obs.y + obs.height, obs.z);

    if (!baseP.visible || !topP.visible) return;

    const screenW = this.camera.projectSize(obs.width * 1.35, obs.z);
    const cx = laserP.screenX;

    // Postes laterales
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = Math.max(2, screenW * 0.08);
    const postL = cx - screenW / 2;
    const postR = cx + screenW / 2;

    ctx.beginPath();
    ctx.moveTo(postL, baseP.screenY);
    ctx.lineTo(postL, topP.screenY);
    ctx.moveTo(postR, baseP.screenY);
    ctx.lineTo(postR, topP.screenY);
    ctx.stroke();

    // Haz de láser luminoso (peligro rojo/ámbar)
    const laserH = Math.max(6, (baseP.screenY - topP.screenY) * 0.32);
    const pulse = Math.sin(Date.now() / 90) * 0.2 + 0.8;

    ctx.save();
    ctx.shadowColor = obs.color;
    ctx.shadowBlur = 18;
    ctx.fillStyle = obs.color;
    ctx.globalAlpha = pulse;
    ctx.fillRect(postL, laserP.screenY - laserH / 2, screenW, laserH);

    // Letrero de advertencia centrado más grande
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#0F172A";
    ctx.fillRect(cx - screenW * 0.45, laserP.screenY - laserH * 1.5, screenW * 0.9, laserH * 2.0);
    ctx.strokeStyle = obs.accentColor;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(cx - screenW * 0.45, laserP.screenY - laserH * 1.5, screenW * 0.9, laserH * 2.0);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = `bold ${Math.max(10, Math.round(screenW * 0.22))}px "Plus Jakarta Sans", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`⚡ ¡DESLÍZATE!`, cx, laserP.screenY - laserH * 0.5);
    ctx.restore();
  }

  // 2. Obstáculo Bajo para Saltar (Hurdle: Tarjetas, brechas de datos)
  renderHurdle(obs) {
    const ctx = this.ctx;
    const baseP = this.camera.project(obs.x, 0, obs.z);
    const topP = this.camera.project(obs.x, obs.height, obs.z);

    if (!baseP.visible || !topP.visible) return;

    const screenW = this.camera.projectSize(obs.width, obs.z);
    const screenH = baseP.screenY - topP.screenY;
    const cx = baseP.screenX;

    ctx.save();
    // Cuerpo del obstáculo con gradiente de peligro
    const grad = ctx.createLinearGradient(cx - screenW / 2, topP.screenY, cx + screenW / 2, baseP.screenY);
    grad.addColorStop(0, obs.color);
    grad.addColorStop(1, "#1E293B");

    ctx.fillStyle = grad;
    ctx.strokeStyle = obs.accentColor;
    ctx.lineWidth = Math.max(2, screenW * 0.06);

    ctx.beginPath();
    ctx.roundRect(cx - screenW / 2, topP.screenY, screenW, screenH, 8);
    ctx.fill();
    ctx.stroke();

    // Icono significativamente más grande y nítido
    const fontSize = Math.max(16, Math.round(screenW * 0.52));
    ctx.font = `${fontSize}px sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(obs.icon, cx, topP.screenY + screenH * 0.65);

    // Barra de rayas de precaución
    ctx.fillStyle = "#FBBF24";
    ctx.fillRect(cx - screenW / 2 + 4, topP.screenY + 3, screenW - 8, Math.max(3, screenH * 0.15));

    ctx.restore();
  }

  // 3. Monolito Alto para Esquivar (Silos, Phishing, Tarjeta Saturada)
  renderMonolith(obs) {
    const ctx = this.ctx;
    const baseP = this.camera.project(obs.x, 0, obs.z);
    const topP = this.camera.project(obs.x, obs.height, obs.z);

    if (!baseP.visible || !topP.visible) return;

    const screenW = this.camera.projectSize(obs.width, obs.z);
    const screenH = baseP.screenY - topP.screenY;
    const cx = baseP.screenX;

    ctx.save();
    // Bloque 3D estilo muro tecnológico
    const grad = ctx.createLinearGradient(cx, topP.screenY, cx, baseP.screenY);
    grad.addColorStop(0, obs.accentColor);
    grad.addColorStop(0.3, obs.color);
    grad.addColorStop(1, "#0B132B");

    ctx.fillStyle = grad;
    ctx.strokeStyle = obs.accentColor;
    ctx.lineWidth = Math.max(2, screenW * 0.05);

    ctx.beginPath();
    ctx.roundRect(cx - screenW / 2, topP.screenY, screenW, screenH, 10);
    ctx.fill();
    ctx.stroke();

    // Icono gigante muy visible
    const iconSize = Math.max(20, Math.round(screenW * 0.55));
    ctx.font = `${iconSize}px sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(obs.icon, cx, topP.screenY + screenH * 0.42);

    // Etiqueta de riesgo
    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
    const tagH = Math.max(14, screenH * 0.22);
    ctx.fillRect(cx - screenW * 0.48, topP.screenY + screenH * 0.68, screenW * 0.96, tagH);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = `bold ${Math.max(9, Math.round(screenW * 0.18))}px "Plus Jakarta Sans", sans-serif`;
    ctx.textBaseline = "middle";
    ctx.fillText(`RIESGO ${obs.riskLevel.toUpperCase()}`, cx, topP.screenY + screenH * 0.68 + tagH / 2);

    ctx.restore();
  }
}
