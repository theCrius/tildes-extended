/* globals clog, $ */

if($('.is-comment-new').length) {
    $(`
       <input id="TE_scrollToNewComments" type="button" value="Next New Comment" class="btn btn-primary fixed-bottom-right" />
     `).appendTo($("body"));
    $('#TE_scrollToNewComments').on('click', function() { __te_scrollToNewComment() });
}

function __te_scrollToNewComment() {
    if($('.is-comment-new').length) {
        $('.is-comment-new')[0].scrollIntoView();
        setTimeout(function() {
            $('.is-comment-new')[0].classList.remove('is-comment-new');
            if(!$('.is-comment-new').length) {
                $('#TE_scrollToNewComments').remove();
            }
        }, 250);
    }
}
