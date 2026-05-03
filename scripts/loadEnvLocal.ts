/**
 * Carga `.env.local` antes que el resto de imports del seed (ESM evalúa imports en orden;
 * este módulo debe ser el primer `import` del entrypoint).
 */
import dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({
  path: resolve(process.cwd(), '.env.local'),
  override: true,
})
