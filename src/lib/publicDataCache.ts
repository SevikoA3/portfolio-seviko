import type { getDocs } from 'firebase/firestore/lite';

export const queryCache = new Map<string, {
  expiresAt: number;
  request: ReturnType<typeof getDocs>;
}>();

export function invalidatePublicDataCache() {
  queryCache.clear();
}
