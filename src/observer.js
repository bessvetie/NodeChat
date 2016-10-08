module.exports = function() {
    function removeFromArray(array, value) {
        var idx = array.indexOf(value);
        if (idx !== -1) {
            array.splice(idx, 1);
        }
        return array;
    }

    function addListener(event, handler) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(handler);
    }

    function removeListener(event, handler) {
        if (!this.listeners[event])
            return;

        if (handler) {
            removeFromArray(this.listeners[event], handler);
        } else {
            this.listeners[event] = [];
        }
    }

    return {
        listeners: {},
        on: function(event, handler) {
            if (typeof event === 'string') {
                addListener.call(this, event, handler);
            } else {
                var prop;
                for (prop in event) {
                    addListener.call(this, prop, event[prop]);
                }
            }
        },
        off: function(event, handler) {
            // remove all key/value
            if (arguments.length === 0) {
                this.listeners = {};
                // remove key/value specified in the object
            } else if (arguments.length === 1 && typeof arguments[0] === 'object') {
                var prop;
                for (prop in event) {
                    removeListener.call(this, prop, event[prop]);
                }
                // remove one event
            } else {
                removeListener.call(this, prop, handler);
            }
        },
        trigger: function(event) {
            if (!this.listeners[event])
                return;

            var slice = Array.prototype.slice;
            var args = slice.call(arguments, 1);

            var i;
            var length = this.listeners[event].length;
            for (i = 0; i < length; i++) {
                this.listeners[event][i].apply(this, args);
            }
        }
    }
}