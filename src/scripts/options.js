/* globals $ */
const clog = console.log.bind(console);

const defaultSettings = {
  linkNewTab: {
    enabled: true,
    types: ['text_submissions_links', 'link_submissions', 'comment_links']
  },
  jumpToNewComment: {
    enabled: true
  }
};

function loadOptions() {
  chrome.storage.sync.get({
    tildesExtendedSettings: defaultSettings
  }, function(config) {
    clog('Loaded Options:', config);
    // Link in New Tab
    $('#link_new_tab_enabled').prop("checked", config.tildesExtendedSettings.linkNewTab.enabled);
    $('#link_new_tab_type_text_submissions').prop("checked", config.tildesExtendedSettings.linkNewTab.types.findIndex(i => i === 'text_submissions') !== -1);
    $('#link_new_tab_type_text_submissions_links').prop("checked", config.tildesExtendedSettings.linkNewTab.types.findIndex(i => i === 'text_submissions_links') !== -1);
    $('#link_new_tab_type_link_submissions').prop("checked", config.tildesExtendedSettings.linkNewTab.types.findIndex(i => i === 'link_submissions') !== -1);
    $('#link_new_tab_type_comment_links').prop("checked", config.tildesExtendedSettings.linkNewTab.types.findIndex(i => i === 'comment_links') !== -1);
    $('#link_new_tab_type_users').prop("checked", config.tildesExtendedSettings.linkNewTab.types.findIndex(i => i === 'users') !== -1);
    // Jump to New Comment
    $('#jump_new_comment_enabled').prop("checked", config.tildesExtendedSettings.jumpToNewComment.enabled);
  });
}

function saveOptions() {
  const options = {};
  options.linkNewTab = {
    enabled: $('#link_new_tab_enabled').prop('checked'),
    types: $("input[id^='link_new_tab_type_']").filter(':checked').map((i, el) => el.name).get()
  }
  options.jumpToNewComment = {
    enabled: $('#jump_new_comment_enabled').prop('checked')
  }

  // Store in local storage
  chrome.storage.sync.set({
    tildesExtendedSettings: options
  }, function() {
    $('#options_status').addClass('success');
    $('#options_status').html('Options Saved!<br>Remeber to refresh the Tildes.net tabs for the changes to take effect!');
    setTimeout(function() {
      $('#options_status').html('');
      $('#options_status').removeClass('success');
    }, 6000);
  });
}

document.addEventListener('DOMContentLoaded', loadOptions);
document.getElementById('options_save').addEventListener('click', saveOptions);
