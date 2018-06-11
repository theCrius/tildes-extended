/* globals $ */
// const clog = console.log.bind(console);

//Can find Id of a topic
const inTopic = (!!window.location.pathname.split('/')[2]);
// Can find name of a group but not an Id of a topic
const inGroup = (window.location.pathname.split('/')[1] !== '') && (!window.location.pathname.split('/')[2]);

chrome.storage.local.get({
  tildesExtendedSettings: {fixedHeader: {}}
}, function(res) {
  // clog(res);
  if(res.tildesExtendedSettings.stickyHeader.enabled) {
    scrollListener();
  }
});

function scrollListener() {
  $(window).on('scroll', () => {
    if(inTopic) {
      const $opMessage = $(".topic-full-text").length ? $(".topic-full-text") : $(".topic-full-link");
      if ($(window).scrollTop() > $opMessage.outerHeight()) {
        $("#site-header").addClass('TE-sticky-header');
        $("#site-header").css('background-color', $("body").css('background-color'));
        if (!$("#TE_topic_title").length) {
          $("#site-header").after(`<h1 id="TE_topic_title" class="TE-topic-title">${$('h1').text()}</h1>`);
          $("#TE_topic_title").css('background-color', $("body").css('background-color'));
          $("main").addClass('TE-sticky-header-main');
        }
      } else {
        $("#site-header").removeClass('TE-sticky-header');
        $("#site-header").removeAttr('style');
        $("#site-header").removeAttr('class');
        $("main").removeClass('TE-sticky-header-main');
        $("#TE_topic_title").remove();
      }
    } else if (inGroup) {
      if ($(window).scrollTop() > 50) {
        $("#site-header").addClass('TE-sticky-header');
        $("#site-header").css('background-color', $("body").css('background-color'));
      } else {
        $("#site-header").removeClass('TE-sticky-header');
        $("#site-header").removeAttr('style');
        $("#site-header").removeAttr('class');
      }
    }
  });
}
