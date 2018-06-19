$(document).ready(() => {
    console.log('javascript loaded:articles');

    $.ajax({
        type: 'GET',
        url: 'api/articles'
    }).then((articles) => {
        if (articles.length === 0) {
            $('#no-data').show();
        }
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
                        <button type="button" class="btn btn-dark open-notes">Notes</button>
                        <button type="button" class="btn btn-dark delete-article">Delete Article</button>
                    </div>
                </div>
            </div>
            `)
            articleTemplate.data({ id: article._id });
            $('#articles').append(articleTemplate);
        });
        $('#loader').css({ display: 'none' });
    });

    $('#articles').on('click', 'button.delete-article', function () {
        const id = $(this).closest('.article').data('id');
        $.ajax({
            type: 'DELETE',
            url: `/api/articles/${id}`,
        }).then(() => {
            animateButton($(this));
            $(this).closest('.article').hide();
        });
    });

    $('#note-modal').on('click', 'button.add-note', function () {
        const id = $(this).closest('#note-modal').data('id');
        const text = $(this).closest('#note-modal').find('#add-text').val().trim();
        $.ajax({
            type: 'POST',
            url: `/api/notes/`,
            data: {
                text: text,
                id: id
            }
        }).then((note) => {
            appendNote(note);
        })
    });

    $('#note-modal').on('click', 'button.delete-note', function () {
        let id = $(this).closest('.note').data('id');
        $(this).closest('.note').remove();        
        $.ajax({
            type: 'DELETE',
            url: `api/notes/${id}`
        })
    });

    $('#articles').on('click', 'button.open-notes', function () {
        const id = $(this).closest('.article').data('id');
        $('#note-modal').data({ id: id });
        $('.modal-body').hide();
        $('.modal-title').hide();
        $('#modal-loader').show();
        $('#note-modal').modal();
        $('#notes').html('');
        $.ajax({
            type: 'GET',
            url: `/api/articles/${id}`
        }).then((article) => {
            $('.modal-title').text(article[0].title);
            article[0].notes.forEach((note) => appendNote(note));
            $('#modal-loader').hide();
            $('.modal-title').show();
            $('.modal-body').show();
        })
    });

    const appendNote = (note) => {        
        const noteTemplate = $(`
        <div class="note card">
            <div class="card-body">
                ${note.text}
            </div>
            <button type="button" class="btn btn-secondary delete-note">
                Delete note
            </button>
        </div>
        `)
        noteTemplate.data({ id: note._id });
        $('#notes').append(noteTemplate);
    }

    const animateButton = ($button) => {
        $button.css({ 'background-color': '#DB3444' });
        $button.text('Deleting!');
        $button.attr({ disabled: '' });
    };
});