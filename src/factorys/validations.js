export const getServerErrors = (errors) => {
  let format = {};
  for (const error of errors) {
    if (error.field && error.message) {
      format[error.field] = error.message;
    }
  }
  return format;
};
