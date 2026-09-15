/**
 * FinGo - Gestor de Coleccionables Tridimensionales
 * Genera monedas de ahorro, escudos antifraude, multiplicadores 2x y gemas
 * con animaciones de flotación y rotación tridimensional.
 */

class CollectibleManager {
  constructor(canvas, camera, particleSystem) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.camera = camera;
    this.particles = particleSystem;
    this.laneWidth = 2.2;
    this.activeItems = [];

    this.spawnDistance = 100;
    this.minSpacing = 16;
  }

  reset() {
    this.activeItems = [];
  }

  update(dt, speed, activeObstacles = []) {
    // 1. Mover ítems hacia el jugador
    for (let i = this.activeItems.length - 1; i >= 0; i--) {
      const item = this.activeItems[i];
      item.z -= speed * dt;
      item.rotation += dt * 3.5; // Rotación sobre su eje

      if (item.z < -3) {
        this.activeItems.splice(i, 1);
      }
    }

    // 2. Generación procedural limpia de coleccionables
    let furthestZ = 0;
    for (const item of this.activeItems) {
      if (item.z > furthestZ) furthestZ = item.z;
    }

    if (furthestZ < this.spawnDistance - this.minSpacing) {
      this.spawnPattern(activeObstacles);
    }
  }

  spawnPattern(activeObstacles = []) {
    const allLanes = [-1, 0, 1];
    const baseZ = this.spawnDistance;

    // Detectar carriles ocupados por obstáculos cercanos al punto de spawn (Z entre 80 y 115)
    const blockedLanes = new Set();
    for (const obs of activeObstacles) {
      if (Math.abs(obs.z - baseZ) < 18) {
        blockedLanes.add(obs.lane);
      }
    }

    // Filtrar carriles seguros y despejados
    let safeLanes = allLanes.filter(l => !blockedLanes.has(l));
    if (safeLanes.length === 0) {
      // Si todos los carriles tienen obstáculos cercanos, no spawnear coleccionables para evitar sobrecarga
      return;
    }

    const lane = safeLanes[Math.floor(Math.random() * safeLanes.length)];
    const xPos = lane * this.laneWidth;

    const roll = Math.random();

    if (roll < 0.7) {
      // Hilera limpia de 2 a 3 monedas (sin saturar la pantalla)
      const coinCount = Math.random() > 0.5 ? 3 : 2;
      for (let i = 0; i < coinCount; i++) {
        this.activeItems.push({
          ...COLLECTIBLES_DATA.coin,
          lane,
          x: xPos,
          y: 0.65,
          z: baseZ + (i * 3.6),
          rotation: Math.random() * Math.PI,
          collected: false
        });
      }
    } else if (roll < 0.85) {
      // Powerup individual de Escudo o Multiplicador
      const powerupKey = Math.random() > 0.5 ? "shield" : "multiplier";
      this.activeItems.push({
        ...COLLECTIBLES_DATA[powerupKey],
        lane,
        x: xPos,
        y: 0.85,
        z: baseZ,
        rotation: 0,
        collected: false
      });
    } else {
      // Gema o Corazón
      const specialKey = Math.random() > 0.6 ? "gem" : "heart";
      this.activeItems.push({
        ...COLLECTIBLES_DATA[specialKey],
        lane,
        x: xPos,
        y: 0.85,
        z: baseZ,
        rotation: 0,
        collected: false
      });
    }
  }

  checkCollisions(player) {
    const pBounds = player.getBounds();
    const collectedList = [];

    for (const item of this.activeItems) {
      if (item.collected) continue;

      const itemRadius = item.radius || 0.5;
      const minX = item.x - itemRadius;
      const maxX = item.x + itemRadius;
      const minY = item.y - itemRadius;
      const maxY = item.y + itemRadius;
      const minZ = item.z - 0.6;
      const maxZ = item.z + 0.6;

      const overlapX = pBounds.maxX >= minX && pBounds.minX <= maxX;
      const overlapY = pBounds.maxY >= minY && pBounds.minY <= maxY;
      const overlapZ = pBounds.maxZ >= minZ && pBounds.minZ <= maxZ;

      if (overlapX && overlapY && overlapZ) {
        item.collected = true;
        this.particles.emit(
          item.type === "coin" ? "coin" : "shield",
          item.x,
          item.y,
          item.z,
          10,
          item.color
        );
        collectedList.push(item);
      }
    }

    // Limpiar ítems recolectados
    this.activeItems = this.activeItems.filter(i => !i.collected);
    return collectedList;
  }

  render() {
    const ctx = this.ctx;
    const sorted = [...this.activeItems].sort((a, b) => b.z - a.z);

    for (const item of sorted) {
      const floatOffset = Math.sin(Date.now() / 250 + item.x) * 0.12;
      const currentY = item.y + floatOffset;
      const proj = this.camera.project(item.x, currentY, item.z);

      if (!proj.visible) continue;

      const screenRadius = Math.max(4, this.camera.projectSize(item.radius, item.z));
      const cx = proj.screenX;
      const cy = proj.screenY;

      ctx.save();

      // Sombra en el suelo del coleccionable
      const shadowProj = this.camera.project(item.x, 0, item.z);
      if (shadowProj.visible) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
        ctx.beginPath();
        ctx.ellipse(shadowProj.screenX, shadowProj.screenY, screenRadius * 0.9, screenRadius * 0.35, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Brillo y halo del ítem
      ctx.shadowColor = item.color;
      ctx.shadowBlur = 12;

      if (item.type === "coin") {
        // Moneda dorada que rota en 3D
        const rotScale = Math.cos(item.rotation);
        const coinWidth = Math.max(2, Math.abs(rotScale) * screenRadius);

        const grad = ctx.createLinearGradient(cx - coinWidth, cy - screenRadius, cx + coinWidth, cy + screenRadius);
        grad.addColorStop(0, "#FEF08A");
        grad.addColorStop(0.5, "#F59E0B");
        grad.addColorStop(1, "#B45309");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(cx, cy, coinWidth, screenRadius, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Signo '$' si está de frente
        if (Math.abs(rotScale) > 0.4) {
          ctx.fillStyle = "#78350F";
          ctx.font = `bold ${Math.max(7, Math.round(screenRadius * 1.1))}px sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("$", cx, cy);
        }
      } else {
        // Powerups (Escudo, Multiplicador, Gema, Corazón)
        const powerGrad = ctx.createRadialGradient(cx, cy, screenRadius * 0.2, cx, cy, screenRadius);
        powerGrad.addColorStop(0, "#FFFFFF");
        powerGrad.addColorStop(0.6, item.color);
        powerGrad.addColorStop(1, item.accentColor);

        ctx.fillStyle = powerGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, screenRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Icono representativo
        ctx.font = `${Math.max(10, Math.round(screenRadius * 1.1))}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(item.icon, cx, cy);
      }

      ctx.restore();
    }
  }
}
