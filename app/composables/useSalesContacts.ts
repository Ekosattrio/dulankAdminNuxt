import type { SalesContact } from "#server/types/sales-document";

interface SavedCustomerRow {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
}

export function useSalesContacts() {
  const { data, refresh } = useApiFetch<{
    success: boolean;
    data: SalesContact[];
  }>('/api/v1/admin/customers', {
    key: "sales-contacts",
  });
  const contacts = computed(() => data.value?.data ?? []);
  async function createContact(contact: SalesContact) {
    const result = await apiFetch<{ success: boolean; message?: string }>(
      "/api/v1/admin/customers",
      {
        method: "POST",
        body: { ...contact, type: "General", channel: "Website" },
      },
    );
    await refresh();
    return result;
  }

  return { contacts, refresh, createContact };
}
