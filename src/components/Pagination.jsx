function Pagination({ info, currentPage, onPageChange }) {
  if (!info || info.pages <= 1) {
    return null
  }

  const totalPages = info.pages
  const firstPageToShow = Math.max(1, currentPage - 2)
  const lastPageToShow = Math.min(totalPages, currentPage + 2)
  const pagesToRender = []

  for (let page = firstPageToShow; page <= lastPageToShow; page += 1) {
    pagesToRender.push(page)
  }

  return (
    <nav className="pagination" aria-label="Paginacao da busca">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Anterior
      </button>

      {pagesToRender.map((page) => (
        <button
          key={page}
          type="button"
          className={page === currentPage ? 'active' : ''}
          onClick={() => onPageChange(page)}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Proxima
      </button>
    </nav>
  )
}

export default Pagination
