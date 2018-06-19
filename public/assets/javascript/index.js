$(document).ready(() => {
	console.log('javascript loaded:index');

	$('button#scrape').on('click', () => {
		$('#intro').css({ display: 'none' });
		$('#loader').css({ display: 'block' });
		$.ajax({
			type: 'GET',
			url: '/api/scrap'
		}).then((res) => {
			res.forEach(article => {
				let articleTemplate = $(`
				<div class="article card" key="${article.key}">
					<div class="card-header text-center">
						<div class="title">
							<h5>${article.title}</h5>
						</div>
					</div>
					<div class="card-body">
						<p class="card-text">${article.innerHTML}</p>
						<div class="button-list text-center">
							<button type="button" class="btn btn-dark save-article">Save Me</button>
						</div>
					</div>
				</div>
				`)
				$('#loader').css({ display: 'none' });
				$('#articles').append(articleTemplate);
			});
		})

	})

	$('#articles').on('click', 'button.save-article', function () {
		let article = {}
		article.key = $(this).closest('.article').attr('key').trim();
		article.title = $(this).closest('.article').children('.card-header').text().trim();
		article.innerHTML = $(this).closest('.card-body').children('.card-text').html();
		$.ajax({
			type: 'POST',
			url: '/api/articles',
			data: article
		}).then((res) => {
			if (res.length === 0) animateButton($(this), false);
			else animateButton($(this), true);

		})
	})

	const animateButton = ($button, success) => {
		if (success) {
			$button.css({ 'background-color': '#269F42' });
			$button.text('Successfully Saved!');
			$button.attr({ disabled: '' });
		}
		else {
			$button.css({ 'background-color': '#DB3444' });
			$button.text('Article already saved!');
			$button.attr({ disabled: '' });
		}
	}
});