var messageData = [];

module.exports = function(length, cache) {
    var lengthMessage = length || 100;
    var cacheMessage = cache || 19;
    var arrayMessages = Array.isArray(messageData) ? messageData : [];

    return {
        newMessage: function(user, text) {
            if(!text || text === '')
                return false;

            text = text.replace(/\n+/g, '\n');
            text = text.replace(/^\n(?=\D)|\n$/g, '');

            var data = {
                login: user,
                time: new Date().getTime(),
                text: text
            };

            if (text.length > lengthMessage) {
                callback('Too much information!');
                return;
            }

            if (arrayMessages.length > cacheMessage) {
                arrayMessages.pop();
            }

            arrayMessages.unshift(data);

            return data;
        },
        getHistory: function() {
            return arrayMessages;
        }
    }
}