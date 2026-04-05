export function deepMerge<T extends Record<string, unknown>>(base: T, patch: Record<string, unknown>): T {
  const result: Record<string, unknown> = { ...base };

  for (const [key, value] of Object.entries(patch)) {
    const previous = result[key];
    if (isObject(previous) && isObject(value)) {
      result[key] = deepMerge(previous, value);
      continue;
    }

    result[key] = value;
  }

  return result as T;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
