// Mock data untuk halaman /support-ticket (dipindah dari app/pages/support-ticket.vue)
// Dilayani generic CRUD: server/api/[...mock].ts (catch-all)

export const tickets = [
  {
    id: 1,
    ticketId: "#1501",
    requestedBy: "Ethan Hunt",
    subject: "Payment processing error on checkout",
    assignee: "Desman Dwi",
    priority: "High",
    status: "Open",
    createdDate: "15/01/2024",
    dueDate: "20/01/2024",
  },
  {
    id: 2,
    ticketId: "#1502",
    requestedBy: "Jane Doe",
    subject: "Can't log in after password reset",
    assignee: "Eko Satrio",
    priority: "Medium",
    status: "Closed",
    createdDate: "05/12/2023",
    dueDate: "15/12/2023",
  },
  {
    id: 3,
    ticketId: "#1503",
    requestedBy: "Lindsay Walton",
    subject: "A new rating has been received",
    assignee: "Desman Dwi",
    priority: "Low",
    status: "Open",
    createdDate: "10/01/2024",
    dueDate: "18/01/2024",
  },
  {
    id: 4,
    ticketId: "#1504",
    requestedBy: "Jhon Maryo",
    subject: "Your application has been received!",
    assignee: "Eko Satrio",
    priority: "High",
    status: "Closed",
    createdDate: "01/01/2024",
    dueDate: "10/01/2024",
  },
]
