// Mock data untuk halaman /delete-account (dipindah dari app/pages/delete-account.vue)
// Dikonsumsi oleh server/api (catch-all) via mock store.
export const requests = [
  {
    email: 'steven@example.com',
    name: 'Steven',
    avatar: '/assets/img/users/user-01.jpg',
    requisitionDate: '25 Sep 2023',
    requestDate: '01 Oct 2023'
  },
  {
    email: 'susan.lopez@example.com',
    name: 'Susan Lopez',
    avatar: '/assets/img/users/user-02.jpg',
    requisitionDate: '30 Sep 2023',
    requestDate: '05 Oct 2023'
  },
  {
    email: 'robert.grossman@example.com',
    name: 'Robert Grossman',
    avatar: '/assets/img/users/user-03.jpg',
    requisitionDate: '10 Sep 2023',
    requestDate: '25 Sep 2023'
  },
  {
    email: 'janet.hembre@example.com',
    name: 'Janet Hembre',
    avatar: '/assets/img/users/user-06.jpg',
    requisitionDate: '15 Sep 2023',
    requestDate: '20 Sep 2023'
  },
  {
    email: 'russell.belle@example.com',
    name: 'Russell Belle',
    avatar: '/assets/img/users/user-04.jpg',
    requisitionDate: '15 Aug 2023',
    requestDate: '01 Sep 2023'
  }
]
