export interface IToastMessage {
  id: string;
  type: MessageType;
  title?: string;
  position: Position;
  body: string;
  timeout?: number;
}

export type Position = "tr" | "tl" | "br" | "bl";
export type MessageType = "success" | "error" | "info" | "warning";
export type ToastTheme = "light" | "dark";
