/* globals $, marked */

// Written by avinassh: https://github.com/avinassh

(function() {
    $('body').keydown(debounce(function(e) {
		let $targetArea = $(e.target);
		let $targetParent = $targetArea.parent()
		if ($targetParent.has('#markdown-preview-div').length == 0) {
			appendPreviewDiv($targetArea);
		}
		if ($targetArea.val().length == 0) {
			$targetParent.find('#markdown-preview-div').hide();
		} else {
			$targetParent.find('#markdown-preview').html(marked($targetArea.val()));
			$targetParent.find('#markdown-preview-div').show();
		}
	}, 250));
})();

function appendPreviewDiv($textArea) {
    let divForComments = '<div id="markdown-preview-div"><hr/><div><h2>Live preview</h2><div id="markdown-preview"></div></div></div>';
	let divForPosts = '<div id="markdown-preview-div"><div class="divider"></div><div><label class="form-label">Live preview</label><br><div id="markdown-preview"></div><br></div></div>';

    let $form = $textArea.parent();

    if ($textArea.prop('placeholder') === 'Comment text (markdown)') {
        $form.append(divForComments);
    } else {
        $form.append(divForPosts);
    }
	$('#markdown-preview-div').hide();
}

// http://davidwalsh.name/javascript-debounce-function
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}
