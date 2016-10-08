(function(root) {
	root.Login = function(page) {
		var page = page;

		var loginTeg, infoTeg;

		function initEvents() {
			loginTeg = root.cmn.getTeg('#login', page);
			infoTeg = root.cmn.getTeg('#infoText', page);

			root.cmn.getTeg('#buttonLogin', page).addEventListener('click', function() {
				if (loginTeg.value !== '') {
					Client.authorize(loginTeg.value);
				} else {
					infoTeg.innerHTML = 'Представьтесь, пожалуйста';
					errorLogin();
				}
			});

			loginTeg.addEventListener('focus', function() {
				loginTeg.classList.remove('error');
				infoTeg.classList.remove('active');
			});
		}

		function errorLogin() {
			loginTeg.classList.add('error');
			infoTeg.classList.add('active');
		}

		return {
			init: function() {
				initEvents();
			},
			open: function(param) {},
			close: function() {
				loginTeg.value = '';
				infoTeg.classList.remove('active');
			},
			userExist: function() {
				infoTeg.innerHTML = 'Такой ник уже занят';
				errorLogin();
			}
		}
	}
}(this));