/* globals $ */

// const clog = console.log.bind(console);

const modalTemplate = 
  `<div id="TE_keyboardNavModal">
    <div class="modalInner">
      <h1>Keyboard Navigation</h1>
      <input type="text" placeholder="goto"/>
    </div>
  </div>`;

$(document).ready(documentReady);
$(document).on('keyup', documentKeyUp);
$(document).on('keydown', preventMovement);

function documentReady() {
  $('body').append(modalTemplate);
  $('#TE_keyboardNavModal').on('click', modalOuterClick);
  $(`.topic-listing>li:nth-child(${selectedTopic})`).addClass('TE_selectedTopic');
  $('html, body').animate({
    scrollTop: $(`.topic-listing>li:nth-child(${selectedTopic})`).offset().top - 250
  }, 150);
}

let selectedTopic = 1

function documentKeyUp(e) {
  if (e.altKey && e.shiftKey && e.keyCode === 38) {
    $('#TE_keyboardNavModal').css('display', 'block');
    return;
  } else if (e.altKey && e.shiftKey && e.keyCode === 40) {
    $('#TE_keyboardNavModal').css('display', 'none');
    return;
  }
  if ($(`.topic-listing>li:nth-child(${selectedTopic})`).length > 0) {
    navigateTopicListing(e.keyCode);
  }
}

function navigateTopicListing(keyCode) {
  switch(keyCode) {
    // 38 = arrow up, moves topic selection up
    case 38:
      if (selectedTopic === 1) return;
      $(`.topic-listing>li:nth-child(${selectedTopic})`).removeClass('TE_selectedTopic');
      selectedTopic--;
      $(`.topic-listing>li:nth-child(${selectedTopic})`).addClass('TE_selectedTopic');
      break;
    // 40 = arrow down, moves topic selection down
    case 40:
      if (selectedTopic === $('.topic-listing>li').length) return;
      $(`.topic-listing>li:nth-child(${selectedTopic})`).removeClass('TE_selectedTopic');
      selectedTopic++;
      $(`.topic-listing>li:nth-child(${selectedTopic})`).addClass('TE_selectedTopic');
      break;
    // 13 = enter/return, enters the topic via title
    case 13:
      window.location.href = $(`.topic-listing>li:nth-child(${selectedTopic}) .topic-title>a`).attr('href');
      break;
    // 86 = v, clicks vote on the topic
    case 86:
      $(`.topic-listing>li:nth-child(${selectedTopic}) button.topic-voting`).click();
      break;
    // 67 = c, enters the topic via comments
    case 67:
      window.location.href = $(`.topic-listing>li:nth-child(${selectedTopic}) .topic-info-comments>a`).attr('href');
      break;
    // 78 = n, goes to the next page
    case 78:
      if ($('#next-page').length)
        window.location.href = $('#next-page').attr('href');
      break;
    // 80 = p, goes to the prev page
    case 80:
      if ($('#prev-page').length)
        window.location.href = $('#prev-page').attr('href');
      break;
    // 35 = end, go to the last topic
    case 35:
      $(`.topic-listing>li:nth-child(${selectedTopic})`).removeClass('TE_selectedTopic');
      selectedTopic = $('.topic-listing>li').length;
      $(`.topic-listing>li:nth-child(${selectedTopic})`).addClass('TE_selectedTopic');
      break;
    // 36 = home, go to the first topic
    case 36:
      $(`.topic-listing>li:nth-child(${selectedTopic})`).removeClass('TE_selectedTopic');
      selectedTopic = 1;
      $(`.topic-listing>li:nth-child(${selectedTopic})`).addClass('TE_selectedTopic');
      break;
  }
  if ([38, 40].indexOf(keyCode) > -1) {
    $('html, body').animate({
      scrollTop: $(`.topic-listing>li:nth-child(${selectedTopic})`).offset().top - 250
    }, 150);
  }
}

function preventMovement(e) {
  if ([32,37,38,39,40].indexOf(e.keyCode) > -1) {
    e.preventDefault();
  }
}

function modalOuterClick(e) {
  if ($(e.originalEvent.target).is($('#TE_keyboardNavModal'))) {
    $('#TE_keyboardNavModal').css('display', 'none');    
  }
}
