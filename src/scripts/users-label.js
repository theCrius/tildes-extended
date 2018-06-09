/* globals $ */
// const clog = console.log.bind(console);
let labels = {};

chrome.storage.local.get({
  tildesExtendedSettings: {usersLabel: {}}
}, function(res) {
  // clog(res);
  const usersLabel_enabled = res.tildesExtendedSettings.usersLabel.enabled;

  if (usersLabel_enabled) {
    // Get all user's label
    chrome.storage.local.get({
      tildesExtendedUsersLabels: {}
    }, function(res_labels) {
      // clog(res_labels);
      labels = res_labels.tildesExtendedUsersLabels ?  res_labels.tildesExtendedUsersLabels : {};
      populateLabels(labels);

      // Div for edit label mini-form
      $("body").append(`
        <div class="label-edit-box" id="label_edit">
          <form>
            <input type="hidden" id="edit_label_id">
            <label for="edit_label_text">Label's text</label><br>
            <input type="text" size="20" id="edit_label_text"><br>
            <label for="edit_label_color">Label's color</label><br>
            <select id="edit_label_color">
              <option class="bg-none" value="bg-none">none</option>
              <option class="bg-red" value="bg-red">red</option>
              <option class="bg-orangered" value="bg-orangered">orange-red</option>
              <option class="bg-orange" value="bg-orange">orange</option>
              <option class="bg-dodgerblue" value="bg-dodgerblue">blue</option>
              <option class="bg-forestgreen" value="bg-forestgreen">green</option>
              <option class="bg-slategray" value="bg-slategray">gray</option>
            </select><br>
            <div class="edit_label_actions">
              <a href id="edit_label_cancel">cancel</a>
              <a href id="edit_label_remove">remove</a>
              <a href id="edit_label_save">save</a>
            </div>
          </form>
        </div>
      `);

      // Listener on 'click' for edit-label form
      $("#edit_label_save").on('click', (e) => updateLabel(e));
      $("#edit_label_remove").on('click', (e) => removeLabel(e));
      $("#edit_label_cancel").on('click', (e) => closeEditBox(e));
    });
  }
});

function populateLabels(labels) {
  // Cleanup previously created labels
  $("span[id^=TE_label]").remove();

  // Iterate through all users-link
  $("a[class='link-user']").each( function() {
    const labelInfo = labels[$(this).text()];
    if(labelInfo) {
      // IF a label exists in local storage THEN Append <span class="user-label bg-COLOR">TEXT</span>
      $(this).after('<span id="TE_label'+ $(this).text() +'" class="user-label '+ labelInfo.color +'">'+ labelInfo.text +'</span>');
    } else {
      // ELSE show the label with just a '+'
      $(this).after('<span id="TE_label'+ $(this).text() +'" class="user-label bg-none">+</span>');
    }
  });

  // Determine dark/bright theme and adjusting the css accordingly
  $("span[id^=TE_label]").colourBrightness();

  // Listener on 'click' for labels
  $("span[id^=TE_label]").on('click', (e) => editLabel(e));
}

function editLabel(e) {
  e.preventDefault();
  $("#edit_label_id").val(e.currentTarget.id.split('TE_label').slice(-1));
  const userLabelInfo = labels[$("#edit_label_id").val()];
  if (userLabelInfo) {
    $("#edit_label_text").val(userLabelInfo.text);
    $("#edit_label_color").val(userLabelInfo.color);
  } else {
    $("#edit_label_text").val('');
    $("#edit_label_color").val('bg-none');
  }

  $('#label_edit').css({'top':e.pageY - 90,'left':e.pageX + 10});
  $("#label_edit").show();
}

function updateLabel(e) {
  e.preventDefault();
  if ($("#edit_label_text").val() !== '') {
    labels[$("#edit_label_id").val()] = {
      text: $("#edit_label_text").val(),
      color: $("#edit_label_color").val()
    };
    chrome.storage.local.set({
      tildesExtendedUsersLabels: labels
    }, function() {
      $("[id^='TE_label"+ $("#edit_label_id").val() +"']").removeClass();
      $("[id^='TE_label"+ $("#edit_label_id").val() +"']").addClass('user-label '+ $("#edit_label_color").val());
      $("[id^='TE_label"+ $("#edit_label_id").val() +"']").text($("#edit_label_text").val());
      $("[id^='TE_label"+ $("#edit_label_id").val() +"']").colourBrightness();
    });
  }
  closeEditBox(e);
}

function removeLabel(e) {
  e.preventDefault();
  if (labels[$("#edit_label_id").val()]) {
    delete labels[$("#edit_label_id").val()];
    chrome.storage.local.set({
      tildesExtendedUsersLabels: labels
    }, function() {
      $("[id^='TE_label"+ $("#edit_label_id").val() +"']").removeClass();
      $("[id^='TE_label"+ $("#edit_label_id").val() +"']").addClass('user-label bg-none');
      $("[id^='TE_label"+ $("#edit_label_id").val() +"']").text('+');
      $("[id^='TE_label"+ $("#edit_label_id").val() +"']").colourBrightness();
    });
  }
  closeEditBox(e);
}

function closeEditBox(e) {
  e.preventDefault();
  // clog('Current labels:', labels);
  $("#label_edit").hide();
}

// ============== Utils ===============
// This stuff should go into the background.js script and being passed with a message approach

// From https://github.com/jamiebrittain/colourBrightness.js
$.fn.colourBrightness = function(){
  function getBackgroundColor($el) {
    let bgColor = "";
    while($el[0].tagName.toLowerCase() != "html") {
      bgColor = $el.css("background-color");
      if(bgColor != "rgba(0, 0, 0, 0)" && bgColor != "transparent") {
        break;
      }
      $el = $el.parent();
    }
    return bgColor;
  }

  let r,g,b,brightness,
      colour = getBackgroundColor(this);

  if (colour.match(/^rgb/)) {
    colour = colour.match(/rgba?\(([^)]+)\)/)[1];
    colour = colour.split(/ *, */).map(Number);
    r = colour[0];
    g = colour[1];
    b = colour[2];
  } else if ('#' == colour[0] && 7 == colour.length) {
    r = parseInt(colour.slice(1, 3), 16);
    g = parseInt(colour.slice(3, 5), 16);
    b = parseInt(colour.slice(5, 7), 16);
  } else if ('#' == colour[0] && 4 == colour.length) {
    r = parseInt(colour[1] + colour[1], 16);
    g = parseInt(colour[2] + colour[2], 16);
    b = parseInt(colour[3] + colour[3], 16);
  }

  brightness = (r * 299 + g * 587 + b * 114) / 1000;

  if (brightness < 125) {
    this.removeClass("text-light").addClass("text-dark");
  } else {
    this.removeClass("text-dark").addClass("text-light");
  }
  return this;
};

// Workaround to reload the label after a vote/unvote of a comment
// A better solution would be to listen for XHR requests and detect a response received but apparently
// either it doesn't work with browser extension injected code or tildes.net use masked request
const inTopic = window.location.pathname !== '/';
addVoteListener();

function addVoteListener() {
  if(inTopic) {
    $("a[name=vote]").on('click', () => refreshLabel());
    $("a[name=unvote]").on('click', () => refreshLabel());
  }
}

function refreshLabel() {
  if(inTopic) {
    setTimeout(() => {
      addVoteListener();
      populateLabels(labels);
    }, 500); // after 500 msec refresh the labels. most request should complete in <200 msec
  }
}
