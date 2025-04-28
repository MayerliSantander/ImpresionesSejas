import { useState, useMemo } from 'react';

export default function usePagination(data, itemsPerPage) {
  const [page, setPageState] = useState(1);

  const totalPages = useMemo(
    () => Math.ceil(data.length / itemsPerPage),
    [data.length, itemsPerPage]
  );

  const currentData = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  }, [data, page, itemsPerPage]);

  function setPage(newPage) {
    if (newPage < 1) newPage = 1;
    else if (newPage > totalPages) newPage = totalPages;
    setPageState(newPage);
  }

  return { currentData, page, totalPages, setPage };
}
