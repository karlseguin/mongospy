ms = {
  socket: null,
  idHackPattern: /idhack/,
  databasePattern: /#DATABASE#/,
  initialize: function() {
    ms.skipIdHacks = true;
    ms.started = false;
    ms.socket = io.connect('#PATH#');
    ms.start();
  },
  start: function() {
    if (ms.started) { return true; }
    ms.started = true;
    ms.socket.on('profiles', ms.profiles);
    return true;
  },
  stop: function() {
    ms.socket.removeListener('profiles', ms.profiles);
    ms.started = false;
    return true;
  },
  skipIdHacks: function(trueOrFalse) {
    ms.skipIdHacks = trueOrFalse;
    return true;
  },
  profiles: function(data) {
    for(var i = 0; i < data.length; ++i) {
      var d = data[i];
      if (ms.skipIdHacks && ms.idHackPattern.test(d.info)) { continue; }
      
      var info = d.info.replace(ms.databasePattern, '');
      var ts = new Date(d.ts);
      var time = ts.getHours() < 10 ? '0' + ts.getHours() : ts.getHours();
      time += ':' + (ts.getMinutes() < 10 ? '0' + ts.getMinutes() : ts.getMinutes());
      console.log('%s %s', time, info);
    }
  }
}
if (typeof(io) == 'undefined' || typeof(io.connect) != 'function') {
  $.getScript('#PATH#/socket.io/socket.io.js', ms.initialize);
} else {
  ms.initialize();
}
