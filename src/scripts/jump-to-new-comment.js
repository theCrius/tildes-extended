/* globals $ */
// const clog = console.log.bind(console);

chrome.storage.sync.get({
  tildesExtendedSettings: {jumpToNewComment: {}}
}, function(res) {
  // clog(res);
  const jumpToNewComment_enabled = res.tildesExtendedSettings.jumpToNewComment.enabled;
  const stickyHeader_enabled = res.tildesExtendedSettings.stickyHeader.enabled;
  const notInRoot = window.location.pathname !== '/';

  if (jumpToNewComment_enabled && notInRoot) {
    if(!$("#TE_scrollToNewComments").length) {
      $(`<input id="TE_scrollToNewComments"
          type="button"
          class="btn btn-primary fixed-bottom-right">
      `).appendTo($("body"));

      chooseButton(stickyHeader_enabled);
    }
  }
});

function chooseButton(stickyHeader_enabled) {
  $('#TE_scrollToNewComments').off('click');
  $("#TE_scrollToNewComments").hide();
  if($(".is-comment-new").length) {
    $("#TE_scrollToNewComments").val('Next New Comment');
    $('#TE_scrollToNewComments').on('click', (e) => { __te_scrollToNewComment(e, stickyHeader_enabled) });
    $("#TE_scrollToNewComments").show();
  } else {
    $("#TE_scrollToNewComments").val('Back to Top');
    $('#TE_scrollToNewComments').on('click', (e) => { __te_scrollToTop(e) });
    if ($(window).scrollTop() > 250){
      $("#TE_scrollToNewComments").show();
    }
    backTopListener();
  }
}

function backTopListener() {
  $(window).on('scroll', () => {
    if ($(window).scrollTop() > 250) {
      $("#TE_scrollToNewComments").show();
    } else {
      $("#TE_scrollToNewComments").hide();
    }
  });
}

function __te_scrollToNewComment(e, stickyHeader_enabled) {
  e.preventDefault();
  $("#TE_scrollToNewComments").attr('disabled', true);
  const $newComment = $(".is-comment-new").first();
  // clog('Scrolling to', $newComment.attr('id'));
  let scrollDestination = stickyHeader_enabled ? $newComment.offset().top-60 : $newComment.offset().top-10;
  $("html, body").animate({ scrollTop: scrollDestination }, 250, () => {
    // clog('Removed new from:', $newComment.attr('id'));
    $newComment.removeClass('is-comment-new');
    $("#TE_scrollToNewComments").attr('disabled', false);
    if(!$(".is-comment-new").length) {
      // clog('no more new comments:', $(".is-comment-new"));
      chooseButton();
    }
  });
}

function __te_scrollToTop(e) {
  e.preventDefault();
  $("#TE_scrollToNewComments").attr('disabled', true);
  $("html, body").animate({ scrollTop: 0 }, 500, () => {
    $("#TE_scrollToNewComments").attr('disabled', false);
    backTopListener();
  });
}
