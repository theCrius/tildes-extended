/* globals $ */
const clog = console.log.bind(console);

chrome.storage.sync.get({
  tildesExtendedSettings: { customStyles: {} }
}, (res) => {
  // clog(res);
  const customStyles_enabled = res.tildesExtendedSettings.customStyles.enabled;

  if (customStyles_enabled) {

    let customStyles_source = res.tildesExtendedSettings.customStyles.source;
    applyStyles(customStyles_source);

    updatedCssSource(res.tildesExtendedSettings.customStyles)
      .then(updatedCustomStyle => {
        if (updatedCustomStyle !== false) {
          res.tildesExtendedSettings.customStyles = updatedCustomStyle;
          chrome.storage.sync.set({
            tildesExtendedSettings: res.tildesExtendedSettings
          }, () => {
            clog('[ DEBUG ] Updated External CSS Sources');
            customStyles_source = updatedCustomStyle.source;
            applyStyles(customStyles_source);
          });
        }
      })
      .catch(err => {
        // TODO: Should notify with a popup?
        clog('[ ERROR ] Cannot update remote custom styles', err);
      });

  } else {
    // No idea why atm, but even with the feature disabled, the style injected survive a reload. This force it to be removed.
    $('#customStylesheet').remove();
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
function updatedCssSource(customStyles) {
  return new Promise((resolve, reject) => {
    // Check if there are URL to pull down
    if(customStyles.urls.length && customStyles.urls[0].length) {
      const oneDayInMs = 86400000;
      // Check if a day has passed (today > last time pulled +24h)
      if (new Date().getTime() > customStyles.lastPull + oneDayInMs) {
        const fetchList = customStyles.urls.map(url => fetch('https://cors-anywhere.herokuapp.com/' + url));
        Promise.all(fetchList)
          .then(response => {
            // clog('[ DEBUG ] Response fetch.all()', response);
            const fetchAll = response.filter(res => res.status >= 400);
            if(fetchAll.length) {
              clog('[ ERROR ] fetchAll Response', response);
              reject(`(${fetchAll[0].status}) ${fetchAll[0].statusText}`);
            } else {
              Promise.all(response.map(res => res.text()))
                .then(cssArray => {
                  // clog('[ DEBUG ] Array of CSS', cssArray);
                  customStyles.lastPull = new Date().getTime();
                  customStyles.source = cssArray.join('\r\n\r\n') +'\r\n\r\n'+ customStyles.localCss;
                  resolve(customStyles);
                })
                .catch(err => {
                  clog('[ ERROR ] Reading Responses Body:', err);
                  reject(`(${err.status}) ${err.statusText}`);
                });
            }
          });
      } else {
        resolve(false);
      }
    } else {
      resolve(false);
    }
  });
}
