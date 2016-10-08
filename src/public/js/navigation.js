(function(root) {
	var Navigate = (function() {
		var list = root.cmn.getTeg('#sections');

		window.onhashchange = function() {
			var hash = location.hash || '#login';

			var re = /#([-0-9A-Za-z]+)(\:(.+))?/,
				match = re.exec(hash),
				param = match[3];
				
			hash = match[1];
			loadPage(hash, param);
		}

		function loadPage(pageName, param) {
			var page = root.cmn.getTeg('#' + pageName, list);

			var src = page.getAttribute('src');
			if (src && !page.firstChild) {
				root.cmn.ajax({
					url: src,
					type: 'GET',
					success: function(data) {
						page.innerHTML = data;

						var handler = Navigate.pageHandlers[pageName];
						if (handler)
							handler.init();

						showPage(pageName, param);
					},
					error: function(xhr, textStatus) {
						page.innerHTML = 'failed to get:' + src;
					}
				});
			} else {
				showPage(pageName, param);
			}
		}

		function showPage(pageName, param) {
			var page = root.cmn.getTeg('#' + pageName, list);

			document.body.setAttribute('src', pageName);

			// run function of the old page close if there exists
			var oldActive = root.cmn.changeActive.call(page, list);
			if (oldActive) {
				handler = Navigate.pageHandlers[oldActive.id];
				if (handler)
					handler.close();
			}

			// run function of the old page close if there exists
			var handler = Navigate.pageHandlers[pageName];
			if (handler) {
				handler.open(param);
			}
		}

		return {
			pageHandlers: {},
			handler: function(pageID, handler) {
				var page = root.cmn.getTeg('#' + pageID, list);
				Navigate.pageHandlers[pageID] = handler(page);
			}
		}
	}());
	root.Navigate = Navigate;
})(this);