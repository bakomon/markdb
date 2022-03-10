// DATABASE CUSTOM
function mydb_custom() {
  if (mydb_x_loaded) return;
  mydb_x_loaded = true;
  if (el('#_loader')) el('#_loader').parentElement.removeChild(el('#_loader'));
  
    // Cookies https://www.quirksmode.org/js/cookies.html
  function createCookie(name, value, timer) {
    if (timer) {
      var date = new Date();
      //date.setTime(date.getTime()+(timer*60*1000)); //minutes
      date.setTime(date.getTime()+(timer*24*60*60*1000)); //days
      var expires = '; expires='+date.toGMTString();
    } else {
    	var expires = '';
    }
    document.cookie = name+'='+value+expires+'; path=/';
  }
  
  function readCookie(name) {
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');
    for (var i = 0;i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  }
  
  function eraseCookie(name) {
    createCookie(name,'',-1);
  }
  
    /* Copy to clipboard https://stackoverflow.com/a/30810322/7598333*/
  function copyToClipboard(text, elem) {
    var msg, elm = elem || document.body; /* parent element for textarea */
    var copyTextarea = document.createElement('textarea');
    copyTextarea.value = text;
    elm.appendChild(copyTextarea);
    copyTextarea.focus();
    copyTextarea.select();
  
    try {
      var successful = document.execCommand('copy');
      msg = successful ? true : false;
    } catch (err) {
      msg = false;
      console.log('Oops, unable to copy ', err);
    }
  
    elm.removeChild(copyTextarea);
    return msg;
  }
  
  function typeMU() {
    var mu_cat = document.querySelectorAll('#main_content .sCat');
    for (var i = 0; i < mu_cat.length; i++) {
      if (mu_cat[i].textContent.search(/type/i) != -1) return mu_cat[i].nextElementSibling.textContent.replace(/[\s\t\n]+/, '').toLowerCase();
    }
    return false;
  }
  
  function copyMU() {
    var mu_mobile = document.documentElement.classList.contains('is-mobile');
    var mu_id = wl.search.replace(/\?id=/, '');
    var mu_type = typeMU();
    var mu_img = document.querySelector('img[src*="/image/i"]');
    var mu_data = {};
    
    mu_data['id'] = 'mu|'+ mu_id;
    if (mu_type) mu_data['type'] = mu_type;
    if (mu_img) mu_data['img'] = mu_img.src;
    
    var mu_btn = document.createElement('div');
    mu_btn.id = 'mu_copy';
    mu_btn.style.cssText = 'position:fixed;left:0;right:0;z-index:2147483647;'+ (mu_mobile ? 'bottom' : 'top') +':0;';
    mu_btn.innerHTML = '<button style="background:#4267b2;color:#ddd;padding:8px 16px;font:16px Arial;cursor:pointer;outline:0!important;border:0;">COPY</button>';
    document.body.appendChild(mu_btn);
    
    document.querySelector('#mu_copy button').onclick = function() {
      copyToClipboard(JSON.stringify(mu_data));
      this.innerHTML = 'COPIED';
      this.disabled = true;
      window.scroll(0,0);
    };
    
  }
  
  function webDarkMode() {
    // Dark mode
    if (el('#thememode .switch') || el('.theme.quickswitcher') || el('.theme-mode .switch') || el('.theme.switchmode') || el('#quickswitcher')) {
      // theme enduser.id|themesia.com || theme eastheme.com || komikcast.com
      localStorage.setItem('thememode', 'darkmode');
      localStorage.setItem('theme-mode', 'dark');
      document.body.classList.add('darkmode', 'dark');
      document.body.classList.remove('lightmode');
    } else if (document.body.classList.contains('text-ui-dark')) {
      // theme mangabooth.com (madara)
      document.body.classList.add('text-ui-light');
      document.body.classList.remove('text-ui-dark');
    } else if (wh.indexOf('manhuaid.com') != -1) {
      localStorage.setItem('theme', 'dark');
      document.body.setAttribute('id', 'darkbody');
      el('.isdark').setAttribute('id', 'darkmode');
      el('nav').classList.add('bg-dark');
      el('nav').classList.remove('bg-success', 'fixed-top');
    } else if (document.body.classList.contains('emissionhex')) {
      localStorage.setItem('mode', 'darkmode');
      el('#modeSwitch').classList.add('dark-mode');
    } else if (wh.indexOf('mangadex') != -1) {
      var mgdx_css = document.createElement('link');
      mgdx_css.href = '//mangadex.org/scripts/css/Dark-Slate.css';
      mgdx_css.setAttribute('rel', 'stylesheet');
      el('head').appendChild(mgdx_css);
    } else if (wh.indexOf('mangayu') != -1) {
      localStorage.setItem('theme', 'dark');
    } else if (document.body.classList.contains('pemudanolep')) {
      localStorage.setItem('dark', 'true');
      document.documentElement.classList.add('dark');
    } else if (document.body.classList.contains('yuukithemes')) {
      createCookie('darkmode', 'yes', '7');
      document.documentElement.classList.add('dark');
    }
  }
  
  
  var wl = window.location;
  var wh = wl.hostname;
  var wp = wl.pathname;
  
  webDarkMode();
  if (wh.indexOf('mangaupdates') != -1 && wl.href.indexOf('/series.html?id=') != -1) copyMU();
}

if ((typeof live_test_custom != 'undefined' && typeof mydb_x_loaded != 'undefined') && (!live_test_custom && !mydb_x_loaded)) {
  mydb_custom();
}
