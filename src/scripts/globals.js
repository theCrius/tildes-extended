// shortcut to console.log, used in development process and debug
const clog = console.log.bind(console);

// Chrome like to use its name for everything, I don't
const BrowserStorage = (function(){
  if (chrome.storage) {
    return chrome.storage;
  } else {
    return browser.storage;
  }
})();

// Global variable for the extension
window.tildeExtended = {};

// Load up extension's config
chrome.runtime.sendMessage({settings: 'getSettings'}, function(settings) {
  window.tildeExtended.settings = settings;
});
