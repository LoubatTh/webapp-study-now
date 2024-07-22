import { Button } from "@/components/ui/button";
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
};

const Pagination = ({ page, totalPages, onPageChange }: PaginationProps) => {
  return (
    <div className="flex gap-2 md:mx-auto md:w-auto items-center my-6 w-full">
      <div className="flex items-center">
        <Button
          disabled={page <= 1}
          variant="ghost"
          onClick={() => onPageChange(1)}
        >
          <ChevronFirst />
        </Button>
        <Button
          disabled={page <= 1}
          variant="ghost"
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft />
        </Button>
      </div>
      <div className="md:min-w-20 flex-auto text-center">
        {page} / {totalPages}
      </div>
      <div className="flex items-center">
        <Button
          disabled={page >= totalPages}
          variant="ghost"
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight />
        </Button>
        <Button
          disabled={page >= totalPages}
          variant="ghost"
          onClick={() => onPageChange(totalPages)}
        >
          <ChevronLast />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
