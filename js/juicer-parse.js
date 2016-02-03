$(function() {
	var hash = {
		"Instagram": "http://instagram.com/p/",
		"Twitter": ""
	}

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

	function encodeRFC5987ValueChars (str) {
		return encodeURIComponent(str)
			.replace(/['()]/g, escape)
			.replace(/\*/g, '%2A')
			.replace(/%(?:7C|60|5E)/g, unescape);
	}

	function createSocialButton(options) {
		return $('<li>', {
			'class': 'social-button social-' + options.tag
		}).append(
			$('<a>', {
				'class': 'social-link',
				target: '_blank',
				href: options.url,
				html: '<i class="' + options.icon + '"></i>'
			})
		);
	}

	function generateModal(item) {
		var link = item.full_url;

		var overlay = $('<div>', {
			'class': 'modal fade modal-heart in',
			id: 'modalHeart',
			tabindex: "-1",
			role: 'dialog',
			'aria-labelledby': 'myModalLabel',
			style: "display: block; padding-left: 17px;"
		});

		var doc = $('<div>', {
			'class': 'modal-dialog',
			role: 'document'
		}).on('click', function(e) {e.stopPropagation();});

		var contentWrapper = $('<div>', {
			'class': 'modal-content'
		});

		var modalHeader = $('<div>', {
			'class': 'modal-header'
		}).append(
			$('<button>', {
				type: 'button',
				'class': 'close',
				'data-dismiss': 'modal',
				'aria-label': 'Close'
			}).append(
				$('<span>', {
					'aria-hidden': 'true',
					text: 'x'
				})
			).on('click', function(e) {
				e.stopPropagation();
				closeModal();
			})
		);

		var modalBody = $('<div>', {
			'class': 'modal-body'
		});

		var row = $('<div>', {
			'class': 'row'
		});

		var postImg = $('<div>', {
			'class': 'col-xs-6 img-post'
		}).append(
			$('<img>', {
				src: item.image,
				alt: ''
			})
		);

		var postInfo = $('<div>', {
			'class': 'col-xs-6 info-post'
		});

		var topInfoPost = $('<div>', {
			'class': 'top-info-post col-xs-12'
		});

		var userAcc = $('<div>', {
			'class': 'user-acc pull-left'
		}).append(
			$('<img>', {
				src: item.poster_image,
				alt: ''
			}),
			$('<span>', {
				text: item.poster_name
			})
		);

		var timePosted = new Date(item.external_created_at).getTime();
		var currentTime = new Date().getTime();
		var time = (currentTime - timePosted) / (1000 * 3600);

		if (time < 1) {
			var postedTime = Math.floor(time * 60) + "min ago";
		} else {
			var postedTime = time.toFixed(2) + "h ago";
		}

		var postTime = $('<div>', {
			'class': 'time-post pull-right',
			text: postedTime
		});

		var middleInfoPost = $('<div>', {
			'class': 'middle-info-post col-xs-12',
			text: item.unformatted_message
		});

		var bottomInfoPost = $('<div>', {
			'class': 'bottom-info-post col-xs-12'
		});

		var goToButton = $('<div>', {
			'class': 'button pull-left'
		}).append(
			$('<button>', {
				type: 'button',
				'class': 'btn-default',
				html: '<a href="' + link + '">View on ' + item.source.source + '</a>'
			})
		);

		var likesComments = $('<div>', {
			'class': 'like-comments pull-left',
			html: '<a href="' + link + '"><i class="fa fa-thumbs-o-up"></i>' + item.likes + '</a>' +
				'<a href="' + link + '"><i class="fa fa-comment"></i>' + item.comments + '</a>'
		});

		var socials = $('<div>', {
			'class': 'social-share pull-right',
		}).append(
			$('<ul>', {
				'class': 'social-share-buttons'
			}).append(
				createSocialButton({
					tag: 'facebook',
					icon: 'fa fa-facebook',
					url: 'http://www.facebook.com/sharer/sharer.php?u=' + item.full_url
				}),
				createSocialButton({
					tag: 'twitter',
					icon: 'fa fa-twitter',
					url: 'https://twitter.com/intent/tweet?text=' + encodeRFC5987ValueChars(item.unformatted_message)
				}),
				createSocialButton({
					tag: 'google-plus',
					icon: 'fa fa-google-plus',
					url: "https://plus.google.com/share?url=" + item.full_url
				}),
				createSocialButton({
					tag: 'pinterest',
					icon: 'fa fa-pinterest',
					url: 'https://pinterest.com/pin/create/button/?url=' + item.full_url + '&media=' + encodeRFC5987ValueChars(item.image) +
						+ '&description=' + encodeRFC5987ValueChars(item.unformatted_message)
				}),
				createSocialButton({
					tag: 'linkedin',
					icon: 'fa fa-linkedin',
					url: 'https://www.linkedin.com/shareArticle?url=' + item.full_url + '&title=' + encodeRFC5987ValueChars(item.unformatted_message)
				})
			)
		);

		overlay.append(
			doc.append(
				contentWrapper.append(
					modalHeader,
					modalBody.append(
						row.clone().append(
							postImg,
							postInfo.append(
								row.clone().append(
									topInfoPost.append(
										userAcc,
										postTime
									),
									middleInfoPost,
									bottomInfoPost.append(
										goToButton,
										likesComments,
										socials
									)
								)
							)
						)
					)
				)
			)
		);

		function closeModal() {
			$('#modalHeart').remove();
		}

		overlay.on('click', function(e) {
			e.stopPropagation();
			closeModal();
		})

		$('body').append(overlay);
	}

	function buildItem(item) {
		var container = $('<div>', {
				'class': 'heart-item',
			}),

			link = $('<a>', {
				target: '_blank'
			}),

			img = $('<img>', {
				src: item.image,
				alt: item.message
			});

		container.on('click', function(e) {
			e.stopPropagation();

			generateModal(item);
		})

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

	function appendToRoot(data) {
		var root = $('#juicer-heart');

		root.fadeOut(400, function() {
			root.empty().append.apply(root, data).fadeIn(600);
		});
	}

	function wrapInRow(data) {
		var rowContainer = $('<div>', {
					'class': 'heart-row'
			});
		return rowContainer.append.apply(rowContainer, data);
	}

	function buildRow(row) {
		appendToRoot(row);
	}

	function buildHeart(parsedItems) {
		var wrapped = Object.keys(parsedItems).map(function(row) {
			return wrapInRow(parsedItems[row]);
		});

		appendToRoot(wrapped);
	}

	function displayItems(parsedItems) {
		switch(currentState) {
			case 0:
				buildRow(
					wrapInRow(parsedItems)
				);
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
