/**
 * FinGo - Clase Jugador (Player Runner 3D)
 * Controla la posición entre los 3 carriles, físicas de salto y deslizamiento,
 * animaciones de carrera, escudo de protección y renderizado tridimensional.
 */

class Player {
  constructor(canvas, camera, particleSystem) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.camera = camera;
    this.particles = particleSystem;

    this.laneWidth = 2.2;
    this.currentLane = 0;      // -1: Izquierda, 0: Centro, 1: Derecha
    this.targetLane = 0;

    // Coordenadas mundiales
    this.x = 0;
    this.y = 0;
    this.z = 0;                // El jugador siempre se mantiene en Z = 0 respecto a la cámara

    // Físicas ágiles y cómodas
    this.laneChangeSpeed = 18.0; // Transición rápida de carril
    this.vy = 0;
    this.gravity = 22.0;
    this.jumpForce = 10.0;
    this.isJumping = false;

    this.isSliding = false;
    this.slideTimer = 0;
    this.slideDuration = 0.9;    // Ventana amplia para deslizarse cómodamente

    // Dimensiones
    this.normalHeight = 1.45;
    this.slideHeight = 0.55;
    this.width = 0.85;

    // Estado del juego
    this.maxLives = 4;
    this.lives = 4;
    this.isInvulnerable = false;
    this.invulnerableTimer = 0;
    this.invulnerableDuration = 2.8; // 2.8 segundos de invulnerabilidad para recuperarse con calma

    // Power-ups
    this.hasShield = false;
    this.shieldTimer = 0;
    this.multiplier = 1;
    this.multiplierTimer = 0;

    // Animación
    this.animTime = 0;
  }

  reset() {
    this.currentLane = 0;
    this.targetLane = 0;
    this.x = 0;
    this.y = 0;
    this.vy = 0;
    this.isJumping = false;
    this.isSliding = false;
    this.slideTimer = 0;
    this.lives = this.maxLives;
    this.isInvulnerable = false;
    this.invulnerableTimer = 0;
    this.hasShield = false;
    this.shieldTimer = 0;
    this.multiplier = 1;
    this.multiplierTimer = 0;
    this.animTime = 0;
  }

  moveLeft() {
    if (this.targetLane > -1) {
      this.targetLane--;
      return true;
    }
    return false;
  }

  moveRight() {
    if (this.targetLane < 1) {
      this.targetLane++;
      return true;
    }
    return false;
  }

  jump() {
    if (!this.isJumping && !this.isSliding) {
      this.isJumping = true;
      this.vy = this.jumpForce;
      return true;
    }
    return false;
  }

  slide() {
    if (this.isJumping) {
      // Fast drop si está saltando y presiona abajo (estilo Subway Surfers)
      this.vy = -18.0;
      return true;
    }
    if (!this.isSliding) {
      this.isSliding = true;
      this.slideTimer = this.slideDuration;
      return true;
    }
    return false;
  }

  activateShield(duration = 8000) {
    this.hasShield = true;
    this.shieldTimer = duration / 1000;
  }

  activateMultiplier(mult = 2, duration = 10000) {
    this.multiplier = mult;
    this.multiplierTimer = duration / 1000;
  }

  addLife() {
    if (this.lives < this.maxLives) {
      this.lives++;
      return true;
    }
    return false;
  }

  takeDamage() {
    if (this.isInvulnerable) return false;

    if (this.hasShield) {
      // El escudo absorbe el golpe
      this.hasShield = false;
      this.shieldTimer = 0;
      this.isInvulnerable = true;
      this.invulnerableTimer = 0.8;
      this.particles.emit("shield", this.x, this.y + 0.8, this.z, 20, "#3B82F6");
      return "shield_absorbed";
    }

    this.lives--;
    this.isInvulnerable = true;
    this.invulnerableTimer = this.invulnerableDuration;
    this.particles.emit("crash", this.x, this.y + 0.8, this.z, 25, "#EF4444");
    return "hit";
  }

  update(dt, speed) {
    this.animTime += dt * (speed * 0.4);

    // 1. Interpolación suave de carril (X)
    const targetX = this.targetLane * this.laneWidth;
    this.x += (targetX - this.x) * Math.min(1, this.laneChangeSpeed * dt);

    // 2. Físicas de Salto (Y)
    if (this.isJumping) {
      this.y += this.vy * dt;
      this.vy -= this.gravity * dt;

      if (this.y <= 0) {
        this.y = 0;
        this.vy = 0;
        this.isJumping = false;
      }
    }

    // 3. Físicas de Deslizamiento (Slide)
    if (this.isSliding) {
      this.slideTimer -= dt;
      // Emitir chispas en el suelo al deslizarse
      if (Math.random() > 0.4) {
        this.particles.emit("trail", this.x, 0.05, this.z, 2, "#48C09B");
      }
      if (this.slideTimer <= 0) {
        this.isSliding = false;
      }
    }

    // 4. Temporizadores de Powerups e Invulnerabilidad
    if (this.isInvulnerable) {
      this.invulnerableTimer -= dt;
      if (this.invulnerableTimer <= 0) {
        this.isInvulnerable = false;
      }
    }

    if (this.hasShield) {
      this.shieldTimer -= dt;
      if (this.shieldTimer <= 0) {
        this.hasShield = false;
      }
    }

    if (this.multiplier > 1) {
      this.multiplierTimer -= dt;
      if (this.multiplierTimer <= 0) {
        this.multiplier = 1;
      }
    }

    // Emitir estela sutil de velocidad
    if (!this.isSliding && Math.random() > 0.6) {
      this.particles.emit("trail", this.x, 0.1, this.z, 1);
    }
  }

  getCurrentHeight() {
    return this.isSliding ? this.slideHeight : this.normalHeight;
  }

  // Obtener caja de colisión AABB 3D
  getBounds() {
    const h = this.getCurrentHeight();
    return {
      minX: this.x - this.width / 2,
      maxX: this.x + this.width / 2,
      minY: this.y,
      maxY: this.y + h,
      minZ: this.z - 0.4,
      maxZ: this.z + 0.4
    };
  }

  render() {
    const ctx = this.ctx;

    // Parpadeo cuando está invulnerable
    if (this.isInvulnerable && Math.floor(Date.now() / 80) % 2 === 0) {
      return;
    }

    // 1. Sombra en el suelo proyectada
    const shadowProj = this.camera.project(this.x, 0, this.z);
    if (shadowProj.visible) {
      const shadowW = this.camera.projectSize(this.width * 1.1, this.z) * (1 - Math.min(0.6, this.y / 4));
      const shadowH = shadowW * 0.35;
      ctx.save();
      ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
      ctx.beginPath();
      ctx.ellipse(shadowProj.screenX, shadowProj.screenY, shadowW, shadowH, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 2. Renderizar Avatar FinTech (Proyección 3D)
    const currentH = this.getCurrentHeight();
    const feetProj = this.camera.project(this.x, this.y, this.z);
    const headProj = this.camera.project(this.x, this.y + currentH, this.z);

    if (!feetProj.visible || !headProj.visible) return;

    const screenW = this.camera.projectSize(this.width, this.z);
    const screenH = feetProj.screenY - headProj.screenY;
    const cx = feetProj.screenX;
    const cy = headProj.screenY;

    ctx.save();

    if (this.isSliding) {
      // Pose de deslizamiento estilo runner
      const slideGrad = ctx.createLinearGradient(cx - screenW * 0.7, cy, cx + screenW * 0.7, cy + screenH);
      slideGrad.addColorStop(0, "#2B62C6");
      slideGrad.addColorStop(1, "#48C09B");

      ctx.fillStyle = slideGrad;
      ctx.beginPath();
      ctx.roundRect(cx - screenW * 0.6, cy + screenH * 0.2, screenW * 1.2, screenH * 0.75, 10);
      ctx.fill();

      // Visor / Cabeza agachada
      ctx.fillStyle = "#0D1B2A";
      ctx.beginPath();
      ctx.arc(cx, cy + screenH * 0.25, screenW * 0.28, 0, Math.PI * 2);
      ctx.fill();

      // Línea de neón del traje
      ctx.strokeStyle = "#5EEAD4";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx - screenW * 0.5, cy + screenH * 0.6);
      ctx.lineTo(cx + screenW * 0.5, cy + screenH * 0.6);
      ctx.stroke();
    } else {
      // Pose de corredor vertical
      const legOffset = Math.sin(this.animTime * 8) * (screenH * 0.15);

      // Torso / Chaqueta FinGo
      const bodyGrad = ctx.createLinearGradient(cx, cy + screenH * 0.2, cx, cy + screenH * 0.7);
      bodyGrad.addColorStop(0, "#2B62C6");
      bodyGrad.addColorStop(0.8, "#1E40AF");
      bodyGrad.addColorStop(1, "#0D1B2A");

      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.roundRect(cx - screenW * 0.45, cy + screenH * 0.25, screenW * 0.9, screenH * 0.45, 8);
      ctx.fill();

      // Logotipo FinGo en la espalda/pecho (flecha y 'G')
      ctx.strokeStyle = "#48C09B";
      ctx.lineWidth = Math.max(2, screenW * 0.08);
      ctx.beginPath();
      ctx.arc(cx, cy + screenH * 0.42, screenW * 0.16, 0.4, Math.PI * 1.8);
      ctx.stroke();

      // Cabeza / Casco tecnológico
      ctx.fillStyle = "#0D1B2A";
      ctx.beginPath();
      ctx.arc(cx, cy + screenH * 0.14, screenW * 0.26, 0, Math.PI * 2);
      ctx.fill();

      // Visor de neón del casco
      ctx.fillStyle = "#48C09B";
      ctx.beginPath();
      ctx.ellipse(cx, cy + screenH * 0.15, screenW * 0.18, screenH * 0.045, 0, 0, Math.PI * 2);
      ctx.fill();

      // Piernas animadas
      ctx.strokeStyle = "#0B132B";
      ctx.lineWidth = Math.max(4, screenW * 0.2);
      ctx.lineCap = "round";

      // Pierna Izquierda
      ctx.beginPath();
      ctx.moveTo(cx - screenW * 0.22, cy + screenH * 0.7);
      ctx.lineTo(cx - screenW * 0.22, cy + screenH * 0.95 + (this.isJumping ? -legOffset * 0.5 : legOffset));
      ctx.stroke();

      // Pierna Derecha
      ctx.beginPath();
      ctx.moveTo(cx + screenW * 0.22, cy + screenH * 0.7);
      ctx.lineTo(cx + screenW * 0.22, cy + screenH * 0.95 + (this.isJumping ? -legOffset * 0.5 : -legOffset));
      ctx.stroke();

      // Tenis / Calzado deportivo de alta velocidad con luz menta
      ctx.fillStyle = "#48C09B";
      const shoeL = cy + screenH * 0.95 + (this.isJumping ? -legOffset * 0.5 : legOffset);
      const shoeR = cy + screenH * 0.95 + (this.isJumping ? -legOffset * 0.5 : -legOffset);
      ctx.fillRect(cx - screenW * 0.32, shoeL - 2, screenW * 0.2, 5);
      ctx.fillRect(cx + screenW * 0.12, shoeR - 2, screenW * 0.2, 5);
    }

    // 3. Aura de Escudo si está activo
    if (this.hasShield) {
      const shieldRadius = Math.max(screenW, screenH) * 0.75;
      const shieldGrad = ctx.createRadialGradient(cx, cy + screenH * 0.5, shieldRadius * 0.3, cx, cy + screenH * 0.5, shieldRadius);
      shieldGrad.addColorStop(0, "rgba(59, 130, 246, 0.1)");
      shieldGrad.addColorStop(0.8, "rgba(59, 130, 246, 0.45)");
      shieldGrad.addColorStop(1, "rgba(96, 165, 250, 0.85)");

      ctx.strokeStyle = "#60A5FA";
      ctx.lineWidth = 2.5;
      ctx.fillStyle = shieldGrad;
      ctx.beginPath();
      ctx.arc(cx, cy + screenH * 0.5, shieldRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // 4. Indicador de Multiplicador 2x sobre la cabeza
    if (this.multiplier > 1) {
      ctx.fillStyle = "#10B981";
      ctx.font = `bold ${Math.max(10, Math.round(screenW * 0.4))}px "Plus Jakarta Sans", sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText("2x AVALANCHA", cx, cy - 10);
    }

    ctx.restore();
  }
}
