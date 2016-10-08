(function(root) {
	root.Navigate.handler('login', root.Login);
	root.Navigate.handler('chat', root.Chat);

	var Client = (function() {
		var chatSocket,
			userLogin;

		function sendRequestJson(data) {
			chatSocket.send(JSON.stringify(data));
		}

		function newSocket() {
			var socket = new WebSocket("ws://localhost:3000");

			socket.onopen = function() {};

			socket.onclose = function() {};

			socket.onmessage = function(message) {
				var message = JSON.parse(message.data);

				var type = message.type;
				var data = message.data;
				(Object.hasOwnProperty.call(eventType, type) &&
					eventType[type] ||
					eventType._default)(data);
			};

			socket.onerror = function(error) {
				alert(error);
			};

			return socket;
		}

		var eventType = {
			connection: function() {
				sendRequestJson({
					type: 'authorize',
					login: userLogin
				});
			},
			validated: function(data) {
				if (data.completed) {
					Navigate.pageHandlers['chat'].authorizationCompleted(data);
				} else {
					Navigate.pageHandlers['login'].userExist();
				}
			},
			newUserConnected: function(data) {
				Navigate.pageHandlers['chat'].newUserConnected(data);
			},
			userLeave: function(data) {
				Navigate.pageHandlers['chat'].userLeave(data);
			},
			broadcast: function(data) {
				Navigate.pageHandlers['chat'].message(data);
			},
			_default: function() {}
		};

		return {
			getLoginCache: function() {
				return userLogin;
			},
			authorize: function(loginEntered) {
				userLogin = loginEntered;

				chatSocket = newSocket();
			},
			message: function(text) {
				sendRequestJson({
					type: 'message',
					text: text
				});
			},
			chatClosed: function() {
				if (chatSocket) {
					chatSocket.close();
				}
			}
		}
	}());
	root.Client = Client;

	window.onhashchange();
}(this));