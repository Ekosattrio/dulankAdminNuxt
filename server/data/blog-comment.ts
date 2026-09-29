// Mock data untuk halaman /blog-comment (dipindah dari app/pages/blog-comment.vue)
// Dikonsumsi oleh server/api/blog-comment.ts

export const comments = [
  {
    id: 1,
    comment: 'Thanks for the detailed guide on POS System! Very helpful for setting up barcode scanners.',
    createdDate: '24 Dec 2024',
    rating: 5,
    blogTitle: 'What is a POS System? A Beginner’s Guide',
    author: 'Gertrude',
    status: 'Publish'
  },
  {
    id: 2,
    comment: 'Could you elaborate on paper moisture control during offset printing?',
    createdDate: '22 Dec 2024',
    rating: 4,
    blogTitle: 'Top 10 Tips for Offset Printing Maintenance',
    author: 'Budi Santoso',
    status: 'Publish'
  },
  {
    id: 3,
    comment: 'Great security advice. Will apply the RBAC principles to our admin users.',
    createdDate: '18 Dec 2024',
    rating: 5,
    blogTitle: 'Securing Customer Data and Financial Privacy',
    author: 'Rian Kurniawan',
    status: 'Publish'
  },
  {
    id: 4,
    comment: 'Spam promotional link here. Ignore this message.',
    createdDate: '10 Dec 2024',
    rating: 1,
    blogTitle: 'What is a POS System? A Beginner’s Guide',
    author: 'BotAccount',
    status: 'Unpublish'
  }
]
