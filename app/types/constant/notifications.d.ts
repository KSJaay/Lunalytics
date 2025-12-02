export interface NotificationInputInputType {
  type:
    | 'input'
    | 'password'
    | 'number'
    | 'switch'
    | 'dropdown'
    | 'group'
    | 'textarea'
    | 'empty';
  isDataField?: boolean;
  key: string;
  title: string;
  placeholder?: string;
  subtitle?: {
    text: string;
    link?: string;
  };
  rows?: number;
  defaultValue?: string | number | boolean;
  options?: { id: string | number; name?: string }[];
}

export interface NotificationGroupLayoutType {
  type: 'group';
  items: NotificationInputLayoutType[];
}

interface NotificationEmptyInputType {
  type: 'empty';
}

export type NotificationInputLayoutType =
  | NotificationEmptyInputType
  | NotificationInputInputType
  | NotificationGroupLayoutType;
