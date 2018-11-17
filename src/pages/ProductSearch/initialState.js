export default {
  bulkAttributeAdd: {
    isOpen: false
  },
  isLoading: false,
  search: {
    count: 0,
    page: 0,
    pageSize: 25,
    filters: {
      id: "",
      sku: "",
      name: "",
      storeId: "",
      categoryId: "",
      departmentId: "",
      isKit: "",
      isCustom: "",
      isEnabled: "1",
    },
    sortField: "id",
    sortOrder: "desc"
  },
  products: [],
  selected: [],
  recentlyUpdated: [],
  productsCount: 0,
};
