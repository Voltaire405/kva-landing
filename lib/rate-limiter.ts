// Sistema de rate limiting simple para serverless
// Almacena intentos en memoria (reinicia con cada cold start)

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// Map para almacenar intentos por IP
const rateLimitStore = new Map<string, RateLimitEntry>();

// Configuración
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 horas
const MAX_REQUESTS_PER_WINDOW = 3; // 3 intentos cada 24 horas

/**
 * Limpia entradas expiradas del store
 */
function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Verifica si una IP ha excedido el límite de rate
 * @param identifier - Identificador único (normalmente IP)
 * @returns true si está permitido, false si excedió el límite
 */
export function checkRateLimit(identifier: string): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  cleanupExpiredEntries();

  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || now > entry.resetAt) {
    // Nueva ventana de tiempo
    const resetAt = now + RATE_LIMIT_WINDOW;
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt,
    });

    return {
      allowed: true,
      remaining: MAX_REQUESTS_PER_WINDOW - 1,
      resetAt,
    };
  }

  // Dentro de la ventana de tiempo existente
  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  // Incrementar contador
  entry.count++;
  rateLimitStore.set(identifier, entry);

  return {
    allowed: true,
    remaining: MAX_REQUESTS_PER_WINDOW - entry.count,
    resetAt: entry.resetAt,
  };
}

/**
 * Obtiene la IP del request
 */
export function getClientIP(headers: Headers): string {
  // Intenta obtener la IP real del cliente considerando proxies
  const forwarded = headers.get('x-forwarded-for');
  const real = headers.get('x-real-ip');
  const cfConnecting = headers.get('cf-connecting-ip'); // Cloudflare

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (real) {
    return real.trim();
  }

  if (cfConnecting) {
    return cfConnecting.trim();
  }

  return 'unknown';
}
