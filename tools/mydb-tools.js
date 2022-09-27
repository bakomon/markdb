/* Detect mobile device https://stackoverflow.com/a/11381730/7598333 */
function isMobile() {
  var ua = navigator.userAgent || navigator.vendor || window.opera;
  return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(ua)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(ua.substr(0, 4));
}

// content-type of current loaded page https://stackoverflow.com/a/12256451/7598333
function checkContentType() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', document.location, false);
  xhr.send(null);
  return xhr.getResponseHeader('content-type');
}

function mydb_tools_fnc() {
  /* Simple querySelector https://codepen.io/pen/oKYOEK */
  el = function(e,l,m) {
    var elem, parent = l != 'all' && (l || l === null) ? l : document;
    if (parent === null) {
      elem = parent;
      console.error('selector: '+ e +' => parent: '+ parent);
    } else {
      elem = (m || l == 'all') ? parent.querySelectorAll(e) : parent.querySelector(e);
    }
    return elem;
  };
  
  /* Restore native window.open https://stackoverflow.com/a/48006884/7598333 */
  openInNewTab = function(url, note) {
    var _iframe = document.createElement('iframe');
    document.documentElement.appendChild(_iframe);
    
    var _window = _iframe.contentWindow;
    window.nativeOpen = _window.open;
    
    if (note in mydb_settings.new_tab && !mydb_settings.new_tab[note]) {
      window.nativeOpen(url, '_self');
    } else {
      window.nativeOpen(url);
    }
    
    _iframe.parentElement.removeChild(_iframe);
  }
  
  /* Add script to head https://codepen.io/sekedus/pen/QWKYpVR */
  addScript = function(options, note) {
    /* if a <script> tag failed to load https://stackoverflow.com/a/44325793/7598333 */
    return new Promise(function (resolve, reject) {
      /* data, id, info, boolean, parent */
      if (!('data' in options)) return;
      var js_new = document.createElement('script');
      if ('id' in options) js_new.id = options.id;
      if ('async' in options) js_new.async = options.async;
      if (note == 'in') {
        js_new.type = 'text/javascript';
        js_new.innerHTML = options.data;
      } else {
        if ('callback' in options) {
          js_new.onerror = options.callback(true);
          js_new.onload = options.callback(false);
        }
        js_new.src = options.data;
      }
      var parent = 'parent' in options && parent.tagName ? options.parent : document.querySelector('head');
      parent.appendChild(js_new);
    });
  };
  
  /* Cross Domain LocalStorage */
  crossStorage = {
    /* 
    - bug on Firefox (CORS) https://wp.me/pVzR8-9X#:~:text=in%20firefox,on%20iframe
    rel:
    - Cross-Domain LocalStorage https://wp.me/pVzR8-9X
    - https://github.com/jcubic/sysend.js/blob/master/sysend.js
    */
    load: function() {
      var iframe = document.createElement('iframe');
      iframe.id = 'db-frame';
      iframe.style.cssText = 'height:0;width:0;border:none;';
      document.body.appendChild(iframe);
      iframe.src = cross_frame;
      
      iframe.addEventListener('load', function handler() {
        /* 
        - some browser (don't remember which one) throw exception when you try to access
          contentWindow for the first time, it work when you do that second time.
        - fix for Safari https://stackoverflow.com/q/42632188/387194
        */
        try {
          cross_window = iframe.contentWindow;
        } catch(error) {
          cross_window = iframe.contentWindow;
        }
        iframe.removeEventListener('load', handler);
      });
      
      window.addEventListener('message', function(e) {
        if (e.origin == cross_url && e.data.toString().match(/cross__/i) && e.data.indexOf('cross_test') == -1) {
          var get_data = JSON.parse(e.data);
          clearTimeout(window[get_data.name]);
          get_data.key = get_data.key.replace(/^cross__/, '');
          crossStorage.write(get_data.name, get_data.key, get_data.data);
        }
      });
    },
    wait: function(callback) {
      var win_chk = setInterval(function() {
        if (typeof cross_window !== 'undefined') {
          clearInterval(win_chk);
          callback();
        }
      }, 100);
    },
    write: function(name, key, data) {
      /* old
      cross_callbacks[key].forEach(function(callback) {
        callback(data);
        cross_callbacks[key].splice(callback, 1); //remove value from array after callback
      });*/
      cross_callbacks[name].callback(data);
      delete cross_callbacks[name];
    },
    set: function(key, data) {
      /* save data to subdomain localStorage */
      data = JSON.stringify(data);
      var l_obj = '{"method":"set","key":"'+ key +'","origin":"cross__'+ cross_origin +'","data":'+ data +'}';
      crossStorage.wait(function(){cross_window.postMessage(l_obj, '*')});
    },
    get: function(key, callback) {
      var name = 'cross_z'+ Math.random().toString(36).substr(2, 5);
      
      /* old
      if (!cross_callbacks[key]) {
        cross_callbacks[key] = [];
      }
      cross_callbacks[key].push(callback);*/
      cross_callbacks[name] = {"key":key,"callback":callback};
      
      /* load saved data from subdomain localStorage */
      var l_obj = '{"method":"get","name":"'+ name +'","key":"'+ key +'","origin":"cross__'+ cross_origin +'"}';
      crossStorage.wait(function(){cross_window.postMessage(l_obj, '*')});
      crossStorage.check(name, key, function(res){callback(res)});
    },
    remove: function(key) {
      /* remove data from subdomain localStorage */
      var l_obj = '{"method":"remove","key":"'+ key +'","origin":"cross__'+ cross_origin +'"}';
      crossStorage.wait(function(){cross_window.postMessage(l_obj, '*')});
    },
    clear: function() {
      /* clear all localStorage from subdomain localStorage */
      var l_obj = '{"method":"clear","origin":"cross__'+ cross_origin +'"}';
      crossStorage.wait(function(){cross_window.postMessage(l_obj, '*')});
    },
    check: function(name, key, callback) {
      var chk_time = 30000;
      window[name] = setTimeout(function() {
        console.error(`!! Error crossStorage: window[${name}], can\'t get "${key}" data from iframe. wait = ${(chk_time % 60000) / 1000}s`);
        callback('error');
      }, chk_time);
    }
  };
  
  /* Save css, js, json to localStorage with Expiration https://codepen.io/sekedus/pen/LYbBagK */
  localSave = {
    load: function(url, id, type, interval, callback) {
      var ls_interval = interval || 'permanent';
      var ls_update = ls_interval.search(/manual\|/i) != -1 ? ls_interval.split('|')[1] : localSave.date(ls_interval); /* default second+1 */
      console.log(`ls_data_id: ${id}`);
      console.log(`ls_interval: ${ls_interval}`);
      console.log(`ls_update: ${ls_update}`);
      
      var data_local = localStorage.getItem(id);
      if (data_local) {
        data_local = JSON.parse(data_local);
        if (data_local.update && data_local.data) {
          if (data_local.data == '0') {
            localStorage.removeItem(id);
            alert(`!! ERROR: ${id} data is "${data_local.data}" !!\n\nTry to:\n1. check console on browser\n2. check XHR on ${window.location.hostname} in AdBlock filter.`);
            return;
          }
          var date_chk = ls_interval.search(/manual\|/i) != -1 ? new Date(ls_interval.split('|')[1]) : new Date();
          date_chk = date_chk.getTime() <= Date.parse(data_local.update); /* check time interval */
          if (date_chk || ls_interval == 'permanent') {
            console.log('ls_data: true');
            localSave.set(data_local.data, id, type, 'true_time');
          } else {
            console.log('ls_data: false expired');
            localStorage.removeItem(id);
            localSave.get(url, function(res){ localSave.set(res, id, type, 'false_expired', ls_update); });
          }
        } else {
          console.log('ls_data: false undefined');
          localStorage.removeItem(id);
          localSave.get(url, function(res){ localSave.set(res, id, type, 'false_undefined', ls_update); });
        }
      } else {
        console.log('ls_data: false not_found');
        localSave.get(url, function(res){ localSave.set(res, id, type, 'false_notfound', ls_update); });
      }
    },
    get: function(url, callback, info) {
      /* loadXMLDoc (XMLHttpRequest) https://codepen.io/sekedus/pen/vYGYBNP */
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
          if (this.status == 200) {
            var response = this.responseText;
            if (info == 'parse') {
              var resHTML = new DOMParser();
              response = resHTML.parseFromString(response, 'text/html');
            }
            callback(response);
          } else {
            callback(this.status);
          }
        }
      };
      xhr.open('GET', url, true);
      xhr.send();
    },
    set: function(data, id, type, info, date) {
      if (info.search(/^false_/) != -1) {
        if (type.indexOf('json/') != -1) data = type.split('/')[1] +'('+ JSON.stringify(data) +');'; /* type.split('/')[1] = callback */
        var scr_txt = '{"id":"'+ id +'","type":"'+ type +'","update":"'+ date +'","data":"'+ localSave.replace(data.toString()) +'"}';
        localStorage.setItem(id, scr_txt);
      } else {
        data = localSave.replace(data, 'reverse');
        if (type == 'json') data = 'var '+ id +' = "'+ data +'";';
      }
      
      var elem_tag = type == 'css' ? 'style' : 'script';
      var elem_new = document.createElement(elem_tag);
      elem_new.id = id;
      elem_new.innerHTML = data;
      document.querySelector('head').appendChild(elem_new);
    },
    date: function(interval) {
      var date_time, ls_date = new Date();
      var ls_add = interval.indexOf('|') != -1 ? Number(interval.split('|')[1]) : 1;
      if (interval.search(/(year|month)s?/i) != -1) {
        var year_add = interval.search(/years?/i) != -1 ? ls_add : 0;
        var month_add = interval.search(/months?/i) != -1 ? ls_add : 0;
        ls_date.setFullYear(ls_date.getFullYear() + year_add, ls_date.getMonth() + month_add);
      } else {
        var date_num = interval.search(/weeks?/i) != -1 ? (ls_add*7*24*60*60) : interval.search(/days?/i) != -1 ? (ls_add*24*60*60) : interval.search(/hours?/i) != -1 ? (ls_add*60*60) : interval.search(/minutes?/i) != -1 ? (ls_add*60) : ls_add; /* default second */
        ls_date.setTime(ls_date.getTime() + (date_num * 1000));
      }
      return ls_date.toLocaleString();
    },
    replace: function(str, note) {
      if (note == 'reverse') {
        str = str.replace(/##x5c;##x27;/g, '\\\'').replace(/##x5c;##x22;/g, '\\\"').replace(/##x5c;##x6e;/g, '\\n').replace(/##x5c;/g, '\\').replace(/##x2f;##x2f;/g, '\/\/').replace(/##x27;/g, '\'').replace(/##x22;/g, '\"').replace(/##xa;/g, '\n');
      } else {
        str = str.replace(/\t/g, '\x20\x20').replace(/\\\'/g, '##x5c;##x27;').replace(/\\\"/g, '##x5c;##x22;').replace(/\\n/g, '##x5c;##x6e;').replace(/\\/g, '##x5c;').replace(/\/\//g, '##x2f;##x2f;').replace(/\'/g, '##x27;').replace(/\"/g, '##x22;').replace(/\n/g, '##xa;');
      }
      return str;
    },
  };
  
  /* ============================================================ */
  
  genArray = function(json) {
    var arr = [];
    for (var key in json) {
      if (key == 'check') continue;
      arr.push(json[key]);
    }
    return arr;
  };
  
  getId = function(note) {
    var id = '';
    var titleId = !el('title') ? '' : el('title').innerHTML.replace(/&#{0,1}[a-z0-9]+;/ig, '').replace(/\([^\)]+\)/g, '').replace(/\s+/g, ' ').replace(/\s((bahasa|sub(title)?)\s)?indo(nesia)?/i, '').replace(/(baca|read|download)\s/i, '').replace(/\s?(man(ga|hwa|hua)|[kc]omi[kc]s?|novel|anime)\s?/i, '\x20');
    titleId = titleId.replace(/\s?(man(ga|hwa|hua)|[kc]omi[kc]s?|novel|anime)\s?/i, '\x20'); /* multiple remove for komikid.com */
    if (!mydb_project) titleId = titleId.replace(number_t_rgx, ' ');
    titleId = titleId.replace(/[\||\-|\–|»](?:.(?![\||\-|\–|»]))+$/, '').replace(/^\s+/g, ''); //old = ^([^\||\-|\–]+)(?:\s[\||\-|\–])?
    
    var wpId = window.location.pathname.match(id_w_rgx)[1].replace(/-((bahasa|sub(title)?)-)?indo(nesia)?(-online-terbaru)?/i, '').replace(/-batch/i, '').replace(/([-_])+/g, '$1').replace(/^[\W]+/, '').replace(/(\.html?|[-_]+)$/i, '').toLowerCase();
    
    if (note == 'reader') { //id from title, bug: if title is project and contains "episode" or "chapter"
      titleId = titleId.replace(/[^\s\w]/g, '').replace(/\s+$/g, '').replace(/\s+/g, '-').toLowerCase();
      id = window.location.hostname.search(/webtoons|softkomik/i) != -1 ? wpId : titleId;
    } else if (note == 'bookmark') { //id from url
      titleId = titleId.replace(/\s+$/g, '').replace(/\|/g, '').replace(/[\n"\&\r\t\b\f]/g, '\\$&'); //JSON.escape
      id = '{"url":"'+ wpId +'","title":"'+ titleId +'"}';
      id = JSON.parse(id);
    }
    
    return id;
  };
}
  
function mydb_tools() {
  function genCSS() {
    /* css control */
    var s_str = '.cbr_mod *,.cbr_mod *:before,.cbr_mod *:after{outline:0;-webkit-box-sizing:border-box;box-sizing:border-box;}.line_text{overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}';
    
    if (typeof bakomon_web === 'undefined') {
      /* css control 2 */
      s_str += '.cbr_mod *,.cbr_mod *:before,.cbr_mod *:after{outline:0;-webkit-box-sizing:border-box;box-sizing:border-box;}.line_text{overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}.flex{display:-webkit-flex;display:flex;}.flex_wrap{display:-webkit-flex;display:flex;-webkit-flex-wrap:wrap;flex-wrap:wrap;}.f_perfect{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.7);}/* Perfect Centering: parent */.f_perfect .fp_content{margin:auto;}/* Perfect Centering: content */.f_top{-webkit-align-items:flex-start;align-items:flex-start;-webkit-align-content:flex-start;align-content:flex-start;}.f_middle{-webkit-align-items:center;align-items:center;-webkit-align-content:center;align-content:center;}.f_bottom{-webkit-align-items:flex-end;align-items:flex-end;-webkit-align-content:flex-end;align-content:flex-end;}.f_center{-webkit-justify-content:center;justify-content:center;}.f_left{-webkit-justify-content:flex-start;justify-content:flex-start;}.f_right{-webkit-justify-content:flex-end;justify-content:flex-end;}.f_grow{-webkit-flex-grow:1;flex-grow:1;}.f_between{-webkit-justify-content:space-between;justify-content:space-between;}.t_center{text-align:center;}.t_left{text-align:left;}.t_right{text-align:right;}.t_justify{text-align:justify;}.line_clamp{display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden;}.disabled,[disabled]{cursor:not-allowed !important;}.line_clamp.lc1{-webkit-line-clamp:1}';
      
      /* css main */
      s_str += '/* Custom Scrollbar */body::-webkit-scrollbar{width:15px;}body::-webkit-scrollbar-track{background:#312f40;}body::-webkit-scrollbar-thumb{background:#151515;}html,body,article{background:#151515 !important;color:#b8b8b8;-webkit-user-select:text;user-select:text;}body{position:relative !important;overflow:visible !important;}html.no-scroll,body.no-scroll{overflow:hidden !important;}';
    }
    
    /* css main 2 */
    s_str += '.mangainfo li a:visited,.komikinfo li a:visited,.animeinfo li a:visited,.animeinfo .episodelist a:visited,.wp-manga-chapter a:visited,.bixbox li a:visited,.bxcl li a:visited,#scans a:visited h3,#latestchapters .updates a:visited,#list .chapter a:visited,.chapter-container .chapter-row a:visited,.elementor-icon-list-item a:visited,.epxs a:visited,.chapter-item a:visited,.fixyear a:visited,.fixyear a:visited .year .ytps a:visited,.chli .cli a:visited,.Manga_Chapter a:visited .viewind{color:#d7382d !important;}#reader-mod,#wrap:not(.no-css) p:not([class="logo"]){background:#151515;max-width:750px !important;min-width:inherit;height:auto !important;margin:0 auto !important;display:block;float:none !important;}#reader-mod img,#wrap:not(.no-css) p:not([class="logo"]) img{width:auto;max-width:100% !important;height:auto;position:initial !important;display:block;margin:0 auto;}#content .carousel,.darex .carousel,.vezone .carousel{height:auto;max-height:100%;}#content .carousel-cell,.darex .carousel-cell,.vezone .carousel-cell{float:left;position:relative;}#content .carousel-cell img,.darex .carousel-cell img,.vezone .carousel-cell img{height:100%;}#menu li,#main-menu li{float:none;display:inline-block;}.episode-table tr td[width="100"]{width:100%;}body.manga-page .main-col .listing-chapters_wrap ul.version-chap{max-height:none;overflow:initial;}/* madara theme */.text-ui-light .site-header .c-sub-header-nav,.text-ui-light [class*="c-sidebar c-top"],.text-ui-light .profile-manga{background:#151515 !important;border-color:#3e3949 !important;}/* komikgo.com */.chapter-type-manga .c-blog-post .entry-content .entry-content_wrap .reading-content::before{position:relative;}/* manhwa-san.xyz | katakomik.site */.manhwa-san-xyz #outer-wrapper,.katakomik-site #outer-wrapper,.katakomik-site .header-header{background:#151515 !important;}.manhwa-san-xyz .blog-post.item-post h1.post-title{color:#999;}.manhwa-san-xyz .alphanx,.katakomik-site .naviarea1 .awnavi1,.funmanga-com .prev-next-post{display:flex;justify-content:space-between;}/* mangaku.club */body[class*="mangaku-"] .owl-carousel{display:block;}/* manhuaid.com */.manhuaid-com#darkbody{background:#151515 !important;}/* readcmic.blogspot.com */.readcmic-blogspot-com #outer-wrapper{background:#151515 !important;}/* komikcast.me */.is-mobile .komikcast-me .list-update_items-wrapper{display:flex;flex-wrap:wrap;}.is-mobile .komikcast-me .list-update_item{flex:initial;max-width:100%;width:50%;}/* mangabat.com */.mangabat-com .container-header-lineone,.mangabat-com .container-header-lineone a,.mangabat-com .container-silder,.mangabat-com .panel-advanced-search-tool,.mangabat-com .advanced-search-tool-genres-item,.mangabat-com .panel-breadcrumb,.mangabat-com .panel-content-homepage,.mangabat-com .panel-content-homepage a,.mangabat-com .panel-list-story,.mangabat-com .panel-list-story a,.mangabat-com .panel-story-info,.mangabat-com .panel-story-chapter-list,.mangabat-com .panel-story-chapter-list a,.mangabat-com .panel-comment,.mangabat-com .panel-topview,.mangabat-com .panel-topview a,.mangabat-com .panel-newest,.mangabat-com .panel-newest-content,.mangabat-com .panel-category,.mangabat-com .pn-category-row,.mangabat-com .pn-category-row a,.mangabat-com .panel-navigation,.mangabat-com .panel-chapter-comment,.mangabat-com .panel-chapter-info-bot,.mangabat-com .container-footer-content,.mangabat-com .container-footer-content a{background-color:#222 !important;color:#ccc !important;}.mangabat-com #panel-story-info-description{max-height:none !important;}/* nyanfm.com */.nyanfm-com.elementor-kit-12{--e-global-color-48d087d:#eee;--e-global-color-14c8a14:#ccc;--e-global-color-eb4b41d:#151515;}.nyanfm-com .container,.nyanfm-com .elementor-section{background-color:#151515 !important;}.nyanfm-com .bdt-navbar-dropdown.bdt-open,.nyanfm-com .bdt-post-block-tag-wrap span{background-color:#222 !important;}.nyanfm-com .elementor-column-wrap{background:transparent !important;}.nyanfm-com .elementor-heading-title,.nyanfm-com .bdt-navbar-nav > li > a,.nyanfm-com .bdt-social-share-text{color:#eee !important;}.nyanfm-com .elementor-button{color:#222;}.nyanfm-com .elementor-alert{border:0;}.nyanfm-com .elementor-alert-title,.nyanfm-com .elementor-alert-description{color:#333 !important;text-shadow:none !important;}/* komiku.id */.komiku-id img.lazy{opacity:.5;}.komiku-id a,.komiku-id .logo a span,.komiku-id section h2,.komiku-id .konten > section h3,.komiku-id .perapih .daftar h3{color:#ccc !important;}.komiku-id #header .hd2,.komiku-id #header nav,.komiku-id .konten > section[id],.komiku-id .ls2,.komiku-id .ls4,.komiku-id #Trending .perapih,.komiku-id #Trending .ls123m,.komiku-id #Trending .tr23,.komiku-id #Terbaru .lnn,.komiku-id #Terbaru .ls24,.komiku-id #Komik_Hot .ls2,.komiku-id #Komik_Hot .ls2l,.komiku-id #Genre .ls3,.komiku-id #Genre .ls3 a,.komiku-id #Genre .ls3 h4,.komiku-id #Mirip .mirip1,.komiku-id #Mirip .ls5b h4,.komiku-id section,.komiku-id #Judul,.komiku-id.series #Spoiler .grd,.komiku-id.series #Spoiler h4,.komiku-id #sosmed,.komiku-id #Komentar,.komiku-id #Navbawah,.komiku-id #Footer,.komiku-id.loading{background-color:#222 !important;border-color:#393939 !important;color:#ccc !important;box-shadow:none !important;}.komiku-id nav ul li a,.komiku-id .perapih .ntah,.komiku-id .perapih .daftar,.komiku-id .loop-nav.pag-nav,.komiku-id select,.komiku-id #Terbaru .vw,.komiku-id #Berita .brt,.komiku-id #Menu_Tambahan a,.komiku-id #Peringkat .ls7nm,.komiku-id.series #Judul .new1,.komiku-id.series #Informasi table.inftable td:nth-child(1),.komiku-id.series #Informasi ul.genre li,.komiku-id.series .mnu button.tab:not(.curr),.komiku-id.series #Chapter #Daftar_Chapter tbody th,.komiku-id.chapter #Judul table.tbl tr:nth-child(1) td,.komiku-id .pagination a,.komiku-id #rakbuku .rakbuku,.komiku-id .ls2 .nani{background-color:#343434 !important;border-color:#393939 !important;color:#ccc !important;box-shadow:none !important;}.komiku-id .perapih .daftar .new1 a,.komiku-id .loop-nav.pag-nav a,.komiku-id #genr li a{color:#333 !important;}.komiku-id ::-webkit-scrollbar-track{background:#343434 !important;}.komiku-id ::-webkit-scrollbar-thumb{background:#b8b8b8 !important;}/* webtoons.com */.webtoons-com:not(.read-mode) img,#mainBannerList,.webtoons-com .detail_bg{opacity:0.9 !important;}.webtoons-com #wrap a,.webtoons-com #wrap p,#wrap .main_hotnew h2,#wrap .title_area h2,#wrap .grade_num{color:#838383 !important;}#wrap #header,#wrap .main_ad_area,#wrap .snb_wrap,#wrap #container.bg,#wrap .detail_body .detail_lst,#wrap .detail_body .detail_install_app,#wrap .detail_body .detail_lst li,#wrap .detail_body .aside.detail,#wrap .detail_body .detail_paywall,#wrap .main_daily_wrap,#wrap .daily_tab_wrap,#wrap .main_hotnew_wrap,#wrap .main_genre_wrap,#wrap .main_challenge,#wrap .lst_type1 li,#wrap #footer,#wrap .notice_area,#wrap .foot_app,#wrap .discover_lst li,#wrap .ranking_tab,#wrap .ranking_tab li,#wrap .lst_type1,#wrap .daily_head,#wrap .daily_card_item,#wrap .daily_card,#wrap .daily_card li,#wrap #cbox_module,#wrap .u_cbox .u_cbox_comment_box,#wrap .u_cbox a,#wrap footer,.is-mobile #wrap .lst_item,.is-mobile #wrap .challenge_list,.is-mobile #wrap .my_loading_wrap,.is-mobile #wrap .loader_wrap,.is-mobile #wrap .main_notice,.is-mobile #wrap .detail_white li,.is-mobile #wrap .detail_white .num{background-color:#151515 !important;border-color:#000 !important;color:#838383 !important;}#wrap .card_item .card_back,#wrap .daily_tab li.on .btn_daily,#wrap .main_challenge .title_area .btnarea a,#wrap .snb li.on a,#wrap .ranking_tab li.on a,#wrap .daily_section.on,#wrap .episode_area{background-color:#2f2f2f !important;color:#838383 !important;}.is-mobile #wrap header{background-color:#f5f5f5;}.is-mobile .webtoons-com #reader-mod{padding-top:50px;}/* display none */a[href*="agacelebir.com"][style*="fixed"],.themesia #teaser3,.themesia #wp-bottom-menu,.themesia .readingnav,.pemudanolep #tombolNextPrev,center a[href*="mangatoon"],.kln:not(.blox),.kln.mlb,html body [class*="iklan"],#footer2,noscript,#ftads,.c-sub-header-nav.sticky,#navkanan[class*="scroll"],#bottom-banner-ads,footer.perapih.chf,.restrictcontainer,.adult-content #adult_modal,.adult-content .modal-backdrop,#Notifikasi,.komikcast-me [class*="komik_info-alert"],.manhuaid-com img[alt^="Aplikasi"],.mangayu-com .swal2-container,body[class*="komiku-"] #continue,body[class*="komiku-"] #history2,.is-mobile .webtoons-com #_appDownloadPopup,.is-mobile .webtoons-com #toolbarEpisodeListArea,.is-mobile .webtoons-com #loadingDiv,.mangabat-com #panel-description-linear{display:none !important;visibility:hidden !important;opacity:0 !important;}.hidden-items{position:fixed;top:-9999px;left:-9999px;}/* exception */.judulseries .iklan{display:block !important;visibility:visible !important;opacity:1 !important;}';
    
    // replace chatango z-index
    s_str += 'iframe[src*="chatango.com"]{z-index:214748364 !important}';
    
    //if (el('.preloader .loading')) alert('test'), el('.preloader .loading').parentElement.style.cssText = 'display:none !important';
    
    var s_elem = document.createElement('style');
    s_elem.type = 'text/css';
    s_elem.id = '_style';
    s_elem.innerHTML = s_str;
    document.body.appendChild(s_elem);
  }
  
  function genObject(data) {
    var my_txt = '[';
    for (var i = 0; i < data.length; i++) {
      my_txt += '{"source":'+ JSON.stringify(data[i]) +'}';
      if (i < data.length-1) my_txt += ',';
    }
    my_txt += ']';
    return my_txt;
  }
  
  sourceChange = function() {
    var sc_obj = {update: new Date().getTime()}; /* name: value */
    firebase.app(fbase_app).database().ref('bookmark/source').update(sc_obj, (error) => {
      if (error) {
        alert('!! Error: sourceChange(');
      } else {
        mydb_change = true;
        sourceGen('change');
      }
    });
  };
  
  sourceGen = function(note) {
    if (!mydb_change) return;
    mydb_change = false;
    
    firebase.app(fbase_app).database().ref('bookmark/source').once('value').then(function(snapshot) {
      var data = snapshot.val();
      /*var sc_txt = '{"anime":'+ genObject(genArray(data.anime)) +',"comic":'+ genObject(genArray(data.comic)) +',"novel":'+ genObject(genArray(data.novel)) +'}';*/
      var sc_txt = JSON.stringify(data);
      localStorage.setItem('mydb_source_data', sc_txt);
      crossStorage.set('mydb_source_data', sc_txt);
      mydb_source = data;
      if (note != 'change') startSource();
    });
  };
  
  function autoLogin() {
    mydb_info['fbase_auto_login'] = 'true';
    
    /* Check login source: https://youtube.com/watch?v=iKlWaUszxB4&t=102 */
    firebase.app(fbase_app).auth().onAuthStateChanged(function(user) {
      mydb_login = user ? true : false;
    });
    
    var al_chk = setInterval(function() {
      if (typeof mydb_login !== 'undefined') {
        clearInterval(al_chk);
        if (mydb_login === false) {
          if (mydb_settings.login_data.email == '' || mydb_settings.login_data.password == '') {
            alert('!! Error: firebase login\nlogin_email or login_pass is empty');
          } else {
            /* auto login firebase */
            firebase.app(fbase_app).auth().signInWithEmailAndPassword(mydb_settings.login_data.email, mydb_settings.login_data.password).then((user) => {
              console.log('Firebase: logged-in');
            }).catch(function(error) {
              console.error('!! Error: function autoLogin(, code: '+ error.code +', message: '+ error.message);
              alert('!! Error: function autoLogin(\n'+ error.message);
              if (!mydb_support || (mydb_support && mydb_support.indexOf(mydb_spt_message) == -1)) callScript('error autoLogin(');
            });
          }
        }
      }
    }, 100);
  }
  
  function fbaseInit() {
    if (firebase.apps.length == 0) {
      /* Initialize new app with different name https://stackoverflow.com/a/37603526/7598333 */
      firebase.initializeApp(fbase_config, fbase_app);
    } else {
      var fbase_rgx = new RegExp(`\^${fbase_app}\$`, 'i');
      var fbase_chk = firebase.apps.map(item => { return item.name_.search(fbase_rgx) != -1 }).includes(true);
      if (fbase_chk) {
        console.warn(`Firebase: Firebase App named '${fbase_app}' already exists`);
      } else {
      /* Initialize new app with different name https://stackoverflow.com/a/37603526/7598333 */
      firebase.initializeApp(fbase_config, fbase_app);
      }
    }
  }
  
  function fbaseLoad(note) {
    if (typeof firebase == 'undefined') {
      mydb_fbase_app = true;
      addScript({data:`https://www.gstatic.com/firebasejs/${fbase_ver}/firebase-app.js`}).catch(() => {
        /* only use catch() :
        - https://stackoverflow.com/a/36213268/7598333
        - https://javascript.info/promise-basics#catch
        */
        clearInterval(lf_chk);
        console.error('!! Error: can\'t load firebase.');
        if (!mydb_support || (mydb_support && mydb_support.indexOf(mydb_spt_message) == -1)) callScript('error fbaseLoad(');
      });
    } else {
      mydb_fbase_app = true;
    }
    
    var lf_chk = setInterval(function() {
      if (typeof firebase !== 'undefined') {
        clearInterval(lf_chk);
        mydb_info['fbase_app'] = 'loaded';
        fbaseInit();
        if (typeof firebase.database == 'undefined') addScript({data:`https://www.gstatic.com/firebasejs/${fbase_ver}/firebase-database.js`});
        var db2_chk = setInterval(function() {
          if (typeof firebase.database !== 'undefined') {
            clearInterval(db2_chk);
            mydb_info['fbase_database'] = 'loaded';
            if (typeof firebase.auth == 'undefined') addScript({data:`https://www.gstatic.com/firebasejs/${fbase_ver}/firebase-auth.js`});
            var db3_chk = setInterval(function() {
              if (typeof firebase.auth !== 'undefined') {
                clearInterval(db3_chk);
                mydb_info['fbase_auth'] = 'loaded';
                mydb_fbase_loaded = true;
                console.log('Firebase: all loaded');
                if (mydb_settings.auto_login && typeof bakomon_web === 'undefined') autoLogin();
              }
            }, 100);
          }
        }, 100);
      }
    }, 100);
  }
  
  function localJSDataMOD(data, url, id, type, date) {
    if (data && (data != 'null' && data != 'error')) {
      var cr_data = JSON.parse(data);
      if (cr_data.update == date) {
        localSave.set(cr_data.data, id, type, 'MOD');
      } else {
        localJSDataMOD(false, url, id, type, date);
      }
    } else {
      localSave.get(url, function(res) {
        localSave.set(res.toString(), id, type, 'MOD');
        var cr_data = '{"id":"'+ id +'","type":"'+ type +'","update":"'+ date +'","data":"'+ localSave.replace(res.toString()) +'"}';
        crossStorage.set(id, cr_data);
      });
    }
  }
  
  function callScript(note) {
    if (mydb_database || (mydb_type && note.search(/^error/) == -1)) {
      if (live_test_custom) {
        var x_chk = setInterval(function() {
          if (typeof mydb_x_fnc !== 'undefined') {
            clearInterval(x_chk);
            mydb_x_fnc();
          }
        }, 100);
      } else {
        crossStorage.get('mydb_tools_custom', function(res) {
          localJSDataMOD(res, url_js_custom, 'mydb_tools_custom', 'js', local_interval);
        });
      }
      
      if (mydb_type) {
        mydb_type_bkp = mydb_type;
        mydb_spt_info = '{"support":"true","note":"'+ mydb_spt_message +'"}';
        localStorage.setItem('mydb_tools_support', mydb_spt_info);
        
        /* add class to body from source: status, tag, theme */
        var s_data = mydb_source[mydb_type][w_host];
        var s_class = s_data['status'] +','+ s_data['tag'] +','+ s_data['theme'];
        s_class = s_class.replace(/,+/, ',').replace(/,$/, '');
        s_class = s_class.split(',');
        for (var i in s_class) {
          document.body.classList.add(s_class[i]);
        }
        genCSS();
        mydb_loaded = true;
        
        /* load reader_js */
        mydb_info['reader_js'] = 'wait';
        if (live_test_comic_r) {
          var cr_chk = setInterval(function() {
            if (typeof mydb_cr_fnc !== 'undefined') {
              clearInterval(cr_chk);
              mydb_cr_fnc();
            }
          }, 100);
        } else {
          if (mydb_type == 'comic') {
            var cr_id = `mydb_tools_${mydb_type}_reader`;
            var cr_type = 'js';
            
            /* old
            localSave.load(url_js_comic_reader, cr_id, cr_type, local_interval); */
            
            /* new */
            crossStorage.get(cr_id, function(res) {
              localJSDataMOD(res, url_js_comic_reader, cr_id, cr_type, local_interval);
            });
          }
        }
        
        /* load bookmark_js */
        var reader_chk = setInterval(function() {
          if (typeof mydb_read !== 'undefined') {
            clearInterval(reader_chk);
            var chk_cf = el('h1 [data-translate="checking_browser"]') || el('h1 .cf-error-type') || el('meta[name="captcha-bypass"]'); /* cloudflare */
            var is_cf = chk_cf ? true : false;
            if (!is_cf && (!mydb_read || mydb_settings.bmark_reader)) {
              mydb_info['bookmark_js'] = 'wait';
              if (!mydb_fbase_app) fbaseLoad('bookmark');
              if (live_test_bookmark) {
                var bm_chk = setInterval(function() {
                  if (typeof mydb_bm_fnc !== 'undefined') {
                    clearInterval(bm_chk);
                    mydb_bm_fnc();
                  }
                }, 100);
              } else {
                var bm_id = 'mydb_tools_bookmark';
                var bm_type = 'js';
                
                /* old
                localSave.load(url_js_bookmark, bm_id, bm_type, local_interval); */
                
                /* new */
                crossStorage.get(bm_id, function(res) {
                  localJSDataMOD(res, url_js_bookmark, bm_id, bm_type, local_interval);
                });
              }
            }
          }
        }, 100);
      } else {
        mydb_info['reader_js'] = 'false';
        mydb_info['bookmark_js'] = 'false';
      }
    } else {
      mydb_info['support'] = false;
      mydb_info['error'] = JSON.parse('{"mydb_type":"'+ mydb_type +'","note":"'+ note +'"}');
      mydb_spt_info = '{"support":"false","note":"'+ note +'"'+ (typeof mydb_type !== 'undefined' ? (',"type":"'+ mydb_type +'"') : '') +'}';
      localStorage.setItem('mydb_tools_support', mydb_spt_info); /* not support */
      console.log('mydb_support: false');
      if (el('#_loader')) {
        el('#_loader .sl-info').innerHTML = '<span class="sl-not">⚠️</span>';
        setTimeout(function() { el('#_loader').parentElement.removeChild(el('#_loader')); }, 2000);
      }
    }
  }
  
  function getType(prop) {
    var data = mydb_source[prop];
    for (var site in data) {
      if (data[site]['host'].indexOf(w_host) != -1 || data[site]['domain'].indexOf(w_host) != -1) {
        mydb_info['type'] = prop;
        w_host = data[site]['host'].replace(/\./g, '-');
        localStorage.setItem('mydb_tools_type', '{"type":"'+ prop +'","id":"'+ w_host +'"}');
        return prop;
      }
    }
    return false;
  }
  
  function startSource() {
    var ss_local = localStorage.getItem('mydb_tools_type');
    var ss_prop = ['anime','comic','novel'];
    
    /* check type & source */
    if (ss_local && ss_local.search(/anime|comic|novel/) != -1) {
      var ss_data = JSON.parse(ss_local);
      w_host = ss_data.id;
      mydb_type = ss_data.type;
    } else {
      for (var i = 0; i < ss_prop.length; i++) {
        var data = getType(ss_prop[i]);
        if (data) {
          mydb_type = data;
          break;
        }
        if (i == ss_prop.length-1) mydb_type = false;
      }
    }

    var ss_chk = setInterval(function() {
      if (typeof mydb_type !== 'undefined') {
        clearInterval(ss_chk);
        callScript('source');
      }
    }, 100);
  }
  
  sourceCheck = function(note, data) {
    if (!mydb_support && data == 'error') {
      mydb_spt_info = '{"support":"false","note":"<iframe> failed to load"}';
      localStorage.setItem('mydb_tools_support', mydb_spt_info); /* not support */
      return;
    }
    mydb_info['source'] = note;
    if (data && (data != 'null' && data != 'error')) {
      data = JSON.parse(data);
      if (note == 'fbase' || note == 'after') {
        firebase.app(fbase_app).database().ref('bookmark/source/update').once('value').then(function(snapshot) {
          if (data.update != snapshot.val()) {
            console.log('mydb: update new source');
            var sc_note = note == 'after' ? 'change' : 'new';
            mydb_change = true;
            sourceGen(sc_note);
          } else {
            mydb_source = data;
            if (note != 'after') startSource();
          }
        });
      } else {
        mydb_source = data;
        if (note != 'after') startSource();
      }
    } else {
      console.log('mydb: generate new source');
      var sc_note = note == 'after' ? 'change' : 'start';
      mydb_change = true;
      if (note == 'fast_mode') {
        fbaseLoad('start');
        var sc_check = setInterval(function() {
          if (mydb_fbase_loaded) {
            clearInterval(sc_check);
            sourceGen(sc_note);
          }
        }, 100);
      } else {
        sourceGen(sc_note);
      }
    }
  };
  
  function startLoading() {
    var sl_html = document.createElement('div');
    sl_html.id = '_loader';
    sl_html.style.cssText = 'position:fixed;bottom:-1px;left:-1px;z-index:2147483642;'; //2147483647
    sl_html.innerHTML = '<style>.sl-info{display:-webkit-flex;display:flex;width:40px;height:40px;background:#252428;border:1px solid #3e3949;}.sl-not{font-size:20px;margin:0 auto;}.sl-loader{margin:auto;border:4px solid #ddd;border-top:4px solid #3498db;border-radius:50%;width:20px;height:20px;-webkit-animation:sl-spin 2s linear infinite;animation:sl-spin 2s linear infinite;}@-webkit-keyframes sl-spin{0%{-webkit-transform:rotate(0deg);}100%{-webkit-transform:rotate(360deg);}}@keyframes sl-spin{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}</style>';
    sl_html.innerHTML += '<div class="sl-info"><div class="sl-loader"></div></div>';
    document.body.appendChild(sl_html);
  }
  
  
  var wl = window.location;
  var wh = wl.hostname;
  var wp = wl.pathname;
  var w_host = wh.replace(wh_rgx, '');
  document.body.classList.add(w_host.replace(/\./g, '-'));
  mydb_support = localStorage.getItem('mydb_tools_support');
  
  for (var i = 0; i < mydb_db_list.length; i++) {
    if (w_host.indexOf(mydb_db_list[i]) != -1) {
      mydb_database = true;
      break;
    }
  }
  
  if ((mydb_support && mydb_support.indexOf('false') != -1 && !mydb_database) || document.head.innerHTML == '' || mydb_content_type.indexOf('/html') == -1) return;
  
  mydb_info['support'] = 'true';
  startLoading();
  mydb_tools_fnc();
  mydb_reader = wp.search(number_w_rgx) != -1 || wl.search.search(number_w_rgx) != -1 || el('title') && el('title').innerHTML.search(number_t_rgx) != -1;
  
  /* START - check source via crossStorage */
  crossStorage.load(); /* init */
  if ((!mydb_reader && mydb_settings.server_check.source_bm) || mydb_settings.server_check.source_cr) {
    fbaseLoad('start');
    var sc_check = setInterval(function() {
      if (mydb_fbase_loaded) {
        clearInterval(sc_check);
        crossStorage.get('mydb_source_data', function(res){ sourceCheck('fbase', res); });
      }
    }, 100);
  } else {
    crossStorage.get('mydb_source_data', function(res){ sourceCheck('fast_mode', res); });
  }
}


/* temporary
var host_rgx = /(oploverz|webtoons|mangaku|mangaindo|komikstation|komikcast|westmanga|mangakita|mangashiro|mangacanblog|maid|ngomik|mangakyo|kiryuu|komikav|komiku|manhwa-san|matakomik|komikid|kombatch|mangceh|sektekomik|manhuaid|pojokmanga|sheamanga|klikmanga|bacakomik|mangayu|klankomik|boosei|comicfx|yuumanga|wordhero|gurukomik|masterkomik|kaisarkomik|softkomik|katakomik|mgkomik|kumamanga|komikru|komikindo|komiknesia|mangakane|tenseiscans|komikempus|kurutonime|nekomik|manhwaindo|wrt|mangacdn|wib|gabutscans|daveyscans|jscanla|nyanfm|mangapark|mangadex|mangabat|zeroscans|readmanhua|readmng|hatigarmscan[sz]|funmanga|bato|leviatanscans|merakiscans|mangarawr|toonily|mangasushi|reaperscans|asurascans|secretscans|rawdevart|azoramanga|animesc-kun|readcmic|mangapaus|ninkomik)\.((blogspot|wordpress)\.)?((co|my|web)(m|\.id)?|net|org|me|in|tv|id|to|jp|bz|pw|nl|info|xyz|pro|site|club)\/?(.*)/i;
*/

/* remove old data, temporary */
if (localStorage.getItem('mydb_tools_anime_reader')) localStorage.removeItem('mydb_tools_anime_reader');
if (localStorage.getItem('mydb_tools_comic_reader')) localStorage.removeItem('mydb_tools_comic_reader');
if (localStorage.getItem('mydb_tools_novel_reader')) localStorage.removeItem('mydb_tools_novel_reader');
if (localStorage.getItem('mydb_tools_bookmark')) localStorage.removeItem('mydb_tools_bookmark');
if (localStorage.getItem('comic_tools_bookmark')) localStorage.removeItem('comic_tools_bookmark');
if (localStorage.getItem('comic_tools_reader')) localStorage.removeItem('comic_tools_reader');
if (localStorage.getItem('comic_tools_list')) localStorage.removeItem('comic_tools_list');
if (localStorage.getItem('mydb_tools_source')) localStorage.removeItem('mydb_tools_source');
if (localStorage.getItem('mydb_source_check')) localStorage.removeItem('mydb_source_check');
if (localStorage.getItem('mydb_source_data')) localStorage.removeItem('mydb_source_data');
if (localStorage.getItem('mydb_anime_list')) localStorage.removeItem('mydb_anime_list');
if (localStorage.getItem('mydb_comic_list')) localStorage.removeItem('mydb_comic_list');
if (localStorage.getItem('mydb_novel_list')) localStorage.removeItem('mydb_novel_list');
if (localStorage.getItem('mydb_support')) localStorage.removeItem('mydb_support');
if (document.cookie.match(RegExp('(?:^|;\\s*)reader-zoom=([^;]*)'))) document.cookie = 'reader-zoom=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';


/* ============================================================ */
var fbase_app = 'bakomon';
var fbase_ver = '8.10.0';
/* Firebase configuration for Firebase JS SDK v7.20.0 and later, measurementId is optional */
var fbase_config = {
  apiKey: "AIzaSyBma6cWOGzwSE4sv8SsSewIbCjTPhm7qi0",
  authDomain: "bakomon99.firebaseapp.com",
  databaseURL: "https://bakomon99.firebaseio.com",
  projectId: "bakomon99",
  storageBucket: "bakomon99.appspot.com",
  messagingSenderId: "894358128479",
  appId: "1:894358128479:web:6fbf2d52cf76da755918ea",
  measurementId: "G-Z4YQS31CXM"
};
/* ============================================================ */
var cross_window;
var cross_callbacks = {};
var cross_origin = 'coreaz';
var cross_url = 'https://readanimanga.blogspot.com';
var cross_frame = cross_url.replace(/\/$/, '') +'/p/bakomon.html';
/* ============================================================ */
var wh_rgx = /^(w{3}|web|m(obile)?|read|data)\./i;
var number_t_rgx = /\s(ch\.?(ap(ter)?)?|eps?\.?(isodes?)?)(\s?\d+(\s?[-\.]\s?\d+)?|\s)/gi; /* check id from <title> */
var number_w_rgx = /(\/|\-|\_|\d+)((ch|\/c)(ap(ter)?)?|epi?(sodes?)?)(\/|\-|\_|\d+)/i; /* check id from window.location */
var id_w_rgx = /\/(?:(?:baca-)?(?:man(?:ga|hwa|hua)|baca|read|novel|anime|tv|download|[a-z]{2}\/[^\/]+|(?:title|series|[kc]omi[kc]s?)(?:\/\d+)?|(?:\d{4}\/\d{2})|p)[\/\-])?([^\/\n]+)\/?(?:list)?/i; /* id from window.location */
var skip1_rgx = /^\/(p\/)?((daftar|search(\/label)?|type|latest|list|baca|all|account)[-\/])?(\w{1,2}|pro[yj]e(k|ct)|[kc]omi[kc]s?|man(ga|hwa|hua)|popul[ea]r|genres?|type|release|az|staff|update|series?|(my)?bookmarks?|apps?|[kc]onta(k|ct)|blog|pustaka|search|about|tentang|register)([-\.\/](lists?|terbaru|berwarna|author|artist|us|kami|page\/\d+|html|wrt))?\/?$/i;
var skip2_rgx = /^\/(([kc]omi[kc]s?|man(ga|hwa|hua))-)?(genres?|tag|category|list|release|author|artist)\/.*\/?$/i;
/* ============================================================ */
/* mydb is for global variable */
var mydb_reader, mydb_login, mydb_source, mydb_type, mydb_type_bkp, mydb_read, mydb_zoom, mydb_support, mydb_spt_info;
var mydb_loaded = false;
var mydb_fbase_app = false; //check if firebase function has been called
var mydb_fbase_loaded = false;
var mydb_bm_loaded = false;
var mydb_cr_loaded = false;
var mydb_x_loaded = false;
var mydb_change = false;
var mydb_project = false;
var mydb_database = false;
var mydb_content_type = checkContentType();
var mydb_select = 'list';
var mydb_spt_message = '🎉 supported site 🎉';
var mydb_db_list = ['mangadex','mangaupdates','myanimelist','anilist','anidb'];
var mydb_info = {"error":{},"support":"","source":"","type":"","fbase_app":"","fbase_database":"","fbase_auth":"","fbase_auto_login":"","reader_js":"","bookmark_js":""};
var mydb_blocked = ['\x6a\x6f\x73\x65\x69','\x79\x61\x6f\x69','\x79\x75\x72\x69','\x73\x68\x6f\x75\x6a\x6f\x5f\x61\x69','\x73\x68\x6f\x75\x6e\x65\x6e\x5f\x61\x69','\x65\x63\x63\x68\x69','\x76\x69\x6f\x6c\x65\x6e\x63\x65','\x73\x6d\x75\x74','\x68\x65\x6e\x74\x61\x69','\x67\x65\x6e\x64\x65\x72\x5f\x62\x65\x6e\x64\x65\x72','\x67\x65\x6e\x64\x65\x72\x5f\x73\x77\x61\x70','\x6f\x6e\x65\x5f\x73\x68\x6f\x74'];
var mydb_settings = typeof mydb_via !== 'undefined' ? mydb_via_settings : {"bmark_reader":false,"auto_login":true,"login_data":{"email":"","password":""},"new_tab":{"bm_list":true,"bs_list":true},"number_title":false,"server_check":{"source_bm":false,"source_cr":false,"bm_list":false},"remove_site":{"bookmark":true,"history":true},"number_reader":true,"mod_disqus":true,"read_project":false,"remove_statically":false};
/* 
- bmark_reader = show bookmark on comic reader
- new_tab.bm_list = open link in new tab on bookmark list (bm_list)
- new_tab.bs_list = open link in new tab on search list (bs_list)
- number_title = add [number] chapter/episode to <title>
- server_check.source_bm = check if source data updated on bookmark
- server_check.source_cr = check if source data updated on comic reader
- server_check.bm_list = check if bm_list data updated (date)
- remove_site.bookmark = remove localStorage bookmark
- remove_site.history = remove localStorage history
- number_reader = show index number on comic reader
*/
/* ============================================================ */
var local_interval = 'manual|9/27/2022, 7:49:04 AM';
var url_js_bookmark = 'https://cdn.jsdelivr.net/gh/bakomon/mydb@master/bookmark/mydb-bookmark.js';
var url_js_comic_reader = 'https://cdn.jsdelivr.net/gh/bakomon/mydb@master/reader/comic-reader.js';
var url_js_custom = 'https://cdn.jsdelivr.net/gh/bakomon/mydb@master/tools/mydb-custom.js';
var url_update = 'https://cdn.jsdelivr.net/gh/bakomon/mydb@master/update.txt';
var live_test_bookmark = false;
var live_test_comic_r = false;
var live_test_custom = false;
/* 
- use "https://cdn.statically.io" or "https://cdn.jsdelivr.net"
- jsdelivr purge cache: 
  - https://purge.jsdelivr.net/gh/YOUR_PACKAGE@VERSION/foo/bar
  - https://purge.jsdelivr.net/npm/YOUR_PACKAGE@VERSION/foo/bar
- gitcdn last commit: https://gitcdn.herokuapp.com/cdn/USER/YOUR_PACKAGE/LATEST_COMMIT/foo/bar
*/

if (typeof el !== 'undefined' && typeof bakomon_web === 'undefined') {
  mydb_spt_info = '{"support":"false","note":"el( function exist"}';
  localStorage.setItem('mydb_tools_support', mydb_spt_info); /* not support */
} else {
  /* global variables */
  var global_arr = ['el','openInNewTab','addScript','isMobile','crossStorage','genArray','sourceGen','sourceChange','localSave','getId','sourceCheck'];
  for (var g = 0; g < global_arr.length; g++) {
    window[global_arr[g]];
  }
}

if (isMobile()) {
  /* mobile browser support custom javascript */
  document.documentElement.classList.add('is-mobile');
  window.addEventListener('DOMContentLoaded', mydb_tools);
} else {
  mydb_tools(); /* "DOMContentLoaded" already on extension "User JavaScript and CSS" */
  /* window.addEventListener('DOMContentLoaded', mydb_tools); */
}
