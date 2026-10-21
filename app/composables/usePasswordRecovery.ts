export function usePasswordRecovery() {
  const busy = ref(false)
  const error = ref('')
  const submitted = ref(false)
  async function send(email: string) {
    if (busy.value) return
    busy.value = true; error.value = ''; submitted.value = false
    try { await apiFetch('/api/v1/admin/auth/forgot-password', { method: 'POST', body: { email } }); submitted.value = true }
    catch (cause: any) { error.value = cause?.data?.message || 'Permintaan pemulihan gagal. Coba kembali.' }
    finally { busy.value = false }
  }
  async function reset(email: string, token: string, password: string, confirmation: string) {
    if (busy.value) return
    busy.value = true; error.value = ''; submitted.value = false
    try { await apiFetch('/api/v1/admin/auth/reset-password', { method: 'POST', body: { email, token, password, password_confirmation: confirmation } }); submitted.value = true }
    catch (cause: any) { error.value = cause?.data?.message || 'Pemulihan password gagal.' }
    finally { busy.value = false }
  }
  return { busy, error, submitted, send, reset }
}
