"use client";
import { useRouter } from "next/navigation";
import ReactPaginate from "react-paginate";

interface PaginationProps {
  currentPage?: number;
  totalPages: number;
}

// eslint-disable-next-line
export function Pagination({ currentPage, totalPages }: PaginationProps) {
  // eslint-disable-next-line
  const router = useRouter();

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel={
        <button className="w-10 h-10 border-2 border-blue-500 text-blue-500 flex items-center justify-center">
          &gt;
        </button>
      }
      onPageChange={(e) => {
        router.push(`/?page=${e.selected + 1}`);
      }}
      pageRangeDisplayed={1}
      pageCount={totalPages || 0}
      previousLabel={
        <button className="w-10 h-10 border-2 border-blue-500 text-blue-500 flex items-center justify-center">
          &lt;
        </button>
      }
      renderOnZeroPageCount={null}
      containerClassName="flex justify-center space-x-2"
      pageClassName="w-10 h-10 border-2 border-blue-500 text-blue-500"
      pageLinkClassName="w-full h-full flex items-center justify-center"
      activeClassName="bg-blue-500 text-white"
    />
  );
}
