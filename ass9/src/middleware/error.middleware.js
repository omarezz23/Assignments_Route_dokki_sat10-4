export const globalErrorHandling = (error, req, res, next) => {
  return res.status(error.cause?.status ?? 500).json({
    message: error.message,
    issue: error.cause,
    error,
    stack: error.stack,
  });
};
