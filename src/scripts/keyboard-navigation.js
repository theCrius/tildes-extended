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
let insideState = 'topic';
let selectedTopic = 1;
let selectedSide = 1;
let selectedInsideTopic = 1;
let selectedComment = 1;

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
  } else if ($('.topic-full').length > 0) {
    navigateInsideTopic(e.keyCode);
  }
  if ($('.topic-full').length > 0 && $('.topic-full-link').length > 0) {
    insideState = 'comments';
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
  if (insideState === 'topic') {
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
      // 67 = c, switch from topic text to comments
      case 67:
        $($('.topic-full-text a')[selectedInsideTopic - 1]).removeClass('TE_highlighted');
        insideState = 'comments';
        $($('.comment-itself')[selectedComment - 1]).addClass('TE_selected');
        break;
    }
  } else {
    switch (keyCode) {
      // 38 = arrow up, moves selected comment inside topic up
      case 38:
        if (selectedComment <= 1) return;
        $($('.comment-itself')[selectedComment - 1]).removeClass('TE_selected');
        selectedComment--;
        $($('.comment-itself')[selectedComment - 1]).addClass('TE_selected');
        break;
      // 40 = arrow down, moves selected comment inside topic down
      case 40:
        if (selectedComment === $('.comment-itself').length) return;
        $($('.comment-itself')[selectedComment - 1]).removeClass('TE_selected');
        selectedComment++;
        $($('.comment-itself')[selectedComment - 1]).addClass('TE_selected');
        break;
      // 68 = d, clicks on the delete button
      case 68:
        if($('.comment-itself.TE_selected').parent('.is-comment-mine').length) {
          for (const child of $('.comment-itself.TE_selected>.post-buttons>li>a')) {
            if (child.innerText === 'Delete') child.click();
          }
        }
        break;
      // 69 = e, clicks on the edit button
      case 69:
        if($('.comment-itself.TE_selected').parent('.is-comment-mine').length) {
          for (const child of $('.comment-itself.TE_selected>.post-buttons>li>a')) {
            if (child.innerText === 'Edit') child.click();
          }
        }
        break;
      // 82 = r, clicks on the reply button
      case 82:
        for (const child of $('.comment-itself.TE_selected>.post-buttons>li>a')) {
          if (child.innerText === 'Reply') child.click();
        }
        break;
      // 86 = v, clicks on the vote button
      case 86:
        if($('.comment-itself.TE_selected').parent('.is-comment-mine').length === 0) {
          for (const child of $('.comment-itself.TE_selected>.post-buttons>li>a')) {
            if (child.innerText.startsWith('Vote')) child.click();
          }
        }
        break;
      // 84 = t, switches back to the topic
      case 84:
        // If the topic isn't a text topic (like an external link) then we shouldn't switch
        if ($('.topic-full-text').length === 0) return;
        $($('.topic-full-text a')[selectedInsideTopic - 1]).addClass('TE_highlighted');
        insideState = 'topic';
        $($('.comment-itself')[selectedComment - 1]).removeClass('TE_selected');
        break;
    }
  }
  if (insideState === 'topic') {
    $('html, body').animate({
      scrollTop: $($('.topic-full-text a')[selectedInsideTopic - 1]).offset().top - 250
    }, 150);
  } else {
    $('html, body').animate({
      scrollTop: $('.comment-itself.TE_selected').offset().top - 250
    }, 150);
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
