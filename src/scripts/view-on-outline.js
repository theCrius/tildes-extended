const vooDefaults = {tildesExtendedSettings: {viewOnOutline: {}}};

chrome.storage.sync.get(vooDefaults, res => {
  if (res.tildesExtendedSettings.viewOnOutline.enabled) {
    const s = res.tildesExtendedSettings;
    const blacklist = s.viewOnOutline.blacklist;
    const linkNewTab = s.linkNewTab
                       && s.linkNewTab.enabled
                       && s.linkNewTab.types.includes('link_submissions');

    addOutlineButton(blacklist, linkNewTab);
  }
});

function addOutlineButton(blacklist = [], linkNewTab = false) {
  [...document.querySelectorAll('.topic-title > a:first-child')].forEach(el => {
    // some known sites that don't play well with outline.com
    const domainRegExp = new RegExp(`^https?://.*(${blacklist.join('|')})`, 'gi');
    const matches = el.href.match(domainRegExp);

    if (matches && matches.length > 0) { return; }

    const parser = new DOMParser();
    const outlineIcon = parser.parseFromString(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 37.042 37.042">
        <path d="M.047.048h36.947v6.095H.047z"/>
        <path d="M.047 10.905h36.947V17H.047z"/>
        <path d="M.047 21.233H18.71v6.095H.047z"/>
      </svg>`,
      'image/svg+xml'
    );

    const outlineLink = document.createElement('a');
    outlineLink.href = `https://outline.com/${el.href}`;
    outlineLink.title = 'View on outline.com';
    outlineLink.classList.add('VOO-link');

    // If headline links open in new tab so should this, checks both the target
    // and the tildes extended link new tab setting incase functionality is
    // added directly to tildes in the future or user has some other extension
    // that does it.
    const target = el.getAttribute('target');
    if (linkNewTab || target) { outlineLink.target = target || '_blank'; }

    outlineLink.appendChild(outlineIcon.documentElement);
    el.parentNode.appendChild(outlineLink);
  });
}