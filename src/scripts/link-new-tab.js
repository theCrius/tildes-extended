/* globals $, clog */

const linkNewTab_enabled = window.tildeExtended.settings.linkNewTab.enabled;
const linkNewTab_type = window.tildeExtended.settings.linkNewTab.type;

clog('linkNewTab', linkNewTab_enabled);

/**
 * Everytime the user click on a link, it checks how to behave given the context and the settings
 */
$('a').click(function() {
  if (linkNewTab_enabled) {
    if(linkNewTab_type.findIndex(t => t === 'text_submissions') !== -1) {
      if($(this).parent().hasClass('topic-title') && $(this).attr('href').indexOf("http") === -1) {
          $(this).attr('target', '_blank');
      }
    }
    if(linkNewTab_type.findIndex(t => t === 'text_submissions_links') !== -1) {
      if($(this).parent().parent().hasClass('topic-text-excerpt') || $(this).parent().parent().hasClass('topic-full-text')) {
          $(this).attr('target', '_blank');
      }
    }
    if(linkNewTab_type.findIndex(t => t === 'link_submissions') !== -1) {
      if($(this).parent().hasClass('topic-title') && $(this).attr('href').indexOf("http") !== -1) {
          $(this).attr('target', '_blank');
      }
    }
    if(linkNewTab_type.findIndex(t => t === 'comment_links') !== -1) {
      if($(this).parent().parent().hasClass('comment-text')) {
          $(this).attr('target', '_blank');
      }
    }
    if(linkNewTab_type.findIndex(t => t === 'users') !== -1) {
      if($(this).hasClass('link-user')) {
          $(this).attr('target', '_blank');
      }
    }
  }
});
