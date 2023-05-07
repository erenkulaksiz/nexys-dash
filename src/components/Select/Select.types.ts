interface Options {
  id?: string;
  disabled?: boolean;
  text?: string;
}

export interface SelectProps {
  options: Options[];
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  value?: string;
  className?: string;
  id?: string;
}
