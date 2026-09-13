/**
 * FinGo - Renderizador de Pista Tridimensional, Rascacielos y Entorno FinTech
 * Dibuja la autopista de 3 carriles con efecto de velocidad infinita,
 * líneas de neón, rascacielos en el horizonte y portales de datos.
 */

class TrackRenderer {
  constructor(canvas, camera) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.camera = camera;

    this.laneWidth = 2.2;        // Ancho de cada carril en unidades del mundo
    this.trackHalfWidth = 3.6;   // Ancho total de la pista / 2
    this.trackLength = 120;      // Profundidad de visión del horizonte
    this.segmentSpacing = 5;     // Distancia entre marcas de suelo
    this.zOffset = 0;            // Desplazamiento animado del suelo

    // Edificios procedurales en el horizonte FinTech
    this.buildings = [];
    this.initCity();
  }

  initCity() {
    this.buildings = [];
    const colors = ["#0e1e38", "#122544", "#0a1526", "#152c52", "#0c1a2f"];
    const count = 28;
    for (let i = 0; i < count; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const xDist = (4.5 + Math.random() * 8.5) * side;
      const zPos = 20 + Math.random() * 95;
      const width = 2.5 + Math.random() * 3.5;
      const height = 4.0 + Math.random() * 8.0;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const hasSign = Math.random() > 0.6;
      const signText = hasSign ? ["FINGO", "OPEN FINANCE", "DECRETO 0368", "AVALANCHA", "WIP ≤ 2", "0% MORA"][Math.floor(Math.random() * 6)] : "";

      this.buildings.push({ x: xDist, z: zPos, width, height, color, hasSign, signText });
    }
  }

  update(speed, dt) {
    this.zOffset = (this.zOffset + speed * dt) % this.segmentSpacing;
  }

  render(currentLevelInfo) {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const horizonY = h * this.camera.horizonY;

    // 1. Cielo Gradiente FinTech Dark
    const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY + 30);
    skyGrad.addColorStop(0, "#030712");
    skyGrad.addColorStop(0.65, "#0B1528");
    skyGrad.addColorStop(0.95, "#152C52");
    skyGrad.addColorStop(1, "#2B62C6");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, horizonY + 40);

    // Resplandor del horizonte
    const horizonGlow = ctx.createRadialGradient(w / 2, horizonY, 10, w / 2, horizonY, w * 0.55);
    horizonGlow.addColorStop(0, "rgba(72, 192, 155, 0.45)");
    horizonGlow.addColorStop(0.5, "rgba(43, 98, 198, 0.2)");
    horizonGlow.addColorStop(1, "rgba(5, 9, 20, 0)");
    ctx.fillStyle = horizonGlow;
    ctx.fillRect(0, horizonY - 60, w, 120);

    // 2. Dibujar Skyline de Rascacielos FinTech
    this.renderSkyline();

    // 3. Suelo / Pista FinTech
    const groundGrad = ctx.createLinearGradient(0, horizonY, 0, h);
    groundGrad.addColorStop(0, "#08101E");
    groundGrad.addColorStop(0.3, "#0C172A");
    groundGrad.addColorStop(1, "#050914");
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, horizonY, w, h - horizonY);

    // 4. Superficie de la Pista de 3 Carriles en Proyección 3D
    this.renderTrackSurface();

    // 5. Arcos de Datos y Letreros de Nivel cada cierto tramo
    this.renderOverheadGantries(currentLevelInfo);
  }

  renderSkyline() {
    const ctx = this.ctx;
    // Ordenar edificios de más lejano a más cercano
    const sorted = [...this.buildings].sort((a, b) => b.z - a.z);

    for (const b of sorted) {
      const pBase = this.camera.project(b.x, 0, b.z);
      const pTop = this.camera.project(b.x, b.height, b.z);

      if (!pBase.visible || !pTop.visible) continue;

      const screenW = this.camera.projectSize(b.width, b.z);
      const screenH = pBase.screenY - pTop.screenY;

      ctx.fillStyle = b.color;
      ctx.fillRect(pBase.screenX - screenW / 2, pTop.screenY, screenW, screenH);

      // Borde suave de neón en la cúspide
      ctx.strokeStyle = "rgba(72, 192, 155, 0.25)";
      ctx.lineWidth = 1;
      ctx.strokeRect(pBase.screenX - screenW / 2, pTop.screenY, screenW, screenH);

      // Ventanas con luces aleatorias
      ctx.fillStyle = "rgba(147, 197, 253, 0.25)";
      const winCols = 3;
      const winRows = 6;
      const winW = screenW / (winCols * 2);
      const winH = screenH / (winRows * 2.5);

      for (let r = 1; r < winRows; r++) {
        for (let c = 0; c < winCols; c++) {
          if ((b.z + r + c) % 3 === 0) {
            ctx.fillRect(
              pBase.screenX - screenW / 2 + (c * 2 + 0.5) * winW,
              pTop.screenY + (r * 2) * winH,
              winW,
              winH * 0.7
            );
          }
        }
      }

      // Letrero luminoso si existe
      if (b.hasSign && b.z < 60) {
        ctx.fillStyle = "#48C09B";
        ctx.font = `bold ${Math.max(8, Math.round(11 * pBase.scale / 10))}px "Plus Jakarta Sans", sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText(b.signText, pBase.screenX, pTop.screenY + 14);
      }
    }
  }

  renderTrackSurface() {
    const ctx = this.ctx;
    const zFar = this.trackLength;
    const zNear = 0.5;

    // Polígono de la pista principal
    const pFarL = this.camera.project(-this.trackHalfWidth, 0, zFar);
    const pFarR = this.camera.project(this.trackHalfWidth, 0, zFar);
    const pNearL = this.camera.project(-this.trackHalfWidth, 0, zNear);
    const pNearR = this.camera.project(this.trackHalfWidth, 0, zNear);

    if (pFarL.visible && pNearL.visible) {
      // Fondo de la calzada
      ctx.beginPath();
      ctx.moveTo(pFarL.screenX, pFarL.screenY);
      ctx.lineTo(pFarR.screenX, pFarR.screenY);
      ctx.lineTo(pNearR.screenX, pNearR.screenY);
      ctx.lineTo(pNearL.screenX, pNearL.screenY);
      ctx.closePath();

      const roadGrad = ctx.createLinearGradient(0, pFarL.screenY, 0, pNearL.screenY);
      roadGrad.addColorStop(0, "#0d1b2a");
      roadGrad.addColorStop(0.5, "#14253d");
      roadGrad.addColorStop(1, "#182c47");
      ctx.fillStyle = roadGrad;
      ctx.fill();

      // Rieles luminosos en los bordes de la pista
      ctx.strokeStyle = "#48C09B";
      ctx.lineWidth = 3;
      ctx.shadowColor = "#48C09B";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(pFarL.screenX, pFarL.screenY);
      ctx.lineTo(pNearL.screenX, pNearL.screenY);
      ctx.stroke();

      ctx.strokeStyle = "#2B62C6";
      ctx.shadowColor = "#2B62C6";
      ctx.beginPath();
      ctx.moveTo(pFarR.screenX, pFarR.screenY);
      ctx.lineTo(pNearR.screenX, pNearR.screenY);
      ctx.stroke();

      ctx.shadowBlur = 0; // Reset
    }

    // Líneas divisorias de los 3 carriles: x = -1.1 y x = 1.1
    const laneDividers = [-1.1, 1.1];
    for (const lx of laneDividers) {
      const farDiv = this.camera.project(lx, 0, zFar);
      const nearDiv = this.camera.project(lx, 0, zNear);

      if (farDiv.visible && nearDiv.visible) {
        ctx.strokeStyle = "rgba(72, 192, 155, 0.35)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([12, 14]);
        ctx.lineDashOffset = -this.zOffset * 10;
        ctx.beginPath();
        ctx.moveTo(farDiv.screenX, farDiv.screenY);
        ctx.lineTo(nearDiv.screenX, nearDiv.screenY);
        ctx.stroke();
        ctx.setLineDash([]); // Reset
      }
    }

    // Traviesas horizontales luminosas en movimiento (sensación de velocidad Subway)
    for (let z = this.segmentSpacing - this.zOffset; z < zFar; z += this.segmentSpacing) {
      const pL = this.camera.project(-this.trackHalfWidth, 0, z);
      const pR = this.camera.project(this.trackHalfWidth, 0, z);

      if (pL.visible && pR.visible) {
        const alpha = Math.max(0.04, 0.45 * (1 - z / zFar));
        ctx.strokeStyle = `rgba(147, 197, 253, ${alpha})`;
        ctx.lineWidth = Math.max(1, 2.5 * pL.scale / 12);
        ctx.beginPath();
        ctx.moveTo(pL.screenX, pL.screenY);
        ctx.lineTo(pR.screenX, pR.screenY);
        ctx.stroke();
      }
    }
  }

  renderOverheadGantries(currentLevelInfo) {
    const ctx = this.ctx;
    // Arcos de datos ubicados en distancias fijas
    const gantryZ = [45, 90];

    for (const z of gantryZ) {
      const pL = this.camera.project(-this.trackHalfWidth - 0.5, 0, z);
      const pR = this.camera.project(this.trackHalfWidth + 0.5, 0, z);
      const pTL = this.camera.project(-this.trackHalfWidth - 0.5, 4.2, z);
      const pTR = this.camera.project(this.trackHalfWidth + 0.5, 4.2, z);

      if (pL.visible && pR.visible && pTL.visible && pTR.visible) {
        ctx.strokeStyle = "rgba(43, 98, 198, 0.7)";
        ctx.lineWidth = Math.max(2, 4 * pL.scale / 10);

        // Columnas laterales y viga superior
        ctx.beginPath();
        ctx.moveTo(pL.screenX, pL.screenY);
        ctx.lineTo(pTL.screenX, pTL.screenY);
        ctx.lineTo(pTR.screenX, pTR.screenY);
        ctx.lineTo(pR.screenX, pR.screenY);
        ctx.stroke();

        // Letrero centrado en la viga
        const centerTop = this.camera.project(0, 4.0, z);
        if (centerTop.visible) {
          const fontSize = Math.max(9, Math.round(14 * centerTop.scale / 10));
          ctx.fillStyle = "rgba(13, 27, 42, 0.85)";
          const bannerW = 120 * (centerTop.scale / 10);
          const bannerH = 22 * (centerTop.scale / 10);

          ctx.fillRect(centerTop.screenX - bannerW / 2, centerTop.screenY - bannerH / 2, bannerW, bannerH);
          ctx.strokeStyle = "#48C09B";
          ctx.lineWidth = 1;
          ctx.strokeRect(centerTop.screenX - bannerW / 2, centerTop.screenY - bannerH / 2, bannerW, bannerH);

          ctx.fillStyle = "#FFFFFF";
          ctx.font = `bold ${fontSize}px "Plus Jakarta Sans", sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          const text = currentLevelInfo ? `NIVEL ${currentLevelInfo.levelNumber} · FINGO` : "FINGO METODOLOGÍAS ÁGILES";
          ctx.fillText(text, centerTop.screenX, centerTop.screenY);
        }
      }
    }
  }
}
