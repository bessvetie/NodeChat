module.exports = function() {
    var usersData = {},
        online = [];

    function userExterminate(array, value) {
        var idx = array.indexOf(value);
        if (idx !== -1) {
            array.splice(idx, 1);
        }
    }

    function existUser(user, callback) {
        if (online.indexOf(user) !== -1)
            callback(user);
        else
            callback(false);
    }

    function returnOnline(login, callback) {
        var data = {
            login: login,
            online: online
        };

        callback(data);
    }

    return {
        authorize: function(login, callback) {
            existUser(login, function(exist) {
                if (exist) {
                    console.log('received: %s', '-- authorize --');
                    console.log(false);

                    callback(false);
                } else {
                    console.log('received: %s', '-- authorize --');
                    console.log(login);

                    usersData[login] = login;
                    online.push(login);

                    returnOnline(login, callback);
                }
            });
        },
        leave: function(login, callback) {
            console.log('received: %s', '-- leave --');
            console.log(login);

            userExterminate(online, login);
            delete usersData[login];

            returnOnline(login, callback);
        }
    }
}