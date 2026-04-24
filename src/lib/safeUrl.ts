export function getSafeExternalUrl(value?: string | null): string | null {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.toString() : null;
  } catch {
    return null;
  }
}

export function isSafeExternalUrl(value?: string | null): boolean {
  return getSafeExternalUrl(value) !== null;
}
