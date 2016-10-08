(function(root) {
	root.cmn = {
		ajax: function(options) {
			var xhr = new XMLHttpRequest(),
				timeoutTimer,
				data;

			if (options.timeout > 0) {
				timeoutTimer = setTimeout(function() {
					options.error('timeout');
					xhr.abort();
				}, options.timeout);
			}

			xhr.onreadystatechange = function() {
				if (xhr.readyState === 4) {

					if (timeoutTimer) {
						clearTimeout(timeoutTimer);
					}

					if (xhr.status === 200) {
						data = xhr.responseText;

						try {
							data = JSON.parse(data);
						} catch (e) {}

						options.success(data);
					} else {
						data = {
							response: xhr.responseText,
							status: xhr.status,
							statusText: xhr.statusText
						};
						if (xhr.responseXML) {
							data.responseXML = xhr.responseXML;
						}

						options.error(data, xhr.statusText);
					}
				}
			};

			xhr.open(options.type, options.url);

			if (options.headers) {
				var key;
				for (key in options.headers) {
					if (!options.headers.hasOwnProperty(key)) continue;
					xhr.setRequestHeader(key, options.headers[key]);
				}
			}

			xhr.send(options.data);
		},
		changeActive: function(list) {
			var oldActive = list.querySelector('.active');

			if (oldActive)
				oldActive.classList.remove('active');
			if (this)
				this.classList.add('active');

			return oldActive;
		},
		getTeg: function(type, parent) {
			if (!parent)
				parent = document.body;

			return parent.querySelector(type);
		},
		newTeg: function(name) {
			var teg = document.createElement(name);

			return teg;
		}
	}
}(this));