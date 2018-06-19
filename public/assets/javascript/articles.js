$(document).ready(() => {
    console.log('javascript loaded:articles');

    $.ajax({
        type: 'GET',
        url: 'api/articles'
    }).then((articles) => {
        articles.forEach(article => {
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
                        <button type="button" class="btn btn-dark add-note">Add Note</button>
                        <button type="button" class="btn btn-dark delete-article">Delete Article</button>
                    </div>
                </div>
            </div>
            `)
            $('#articles').append(articleTemplate);
        });
        $('#loader').css({ display: 'none' });
    });

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

});