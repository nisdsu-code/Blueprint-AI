export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` })
}

export function errorHandler(err, req, res, _next) {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Request body must be valid JSON' })
  }

  if (err.code === 11000) {
    return res.status(409).json({ message: 'An account with this email already exists' })
  }

  const status = err.status || 500

  if (err.expose) {
    return res.status(status).json({ message: err.message })
  }

  console.error(err)
  res.status(500).json({ message: 'Something went wrong on our side. Please try again.' })
}
