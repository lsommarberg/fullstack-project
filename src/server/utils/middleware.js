const errorHandler = (error, request, response) => {
  console.error(error.message);
  return response.status(500).json({ error: 'something went wrong' });
};

module.exports = {
  errorHandler,
};
