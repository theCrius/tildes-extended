/* globals $ */

// const clog = console.log.bind(console);

const modalTemplate = 
  `<div id="TE_keyboardNavModal">
    <div class="modalInner">
      <h1>Keyboard Navigation</h1>
      <input type="text" placeholder="goto"/>
    </div>
  </div>`;

$(document).ready(createModal);
$(document).on('keyup', documentKeyUp);

function createModal() {
  $('body').append(modalTemplate);
  $('#TE_keyboardNavModal').on('click', modalOuterClick);
}

function documentKeyUp(e) {
  if (e.altKey && e.shiftKey && e.keyCode === 38) {
    $('#TE_keyboardNavModal').css('display', 'block');
  } else if (e.altKey && e.shiftKey && e.keyCode === 40) {
    $('#TE_keyboardNavModal').css('display', 'none');
  }
}

function modalOuterClick(e) {
  if ($(e.originalEvent.target).is($('#TE_keyboardNavModal'))) {
    $('#TE_keyboardNavModal').css('display', 'none');    
  }
}
