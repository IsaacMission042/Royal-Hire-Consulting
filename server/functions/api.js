const serverless = require('serverless-http');
process.env.SERVE_HTTP = 'false'; // Prevent app.listen from running
const app = require('../index');

module.exports.handler = serverless(app);
