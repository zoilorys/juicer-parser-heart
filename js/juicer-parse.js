$(function() {
	var dimensions = {
		'9': {
			'1': 0.09,
			'2': 0.12,
			'3': 0.14,
			'4': 0.16,
			'5': 0.14,
			'6': 0.12,
			'7': 0.09,
			'8': 0.06,
			'9': 0.02
		}
	},
		states = [
			'row',
			'heart'
		],
		currentState = 1;

	function buildItem(item) {
		var container = $('<div>', {
				'class': 'heart-item',
			}),

			link = $('<a>', {
				href: item.external,
				target: '_blank'
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
				rows = 9,
				count = 0;

		for (var i = 1; i <= rows; i++) {
			count = Math.ceil(items.length*dimensions[rows][i]);
			data[i] = items.slice(itemsUsed, itemsUsed + count);
			itemsUsed = itemsUsed + count;
		}

		var dummy = $('<div>', {
			'class': 'heart-item',
		})[0];

		data[1].splice(Math.ceil(data[1].length/2), 0, $.clone(dummy), $.clone(dummy));
		data[2].splice(Math.ceil(data[2].length/2), 0, $.clone(dummy));

		return data;
	}

	function buildRow(parsedItems) {
		console.log(parsedItems);
		var root = $('#juicer-heart'),
				row = $('<div>', {
					'class': 'heart-row'
				});

		root.fadeOut(400, function() {
			root.empty().append.apply(root,
				row.append.apply(row, parsedItems)
			).fadeIn(600);
		});
	}

	function buildHeart(parsedItems) {
		var root = $('#juicer-heart'),
				container = $('<div>');

		var wrapped = Object.keys(parsedItems).map(function(row) {
			var rowContainer = $('<div>', {
					'class': 'heart-row'
			});
			return rowContainer.append.apply(rowContainer, parsedItems[row]);
		});

		root.fadeOut(400, function() {
			root.empty().append.apply(root, wrapped).fadeIn(600);
		});
	}

	function displayItems(parsedItems) {
		switch(currentState) {
			case 0:
				buildRow(parsedItems);
				break;
			case 1:
				buildHeart(
					distributeItems(parsedItems)
				);
				break;
			default:
				throw new Error('Unknown application state: ' + currentState);
		}
	}

	function parseItems(items) {
		return items.map(buildItem);
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
		}).fail(callback);
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
				displayItems(
					parseItems(data.posts.items)
				);
			}
		});
	}

	function setState(state) {
		if (currentState === state) {
			return;
		} else if (typeof state !== 'number') {
			throw new Error('State must be type "Number", instead got ' + typeof state);
		} else if (!states[state]) {
			throw new Error('Unable to set state "' + states[state] +'" state: No state with index ' + state + ' found!');
		} else {
			currentState = state;
			basicSearch();
		}
	}

	function initSearchButton() {
		$('#juicer-search-button').on('click', function(e) {
			e.preventDefault();

			basicSearch();
		})
	}

	function initSwitchButtons() {
		$('#juicer-heart-button').on('click', function(e) {
			e.preventDefault();

			setState(1);
		});

		$('#juicer-row-button').on('click', function(e) {
			e.preventDefault();

			setState(0);
		});
	}

	function initSearchOnEnter() {
		$('#juicer-search-input').on('keyup', function(e) {
			e.preventDefault();

			if(e.which === 13) {
				basicSearch();
			}
		})
	}

	function initInputs() {
		initSearchButton();
		initSearchOnEnter();
		initSwitchButtons();
	}

	function init() {
		basicSearch();
		initInputs();
	}

	init();
});
