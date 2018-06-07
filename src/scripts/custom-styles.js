/* globals $ */

chrome.storage.local.get({
  tildesExtendedSettings: {customStyle: {}}
}, function(res) {
  // const clog = console.log.bind(console);
  // clog(res);
  const customStyles_enabled = res.tildesExtendedSettings.customStyle.enabled;

  if(customStyles_enabled) {
    const customStyles_source = res.tildesExtendedSettings.customStyle.source;
    // Check if it is already loaded
    if (!$("#customStylesheet").length) {
      $('<style type="text/css" id="customStylesheet">'+ customStyles_source +'</style>').appendTo("head");
    }
  }
});
