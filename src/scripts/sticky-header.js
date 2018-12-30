/* globals $ */
// const clog = console.log.bind(console);

// Can find ID of a topic
const inTopic = (!!window.location.pathname.split('/')[2]);
// Can find name of a group but not an ID of a topic
const inGroup = (window.location.pathname.split('/')[1] !== '') && (!window.location.pathname.split('/')[2]);

chrome.storage.sync.get({
  tildesExtendedSettings: { fixedHeader: {} }
}, function(res) {
  // clog(res);
  if(res.tildesExtendedSettings.stickyHeader.enabled) {
    scrollListener();
  }
});

function scrollListener() {
  $(window).on('scroll', () => {
    if(inTopic) {
      const $opMessage = $('.topic-full-text').length ? $('.topic-full-text') : $('.topic-full-link');
      if ($(window).scrollTop() > $opMessage.outerHeight()) {
        $('#site-header').addClass('TE-sticky-header');
        $('#site-header').css('background-color', $('body').css('background-color'));
        let $appendAfterMe = $('.site-header-context').length ? $('.site-header-context') : $('.site-header-logo');
        if (!$('#TE_topic_title').length) {
          $appendAfterMe.after(`<h3 id="TE_topic_title" class="TE-topic-title">${$('.topic-full>header>h1').text()}</h3>`);
          $('.logged-in-user-info').addClass('TE-user-info');
          $('main').css('padding-top', $('header').outerHeight());
        }
      } else {
        $('#site-header').removeClass('TE-sticky-header');
        $('#site-header').removeAttr('style');
        $('.logged-in-user-info').removeClass('TE-user-info');
        $('#TE_topic_title').remove();
        $('main').removeAttr('style');
      }
    } else if (inGroup) {
      if ($(window).scrollTop() > 50) {
        $('#site-header').addClass('TE-sticky-header');
        $('#site-header').css('background-color', $('body').css('background-color'));
        $('.logged-in-user-info').addClass('TE-user-info');
      } else {
        $('#site-header').removeClass('TE-sticky-header');
        $('#site-header').removeAttr('style');
        $('.logged-in-user-info').removeClass('TE-user-info');
      }
    }
  });
}
