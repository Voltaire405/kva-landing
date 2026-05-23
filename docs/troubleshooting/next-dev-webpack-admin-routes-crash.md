# Crash de Next.js dev al compilar rutas admin

## Síntoma

- Login en `/admin/login` se queda en **"Verificando..."**
- Terminal muestra:
  ```
  TypeError: Cannot read properties of undefined (reading 'length')
  ⨯ uncaughtException
  ○ Compiling /api/admin/auth ...
  ```
  o `Compiling /admin ...`

## Diagnóstico erróneo común

Parece un fallo en `/api/admin/auth` o en `verifyAccessCode` (`.length` sobre `undefined`), pero la autenticación funciona: el POST puede responder `200` antes de que el servidor dev se caiga.

## Causa real

Bug del **bundler Webpack** de Next.js 15 en modo dev. Al compilar una segunda ruta del área admin (p. ej. `/admin/login` y luego `/api/admin/auth` o `/admin`), Webpack lanza:

```
WasmHash._updateWithBuffer → FileSystemInfo._resolveContextTimestamp
```

El servidor dev crashea y las peticiones siguientes fallan (timeout / empty reply).

En **producción** (`next build` + `next start`) no ocurre.

## Solución

Usar **Turbopack** en desarrollo:

```json
"dev": "next dev --turbo"
```

## Verificación

1. `bun run dev`
2. Abrir `/admin/login`, enviar código válido
3. Debe redirigir a `/admin` sin `uncaughtException` en terminal

## Nota UX relacionada

Si el servidor no crashea pero el botón queda cargando, revisar que el formulario de login haga `setLoading(false)` también en el camino de éxito, no solo en error.
