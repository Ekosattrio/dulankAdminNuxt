import type { FlowTemplate, FlowTemplateFilterParams, FlowTemplateFormData } from "#server/types/flow-template";
import { isDateWithinRange } from './dateRange'
import { readFlowTemplateData, writeFlowTemplateData } from "./flowTemplateData";

function normalizeTemplateItems(items: FlowTemplateFormData['items'] = []) {
  return items.map((item, index) => {
    const label = item.label?.trim()
    if (!label) throw createError({ statusCode: 400, statusMessage: `Information label ${index + 1} is required` })
    if (item.type !== 'Input Type' && item.type !== 'Select Type') {
      throw createError({ statusCode: 400, statusMessage: `Invalid input type for ${label}` })
    }
    const options = (item.options || []).map((option) => option.trim()).filter(Boolean)
    if (item.type === 'Select Type' && options.length === 0) {
      throw createError({ statusCode: 400, statusMessage: `Data select is required for ${label}` })
    }
    return { id: item.id || `info-${index + 1}`, label, type: item.type, options }
  })
}

function nextFlowTemplateNo(items: FlowTemplate[]): string {
  const numbers = items
    .map((item) => {
      const match = item.no?.match(/^FT-(\d+)$/i);
      return match ? Number(match[1]) : 0;
    })
    .filter((n) => !Number.isNaN(n));

  const max = numbers.length ? Math.max(...numbers) : 0;
  return `FT-${String(max + 1).padStart(4, "0")}`;
}

function nextFlowTemplateId(items: FlowTemplate[]): string {
  const ids = items.map((item) => Number(item.id)).filter((id) => !Number.isNaN(id));
  const max = ids.length ? Math.max(...ids) : 0;
  return String(max + 1);
}

export function listFlowTemplates(filters: FlowTemplateFilterParams = {}): FlowTemplate[] {
  const items = readFlowTemplateData();
  const search = filters.search?.trim().toLowerCase();
  const template = filters.template?.trim().toLowerCase();

  return items.filter((item) => {
    if (search) {
      const haystack = [item.no, item.name, item.information].filter(Boolean).join(" ").toLowerCase();
      if (!haystack.includes(search)) return false;
    }

    if (template && template !== 'all' && !item.name.toLowerCase().includes(template)) return false;
    if ((filters.startDate || filters.endDate) && item.createdAt) {
      if (!isDateWithinRange(item.createdAt.slice(0, 10), filters.startDate, filters.endDate)) return false;
    }

    return true;
  });
}

export function getFlowTemplateById(id: string): FlowTemplate | null {
  const items = readFlowTemplateData();
  return items.find((item) => String(item.id) === String(id) || item.no === id) || null;
}

export function createFlowTemplate(payload: FlowTemplateFormData): FlowTemplate {
  const name = payload.name?.trim();
  const templateItems = normalizeTemplateItems(payload.items);
  const information = payload.information?.trim() || templateItems.map((item) => item.label?.trim()).filter(Boolean).join(", ");

  if (!name) {
    throw createError({ statusCode: 400, statusMessage: "Flow template name is required" });
  }
  if (!information && !templateItems.length) {
    throw createError({ statusCode: 400, statusMessage: "Information is required" });
  }

  const items = readFlowTemplateData();

  const newItem: FlowTemplate = {
    id: nextFlowTemplateId(items),
    no: payload.no?.trim() || nextFlowTemplateNo(items),
    name,
    information: information || "Default",
    items: templateItems,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  items.unshift(newItem);
  writeFlowTemplateData(items);
  return newItem;
}

export function updateFlowTemplate(id: string, payload: FlowTemplateFormData): FlowTemplate {
  const name = payload.name?.trim();
  const templateItems = payload.items ? normalizeTemplateItems(payload.items) : undefined;
  const currentItems = readFlowTemplateData();
  const index = currentItems.findIndex((item) => String(item.id) === String(id) || item.no === id);
  if (index === -1) {
    throw createError({ statusCode: 404, statusMessage: "Flow template not found" });
  }

  const current = currentItems[index];
  if (!current) {
    throw createError({ statusCode: 404, statusMessage: "Flow template not found" });
  }
  const finalItems = templateItems || current.items || [];
  const information = payload.information?.trim() || finalItems.map((item) => item.label?.trim()).filter(Boolean).join(", ");

  if (!name) {
    throw createError({ statusCode: 400, statusMessage: "Flow template name is required" });
  }
  if (!information && !finalItems.length) {
    throw createError({ statusCode: 400, statusMessage: "Information is required" });
  }

  const updated: FlowTemplate = {
    ...current,
    name,
    information: information || current.information,
    items: finalItems,
    updatedAt: new Date().toISOString(),
  };

  currentItems[index] = updated;
  writeFlowTemplateData(currentItems);
  return updated;
}

export function deleteFlowTemplate(id: string): FlowTemplate {
  const items = readFlowTemplateData();
  const index = items.findIndex((item) => String(item.id) === String(id) || item.no === id);
  if (index === -1) {
    throw createError({ statusCode: 404, statusMessage: "Flow template not found" });
  }

  const [removed] = items.splice(index, 1);
  if (!removed) {
    throw createError({ statusCode: 404, statusMessage: "Flow template not found" });
  }
  writeFlowTemplateData(items);
  return removed;
}
