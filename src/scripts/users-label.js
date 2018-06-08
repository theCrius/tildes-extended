/* globals $ */

chrome.storage.local.get({
  tildesExtendedSettings: {usersLabel: {}}
}, function(res) {
  // const clog = console.log.bind(console);
  // clog(res);
  const usersLabel_enabled = res.tildesExtendedSettings.usersLabel.enabled;

  if (usersLabel_enabled) {
    //TODO: Get all links with class "link-user"
    // TODO: For every one, get its parent element
    // TODO: IF a label exists in local storage THEN Append <span class="user-label bg-forestgreen">LABEL</span>
  }
});
