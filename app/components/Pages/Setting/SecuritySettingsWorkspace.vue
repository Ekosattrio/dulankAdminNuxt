<script setup lang="ts">
import SalesListHeader from '~/components/Sales/SalesListHeader.vue'
import SalesFeedback from '~/components/Sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/Sales/SalesConfirmDelete.vue'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'
import SecurityItemsList from './Security/SecurityItemsList.vue'
import SecurityPasswordModal from './Security/SecurityPasswordModal.vue'
import SecurityContactModal from './Security/SecurityContactModal.vue'
import SecurityDevicesModal from './Security/SecurityDevicesModal.vue'
import SecurityActivityModal from './Security/SecurityActivityModal.vue'

const { security, pending, error, refresh, updateSecurity, changePassword } = useSecuritySettings()

const toastSuccess = ref('')
const toastError = ref('')
const isBusy = ref(false)

const isPasswordModalOpen = ref(false)
const isTwoFactorModalOpen = ref(false)
const isContactModalOpen = ref(false)
const contactModalType = ref<'phone' | 'email'>('phone')

const isDevicesModalOpen = ref(false)
const isActivityModalOpen = ref(false)

const isConfirmDeleteOpen = ref(false)
const deleteTargetType = ref<'phone' | 'email'>('phone')

function notifySuccess(msg: string) {
  toastSuccess.value = msg
  setTimeout(() => { toastSuccess.value = '' }, 4000)
}

function handleToggle2FA() { isTwoFactorModalOpen.value = true }
function handleToggleGoogle() { isTwoFactorModalOpen.value = true }

async function handlePasswordSubmit(payload: { currentPassword: string; newPassword: string; confirmPassword: string }) {
  isBusy.value = true
  try {
    await changePassword(payload)
    isPasswordModalOpen.value = false
    notifySuccess('Password berhasil diperbarui!')
  } catch (err: any) {
    toastError.value = err?.data?.message || 'Gagal mengubah password'
  } finally {
    isBusy.value = false
  }
}

function openChangePhone() {
  contactModalType.value = 'phone'
  isContactModalOpen.value = true
}

function openChangeEmail() {
  contactModalType.value = 'email'
  isContactModalOpen.value = true
}

async function handleContactSubmit(val: string) {
  isBusy.value = true
  try {
    if (contactModalType.value === 'phone') {
      await updateSecurity({ phone: val })
      notifySuccess('Nomor telepon akun berhasil diperbarui!')
    } else {
      await updateSecurity({ email: val })
      notifySuccess('Alamat email akun berhasil diperbarui!')
    }
    isContactModalOpen.value = false
  } catch (err: any) {
    toastError.value = 'Gagal memperbarui kontak'
  } finally {
    isBusy.value = false
  }
}

function confirmRemoveContact(type: 'phone' | 'email') {
  deleteTargetType.value = type
  isConfirmDeleteOpen.value = true
}

async function handleRemoveContact() {
  isBusy.value = true
  try {
    if (deleteTargetType.value === 'phone') {
      await updateSecurity({ phone: '' })
      notifySuccess('Nomor telepon akun telah dihapus')
    } else {
      throw new Error('Email login wajib tersedia. Ganti alamat email melalui formulir.')
    }
    isConfirmDeleteOpen.value = false
  } catch (err: any) {
    toastError.value = err?.data?.message || err?.message || 'Gagal menghapus kontak'
  } finally {
    isBusy.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <SalesListHeader
      title="Security Settings"
      subtitle="Kelola konfigurasi keamanan akun, sandi, 2-faktor, dan riwayat perangkat masuk"
      :refreshing="pending"
      @refresh="refresh"
    />

    <!-- Feedback messages -->
    <ActionToast :message="toastSuccess" @dismiss="toastSuccess = ''" />

    <ActionToast :message="toastError" tone="error" @dismiss="toastError = ''" />

    <SalesFeedback
      v-if="pending && !security"
      loading
    />
    <SalesFeedback
      v-else-if="error"
      :error="error.message || 'Gagal memuat pengaturan keamanan'"
      @retry="refresh"
    />

    <SecurityItemsList
      v-else
      :security="security"
      @change-password="isPasswordModalOpen = true"
      @toggle-2fa="handleToggle2FA"
      @toggle-google="handleToggleGoogle"
      @change-phone="openChangePhone"
      @remove-phone="confirmRemoveContact('phone')"
      @change-email="openChangeEmail"
      @remove-email="confirmRemoveContact('email')"
      @manage-devices="isDevicesModalOpen = true"
      @view-activities="isActivityModalOpen = true"
      @deactivate-account="toastError = 'Silakan hubungi Super Admin untuk penonaktifan akun.'"
    />

    <SecurityTwoFactorModal :open="isTwoFactorModalOpen" :enabled="security.twoFactor" @close="isTwoFactorModalOpen = false" @updated="refresh(); notifySuccess('Autentikasi diperbarui')" />
    <!-- Sub Modals -->
    <SecurityPasswordModal
      :open="isPasswordModalOpen"
      :busy="isBusy"
      @close="isPasswordModalOpen = false"
      @submit="handlePasswordSubmit"
    />

    <SecurityContactModal
      :open="isContactModalOpen"
      :type="contactModalType"
      :current-value="contactModalType === 'phone' ? security.phone : security.email"
      :busy="isBusy"
      @close="isContactModalOpen = false"
      @submit="handleContactSubmit"
    />

    <SecurityDevicesModal
      :open="isDevicesModalOpen"
      :devices="security.devices || []"
      @close="isDevicesModalOpen = false"
    />

    <SecurityActivityModal
      :open="isActivityModalOpen"
      :activities="security.activities || []"
      @close="isActivityModalOpen = false"
    />

    <SalesConfirmDelete
      :open="isConfirmDeleteOpen"
      :title="deleteTargetType === 'phone' ? 'Hapus Nomor Telepon' : 'Hapus Alamat Email'"
      :message="`Apakah Anda yakin ingin menghapus ${deleteTargetType === 'phone' ? 'nomor telepon' : 'alamat email'} verifikasi akun ini?`"
      :busy="isBusy"
      @cancel="isConfirmDeleteOpen = false"
      @confirm="handleRemoveContact"
    />
  </div>
</template>
