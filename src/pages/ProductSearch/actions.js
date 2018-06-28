export const toggleAdvancedFilters = isOpen => ({
  type: "TOGGLE_ADVANCED_FILTERS",
  isOpen: isOpen
});

export const applyFilters = filters => ({
  type: "APPLY_FILTERS",
  filters: filters
});

export const resetSearch = () => ({
  type: "RESET_SEARCH"
});

export const sortBy = field => ({
  type: "SORT_BY",
  field: field
});

export const changePage = page => ({
  type: "CHANGE_PAGE",
  page: page
});

export const changePageSize = size => ({
  type: "CHANGE_PAGE_SIZE",
  size: size
});
