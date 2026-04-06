"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginatedResponse = exports.getPagination = void 0;
const getPagination = (query) => {
    const page = parseInt(query.page || "1");
    const limit = parseInt(query.limit || "20");
    const skip = (page - 1) * limit;
    return { skip, take: limit, page, limit };
};
exports.getPagination = getPagination;
const paginatedResponse = (data, total, page, limit) => ({
    data,
    meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    },
});
exports.paginatedResponse = paginatedResponse;
