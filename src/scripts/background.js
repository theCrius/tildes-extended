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

//Set a listener for the click on the extension icon that will open the Settings
chrome.browserAction.onClicked.addListener(function () {
    chrome.tabs.create({ url: chrome.runtime.getURL("settings.html") });
});

// Wait for request of settings
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.settings == "getSettings")
      getSettings().then(res => { sendResponse({settings: res}) });
  }
);

// Determine settings
function getSettings() {
  return new Promise ((resolve, reject) => {
    BrowserStorage.local.get("tildesExtendedSettings", function(item) {
      if (Object.keys(item).length > 0) {
        // Load user config
        const settings = JSON.parse(item);
        resolve(settings);
      } else {
        // Load Default
        resolve ({
          linkNewTab: {
            enabled: true,
            type: ['text_submissions_links', 'link_submissions', 'comment_links']
          },
          jumpToNewComment: {
            enabled: true
          }
        });
      }
    });
  });
}
