/* globals clog, $ */

$('a').click(function() {
  if($(this).attr('href').indexOf("http") > -1) {
      $(this).attr('target', '_blank');
  }
});
