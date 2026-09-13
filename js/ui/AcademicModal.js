/**
 * FinGo - Modal de Hitos Académicos (AcademicModal)
 * Despliega la información oficial extraída de los insumos del curso al superar cada nivel,
 * estructurando los 6 entregables con métricas clave, lecciones aprendidas y análisis riguroso.
 */

class AcademicModal {
  constructor(containerId, onContinueCallback) {
    this.container = document.getElementById(containerId);
    this.onContinue = onContinueCallback;
    this.currentDeliverable = null;
  }

  show(deliverable, hasNextLevel = true) {
    this.currentDeliverable = deliverable;
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="academic-modal-overlay">
        <div class="academic-modal-card animate-scale-up" style="--accent-color: ${deliverable.themeColor}">
          
          <!-- Encabezado del Hito Académico -->
          <div class="academic-header">
            <div class="academic-badge-row">
              <span class="academic-pill" style="background: ${deliverable.themeColor}22; color: ${deliverable.themeColor}; border: 1px solid ${deliverable.themeColor}55;">
                ${deliverable.badge} · NIVEL ${deliverable.levelNumber} COMPLETADO
              </span>
              <span class="academic-uni-tag">🎓 Univ. de La Salle · Especialización FinTech</span>
            </div>
            <h2 class="academic-title">${deliverable.icon} ${deliverable.title}</h2>
            <p class="academic-subtitle">${deliverable.subtitle}</p>
          </div>

          <!-- Resumen Ejecutivo Destacado -->
          <div class="academic-summary-box">
            <strong>💡 Resumen Ejecutivo:</strong>
            <p>${deliverable.summary}</p>
          </div>

          <!-- Métricas Cuantificables del Entregable -->
          <div class="academic-metrics-grid">
            ${deliverable.keyMetrics.map(m => `
              <div class="academic-metric-card">
                <span class="academic-metric-value" style="color: ${deliverable.themeColor}">${m.value}</span>
                <strong class="academic-metric-label">${m.label}</strong>
                <small class="academic-metric-desc">${m.desc}</small>
              </div>
            `).join("")}
          </div>

          <!-- Secciones de Contenido Real del Insumo -->
          <div class="academic-body-content">
            ${deliverable.sections.map(sec => `
              <div class="academic-section-block">
                <h4 class="academic-section-title">${sec.title}</h4>
                ${sec.content ? `<p class="academic-paragraph">${sec.content}</p>` : ""}
                ${sec.bullets ? `
                  <ul class="academic-bullet-list">
                    ${sec.bullets.map(b => `<li>${b}</li>`).join("")}
                  </ul>
                ` : ""}
                ${sec.ericGrid ? this.renderEricPreview(sec.ericGrid) : ""}
              </div>
            `).join("")}
          </div>

          <!-- Ficha del Equipo FinGo -->
          <div class="academic-team-footer">
            <span class="team-label">Equipo de Trabajo:</span>
            <div class="team-chips">
              <span class="team-chip">👤 Esteban David Quiros Marin</span>
              <span class="team-chip">👤 Deyanira Castaño Cholo</span>
              <span class="team-chip">👤 Juan Diego Valencia</span>
              <span class="team-chip">👤 Aura Mendoza</span>
            </div>
          </div>

          <!-- Botones de Acción -->
          <div class="academic-actions">
            ${hasNextLevel ? `
              <button id="btn-academic-continue" class="btn-primary-fingo" style="background: ${deliverable.themeColor}">
                <span>Avanzar al Nivel ${deliverable.levelNumber + 1}</span>
                <span class="btn-arrow">→</span>
              </button>
            ` : `
              <button id="btn-academic-pitch" class="btn-primary-fingo" style="background: #059669">
                <span>🏆 Explorar Matriz ERIC & Pitch Deck Completo</span>
                <span class="btn-arrow">✨</span>
              </button>
            `}
            <button id="btn-academic-close" class="btn-secondary-fingo">
              Ver Menú Principal
            </button>
          </div>

        </div>
      </div>
    `;

    this.container.classList.remove("hidden");

    // Event Listeners
    const btnContinue = document.getElementById("btn-academic-continue");
    if (btnContinue) {
      btnContinue.addEventListener("click", () => {
        this.hide();
        if (this.onContinue) this.onContinue(deliverable.levelNumber + 1);
      });
    }

    const btnPitch = document.getElementById("btn-academic-pitch");
    if (btnPitch) {
      btnPitch.addEventListener("click", () => {
        this.hide();
        window.pitchViewer.show(6);
      });
    }

    const btnClose = document.getElementById("btn-academic-close");
    if (btnClose) {
      btnClose.addEventListener("click", () => {
        this.hide();
        window.uiManager.showMainMenu();
      });
    }
  }

  renderEricPreview(eric) {
    return `
      <div class="eric-preview-grid">
        <div class="eric-quadrant eric-eliminar">
          <div class="eric-quad-header">❌ ELIMINAR</div>
          <ul>${eric.eliminar.map(e => `<li>${e}</li>`).join("")}</ul>
        </div>
        <div class="eric-quadrant eric-reducir">
          <div class="eric-quad-header">📉 REDUCIR</div>
          <ul>${eric.reducir.map(r => `<li>${r}</li>`).join("")}</ul>
        </div>
        <div class="eric-quadrant eric-incrementar">
          <div class="eric-quad-header">📈 INCREMENTAR</div>
          <ul>${eric.incrementar.map(i => `<li>${i}</li>`).join("")}</ul>
        </div>
        <div class="eric-quadrant eric-crear">
          <div class="eric-quad-header">✨ CREAR</div>
          <ul>${eric.crear.map(c => `<li>${c}</li>`).join("")}</ul>
        </div>
      </div>
    `;
  }

  hide() {
    if (this.container) {
      this.container.classList.add("hidden");
      this.container.innerHTML = "";
    }
  }
}
