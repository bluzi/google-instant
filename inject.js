let latestSearch;

chrome.extension.sendMessage({}, function (response) {
	var readyStateCheckInterval = setInterval(function () {
		if (document.readyState === 'complete') {
			clearInterval(readyStateCheckInterval);

			console.log('Google Inject is running');
			setEvent();
		}
	}, 10);
});

function searchFor(term) {
	if (term.trim() === latestSearch) {
		return;
	}

	$('img,[title="Google"]').css('filter', 'grayscale(100%)');
	latestSearch = term;
	$.get('https://www.google.co.il/search?q=' + term, data => {
		if (term === latestSearch) {
			var newDoc = document.open("text/html", "replace");
			newDoc.write(data);
			newDoc.close();
			$(newDoc).ready(() => {
				let input = $('#lst-ib')[0];
				$(input).focus();
				input.setSelectionRange(term.length, term.length);
				setEvent();
			});
		}
	});
}

function setEvent() {
	$('#lst-ib').keyup(function () {
		if ($(this).val().length) {
			searchFor($(this).val());
		}
	});
}