const fetch = require('node-fetch')

module.exports = {
  get (url, opts) {
    return fetch(url, {
      method: 'GET',
      timeout: 30000,
      ...opts
    }).then(result => result.json())
  }
}
