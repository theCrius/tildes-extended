/* globals $ */
// const clog = console.log.bind(console);

chrome.storage.sync.get({
  tildesExtendedSettings: {miscellaneous: {}}
}, function(res) {
  const miscellaneous = res.tildesExtendedSettings.miscellaneous;
  if (miscellaneous.enabled) {
    if(miscellaneous.activeFeatures.randomTilde) {
      randomTilde();
    }
  }
})

// Removes the site-header-logo image and makes it a tilde in a random color
function randomTilde() {
  $('.site-header-logo').addClass('no-header-logo');
  $('.site-header-logo').html('<span id="random-tilde">~</span> Tildes');
  // Generate a random hex color by iterating 6 times through the 16 values
  let hexRandom = '#'
  for (let i = 0; i < 6; i++) hexRandom += '0123456789ABCDEF'[Math.floor(Math.random() * 16)];
  $('#random-tilde').css('color', hexRandom);
}
