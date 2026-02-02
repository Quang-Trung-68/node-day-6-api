const constants = {
  httpCodes: {
    success: 200,
    created: 201,
    noContent: 204,
    badRequest: 400,
    unauthorized: 401,
    notFound: 404,
    conflict: 409,
    internalServerError: 500, // Lỗi server
  },

  errorCodes: {
    conflict: "ER_DUP_ENTRY", // Lỗi duplicate entry (vd: insert email đã tồn tại)
  },
};

module.exports = constants;
