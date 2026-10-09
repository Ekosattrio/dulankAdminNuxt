export const actionIcons = {
  add: 'plus-circle',
  view: 'eye',
  edit: 'edit',
  delete: 'trash-2',
  remove: 'trash-2',
  more: 'more-horizontal',
  refresh: 'rotate-cw',
  save: 'save',
  print: 'printer',
  pdf: 'file-text',
  import: 'upload',
  export: 'download',
  download: 'download',
  upload: 'upload',
  search: 'search',
  filter: 'filter',
  settings: 'settings',
  duplicate: 'copy',
  back: 'arrow-left',
  close: 'x',
  payment: 'dollar-sign',
  history: 'clock',
  address: 'map-pin',
} as const

export type AppActionIcon = keyof typeof actionIcons

export const actionIconSizes = {
  row: 14,
  toolbar: 16,
  button: 16,
  navigation: 16,
  dialogClose: 20,
} as const

const legacyIconActions: Readonly<Record<string, AppActionIcon>> = {
  edit: 'edit',
  'edit-2': 'edit',
  eye: 'view',
  trash: 'delete',
  'trash-2': 'delete',
  plus: 'add',
  'plus-circle': 'add',
  'more-horizontal': 'more',
  'rotate-cw': 'refresh',
  printer: 'print',
  'file-text': 'pdf',
}

export function getActionIcon(action: AppActionIcon): string {
  return actionIcons[action]
}

export function normalizeActionIcon(icon: string): string {
  const action = legacyIconActions[icon]
  return action ? actionIcons[action] : icon
}

export function resolveActionIcon(action?: AppActionIcon, icon?: string): string {
  if (action) return actionIcons[action]
  return icon ? normalizeActionIcon(icon) : actionIcons.view
}
