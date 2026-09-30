/**
 * Wrapper pencetakan halaman — aman untuk SSR (`window` hanya ada di client).
 * Pengganti pemanggilan `window.print()` langsung di <script setup>.
 */
export const usePrint = () => {
  const printPage = () => {
    if (import.meta.client) {
      window.print()
    }
  }

  return { printPage }
}