// A simple in-memory store for nonces with a timeout.
// NOTE: In a real-world, scalable application, this should be replaced
// with a distributed cache like Redis or a database.
// For a single-server or development environment, this is sufficient.

const nonceStore = new Map<string, { nonce: string; timestamp: number }>();
const NONCE_EXPIRATION_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Saves a nonce for a given address.
 * @param address The user's wallet address.
 * @param nonce The generated nonce.
 */
export function saveNonce(address: string, nonce: string): void {
  const normalizedAddress = address.toLowerCase();
  nonceStore.set(normalizedAddress, { nonce, timestamp: Date.now() });
}

/**
 * Retrieves a nonce for a given address, if it's valid and not expired.
 * @param address The user's wallet address.
 * @returns The nonce string, or undefined if not found or expired.
 */
export function getNonce(address: string): string | undefined {
  const normalizedAddress = address.toLowerCase();
  const entry = nonceStore.get(normalizedAddress);

  if (!entry) {
    return undefined;
  }

  const isExpired = (Date.now() - entry.timestamp) > NONCE_EXPIRATION_MS;
  if (isExpired) {
    nonceStore.delete(normalizedAddress); // Clean up expired nonce
    return undefined;
  }

  return entry.nonce;
}

/**
 * Deletes a nonce after it has been used.
 * @param address The user's wallet address.
 */
export function consumeNonce(address: string): void {
   const normalizedAddress = address.toLowerCase();
   nonceStore.delete(normalizedAddress);
}
