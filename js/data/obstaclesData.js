/**
 * FinGo - Catálogo de Obstáculos y Amenazas Financieras Educativas
 * Cada obstáculo cuenta con:
 * - Nombre y tipo de riesgo financiero
 * - Nivel de riesgo (Bajo, Medio, Alto, Crítico)
 * - Descripción educativa real
 * - Mecánica para esquivarlo:
 *    - 'dodge': Esquivar cambiando de carril (obstáculos anchos o altos)
 *    - 'jump': Esquivar saltando (obstáculos a nivel del suelo)
 *    - 'slide': Esquivar deslizándose por debajo (barreras aéreas o láseres)
 * - Apariencia visual (color, icono, forma geométrica 3D)
 */

const OBSTACLES_DATA = {
  // Nivel 1: Selva de Deudas Dispersas
  level1: [
    {
      id: "billete_falso",
      name: "Billetes Falsos y Efectivo Ilegal",
      riskLevel: "Medio",
      dodgeType: "jump",
      color: "#EF4444",
      accentColor: "#F87171",
      icon: "💵",
      height: 0.9,
      width: 1.1,
      yPos: 0,
      description: "El uso de efectivo no trazable o falsificado destruye el patrimonio familiar y fomenta la informalidad económica.",
      tip: "Usa el botón de Salto o pulsa Flecha Arriba para saltarlo."
    },
    {
      id: "tarjeta_saturada",
      name: "Tarjeta de Crédito al Tope (Mora)",
      riskLevel: "Alto",
      dodgeType: "dodge",
      color: "#DC2626",
      accentColor: "#B91C1C",
      icon: "💳",
      height: 2.2,
      width: 1.3,
      yPos: 0,
      description: "Utilizar más del 50% del cupo crediticio deteriora tu score en centrales de riesgo y dispara el pago de intereses corrientes.",
      tip: "Cambia de carril hacia la izquierda o derecha para esquivar este muro crediticio."
    },
    {
      id: "laser_intereses_ocultos",
      name: "Barrera de Intereses Ocultos y TEA Opaca",
      riskLevel: "Crítico",
      dodgeType: "slide",
      color: "#F59E0B",
      accentColor: "#FBBF24",
      icon: "⚡",
      height: 1.2,
      width: 1.4,
      yPos: 1.3, // Elevated obstacle! Requires sliding underneath
      description: "Comisiones y gastos de administración no informados que inflan el Costo Total de la deuda en pesos sin advertencia.",
      tip: "¡Agáchate deslizándote! Presiona Flecha Abajo o desliza el dedo hacia abajo."
    }
  ],

  // Nivel 2: La Autopista de la Regulación
  level2: [
    {
      id: "ataque_phishing",
      name: "Enlace Malicioso de Phishing Bancario",
      riskLevel: "Crítico",
      dodgeType: "dodge",
      color: "#9333EA",
      accentColor: "#C084FC",
      icon: "🎣",
      height: 2.2,
      width: 1.3,
      yPos: 0,
      description: "Mensajes falsos suplantando entidades financieras para robar tus claves bancarias y tokens dinámicos.",
      tip: "¡No abras el enlace! Muévete a otro carril de inmediato."
    },
    {
      id: "fuga_datos_personales",
      name: "Fuga de Datos (Brecha Ley 1581)",
      riskLevel: "Alto",
      dodgeType: "jump",
      color: "#E11D48",
      accentColor: "#FB7185",
      icon: "🔓",
      height: 0.9,
      width: 1.2,
      yPos: 0,
      description: "Plataformas que no cumplen con la Ley 1581 de 2012 exponen tus números de cédula, ingresos y estado crediticio a terceros.",
      tip: "¡Salta la brecha de datos con Flecha Arriba!"
    },
    {
      id: "laser_app_falsa",
      name: "Barrera de App Financiera Falsa (Gota a Gota)",
      riskLevel: "Crítico",
      dodgeType: "slide",
      color: "#EF4444",
      accentColor: "#FCA5A5",
      icon: "📱",
      height: 1.2,
      width: 1.4,
      yPos: 1.3,
      description: "Aplicaciones fraudulentas que acceden a tus contactos para extorsión con tasas usurarias no vigiladas por la SFC.",
      tip: "¡Deslízate por debajo para evadir la trampa digital!"
    }
  ],

  // Nivel 3: El Fuego Cruzado Lean
  level3: [
    {
      id: "muro_desconfianza_bancaria",
      name: "Muro de Desconfianza (Tarjeta Obligatoria)",
      riskLevel: "Alto",
      dodgeType: "dodge",
      color: "#475569",
      accentColor: "#94A3B8",
      icon: "🔒",
      height: 2.3,
      width: 1.4,
      yPos: 0,
      description: "Pedir la tarjeta de nómina en el primer segundo causa abandono inmediato del 85% de los usuarios por temor al fraude.",
      tip: "Esquiva este muro cambiando de carril hacia el simulador seguro."
    },
    {
      id: "pregunta_trampa_sesgada",
      name: "Pregunta Sesgada: '¿Te gusta la app?'",
      riskLevel: "Medio",
      dodgeType: "jump",
      color: "#F59E0B",
      accentColor: "#FDE68A",
      icon: "❓",
      height: 0.9,
      width: 1.1,
      yPos: 0,
      description: "Preguntar opiniones genera respuestas complacientes falsas. En Lean Startup solo se miden conductas reales.",
      tip: "¡Salta sobre las opiniones vacías con Flecha Arriba!"
    },
    {
      id: "laser_pagos_forzosos",
      name: "Láser de Pagos Automáticos No Deseados",
      riskLevel: "Crítico",
      dodgeType: "slide",
      color: "#DC2626",
      accentColor: "#F87171",
      icon: "⚠️",
      height: 1.2,
      width: 1.4,
      yPos: 1.3,
      description: "Debitar dinero sin confirmación expresa provoca pánico y rechazo total hacia las soluciones fintech.",
      tip: "¡Deslízate por debajo del cobro automático no deseado!"
    }
  ],

  // Nivel 4: El Circuito Scrumban & OKRs
  level4: [
    {
      id: "metrica_vanidad_descargas",
      name: "Métrica de Vanidad: '125k Descargas Inútiles'",
      riskLevel: "Medio",
      dodgeType: "jump",
      color: "#EA580C",
      accentColor: "#FDBA74",
      icon: "🎈",
      height: 0.9,
      width: 1.2,
      yPos: 0,
      description: "Celebrar descargas o likes sin retención ni pago de deudas es un espejismo que quema el presupuesto de la startup.",
      tip: "¡Salta la ilusión de vanidad y enfócate en valor!"
    },
    {
      id: "cuello_botella_wip",
      name: "Cuello de Botella (WIP Ilimitado sin Control)",
      riskLevel: "Alto",
      dodgeType: "dodge",
      color: "#64748B",
      accentColor: "#CBD5E1",
      icon: "🚧",
      height: 2.2,
      width: 1.3,
      yPos: 0,
      description: "Tener 10 tareas abiertas simultáneas por desarrollador paraliza las entregas y degrada la calidad del software.",
      tip: "Cambia de carril para respetar el límite de WIP (máximo 2 tareas)."
    },
    {
      id: "laser_desalineacion_okr",
      name: "Láser de Desalineación Estratégica",
      riskLevel: "Crítico",
      dodgeType: "slide",
      color: "#8B5CF6",
      accentColor: "#DDD6FE",
      icon: "⚡",
      height: 1.2,
      width: 1.4,
      yPos: 1.3,
      description: "Desarrollar funciones complejas que no impactan los KRs ni ayudan al usuario a liquidar sus intereses.",
      tip: "¡Deslízate por debajo para mantener el foco en la Estrella del Norte!"
    }
  ],

  // Nivel 5: La Tormenta del Lanzamiento MVP
  level5: [
    {
      id: "silo_departamental",
      name: "Silo Organizacional (Comercial vs Tecnología)",
      riskLevel: "Alto",
      dodgeType: "dodge",
      color: "#B91C1C",
      accentColor: "#F87171",
      icon: "🧱",
      height: 2.3,
      width: 1.4,
      yPos: 0,
      description: "Comercial promete fechas sin consultar a desarrollo y Legal bloquea sin proponer alternativas.",
      tip: "Esquiva los silos cambiando de carril hacia el acuerdo colectivo."
    },
    {
      id: "falsa_dicotomia",
      name: "Falsa Dicotomía: '¿Lanzar o Aplazar?'",
      riskLevel: "Medio",
      dodgeType: "jump",
      color: "#F97316",
      accentColor: "#FED7AA",
      icon: "⚔️",
      height: 0.9,
      width: 1.2,
      yPos: 0,
      description: "Un dilema de suma cero donde un área gana a costa de las demás. La solución es ajustar el alcance, no la fecha.",
      tip: "¡Salta sobre el conflicto destructivo!"
    },
    {
      id: "laser_lanzamiento_masivo_roto",
      name: "Láser de Lanzamiento Prematuro sin Probar",
      riskLevel: "Crítico",
      dodgeType: "slide",
      color: "#DC2626",
      accentColor: "#FECACA",
      icon: "💥",
      height: 1.2,
      width: 1.4,
      yPos: 1.3,
      description: "Abrir a miles de usuarios con APIs bancarias inestables destruye la reputación de FinGo de forma irreversible.",
      tip: "¡Deslízate por debajo hacia el Soft Launch controlado!"
    }
  ],

  // Nivel 6: El Océano Azul de FinGo
  level6: [
    {
      id: "monopolio_bancario_opaco",
      name: "Modelo Tradicional de Intereses Compuestos",
      riskLevel: "Crítico",
      dodgeType: "dodge",
      color: "#1E293B",
      accentColor: "#64748B",
      icon: "🏦",
      height: 2.4,
      width: 1.4,
      yPos: 0,
      description: "El sistema tradicional vive de que el usuario pague solo el mínimo y permanezca endeudado durante décadas.",
      tip: "¡Cambia de carril hacia el Océano Azul de FinGo!"
    },
    {
      id: "clausula_abusiva_bancaria",
      name: "Cláusula de Permanencia y Penalidad Bancaria",
      riskLevel: "Alto",
      dodgeType: "jump",
      color: "#E11D48",
      accentColor: "#FDA4AF",
      icon: "⛓️",
      height: 0.9,
      width: 1.2,
      yPos: 0,
      description: "Sanciones ilegales por pago anticipado de créditos, prohibidas por la Ley de Consumidor Financiero.",
      tip: "¡Salta la trampa con el botón de Salto!"
    },
    {
      id: "laser_sobreendeudamiento_final",
      name: "Láser de Espiral de Refinanciaciones Fallidas",
      riskLevel: "Crítico",
      dodgeType: "slide",
      color: "#EF4444",
      accentColor: "#FCA5A5",
      icon: "🌪️",
      height: 1.2,
      width: 1.4,
      yPos: 1.3,
      description: "Pagar una tarjeta de crédito sacando un avance de otra: el ciclo de destrucción de salud financiera.",
      tip: "¡Deslízate con maestría hacia la Libertad Financiera!"
    }
  ]
};
