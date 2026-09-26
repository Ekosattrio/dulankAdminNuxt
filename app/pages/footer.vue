<template>
  <div class="page-wrapper">
    <div class="content">
      <div class="page-header mt-3">
        <div class="page-title">
          <h4>Footer Settings</h4>
          <h6>Configure public webstore footer content, links, and contact information</h6>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-lg-12">
          <!-- Main Content Section -->
          <div class="card mb-4 shadow-sm">
            <div class="card-header bg-white border-bottom">
              <h5 class="card-title mb-0 fw-bold">Konten Utama</h5>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label fw-medium">Judul Footer</label>
                  <input v-model="footerState.judul" class="form-control" type="text" placeholder="e.g. Percetakan Kacetak Dulank" />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-medium">Copyright</label>
                  <input
                    v-model="footerState.copyright"
                    class="form-control"
                    type="text"
                    placeholder="© 2025 Kacetak System — Semua hak dilindungi"
                  />
                </div>
                <div class="col-12">
                  <label class="form-label fw-medium">Teks Singkat (Deskripsi / Tagline)</label>
                  <textarea
                    v-model="footerState.desc"
                    class="form-control"
                    rows="3"
                    placeholder="Solusi cetak offset dan digital terpercaya untuk kebutuhan kemasan, buku, dan media promosi bisnis Anda."
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Links: Info Kami -->
          <div class="card mb-4 shadow-sm">
            <div class="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
              <div>
                <h5 class="card-title mb-0 fw-bold">Info Kami</h5>
                <p class="text-muted small mb-0">Link informasi perusahaan di footer webstore.</p>
              </div>
            </div>
            <div class="card-body">
              <div class="space-y-2 mb-3">
                <div
                  v-for="(item, idx) in footerState.infoKami"
                  :key="idx"
                  class="d-flex align-items-center gap-2 mb-2"
                >
                  <input v-model="item.text" class="form-control form-control-sm" placeholder="Judul link (mis. Tentang Kami)" style="max-width: 260px;" />
                  <input v-model="item.href" class="form-control form-control-sm" placeholder="URL (https://...)" />
                  <button type="button" class="btn btn-sm btn-danger px-2" @click="removeInfoKami(idx)">
                    <i class="ti ti-trash"></i>
                  </button>
                </div>
              </div>

              <div class="d-flex gap-2 p-3 bg-light rounded border">
                <input v-model="newInfoText" class="form-control form-control-sm" placeholder="Judul link baru..." style="max-width: 260px;" />
                <input v-model="newInfoHref" class="form-control form-control-sm" placeholder="URL (# atau https://...)" />
                <button type="button" class="btn btn-sm btn-primary text-nowrap" @click="addInfoKami">
                  <i class="ti ti-plus me-1"></i>Tambah Link
                </button>
              </div>
            </div>
          </div>

          <!-- Quick Links: Panduan Pelanggan Baru -->
          <div class="card mb-4 shadow-sm">
            <div class="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
              <div>
                <h5 class="card-title mb-0 fw-bold">Panduan Pelanggan Baru</h5>
                <p class="text-muted small mb-0">Link tutorial pemesanan, format file, dan garansi cetak.</p>
              </div>
            </div>
            <div class="card-body">
              <div class="space-y-2 mb-3">
                <div
                  v-for="(item, idx) in footerState.panduan"
                  :key="idx"
                  class="d-flex align-items-center gap-2 mb-2"
                >
                  <input v-model="item.text" class="form-control form-control-sm" placeholder="Judul panduan (mis. Cara Pembelian)" style="max-width: 260px;" />
                  <input v-model="item.href" class="form-control form-control-sm" placeholder="URL (https://...)" />
                  <button type="button" class="btn btn-sm btn-danger px-2" @click="removePanduan(idx)">
                    <i class="ti ti-trash"></i>
                  </button>
                </div>
              </div>

              <div class="d-flex gap-2 p-3 bg-light rounded border">
                <input v-model="newPanduanText" class="form-control form-control-sm" placeholder="Judul panduan baru..." style="max-width: 260px;" />
                <input v-model="newPanduanHref" class="form-control form-control-sm" placeholder="URL (# atau https://...)" />
                <button type="button" class="btn btn-sm btn-primary text-nowrap" @click="addPanduan">
                  <i class="ti ti-plus me-1"></i>Tambah Panduan
                </button>
              </div>
            </div>
          </div>

          <!-- Contact & Address -->
          <div class="card mb-4 shadow-sm">
            <div class="card-header bg-white border-bottom">
              <h5 class="card-title mb-0 fw-bold">Kontak & Alamat</h5>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label fw-medium">Alamat Workshop / Kantor</label>
                  <textarea v-model="footerState.alamat" class="form-control" rows="2" placeholder="Jl. Percetakan No. 45, Bandung, Jawa Barat"></textarea>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-medium">Telepon / WhatsApp</label>
                  <input v-model="footerState.telepon" class="form-control" type="text" placeholder="+62 812-3456-7890" />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-medium">Email Resmi</label>
                  <input v-model="footerState.email" class="form-control" type="email" placeholder="kontak@percetakan-kacetak.com" />
                </div>
              </div>
            </div>
          </div>

          <!-- Social Media -->
          <div class="card mb-4 shadow-sm">
            <div class="card-header bg-white border-bottom">
              <h5 class="card-title mb-0 fw-bold">Social Media</h5>
              <p class="text-muted small mb-0">Tautan profil sosial media perusahaan</p>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label fw-medium">Facebook</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="ti ti-brand-facebook"></i></span>
                    <input v-model="footerState.socials.facebook" class="form-control" placeholder="https://facebook.com/..." />
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-medium">Instagram</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="ti ti-brand-instagram"></i></span>
                    <input v-model="footerState.socials.instagram" class="form-control" placeholder="https://instagram.com/..." />
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-medium">Twitter / X</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="ti ti-brand-x"></i></span>
                    <input v-model="footerState.socials.twitter" class="form-control" placeholder="https://x.com/..." />
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-medium">LinkedIn</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="ti ti-brand-linkedin"></i></span>
                    <input v-model="footerState.socials.linkedin" class="form-control" placeholder="https://linkedin.com/company/..." />
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-medium">YouTube</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="ti ti-brand-youtube"></i></span>
                    <input v-model="footerState.socials.youtube" class="form-control" placeholder="https://youtube.com/@..." />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="d-flex justify-content-end gap-2 mb-4">
            <button type="button" class="btn btn-outline-secondary" @click="resetDefaults">Reset to Default</button>
            <button type="button" class="btn btn-success px-4" @click="saveFooter">
              <i class="ti ti-device-floppy me-1"></i>Save Footer Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface FooterLink {
  text: string
  href: string
}

const footerState = ref({
  judul: 'Dulank Percetakan & Packaging',
  desc: 'Penyedia layanan cetak offset dan digital terlengkap dengan perhitungan otomatis harga bahan plano, ongkos cetak, pond, dan laminasi.',
  copyright: `© ${new Date().getFullYear()} Kacetak System — Semua hak dilindungi`,
  alamat: 'Jl. Percetakan Raya No. 88, Komp. Industri Grafika, Bandung',
  telepon: '+62 812-3456-7890',
  email: 'info@dulank-printing.com',
  infoKami: [
    { text: 'Tentang Kami', href: '/about-us' },
    { text: 'Kebijakan Privasi', href: '/privacy' },
    { text: 'Blog & Edukasi', href: '/all-blog' },
    { text: 'Syarat dan Ketentuan', href: '/terms' }
  ],
  panduan: [
    { text: 'Panduan Ukuran Plano & Potong', href: '/kalkulator-dashboard' },
    { text: 'Cara Order & Kirim File', href: '/faq' },
    { text: 'Konfirmasi Pembayaran', href: '/contact-form' }
  ],
  socials: {
    facebook: 'https://facebook.com/dulankprint',
    instagram: 'https://instagram.com/dulankprint',
    twitter: 'https://x.com/dulankprint',
    linkedin: 'https://linkedin.com/company/dulankprint',
    youtube: 'https://youtube.com/@dulankprint'
  }
})

const newInfoText = ref('')
const newInfoHref = ref('')
const newPanduanText = ref('')
const newPanduanHref = ref('')

function addInfoKami() {
  if (!newInfoText.value || !newInfoHref.value) {
    alert('Please enter link title and URL.')
    return
  }
  footerState.value.infoKami.push({
    text: newInfoText.value.trim(),
    href: newInfoHref.value.trim()
  })
  newInfoText.value = ''
  newInfoHref.value = ''
}

function removeInfoKami(idx: number) {
  footerState.value.infoKami.splice(idx, 1)
}

function addPanduan() {
  if (!newPanduanText.value || !newPanduanHref.value) {
    alert('Please enter guide title and URL.')
    return
  }
  footerState.value.panduan.push({
    text: newPanduanText.value.trim(),
    href: newPanduanHref.value.trim()
  })
  newPanduanText.value = ''
  newPanduanHref.value = ''
}

function removePanduan(idx: number) {
  footerState.value.panduan.splice(idx, 1)
}

function saveFooter() {
  alert('Footer configuration saved successfully!')
}

function resetDefaults() {
  if (confirm('Reset footer settings to initial configuration?')) {
    footerState.value.judul = 'Dulank Percetakan & Packaging'
  }
}
</script>

