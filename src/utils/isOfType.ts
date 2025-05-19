
/**
 * Função utilitária para verificação de tipos
 * Útil para verificar tipos em runtime, melhorando a robustez do código
 */

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isArray<T>(value: unknown, validator?: (item: unknown) => item is T): value is T[] {
  if (!Array.isArray(value)) return false;
  if (!validator) return true;
  return value.every(validator);
}

export function isNonEmptyString(value: unknown): value is string {
  return isString(value) && value.trim() !== '';
}

export function isNullOrUndefined(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}
