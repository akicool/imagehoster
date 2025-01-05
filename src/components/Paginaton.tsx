import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center space-x-2">
      {pageNumbers.map((number) => (
        <Link key={number} href={`/?page=${number}`}>
          <button
            className={`w-10 h-10 ${
              currentPage === number
                ? "bg-blue-500 text-white"
                : "border-2 border-blue-500 text-blue-500"
            }`}
          >
            {number}
          </button>
        </Link>
      ))}
    </div>
  );
}
