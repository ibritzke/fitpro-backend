export const getPagination = (query: any) => {
  const page = parseInt(query.page || "1");
  const limit = parseInt(query.limit || "20");
  const skip = (page - 1) * limit;
  return { skip, take: limit, page, limit };
};

export const paginatedResponse = (data: any[], total: number, page: number, limit: number) => ({
  data,
  meta: {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  },
});