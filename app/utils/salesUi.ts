export const salesField =
  "w-full min-w-0 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300";
export const salesLabel = "block space-y-1.5 text-sm font-medium text-gray-700 dark:text-gray-300";
export const salesPrimaryButton =
  "inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50";
export const salesSecondaryButton =
  "inline-flex items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300";
export const salesDocumentTable =
  "w-full text-left text-xs text-gray-700 dark:text-gray-300 [&_th]:whitespace-nowrap [&_th]:bg-gray-50 [&_th]:px-3 [&_th]:py-3 [&_th]:font-semibold [&_td]:px-3 [&_td]:py-3 [&_tbody_tr]:border-t [&_tbody_tr]:border-gray-100 dark:[&_th]:bg-gray-800 dark:[&_tbody_tr]:border-gray-800";

// Standarisasi Light Modern Toolbar Filters (height: h-9, text-xs, rounded-md, border abu halus)
export const tableFilterControlClass =
  "h-9 rounded-md border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 shadow-sm outline-none transition-colors hover:border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200";

// Standarisasi Light Modern Modal & Form Controls (height: h-9, width: w-full)
export const formControlClass =
  "h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 shadow-sm outline-none transition-colors hover:border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200";

// Standarisasi Grid 12 Kolom Form Modal (Label col-5 / 41.7%, Input col-7 / 58.3%)
export const modalFormRowClass = "grid grid-cols-12 items-center gap-3 sm:gap-4";
export const modalFormLabelClass = "col-span-5 text-xs font-semibold text-gray-700 dark:text-gray-300";
export const modalFormInputColClass = "col-span-7";

// Export standard currency & thousands separator utilities
export * from "./currency";

