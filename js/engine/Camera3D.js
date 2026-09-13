/**
 * FinGo - Cámara de Proyección Perspectiva 3D
 * Transforma coordenadas espaciales (X: carril, Y: altura, Z: distancia)
 * en coordenadas 2D del Canvas HTML5 con escala y profundidad precisas.
 */

class Camera3D {
  constructor(canvas) {
    this.canvas = canvas;
    this.focalLength = 380; // Distancia focal de la lente
    this.x = 0;             // Posición X de la cámara
    this.y = 2.4;           // Altura de la cámara (por encima del jugador)
    this.z = -3.2;          // Distancia detrás del jugador
    this.horizonY = 0.44;   // Posición relativa del horizonte (44% de la altura de la pantalla)
  }

  update(playerX) {
    // La cámara sigue suavemente al jugador en el eje X para dar dinamismo
    this.x += (playerX * 0.4 - this.x) * 0.15;
  }

  project(worldX, worldY, worldZ) {
    const dx = worldX - this.x;
    const dy = worldY - this.y;
    const dz = worldZ - this.z;

    if (dz <= 0.1) {
      return { visible: false, screenX: 0, screenY: 0, scale: 0, depth: dz };
    }

    const scale = this.focalLength / dz;
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height * this.horizonY;

    const screenX = centerX + dx * scale;
    const screenY = centerY - dy * scale;

    return {
      visible: true,
      screenX,
      screenY,
      scale,
      depth: dz
    };
  }

  // Convierte un radio o dimensión del mundo en píxeles de pantalla
  projectSize(worldSize, worldZ) {
    const dz = worldZ - this.z;
    if (dz <= 0.1) return 0;
    return worldSize * (this.focalLength / dz);
  }
}
