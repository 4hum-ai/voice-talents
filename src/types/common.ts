// Common types to replace duplicated 'any' usage throughout the codebase

export type DataItem = unknown;
export type DataArray = DataItem[];

export type ActionItem = {
  name?: string;
  [key: string]: unknown;
};

export type ActionArray = ActionItem[];

export type UiConfig = unknown;

export type FormData = Record<string, unknown>;

export type QueryParams = Record<string, unknown>;

export type FilterValue = unknown;

export type FilterConfig = {
  key: string;
  label: string;
  [key: string]: unknown;
};

export type FilterArray = FilterConfig[];

export type ColumnConfig = {
  key: string;
  label?: string;
  type?: string;
  searchable?: boolean;
  [key: string]: unknown;
};

export type ColumnArray = ColumnConfig[];

export type ErrorType = unknown;

export type EventHandler = (event: unknown) => void;

export type TemporalDate = {
  year: number;
  month: number;
  day: number;
};

export type TemporalGlobal = {
  Temporal: {
    PlainDate: {
      from: (date: TemporalDate) => unknown;
    };
  };
};
