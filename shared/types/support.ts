// support.ts — type/interface untuk domain support (auto-import shared/types)
// Dibuat oleh refactor Nuxt 4: interface dipisah dari halaman ke folder tersendiri.

export interface TicketItem {
  id: number;
  ticketId: string;
  requestedBy: string;
  subject: string;
  assignee: string;
  priority: "High" | "Medium" | "Low";
  status: "Open" | "Closed";
  createdDate: string;
  dueDate: string;
}

export interface TicketListItem {
  id: number;
  ticketId: string;
  requestedBy: string;
  avatar: string;
  subject: string;
  assignee: string;
  assigneeAvatar: string;
  priority: "High" | "Medium" | "Low";
  status: "Open" | "Closed";
  createdDate: string;
  dueDate: string;
}
