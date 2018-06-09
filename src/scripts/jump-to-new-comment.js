/* globals $ */

chrome.storage.local.get({
  tildesExtendedSettings: {jumpToNewComment: {}}
}, function(res) {
  // const clog = console.log.bind(console);
  // clog(res);
  const jumpToNewComment_enabled = res.tildesExtendedSettings.jumpToNewComment.enabled;
  const inTopic = window.location.pathname !== '/';

  if (jumpToNewComment_enabled && inTopic) {
    // If there are new comment, show the button
    if($(".is-comment-new").length) {
        $(`<input id="TE_scrollToNewComments"
            type="button"
            class="btn btn-primary fixed-bottom-right">
        `).appendTo($("body"));
    }

    if($(".is-comment-new").length) {
      $("#TE_scrollToNewComments").val('Next New Comment');
      $('#TE_scrollToNewComments').on('click', () => { __te_scrollToNewComment() });
    } else {
      $("#TE_scrollToNewComments").val('Back to Top');
      $('#TE_scrollToNewComments').on('click', () => { __te_scrollToTop() });
    }
  }
});

function __te_scrollToNewComment() {
  $(".is-comment-new")[0].scrollIntoView();
  // Remove the "new comment" class to update the visual feedback
  setTimeout(function() {
    $(".is-comment-new")[0].classList.remove('is-comment-new');
    // Check if there are more new comments. If not, remove the button.
    if(!$(".is-comment-new").length) {
      $("#TE_scrollToNewComments").val('Back to Top');
      $('#TE_scrollToNewComments').off('click');
      $('#TE_scrollToNewComments').on('click', () => { __te_scrollToTop() });
    }
  }, 250);
}

function __te_scrollToTop() {
  window.scrollTo(0, 0);
}
