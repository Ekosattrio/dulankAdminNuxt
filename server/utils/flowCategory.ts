import type { FlowCategory, FlowCategoryFilterParams, FlowCategoryFormData } from "#server/types/flow-category";
import { isDateWithinRange } from "./dateRange";
import { readFlowCategoryData, writeFlowCategoryData } from "./flowCategoryData";

function nextFlowCategoryNo(items: FlowCategory[]): string {
  const numbers = items
    .map((item) => {
      const match = item.no?.match(/^PCC-(\d+)$/i);
      return match ? Number(match[1]) : 0;
    })
    .filter((n) => !Number.isNaN(n));

  const max = numbers.length ? Math.max(...numbers) : 0;
  return `PCC-${String(max + 1).padStart(3, "0")}`;
}

function nextFlowCategoryId(items: FlowCategory[]): string {
  const ids = items.map((item) => Number(item.id)).filter((id) => !Number.isNaN(id));
  const max = ids.length ? Math.max(...ids) : 0;
  return String(max + 1);
}

export function listFlowCategories(filters: FlowCategoryFilterParams = {}): FlowCategory[] {
  const items = readFlowCategoryData();
  const search = filters.search?.trim().toLowerCase();
  const startDate = filters.startDate?.trim();
  const endDate = filters.endDate?.trim();

  return items.filter((item) => {
    if (search) {
      const haystack = [item.no, item.name, item.createdBy].filter(Boolean).join(" ").toLowerCase();
      if (!haystack.includes(search)) return false;
    }

    if ((startDate || endDate) && item.createdDate) {
      // Date may be ISO or "YYYY-MM-DD HH:mm:ss"
      const datePart = item.createdDate.split(" ")[0];
      if (!isDateWithinRange(datePart, startDate, endDate)) {
        return false;
      }
    }

    return true;
  });
}

export function getFlowCategoryById(id: string): FlowCategory | null {
  const items = readFlowCategoryData();
  return items.find((item) => String(item.id) === String(id) || item.no === id) || null;
}

export function createFlowCategory(payload: FlowCategoryFormData): FlowCategory {
  const name = payload.name?.trim();
  if (!name) {
    throw createError({ statusCode: 400, statusMessage: "Flow category name is required" });
  }

  const items = readFlowCategoryData();
  const now = new Date();
  const dateFormatted = `${now.toISOString().split("T")[0]} ${now.toTimeString().split(" ")[0]}`;

  const newItem: FlowCategory = {
    id: nextFlowCategoryId(items),
    no: payload.no?.trim() || nextFlowCategoryNo(items),
    name,
    used: payload.used !== undefined ? Number(payload.used) : 0,
    createdBy: payload.createdBy?.trim() || "Admin",
    createdDate: payload.createdDate?.trim() || dateFormatted,
  };

  items.unshift(newItem);
  writeFlowCategoryData(items);
  return newItem;
}

export function updateFlowCategory(id: string, payload: FlowCategoryFormData): FlowCategory {
  const name = payload.name?.trim();
  if (!name) {
    throw createError({ statusCode: 400, statusMessage: "Flow category name is required" });
  }

  const items = readFlowCategoryData();
  const index = items.findIndex((item) => String(item.id) === String(id) || item.no === id);
  if (index === -1) {
    throw createError({ statusCode: 404, statusMessage: "Flow category not found" });
  }

  const current = items[index];
  const updated: FlowCategory = {
    ...current,
    name,
    used: payload.used !== undefined ? Number(payload.used) : current.used,
  };

  items[index] = updated;
  writeFlowCategoryData(items);
  return updated;
}

export function deleteFlowCategory(id: string): FlowCategory {
  const items = readFlowCategoryData();
  const index = items.findIndex((item) => String(item.id) === String(id) || item.no === id);
  if (index === -1) {
    throw createError({ statusCode: 404, statusMessage: "Flow category not found" });
  }

  const [removed] = items.splice(index, 1);
  writeFlowCategoryData(items);
  return removed;
}
