// Mock data untuk halaman /district (dipindah dari app/pages/district.vue)
// Dilayani generic CRUD: server/api/[...mock].ts (catch-all)

export const districts = [
  { id: 1, province: 'DKI Jakarta', regency: 'Jakarta Selatan', name: 'Kebayoran Baru', added: '2025-08-28', createdBy: 'Arroon', avatar: '/assets/img/users/user-30.jpg' },
  { id: 2, province: 'Jawa Barat', regency: 'Bandung', name: 'Lengkong', added: '2025-08-27', createdBy: 'Kenneth', avatar: '/assets/img/users/user-13.jpg' },
  { id: 3, province: 'Jawa Tengah', regency: 'Semarang', name: 'Candisari', added: '2025-08-26', createdBy: 'Gart', avatar: '/assets/img/users/user-11.jpg' },
  { id: 4, province: 'DKI Jakarta', regency: 'Jakarta Timur', name: 'Kramat Jati', added: '2025-08-25', createdBy: 'Steven', avatar: '/assets/img/users/user-01.jpg' },
  { id: 5, province: 'Jawa Barat', regency: 'Bogor', name: 'Bogor Tengah', added: '2025-08-24', createdBy: 'Susan', avatar: '/assets/img/users/user-02.jpg' }
]
