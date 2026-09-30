// Mock data untuk halaman /faq (dipindah dari app/pages/faq.vue)
// Dilayani generic CRUD: server/api/[...mock].ts (catch-all)

export const faqs = [
  {
    id: 1,
    question: 'Does it support multiple payment methods?',
    answer: 'Yes, including cash, bank transfer, QRIS, e-wallets, credit cards, and customer deposit accounts.',
    category: 'Features'
  },
  {
    id: 2,
    question: 'What is a POS platform?',
    answer: 'A software system that processes sales, calculates paper layout efficiency, manages job tickets, and syncs inventory.',
    category: 'General'
  },
  {
    id: 3,
    question: 'Who uses it?',
    answer: 'Commercial printers, packaging manufacturers, copy centers, digital printing houses, and screen printers.',
    category: 'General'
  },
  {
    id: 4,
    question: 'What are the key features?',
    answer: 'Automated print sheet estimation, paper wastage calculations, multi-station job order workflow, and thermal receipt printing.',
    category: 'Features'
  },
  {
    id: 5,
    question: 'Can I connect thermal receipt and barcode printers?',
    answer: 'Yes, the system is plug-and-play compatible with standard ESC/POS 80mm and 58mm thermal printers.',
    category: 'Hardware'
  },
  {
    id: 6,
    question: 'How do paper plan formulas calculate cuts per plano?',
    answer: 'The calculator tests both grain directions (parallel and perpendicular) to maximize yield and minimize scrap waste.',
    category: 'Printing'
  }
]
