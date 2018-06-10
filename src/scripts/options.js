/* globals $ */
const clog = console.log.bind(console);

// CORS ANYWHERE pass-through
$.ajaxPrefilter(function(options) {
    if (options.crossDomain && $.support.cors) {
        options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
    }
});

const defaultSettings = {
  initialSetup: true,
  linkNewTab: {
    enabled: true,
    types: ['text_submissions_links', 'link_submissions', 'comment_links']
  },
  jumpToNewComment: {
    enabled: true
  },
  customStyles: {
    enabled: false,
    urls: [],
    externalCss: '',
    customCss: '',
    source: null
  },
  markdownPreview: {
    enabled: true
  },
  usersLabel: {
    enabled: true
  },
  stickyHeader: {
    enabled: true
  }
};

function loadOptions() {
  if (navigator.userAgent.indexOf("Firefox") !== -1) {
    $("#custom_styles_url_div")
      .append("<br><span>Note: Firefox will not allow this to be loaded unless you open <code>about:config</code>, search the flag <code>security.csp.enable</code> and disable it.</span>")
  } else {
    $("#custom_styles_url_div")
      .append("<br><span>Please be aware that we're not checking the CSS validity</span>")
  }

  chrome.storage.local.get({
    tildesExtendedSettings: defaultSettings
  }, function(config) {
    if(config.tildesExtendedSettings.initialSetup) {
      delete config.tildesExtendedSettings.initialSetup;
      chrome.storage.local.set({ tildesExtendedSettings: config.tildesExtendedSettings}, () => {
        clog('Initial Config stored:', config.tildesExtendedSettings);
      });
    }
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
    $('#custom_styles_enabled').prop("checked", config.tildesExtendedSettings.customStyles.enabled);
    $('#custom_styles_urls').val(config.tildesExtendedSettings.customStyles.urls.join(','));
    $('#custom_styles_textarea').val(config.tildesExtendedSettings.customStyles.customCss);
    if($('#custom_styles_enabled').prop("checked", config.tildesExtendedSettings.customStyles.enabled)) {
      $('#custom_styles_urls').attr('disabled', false);
      $('#custom_styles_textarea').attr('disabled', false);
      
      $('#custom_styles_urls').val('');
      $('#custom_styles_textarea').val('');
    }
    $('#custom_styles_enabled').change(function() {
        if ($(this).is(':checked')) {
          $('#custom_styles_urls').attr('disabled', false);
          $('#custom_styles_textarea').attr('disabled', false);
        } else {
          $('#custom_styles_urls').attr('disabled', true);
          $('#custom_styles_textarea').attr('disabled', true);
          
          $('#custom_styles_urls').val('');
          $('#custom_styles_textarea').val('');
        }
    });
    // Markdown Preview
    $('#markdown_preview_enabled').prop("checked", config.tildesExtendedSettings.markdownPreview.enabled);
    // Users Label
    $('#users_label_enabled').prop("checked", config.tildesExtendedSettings.usersLabel.enabled);
    // Sticky Header
    $('#sticky_header_enabled').prop("checked", config.tildesExtendedSettings.stickyHeader.enabled);
  });
}

function saveOptions() {
  $('#options_save').attr('disabled', true);

  var stylesheetUrls =  $('#custom_styles_urls').val().split(',').map(function(url) {
    return url.trim();
  });

  const options = {};
  options.linkNewTab = {
    enabled: $('#link_new_tab_enabled').prop('checked'),
    types: $("input[id^='link_new_tab_type_']").filter(':checked').map((i, el) => el.name).get()
  };
  options.jumpToNewComment = {
    enabled: $('#jump_new_comment_enabled').prop('checked')
  };
  options.customStyles = {
    enabled: $('#custom_styles_enabled').prop('checked'),
    localCss: $('#custom_styles_local').val(),
    urls: stylesheetUrls
  };
  options.markdownPreview = {
    enabled: $('#markdown_preview_enabled').prop("checked")
  };
  options.usersLabel = {
    enabled: $('#users_label_enabled').prop("checked")
  };
  // TODO: This could still be cleaned up more
  if (options.customStyles.enabled) {
    updateStatus('Saving...', 'loading');

    if (options.customStyles.urls !== undefined && options.customStyles.urls.length != 0) {
      downloadStylesheets(options.customStyles.urls)
    }

    // Combine external and local CSS into single source sheet
    options.customStyles.source = options.customStyles.externalCss + "\n" + options.customStyles.localCss;
  } else {
    options.customStyles.source = null;
  }

  storeConfig(options);
}

function downloadStylesheets(stylsheetUrls) {
  $.when.apply($, stylesheetUrls.map(function(url) {
      return $.ajax(url);
  })).done(function() {
      var stylesheets = [];
      
      for (var i = 0; i < arguments.length; i++) {
        stylesheets.push(arguments[i][0]);
      }

      options.customStyles.localCss = stylesheets.join("\r\n");
  }).fail(function(error) {
    $('#options_save').attr('disabled', false);
    updateStatus('Error downloading stylesheets, please check the URLs and try again. Multiple URLs should be separated by commas.', 'failure', 3000);
    clog('ERROR LOADING CUSTOM STYLE:', err.statusText);
  });
}

function updateStatus(message, cssClass, removeAfter = false) {
  $('#options_status').removeClass();
  $('#options_status').addClass(cssClass);
  $('#options_status').html(message);

  if(removeAfter) {
    setTimeout(function() {
      $('#options_status').removeClass();
      $('#options_status').html('');
    }, removeAfter);
  }
}

// Store in local storage
function storeConfig(options) {
  chrome.storage.local.set({
    tildesExtendedSettings: options
  }, function() {
    clog('Config updated:', options);

    $('#options_save').attr('disabled', false);
    updateStatus('Options Saved!<br>Remember to refresh Tildes.net for the changes to take effect!', 'success', 3000)
  });
}

$('#options_save').on('click', saveOptions);
$(document).on('DOMContentLoaded', loadOptions);
