/* globals $ */
// const clog = console.log.bind(console);

chrome.storage.sync.get({
  tildesExtendedSettings: { customStyles: {} }
}, function (res) {
  // clog(res);
  const customStyles_enabled = res.tildesExtendedSettings.customStyles.enabled;

  if (customStyles_enabled) {
    $('#customStylesheet').remove();
    const customStyles_source = res.tildesExtendedSettings.customStyles.source;
    if (customStyles_source) {
      $('<style type="text/css" id="customStylesheet">' + customStyles_source + '</style>').appendTo('head');
    }
  } else {
    // No idea why atm, but even with the feature disabled, the style injected survive a reload. This force it to be removed.
    if ($('#customStylesheet').length) {
      $('#customStylesheet').remove();
    }
  }
});
