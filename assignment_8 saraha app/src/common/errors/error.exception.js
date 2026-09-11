export const applicationexception = ({
  message = "error",
  options = { cause: { status: 400 } },
} = {}) => {
  throw new Error(message, options);
};
export const conflictException = (message = "conflict", extra) => {
  return applicationexception({
    message,
    options: { cause: { status: 409, ...extra } },
  });
};
export const notFoundException = (message = "not found", extra) => {
  return applicationexception({
    message,
    options: { cause: { status: 404, ...extra } },
  });
};
export const unauthorizedException = (message = "unauthorized", extra) => {
  return applicationexception({
    message,
    options: { cause: { status: 401, ...extra } },
  });
};
export const forbiddenException = (message = "forbidden", extra) => {
  return applicationexception({
    message,
    options: { cause: { status: 403, ...extra } },
  });
};
