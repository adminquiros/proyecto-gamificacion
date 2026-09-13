/**
 * FinGo - Sistema de Partículas Tridimensionales
 * Administra efectos de estela de velocidad, chispas de monedas,
 * auras de escudo, impactos de colisión y confeti de victoria.
 */

class ParticleSystem {
  constructor(canvas, camera) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.camera = camera;
    this.particles = [];
  }

  emit(type, x, y, z, count = 10, color = "#FBBF24") {
    for (let i = 0; i < count; i++) {
      let vx = (Math.random() - 0.5) * 4;
      let vy = Math.random() * 3 + 1;
      let vz = (Math.random() - 0.5) * 4;
      let life = 0.6 + Math.random() * 0.5;
      let size = 0.08 + Math.random() * 0.12;

      if (type === "trail") {
        vx = (Math.random() - 0.5) * 0.8;
        vy = Math.random() * 0.6;
        vz = -Math.random() * 2 - 2; // Queda atrás
        life = 0.35;
        size = 0.09;
        color = Math.random() > 0.5 ? "#2B62C6" : "#48C09B";
      } else if (type === "crash") {
        vx = (Math.random() - 0.5) * 8;
        vy = Math.random() * 6 + 1;
        vz = (Math.random() - 0.5) * 6;
        life = 0.8;
        size = 0.18;
        color = "#EF4444";
      } else if (type === "coin") {
        vy = Math.random() * 4 + 2;
        life = 0.7;
        size = 0.12;
        color = "#FBBF24";
      } else if (type === "shield") {
        vx = (Math.random() - 0.5) * 3;
        vy = (Math.random() - 0.5) * 3;
        vz = (Math.random() - 0.5) * 3;
        life = 0.5;
        size = 0.1;
        color = "#3B82F6";
      }

      this.particles.push({
        x, y, z,
        vx, vy, vz,
        life,
        maxLife: life,
        size,
        color
      });
    }
  }

  update(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.z += p.vz * dt;
      p.vy -= 4.0 * dt; // Gravedad ligera
    }
  }

  render() {
    const ctx = this.ctx;
    for (const p of this.particles) {
      const proj = this.camera.project(p.x, p.y, p.z);
      if (!proj.visible) continue;

      const alpha = Math.max(0, p.life / p.maxLife);
      const pxSize = Math.max(1, this.camera.projectSize(p.size, p.z));

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(proj.screenX, proj.screenY, pxSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
}
