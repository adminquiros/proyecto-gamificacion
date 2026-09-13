/**
 * FinGo - Catálogo de Coleccionables Positivos y Power-ups Financieros
 * Tipos:
 * - 'coin': Moneda FinGo (+10 pts)
 * - 'shield': Escudo Antifraude (protección contra 1 choque por 8 segundos)
 * - 'multiplier': Multiplicador 2x de Ahorro e Intereses (duplica puntos por 10 segundos)
 * - 'gem': Gema de Salud Financiera (+50 pts y recarga barra de nivel)
 * - 'heart': Recuperador de Vida (+1 corazón si tienes menos de 3)
 */

const COLLECTIBLES_DATA = {
  coin: {
    id: "fingo_coin",
    name: "Moneda de Ahorro FinGo",
    type: "coin",
    points: 10,
    color: "#FBBF24",
    accentColor: "#F59E0B",
    icon: "🪙",
    radius: 0.45,
    description: "Cada peso amortizado a capital reduce exponencialmente los intereses futuros."
  },
  shield: {
    id: "security_shield",
    name: "Escudo Antifraude SFC",
    type: "shield",
    points: 25,
    duration: 8000, // 8 seconds
    color: "#3B82F6",
    accentColor: "#60A5FA",
    icon: "🛡️",
    radius: 0.55,
    description: "Cifrado AES-256 y autenticación reforzada. Te protege de la próxima colisión con una amenaza financiera."
  },
  multiplier: {
    id: "smart_avalanche",
    name: "Multiplicador de Avalancha (2x Puntos)",
    type: "multiplier",
    points: 30,
    duration: 10000, // 10 seconds
    multiplier: 2,
    color: "#10B981",
    accentColor: "#34D399",
    icon: "⚡",
    radius: 0.55,
    description: "El método Avalancha ataca la deuda con mayor tasa TEA, duplicando la eficiencia de tu flujo de caja."
  },
  gem: {
    id: "health_gem",
    name: "Gema de Salud Financiera & OKRs",
    type: "gem",
    points: 75,
    color: "#8B5CF6",
    accentColor: "#A78BFA",
    icon: "💎",
    radius: 0.6,
    description: "Logro de un KR clave: ¡tu perfil crediticio sube a nivel Excelente!"
  },
  heart: {
    id: "heart_life",
    name: "Respaldo de Emergencia (Vida Extra)",
    type: "heart",
    points: 50,
    color: "#EC4899",
    accentColor: "#F472B6",
    icon: "❤️",
    radius: 0.5,
    description: "Un fondo de ahorro de emergencia para imprevistos te devuelve una vida financiera."
  }
};
