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
  if ($('.topic-listing>li').length) {
    $(`.topic-listing>li:nth-child(${selectedTopic})`).addClass('TE_selected');
    $('html, body').animate({
      scrollTop: $(`.topic-listing>li:nth-child(${selectedTopic})`).offset().top - 250
    }, 150);
  }
  if ($('.topic-full-text a').length) {
    $($('.topic-full-text a')[selectedInsideTopic - 1]).addClass('TE_highlighted');
  }
}

let listingState = 'topic';
let selectedTopic = 1;
let selectedSide = 1;
let selectedInsideTopic = 1;

function documentKeyUp(e) {
  if (document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'INPUT') return;
  if (e.altKey && e.shiftKey && e.keyCode === 38) {
    $('#TE_keyboardNavModal').css('display', 'block');
    return;
  } else if (e.altKey && e.shiftKey && e.keyCode === 40) {
    $('#TE_keyboardNavModal').css('display', 'none');
    return;
  }
  if ($(`.topic-listing>li:nth-child(${selectedTopic})`).length > 0) {
    navigateTopicListing(e.keyCode);
  } else if ($('.topic-full-text a').length > 0) {
    navigateInsideTopic(e.keyCode);
  }
}

function navigateTopicListing(keyCode) {
  // Check whether listing state is "topic" or "sidebar"
  if (listingState === 'topic') {
    // Selected topic navigation
    switch(keyCode) {
      // 38 = arrow up, moves topic selection up
      case 38:
        if (selectedTopic === 1) return;
        $(`.topic-listing>li:nth-child(${selectedTopic})`).removeClass('TE_selected');
        selectedTopic--;
        $(`.topic-listing>li:nth-child(${selectedTopic})`).addClass('TE_selected');
        break;
      // 40 = arrow down, moves topic selection down
      case 40:
        if (selectedTopic === $('.topic-listing>li').length) return;
        $(`.topic-listing>li:nth-child(${selectedTopic})`).removeClass('TE_selected');
        selectedTopic++;
        $(`.topic-listing>li:nth-child(${selectedTopic})`).addClass('TE_selected');
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
        $(`.topic-listing>li:nth-child(${selectedTopic})`).removeClass('TE_selected');
        selectedTopic = $('.topic-listing>li').length;
        $(`.topic-listing>li:nth-child(${selectedTopic})`).addClass('TE_selected');
        break;
      // 36 = home, go to the first topic
      case 36:
        $(`.topic-listing>li:nth-child(${selectedTopic})`).removeClass('TE_selected');
        selectedTopic = 1;
        $(`.topic-listing>li:nth-child(${selectedTopic})`).addClass('TE_selected');
        break;
      // 83 = s, switch to sidebar
      case 83:
        listingState = 'sidebar';
        $(`.topic-listing>li:nth-child(${selectedTopic})`).removeClass('TE_selected');
        $(`#sidebar .nav>.nav-item:nth-child(${selectedSide})`).addClass('TE_selected');
        break;
    }
  } else {
    // Sidebar navigation
    switch(keyCode) {
      // 83 = s, switch to topics
      case 83:
        listingState = 'topic';
        $(`#sidebar .nav>.nav-item:nth-child(${selectedSide})`).removeClass('TE_selected');
        $(`.topic-listing>li:nth-child(${selectedTopic})`).addClass('TE_selected');
        break;
      // 38 = arrow up, moves side selection up
      case 38:
        if (selectedSide === 1) return;
        $(`#sidebar .nav>.nav-item:nth-child(${selectedSide})`).removeClass('TE_selected');
        selectedSide--;
        $(`#sidebar .nav>.nav-item:nth-child(${selectedSide})`).addClass('TE_selected');
        break;
      // 40 = arrow down, moves side selection down
      case 40:
        if (selectedSide === $('#sidebar .nav>.nav-item').length) return;
        $(`#sidebar .nav>.nav-item:nth-child(${selectedSide})`).removeClass('TE_selected');
        selectedSide++;
        $(`#sidebar .nav>.nav-item:nth-child(${selectedSide})`).addClass('TE_selected');
        break;
      // 13 = enter/return, goes to selected group
      case 13:
        window.location.href = $(`#sidebar .nav>.nav-item:nth-child(${selectedSide})>a`).attr('href');
        break;
      // 66 = b, browse list of groups
      case 66:
        window.location.href = $('#sidebar>a').attr('href');
        break;
    }
  }
  if ([38, 40].indexOf(keyCode) > -1) {
    if (listingState === 'topic') {
      $('html, body').animate({
        scrollTop: $(`.topic-listing>li:nth-child(${selectedTopic})`).offset().top - 250
      }, 150);
    } else {
      $('html, body').animate({
        scrollTop: $(`#sidebar .nav>.nav-item:nth-child(${selectedSide})`).offset().top - 250
      }, 150);
    }
  }
}

function navigateInsideTopic(keyCode) {
  switch(keyCode) {
    // 38 = arrow up, moves selected link inside topic up
    case 38:
      if (selectedInsideTopic <= 1) return;
      $($('.topic-full-text a')[selectedInsideTopic - 1]).removeClass('TE_highlighted');
      selectedInsideTopic--;
      $($('.topic-full-text a')[selectedInsideTopic - 1]).addClass('TE_highlighted');
      break;
    // 40 = arrow down, moves selected link inside topic down
    case 40:
      if ($('.topic-full-text a').length === 1) {
        $($('.topic-full-text a')[selectedInsideTopic - 1]).removeClass('TE_highlighted');
        $($('.topic-full-text a')[selectedInsideTopic - 1]).addClass('TE_highlighted');
        return;
      }
      if (selectedInsideTopic >= $('.topic-full-text a').length) return;
      $($('.topic-full-text a')[selectedInsideTopic - 1]).removeClass('TE_highlighted');
      selectedInsideTopic++;
      $($('.topic-full-text a')[selectedInsideTopic - 1]).addClass('TE_highlighted');
      break;
    // 13 = enter/return, goes to whatever link is selected inside the topic text
    case 13:
      window.location.href = $($('.topic-full-text a')[selectedInsideTopic - 1]).attr('href');
      break;
  }
}

function preventMovement(e) {
  if ([32,37,38,39,40].indexOf(e.keyCode) > -1) {
    if (document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'INPUT') return;
    e.preventDefault();
  }
}

function modalOuterClick(e) {
  if ($(e.originalEvent.target).is($('#TE_keyboardNavModal'))) {
    $('#TE_keyboardNavModal').css('display', 'none');    
  }
}
