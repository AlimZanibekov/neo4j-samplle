const pages = require('./pages');

module.exports = {
  applyMiddleware(app) {
    app.use('/v1', pages);
  }
}
