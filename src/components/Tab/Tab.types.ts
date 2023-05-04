export interface TabProps {
  children: React.ReactNode | React.ReactNode[];
  id: string;
  className?: string;
  onTabChange?: ({ index, id }: { index: number; id: string }) => void;
  defaultTab?: string;
}

export interface TabViewProps {
  children: React.ReactNode | React.ReactNode[];
  activeTitle: React.ReactNode | React.ReactNode[] | string;
  nonActiveTitle: React.ReactNode | React.ReactNode[] | string;
  id: string;
  disabled?: boolean;
}
