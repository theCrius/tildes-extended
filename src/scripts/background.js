// Open the Options on install
chrome.runtime.onInstalled.addListener(function () {
  chrome.runtime.openOptionsPage();
});

// Set an onClicked listener for the extension icon that will open the Options
chrome.browserAction.onClicked.addListener(function () {
  chrome.runtime.openOptionsPage();
});
