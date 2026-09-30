// Mock data untuk halaman /language (dipindah dari app/pages/language.vue)
// Dilayani generic CRUD: server/api/[...mock].ts (catch-all)

export const languages = [
  {
    name: 'English',
    code: 'en',
    flag: '/assets/img/icons/flag-01.svg',
    rtl: false,
    total: 2145,
    done: 1815,
    progress: 80,
    status: 'Active'
  },
  {
    name: 'Arabic',
    code: 'ar',
    flag: '/assets/img/icons/flag-02.svg',
    rtl: true,
    total: 2045,
    done: 2045,
    progress: 100,
    status: 'Inactive'
  },
  {
    name: 'Chinese',
    code: 'zh',
    flag: '/assets/img/icons/flag-03.svg',
    rtl: false,
    total: 2245,
    done: 295,
    progress: 5,
    status: 'Active'
  },
  {
    name: 'Hindi',
    code: 'hi',
    flag: '/assets/img/icons/flag-04.svg',
    rtl: false,
    total: 2535,
    done: 1145,
    progress: 40,
    status: 'Active'
  }
]
