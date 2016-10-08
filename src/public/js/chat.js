(function(root) {
	root.Chat = function(page) {
		var page = page,
			messagesTeg,
			usersListTeg,
			leftPanelTeg,
			rightPanelTeg;

		var messagesHistory = [],
			usersOnline = [],
			thisUser = null;

		function getCorrectTime(timeServe) {
			var moment = new Date(timeServe),
				date = getDate(moment),
				time = getTime(moment);

			var correctTime = date.dd + '.' + date.mm + '.' + date.yy + ' ' +
				time.hh + ':' + time.mm + ':' + time.ss;

			return correctTime;
		}

		function getTime(moment) {
			var hours = moment.getHours(),
				minutes = moment.getMinutes(),
				seconds = moment.getSeconds();

			return {
				hh: hours < 10 ? '0' + hours : hours,
				mm: minutes < 10 ? '0' + minutes : minutes,
				ss: seconds < 10 ? '0' + seconds : seconds
			};
		}

		function getDate(moment) {
			var day = moment.getDate(),
				month = moment.getMonth() + 1,
				year = moment.getFullYear();

			return {
				dd: day < 10 ? '0' + day : day,
				mm: month < 10 ? '0' + month : month,
				yy: year < 10 ? '0' + year : year
			};
		}

		function loadHistory() {
			loadMessage(messagesHistory);
			loadUsers(usersOnline);
		}

		function loadMessage(messages) {
			var history = root.cmn.newTeg('div'),
				message;

			var i, length = messages.length;
			for (i = 0; i < length; i++) {
				message = createTegMessage(messages[i]);

				var first = history.firstChild;
				if (first)
					history.insertBefore(message, first);
				else
					history.appendChild(message);
			}
			messagesTeg.insertAdjacentHTML('afterBegin', history.innerHTML);
			leftPanelTeg.scrollTop = leftPanelTeg.scrollHeight;
		}

		function loadUsers(users) {
			var history = root.cmn.newTeg('div');

			var i, user;
			for (i in users) {
				user = createUserTeg(users[i]);
				history.appendChild(user);
			}
			usersListTeg.insertAdjacentHTML('afterBegin', history.innerHTML);
			rightPanelTeg.scrollTop = rightPanelTeg.scrollHeight;
		}

		function createTegMessage(message) {
			message.text = (message.text).replace(/\n+/g, '<br/>');

			var messageBody = addTegMessageBody();

			// create dateMessage teg
			var dateMessage = root.cmn.newTeg('span');
			dateMessage.classList.add('dateMessage');
			dateMessage.innerHTML = getCorrectTime(message.time);

			// create userName teg
			var userName = root.cmn.newTeg('span');
			userName.classList.add('userName');
			userName.innerHTML = message.login;

			// add dataMessage tegs
			if (message.login === thisUser) {
				addTegCurrentUserDataMessage(messageBody.data, dateMessage, userName);
				messageBody.message.classList.add('youMessage');
			} else {
				addTegAllUserDataMessage(messageBody.data, dateMessage, userName);
			}

			// create span to textMessage
			var spanMessage = root.cmn.newTeg('span');
			spanMessage.innerHTML = message.text;
			messageBody.text.appendChild(spanMessage);

			// add all tegs of message
			messageBody.message.appendChild(messageBody.data);
			messageBody.message.appendChild(dateMessage);
			messageBody.message.appendChild(messageBody.text);

			return messageBody.message;
		}

		function addTegMessageBody() {
			// create message
			var message = root.cmn.newTeg('div');
			message.classList.add('message');

			// create dataMessage
			var dataMessage = root.cmn.newTeg('div');
			dataMessage.classList.add('dataMessage');

			// create textMessage
			var textMessage = root.cmn.newTeg('div');
			textMessage.classList.add('textMessage');

			message.appendChild(dataMessage);
			message.appendChild(textMessage);

			return {
				message: message,
				data: dataMessage,
				text: textMessage
			};
		}

		function addTegCurrentUserDataMessage(parent, dateMessage, userName) {
			userName.innerHTML = ':' + userName.innerHTML + ' ';
			dateMessage.style.float = 'right';
			parent.appendChild(userName);
		}

		function addTegAllUserDataMessage(parent, dateMessage, userName) {
			userName.innerHTML = ' ' + userName.innerHTML + ':';
			dateMessage.style.float = 'left';
			parent.appendChild(userName);
		}

		function createUserInfoMessageTeg(login, text) {
			// create message
			var message = root.cmn.newTeg('div');
			message.classList.add('message', 'infoMessage');

			// create info message
			var span = root.cmn.newTeg('span');
			span.innerHTML = login + ' ' + text;

			message.appendChild(span);

			return message;
		}

		function addUser(login) {
			var newUserMessageTeg = createUserInfoMessageTeg(login, 'присоединился к беседе');
			messagesTeg.appendChild(newUserMessageTeg);

			var newUserLiTeg = createUserTeg(login);
			usersListTeg.appendChild(newUserLiTeg);
		}

		function createUserTeg(login) {
			var newUserLiTeg = root.cmn.newTeg('li');
			newUserLiTeg.id = 'user-' + login;
			newUserLiTeg.innerHTML = login;
			return newUserLiTeg;
		}

		function removeUser(login) {
			var newUserMessageTeg = createUserInfoMessageTeg(login, 'покинул беседу');
			messagesTeg.appendChild(newUserMessageTeg);

			var user = root.cmn.getTeg('#user-' + login, page);
			usersListTeg.removeChild(user);
		}

		function scrollBothPanels() {
			leftPanelTeg.scrollTop = leftPanelTeg.scrollHeight;
			rightPanelTeg.scrollTop = rightPanelTeg.scrollHeight;
		}

		function parseAndSendMessage() {
			messageseArea.focus();
			messageseArea.setSelectionRange(0, 0);

			var text = messageseArea.value;
			if (text === '')
				return false;

			Client.message(text);
			messageseArea.value = '';
		}

		function initEvents() {
			usersListTeg = root.cmn.getTeg('#users', page);
			messagesTeg = root.cmn.getTeg('#messages', page);
			leftPanelTeg = root.cmn.getTeg('#leftpanel', page);
			rightPanelTeg = root.cmn.getTeg('#rightpanel', page);

			var messageseArea = root.cmn.getTeg('#messageseArea', page);

			var sendMessage = root.cmn.getTeg('#sendMessage', page);
			sendMessage.addEventListener('click', function() {
				parseAndSendMessage();
			});

			messageseArea.addEventListener('keyup', function(e) {
				if (e.which === 13 && !e.ctrlKey) {
					parseAndSendMessage();
				} else if (e.which === 13 && e.ctrlKey) {
					messageseArea.value += '\n';
				}
			});
		}

		return {
			init: function() {
				initEvents();
			},
			open: function(param) {
				var login = Client.getLoginCache();

				if (!thisUser && !login) {
					location.hash = 'login';
				} else {
					if (!thisUser) {
						Client.authorize(login);
					} else {
						loadHistory();
					}
				}
			},
			close: function() {
				messagesTeg.innerHTML = '';
				usersListTeg.innerHTML = '';

				thisUser = null;
				messagesHistory = [];
				usersOnline = [];

				Client.chatClosed();
			},
			authorizationCompleted: function(data) {
				thisUser = data.login;
				messagesHistory = data.history;
				usersOnline = data.online;

				var src = document.body.getAttribute('src');
				if (src === 'chat')
					loadHistory();
				else
					location.hash = 'chat';
			},
			newUserConnected: function(data) {
				addUser(data.login);

				scrollBothPanels();
			},
			userLeave: function(data) {
				removeUser(data.login);

				scrollBothPanels();
			},
			message: function(data) {
				var message = createTegMessage(data);
				messagesTeg.appendChild(message);

				messageseArea.innerHTML = '';
				leftPanelTeg.scrollTop = leftPanelTeg.scrollHeight;
			}
		}
	}
}(this));