// Open options on install
chrome.runtime.onInstalled.addListener(function () {
  chrome.runtime.openOptionsPage();
});

//Set a listener for the click on the extension icon that will open the Options
chrome.browserAction.onClicked.addListener(function () {
  chrome.runtime.openOptionsPage();
});
