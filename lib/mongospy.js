var mongo = require('mongodb'),
    sys = require('sys'),
    events = require('events'),
    config = require('./config');


module.exports = MongoSpy = function() {
  this.isPolling = false;
  this.latest = new Date(new Date() - 300000);
  var self = this;
  this.db = new mongo.Db(config.mongo.database, new mongo.Server(config.mongo.host, config.mongo.port, {}));
  this.db.open(function(err, db) {
    if (err) { console.log('Failed to open MongoDB: ', err); process.exit();}
    db.executeDbCommand({profile: 2}, function(err, r) {
      self.originalState = {profile: r.documents[0].was, slowms: r.documents[0].slowms};
      db.collection('system.profile', function(err, collection) { self.collection = collection; });
    });
  });
};
sys.inherits(MongoSpy, events.EventEmitter);

MongoSpy.prototype.poll = function() {
  if (this.isPolling) { return };
  this.isPolling = true;
  
  var self = this;
  setInterval(function() {
    self.collection.find({ts: {$gt: self.latest}, info: {$not: /system.profile/}}, function(err, cursor) {
      cursor.toArray(function(err, documents){
        if (documents && documents.length > 0) {
          self.latest = new Date(documents[documents.length - 1]['ts']);
          self.emit('profiles', documents);
        }
      });
    })
  }, 500);
}

MongoSpy.prototype.cleanup = function() {
  if (this.originalState) { 
    this.db.executeDbCommand(this.originalState, function(err){});
  }
}