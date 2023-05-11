export interface ViewProps {
  viewIf?: boolean;
  children?: React.ReactNode;
}

export interface ViewIfElseProps {
  children: React.ReactNode;
  hidden?: boolean;
  visible?: boolean;
}
