export interface PagerProps {
  currentPage: number;
  totalPages: number;
  maxPagesToShow?: number;
  onPageClick: (pageNumber: number) => void;
  onPreviousClick: () => void;
  onNextClick: () => void;
  perPage: number;
  className?: string;
}
