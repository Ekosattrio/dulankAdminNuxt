// navigation.ts — type/interface untuk domain navigation (auto-import shared/types)
// Dibuat oleh refactor Nuxt 4: interface dipisah dari halaman ke folder tersendiri.

export interface MenuGroup {
  header: string;
  items: MenuItem[];
}

export interface MenuItem {
  title: string;
  icon?: string;
  to?: string;
  submenus?: SubmenuItem[];
}

export interface SubmenuItem {
  title: string;
  to: string;
}
