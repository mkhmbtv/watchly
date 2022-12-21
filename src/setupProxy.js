function proxy(app) {
  app.get(/^\/$/, (req, res) => res.redirect('/watchlist'))
}

module.exports = proxy
