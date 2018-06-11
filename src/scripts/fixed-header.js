/* globals $ */
const clog = console.log.bind(console);

// chrome.storage.local.get({
//   tildesExtendedSettings: {fixedHeader: {}}
// }, function(res) {
//   // clog(res);
//   const fixedHeader_enabled = res.tildesExtendedSettings.fixedHeader.enabled;
//   const inTopic = window.location.pathname !== '/' && window.location.pathname.findIndex('/~') !== -1;
//
//   if (!fixedHeader_enabled && inTopic) {
//     scrollListener();
//   }
// });

const inTopic = (!!window.location.pathname.split('/')[2]);
const inGroup = (window.location.pathname.split('/')[1] !== '') && (!window.location.pathname.split('/')[3]);

if (inTopic || inGroup) {
  scrollListener();
}

function scrollListener() {
  $(window).on('scroll', () => {
    if ($(window).scrollTop() > 40) {
      $("#site-header").addClass('TE-sticky-header');
      $("#site-header").css('background-color', $("body").css('background-color'));
      if (!inGroup && !$("#TE_topic_title").length) {
        $("#site-header").after(`<h1 id="TE_topic_title" class="TE-topic-title">${$('h1').text()}</h1>`);
        $("#TE_topic_title").css('background-color', $("body").css('background-color'));
      }
    } else {
      $("#site-header").removeClass('TE-sticky-header');
      $("#site-header").removeAttr('style');
      $("#site-header").removeAttr('class');
      $("#TE_topic_title").remove();
    }
  });
}
