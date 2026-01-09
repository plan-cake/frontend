export type Option<TValue extends string | number> = {
  label: string;
  value: TValue;
};

export type SelectorProps<TValue extends string | number> = {
  id: string;
  onChange: (value: TValue) => void;
  value: TValue;
  options: Option<TValue>[];
  disabled?: boolean;
  className?: string;

  // for mobile drawer
  dialogTitle?: string;
  dialogDescription?: string;
};
