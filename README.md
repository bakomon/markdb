# MarkDB

A simple tool to bookmark your comics, novels, and anime in Firebase.

Works on all PC & Mobile devices, using a modern browser that supports custom scripts.

## Support

### PC :
* Chromium Based Browsers: [User JavaScript and CSS](https://chrome.google.com/webstore/detail/nbhcbdghjpllgmfilhnhkllmkecfmpld?hl=en) (extension)
* Opera: 
  1. Add-ons: [Install Chrome Extensions](https://addons.opera.com/en/extensions/details/install-chrome-extensions/)
  2. Extension: [User JavaScript and CSS](https://chrome.google.com/webstore/detail/nbhcbdghjpllgmfilhnhkllmkecfmpld?hl=en)

### Android:
* [Via Browser](https://play.google.com/store/apps/details?id=mark.via.gp&hl=en)
* [XBrowser](https://play.google.com/store/apps/details?id=com.xbrowser.play&hl=en)
* [Kiwi Browser](https://play.google.com/store/apps/details?id=com.kiwibrowser.browser&hl=en) with [User JavaScript and CSS](https://chrome.google.com/webstore/detail/nbhcbdghjpllgmfilhnhkllmkecfmpld?hl=en) (extension)

## Not Support:
* [`Firefox & Safari`](https://github.com/bakomon/mydb/blob/master/tools/mydb-tools.js#L148-L154)
* [`Incognito/Private Window`](https://github.com/bakomon/mydb/blob/master/tools/mydb-tools.js#L786)

ㅤ
## Install

### Prerequisites (firebase):
1. Open [console.firebase.google.com](https://console.firebase.google.com/)
2. Create [Project](https://www.youtube.com/embed/13eja_RYimU?start=12&end=34&rel=0)
3. Register [Web App](https://www.youtube.com/embed/13eja_RYimU?start=48&end=86&rel=0)
4. Enable [Sign-In Email/Password](https://www.youtube.com/embed/iKlWaUszxB4?start=463&end=482&rel=0)
5. Add [New User](https://www.youtube.com/embed/iKlWaUszxB4?start=508&end=517&rel=0)
6. Create [Realtime Database](https://www.youtube.com/embed/pP7quzFmWBY?start=58&end=115&rel=0)
7. Edit [Realtime Database Rules](https://www.youtube.com/embed/dx_gkSb-Ch0?start=90&end=138&rel=0) ==> [`rules.txt`](https://cdn.jsdelivr.net/gh/bakomon/mydb@master/bookmark/rules.txt)
8. Import [JSON file](https://www.youtube.com/embed/rc4qZWHBNrQ?start=68&end=103&rel=0) ==> [`example.json`](https://cdn.jsdelivr.net/gh/bakomon/mydb@master/bookmark/example.json)

### How to use:
1. Install extension: [https://chrome.google.com/webstore/detail/nbhcbdghjpllgmfilhnhkllmkecfmpld](https://chrome.google.com/webstore/detail/nbhcbdghjpllgmfilhnhkllmkecfmpld?hl=en)
2. Open extension options: `chrome-extension://nbhcbdghjpllgmfilhnhkllmkecfmpld/options.html`
3. Click `Add new site`
4. Fill `site-url` with `*`
5. Copy & Paste [mydb-tools.js](https://github.com/bakomon/mydb/blob/master/tools/mydb-tools.js) to `JS textarea`
   - Open [project settings](https://console.firebase.google.com/project/_/settings/general) and choose a project
   - Copy [Firebase config object](https://www.youtube.com/embed/13eja_RYimU?start=88&end=111&rel=0)
   - Replace [mydb-tools.js#L838-L845](https://github.com/bakomon/mydb/blob/master/tools/mydb-tools.js#L838-L845)
6. Click `Save`
7. Open comic site, eg. `mangatale.co`
