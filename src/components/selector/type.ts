export type Option<TValue extends string | number> = {
  label: string;
  value: TValue;
};

export type SelectorProps<TValue extends string | number> = {
  id: string;
  onChange: (value: TValue) => void;

  value: TValue;
  options: Option<TValue>[];
  selectLabel?: string;
  dialogTitle?: string;
  dialogDescription?: string;

  disabled?: boolean;
  className?: string;
};
