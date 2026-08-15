/**
 * Generic [[key]] merge for outbound email templates.
 * No hardcoded variable names — any key in `variables` is eligible.
 */
export function applyTemplateVariables(
  template: string,
  variables: unknown,
): string {
  if (variables == null || typeof variables !== 'object' || Array.isArray(variables)) {
    return template
  }

  const map = variables as Record<string, unknown>

  return template.replace(/\[\[([^\]]+)\]\]/g, (_match, rawKey: string) => {
    const key = rawKey.trim()
    if (!key) return ''
    return variableValueToString(map[key])
  })
}

function variableValueToString(value: unknown): string {
  if (value == null) return ''
  if (typeof value === 'string') {
    return value.trim() === '' ? '' : value
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }
  return ''
}
