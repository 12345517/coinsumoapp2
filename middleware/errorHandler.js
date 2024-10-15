function errorHandler(err, req, res, next) {
  console.error(err.stack); // Log the error stack trace for debugging

  const status = err.status || 500; // Default to 500 if no status is provided
  const message = err.message || 'Internal Server Error'; // Default message

  res.status(status).json({ error: message });
}

module.exports = errorHandler;