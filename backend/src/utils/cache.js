const NodeCache = require('node-cache');

// Cache TTL: 10 minutes
const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

module.exports = cache;
