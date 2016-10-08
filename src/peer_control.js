module.exports = function() {
    var peers = {};

    var Peer = function(socket) {
        this.id = socket.id;
        this.socket = socket;
        this.events = {};
    };
    Peer.prototype.on = function(event, handler) {
        if (typeof event === 'string') {
            this.events[event] = handler.bind(null, this.socket, event);
        } else {
            var prop;
            for (prop in event) {
                this.events[prop] = event[prop].bind(null, this.socket, prop);
            }
        }
    };

    return {
        add: function(socket) {
            var peer = new Peer(socket);
            peers[peer.id] = peer;

            return peer;
        },
        del: function(id) {
            delete peers[id];
        },
        get: function(id) {
            return peers[id];
        }
    }
}