// DATABASE CUSTOM
function mydb_x_fnc() {
  if (mydb_x_loaded) return;
  mydb_x_loaded = true;
  
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
  
  // Cookies with custom timer https://codepen.io/sekedus/pen/xxYeZZj
  var cookies = {
    set: function(name, value, interval) {
      var expires = '';
      if (interval) {
        var date = new Date();
        var timer = interval.indexOf('|') != -1 ? Number(interval.split('|')[1]) : 1;
    
        if (interval.search(/(year|month)s?/i) != -1) {
          var year_add = interval.search(/years?/i) != -1 ? timer : 0;
          var month_add = interval.search(/months?/i) != -1 ? timer : 0;
          date.setFullYear(date.getFullYear() + year_add, date.getMonth() + month_add);
        } else {
          var date_num = interval.search(/weeks?/i) != -1 ? (timer*7*24*60*60) : interval.search(/days?/i) != -1 ? (timer*24*60*60) : interval.search(/hours?/i) != -1 ? (timer*60*60) : interval.search(/minutes?/i) != -1 ? (timer*60) : timer; // default = second
          date.setTime(date.getTime() + (date_num * 1000));
        }
        expires = '; expires='+ date.toGMTString();
      }
      // if no interval, timer = session
      document.cookie = name +'='+ value + expires+'; path=/';
    },
    get: function(name) {
      // https://www.quirksmode.org/js/cookies.html
      var nameEQ = name + '=';
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    },
    remove: function(name) {
      document.cookie = name +'=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = name +'=; Max-Age=0; path=/; domain='+ window.location.hostname;
    },
  };
  
  // ============================================================================================================
  
  function typeMU() {
    var mu_cat = document.querySelectorAll('#main_content .sCat');
    for (var i = 0; i < mu_cat.length; i++) {
      if (mu_cat[i].textContent.search(/type/i) != -1) return mu_cat[i].nextElementSibling.textContent.replace(/[\s\t\n]+/, '').toLowerCase();
    }
    return false;
  }
  
  function copyMU() {
    var mu_mobile = document.documentElement.classList.contains('is-mobile');
    var mu_id = document.querySelector('#main_content a[href$="/rss"]').href.match(mu_rgx)[1];
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
    mu_btn.innerHTML += '<textarea style="display:none;"></textarea>';
    document.body.appendChild(mu_btn);
    
    document.querySelector('#mu_copy button').onclick = function() {
      var mu_str = JSON.stringify(mu_data);
      document.querySelector('#mu_copy textarea').value = mu_str;
      copyToClipboard(mu_str);
      this.innerHTML = 'COPIED';
      this.disabled = true;
      window.scroll(0,0);
    };
  }
  
  function removeStatically() {
    var rs_images = el('img', 'all');
    var rs_rgx = /(?:cdn|img)\.(statically)\.(?:io)\/(?:img\/(?:[^\.]+\/)?)?/i;
    var rs_list = ['src','lazySrc','url','imgsrc','cfsrc'];
    
    for (var i = 0; i < rs_images.length; i++) {
      if (rs_images[i].getAttribute('original')) rs_images[i].setAttribute('original', rs_images[i].getAttribute('original').replace(rs_rgx, '').replace(/\/[fhwq]=[^\/]+/, ''));
      // dataset
      for (var j = 0; j < rs_list.length; j++) {
        if (rs_images[i].dataset[rs_list[j]]) rs_images[i].dataset[rs_list[j]] = rs_images[i].dataset[rs_list[j]].replace(rs_rgx, '').replace(/\/[fhwq]=[^\/]+/, '');
      }
      if (rs_images[i].src) rs_images[i].src = rs_images[i].src.replace(rs_rgx, '').replace(/\/[fhwq]=[^\/]+/, '');
    }
  }
  
  function disqusReload(id) {
    var par_dsqs = el('#disqus_thread').parentElement;
    removeElem('#disqus_thread');
    
    var disqus_load = document.createElement('div');
    disqus_load.style.cssText = 'width:100%;text-align:center;';
    disqus_load.innerHTML = '<button id="disqus_trigger" style="border:0;padding:5px 10px;font-size:20px;cursor:pointer;">Post a Comment</button>';
    par_dsqs.appendChild(disqus_load);
    
    var disqus_new = document.createElement('div');
    disqus_new.className = 'disqus_mod';
    par_dsqs.appendChild(disqus_new);
    
    el('#disqus_trigger').onclick = function() {
      this.style.display = 'none';
      el('.disqus_mod').id = 'disqus_thread';
      mydb_add_script({data:'//'+ id +'.disqus.com/embed.js', async:true});
    };
  }
  
  function disqusMod() {
    var cmt_chk = setInterval(function() {
      if (el('#disqus_thread')) {
        if (typeof embedVars != 'undefined') { //from web
          clearInterval(cmt_chk);
          disqusReload(embedVars.disqusShortname);
        } else if (el('#disqus_thread').dataset.disqusShortname) {
          clearInterval(cmt_chk);
          disqusReload(el('#disqus_thread').dataset.disqusShortname);
        } else if (el('script[src*="disqus.com/count.js"]')) {
          clearInterval(cmt_chk);
          var dsqs_sn = el('script[src*="disqus.com/count.js"]').src;
          dsqs_sn = dsqs_sn.match(/\/\/([^\.]+)\.disqus\.com[^\.]+\.js/)[1];
          disqusReload(dsqs_sn);
        } else if (el('#disqus_thread').nextElementSibling) {
          clearInterval(cmt_chk);
          var dsqs_sn = el('#disqus_thread').nextElementSibling.innerHTML;
          dsqs_sn = dsqs_sn.match(/\/\/([^\.]+)\.disqus\.com[^\.]+\.js/);
          if (!dsqs_sn) return;
          disqusReload(dsqs_sn[1]);
        } else {
          clearInterval(cmt_chk);
          var idDsqs, sDsqs = el('script', 'all');
          for (var i = 0; i < sDsqs.length; i++) {
            if (sDsqs[i].innerHTML.indexOf('disqus.com') != -1) {
              idDsqs = sDsqs[i].innerHTML.match(/\/\/([^\n]+)\.disqus\.com[^\n]+\.js/)[1];
              disqusReload(idDsqs);
              break;
            }
          }
        }
      } else if (document.body.classList.contains('new_cms') && el('#comic-details-container')) { //from web
        clearInterval(cmt_chk);
        el('#comic-details-container').id = 'disqus_thread';
        disqusReload(window['disqusName']);
      } else if (wh.indexOf('softkomik') != -1) { //api
        clearInterval(cmt_chk);
        /*var eDsqs = setInterval(function() {
          if (el('#container #disqus_thread')) {
            clearInterval(eDsqs);
            disqusReload(el('#disqus_thread').dataset.disqusShortname);
          }
        }, 100);*/
      } else {
        clearInterval(cmt_chk);
      }
    }, 100);
  }
  
  function webDarkMode() {
    // Dark mode
    if (document.body.classList.contains('themesia') || el('#thememode .switch') || el('.theme.quickswitcher') || el('.theme-mode .switch') || el('.theme.switchmode') || el('#quickswitcher')) {
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
    } else if (document.body.classList.contains('emissionhex') || document.body.classList.contains('pemudanolep')) {
      localStorage.setItem('mode', 'darkmode');
      el('#modeSwitch').classList.add('dark-mode');
    } else if (wh.indexOf('mangayu') != -1) {
      localStorage.setItem('theme', 'dark');
    } else if (document.body.classList.contains('pemudanolep')) {
      localStorage.setItem('dark', 'true');
      document.documentElement.classList.add('dark');
    } else if (document.body.classList.contains('yuukithemes')) {
      cookies.set('darkmode', 'yes', 'days|365');
      document.documentElement.classList.add('dark');
    }
  }
  
  function removeAADB() {
    var adb_id, adb_style = el('style','all');
    for (var i = 0; i < adb_style.length; i++) {
      if (adb_style[i].innerHTML.search(/(#\w+)\s?~\s?\*\s?\{display:\s?none\s?(?:!important)?;?\}?/) != -1) {
        removeElem(adb_style[i]);
        adb_id = adb_style[i].innerHTML.match(/(#\w+)\s?~\s?\*\s?\{display:\s?none\s?(?:!important)?;?\}?/)[1];
        var adb_chk = setInterval(function() {
          if (el(adb_id)) {
            removeElem(el(adb_id));
            clearInterval(adb_chk);
            var adb_elem = el('[style*="display"','all');
            for (var j = 0; j < adb_elem.length; j++) {
              if (adb_elem[j].tagName.toLowerCase().search(/meta|link|style|script/) == -1) {
                adb_elem[j].style.display = null;
              }
            }
          }
        }, 100);
      }
    }
  }
  
  function seriesList() {
    var l_def = [
      "#seriesList",
      "#chapterlist",
      "#chapter_list",
      ".series-seriesList",
      ".series-chapterlist",
      ".episode-list",
      ".eplister",
      "#--box-list",
      ".listing-chapters_wrap"
    ];
    
    var l_list = {
      "komikcast": ".komik_info-chapters",
      "comicfx": ".chaplist",
      "komikstation": ".bxcl",
      "manhuaid": ".tb-custom-scrollbar",
      "komiku": "#Daftar_Chapter",
      "mangacdn": ".lcp_catlist",
      "webtoons": "#_episodeList",
      "readmangabat": ".row-content-chapter",
      "komikid": ".chapters",
      "mangapark": ".file-list-by-serial",
      "rawdevart": ".card.info-navs .card-body",
      "readmng": "#chapters-tabContent"
    };
    
    var list_area, l_name, l_site = wh.replace(wh_rgx, '').replace(/\.(.*?)+$/, '');
    
    if (l_site in l_list) {
      l_name = l_list[l_site];
      list_area = el(l_name);
    } else {
      for (var i = 0; i < l_def.length; i++) {
        if (el(l_def[i])) {
          l_name = l_def[i];
          list_area = el(l_name);
          break;
        }
      }
    }
    
    // infoanime from bacakomik.co or eastheme
    if (list_area && getParents(list_area, '.infoanime').length == 0) mydb_project = true;
    
    if (list_area && isMobile()) {
      var a_latest = wh.indexOf('webtoons') != -1 ? '[id^="episode_"] a' : 'a';
      if (el(a_latest, list_area) && el(a_latest, list_area).href.search(/#$/) == -1) {
        var a_rgx = wh.indexOf('webtoons') != -1 ? /(#\d+)/ : /(\d+(?:[,\.-]\d)?)/;
        var a_data = document.body.classList.contains('koidezign') ? 'title' : 'textContent';
        var a_arr = el(a_latest, list_area)[a_data].match(a_rgx);
        var l_last = document.createElement('div');
        l_last.id = 'mydb_latest_chapter';
        l_last.style.cssText = 'position:fixed;top:55%;right:0;z-index:2147483644;background:#252428;color:#ddd;padding:10px 15px;font-size:130%;border:1px solid #3e3949;';
        l_last.innerHTML = a_arr ? a_arr[1] : 'list';
        document.body.appendChild(l_last);
        
        // scroll to chapter list
        el('#mydb_latest_chapter').onclick = function() {
          // var list_top = getOffset(list_area).top;
          var list_top = list_area.getBoundingClientRect().top + window.scrollY;
          var halfScreen = Math.floor((window.screen.height / 2) + 30);
          /*list_area.style.cssText = 'scroll-margin-top:'+ halfScreen +'px';
          list_area.scrollIntoView();*/
          window.scroll(0, (list_top - halfScreen));
        };
      }
    }
    
    // css style for chapter link visited
    if (l_name) {
      var l_elem = document.createElement('style');
      l_elem.innerHTML = l_name +' a:visited{color:red !important;}';
      document.body.appendChild(l_elem);
    }
  }
  
  function customEdit() {
    if (wh.indexOf('webtoons') != -1) {
      el('#wrap').classList.add('no-css');
    }
    
    if (wh.indexOf('rawdevart') != -1) {
      cookies.set('rawdevart_theme_cookie', 'dark|1', 'day'); //1 is for all pages on reader
    }
    
    if (wh.indexOf('funmanga') != -1) { //replace
      if (el('.dl-horizontal dd:nth-child(4)')) el('.dl-horizontal dd:nth-child(4)').style.width = 'auto'; //status on series page
    }
    
    if (wh.search(batoto_rgx) != -1 && typeof settings_keys !== 'undefined') {
      // settings_keys = from web (settings page)
      var bt_settings = `"${settings_keys.site_theme_mode}":1,"${settings_keys.settings_vers}":${settings_vers},"${settings_keys.filter_langs_home_page_popular}":["en","id"],"${settings_keys.filter_langs_home_page_release}":["en","id"],"${settings_keys.block_genres_home_page_popular}":["futa","bara","yuri","yaoi","hentai","genderswap","gender_bender","incest","shoujo_ai","shounen_ai"],"${settings_keys.block_genres_home_page_release}":["yuri","yaoi","futa","bara","hentai","incest","gender_bender","genderswap","shounen_ai","shoujo_ai"]`;
      if (cookies.get('reader_settings')) cookies.remove('reader_settings');
      cookies.set('reader_settings', `{${encodeURIComponent(bt_settings)}}`, 'days|365');
    }
    
    if (wh.indexOf('softkomik') != -1) {
      var soft_chk = setInterval(function() {
        if (el('.container .relatif .bg-content')) {
          clearInterval(soft_chk);
          el('a', 'all').forEach(function(item) {
            item.addEventListener('click', function(e) {
              e.stopPropagation();
              wl.href = item.href;
            });
          });
        }
      }, 100);
    }
    
    if (document.body.classList.contains('_rightclick')) {
      // re-enable right click (don't forget "true") https://stackoverflow.com/a/43754205
      window.addEventListener('contextmenu', function(e) {
        e.stopPropagation();
      }, true);
      
      // override js function "disable selection" by https://wordpress.org/plugins/wp-content-copy-protector/
      if (typeof wccp_free_iscontenteditable !== 'undefined') {
        wccp_free_iscontenteditable = function() { return true; };
      }
    }
    
    // skip ads window.open(), eg. syndication.exdynsrv.com || jomtingi.net
    if (document.body.classList.contains('ads_newtab')) {
      removeElem('iframe[style*="display: none"], iframe[style*="opacity: 0"]', 'all');
      var ads_chk = setInterval(function() {
        if (el('iframe[style*="display: none"], iframe[style*="opacity: 0"]')) {
          removeElem('iframe[style*="display: none"], iframe[style*="opacity: 0"]', 'all');
        }
      }, 5000);
      setTimeout(function() { clearInterval(ads_chk); }, 30000);
      
      // Ref: Restore native window.open https://stackoverflow.com/a/48006884/7598333
      // Override window.open() https://codepen.io/crmolloy/pen/YqdagV
      // var windowOpenBackup = window.open; //🟥 ERROR if poper blocker or ublock extension installed
      window.open = function(url, name, features) {
        console.log('window.open caught! url: '+ url);
        //window.open = windowOpenBackup;
      };
      
      /*var el_a = el('a', 'all');
      for (var i = 0; i < el_a.length; i++) {
        var new_a = copyAttribute(el_a[i], 'i');
        new_a.classList.add('link-mod');
        new_a.style.cssText = 'font-style:normal;cursor:pointer;';
        new_a.innerHTML = el_a[i].innerHTML;
        el_a[i].parentElement.insertBefore(new_a, el_a[i]);
        el_a[i].parentElement.removeChild(el_a[i]);
      }
      el('i[data-href]', 'all').forEach(function(item) {
        item.addEventListener('click', function(e) {
          //e.preventDefault();
          //mydb_open_new_tab(item.dataset.href);
          wl.href = item.dataset.href;
        });
        // right click
        item.addEventListener('contextmenu', function(e) {
          mydb_open_new_tab(item.dataset.href);
        });
      });*/
    }
    
    // https://codecanyon.net/item/ungrabber-content-protection-for-wordpress/24136249
    if (typeof UnGrabber !== 'undefined') {
      // block UnGrabber plugin with ublock
    }
  }
  
  function blockContent() {
    if (wh.indexOf('toonily') != -1 && cookies.get('toonily-mature')) {
      window.stop();
      var imgs = el('img', 'all');
      for (var i = 0; i < imgs.length; i++) imgs[i].removeAttribute('src');
      cookies.remove('toonily-mature');
      wl.reload();
    }
  }
  
  
  var wl = window.location;
  var wh = wl.hostname;
  var wp = wl.pathname;
  var mu_rgx = /\/series(?:\.html\?id=|\/)(\w+)/;
  
  blockContent();
  customEdit();
  
  if (document.body.classList.contains('madara')) {
    var cl_intrvl = setInterval(function() {
      if (el('.listing-chapters_wrap')) {
        clearInterval(cl_intrvl);
        clearTimeout(cl_tmout);
        seriesList();
      }
    }, 100);
    
    var cl_tmout = setTimeout(function() {
      clearInterval(cl_intrvl);
      seriesList();
    }, 60000);
  } else {
    seriesList();
  }
  
  // check if page is comic/project, from database bookmark
  // to avoid mis-detection, eg. blog from blogger.com or wordpress.com
  crossStorage.get('mydb_comic_data', function(res) { //🟥 bug: wait too long before "Start reader"
    if (res != null && res != 'error') {
      var crList = genArray(JSON.parse(res).list);
      for (var n = 0; n < crList.length; n++) {
        if (wp.search(/^\/((m|id|en)\/?)?$/) == -1 && crList[n].url.indexOf(wp) != -1) {
          console.log('project page: '+ crList[n].url);
          mydb_project = true;
          break;
        }
      }
    }
  });
  
  removeAADB(); //remove anti adblock notify for mangacanblog
  webDarkMode();
  if (mydb_settings.mod_disqus && typeof bakomon_web === 'undefined') disqusMod();
  if (mydb_settings.remove_statically) removeStatically();
  if (wh.indexOf('mangaupdates') != -1 && wl.href.search(mu_rgx) != -1) copyMU();
  
  // remove loader
  var sl_wait = setInterval(function() {
    var cr_chk = mydb_info.reader_js != '' && mydb_info.reader_js != 'wait';
    var bm_chk = mydb_info.bookmark_js != '' && mydb_info.bookmark_js != 'wait';
    if (cr_chk && bm_chk) {
      clearInterval(sl_wait);
      if (el('#_loader')) removeElem('#_loader');
    }
  }, 100);
}

if ((typeof live_test_custom != 'undefined' && typeof mydb_x_loaded != 'undefined') && (!live_test_custom && !mydb_x_loaded)) {
  var db_x_check = setInterval(function() {
    if (mydb_support && mydb_support.indexOf('true') != -1) {
      clearInterval(db_x_check);
      clearTimeout(db_x_wait);
      mydb_x_fnc();
    }
  }, 100);
  var db_x_wait = setTimeout(function() { clearInterval(db_x_check); }, 60000);
}
