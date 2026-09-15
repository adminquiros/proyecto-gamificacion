/**
 * FinGo - Visor Ejecutivo de Pitch y Matriz ERIC (PitchViewer)
 * Proporciona una interfaz de presentación académica profesional estilo Gamma.app,
 * donde cada diapositiva corresponde directamente a un entregable y da acceso
 * inmediato al nivel jugable correspondiente en el runner.
 */

class PitchViewer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentSlide = 0;
    this.totalSlides = 8;
    this.fromLevelVictory = false;
  }

  show(slideIndex = 0, fromLevelVictory = false) {
    this.currentSlide = slideIndex;
    this.fromLevelVictory = fromLevelVictory;
    if (!this.container) return;

    this.render();
    this.container.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  hide(returnToMenu = false) {
    if (this.container) {
      this.container.classList.add("hidden");
      this.container.innerHTML = "";
      document.body.style.overflow = "";
      this.fromLevelVictory = false;
      if (returnToMenu && window.uiManager && (!window.gameEngine || window.gameEngine.state !== "PLAYING")) {
        window.uiManager.showMainMenu();
      }
    }
  }

  playCurrentSlideLevel() {
    const levelToPlay = this.currentSlide === 0 ? 1 : Math.min(6, this.currentSlide);
    this.hide();
    if (window.gameEngine) {
      window.gameEngine.startLevel(levelToPlay);
    }
  }

  nextSlide() {
    if (this.currentSlide < this.totalSlides - 1) {
      this.currentSlide++;
      this.fromLevelVictory = false;
      this.render();
    }
  }

  prevSlide() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
      this.fromLevelVictory = false;
      this.render();
    }
  }

  goToSlide(idx) {
    this.currentSlide = idx;
    this.fromLevelVictory = false;
    this.render();
  }

  render() {
    const slides = [
      this.renderSlide0_Cover(),
      this.renderSlide1_Entregable1(),
      this.renderSlide2_Entregable2(),
      this.renderSlide3_Entregable3(),
      this.renderSlide4_Entregable4(),
      this.renderSlide5_Entregable5(),
      this.renderSlide6_Entregable6(),
      this.renderSlide7_Conclusiones()
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
              <button class="pitch-tab ${this.currentSlide === 0 ? "active" : ""}" onclick="window.pitchViewer.goToSlide(0)">Portada</button>
              <button class="pitch-tab ${this.currentSlide === 1 ? "active" : ""}" onclick="window.pitchViewer.goToSlide(1)">E1: Diagnóstico & Porter</button>
              <button class="pitch-tab ${this.currentSlide === 2 ? "active" : ""}" onclick="window.pitchViewer.goToSlide(2)">E2: Backlog 30 HUs</button>
              <button class="pitch-tab ${this.currentSlide === 3 ? "active" : ""}" onclick="window.pitchViewer.goToSlide(3)">E3: Lean Startup</button>
              <button class="pitch-tab ${this.currentSlide === 4 ? "active" : ""}" onclick="window.pitchViewer.goToSlide(4)">E4: OKRs & Scrumban</button>
              <button class="pitch-tab ${this.currentSlide === 5 ? "active" : ""}" onclick="window.pitchViewer.goToSlide(5)">E5: Soft Launch & Crisis</button>
              <button class="pitch-tab ${this.currentSlide === 6 ? "active" : ""}" onclick="window.pitchViewer.goToSlide(6)">E6: Matriz ERIC</button>
              <button class="pitch-tab ${this.currentSlide === 7 ? "active" : ""}" onclick="window.pitchViewer.goToSlide(7)">Conclusiones</button>
            </div>

            <div class="pitch-nav-actions">
              <button class="btn-pitch-close" onclick="window.pitchViewer.hide(true)">
                ✕ Cerrar Presentación
              </button>
            </div>
          </div>

          <!-- Banner de Victoria de Nivel (Si proviene de terminar una partida) -->
          ${this.fromLevelVictory ? `
            <div class="pitch-victory-banner animate-slide-down">
              ${this.currentSlide <= 6 ? `
                <span>🎉 ¡Nivel ${this.currentSlide - 1} Superado! Has desbloqueado el <strong>Entregable ${this.currentSlide}</strong>. Revisa la sustentación y haz clic en <em>"🎮 Jugar Nivel ${this.currentSlide}"</em> cuando desees continuar.</span>
              ` : `
                <span>🏆 ¡Felicitaciones! Has superado los 6 Niveles y 6 Entregables de la Especialización en FinTech. Revisa las Conclusiones y Matriz ERIC.</span>
              `}
            </div>
          ` : ""}

          <!-- Contenido Activo de la Diapositiva -->
          <div class="pitch-slide-viewport">
            ${slides[this.currentSlide]}
          </div>

          <!-- Barra Inferior de Navegación y Lanzamiento de Nivel -->
          <div class="pitch-footer">
            <div class="pitch-slide-indicator">
              Diapositiva ${this.currentSlide + 1} de ${this.totalSlides}
            </div>

            <div class="pitch-slide-controls">
              <button class="btn-slide-nav" onclick="window.pitchViewer.prevSlide()" ${this.currentSlide === 0 ? "disabled" : ""}>
                ← Anterior
              </button>

              ${this.currentSlide >= 1 && this.currentSlide <= 6 ? `
                <button class="btn-slide-play" onclick="window.pitchViewer.playCurrentSlideLevel()">
                  🎮 ${this.currentSlide === 1 ? "Iniciar Carrera (Nivel 1)" : `Jugar Nivel ${this.currentSlide}`} →
                </button>
              ` : ""}

              <button class="btn-slide-nav primary" onclick="window.pitchViewer.nextSlide()" ${this.currentSlide === this.totalSlides - 1 ? "disabled" : ""}>
                ${this.currentSlide === 0 ? "Siguiente Slide (Porter) →" : "Siguiente Slide →"}
              </button>
            </div>
          </div>

        </div>
      </div>
    `;
  }

  /* --- DIAPOSITIVAS EJECUTIVAS 1-A-1 CON CADA NIVEL --- */

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
          Sustentación ejecutiva de la asignatura <strong>Metodologías Ágiles de Gestión</strong>. Cada diapositiva expone un entregable clave y te permite jugar inmediatamente su nivel correspondiente en el runner.
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

        <div class="slide-cta-play" style="margin-top: 28px;">
          <button class="btn-primary-fingo" onclick="window.pitchViewer.goToSlide(1)">
            <span>Siguiente: Entregable 1 (Diagnóstico & 5 Fuerzas de Porter)</span>
            <span class="btn-arrow">→</span>
          </button>
        </div>
      </div>
    `;
  }

  renderSlide1_Entregable1() {
    return `
      <div class="slide-content animate-fade-in">
        <div class="slide-header">
          <span class="slide-tag">ENTREGABLE 1 · INFORME EJECUTIVO & DIAGNÓSTICO ESTRATÉGICO</span>
          <h2>Visión Institucional, Gestión Ágil en Notion y 5 Fuerzas de Porter</h2>
        </div>

        <!-- 1. Visión Oficial FinGo -->
        <div class="vision-banner-card">
          <div class="vision-header-row">
            <span class="vision-badge">🎯 Visión Oficial FinGo</span>
            <small style="color: var(--text-dim); font-size: 11px;">Entregable 1 · Especialización en Fintech</small>
          </div>
          <p class="vision-quote">
            "Ser la app de referencia en Colombia para que cualquier persona entienda su situación financiera real (lo que tiene, lo que debe y cómo salir de deudas) y tome decisiones informadas sin necesidad de ser experto en finanzas."
          </p>
          <div class="vision-pillars">
            <div class="vision-pillar-chip"><span>💎</span> <strong>Lo que tiene:</strong> Activos centralizados</div>
            <div class="vision-pillar-chip"><span>💳</span> <strong>Lo que debe:</strong> Pasivos, TEA y cortes</div>
            <div class="vision-pillar-chip"><span>🚀</span> <strong>Cómo salir:</strong> Plan de pagos estructurado</div>
          </div>
        </div>

        <!-- 2. Problemática vs Solución -->
        <div class="slide-split-grid" style="margin-top: 18px;">
          <div class="slide-card problem-card">
            <h3 class="card-title text-red">⚠️ El Problema en Colombia</h3>
            <ul class="slide-list">
              <li><strong>Deudas Dispersas:</strong> Múltiples tarjetas de crédito, créditos educativos (ej. Icetex), libre inversión y fintechs sin visión global.</li>
              <li><strong>Opacidad de Costos:</strong> Desconocimiento total de la Tasa Efectiva Anual (TEA) y comisiones ocultas cobradas por entidades.</li>
              <li><strong>Estrés Financiero & Moras:</strong> Olvidos involuntarios de fechas de corte que detonan intereses moratorios y reporte negativo en centrales de riesgo.</li>
            </ul>
          </div>

          <div class="slide-card solution-card">
            <h3 class="card-title text-mint">💡 La Solución FinGo</h3>
            <ul class="slide-list">
              <li><strong>Consolidación Inteligente:</strong> Unificación de activos y pasivos mediante Open Finance (Decreto 0368 de 2026).</li>
              <li><strong>Algoritmos de Salida:</strong> Métodos matemáticos de <em>Avalancha</em> (prioriza tasa alta) y <em>Bola de Nieve</em> (prioriza saldo menor).</li>
              <li><strong>Diagnóstico Express:</strong> Evaluación integral de endeudamiento a costo $0 en menos de 3 minutos sin fricción.</li>
            </ul>
          </div>
        </div>

        <!-- 3. Plataforma de Gestión del Proyecto: Notion Workspace -->
        <div class="notion-workspace-card">
          <div class="notion-card-header">
            <div class="notion-title-wrap">
              <div class="notion-logo-icon">📝</div>
              <div>
                <h3>Plataforma de Gestión Ágil: Notion Workspace</h3>
                <p>Espacio colaborativo unificado para backlog, ceremonias ágiles, tablero Kanban y trazabilidad DoD.</p>
              </div>
            </div>
            <a href="https://app.notion.com/p/Finanzas-personales-MVP-en-Notion-099e1f25df984dfc8b1a1b45adf8bbca?source=copy_link" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="btn-notion-link"
               title="Abrir espacio oficial del proyecto en Notion">
              <span>💰 Finanzas personales (MVP en Notion)</span>
              <span class="notion-link-arrow">↗</span>
            </a>
          </div>

          <div class="notion-features-grid">
            <div class="notion-feat-item">
              <strong>📋 Backlog 30 Historias</strong>
              <p>Mapeo de 137 puntos de historia organizados por valor de negocio y prioridad MoSCoW.</p>
            </div>
            <div class="notion-feat-item">
              <strong>📊 Tablero Kanban (WIP=2)</strong>
              <p>Límite estricto de trabajo en progreso para evitar cuellos de botella y maximizar el flujo.</p>
            </div>
            <div class="notion-feat-item">
              <strong>🛑 Gestión de Bloqueos</strong>
              <p>Seguimiento visual de impedimentos regulatorios y dependencias técnicas en tiempo real.</p>
            </div>
            <div class="notion-feat-item">
              <strong>💡 Fichas de Aprendizaje</strong>
              <p>Documentación de retrospectivas de sprint y validación sistemática de hipótesis Lean.</p>
            </div>
          </div>
        </div>

        <!-- 4. Público Objetivo: 5 Segmentos en Colombia -->
        <div class="target-audience-section">
          <div class="target-audience-title-row">
            <h3 style="font-size: 16px; color: #FFFFFF; font-weight: 800;">👥 Público Objetivo (5 Segmentos Clave en Colombia)</h3>
            <span class="badge-blue">Target Validado</span>
          </div>
          <div class="target-audience-grid">
            <div class="target-user-card">
              <span class="target-icon">👔</span>
              <span class="target-badge">22 - 32 años</span>
              <strong>Jóvenes Profesionales</strong>
              <p>Tarjetas de crédito activas y créditos de libre inversión. Buscan claridad de pagos sin tecnicismos.</p>
            </div>
            <div class="target-user-card">
              <span class="target-icon">🎓</span>
              <span class="target-badge">Educativo</span>
              <strong>Estudiantes y Egresados</strong>
              <p>Deudores de Icetex y créditos formativos. Necesitan programar cuotas con salarios de entrada.</p>
            </div>
            <div class="target-user-card">
              <span class="target-icon">👨‍👩‍👧</span>
              <span class="target-badge">25 - 45 años</span>
              <strong>Adultos Bancarizados</strong>
              <p>Múltiples deudas simultáneas (tarjetas, libre inversión, libranzas). Urgencia de liquidez y orden.</p>
            </div>
            <div class="target-user-card">
              <span class="target-icon">📱</span>
              <span class="target-badge">Crédito App</span>
              <strong>Usuarios Fintech</strong>
              <p>Clientes de micropréstamos digitales con altas tasas de interés que buscan evitar ciclos de mora.</p>
            </div>
            <div class="target-user-card">
              <span class="target-icon">💼</span>
              <span class="target-badge">Flujo Variable</span>
              <strong>Independientes & Pymes</strong>
              <p>Microempresarios con ingresos variables que requieren armonizar pasivos personales y de negocio.</p>
            </div>
          </div>
        </div>

        <!-- 5. Diagnóstico Detallado de las 5 Fuerzas de Porter -->
        <div class="porter-5-section">
          <div class="porter-intro-box">
            <strong>📊 Diagnóstico de las 5 Fuerzas de Porter:</strong> Mientras el mercado masivo muestra una rivalidad feroz del <strong>78%</strong> en transferencias y registro pasivo de gastos (Nequi, Daviplata, RappiPay), FinGo opera en un <strong>nicho desatendido de baja rivalidad (25%)</strong> al ser la única plataforma que integra activos, pasivos y un plan de amortización guiado.
          </div>

          <div class="porter-5-grid">
            <!-- Fuerza 1: Proveedores -->
            <div class="porter-force-card">
              <div class="p-force-top">
                <span class="p-force-num">Fuerza 1</span>
                <span class="p-force-title">Poder de Proveedores</span>
                <span class="p-force-badge badge-amber">Medio - Alto</span>
              </div>
              <div class="p-force-block pressure">
                <strong>Factores de Presión:</strong>
                <p>Dependencia de Cloud (AWS/Azure), agregadores Open Finance (Decreto 0368/2026), APIs de IA (OpenAI/Gemini) y canales OTP.</p>
              </div>
              <div class="p-force-block mitigation">
                <strong>Mitigación FinGo:</strong>
                <p>Arquitectura multi-cloud desacoplada y estándares abiertos de Open Finance en Colombia para evitar <em>vendor lock-in</em>.</p>
              </div>
            </div>

            <!-- Fuerza 2: Clientes -->
            <div class="porter-force-card">
              <div class="p-force-top">
                <span class="p-force-num">Fuerza 2</span>
                <span class="p-force-title">Poder de Clientes</span>
                <span class="p-force-badge badge-red">85% · Muy Alto</span>
              </div>
              <div class="p-force-block pressure">
                <strong>Factores de Presión:</strong>
                <p>Costos de cambio nulos ($0), abundancia de apps gratuitas y exigencia de valor tangible inmediato.</p>
              </div>
              <div class="p-force-block mitigation">
                <strong>Mitigación FinGo:</strong>
                <p>Diagnóstico express en &lt; 3 min a costo $0, planes personalizados (Avalancha vs Nieve) y valor acumulado en historial.</p>
              </div>
            </div>

            <!-- Fuerza 3: Rivalidad -->
            <div class="porter-force-card highlight">
              <div class="p-force-top">
                <span class="p-force-num">Fuerza 3</span>
                <span class="p-force-title">Rivalidad Competidores</span>
                <span class="p-force-badge badge-mint">78% Amplio / 25% FinGo</span>
              </div>
              <div class="p-force-block pressure">
                <strong>Factores de Presión:</strong>
                <p>Saturación en pagos y registro pasivo de gastos (Nequi, Daviplata, RappiPay, Treinta, Monefy).</p>
              </div>
              <div class="p-force-block mitigation">
                <strong>Océano Azul FinGo:</strong>
                <p>Nicho desatendido: FinGo es la única app que une activos + pasivos + plan secuencial de amortización.</p>
              </div>
            </div>

            <!-- Fuerza 4: Nuevos Entrantes -->
            <div class="porter-force-card">
              <div class="p-force-top">
                <span class="p-force-num">Fuerza 4</span>
                <span class="p-force-title">Nuevos Entrantes</span>
                <span class="p-force-badge badge-red">70% · Alto</span>
              </div>
              <div class="p-force-block pressure">
                <strong>Factores de Presión:</strong>
                <p>Crecimiento fintech en Colombia ($11.18 B COP en volumen proyectado) atrae actores e imitaciones.</p>
              </div>
              <div class="p-force-block mitigation">
                <strong>Mitigación FinGo:</strong>
                <p>Barrera regulatoria estricta (Decreto 0368/2026, Ley 1581 Hábeas Data) y algoritmos matemáticos propios.</p>
              </div>
            </div>

            <!-- Fuerza 5: Sustitutos -->
            <div class="porter-force-card">
              <div class="p-force-top">
                <span class="p-force-num">Fuerza 5</span>
                <span class="p-force-title">Amenaza Sustitutos</span>
                <span class="p-force-badge badge-amber">65% · Medio-Alto</span>
              </div>
              <div class="p-force-block pressure">
                <strong>Factores de Presión:</strong>
                <p>Hojas de Excel/Google Sheets, cuadernos manuales, compras de cartera bancaria y apps bancarias aisladas.</p>
              </div>
              <div class="p-force-block mitigation">
                <strong>Mitigación FinGo:</strong>
                <p>Automatización Open Finance, alertas predictivas multicanal y simulación dinámica del ahorro en intereses.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Botón CTA de Nivel 1 -->
        <div class="slide-cta-play" style="margin-top: 28px;">
          <button class="btn-primary-fingo" onclick="window.pitchViewer.playCurrentSlideLevel()">
            <span>🎮 Iniciar Carrera Financiera (Nivel 1: Selva de Deudas)</span>
            <span class="btn-arrow">→</span>
          </button>
        </div>
      </div>
    `;
  }

  renderSlide2_Entregable2() {
    return `
      <div class="slide-content animate-fade-in">
        <div class="slide-header">
          <span class="slide-tag">ENTREGABLE 2 · BACKLOG & IDENTIDAD DE MARCA</span>
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
              <li><strong>Datos Personales:</strong> Ley 1581 de 2012 y consentimiento expreso.</li>
              <li><strong>Open Finance:</strong> Decreto 0368 de 2026 bajo APIs seguras.</li>
              <li><strong>Protección al Consumidor:</strong> Ley 1328 de 2009 y SARLAFT SFC.</li>
            </ul>
          </div>

          <div class="frente-card">
            <div class="frente-header">
              <span class="frente-icon">🎨</span>
              <h4>Identidad de Marca</h4>
              <span class="frente-badge">9 HUs · 37 pts</span>
            </div>
            <ul class="frente-list">
              <li><strong>Logotipo:</strong> Flecha azul ascendente + bucle 'G' menta.</li>
              <li><strong>Paleta Oficial:</strong> Azul (#2B62C6), Menta (#48C09B), Noche (#0D1B2A).</li>
              <li><strong>Accesibilidad:</strong> Estándar de contraste WCAG 2.1 AA.</li>
            </ul>
          </div>

          <div class="frente-card">
            <div class="frente-header">
              <span class="frente-icon">📱</span>
              <h4>Paneles y Módulos</h4>
              <span class="frente-badge">10 HUs · 57 pts</span>
            </div>
            <ul class="frente-list">
              <li><strong>Módulos 1-3:</strong> Onboarding, Dashboard y Visor de Deudas.</li>
              <li><strong>Módulos 4-5:</strong> Motor de Priorización y Alertas Preventivas.</li>
              <li><strong>Módulos 6-7:</strong> Educación Financiera y Seguridad.</li>
            </ul>
          </div>
        </div>

        <div class="slide-cta-play">
          <button class="btn-primary-fingo" onclick="window.pitchViewer.playCurrentSlideLevel()">
            <span>🎮 Jugar Nivel 2: La Autopista de la Regulación</span>
            <span class="btn-arrow">→</span>
          </button>
        </div>
      </div>
    `;
  }

  renderSlide3_Entregable3() {
    return `
      <div class="slide-content animate-fade-in">
        <div class="slide-header">
          <span class="slide-tag">ENTREGABLE 3 · LEAN STARTUP & VALIDACIÓN</span>
          <h2>Cuatro Hipótesis Entraron al Aula. Una Sola Sobrevivió.</h2>
        </div>

        <div class="lean-grid">
          <div class="lean-card card-refutada">
            <span class="verdict-tag red">REFUTADA</span>
            <h4>H1 · Vinculación de Tarjeta Inicial</h4>
            <p><em>"El usuario conectará su tarjeta de nómina para automatizar pagos."</em></p>
            <div class="lean-reason"><strong>Freno:</strong> Desconfianza inmediata. Temor a cobros no autorizados y clonación.</div>
          </div>

          <div class="lean-card card-sostenida">
            <span class="verdict-tag green">SOSTENIDA CON CONDICIÓN</span>
            <h4>H2 · Diagnóstico Gratuito Express</h4>
            <p><em>"Un diagnóstico en &lt; 3 min basta para que entregue sus datos."</em></p>
            <div class="lean-reason"><strong>Validada:</strong> Si funciona como simulación interactiva sin exigir contraseñas bancarias al inicio.</div>
          </div>

          <div class="lean-card card-sin-consenso">
            <span class="verdict-tag amber">SIN CONSENSO</span>
            <h4>H3 · Suscripción Fija vs Éxito</h4>
            <p><em>"El endeudado pagaría $9.000 fijos por la ruta de pagos."</em></p>
            <div class="lean-reason"><strong>División:</strong> 50% prefería mensualidad fija; 50% comisión ligada al ahorro real conseguido.</div>
          </div>

          <div class="lean-card card-refutada">
            <span class="verdict-tag red">REFUTADA EN EL NÚCLEO</span>
            <h4>H4 · Gamificación con Niveles</h4>
            <p><em>"Convertirlo en juego con puntos y medallas motiva a pagar."</em></p>
            <div class="lean-reason"><strong>Rechazo:</strong> En situación de deuda, el usuario busca alivio financiero, no cosmética.</div>
          </div>
        </div>

        <div class="pivot-banner">
          <span class="pivot-badge">EL GRAN PIVOTE FINTECH</span>
          <p><strong>"El producto no cambia. Cambia el orden en que pide confianza."</strong> La conexión bancaria se movió al final del embudo, ofreciendo valor antes de pedir credenciales sensibles.</p>
        </div>

        <div class="slide-cta-play">
          <button class="btn-primary-fingo" onclick="window.pitchViewer.playCurrentSlideLevel()">
            <span>🎮 Jugar Nivel 3: El Fuego Cruzado Lean</span>
            <span class="btn-arrow">→</span>
          </button>
        </div>
      </div>
    `;
  }

  renderSlide4_Entregable4() {
    return `
      <div class="slide-content animate-fade-in">
        <div class="slide-header">
          <span class="slide-tag">ENTREGABLE 4 · ESTRATEGIA & SCRUMBAN</span>
          <h2>Sistema de OKRs, KPIs y Framework Híbrido Scrumban</h2>
        </div>

        <div class="okr-spotlight-card">
          <span class="okr-label">🎯 OKR ESTRATÉGICO PRINCIPAL</span>
          <h3>"Convertir a FinGo en el centro de mando financiero preferido por los jóvenes profesionales, transformando el estrés de múltiples deudas en una ruta clara hacia la libertad financiera."</h3>
          <div class="krs-row">
            <div class="kr-box"><strong>KR 1 · Conexión</strong><span>300 usuarios conectando ≥ 2 deudas vía Open Finance</span></div>
            <div class="kr-box"><strong>KR 2 · Tiempo</strong><span>Reducción del 70% en tiempo de control (&lt; 3 min)</span></div>
            <div class="kr-box"><strong>KR 3 · Tracción</strong><span>Validación de modelo freemium + % de ahorro</span></div>
          </div>
        </div>

        <div class="slide-split-grid" style="margin-top: 18px;">
          <div class="slide-card">
            <h4>🚫 Métricas de Vanidad que Evitamos</h4>
            <ul class="slide-list">
              <li>❌ "125.767 descargas en tiendas" (No mide amortización real).</li>
              <li>❌ "3.3 millones de impresiones en redes" (Solo infla el ego comercial).</li>
            </ul>
          </div>
          <div class="slide-card">
            <h4>✅ Métricas Accionables que Medimos</h4>
            <ul class="slide-list">
              <li>✔️ "70% de usuarios ejecutó su primer abono a capital programado".</li>
              <li>✔️ "≥ 40% de usuarios muy decepcionados si FinGo desaparece (Sean Ellis)".</li>
              <li>✔️ "Reducción neta cuantificable en pesos de intereses pagados".</li>
            </ul>
          </div>
        </div>

        <div class="slide-cta-play">
          <button class="btn-primary-fingo" onclick="window.pitchViewer.playCurrentSlideLevel()">
            <span>🎮 Jugar Nivel 4: Circuito Scrumban & OKRs</span>
            <span class="btn-arrow">→</span>
          </button>
        </div>
      </div>
    `;
  }

  renderSlide5_Entregable5() {
    return `
      <div class="slide-content animate-fade-in">
        <div class="slide-header">
          <span class="slide-tag">ENTREGABLE 5 · GESTIÓN DEL CAMBIO & NEGOCIACIÓN</span>
          <h2>Crisis de Lanzamiento del MVP: Soft Launch en 3 Fases</h2>
        </div>

        <div class="conflict-roles-grid">
          <div class="role-bubble">
            <strong>Esteban Quirós</strong>
            <p>«Sin concepto legal ni validación SFC. Lanzar expone a contingencias normativas.»</p>
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
            <p>50-100 usuarios con consentimiento explícito. Se cumple la fecha comercial sin exponer el sistema masivo.</p>
          </div>
          <div class="sl-arrow">→</div>
          <div class="sl-step">
            <div class="sl-badge">FASE 2</div>
            <strong>Monitoreo (Semanas 1-3)</strong>
            <p>Estabilización de APIs Open Finance y calibración del motor de Avalancha con datos reales.</p>
          </div>
          <div class="sl-arrow">→</div>
          <div class="sl-step">
            <div class="sl-badge">FASE 3</div>
            <strong>Apertura General</strong>
            <p>Condicionada a 0 errores críticos durante 7 días continuos y concepto jurídico emitido.</p>
          </div>
        </div>

        <div class="slide-cta-play">
          <button class="btn-primary-fingo" onclick="window.pitchViewer.playCurrentSlideLevel()">
            <span>🎮 Jugar Nivel 5: Tormenta del Lanzamiento MVP</span>
            <span class="btn-arrow">→</span>
          </button>
        </div>
      </div>
    `;
  }

  renderSlide6_Entregable6() {
    return `
      <div class="slide-content animate-fade-in">
        <div class="slide-header">
          <span class="slide-tag">ENTREGABLE 6 · ESTRATEGIA DEL OCÉANO AZUL</span>
          <h2>Matriz ERIC de FinGo: Cuadro de Acciones de Valor</h2>
        </div>

        <div class="eric-full-matrix">
          <div class="eric-quad quad-e">
            <div class="quad-header-title">❌ ELIMINAR</div>
            <ul>
              <li>Cobros ocultos y comisiones sorpresa por consulta de saldo.</li>
              <li>Digitación manual obligatoria de facturas y obligaciones.</li>
              <li>Gamificación cosmética de puntos sin impacto económico real.</li>
              <li>Letra chica y lenguaje financiero ininteligible.</li>
            </ul>
          </div>

          <div class="eric-quad quad-r">
            <div class="quad-header-title">📉 REDUCIR</div>
            <ul>
              <li>Tiempo de diagnóstico de salud financiera a menos de 3 minutos.</li>
              <li>Tasa promedio ponderada de interés pagada mensualmente.</li>
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
              <li>Modelo de monetización compartido alineado al ahorro real del usuario.</li>
            </ul>
          </div>
        </div>

        <div class="slide-cta-play">
          <button class="btn-primary-fingo" onclick="window.pitchViewer.playCurrentSlideLevel()">
            <span>🎮 Jugar Nivel 6: El Clímax del Océano Azul</span>
            <span class="btn-arrow">→</span>
          </button>
        </div>
      </div>
    `;
  }

  renderSlide7_Conclusiones() {
    return `
      <div class="slide-content animate-fade-in" style="text-align: center;">
        <div class="cover-meta-badge" style="margin-bottom: 20px;">
          🏆 SUSTENTACIÓN EJECUTIVA CULMINADA CON ÉXITO
        </div>
        <h2 style="font-size: 36px; font-weight: 900; color: #FFFFFF; margin-bottom: 14px;">
          FinGo: Hacia la Libertad Financiera
        </h2>
        <p style="font-size: 16px; color: #CBD5E1; max-width: 780px; margin: 0 auto 30px; line-height: 1.6;">
          A través de metodologías ágiles, rigor normativo, validación Lean y foco implacable en el usuario, el equipo ha demostrado la viabilidad operativa y estratégica de FinGo como la plataforma de desendeudamiento inteligente de referencia en Colombia.
        </p>

        <div class="cover-team-grid" style="max-width: 860px; margin: 0 auto 30px;">
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

        <div class="pitch-conclusion-box" style="max-width: 800px; margin: 0 auto 30px; text-align: left;">
          <strong>🎓 Universidad de La Salle · Metodologías Ágiles de Gestión:</strong><br>
          Cumplimiento total de la Matriz ERIC, Sustentación Ejecutiva del Modelo de Negocio, Gamificación Interactiva y Trazabilidad de los 6 Entregables.
        </div>

        <div class="slide-cta-play">
          <button class="btn-primary-fingo" style="background: var(--fingo-mint); color: #050914;" onclick="window.pitchViewer.hide(); window.gameEngine.startLevel(1);">
            <span>🔄 Volver a Jugar desde el Nivel 1</span>
          </button>
        </div>
      </div>
    `;
  }
}
