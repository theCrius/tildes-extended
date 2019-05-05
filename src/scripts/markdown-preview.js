/* globals $, marked */

chrome.storage.sync.get({
  tildesExtendedSettings: { markdownPreview: {} }
}, function(res) {
  // const clog = console.log.bind(console);
  // clog(res);
  const markdownPreview_enabled = res.tildesExtendedSettings.markdownPreview.enabled;

  if(markdownPreview_enabled) {
    // Originally written by avinassh: https://github.com/avinassh
    $('body').keydown(debounce(function(e) {
      // clog($(e.target).val());
      const $targetArea = $(e.target);
      const $targetParent = $targetArea.parent();
      if($targetArea[0].name === 'markdown') {
        if (!$targetArea.parent().has('#TE_markdown-preview-div').length) {
          $targetArea.parent().append(`
          <div id="TE_markdown-preview-div">
            <hr/>
            <div>
              <h2>Live preview</h2>
              <div id="TE_markdown-preview"></div>
            </div>
          </div>`);
        }

        if (!$targetArea.val().length) {
          $targetParent.find('#TE_markdown-preview-div').hide();
        } else {
          $targetParent.find('#TE_markdown-preview-div').show();
          $targetParent.find('#TE_markdown-preview').html(marked($targetArea.val()));
        }
      }
    }, 250));
  }
});

// http://davidwalsh.name/javascript-debounce-function
function debounce(func, wait, immediate) {
  let timeout;
  return function() {
    let context = this, args = arguments;
    let later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}
