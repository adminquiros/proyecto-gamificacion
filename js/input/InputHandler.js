/**
 * FinGo - Gestor de Entradas (InputHandler)
 * Soporta controles de teclado (Flechas, WASD, Espacio),
 * gestos táctiles móviles (Swipe horizontal/vertical) y botones táctiles en pantalla.
 */

class InputHandler {
  constructor(gameEngine) {
    this.engine = gameEngine;
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.minSwipeDistance = 35; // Píxeles mínimos para registrar swipe

    this.initKeyboard();
    this.initTouch();
    this.initVirtualButtons();
  }

  initKeyboard() {
    window.addEventListener("keydown", (e) => {
      // Evitar scroll con flechas o espacio si estamos jugando
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) {
        e.preventDefault();
      }

      if (this.engine.state !== "PLAYING") {
        if (e.code === "Escape" || e.key === "p" || e.key === "P") {
          this.engine.togglePause();
        }
        return;
      }

      const player = this.engine.player;

      switch (e.code) {
        case "ArrowLeft":
        case "KeyA":
          if (player.moveLeft()) this.engine.sound.playLaneChange();
          break;

        case "ArrowRight":
        case "KeyD":
          if (player.moveRight()) this.engine.sound.playLaneChange();
          break;

        case "ArrowUp":
        case "KeyW":
        case "Space":
          if (player.jump()) this.engine.sound.playJump();
          break;

        case "ArrowDown":
        case "KeyS":
          if (player.slide()) this.engine.sound.playSlide();
          break;

        case "KeyP":
        case "Escape":
          this.engine.togglePause();
          break;
      }
    });
  }

  initTouch() {
    const canvas = this.engine.canvas;

    canvas.addEventListener("touchstart", (e) => {
      if (e.touches.length > 0) {
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    canvas.addEventListener("touchend", (e) => {
      if (this.engine.state !== "PLAYING") return;
      if (e.changedTouches.length === 0) return;

      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      const dx = touchEndX - this.touchStartX;
      const dy = touchEndY - this.touchStartY;

      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      if (Math.max(absDx, absDy) < this.minSwipeDistance) return;

      const player = this.engine.player;

      if (absDx > absDy) {
        // Deslizamiento Horizontal (Cambio de carril)
        if (dx > 0) {
          if (player.moveRight()) this.engine.sound.playLaneChange();
        } else {
          if (player.moveLeft()) this.engine.sound.playLaneChange();
        }
      } else {
        // Deslizamiento Vertical (Salto o Agacharse)
        if (dy < 0) {
          if (player.jump()) this.engine.sound.playJump();
        } else {
          if (player.slide()) this.engine.sound.playSlide();
        }
      }
    }, { passive: true });
  }

  initVirtualButtons() {
    const bindBtn = (id, action) => {
      const btn = document.getElementById(id);
      if (!btn) return;

      const handle = (e) => {
        e.preventDefault();
        if (this.engine.state === "PLAYING") {
          action();
        }
      };

      btn.addEventListener("touchstart", handle, { passive: false });
      btn.addEventListener("mousedown", handle);
    };

    const player = this.engine.player;

    bindBtn("btn-touch-left", () => {
      if (player.moveLeft()) this.engine.sound.playLaneChange();
    });

    bindBtn("btn-touch-right", () => {
      if (player.moveRight()) this.engine.sound.playLaneChange();
    });

    bindBtn("btn-touch-jump", () => {
      if (player.jump()) this.engine.sound.playJump();
    });

    bindBtn("btn-touch-slide", () => {
      if (player.slide()) this.engine.sound.playSlide();
    });
  }
}
