/*
*	Variables
*/
let latestSearch;
let isResultsPage;

/*
*	Entry
*/
chrome.extension.sendMessage({}, function (response) {
	var readyStateCheckInterval = setInterval(function () {
		if (document.readyState === 'complete') {
			clearInterval(readyStateCheckInterval);

			isResultsPage = !!$("#ucs").length;

			console.log('Google Inject is running');
			setEvent();
		}
	}, 10);
});

/*
*	Helpers
*/
function searchFor(term) {
	if (term.trim() === latestSearch) {
		return;
	}

	if (isResultsPage) {
		$('#rcnt').html(`
			<div style="text-align: center; margin: 25px;">
				<svg version="1.1" 
					id="svg-spinner" 
					xmlns="http://www.w3.org/2000/svg" 
					xmlns:xlink="http://www.w3.org/1999/xlink" 
					x="0px" 
					y="0px"
					width="100"
					height="100"
					viewBox="0 0 80 80" 
					xml:space="preserve">

					<path
						id="spinner" 
						fill="lightblue" 
						d="M40,72C22.4,72,8,57.6,8,40C8,22.4,
						22.4,8,40,8c17.6,0,32,14.4,32,32c0,1.1-0.9,2-2,2
						s-2-0.9-2-2c0-15.4-12.6-28-28-28S12,24.6,12,40s12.6,
						28,28,28c1.1,0,2,0.9,2,2S41.1,72,40,72z"

						<animateTransform
							attributeType="xml"
							attributeName="transform"
							type="rotate"
							from="0 40 40"
							to="360 40 40"
							dur="0.8s"
							repeatCount="indefinite"
						/>
					</path>
				</svg>
			</div>
		`);
	}

	latestSearch = term;
	$.get('https://www.google.co.il/search?q=' + term, data => {
		if (term === latestSearch) {
			if (!isResultsPage) {
				var newDoc = document.open("text/html", "replace");
				newDoc.write(data);
				newDoc.close();
				$(newDoc).ready(() => {
					let input = $('#lst-ib')[0];
					$(input).focus();
					input.setSelectionRange(term.length, term.length);
					setEvent();
					isResultsPage = true;
				});
			}
			else {
				$('#rcnt').html($(data).find('#rcnt')[0]);
				document.title = term + ' - Google Search';
			}
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