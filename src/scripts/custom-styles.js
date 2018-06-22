/* globals $ */
const clog = console.log.bind(console);

// CORS ANYWHERE pass-through
$.ajaxPrefilter(function(options) {
  if (options.crossDomain && $.support.cors) {
    options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
  }
});

chrome.storage.sync.get({
  tildesExtendedSettings: { customStyles: {} }
}, (res) => {
  // clog(res);
  const customStyles_enabled = res.tildesExtendedSettings.customStyles.enabled;

  if (customStyles_enabled) {
    let customStyles_source = res.tildesExtendedSettings.customStyles.source;
    pullUpdatedCss(res.tildesExtendedSettings.customStyles)
      .then(updatedSource => {
        if (updatedSource !== false) {
          res.tildesExtendedSettings.customStyles.source = updatedSource;
          res.tildesExtendedSettings.customStyles.lastPull = new Date().getTime();
          chrome.storage.sync.set({
            tildesExtendedSettings: res.tildesExtendedSettings
          }, () => {
            clog('[ DEBUG ] Updated External CSS Sources');
            customStyles_source = updatedSource;
            applyStyles(customStyles_source);
          });
        } else {
          applyStyles(customStyles_source);
        }
      })
      .catch(err => {
        // TODO: Should notify with a popup?
        clog('[ ERROR ] Cannot update remote custom styles', err);
        applyStyles(customStyles_source);
      });

  } else {
    // No idea why atm, but even with the feature disabled, the style injected survive a reload. This force it to be removed.
    if ($('#customStylesheet').length) {
      $('#customStylesheet').remove();
    }
  }
});

// Simply clear the STYLE tag if it already exists and reapply the external CSS source
function applyStyles(cssSource) {
  $('#customStylesheet').remove();
  if (cssSource) {
    $('<style type="text/css" id="customStylesheet">' + cssSource + '</style>').appendTo('head');
  }
}

// If the last time we pulled the source is more than 1 day, we do it again to update it
function pullUpdatedCss(customStyles) {
  return new Promise((resolve, reject) => {
    // Check if there are URL to pull down
    if(customStyles.urls.length && customStyles.urls[0].length) {
      const oneDayInMs = 86400000;
      // Check if a day has passed
      if (new Date().getTime() > customStyles.lastPull + oneDayInMs) {
        const fetchList = customStyles.urls.map(url => $.ajax(url));
        Promise.all(fetchList)
          .then(data => {
            let externalSources = data.reduce(css => '\r\n\r\n' + css, '') + '\r\n\r\n' +customStyles.localCss;
            resolve(externalSources);
          })
          .catch(err => {
            reject(err);
          });
      } else {
        // Do not trigger an update for the last time we pulled the source
        resolve(false);
      }
    } else {
      resolve(customStyles.source);
    }
  });
}
