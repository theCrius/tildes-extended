/* globals $ */
const clog = console.log.bind(console);

// CORS ANYWHERE pass-through
$.ajaxPrefilter(function(options) {
    if (options.crossDomain && $.support.cors) {
        options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
    }
});

const defaultSettings = {
  linkNewTab: {
    enabled: true,
    types: ['text_submissions_links', 'link_submissions', 'comment_links']
  },
  jumpToNewComment: {
    enabled: true
  },
  customStyle: {
    enabled: false,
    url: ''
  }
};

function loadOptions() {
  chrome.storage.local.get({
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
    // Load Custom Styles
    $('#custom_styles_enabled').prop("checked", config.tildesExtendedSettings.customStyle.enabled);
    $('#custom_styles_url').val(config.tildesExtendedSettings.customStyle.url);
    if($('#custom_styles_enabled').prop("checked", config.tildesExtendedSettings.customStyle.enabled)) {
      $('#custom_styles_url').attr('disabled', false);
    }
    $('#custom_styles_enabled').change(function() {
        if ($(this).is(':checked')) {
          $('#custom_styles_url').attr('disabled', false);
        } else {
          $('#custom_styles_url').attr('disabled', true);
        }
    });
  });
}

function saveOptions() {
  $('#options_save').attr('disabled', true);
  const options = {};
  options.linkNewTab = {
    enabled: $('#link_new_tab_enabled').prop('checked'),
    types: $("input[id^='link_new_tab_type_']").filter(':checked').map((i, el) => el.name).get()
  };
  options.jumpToNewComment = {
    enabled: $('#jump_new_comment_enabled').prop('checked')
  };
  options.customStyle = {
    enabled: $('#custom_styles_enabled').prop('checked'),
    url: $('#custom_styles_url').val()
  };
  // TODO: This is a mess and should be rewritten in a better way
  if (options.customStyle.enabled && options.customStyle.url) {
    $('#options_status').removeClass();
    $('#options_status').addClass('loading');
    $('#options_status').html('Saving...');
    $.get(options.customStyle.url).then((data) => {
      options.customStyle.source = data;
      storeConfig(options);
    }).catch((err) => {
      $('#options_save').attr('disabled', false);
      $('#options_status').removeClass();
      $('#options_status').addClass('failure');
      $('#options_status').html('Something went wrong with the CSS :(');
      clog('ERROR LOADING CUSTOM STYLE:', err);
      setTimeout(function() {
        $('#options_status').removeClass();
        $('#options_status').html('');
      }, 6000);
    });
  } else {
    storeConfig(options);
  }
}

// Store in local storage
function storeConfig(options) {
  chrome.storage.local.set({
    tildesExtendedSettings: options
  }, function() {
    $('#options_save').attr('disabled', false);
    $('#options_status').removeClass();
    $('#options_status').addClass('success');
    $('#options_status').html('Options Saved!<br>Remeber to refresh Tildes.net for the changes to take effect!');
    setTimeout(function() {
      $('#options_status').removeClass();
      $('#options_status').html('');
    }, 6000);
  });
}

$('#options_save').on('click', saveOptions);
$(document).on('DOMContentLoaded', loadOptions);
