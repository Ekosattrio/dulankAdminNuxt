import type { EmployeeItem } from '#server/types/employee'

export function useEmployeeEditor(mode: Ref<'add' | 'edit'>) {
  const route = useRoute()
  const router = useRouter()
  const editId = computed(() => mode.value === 'edit' && typeof route.query.id === 'string' ? route.query.id : '')
  const { saveEmployee } = useEmployees()
  const { managers } = useMasterOptions()
  const { departments } = useDepartments()
  const form = reactive({ avatar: '', photoId: '', userId: '', fullName: '', gender: '', dob: '', joinDate: '', address: '', detailAddress: '', department: '', contactPerson1: '', contactPhone1: '', contactPerson2: '', contactPhone2: '', email: '', phone: '', password: '', confirmPassword: '' })
  const errorMessage = ref('')
  const isSubmitting = ref(false)
  const isLoading = ref(false)
  const loadedId = ref('')
  watch(editId, async (id, _previous, onCleanup) => {
    if (!id) return
    let cancelled = false
    onCleanup(() => { cancelled = true })
    isLoading.value = true
    loadedId.value = ''
    errorMessage.value = ''
    try {
      const result = await apiFetch<{ data: EmployeeItem }>(`/api/v1/admin/employees/${encodeURIComponent(id)}`)
      if (cancelled) return
      const employee = result.data
      Object.assign(form, { avatar: employee.avatar || '', photoId: employee.photoId || '', userId: employee.userId || '', fullName: employee.name, gender: employee.gender || '', dob: employee.dob || '', joinDate: employee.joinDate || '', address: employee.address || '', detailAddress: employee.detailAddress || '', department: employee.department || '', contactPerson1: employee.contact1Name || '', contactPhone1: employee.contact1Phone || '', contactPerson2: employee.contact2Name || '', contactPhone2: employee.contact2Phone || '', email: employee.email || '', phone: employee.phone || '' })
      loadedId.value = id
    } catch (cause: any) {
      if (!cancelled) errorMessage.value = cause?.data?.message || 'Gagal memuat karyawan.'
    } finally { if (!cancelled) isLoading.value = false }
  }, { immediate: true })
  async function submitForm() {
    if (isSubmitting.value || isLoading.value) return
    errorMessage.value = ''
    if (mode.value === 'edit' && (!editId.value || loadedId.value !== editId.value)) { errorMessage.value = 'ID karyawan wajib tersedia untuk edit.'; return }
    if (form.password || form.confirmPassword) { errorMessage.value = 'Akun login karyawan dikelola melalui User Admin.'; return }
    isSubmitting.value = true
    try {
      await saveEmployee({ id: editId.value || undefined, avatar: form.avatar, photoId: form.photoId, userId: form.userId || null, name: form.fullName, gender: form.gender, dob: form.dob || undefined, joinDate: form.joinDate || undefined, address: form.address, detailAddress: form.detailAddress, department: form.department, contact1Name: form.contactPerson1, contact1Phone: form.contactPhone1, contact2Name: form.contactPerson2, contact2Phone: form.contactPhone2, email: form.email, phone: form.phone })
      await router.push('/employees')
    } catch (cause: any) { errorMessage.value = cause?.data?.message || 'Gagal menyimpan karyawan.' }
    finally { isSubmitting.value = false }
  }
  function selectPhoto(event: Event, field: 'avatar' | 'photoId') {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 4 * 1024 * 1024) { errorMessage.value = 'Gunakan JPG, PNG, atau WebP maksimal 4 MB.'; return }
    const reader = new FileReader()
    reader.onload = () => { form[field] = String(reader.result) }
    reader.readAsDataURL(file)
  }
  return { isLoading, selectPhoto, form, errorMessage, isSubmitting, departments, managers, submitForm }
}
