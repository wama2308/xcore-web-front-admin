module.exports = function (page, perPage) {
  page = parseInt(page);
  perPage = parseInt(perPage);

  page = page ? page : 1;
  perPage = perPage ? (perPage < 1000 ? perPage : 1000) : 10;

  return { page, perPage };
};
