type RuntimeEnv = Record<string, unknown>

function readRuntimeEnv(): RuntimeEnv {
  return (globalThis as { __CTX8_ENV?: RuntimeEnv }).__CTX8_ENV ?? {}
}

export function getEnvString(key: string, fallback: string = ''): string {
  const v = readRuntimeEnv()[key]
  if (typeof v === 'string' && v.trim() !== '') return v
  return fallback
}

