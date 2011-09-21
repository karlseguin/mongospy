module.exports = {
  mongo: {host: '127.0.0.1', port: 27017, database:  process.argv[2] || 'test'},
  listen: {host: '127.0.0.1', port: 27117}
};
