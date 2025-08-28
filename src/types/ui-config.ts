// Aligned with backend @admin-ui interfaces (services/movie-service/src/plugins/admin-ui/index.ts)

export interface ActionConfig {
  name: string
  label: string
  type: 'button' | 'link' | 'dropdown'
  icon?: string
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  permission?: string
  url?: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
}

export interface ColumnConfig {
  key: string
  label: string
  type: 'text' | 'number' | 'date' | 'boolean' | 'image' | 'url' | 'array' | 'object' | 'color'
  sortable?: boolean
  filterable?: boolean
  searchable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
  formatter?: 'rating' | 'status' | 'date' | 'currency' | 'badge' | 'country' | 'number'
  hidden?: boolean
  titleField?: string
  subtitleField?: string
}

export interface SortConfig { field: string; direction: 'asc' | 'desc' }

export interface FilterConfig {
  field: string
  type: 'text' | 'select' | 'date' | 'boolean' | 'number'
  label: string
  options?: Array<{ value: string; label: string }>
  defaultValue?: any
}

export interface ListViewConfig {
  columns: ColumnConfig[]
  defaultSort?: SortConfig
  defaultFilters?: FilterConfig[]
  searchableFields?: string[]
  pageSize?: number
  actions?: ActionConfig[]
}

export interface CalendarViewConfig {
  dateField: string
  titleField?: string
  colorField?: string
  descriptionField?: string
}

export interface KanbanViewConfig {
  groupByField: string
  columns: Array<{ value: string; label: string; color?: string }>
  cardTitleField: string
  cardDescriptionField?: string
}

export interface GalleryViewConfig {
  imageField: string
  titleField?: string
  descriptionField?: string
}

export interface DetailField {
  key: string
  label: string
  type: 'text' | 'number' | 'date' | 'boolean' | 'image' | 'url' | 'array' | 'object'
  formatter?: 'rating' | 'status' | 'date' | 'currency' | 'badge' | 'country' | 'number'
}
export interface DetailSection { title: string; fields: DetailField[] }
export interface DetailViewConfig { sections: DetailSection[] }

export interface FormField {
  key: string
  label: string
  type: 'text' | 'textarea' | 'number' | 'select' | 'multiselect' | 'date' | 'boolean' | 'file' | 'url' | 'color'
  required?: boolean
  validation?: any
  options?: Array<{ value: string; label: string }>
  placeholder?: string
  helpText?: string
}
export interface FormViewConfig { fields: FormField[]; layout?: 'single' | 'tabs' | 'sections' }

export interface ViewsConfig {
  list?: ListViewConfig
  calendar?: CalendarViewConfig
  kanban?: KanbanViewConfig
  gallery?: GalleryViewConfig
}

export interface ModuleUIConfig {
  displayName: string
  description?: string
  icon?: string
  views: ViewsConfig
  detailView?: DetailViewConfig
  formView?: FormViewConfig
}

// Frontend-only optional extensions
export interface UiFeaturesConfig { stats?: any }

export type UiConfig = ModuleUIConfig & { features?: UiFeaturesConfig }


