/* globals $ */
const clog = console.log.bind(console);
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

      // Listener on 'click' for labels
      $("span[id^=TE_label]").on('click', (e) => editLabel(e));

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
    });
  }
  closeEditBox(e);
}

function closeEditBox(e) {
  e.preventDefault();
  clog('Current labels:', labels);
  $("#label_edit").hide();
}
