/* globals $ */

chrome.storage.local.get({
  tildesExtendedSettings: {jumpToNewComment: {}}
}, function(res) {
  // const clog = console.log.bind(console);
  // clog(res);
  const jumpToNewComment_enabled = res.tildesExtendedSettings.jumpToNewComment.enabled;

  if (jumpToNewComment_enabled) {
    // If there are new comment, show the button
    if($('.is-comment-new').length) {
        $(`
           <input id="TE_scrollToNewComments" type="button" value="Next New Comment" class="btn btn-primary fixed-bottom-right" />
         `).appendTo($("body"));
        $('#TE_scrollToNewComments').on('click', (e) => { __te_scrollToNewComment(e) });
    }
  }

  function __te_scrollToNewComment(e) {
    e.preventDefault();
    $('.is-comment-new')[0].scrollIntoView();
    // Remove the "new comment" class to update the visual feedback
    setTimeout(function() {
      $('.is-comment-new')[0].classList.remove('is-comment-new');
      // Check if there are more new comments. If not, remove the button.
      if(!$('.is-comment-new').length) {
        $('#TE_scrollToNewComments').remove();
      }
    }, 250);
  }
});
