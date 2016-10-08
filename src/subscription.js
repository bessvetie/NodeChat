var observer = require('./observer'),
    userControl = require('./user_control'),
    peerControl = require('./peer_control'),
    message = require('./message');

var users = new userControl(),
    peers = new peerControl(),
    msg = new message();

module.exports = function() {
    var events = new observer();
    events.on({
        connection: function(socket) {
            socket.id = socket._socket.remoteAddress + ':' + socket._socket.remotePort;

            console.log('received: %s', '-- connection --');
            console.log(socket.id);

            send.JSON(socket, 'connection');
        },
        authorize: function(socket, data) {
            var login = data.login;
            users.authorize(login, function(data) {
                if (data) {
                    socket.id = login;
                    events.trigger('newUserConnected', data);

                    var peer = peers.add(socket);
                    peer.on({
                        broadcast: send.JSON,
                        newUserConnected: send.JSON,
                        userLeave: send.JSON
                    });
                    events.on(peer.events);

                    data.completed = true;
                    data.history = msg.getHistory();
                    send.JSON(socket, 'validated', data);
                } else {
                    data.completed = false;
                    send.JSON(socket, 'validated', data);
                }
            });
        },
        leave: function(socket) {
            var id = socket.id,
                peer = peers.get(id);

            events.off(peer.events);

            users.leave(id, function(data) {
                peers.del(id);

                events.trigger('userLeave', data);
            });
        },
        message: function(socket, data) {
            var message = msg.newMessage(socket.id, data.text);

            events.trigger('broadcast', message);
        }
    });

    var send = {
        JSON: function(socket, type, data) {
            socket.send(JSON.stringify({
                type: type,
                data: data
            }));
        }
    };

    return events;
}