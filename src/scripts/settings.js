/* globals $, BrowserStorage, clog */

$("#settings_form").on('submit', function(e) { __te_saveSettings(e) })

function __te_saveSettings(e) {
  e.preventDefault();
  BrowserStorage.local.set({
    tildesExtendedSettings: JSON.stringify(window.tildeExtended.settings)
  });
}

// Load up extension's config
chrome.runtime.sendMessage({settings: 'getSettings'}, function(settings) {
  clog(settings);
});
