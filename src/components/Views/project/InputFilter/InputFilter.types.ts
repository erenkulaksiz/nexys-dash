import type { Dispatch, SetStateAction } from "react";

export interface currentAvailableFiltersTypes {
  loading: boolean;
  items: { id: string; text: string }[];
  type: "filter" | "user" | "path" | "action";
}

export interface filtersTypes {
  value: string;
  selection?: string;
  valueId: string;
  selectionId?: string;
}

export interface InputFilterProps {
  filters: filtersTypes[];
  setFilters: Dispatch<SetStateAction<filtersTypes[]>>;
  type: "logs" | "exceptions" | "batches";
}
