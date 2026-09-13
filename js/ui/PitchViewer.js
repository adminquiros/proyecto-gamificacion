/**
 * FinGo - Visor Ejecutivo de Pitch y Matriz ERIC (PitchViewer)
 * Proporciona una interfaz de presentación académica profesional con estilo Gamma.app,
 * permitiendo sustentar el modelo de negocio, la Matriz ERIC, los 6 entregables y el backlog
 * ante el docente y compañeros de forma interactiva y sin depender de plataformas externas.
 */

class PitchViewer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentSlide = 0;
    this.totalSlides = 8;
  }

  show(slideIndex = 0) {
    this.currentSlide = slideIndex;
    if (!this.container) return;

    this.render();
    this.container.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  hide() {
    if (this.container) {
      this.container.classList.add("hidden");
      this.container.innerHTML = "";
      document.body.style.overflow = "";
    }
  }

  nextSlide() {
    if (this.currentSlide < this.totalSlides - 1) {
      this.currentSlide++;
      this.render();
    }
  }

  prevSlide() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
      this.render();
    }
  }

  goToSlide(idx) {
    this.currentSlide = idx;
    this.render();
  }

  render() {
    const slides = [
      this.renderSlide0_Cover(),
      this.renderSlide1_ProblemSolution(),
      this.renderSlide2_Porter(),
      this.renderSlide3_BacklogSprint2(),
      this.renderSlide4_LeanValidation(),
      this.renderSlide5_OKRsScrumban(),
      this.renderSlide6_ConflictResolution(),
      this.renderSlide7_MatrixERIC_Pitch()
    ];

    this.container.innerHTML = `
      <div class="pitch-modal-overlay">
        <div class="pitch-container">
          
          <!-- Barra Superior de Control de Presentación -->
          <div class="pitch-navbar">
            <div class="pitch-brand">
              <span class="pitch-logo-symbol">🚀</span>
              <span class="pitch-logo-text"><strong>FinGo</strong> · Sustentación Ejecutiva</span>
            </div>

            <!-- Navegación de Diapositivas por Puntos / Tabs -->
            <div class="pitch-nav-tabs">
              <button class="pitch-tab ${this.currentSlide === 0 ? "active" : ""}" onclick="window.pitchViewer.goToSlide(0)">1. Portada</button>
              <button class="pitch-tab ${this.currentSlide === 1 ? "active" : ""}" onclick="window.pitchViewer.goToSlide(1)">2. Problema & Valor</button>
              <button class="pitch-tab ${this.currentSlide === 2 ? "active" : ""}" onclick="window.pitchViewer.goToSlide(2)">3. Porter 5F</button>
              <button class="pitch-tab ${this.currentSlide === 3 ? "active" : ""}" onclick="window.pitchViewer.goToSlide(3)">4. Backlog Sprint 2</button>
              <button class="pitch-tab ${this.currentSlide === 4 ? "active" : ""}" onclick="window.pitchViewer.goToSlide(4)">5. Lean Startup</button>
              <button class="pitch-tab ${this.currentSlide === 5 ? "active" : ""}" onclick="window.pitchViewer.goToSlide(5)">6. OKRs & Scrumban</button>
              <button class="pitch-tab ${this.currentSlide === 6 ? "active" : ""}" onclick="window.pitchViewer.goToSlide(6)">7. Crisis & Soft Launch</button>
              <button class="pitch-tab ${this.currentSlide === 7 ? "active" : ""}" onclick="window.pitchViewer.goToSlide(7)">8. Matriz ERIC & Cierre</button>
            </div>

            <div class="pitch-nav-actions">
              <button class="btn-pitch-close" onclick="window.pitchViewer.hide()">
                ✕ Cerrar Presentación
              </button>
            </div>
          </div>

          <!-- Contenido Activo de la Diapositiva -->
          <div class="pitch-slide-viewport">
            ${slides[this.currentSlide]}
          </div>

          <!-- Barra Inferior de Navegación -->
          <div class="pitch-footer">
            <div class="pitch-slide-indicator">
              Diapositiva ${this.currentSlide + 1} de ${this.totalSlides}
            </div>

            <div class="pitch-slide-controls">
              <button class="btn-slide-nav" onclick="window.pitchViewer.prevSlide()" ${this.currentSlide === 0 ? "disabled" : ""}>
                ← Anterior
              </button>
              <button class="btn-slide-nav primary" onclick="window.pitchViewer.nextSlide()" ${this.currentSlide === this.totalSlides - 1 ? "disabled" : ""}>
                Siguiente →
              </button>
            </div>
          </div>

        </div>
      </div>
    `;
  }

  /* --- DIAPOSITIVAS EJECUTIVAS --- */

  renderSlide0_Cover() {
    return `
      <div class="slide-content slide-cover animate-fade-in">
        <div class="cover-meta-badge">
          🎓 UNIVERSIDAD DE LA SALLE · ESPECIALIZACIÓN EN FINTECH · 2026
        </div>
        <h1 class="cover-title">
          <span class="brand-blue">Fin</span><span class="brand-mint">GO</span>
        </h1>
        <h2 class="cover-subtitle">Plataforma Inteligente de Gestión de Deudas & Salud Financiera</h2>
        <p class="cover-desc">
          Sustentación ejecutiva final de la asignatura <strong>Metodologías Ágiles de Gestión</strong>, integrando el diagnóstico del entorno, validación Lean Startup, gestión Scrumban, resolución ágil de conflictos y Matriz ERIC.
        </p>

        <div class="cover-team-grid">
          <div class="cover-member-card">
            <span class="member-icon">👤</span>
            <strong>Esteban David Quiros Marin</strong>
          </div>
          <div class="cover-member-card">
            <span class="member-icon">👤</span>
            <strong>Deyanira Castaño Cholo</strong>
          </div>
          <div class="cover-member-card">
            <span class="member-icon">👤</span>
            <strong>Juan Diego Valencia</strong>
          </div>
          <div class="cover-member-card">
            <span class="member-icon">👤</span>
            <strong>Aura Mendoza</strong>
          </div>
        </div>
      </div>
    `;
  }

  renderSlide1_ProblemSolution() {
    return `
      <div class="slide-content animate-fade-in">
        <div class="slide-header">
          <span class="slide-tag">DIAGNÓSTICO & PROPUESTA DE VALOR</span>
          <h2>El Dolor del Endeudamiento y la Solución FinGo</h2>
        </div>

        <div class="slide-split-grid">
          <div class="slide-card problem-card">
            <h3 class="card-title text-red">⚠️ El Problema en Colombia</h3>
            <p>La persona promedio administra sus pasivos de forma fragmentada en 4 o más entidades:</p>
            <ul class="slide-list">
              <li><strong>Desconexión:</strong> Tarjetas bancarias, créditos de consumo, microcréditos fintech y créditos Icetex sin consolidación.</li>
              <li><strong>Opacidad de Costos:</strong> Desconocimiento total de la Tasa Efectiva Anual (TEA) y cobros de comisiones ocultas.</li>
              <li><strong>Estrés y Multas:</strong> Olvidos involuntarios de fechas de corte que detonan intereses moratorios y reporte negativo en centrales de riesgo.</li>
              <li><strong>Espiral de Deuda:</strong> Se pagan intereses pero el saldo a capital casi no disminuye.</li>
            </ul>
          </div>

          <div class="slide-card solution-card">
            <h3 class="card-title text-mint">💡 La Solución FinGo</h3>
            <p>Un centro de mando inteligente que conecta lo que tienes, lo que debes y cómo liquidarlo:</p>
            <ul class="slide-list">
              <li><strong>Consolidación Automática:</strong> Vista unificada de activos y pasivos mediante Open Finance (Decreto 0368 de 2026).</li>
              <li><strong>Motor Algorítmico de Priorización:</strong> Métodos comprobados de <em>Avalancha</em> (mayor tasa) y <em>Bola de Nieve</em> (menor saldo).</li>
              <li><strong>Alertas Inteligentes Preventivas:</strong> Notificaciones multicanal (WhatsApp/Push) para eliminar 100% las moras.</li>
              <li><strong>Simulación a Costo $0:</strong> Diagnóstico en menos de 3 minutos sin exigir datos bancarios ultrasensibles.</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  renderSlide2_Porter() {
    return `
      <div class="slide-content animate-fade-in">
        <div class="slide-header">
          <span class="slide-tag">ENTREGABLE 1 · ANÁLISIS ESTRATÉGICO</span>
          <h2>Evaluación del Entorno bajo las 5 Fuerzas de Porter</h2>
        </div>

        <div class="porter-grid">
          <div class="porter-card">
            <div class="porter-header">
              <strong>1. Poder de Proveedores</strong>
              <span class="badge-amber">MEDIO - ALTO</span>
            </div>
            <p>Dependencia de infraestructura Cloud (AWS/Azure) y agregadores de Open Finance. Se mitiga mediante el uso de APIs estandarizadas e interoperables.</p>
          </div>

          <div class="porter-card">
            <div class="porter-header">
              <strong>2. Poder de Clientes</strong>
              <span class="badge-red">ALTO</span>
            </div>
            <p>Bajos costos de cambio. El usuario migra fácilmente a Excel o apps bancarias si no percibe valor tangible y cuantificable en sus primeras 24 horas.</p>
          </div>

          <div class="porter-card">
            <div class="porter-header">
              <strong>3. Nuevos Entrantes</strong>
              <span class="badge-red">ALTO</span>
            </div>
            <p>El boom fintech atrae capital de riesgo. La barrera defensiva de FinGo es la confianza, el cumplimiento normativo estricto y los algoritmos propietarios.</p>
          </div>

          <div class="porter-card">
            <div class="porter-header">
              <strong>4. Productos Sustitutos</strong>
              <span class="badge-amber">MEDIO - ALTO</span>
            </div>
            <p>Hojas de cálculo caseras y agendas físicas. Ningún sustituto ofrece priorización algorítmica automatizada sin esfuerzo manual constante.</p>
          </div>

          <div class="porter-card highlight-porter">
            <div class="porter-header">
              <strong>5. Rivalidad de Competidores</strong>
              <span class="badge-blue">78% GENERAL / BAJA EN NICHO</span>
            </div>
            <p>Nequi, Daviplata y RappiPay compiten en transacciones y gastos corrientes. <strong>Nadie ataca de forma integral el desendeudamiento planificado</strong> (activos + pasivos + plan de pago).</p>
          </div>
        </div>
      </div>
    `;
  }

  renderSlide3_BacklogSprint2() {
    return `
      <div class="slide-content animate-fade-in">
        <div class="slide-header">
          <span class="slide-tag">ENTREGABLE 2 · GESTIÓN ÁGIL</span>
          <h2>Product Backlog Consolidado: 30 Historias de Usuario (137 Puntos)</h2>
        </div>

        <div class="slide-stats-banner">
          <div class="stat-item"><span class="stat-num">9</span><small>HUs Críticas</small></div>
          <div class="stat-item"><span class="stat-num">14</span><small>HUs Altas</small></div>
          <div class="stat-item"><span class="stat-num">7</span><small>HUs Medias</small></div>
          <div class="stat-item"><span class="stat-num">137</span><small>Puntos Totales</small></div>
        </div>

        <div class="backlog-three-frentes">
          <div class="frente-card">
            <div class="frente-header">
              <span class="frente-icon">⚖️</span>
              <h4>Cumplimiento Normativo</h4>
              <span class="frente-badge">11 HUs · 43 pts</span>
            </div>
            <ul class="frente-list">
              <li><strong>HU-01 a HU-03:</strong> Protección de Datos Personales (Ley 1581 de 2012).</li>
              <li><strong>HU-04 a HU-06:</strong> Finanzas Abiertas (Decreto 0368 de 2026).</li>
              <li><strong>HU-07 a HU-08:</strong> Protección al Consumidor Financiero (Ley 1328 de 2009).</li>
              <li><strong>HU-09:</strong> Prevención LA/FT (Circular 027 de 2020 SFC).</li>
              <li><strong>HU-10 a HU-11:</strong> Ciberseguridad y Cifrado SFC.</li>
            </ul>
          </div>

          <div class="frente-card">
            <div class="frente-header">
              <span class="frente-icon">🎨</span>
              <h4>Identidad de Marca</h4>
              <span class="frente-badge">9 HUs · 37 pts</span>
            </div>
            <ul class="frente-list">
              <li><strong>HU-12 a HU-14:</strong> Anatomía del Logotipo (Flecha + Bucle G).</li>
              <li><strong>HU-15 a HU-16:</strong> Colores Corporativos (#2B62C6, #48C09B, #0D1B2A).</li>
              <li><strong>HU-17 a HU-18:</strong> Tipografía Plus Jakarta Sans & Inter.</li>
              <li><strong>HU-19 a HU-20:</strong> Integración UI/UX y Accesibilidad WCAG 2.1 AA.</li>
            </ul>
          </div>

          <div class="frente-card">
            <div class="frente-header">
              <span class="frente-icon">📱</span>
              <h4>Paneles y Módulos</h4>
              <span class="frente-badge">10 HUs · 57 pts</span>
            </div>
            <ul class="frente-list">
              <li><strong>HU-21 a HU-22:</strong> Onboarding y Diagnóstico Inicial en &lt; 3 min.</li>
              <li><strong>HU-23:</strong> Dashboard General de Activos y Pasivos.</li>
              <li><strong>HU-24:</strong> Módulo de Deudas Unificadas por Acreedor.</li>
              <li><strong>HU-25 a HU-26:</strong> Motor de Priorización (Avalancha / Nieve).</li>
              <li><strong>HU-27 a HU-30:</strong> Alertas, Educación Financiera y Perfil.</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  renderSlide4_LeanValidation() {
    return `
      <div class="slide-content animate-fade-in">
        <div class="slide-header">
          <span class="slide-tag">ENTREGABLE 3 · LEAN STARTUP</span>
          <h2>Cuatro Hipótesis Entraron al Aula. Una Sola Sobrevivió.</h2>
        </div>

        <div class="lean-grid">
          <div class="lean-card card-refutada">
            <span class="verdict-tag red">REFUTADA</span>
            <h4>H1 · Vinculación de Tarjeta</h4>
            <p><em>"El usuario conectará su tarjeta de nómina para automatizar pagos."</em></p>
            <div class="lean-reason">
              <strong>Resultado:</strong> Desconfianza inmediata. Temor a cobros no autorizados, clonación y pérdida de control.
            </div>
          </div>

          <div class="lean-card card-sostenida">
            <span class="verdict-tag green">SOSTENIDA CON CONDICIÓN</span>
            <h4>H2 · Diagnóstico Gratuito</h4>
            <p><em>"Un diagnóstico express en &lt; 3 min basta para que entregue sus datos."</em></p>
            <div class="lean-reason">
              <strong>Resultado:</strong> Validada si funciona como simulación interactiva sin exigir contraseñas bancarias de entrada.
            </div>
          </div>

          <div class="lean-card card-sin-consenso">
            <span class="verdict-tag amber">SIN CONSENSO</span>
            <h4>H3 · Suscripción $9.000</h4>
            <p><em>"Un endeudado pagaría una suscripción fija por una ruta de salida."</em></p>
            <div class="lean-reason">
              <strong>Resultado:</strong> El 50% prefería mensualidad fija; el otro 50% solo pagaría una comisión sobre el ahorro real logrado.
            </div>
          </div>

          <div class="lean-card card-refutada">
            <span class="verdict-tag red">REFUTADA EN EL NÚCLEO</span>
            <h4>H4 · Gamificación</h4>
            <p><em>"Convertirlo en juego con niveles y puntos motiva a pagar."</em></p>
            <div class="lean-reason">
              <strong>Resultado:</strong> Rechazo operativo. El usuario en estrés de deuda busca alivio económico, no medallas cosméticas.
            </div>
          </div>
        </div>

        <div class="pivot-banner">
          <span class="pivot-badge">EL GRAN PIVOTE FINTECH</span>
          <p><strong>"El producto no cambia. Cambia el orden en que pide confianza."</strong> La conexión bancaria se movió al final del embudo, ofreciendo valor y diagnóstico antes de pedir datos sensibles.</p>
        </div>
      </div>
    `;
  }

  renderSlide5_OKRsScrumban() {
    return `
      <div class="slide-content animate-fade-in">
        <div class="slide-header">
          <span class="slide-tag">ENTREGABLE 4 · ESTRATEGIA Y OPERACIONES</span>
          <h2>Sistema de OKRs, KPIs y Framework Híbrido Scrumban</h2>
        </div>

        <div class="okr-spotlight-card">
          <span class="okr-label">🎯 OKR ESTRATÉGICO PRINCIPAL</span>
          <h3>"Convertir a FinGo en el centro de mando financiero preferido por los jóvenes profesionales, transformando el estrés de múltiples deudas en una ruta clara hacia la libertad financiera."</h3>
          <div class="krs-row">
            <div class="kr-box"><strong>KR 1 · Validación</strong><span>300 usuarios conectando ≥ 2 deudas vía Open Finance</span></div>
            <div class="kr-box"><strong>KR 2 · Tiempo</strong><span>Reducción del 70% en tiempo de control (&lt; 3 min)</span></div>
            <div class="kr-box"><strong>KR 3 · Tracción</strong><span>Validación de modelo freemium + % de ahorro</span></div>
          </div>
        </div>

        <div class="slide-split-grid" style="margin-top: 20px;">
          <div class="slide-card">
            <h4>🚫 Métricas de Vanidad que Evitamos</h4>
            <ul class="slide-list">
              <li>❌ "125.767 descargas en tiendas" (No mide uso ni pago de deudas).</li>
              <li>❌ "3.3 millones de impresiones en redes" (Solo infla el ego comercial).</li>
            </ul>
          </div>
          <div class="slide-card">
            <h4>✅ Métricas Accionables que Medimos</h4>
            <ul class="slide-list">
              <li>✔️ "70% de usuarios ejecutó su primer plan de pago a tiempo".</li>
              <li>✔️ "≥ 40% de usuarios muy decepcionados si FinGo desaparece (Sean Ellis)".</li>
              <li>✔️ "Ahorro neto en pesos de intereses pagados al banco".</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  renderSlide6_ConflictResolution() {
    return `
      <div class="slide-content animate-fade-in">
        <div class="slide-header">
          <span class="slide-tag">ENTREGABLE 5 · GESTIÓN DEL CAMBIO</span>
          <h2>Crisis de Lanzamiento del MVP: Soft Launch en 3 Fases</h2>
        </div>

        <div class="conflict-roles-grid">
          <div class="role-bubble">
            <strong>Esteban Quirós</strong>
            <p>«Sin concepto legal ni validación SFC. Lanzar expone a sanciones severas.»</p>
          </div>
          <div class="role-bubble">
            <strong>Deyanira Castaño</strong>
            <p>«La pauta está pagada y los inversores esperan. Aplazar quema la marca.»</p>
          </div>
          <div class="role-bubble">
            <strong>Juan Valencia</strong>
            <p>«APIs inestables y algoritmo sin validar. Lanzar así será un fracaso.»</p>
          </div>
          <div class="role-bubble">
            <strong>Aura Mendoza</strong>
            <p>«Comprometí el hito en ronda de inversión pero estuve ausente en la decisión.»</p>
          </div>
        </div>

        <div class="soft-launch-diagram">
          <div class="sl-step">
            <div class="sl-badge">FASE 1</div>
            <strong>Beta Cerrada (Día 1)</strong>
            <p>50-100 usuarios con consentimiento explícito. Se cumple la fecha publicitaria de Comercial.</p>
          </div>
          <div class="sl-arrow">→</div>
          <div class="sl-step">
            <div class="sl-badge">FASE 2</div>
            <strong>Monitoreo (Semanas 1-3)</strong>
            <p>Estabilización de APIs Open Finance y calibración del motor de Avalancha.</p>
          </div>
          <div class="sl-arrow">→</div>
          <div class="sl-step">
            <div class="sl-badge">FASE 3</div>
            <strong>Apertura General</strong>
            <p>Condicionada a 0 errores críticos durante 7 días continuos y concepto jurídico emitido.</p>
          </div>
        </div>
      </div>
    `;
  }

  renderSlide7_MatrixERIC_Pitch() {
    return `
      <div class="slide-content animate-fade-in">
        <div class="slide-header">
          <span class="slide-tag">ENTREGABLE 6 (FINAL) · ESTRATEGIA DEL OCÉANO AZUL</span>
          <h2>Matriz ERIC de FinGo y Sustentación Final</h2>
        </div>

        <div class="eric-full-matrix">
          <div class="eric-quad quad-e">
            <div class="quad-header-title">❌ ELIMINAR</div>
            <ul>
              <li>Cobros ocultos y comisiones sorpresa por consulta de saldo.</li>
              <li>Digitación manual obligatoria de facturas y obligaciones.</li>
              <li>Gamificación cosmética de puntos sin impacto económico.</li>
              <li>Letra chica y lenguaje financiero ininteligible.</li>
            </ul>
          </div>

          <div class="eric-quad quad-r">
            <div class="quad-header-title">📉 REDUCIR</div>
            <ul>
              <li>Tiempo de diagnóstico de salud financiera a menos de 3 minutos.</li>
              <li>Tasa promedio ponderada de interés pagada por mes.</li>
              <li>Estrés, ansiedad y mora provocados por desorganización de fechas.</li>
              <li>Fricción de entrada eliminando la petición de contraseñas al inicio.</li>
            </ul>
          </div>

          <div class="eric-quad quad-i">
            <div class="quad-header-title">📈 INCREMENTAR</div>
            <ul>
              <li>Visibilidad unificada en tiempo real de activos vs pasivos.</li>
              <li>Velocidad de amortización a capital con métodos de priorización.</li>
              <li>Transparencia del Costo Financiero Total (TEA en pesos).</li>
              <li>Educación financiera personalizada según el perfil de endeudamiento.</li>
            </ul>
          </div>

          <div class="eric-quad quad-c">
            <div class="quad-header-title">✨ CREAR</div>
            <ul>
              <li>Simulador interactivo de plan de avalancha sin conexión previa obligatoria.</li>
              <li>Motor predictivo de alertas anti-mora sincronizado a calendarios.</li>
              <li>Ecosistema de datos regulado bajo el Decreto 0368 de 2026 (Open Finance).</li>
              <li>Modelo de monetización alineado al éxito y ahorro real del usuario.</li>
            </ul>
          </div>
        </div>

        <div class="pitch-conclusion-box">
          <strong>🏆 Conclusión Ejecutiva:</strong> FinGo redefine la relación entre el ciudadano y sus deudas. Con una gobernanza ágil probada, cumplimiento regulatorio y foco en valor real, FinGo está listo para liderar el desendeudamiento inteligente en Colombia.
        </div>
      </div>
    `;
  }
}
