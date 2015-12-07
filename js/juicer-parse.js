$(function() {
	var dimensions = {
		'8': {
			'1': 0.08,
			'2': 0.12,
			'3': 0.14,
			'4': 0.16,
			'5': 0.14,
			'6': 0.11,
			'7': 0.07,
			'8': 0.02
		}
	}

	function buildItem(item) {
		var container = $('<div>', {
				'class': 'heart-item',
			}),

			link = $('<a>', {
				href: item.external
			}),

			img = $('<img>', {
				src: item.image,
				alt: item.message
			});

		return container.append(
			link.append(img)
		)[0];
	}

	function distributeItems(items) {
		var data = {},
				itemsUsed = 0,
				rows = 8,
				count = 0;

		for (var i = 1; i <= rows; i++) {
			count = Math.ceil(items.length*dimensions[rows][i]);
			data[i] = items.slice(itemsUsed, itemsUsed + count);
			itemsUsed = itemsUsed + count;
		}

		var dummy = $('<div>', {
			'class': 'heart-item',
		})[0];

		data[1].splice(Math.ceil(data[1].length/2), 0, $.clone(dummy), $.clone(dummy), $.clone(dummy));
		data[2].splice(Math.ceil(data[2].length/2), 0, $.clone(dummy));

		return data;
	}

	function displayItems(parsedItems) {
		var root = $('#juicer-heart'),
				container = $('<div>');

		var wrapped = Object.keys(parsedItems).map(function(row) {
			var rowContainer = $('<div>', {
					'class': 'heart-row'
			});
			return rowContainer.append.apply(rowContainer, parsedItems[row]);
		});

		root.fadeOut(200, function() {
			root.empty().append.apply(root, wrapped).fadeIn(200);
		});
	}

	function parseItems(items) {
		return distributeItems(
			items.map(buildItem)
		);
	}

	function loadJuicerItems(tag, callback) {
		$.ajax({
			url: 'https://juicer.io/api/feeds/heart',
			data: {
				page: 1,
				search: tag || undefined,
				per: 80
			},
			crossDomain: true,
			dataType: 'jsonp'
		}).done(function(data) {
			callback(null, data);
		}).fail(function(error) {
			callback(error);
		});
	}

	function juicerSearch(callback) {
		loadJuicerItems(
			$('#juicer-search-input').val(),
			callback
		);
	}

	function basicSearch() {
		juicerSearch(function(error, data) {
			if (error) {
				console.log('Error: ', error);
			} else {
				console.log(data.posts.items.length);
				displayItems(
					parseItems(data.posts.items)
				);
			}
		});
	}

	function initSearchButton() {
		$('#juicer-search-button').on('click', function(e) {
			e.preventDefault();

			basicSearch();
		})
	}

	function init() {
		basicSearch();
		initSearchButton();
	}

	init();
});