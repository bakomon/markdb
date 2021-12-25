/* Detect mobile device https://stackoverflow.com/a/11381730/7598333 */
function isMobile() {
  var ua = navigator.userAgent || navigator.vendor || window.opera;
  return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(ua)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(ua.substr(0, 4));
};

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
  openInNewTab = function(url) {
    var _iframe = document.createElement('iframe');
    document.documentElement.appendChild(_iframe);
    
    var _window = _iframe.contentWindow;
    window.nativeOpen = _window.open;
    window.nativeOpen(url);
    
    _iframe.parentElement.removeChild(_iframe);
  }
  
  /* Add script to head https://codepen.io/sekedus/pen/QWKYpVR */
  addScript = function(n,o,t,e,s) {
    /* if a <script> tag failed to load https://stackoverflow.com/a/44325793/7598333 */
    return new Promise(function (resolve, reject) {
      /* data, id, info, boolean, parent */
      var js_async = e === true || t === true || o === true;
      var js_new = document.createElement('script');
      if (o && typeof o === 'string' && o.indexOf('#') != -1) js_new.id = o.replace(/#/, '');
      js_new.async = js_async;
      if (t == 'in' || o == 'in') {
        js_new.type = 'text/javascript';
        js_new.innerHTML = n;
      } else {
        js_new.src = n;
      }
      var parent = s || e || t || o;
      parent = parent && parent.tagName ? parent : document.querySelector('head');
      parent.appendChild(js_new);
      
      js_new.addEventListener('load', resolve);
      js_new.addEventListener('error', reject);
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
        if (e.origin == cross_url && e.data.match(/cross__/i) && e.data.indexOf('cross_test') == -1) {
          clearTimeout(cross_chk);
          var get_data = JSON.parse(e.data);
          get_data.key = get_data.key.replace(/^cross__/, '');
          crossStorage.write(get_data.key, get_data.data);
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
    write: function(key, data) {
      cross_callbacks[key].forEach(function(callback) {
        callback(data);
        cross_callbacks[key].splice(callback, 1); //remove value from array after callback
      });
    },
    set: function(key, data) {
      /* save data to subdomain localStorage */
      data = JSON.stringify(data);
      var l_obj = '{"method":"set","key":"'+ key +'","origin":"'+ cross_origin +'","data":'+ data +'}';
      crossStorage.wait(function(){cross_window.postMessage(l_obj, '*')});
    },
    get: function(key, callback) {
      if (!cross_callbacks[key]) {
        cross_callbacks[key] = [];
      }
      cross_callbacks[key].push(callback);
      
      /* load saved data from subdomain localStorage */
      var l_obj = '{"method":"get","key":"'+ key +'","origin":"'+ cross_origin +'"}';
      crossStorage.wait(function(){cross_window.postMessage(l_obj, '*')});
      crossStorage.check(key, function(res){callback(res)});
    },
    remove: function(key) {
      /* remove data from subdomain localStorage */
      var l_obj = '{"method":"remove","key":"'+ key +'","origin":"'+ cross_origin +'"}';
      crossStorage.wait(function(){cross_window.postMessage(l_obj, '*')});
    },
    check: function(key, callback) {
      cross_chk = setTimeout(function() {
        console.error(`!!Error crossStorage: can\'t get "${key}" data from iframe.`);
        callback('error');
      }, 8000);
    }
  };
  
  /* loadXMLDoc (XMLHttpRequest) https://codepen.io/sekedus/pen/vYGYBNP */
  function ls_loadXMLDoc(url, callback, info) {
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
  };
  
  function ls_replaceData(str, note) {
    if (note) { /* reverse */
      str = str.replace(/##x5c;##x27;/g, '\\\'').replace(/##x5c;##x22;/g, '\\\"').replace(/##x5c;##x6e;/g, '\\n').replace(/##x5c;/g, '\\').replace(/##x2f;##x2f;/g, '\/\/').replace(/##x27;/g, '\'').replace(/##x22;/g, '\"').replace(/##xa;/g, '\n');
    } else {
      str = str.replace(/\t/g, '\x20\x20').replace(/\\\'/g, '##x5c;##x27;').replace(/\\\"/g, '##x5c;##x22;').replace(/\\n/g, '##x5c;##x6e;').replace(/\\/g, '##x5c;').replace(/\/\//g, '##x2f;##x2f;').replace(/\'/g, '##x27;').replace(/\"/g, '##x22;').replace(/\n/g, '##xa;');
    }
    return str;
  }
  
  function ls_getData(data, id, type, info, date) {
    if (info == 'reverse') {
      data = ls_replaceData(data, info);
      if (type == 'json') data = 'var '+ id +' = "'+ data +'";';
    } else {
      if (type.indexOf('json/') != -1) data = type.split('/')[1] +'('+ JSON.stringify(data) +');'; /* type.split('/')[1] = callback */
      var scr_txt = '{"update":"'+ date +'","data":"'+ ls_replaceData(data.toString()) +'"}';
      localStorage.setItem(id, scr_txt);
    }
    
    var elem_tag = type == 'css' ? 'style' : 'script';
    var elem_new = document.createElement(elem_tag);
    elem_new.id = id;
    elem_new.innerHTML = data;
    document.querySelector('head').appendChild(elem_new);
  }
  
  function ls_genDate(interval) {
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
  }
  
  /* Save css, js, json to localStorage with Expiration https://codepen.io/sekedus/pen/LYbBagK */
  ls_saveLocal =  function(url, id, type, interval) {
    var ls_interval = interval || 'permanent';
    var ls_update = ls_interval.search(/manual\|/i) != -1 ? ls_interval.split('|')[1] : ls_genDate(ls_interval); /* default second+1 */
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
          ls_getData(data_local.data, id, type, 'reverse');
        } else {
          console.log('ls_data: false time');
          localStorage.removeItem(id);
          ls_loadXMLDoc(url, function(res){ ls_getData(res, id, type, 'change_time', ls_update); });
        }
      } else {
        console.log('ls_data: false undefined');
        localStorage.removeItem(id);
        ls_loadXMLDoc(url, function(res){ ls_getData(res, id, type, 'undefined', ls_update); });
      }
    } else {
      console.log('ls_data: false');
      ls_loadXMLDoc(url, function(res){ ls_getData(res, id, type, 'not_found', ls_update); });
    }
  }
  
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
    //old = ^([^\||\-|\–]+)(?:\s[\||\-|\–])?
    var id = '';
    var titleId = !el('title') ? '' : el('title').innerHTML.replace(/&#{0,1}[a-z0-9]+;/ig, '').replace(/\([^\)]+\)/g, '').replace(/\s+/g, ' ').replace(/\s((bahasa|sub(title)?)\s)?indo(nesia)?/i, '').replace(/(baca|read|download)\s/i, '').replace(/\s?(man(ga|hwa|hua)|[kc]omi[kc]|novel|anime)\s?/i, '\x20').replace(number_t_rgx, ' ').replace(/[\||\-|\–|»](?:.(?![\||\-|\–|»]))+$/, '').replace(/^\s+/g, '');
    var wpId = window.location.pathname.match(id_w_rgx)[1].replace(/-((bahasa|sub(title)?)-)?indo(nesia)?(-online-terbaru)?/i, '').replace(/-batch/i, '').replace(/([-_])+/g, '$1').replace(/^[\W]+/, '').replace(/(\.html?|[-_]+)$/i, '').toLowerCase();
    
    if (note == 'reader') {
      titleId = titleId.replace(/[^\s\w]/g, '').replace(/\s+$/g, '').replace(/\s+/g, '-').toLowerCase();
      id = wh.search(/webtoons|softkomik/i) != -1 ? wpId : titleId;
    } else if (note == 'bookmark') {
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
    var s_str = '.cbr_mod *,.cbr_mod *:before,.cbr_mod *:after{outline:0;-webkit-box-sizing:border-box;box-sizing:border-box;}.line_text{overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}.flex{display:-webkit-flex;display:flex;}.flex_wrap{display:-webkit-flex;display:flex;-webkit-flex-wrap:wrap;flex-wrap:wrap;}.flex_perfect{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.7);}/* Perfect Centering: parent */.flex_perfect .fp_content{margin:auto;}/* Perfect Centering: content */.f_top{-webkit-align-items:flex-start;align-items:flex-start;-webkit-align-content:flex-start;align-content:flex-start;}.f_middle{-webkit-align-items:center;align-items:center;-webkit-align-content:center;align-content:center;}.f_bottom{-webkit-align-items:flex-end;align-items:flex-end;-webkit-align-content:flex-end;align-content:flex-end;}.f_center{-webkit-justify-content:center;justify-content:center;}.f_left{-webkit-justify-content:flex-start;justify-content:flex-start;}.f_right{-webkit-justify-content:flex-end;justify-content:flex-end;}.f_grow{-webkit-flex-grow:1;flex-grow:1;}.f_between{-webkit-justify-content:space-between;justify-content:space-between;}.t_center{text-align:center;}.t_left{text-align:left;}.t_right{text-align:right;}.t_justify{text-align:justify;}[disabled]{cursor:no-drop !important;}.line_clamp{display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden;}';
    
    /* css main */
    s_str += '/* Custom Scrollbar */body::-webkit-scrollbar{width:15px;}body::-webkit-scrollbar-track{background:#312f40;}body::-webkit-scrollbar-thumb{background:#151515;}html,body,article{background:#151515 !important;color:#b8b8b8;-webkit-user-select:text;user-select:text;}body{position:relative !important;overflow:auto !important;}.mangainfo li a:visited,.komikinfo li a:visited,.animeinfo li a:visited,.animeinfo .episodelist a:visited,.wp-manga-chapter a:visited,.bixbox li a:visited,.bxcl li a:visited,#scans a:visited h3,#latestchapters .updates a:visited,#list .chapter a:visited,.chapter-container .chapter-row a:visited,.elementor-icon-list-item a:visited,.epxs a:visited,.chapter-item a:visited,.fixyear a:visited,.fixyear a:visited .year .ytps a:visited,.chli .cli a:visited,.Manga_Chapter a:visited .viewind{color:#d7382d !important;}#reader-mod,#wrap:not(.no-css) p:not([class="logo"]){background:#151515;max-width:750px !important;min-width:inherit;height:auto !important;margin:0 auto !important;display:block;float:none !important;}#reader-mod img,#wrap:not(.no-css) p:not([class="logo"]) img{width:auto;max-width:100% !important;height:auto;position:initial !important;display:block;margin:0 auto;}#content .carousel,.darex .carousel,.vezone .carousel{height:auto;max-height:100%;}#content .carousel-cell,.darex .carousel-cell,.vezone .carousel-cell{float:left;position:relative;}#content .carousel-cell img,.darex .carousel-cell img,.vezone .carousel-cell img{height:100%;}#menu li,#main-menu li{float:none;display:inline-block;}.episode-table tr td[width="100"]{width:100%;}body.manga-page .main-col .listing-chapters_wrap ul.version-chap{max-height:none;overflow:initial;}/* madara theme */.text-ui-light .site-header .c-sub-header-nav,.text-ui-light [class*="c-sidebar c-top"],.text-ui-light .profile-manga{background:#151515 !important;border-color:#3e3949 !important;}/* komikgo.com */.chapter-type-manga .c-blog-post .entry-content .entry-content_wrap .reading-content::before{position:relative;}/* manhwa-san.xyz | katakomik.site */.manhwa-san-xyz #outer-wrapper,.katakomik-site #outer-wrapper,.katakomik-site .header-header{background:#151515 !important;}.manhwa-san-xyz .blog-post.item-post h1.post-title{color:#999;}.manhwa-san-xyz .alphanx,.katakomik-site .naviarea1 .awnavi1,.funmanga-com .prev-next-post{display:flex;justify-content:space-between;}/* mangaku.club */body[class*="mangaku-"] .owl-carousel{display:block;}/* manhuaid.com */.manhuaid-com#darkbody{background:#151515 !important;}/* readcmic.blogspot.com */.readcmic-blogspot-com #outer-wrapper{background:#151515 !important;}/* komikcast.com */.is-mobile .komikcast-com .list-update_items-wrapper{display:flex;flex-wrap:wrap;}.is-mobile .komikcast-com .list-update_item{flex:initial;max-width:100%;width:50%;}/* mangabat.com */.mangabat-com .container-header-lineone,.mangabat-com .container-header-lineone a,.mangabat-com .container-silder,.mangabat-com .panel-advanced-search-tool,.mangabat-com .advanced-search-tool-genres-item,.mangabat-com .panel-breadcrumb,.mangabat-com .panel-content-homepage,.mangabat-com .panel-content-homepage a,.mangabat-com .panel-list-story,.mangabat-com .panel-list-story a,.mangabat-com .panel-story-info,.mangabat-com .panel-story-chapter-list,.mangabat-com .panel-story-chapter-list a,.mangabat-com .panel-comment,.mangabat-com .panel-topview,.mangabat-com .panel-topview a,.mangabat-com .panel-newest,.mangabat-com .panel-newest-content,.mangabat-com .panel-category,.mangabat-com .pn-category-row,.mangabat-com .pn-category-row a,.mangabat-com .panel-navigation,.mangabat-com .panel-chapter-comment,.mangabat-com .panel-chapter-info-bot,.mangabat-com .container-footer-content,.mangabat-com .container-footer-content a{background-color:#222 !important;color:#ccc !important;}.mangabat-com #panel-story-info-description{max-height:none !important;}/* nyanfm.com */.nyanfm-com.elementor-kit-12{--e-global-color-48d087d:#eee;--e-global-color-14c8a14:#ccc;--e-global-color-eb4b41d:#151515;}.nyanfm-com .container,.nyanfm-com .elementor-section{background-color:#151515 !important;}.nyanfm-com .bdt-navbar-dropdown.bdt-open,.nyanfm-com .bdt-post-block-tag-wrap span{background-color:#222 !important;}.nyanfm-com .elementor-column-wrap{background:transparent !important;}.nyanfm-com .elementor-heading-title,.nyanfm-com .bdt-navbar-nav > li > a,.nyanfm-com .bdt-social-share-text{color:#eee !important;}.nyanfm-com .elementor-button{color:#222;}.nyanfm-com .elementor-alert{border:0;}.nyanfm-com .elementor-alert-title,.nyanfm-com .elementor-alert-description{color:#333 !important;text-shadow:none !important;}/* komiku.id */.komiku-id img.lazy{opacity:.5;}.komiku-id a,.komiku-id .logo a span,.komiku-id section h2,.komiku-id .konten > section h3,.komiku-id .perapih .daftar h3{color:#ccc !important;}.komiku-id #header .hd2,.komiku-id #header nav,.komiku-id .konten > section[id],.komiku-id .ls2,.komiku-id .ls4,.komiku-id #Trending .perapih,.komiku-id #Trending .ls123m,.komiku-id #Trending .tr23,.komiku-id #Terbaru .lnn,.komiku-id #Terbaru .ls24,.komiku-id #Komik_Hot .ls2,.komiku-id #Komik_Hot .ls2l,.komiku-id #Genre .ls3,.komiku-id #Genre .ls3 a,.komiku-id #Genre .ls3 h4,.komiku-id #Mirip .mirip1,.komiku-id #Mirip .ls5b h4,.komiku-id section,.komiku-id #Judul,.komiku-id.series #Spoiler .grd,.komiku-id.series #Spoiler h4,.komiku-id #sosmed,.komiku-id #Komentar,.komiku-id #Navbawah,.komiku-id #Footer,.komiku-id.loading{background-color:#222 !important;border-color:#393939 !important;color:#ccc !important;box-shadow:none !important;}.komiku-id nav ul li a,.komiku-id .perapih .ntah,.komiku-id .perapih .daftar,.komiku-id .loop-nav.pag-nav,.komiku-id select,.komiku-id #Terbaru .vw,.komiku-id #Berita .brt,.komiku-id #Menu_Tambahan a,.komiku-id #Peringkat .ls7nm,.komiku-id.series #Judul .new1,.komiku-id.series #Informasi table.inftable td:nth-child(1),.komiku-id.series #Informasi ul.genre li,.komiku-id.series .mnu button.tab:not(.curr),.komiku-id.series #Chapter #Daftar_Chapter tbody th,.komiku-id.chapter #Judul table.tbl tr:nth-child(1) td,.komiku-id .pagination a,.komiku-id #rakbuku .rakbuku,.komiku-id .ls2 .nani{  background-color:#343434 !important;border-color:#393939 !important;color:#ccc !important;box-shadow:none !important;}.komiku-id .perapih .daftar .new1 a,.komiku-id .loop-nav.pag-nav a,.komiku-id #genr li a{color:#333 !important;}.komiku-id ::-webkit-scrollbar-track{background:#343434 !important;}.komiku-id ::-webkit-scrollbar-thumb{background:#b8b8b8 !important;}/* webtoons.com */.webtoons-com:not(.read-mode) img,#mainBannerList,.webtoons-com .detail_bg{opacity:0.9 !important;}.webtoons-com #wrap a,.webtoons-com #wrap p,#wrap .main_hotnew h2,#wrap .title_area h2,#wrap .grade_num{color:#838383 !important;}#wrap #header,#wrap .main_ad_area,#wrap .snb_wrap,#wrap #container.bg,#wrap .detail_body .detail_lst,#wrap .detail_body .detail_install_app,#wrap .detail_body .detail_lst li,#wrap .detail_body .aside.detail,#wrap .detail_body .detail_paywall,#wrap .main_daily_wrap,#wrap .daily_tab_wrap,#wrap .main_hotnew_wrap,#wrap .main_genre_wrap,#wrap .main_challenge,#wrap .lst_type1 li,#wrap #footer,#wrap .notice_area,#wrap .foot_app,#wrap .discover_lst li,#wrap .ranking_tab,#wrap .ranking_tab li,#wrap .lst_type1,#wrap .daily_head,#wrap .daily_card_item,#wrap .daily_card,#wrap .daily_card li,#wrap #cbox_module,#wrap .u_cbox .u_cbox_comment_box,#wrap .u_cbox a,#wrap footer,.is-mobile #wrap .lst_item,.is-mobile #wrap .challenge_list,.is-mobile #wrap .my_loading_wrap,.is-mobile #wrap .loader_wrap,.is-mobile #wrap .main_notice,.is-mobile #wrap .detail_white li,.is-mobile #wrap .detail_white .num{background-color:#151515 !important;border-color:#000 !important;color:#838383 !important;}#wrap .card_item .card_back,#wrap .daily_tab li.on .btn_daily,#wrap .main_challenge .title_area .btnarea a,#wrap .snb li.on a,#wrap .ranking_tab li.on a,#wrap .daily_section.on,#wrap .episode_area{background-color:#2f2f2f !important;color:#838383 !important;}.is-mobile #wrap header{background-color:#f5f5f5;}.is-mobile .webtoons-com #reader-mod{padding-top:50px;}/* display none */a[href*="agacelebir.com"][style*="fixed"],.themesia #teaser3,center a[href*="mangatoon"],.kln:not(.blox),.kln.mlb,html body [class*="iklan"],#footer2,noscript,#ftads,.c-sub-header-nav.sticky,#navkanan[class*="scroll"],#bottom-banner-ads,footer.perapih.chf,.restrictcontainer,.adult-content #adult_modal,.adult-content .modal-backdrop,#Notifikasi,.komikcast-com [class*="komik_info-alert"],.manhuaid-com img[alt^="Aplikasi"],.mangayu-com .swal2-container,body[class*="komiku-"] #continue,body[class*="komiku-"] #history2,.is-mobile .webtoons-com #_appDownloadPopup,.is-mobile .webtoons-com #toolbarEpisodeListArea,.is-mobile .webtoons-com #loadingDiv,.mangabat-com #panel-description-linear{display:none !important;visibility:hidden !important;opacity:0 !important;}.hidden-items{position:fixed;top:-9999px;left:-9999px;}/* exception */.judulseries .iklan{display:block !important;visibility:visible !important;opacity:1 !important;}';
    
    // replace chatango z-index
    s_str += 'iframe[src*="chatango.com"]{z-index:214748364 !important}';
    
    //if (el('.preloader .loading')) alert('test'), el('.preloader .loading').parentNode.style.cssText = 'display:none !important';
    
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
  
  changeSource = function() {
    var u_obj = {update: new Date().getTime()};
    firebase.app(fbase_app).database().ref('bookmark/source').update(u_obj, (error) => {
      if (error) alert('!!ERROR: changeSource()');
    });
  };
  
  genSource = function(note) {
    if (!mydb_change) return;
    mydb_change = false;
    
    var path = 'bookmark/source';
    if (note == 'check') path = path +'/update';
    
    firebase.app(fbase_app).database().ref(path).once('value').then(function(snapshot) {
      var data = snapshot.val();
      if (note == 'check') {
        if (data != mydb_source.update) {
          mydb_change = true;
          changeSource();
          genSource('change');
        }
      } else {
        /*var s_txt = '{"anime":'+ genObject(genArray(data.anime)) +',"comic":'+ genObject(genArray(data.comic)) +',"novel":'+ genObject(genArray(data.novel)) +'}';*/
        var s_txt = JSON.stringify(data);
        localStorage.setItem('mydb_source_data', s_txt);
        crossStorage.set('mydb_source_data', s_txt);
        if (note != 'change') sourceCheck('server', s_txt);
      }
    });
  };
  
  function checkLogin() {
    /* Check login source: https://youtube.com/watch?v=iKlWaUszxB4&t=102 */
    firebase.app(fbase_app).auth().onAuthStateChanged(function(user) {
      mydb_login = user ? true : false;
    });
    
    if (mydb_login) {
      genSource('login');
    } else {
      if (login_email == '' || login_pass == '') {
        alert('!! Error: firebase login\nlogin_email or login_pass is empty');
      } else {
        /* auto login firebase */
        firebase.app(fbase_app).auth().signInWithEmailAndPassword(login_email, login_pass).then((user) => {
          genSource('auth');
        }).catch(function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.error('!! Error: function checkLogin(, code: '+ errorCode +', message: '+ errorMessage);
          alert('!! Error: function checkLogin(\n'+ errorMessage);
        });
      }
    }
  }
  
  function loadFirebase() {
    if (typeof firebase == 'undefined') {
      mydb_firebase = true;
      addScript('https://www.gstatic.com/firebasejs/8.8.1/firebase-app.js')
        .catch(() => {
          /* only use catch() :
          - https://stackoverflow.com/a/36213268/7598333
          - https://javascript.info/promise-basics#catch
          */
          clearInterval(db_chk);
          console.error('!!Error: can\'t load firebase.');
          callScript('error');
        });
    }
    
    var db_chk = setInterval(function() {
      if (typeof firebase !== 'undefined') {
        clearInterval(db_chk);
        /* Initialize new app with different name https://stackoverflow.com/a/37603526/7598333 */
        firebase.initializeApp(fbase_config, fbase_app);
        if (typeof firebase.database == 'undefined') addScript('https://www.gstatic.com/firebasejs/8.8.1/firebase-database.js');
        var db2_chk = setInterval(function() {
          if (typeof firebase.database !== 'undefined') {
            clearInterval(db2_chk);
            if (typeof firebase.auth == 'undefined') addScript('https://www.gstatic.com/firebasejs/8.8.1/firebase-auth.js');
            var db3_chk = setInterval(function() {
              if (typeof firebase.auth !== 'undefined') {
                clearInterval(db3_chk);
                checkLogin();
              }
            }, 100);
          }
        }, 100);
      }
    }, 100);
  }
  
  function callScript(note) {
    if (mydb_type && note != 'error') {
      mydb_type_bkp = mydb_type;
      localStorage.setItem('mydb_support', 'true');
      
      /* add class to body from source: status, tag, theme */
      var s_data = mydb_source[mydb_type][w_host];
      var s_class = s_data['status'] +','+ s_data['tag'] +','+ s_data['theme'];
      s_class = s_class.replace(/,+/, ',').replace(/,$/, '');
      s_class = s_class.split(',');
      for (var i = 0; i < s_class.length; i++) {
        document.body.classList.add(s_class[i]);
      }
      genCSS();
      
      if (live_test_comic_r) {
        var cr_chk = setInterval(function() {
          if (typeof mydb_comic_reader !== 'undefined') {
            clearInterval(cr_chk);
            mydb_comic_reader();
          }
        });
      } else {
        if (mydb_type == 'comic') ls_saveLocal(js_comic_reader, 'mydb_tools_'+ mydb_type +'_reader', 'js', local_interval);
      }
      
      var reader_chk = setInterval(function() {
        if (typeof mydb_read !== 'undefined') {
          clearInterval(reader_chk);
          var chk_cf = el('h1 [data-translate="checking_browser"]') || el('h1 .cf-error-type') || el('meta[name="captcha-bypass"]'); /* cloudflare */
          var is_cf = chk_cf ? true : false;
          if (!is_cf && !mydb_read) {
            if (!mydb_firebase) loadFirebase();
            if (live_test_bookmark) {
              var bm_chk = setInterval(function() {
                if (typeof mydb_bookmark !== 'undefined') {
                  clearInterval(bm_chk);
                  mydb_bookmark();
                }
              }, 100);
            } else {
              ls_saveLocal(js_bookmark, 'mydb_tools_bookmark', 'js', local_interval);
            }
          }
        }
      }, 100);
    } else {
      mydb_error = {"mydb_type":'"'+ mydb_type +'"',"note":'"'+ note +'"'};
      if (localStorage.getItem('mydb_source_data')) localStorage.removeItem('mydb_source_data');
      localStorage.setItem('mydb_support', 'false');
      console.log('mydb_support: false');
    }
  }
  
  function typeCheck(prop) {
    var data = mydb_source[prop];
    for (var site in data) {
      if (data[site]['host'].indexOf(w_host) != -1 || data[site]['domain'].indexOf(w_host) != -1) {
        w_host = data[site]['host'].replace(/\./g, '-');
        return prop;
      }
    }
    return false;
  }
  
  function sourceCheck(note, data) {
    mydb_source = data;
    if (mydb_source && mydb_source.search(/null|error/i) == -1) {
      if (note == 'cross') localStorage.setItem('mydb_source_data', mydb_source);
      mydb_source = JSON.parse(mydb_source);
      mydb_type = typeCheck('anime') || typeCheck('comic') || typeCheck('novel');
      callScript('source');
    } else {
      mydb_change = true;
      loadFirebase();
    }
  }
  
  
  wl = window.location;
  wh = wl.hostname;
  wp = wl.pathname;
  var w_host = wh.replace(wh_rgx, '');
  document.body.classList.add(w_host.replace(/\./g, '-'));
  
  if (document.head.innerHTML == '' || localStorage.getItem('mydb_support') == 'false' || wp.search(/\.(gif|webp|(pn|sv|jpe?)g)$/) != -1) return;
  
  /* START - check project via localStorage */
  mydb_tools_fnc();
  crossStorage.load(); /* init */
  if (localStorage.getItem('mydb_source_data')) {
    sourceCheck('local', localStorage.getItem('mydb_source_data'));
  } else {
    crossStorage.get('mydb_source_data', function(res){ sourceCheck('cross', res); });
  }
}


/*
var host_rgx = /(oploverz|webtoons|mangaku|mangaindo|komikstation|komikcast|westmanga|mangakita|mangashiro|mangacanblog|maid|ngomik|mangakyo|kiryuu|komikav|komiku|manhwa-san|matakomik|komikid|kombatch|mangceh|sektekomik|manhuaid|pojokmanga|sheamanga|klikmanga|bacakomik|mangayu|klankomik|boosei|comicfx|yuumanga|wordhero|gurukomik|masterkomik|kaisarkomik|softkomik|katakomik|mgkomik|kumamanga|komikru|komikindo|komiknesia|mangakane|tenseiscans|komikempus|kurutonime|nekomik|manhwaindo|wrt|mangacdn|wib|gabutscans|daveyscans|jscanla|nyanfm|mangapark|mangadex|mangabat|zeroscans|readmanhua|readmng|hatigarmscan[sz]|funmanga|bato|leviatanscans|merakiscans|mangarawr|toonily|mangasushi|reaperscans|asurascans|secretscans|rawdevart|azoramanga|animesc-kun|readcmic|mangapaus|ninkomik)\.((blogspot|wordpress)\.)?((co|my|web)(m|\.id)?|net|org|me|in|tv|id|to|jp|bz|pw|nl|info|xyz|pro|site|club)\/?(.*)/i;
*/


/* ============================================================ */
var fbase_app = 'bakomon';
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
var mydb_source, mydb_type, mydb_type_bkp, mydb_read, mydb_zoom;
var mydb_login = false;
var mydb_firebase = false;
var mydb_change = false;
var mydb_error = {};
var mydb_select = 'list';
var mydb_blocked = ['\x6a\x6f\x73\x65\x69','\x79\x61\x6f\x69','\x79\x75\x72\x69','\x73\x68\x6f\x75\x6a\x6f\x5f\x61\x69','\x73\x68\x6f\x75\x6e\x65\x6e\x5f\x61\x69','\x65\x63\x63\x68\x69','\x76\x69\x6f\x6c\x65\x6e\x63\x65','\x73\x6d\x75\x74','\x68\x65\x6e\x74\x61\x69','\x67\x65\x6e\x64\x65\x72\x5f\x62\x65\x6e\x64\x65\x72','\x67\x65\x6e\x64\x65\x72\x5f\x73\x77\x61\x70','\x6f\x6e\x65\x5f\x73\x68\x6f\x74'];
/* ============================================================ */
var cross_window, cross_chk;
var cross_callbacks = {};
var cross_origin = 'coreaz';
var cross_url = 'https://bakomon.blogspot.com';
var cross_frame = cross_url.replace(/\/$/, '') +'/p/bakomon.html';
/* ============================================================ */
var wh_rgx = /^(w{3}|web|m(obile)?|read|data)\./i;
var number_t_rgx = /\s(ch\.?(ap(ter)?)?|eps?\.?(isodes?)?)(\s?\d+(\s-\s\d+)?|\s)/i; /* check id from <title> */
var number_w_rgx = /(\/|\-|\_|\d+)((ch|\/c)(ap(ter)?)?|ep(isodes?)?)(\/|\-|\_|\d+)/i; /* check id from window.location */
var id_w_rgx = /\/(?:(?:baca-)?(?:man(?:ga|hwa|hua)|baca|read|novel|anime|tv|download|[a-z]{2}\/[^\/]+|(?:title|series|[kc]omi[kc]s?)(?:\/\d+)?|(?:\d{4}\/\d{2})|p)[\/\-])?([^\/\n]+)\/?(?:list)?/i; /* id from window.location */
var skip1_rgx = /^\/(p\/)?((daftar|search(\/label)?|type|latest|list|baca|all)[-\/])?(\w{1,2}|project|[kc]omi[kc]s?|man(ga|hwa|hua)|popul[ea]r|genres?|type|release|az|staff|update|series?|bookmarks?|apps?|[kc]onta(k|ct)|blog|pustaka|search|about|tentang)([-\.\/](lists?|terbaru|berwarna|author|artist|us|kami|page\/\d+|html|wrt))?\/?$/i;
var skip2_rgx = /^\/(([kc]omi[kc]s?|man(ga|hwa|hua))-)?(genres?|tag|category|list|release|author|artist)\/.*\/?$/i;
/* ============================================================ */
var login_email = '';
var login_pass = '';
var local_interval = 'manual|12/25/2021, 9:32:55 PM';
var js_bookmark = 'https://cdn.jsdelivr.net/gh/bakomon/bakomon@master/bookmark/mydb-bookmark.js';
var js_comic_reader = 'https://cdn.jsdelivr.net/gh/bakomon/bakomon@master/reader/comic-reader.js';
var live_test_bookmark = false;
var live_test_comic_r = false;
/* 
- use "https://cdn.statically.io" or "https://cdn.jsdelivr.net"
- jsdelivr purge cache: 
  - https://purge.jsdelivr.net/gh/YOUR_PACKAGE@VERSION/foo/bar
  - https://purge.jsdelivr.net/npm/YOUR_PACKAGE@VERSION/foo/bar
- gitcdn last commit: https://gitcdn.herokuapp.com/cdn/USER/YOUR_PACKAGE/LATEST_COMMIT/foo/bar
*/

// remove old data, temporary
if (localStorage.getItem('comic_tools_bookmark')) localStorage.removeItem('comic_tools_bookmark');
if (localStorage.getItem('comic_tools_reader')) localStorage.removeItem('comic_tools_reader');
if (localStorage.getItem('comic_tools_list')) localStorage.removeItem('comic_tools_list');
if (localStorage.getItem('mydb_tools_source')) localStorage.removeItem('mydb_tools_source');
if (localStorage.getItem('mydb_source_check')) localStorage.removeItem('mydb_source_check');
if (document.cookie.match(RegExp('(?:^|;\\s*)reader-zoom=([^;]*)'))) document.cookie = 'reader-zoom=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';

if (typeof el !== 'undefined') {
  localStorage.setItem('mydb_support', 'false');
} else {
  /* global variables */
  var global_arr = ['el','openInNewTab','addScript','isMobile','crossStorage','genArray','genSource','changeSource','ls_saveLocal','getId'];
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
