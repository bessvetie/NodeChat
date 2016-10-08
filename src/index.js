var port = 3000;

var subscription = require('./subscription'),
    WebSocketServer = require('ws').Server;

var subs = new subscription(),
    wss = new WebSocketServer({
        port: port
    });

wss.on('connection', function connection(ws) {
    subs.trigger('connection', ws);

    ws.on('message', function incoming(message) {
        var data = JSON.parse(message);
        subs.trigger(data.type, ws, data);
    });

    ws.on('close', function close() {
        subs.trigger('leave', this);
    });
});

console.log('Server started');