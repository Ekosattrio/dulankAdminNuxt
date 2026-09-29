// employee.ts — type/interface untuk domain employee (auto-import shared/types)
// Dibuat oleh refactor Nuxt 4: interface dipisah dari halaman ke folder tersendiri.

export interface AdminItem {
  id: string;
  name: string;
  email: string;
  role: string;
  stores: string[];
  status: string;
}

export interface Employee {
  id: string
  name: string
  department: string
  phone: string
  email: string
  address: string
  salary: number
  system: string
  ovtRate: number
  status: string
}

export interface EmployeeItem {
  id: string;
  name: string;
  department: string;
  address: string;
  detailAddress?: string;
  phone: string;
  joinDate: string;
  status: "Active" | "Resign" | "Inactive";
  gender?: string;
  dob?: string;
  joinChannel?: string;
  contact1Name?: string;
  contact1Phone?: string;
  contact2Name?: string;
  contact2Phone?: string;
  email?: string;
}

export interface UserItem {
  id: string;
  email: string;
  name: string;
  verified: boolean;
  subscription: boolean;
  status: string;
  role?: string;
  phone?: string;
  avatar?: string;
  password?: string;
  confirmPassword?: string;
  descriptions?: string;
}
export 
interface DepartmentItem {
  id: string;
  name: string;
  members: string[];
  totalMembers: number;
  createdDate: string;
  status: "Active" | "Disable";
}

export 
interface DesignationItem {
  id: string;
  name: string;
  members: string[];
  createdOn: string;
  totalMembers: number;
  status: "Active" | "Inactive";
}

