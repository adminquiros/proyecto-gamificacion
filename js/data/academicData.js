/**
 * FinGo - Datos Académicos y Estratégicos de la Especialización en FinTech
 * Universidad de La Salle - Metodologías Ágiles de Gestión
 * Proyecto: FinGo — Plataforma Inteligente de Gestión de Deudas & Salud Financiera
 * Equipo:
 * - Deyanira Castaño Cholo (Comercial / Mercadeo)
 * - Juan Diego Valencia Ricaurte (Tecnología / Desarrollo)
 * - Aura Inés Mendoza Díaz (Gerencia General)
 * - Esteban David Quirós Marín (Jurídica / Cumplimiento Normativo)
 */

const ACADEMIC_DATA = {
  projectInfo: {
    name: "FinGo",
    tagline: "Tu Aliado Financiero",
    university: "Universidad de La Salle",
    program: "Especialización en FinTech",
    course: "Metodologías Ágiles de Gestión",
    year: "2026",
    team: [
      { name: "Esteban David Quirós Marín", icon: "👤" },
      { name: "Deyanira Castaño Cholo", icon: "👤" },
      { name: "Juan Diego Valencia", icon: "👤" },
      { name: "Aura Mendoza", icon: "👤" }
    ],
    brandColors: {
      primaryBlue: "#2B62C6",   // Azul Crecimiento (Acción, botones)
      mintGreen: "#48C09B",     // Verde Menta (Salud financiera, bucle 'G')
      deepNavy: "#0D1B2A",      // Azul Noche (Fondo institucional)
      darkCanvas: "#050914"     // Lienzo oscuro tech
    }
  },

  deliverables: [
    {
      id: 1,
      levelNumber: 1,
      badge: "Entregable 1",
      title: "Informe Ejecutivo & Diagnóstico del Entorno",
      subtitle: "Propuesta de Valor, Visión y Análisis de 5 Fuerzas de Porter",
      themeColor: "#2B62C6",
      icon: "📊",
      summary: "FinGo nace como la primera fintech en Colombia que no solo registra gastos, sino que centraliza activos y pasivos, calculando la ruta exacta de salida de deudas sin sobrecostos.",
      keyMetrics: [
        { label: "Oportunidad Open Finance", value: "90%", desc: "Decreto 0368 de 2026 habilita integración segura vía API" },
        { label: "Mercado Fintech Colombia", value: "$11.18 B", desc: "Billones de pesos proyectados en volumen para 2026" },
        { label: "Rivalidad Amplia vs Nicho", value: "78% vs 25%", desc: "Alta en registro genérico; baja en desendeudamiento integral" }
      ],
      sections: [
        {
          title: "1. Problemática Identificada en el Usuario",
          content: "Las personas administran sus obligaciones de forma dispersa entre tarjetas de crédito, créditos educativos (ej. Icetex), créditos de libre inversión y microcréditos fintech. Consecuencia: falta de claridad sobre la Tasa Efectiva Anual (TEA), estrés recurrente, pagos de intereses de mora y sobreendeudamiento crónico."
        },
        {
          title: "2. Propuesta de Valor Unificada",
          content: "Centralización de deudas en una sola pantalla, alertas preventivas multicanal para erradicar cobros por mora, recomendaciones algorítmicas de pago (Bola de Nieve y Avalancha) y micro-educación financiera contextualizada según el perfil del usuario."
        },
        {
          title: "3. Análisis del Entorno: 5 Fuerzas de Porter",
          bullets: [
            "<strong>Poder de Proveedores (Medio-Alto):</strong> Dependencia de infraestructura Cloud (AWS/Azure), APIs de Open Finance y LLMs de IA.",
            "<strong>Poder de Clientes (Alto):</strong> Bajos costos de cambio inicial; requiere demostrar valor en < 3 minutos.",
            "<strong>Amenaza de Nuevos Entrantes (Alto):</strong> Bajas barreras de entrada tecnológica mitigadas por la confianza y seguridad regulatoria.",
            "<strong>Amenaza de Sustitutos (Medio-Alto):</strong> Hojas de Excel, cuadernos o apps bancarias aisladas que no consolidan la visión de conjunto.",
            "<strong>Rivalidad entre Competidores (78% General / Baja en Nicho):</strong> Nequi, Daviplata o RappiPay dominan pagos y transaccionalidad, pero ninguna resuelve la extinción secuencial de deudas."
          ]
        },
        {
          title: "4. Ecosistema de Gestión Ágil en Notion",
          content: "Estructuración del Product Backlog, tableros Kanban con límites de trabajo en proceso (WIP Limits), trazabilidad de épicas y sincronización de responsabilidades del equipo."
        }
      ]
    },
    {
      id: 2,
      levelNumber: 2,
      badge: "Entregable 2",
      title: "Product Backlog Consolidado & Identidad de Marca",
      subtitle: "30 Historias de Usuario (137 Puntos de Historia) en 3 Frentes de Trabajo",
      themeColor: "#48C09B",
      icon: "📋",
      summary: "Estructuración ágil exhaustiva del proyecto dividida en Cumplimiento Normativo, Identidad Visual y Módulos Funcionales, asegurando viabilidad técnica y legal.",
      keyMetrics: [
        { label: "Historias de Usuario", value: "30", desc: "Repartidas en 16 categorías" },
        { label: "Puntos de Historia", value: "137 pts", desc: "Estimación ponderada del Sprint 2" },
        { label: "Prioridad Crítica", value: "9 HUs", desc: "Núcleo de seguridad, ley y valor inmediato" }
      ],
      sections: [
        {
          title: "1. Frente 1: Cumplimiento Normativo (11 HUs — 43 pts)",
          bullets: [
            "<strong>Datos Personales (Ley 1581 de 2012):</strong> Política estricta de tratamiento de datos y revocatoria expresa.",
            "<strong>Open Finance (Decreto 0368 de 2026):</strong> Conexión multibancaria estandarizada con doble consentimiento explícito.",
            "<strong>Consumidor Financiero (Ley 1328 de 2009):</strong> Transparencia contractual total, prohibición de letra chica o cláusulas abusivas.",
            "<strong>Prevención LA/FT (Circular 027 de 2020 SFC - SARLAFT):</strong> Debida diligencia simplificada y monitoreo transaccional.",
            "<strong>Ciberseguridad SFC:</strong> Cifrado de extremo a extremo (AES-256) y autenticación multifactor."
          ]
        },
        {
          title: "2. Frente 2: Identidad de Marca (9 HUs — 37 pts)",
          bullets: [
            "<strong>Anatomía del Logotipo:</strong> Flecha azul de crecimiento patrimonial + bucle verde menta de la 'G' (economía circular y Open Finance).",
            "<strong>Colores Corporativos:</strong> Azul Crecimiento (#2B62C6), Verde Menta (#48C09B) y Azul Noche (#0D1B2A).",
            "<strong>Tipografía y Accesibilidad:</strong> Plus Jakarta Sans e Inter con ratio de contraste WCAG 2.1 AA."
          ]
        },
        {
          title: "3. Frente 3: Paneles y Módulos del Producto (10 HUs — 57 pts)",
          bullets: [
            "<strong>Módulo 1 - Onboarding:</strong> Diagnóstico de deudas en menos de 3 minutos.",
            "<strong>Módulo 2 - Dashboard General:</strong> Visor consolidado de activos vs pasivos.",
            "<strong>Módulo 3 - Deudas:</strong> Ficha técnica por acreedor, tasa TEA y saldo pendiente.",
            "<strong>Módulo 4 - Priorización de Pagos:</strong> Algoritmos de Bola de Nieve y Avalancha.",
            "<strong>Módulo 5 - Alertas Anti-Mora:</strong> Notificaciones preventivas multicanal (SMS/WhatsApp/Push).",
            "<strong>Módulo 6 - Educación Financiera:</strong> Píldoras adaptativas según hábitos de consumo.",
            "<strong>Módulo 7 - Perfil & Seguridad:</strong> Gestión de consentimientos y conexiones bancarias."
          ]
        }
      ]
    },
    {
      id: 3,
      levelNumber: 3,
      badge: "Entregable 3",
      title: "Validación Lean Startup & Experimentos en Aula",
      subtitle: "Cuatro Hipótesis Entraron al Aula. Una Sola Sobrevivió.",
      themeColor: "#D97706",
      icon: "🔬",
      summary: "Ciclo de experimentación Lean de 30 minutos sin programar una sola línea de código, identificando los límites de confianza del usuario colombiano frente a sus datos bancarios.",
      keyMetrics: [
        { label: "Duración del Experimento", value: "30 min", desc: "5 fases encadenadas en clase" },
        { label: "Hipótesis Refutadas", value: "3 de 4", desc: "Descarte temprano de supuestos costosos" },
        { label: "Hipótesis Sobreviviente", value: "Diagnóstico $0", desc: "Simulación rápida sin datos sensibles" }
      ],
      sections: [
        {
          title: "1. Los Cuatro Saltos de Fe Puestos a Prueba",
          bullets: [
            "<strong>H1 - Vinculación de Tarjeta de Nómina:</strong> <em>REFUTADA.</em> Los usuarios manifestaron profundo temor a clonación, cobros no autorizados y pérdida de control.",
            "<strong>H2 - Diagnóstico Gratuito en < 3 Minutos:</strong> <em>SOSTENIDA CON CONDICIÓN.</em> Funciona si es una simulación visual sin exigir credenciales bancarias de entrada.",
            "<strong>H3 - Suscripción de $9.000/mes:</strong> <em>SIN CONSENSO.</em> 50% prefería tarifa fija, 50% comisión sobre ahorro real generado.",
            "<strong>H4 - Gamificación estilo Duolingo:</strong> <em>REFUTADA EN SU NÚCLEO.</em> El usuario con estrés de deuda busca alivio operativo inmediato; no le interesan puntos o medallas vacías."
          ]
        },
        {
          title: "2. El Hallazgo que Nadie Planeó",
          content: "Las cuatro hipótesis chocaron contra la misma pared: <strong>la barrera no es el diseño ni el precio, es entregar datos financieros y credenciales bancarias.</strong> Nadie quiere digitar manualmente sus deudas por pereza, pero tampoco entregar contraseñas bancarias a ciegas."
        },
        {
          title: "3. Ficha de Aprendizaje & Pivote Estratégico",
          bullets: [
            "<strong>Lo que creíamos:</strong> Que el usuario conectaría su banco de inmediato ante la promesa de un plan de pagos.",
            "<strong>Lo que pasó:</strong> La desconfianza bloquea el registro inicial al exigir cuentas reales.",
            "<strong>Pivote decisivo:</strong> Mover la conexión bancaria al final del embudo. Primero demostrar el valor y el ahorro con datos aproximados (simulador), y solo después pedir consentimiento bancario."
          ]
        }
      ]
    },
    {
      id: 4,
      levelNumber: 4,
      badge: "Entregable 4",
      title: "Sistema de OKRs, KPIs & Framework Híbrido Scrumban",
      subtitle: "Alineación Estratégica, Matriz 2x2 y Métrica de la Estrella del Norte",
      themeColor: "#7C3AED",
      icon: "🎯",
      summary: "Definición del sistema de gestión por objetivos y resultados clave (OKRs), diferenciando métricas de impacto real frente a la ilusión de métricas de vanidad.",
      keyMetrics: [
        { label: "Conexiones Open Finance", value: "300 Beta", desc: "KR1: Usuarios con al menos 2 deudas conectadas" },
        { label: "Tiempo de Diagnóstico", value: "< 3 min", desc: "KR2: Reducción del 70% en tiempo de control" },
        { label: "Métrica Sean Ellis", value: "≥ 40%", desc: "Usuarios muy decepcionados si FinGo desaparece" }
      ],
      sections: [
        {
          title: "1. OKR Estratégico Principal",
          content: "\"Convertir a FinGo en el centro de mando financiero preferido por los jóvenes profesionales, transformando el estrés de múltiples deudas en una ruta clara hacia la libertad financiera.\""
        },
        {
          title: "2. Métricas de Vanidad que Evitamos vs. Métricas Accionables",
          bullets: [
            "<strong>Vanidad:</strong> '125.767 descargas en tiendas de apps' → <strong>Accionable:</strong> 'El 70% de usuarios ejecutó su primer abono programado'.",
            "<strong>Vanidad:</strong> '3.3 millones de impresiones en redes' → <strong>Accionable:</strong> '50% de usuarios completa la clasificación de sus pasivos'.",
            "<strong>Vanidad:</strong> 'Puntaje de juego acumulado' → <strong>Accionable:</strong> 'Reducción neta cuantificable de intereses pagados en pesos'."
          ]
        },
        {
          title: "3. Matriz 2x2 de Enfoque y Relevancia Operacional",
          bullets: [
            "<strong>Cuadrante I (Estratégico Vital):</strong> Conexión Open Finance y Motor de Priorización Bola de Nieve/Avalancha.",
            "<strong>Cuadrante II (Operativo Rápido):</strong> Diagnóstico interactivo $0 en onboarding express.",
            "<strong>Cuadrante III (Secundario/Posterior):</strong> Marketplace de refinanciación con bancos aliados.",
            "<strong>Cuadrante IV (Distractor a Descartar):</strong> Gamificación con avatars cosméticos o registro manual engorroso."
          ]
        },
        {
          title: "4. Framework Híbrido: Scrumban + Lean Startup",
          content: "Lean Startup define <em>qué construir</em> mediante experimentos continuos; Scrum estructura los <em>roles y sprints</em>; y Kanban optimiza el <em>flujo de valor diario</em> imponiendo límites de trabajo en proceso (WIP Limits)."
        }
      ]
    },
    {
      id: 5,
      levelNumber: 5,
      badge: "Entregable 5",
      title: "Resolución de Conflictos & Gestión del Cambio",
      subtitle: "Role-Play de Crisis de Lanzamiento del MVP: De Posiciones a Intereses",
      themeColor: "#DC2626",
      icon: "⚡",
      summary: "Simulación de una crisis real previa al lanzamiento del MVP donde cuatro áreas de la startup chocaron por fechas y alcance, resolviéndose mediante la metodología Lean de Soft Launch.",
      keyMetrics: [
        { label: "Cupos de Beta Cerrada", value: "50-100", desc: "Fase 1: Acceso anticipado controlado" },
        { label: "Límite de WIP Kanban", value: "≤ 2 tareas", desc: "Máximo 2 tareas activas por miembro" },
        { label: "Criterio de Salida Fase 3", value: "0 Errores", desc: "Estabilidad del motor durante 7 días continuos" }
      ],
      sections: [
        {
          title: "1. La Crisis: Cuatro Áreas, Cuatro Verdades Legítimas",
          bullets: [
            "<strong>Esteban David Quirós Marín:</strong> Consideración de la validación regulatoria y mitigación de contingencias normativas.",
            "<strong>Deyanira Castaño Cholo:</strong> Compromisos de captación de usuarios y expectativa comercial ya generada.",
            "<strong>Juan Diego Valencia:</strong> Estabilidad de conexiones bancarias y precisión matemática del motor de pagos.",
            "<strong>Aura Mendoza:</strong> Cumplimiento de hitos estratégicos frente a los inversionistas."
          ]
        },
        {
          title: "2. El Giro de la Negociación: Separar Fecha de Alcance",
          content: "Se reformuló la pregunta bloqueante <em>'¿Lanzamos o aplazamos?'</em> por la pregunta que destraba: <strong>'¿Qué significa lanzar y para quiénes?'</strong> Se pasó de posiciones rígidas a intereses compatibles."
        },
        {
          title: "3. La Solución: Soft Launch en 3 Fases",
          bullets: [
            "<strong>Fase 1 (Día de Lanzamiento):</strong> Beta cerrada 'Acceso Anticipado' para 50-100 usuarios con consentimiento explícito.",
            "<strong>Fase 2 (Semanas 1-3):</strong> Monitoreo de APIs y estabilización del motor de priorización.",
            "<strong>Fase 3 (Apertura General):</strong> Escalamiento público condicionado a 0 errores críticos durante 7 días y concepto jurídico emitido."
          ]
        },
        {
          title: "4. Los 5 Acuerdos de Gobernanza de FinGo",
          bullets: [
            "1. Ninguna fecha pública sin la firma conjunta de las cuatro áreas.",
            "2. Definición de Hecho (DoD) de lanzamiento técnica y legalmente verificable.",
            "3. Comité semanal de sincronización con la Gerencia General.",
            "4. Límite de WIP estricto formalizado en Notion (máx 2 tareas en curso por persona).",
            "5. Cada aprendizaje de retrospectiva se convierte en tarea con responsable y fecha."
          ]
        }
      ]
    },
    {
      id: 6,
      levelNumber: 6,
      badge: "Entregable 6 (Final)",
      title: "Matriz ERIC & Pitch Final del Modelo de Negocio",
      subtitle: "Estrategia del Océano Azul & Sustentación Ejecutiva en Gamma.app",
      themeColor: "#059669",
      icon: "🏆",
      summary: "Consolidación final de FinGo en el mercado fintech colombiano mediante la Matriz ERIC y el Pitch Ejecutivo para inversionistas, evaluadores y aliados estratégicos.",
      keyMetrics: [
        { label: "Ahorro Estimado de Intereses", value: "35% - 48%", desc: "Optimización por algoritmo de Avalancha" },
        { label: "Tiempo para Salir de Deudas", value: "-14 Meses", desc: "Reducción promedio frente al pago mínimo tradicional" },
        { label: "Modelo de Monetización", value: "Freemium + % Ahorro", desc: "Sin barrera de entrada; monetización compartida" }
      ],
      sections: [
        {
          title: "1. Matriz ERIC de FinGo (Estrategia del Océano Azul)",
          ericGrid: {
            eliminar: [
              "Cobros ocultos y comisiones sorpresa por consulta.",
              "Digitación manual obligatoria de facturas y deudas.",
              "Gamificación superficial de puntos sin impacto económico.",
              "Letra chica y lenguaje técnico incomprensible."
            ],
            reducir: [
              "El tiempo de diagnóstico de salud financiera (a < 3 minutos).",
              "La tasa promedio de interés pagada por mes refinanciando pasivos.",
              "El estrés y ansiedad del usuario ante múltiples fechas de corte.",
              "La fricción de registro pidiendo datos sensibles al inicio."
            ],
            incrementar: [
              "La visibilidad consolidada en tiempo real de activos vs pasivos.",
              "La velocidad de amortización a capital con métodos Bola de Nieve/Avalancha.",
              "La transparencia de la Tasa Efectiva Anual (TEA) calculada en pesos.",
              "La educación financiera personalizada aplicada al caso real del usuario."
            ],
            crear: [
              "Simulador de diagnóstico interactivo $0 sin conexión bancaria previa.",
              "Motor predictivo de alertas anti-mora sincronizado con calendario.",
              "Planes de pago personalizados adaptables a variaciones de ingresos.",
              "Ecosistema transparente regulado bajo el Decreto 0368 de 2026 (Open Finance)."
            ]
          }
        },
        {
          title: "2. Sustentación Ejecutiva (Pitch Deck FinGo)",
          content: "FinGo no compite en el saturado mercado de registro manual de gastos. Es el primer centro de mando integral de desendeudamiento en Colombia que transforma la agonía financiera en libertad cuantificable, combinando Open Finance, IA de priorización y pedagogía ciudadana."
        }
      ]
    }
  ]
};
