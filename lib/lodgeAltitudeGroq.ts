/**
 * GROQ fragment: expose a single `altitude` value for the site and Studio.
 * `altitudeLegacy` is the typed string field on `lodge`; older documents may still
 * store a number or string under the legacy `altitude` key (no longer declared in schema).
 */
export const GROQ_LODGE_ALTITUDE_AS_ALTITUDE = '"altitude": coalesce(altitudeLegacy, altitude)'
