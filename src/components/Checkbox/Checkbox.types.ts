export interface CheckboxProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  className?: string;
  children?: React.ReactNode;
  id: string;
}
