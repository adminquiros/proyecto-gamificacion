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

  update(dt, speed) {
    // 1. Mover ítems hacia el jugador
    for (let i = this.activeItems.length - 1; i >= 0; i--) {
      const item = this.activeItems[i];
      item.z -= speed * dt;
      item.rotation += dt * 4; // Rotación sobre su eje

      if (item.z < -3) {
        this.activeItems.splice(i, 1);
      }
    }

    // 2. Generación procedural de coleccionables
    let furthestZ = 0;
    for (const item of this.activeItems) {
      if (item.z > furthestZ) furthestZ = item.z;
    }

    if (furthestZ < this.spawnDistance - this.minSpacing) {
      this.spawnPattern();
    }
  }

  spawnPattern() {
    const lanes = [-1, 0, 1];
    const lane = lanes[Math.floor(Math.random() * lanes.length)];
    const xPos = lane * this.laneWidth;
    const baseZ = this.spawnDistance;

    const roll = Math.random();

    if (roll < 0.65) {
      // Hilera de 4 monedas consecutivas
      for (let i = 0; i < 4; i++) {
        this.activeItems.push({
          ...COLLECTIBLES_DATA.coin,
          lane,
          x: xPos,
          y: 0.6,
          z: baseZ + (i * 3.2),
          rotation: Math.random() * Math.PI,
          collected: false
        });
      }
    } else if (roll < 0.8) {
      // Arco de monedas que invita a saltar
      for (let i = 0; i < 5; i++) {
        const arcY = 0.6 + Math.sin((i / 4) * Math.PI) * 1.5;
        this.activeItems.push({
          ...COLLECTIBLES_DATA.coin,
          lane,
          x: xPos,
          y: arcY,
          z: baseZ + (i * 2.8),
          rotation: Math.random() * Math.PI,
          collected: false
        });
      }
    } else if (roll < 0.9) {
      // Powerup de Escudo o Multiplicador
      const powerupKey = Math.random() > 0.5 ? "shield" : "multiplier";
      this.activeItems.push({
        ...COLLECTIBLES_DATA[powerupKey],
        lane,
        x: xPos,
        y: 0.9,
        z: baseZ,
        rotation: 0,
        collected: false
      });
    } else {
      // Gema de Salud Financiera o Corazón
      const specialKey = Math.random() > 0.5 ? "gem" : "heart";
      this.activeItems.push({
        ...COLLECTIBLES_DATA[specialKey],
        lane,
        x: xPos,
        y: 0.9,
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
