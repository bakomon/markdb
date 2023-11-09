// COMIC READER
function mydb_cr_fnc() {
  if (mydb_crjs_loaded) return;
  mydb_crjs_loaded = true;
  
  // check if string is number https://stackoverflow.com/a/175787/7598333
  function isNumeric(str) {
    if (typeof str != 'string') return false;
    return !isNaN(str) && !isNaN(parseFloat(str));
  }
  
  // Fix Issues With CSS Position Sticky Not Working https://www.designcise.com/web/tutorial/how-to-fix-issues-with-css-position-sticky-not-working#checking-if-an-ancestor-element-has-overflow-property-set
  function overflowUnset(elem) {
    var parent = elem.parentElement;
    while (parent) {
      var hasOverflow = getComputedStyle(parent).overflow;
      if (hasOverflow !== 'visible') parent.style.setProperty('overflow', 'visible', 'important');
      parent = parent.parentElement;
    }
  }
  
  // Position (X,Y) element https://stackoverflow.com/a/28222246
  function getOffset(element) {
    var rect = element.getBoundingClientRect();
    var pos = {};
    pos.top = rect.top + window.scrollY;
    pos.right = rect.right + window.scrollX;
    pos.bottom = rect.bottom + window.scrollY;
    pos.left = rect.left + window.scrollX;
    return pos;
  }
  
  function copyAttribute(element, new_node) {
    var el_new = document.createElement(new_node);
    var el_att = element.outerHTML.match(/<[^\s]+\s([^>]+)>/)[1];
    el_att = el_att.match(/([^"]+"[^"]+"\s?)/g);
    for (var i = 0; i < el_att.length; i++) {
      var att_name = el_att[i].match(/([^=]+)="([^"]+)"/)[1].replace(/\s+/, '');
      var att_value = el_att[i].match(/([^=]+)="([^"]+)"/)[2];
      if (new_node == 'i' && att_name == 'href') att_name = 'data-'+ att_name; 
      el_new.setAttribute(att_name, att_value);
    }
    return el_new;
  }
  
  function getData(url) {
    var x = new XMLHttpRequest();
    x.onreadystatechange = function() {
      if (x.readyState == XMLHttpRequest.DONE) {
        var imgData = JSON.parse(x.responseText);
        genImageApi(imgData);
      }
    };
    x.open('GET', url, true);
    x.send();
  }
  
  function lazyLoad(img, note) {
    var lz_chk1 = (getOffset(img).top + img.offsetHeight) > getOffset(checkPoint).top;
    var lz_chk2 = (getOffset(img).bottom - img.offsetHeight) < getOffset(checkPoint).bottom;
    var lz_chk3 = lz_chk1 && lz_chk2 && !img.classList.contains('rc_loaded');
    var imgs = '';
    
    if (lz_chk3 || note != 'scroll') {
      imgs = img.dataset.readImg;
      if (!loadCDN) imgs = imgs.replace(rgxCdn, '').replace(/\/[fhwq]=[^\/]+/, '');
      if (imgs.search(/(pending\-load|cdn\.statically\.io)/) != -1) {
        imgs = imgs.replace(/\?(.*)/g, ''); //remove location.search ?=
      } else if (loadGi) {
        var sNum = el('.rc_size').innerHTML;
        imgs = imgs.replace(/\/([swh]\d+)(?:-[\w]+[^\/]*)?\//, '/'+ sNum +'/');
        imgs = imgs.replace(/=[swh](\d+)[^\n]*/, '='+ sNum);
        if (imgs.indexOf('docs.google') != -1) imgs = 'https://lh3.googleusercontent.com/d/'+ imgs.match(/[^\n]+id=([^&]+)/)[1] +'='+ sNum;
      }
      img.className = img.className.replace('rc_lazy1oad', 'rc_la2yloading');
      img.onload = function() { img.style.removeProperty('min-height'); };
      img.onerror = function() { img.style.removeProperty('min-height'); };
      img.src = imgs;
      img.className = img.className.replace('rc_la2yloading', 'rc_lazyload3d');
      img.parentElement.classList.add('lz_loaded');
    }
  }
  
  // ============================================================================================================
  
  function windowStop() {
    window.stop();
    el('.rc_stop').classList.add('rc_hidden');
    el('.rc_reload').classList.remove('rc_hidden');
  }
  
  function nextChapter() {
    var chNav, chUrl, nextCh, nextChk, nextLink;
    var chNum = wp.replace(/(?:\/(?:manga|comic|komik)\/)?[^\/]*\/([^\/]*)\/?/g, '$1');
    if (wh.indexOf('mangacanblog') != -1) {
      chNav = el('.chnav select[onchange^="change_chapter"]').options;
    } else if (wh.indexOf('mangayu') != -1) {
      chNav = el('#chapterSelect').options;
    } else if (wh.indexOf('mangapark') != -1) {
      chNav = el('select [label="Quick jump"]').parentElement.options;
    } else if (wh.indexOf('merakiscans') != -1) {
      el('#chapter_select option[value="'+ chNum +'"]').selected = true;
      chNav = el('#chapter_select').options;
      chUrl = el('#reader_text a').href;
      removeElem('#next, #nextbot, #page_select', 'all');
    }
    
    nextChk = wh.search(/merakiscans|mangapark/) != -1 ? 'nextElementSibling' : 'previousElementSibling';
    for (var i = 0; i < chNav.length; i++) {
      if (chNav[i].selected == true) nextCh = chNav[i];
    }
    
    if (nextCh[nextChk]) {
      nextLink = nextCh[nextChk].value;
      if (wh.search(/merakiscans/) != -1) {
        nextLink = chUrl +'/'+ nextLink;
      } else if (wh.search(/mangapark/) != -1) {
        nextLink = el(`a[href$="ch.${nextLink}"]`).href;
      } else if (wh.indexOf('mangacanblog') != -1) {
        var cm_name = el('.chnav select[onchange^="change_chapter"]').getAttribute('onchange').match(/\(\'([^']+)\',/i)[1];
        var next_plus = ((nextLink-1)+2);
        nextLink = '//'+ wh +'/baca-komik-'+ cm_name +'-'+ nextLink +'-'+ next_plus +'-bahasa-indonesia-'+ cm_name +'-'+ nextLink +'-terbaru.html';
      }
      el('.rc_next button').setAttribute('data-href', nextLink);
      el('.rc_next').classList.remove('rc_hidden');
      if (isMobile) el('.rc_next2').classList.remove('rc_hidden');
    }
  }
  
  // ============================================================================================================
  
  function readerBtnFnc(imglistMod) {
    if (wh.search(/mangacanblog|mangayu|merakiscans|mangapark/) != -1) nextChapter(); //next button
    
    el('.rc_toggle').onclick = function() {
      this.classList.toggle('db_danger');
      el('.reader_db').classList.toggle('rc_shide');
      if (isMobile) el('.rc_bg').classList.toggle('rc_hidden');
      if (el('.rc_next button').dataset.href) el('.rc_next2').classList.toggle('rc_hidden');
      el('.rc_tr2 .rc_td1').classList.toggle('rc_hidden');
      el('.rc_pause2').classList.toggle('rc_hidden');
    };
    
    el('.rc_bg').onclick = function() {
      el('.rc_toggle').click();
    };
    
    el('.rc_load input', 'all').forEach(function(item) {
      item.oninput = function() {
        // "imglistMod" from readerBtnFnc() parameter
        if (this.value > imglistMod.length) this.value = imglistMod.length;
        if (this.classList.contains('rc_all') && !isNumeric(this.value) && this.value != 'all') this.value = 'all';
      };
    });
    
    // Load all images
    el('.rc_load .rc_ld_img').onclick = function() {
      if (isNumeric(el('.rc_load .rc_all').value)) {
        lazyLoad(imglistMod[Number(el('.rc_load .rc_all').value) - 1], 'single');
      } else {
        // "imglistMod" from readerBtnFnc() parameter
        if (!isFrom) loadImage = true;
        var ld_index = isFrom && el('.rc_load .rc_fr_min').value != '' ? (Number(el('.rc_load .rc_fr_min').value) - 1) : 0;
        var ld_length = isFrom && el('.rc_load .rc_fr_max').value != '' ? Number(el('.rc_load .rc_fr_max').value) : imglistMod.length;
        for (var i = ld_index; i < ld_length; i++) {
          lazyLoad(imglistMod[i], 'all');
        }
        if (isFrom) el(`#reader-mod [title^="${ld_index+1}"]`).scrollIntoView();
      }
    };
    
    el('.rc_load .rc_from').onclick = function() {
      var ld_from = this.classList.contains('rc_active');
      el('.rc_load .rc_all').value = 'all';
      el('.rc_load .rc_all').disabled = ld_from && !isPause ? false : true;
      el('.rc_load .rc_fr_min').disabled = ld_from ? true : false;
      el('.rc_load .rc_fr_max').disabled = ld_from ? true : false;
      if (ld_from) {
        el('.rc_load .rc_fr_min').value = '1';
        el('.rc_load .rc_fr_max').value = el('.rc_load .rc_fr_max').dataset.value;
      }
      isFrom = ld_from ? false : true;
      this.classList.toggle('rc_active');
    };
    
    el('.rc_load .rc_pause').onclick = function() {
      this.classList.toggle('rc_danger');
      el('.rc_pause2').classList.toggle('rc_danger');
      isPause = isPause ? false : true;
      el('.rc_ld_img').disabled = isPause ? true : false;
      el('.rc_load .rc_all').disabled = isPause ? true : false;
      if (el('.rc_load .rc_from').classList.contains('cm_active')) el('.rc_load .rc_from').click();
      el('.rc_load .rc_from').disabled = isPause ? true : false;
    };
    
    if (chgi) {
      el('.rc_size').onclick = function() {
        this.innerHTML = this.innerHTML == imgGi ? 's15000' : imgGi;
        loadGi = this.innerHTML == imgGi ? false : true;
      };
    }
    
    if (chcdn) {
      el('.rc_cdn').onclick = function() {
        this.innerHTML = this.innerHTML == 'CDN' ? 'not' : 'CDN';
        loadCDN = this.innerHTML == 'CDN' ? true : false;
        if (chgi) {
          el('.rc_size').innerHTML = 's15000';
          el('.rc_size').click();
        }
      };
    }
    
    el('.rc_zoom button', 'all').forEach(function(item) {
      item.addEventListener('click', function(e) {
        var load_zm = Number(el('.rc_zoom input').value);
        if (item.classList.contains('rc_plus')) {
          load_zm += 50;
        } else {
          load_zm += -50
        }
        imgArea.style.setProperty('max-width', load_zm +'px', 'important');
        el('.rc_zoom input').value = load_zm;
        mydb_zoom[zoomID] = load_zm;
        localStorage.setItem('mydb_zoom', JSON.stringify(mydb_zoom));
      });
    });
    
    el('.rc_stop').onclick = windowStop;
    
    // back to top
    el('.rc_top').onclick = function() {
      document.body.scrollIntoView();
    };
    
    // back to bottom
    el('.rc_bottom').onclick = function() {
      var cmt_el = el('#disqus_trigger') || el('.webtoons-com .comment_area');
      if (cmt_el) {
        cmt_el.parentElement.scrollIntoView();
      } else {
        //document.body.scrollIntoView(false);
        window.scrollTo(0, imgArea.scrollHeight);
      }
    };
    
    /*
    note:
    - .pager-cnt .pull-right = my Manga Reader CMS
    - .btn-sm i[class*="right"] = new CMS "scans"
    - #ecNext a = emissionhex
    - i[rel="next"] = ads_newtab
    */
    var next_chap = el('.manhuaid-com a[class*="float-left"]') || el('.nyanfm-com .fa-angle-right') || el('.funmanga-com #chapter-next-link') || el('.readmangabat-com .navi-change-chapter-btn-next') || el('.batoto .nav-next a') || el('.reaperscans-com a .fa-arrow-right-long') || el('.btn-sm i[class*="right"]') || el('.pager-cnt .pull-right a') || el('#ecNext a') || el('a[rel="next"]') || el('a[class*="next"]') || el('i[rel="next"]');
    if (next_chap) {
      next_chap = document.body.className.search(/new_cms|mangadropout|nyanfm|reaperscans-com/) != -1 && wh.indexOf('zeroscans') == -1 ? next_chap.parentElement : next_chap;
      var next_url = /*document.body.classList.contains('ads_newtab') ? next_chap.dataset.href :*/ next_chap.href;
      el('.rc_next button').setAttribute('data-href', next_url);
      el('.rc_next').classList.remove('rc_hidden');
      if (isMobile) el('.rc_next2').classList.remove('rc_hidden');
    }
    
    document.onkeyup = function(e) {
      if ((e.altKey) && (e.keyCode == 82)) {
        el('.rc_reload').click(); //"alt & r" for reload page
      } else if ((e.altKey) && (e.keyCode == 88)) {
        el('.rc_stop').click(); //"alt & x" for stop page loading
      } else if ((e.altKey) && (e.keyCode == 65)) {
        el('.rc_ld_img').click(); //"alt & a" for load all
      } else if ((e.shiftKey) && (e.keyCode == 38)) {
        el('.rc_zoom .rc_plus').click(); //"shift & up" zoom +
      } else if ((e.shiftKey) && (e.keyCode == 40)) {
        el('.rc_zoom .rc_less').click(); //"shift & down" zoom -
      } else if (e.keyCode == 39) { //arrow right
        if (next_chap) {
          if (wh.indexOf('softkomik') != -1 /*|| document.body.classList.contains('ads_newtab')*/) {
            wl.href = el('.rc_next button').dataset.href;
          } else {
            next_chap.click();
          }
        }
      }
      
      // enter to load
      if (el('.rc_load .rc_all') === document.activeElement && e.keyCode == 13) {
        el('.rc_load .rc_ld_img').click();
      }
      // enter to zoom
      if (el('.rc_zoom input') === document.activeElement && e.keyCode == 13) {
        var load_zm = Number(el('.rc_zoom input').value);
        imgArea.style.setProperty('max-width', load_zm +'px', 'important');
        el('.rc_zoom input').value = load_zm;
        mydb_zoom[zoomID] = load_zm;
        localStorage.setItem('mydb_zoom', JSON.stringify(mydb_zoom));
      }
      if (e.keyCode == 13) document.activeElement.blur();
    };
  }
  
  function readerBtnHtml(imgs) {
    var readSize = isMobile ? window.screen.width : zoomID in mydb_zoom ? mydb_zoom[zoomID] : imgArea.offsetWidth;
    if (zoomID in mydb_zoom && !isMobile) readSize = readSize == 'manga' ? '750' : readSize == 'manhua' ? '650' : readSize == 'manhwa' ? '500' : readSize;
    var r_txt = '';
    // css control & main already in database tools
    // css reader
    r_txt += '<style>.rc_100{width:100%;}.rc_50{width:50%;}.reader_db{position:fixed;bottom:0;right:0;width:165px;padding:10px;background:#17151b;border:1px solid #333;border-right:0;border-bottom:0;}.reader_db.rc_shide{right:-165px;}._rc{background:#252428;color:#ddd;padding:4px 8px;margin:4px;font:14px Arial;cursor:pointer;border:1px solid #3e3949;}._rc a{color:#ddd;font-size:14px;text-decoration:none;}.rc_line{margin-bottom:10px;padding-bottom:10px;border-bottom:5px solid #333;}.rc_text{padding:4px 8px;margin:4px;}.rc_selected,.rc_btn:not(.rc_no_hover):hover{background:#4267b2;border-color:#4267b2;}.rc_active{background:#238636;border-color:#238636;}.rc_danger{background:#ea4335;border-color:#ea4335;}input._rc{padding:4px;display:initial;cursor:text;height:auto;background:#252428 !important;color:#ddd !important;border:1px solid #3e3949;}input._rc:hover{border-color:#3e3949;}input._rc.no_arrows::-webkit-inner-spin-button,input._rc.no_arrows::-webkit-outer-spin-button{-webkit-appearance:none;margin:0;}input._rc.no_arrows[type=number]{-moz-appearance:textfield;}.rc_all{width:30px !important;}.rc_fr_num{margin-right:-25px;}.rc_fr_min,.rc_fr_max{width:40px !important;}.rc_tr2{position:absolute;bottom:0;left:-40px;}.rc_tr2 .rc_btn{align-items:center;width:40px;height:40px;font-size:30px !important;padding:0;margin:0;line-height:0;}.rc_pause{border-radius:50%;padding:6px;line-height:0;}.rc_tr2  .rc_pause2{font-size:25px !important;}._rc[disabled],._rc[disabled]:hover{background:#252428 !important;color:#555 !important;border-color:#252428 !important;}.rc_hidden,#readerarea-loading{display:none;}</style>';
    r_txt += '<style>.scrollToTop,[title*="Back To Top"],.back-to-top,.go-to-top,.btn-top{display:none !important;}</style>'; //css hidden
    r_txt += '<style>.rc_mobile ._rc:not(.no_moblie_font){font-size:16px;}.rc_mobile .rc_toggle{position:absolute;bottom:0;left:-70px;width:70px;height:70px;background:transparent;color:#fff;border:0;text-shadow:-1px 0 #000,0 1px #000,1px 0 #000,0 -1px #000;}.rc_mobile .rc_bg{position:fixed;top:0;bottom:0;left:0;right:0;background:rgba(0,0,0,.5);}.rc_mobile .rc_tr2{left:-81px;}.rc_mobile .reader_db:not(.rc_shide) .rc_tr2{left:-40px;}.rc_mobile .reader_db.rc_shide .rc_next button{position:fixed;top:0;left:0;margin:0;max-width:20%;height:50vh;background:0 0;color:transparent;border:0;}</style>'; //css mobile
    // html
    r_txt += '<div class="rc_bg'+ (isMobile ? ' rc_hidden' : '') +'"></div>';
    r_txt += '<div class="reader_db'+ (isMobile ? ' rc_shide' : '') +' flex_wrap f_bottom">';
    r_txt += '<div class="rc_tr1 flex_wrap">';
    r_txt += '<div class="rc_others rc_line rc_100 flex rc_hidden">';
    if (chcdn) r_txt += '<div class="rc_cdn rc_btn _rc" title="'+ cdnName +'">CDN</div>';
    if (chgi) r_txt += '<div class="rc_size rc_btn _rc">'+ imgGi +'</div>';
    r_txt += '</div>'; //.rc_others
    r_txt += '<div class="rc_next rc_line rc_100 rc_hidden"><button class="rc_btn _rc" title="arrow right &#9656;" oncontextmenu="mydb_open_new_tab(this.dataset.href)" onclick="window.location.href=this.dataset.href">Next Chapter</button></div>';
    r_txt += '<div class="rc_home rc_line rc_100"><button class="rc_btn _rc" onclick="window.location.href=\'//\'+window.location.hostname">Homepage</button></div>';
    r_txt += '<div class="rc_load rc_line flex_wrap">';
    r_txt += '<div class="flex">';
    r_txt += '<button class="rc_ld_img rc_btn _rc" title="alt + a">Load</button>';
    r_txt += '<input class="rc_all rc_input _rc" value="all" onclick="this.select()">';
    r_txt += '<button class="rc_pause rc_btn _rc rc_no_hover no_moblie_font" title="Pause images from loading"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1em" height="1em" viewBox="0 0 24 24" version="1.1" x="0px" y="0px"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><path fill="currentColor" d="M15,18 L15,6 L17,6 L17,18 L15,18 Z M20,18 L20,6 L22,6 L22,18 L20,18 Z M2,5 L13,12 L2,19 L2,5 Z"></path></g></svg></button>';
    r_txt += '</div>';
    r_txt += '<div class="flex f_middle">';
    r_txt += '<button class="rc_from rc_btn _rc rc_no_hover" title="Load images from [index]">From</button>';
    r_txt += '<div class="rc_fr_num">';
    r_txt += '<input class="rc_fr_min rc_input _rc no_arrows" type="number" value="1" onclick="this.select()" disabled>';
    r_txt += '<span>-</span>';
    r_txt += '<input class="rc_fr_max rc_input _rc no_arrows" type="number" value="'+ imgList.length +'" data-value="'+ imgList.length +'" onclick="this.select()" disabled>';
    r_txt += '</div>';// .rc_fr_num
    r_txt += '</div>';
    r_txt += '</div>';// .rc_load
    r_txt += '<div class="rc_zoom rc_100"><button class="rc_plus rc_btn _rc" title="shift + up">+</button><button class="rc_less rc_btn _rc" title="shift + down">-</button><input style="width:40px;" class="rc_input _rc" value="'+ readSize +'"></div>';
    r_txt += '</div>';// .rc_tr1
    r_txt += '<div class="rc_tr2 '+ (isMobile ? ' flex f_bottom' : '') +'">';
    r_txt += '<div class="rc_td1'+ (isMobile ? '' : ' rc_hidden') +'">';
    r_txt += '<div class="rc_next2 rc_btn _rc flex f_center rc_hidden" onclick="window.location.href=document.querySelector(\'.rc_next button\').dataset.href">&#9656;</div>';
    r_txt += '<div class="rc_load2 rc_btn _rc flex f_center" onclick="document.querySelector(\'.rc_ld_img\').click()">&#671;</div>';
    r_txt += '</div>';// .rc_td1
    r_txt += '<div class="rc_td2">';
    r_txt += '<div class="rc_pause2 rc_btn _rc flex f_center rc_no_hover no_moblie_font'+ (isMobile ? '' : ' rc_hidden') +'" onclick="document.querySelector(\'.rc_pause\').click()"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1em" height="1em" viewBox="0 0 24 24" version="1.1" x="0px" y="0px"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><path fill="currentColor" d="M15,18 L15,6 L17,6 L17,18 L15,18 Z M20,18 L20,6 L22,6 L22,18 L20,18 Z M2,5 L13,12 L2,19 L2,5 Z"></path></g></svg></div>';
    r_txt += '<div class="rc_rest"><div class="rc_reload rc_btn _rc flex f_center rc_hidden" onclick="window.location.reload()" title="alt + r">&#8635;</div><div class="rc_stop rc_btn _rc flex f_center" title="alt + x">&#10007;</div></div>';
    r_txt += '<div class="rc_top rc_btn _rc flex f_center">&#9652;</div>';
    r_txt += '<div class="rc_bottom rc_btn _rc flex f_center">&#9662;</div>';
    r_txt += '<div class="rc_toggle rc_btn _rc flex f_center">&#174;</div>';
    r_txt += '</div>';// .rc_td2
    r_txt += '</div>';// .rc_tr2
    r_txt += '</div>';// .reader_db
    
    var r_html = document.createElement('div');
    r_html.style.cssText = 'position:relative;z-index:2147483643;'; //2147483647
    r_html.className = '_reader cbr_mod'+ (isMobile ? ' rc_mobile' : '');
    r_html.innerHTML = r_txt;
    document.body.appendChild(r_html);
    if (isMobile) el('.rc_toggle').classList.add('rc_no_hover');
    if (chcdn || chgi) el('.rc_others').classList.remove('rc_hidden');
    imgArea.style.setProperty('max-width', readSize +'px', 'important');
    
    readerBtnFnc(imgs);
  }
  
  function scrollImage(img) {
    window.onscroll = function() {
      if (!isPause && !isFrom) {
        for (var i = 0; i < img.length; i++) {
          if (!loadImage) {
            lazyLoad(img[i], 'scroll');
          }
          if (el('img.rc_lazy1oad', 'all').length == 0) loadImage = true;
        }
      }
      
      // next background (mobile)
      var disqs_top = el('#disqus_thread') || el('#disqus_trigger');
      if (isMobile && (getOffset(checkPoint).bottom + halfScreen) >= getOffset(el('#reader-mod')).bottom) {
        el('.rc_next button').style.background = 'rgba(0,0,0,.5)';
      } else {
        el('.rc_next button').style.background = null;
      }
      
      // auto show disqus
      if (el('#disqus_trigger') && el('#disqus_trigger').offsetHeight != '0') {
        if ((getOffset(checkPoint).bottom + halfScreen) >= getOffset(el('#disqus_trigger')).bottom) {
          el('#disqus_trigger').click();
        }
      }
    };
  }
  
  function replaceImage(note, data) {
    console.log('image type: '+ note);
    
    // auto stop page after html and js _reader loaded
    if (!WT_autoLike) loadListener('dom', windowStop);
    
    var cp = document.createElement('div');
    cp.id = 'check-point';
    cp.style.cssText = 'position:fixed;top:0;bottom:0;left:-2px;';
    document.body.appendChild(cp);
    checkPoint = el('#check-point');
    
    imgList = data.split('|');
    console.log('imgList.length: '+ imgList.length);
    
    var reader_html = '<div id="reader-mod">';
    for (var i = 0; i < imgList.length; i++) {
      if (imgList[i].search(rgxCdn) != -1) {
        if (imgList[i].search(/statically\./i) != -1 && mydb_settings.remove_statically) {
          chcdn = false;
          imgList[i] = imgList[i].replace(rgxCdn, '');
        } else {
          chcdn = true;
          loadCDN = true;
          cdnName = imgList[i].match(rgxCdn)[1];
        }
      }
      
      if (imgList[i].search(rgxGi) != -1) {
        chgi = true;
        imgGi = imgList[i].match(rgxGi);
        imgGi = imgGi[1] || imgGi[2];
        imgGi = Number(imgGi.replace(/[swh]/,''));
        imgGi = imgGi == 0 || imgGi > 800 ? 's'+ imgGi : 's1600';
      }
      
      reader_html += '<div class="reader_images" onclick="var img'+ (i+1) +'=this.querySelector(\'img\');mydb_open_new_tab(img'+ (i+1) +'.src?img'+ (i+1) +'.src:img'+ (i+1) +'.dataset.readImg)" title="'+ (i+1) +' - '+ imgList[i] +'">';
      reader_html += '<img style="min-height:750px;" class="rc_lazy1oad" data-read-img="'+ imgList[i] +'" alt="'+ (i+1) +'">';
      if (mydb_settings.number_reader) reader_html += '<div class="reader_index"><div class="rc_sticky"><div class="_rc">'+ (i+1) +'</div></div></div>';
      reader_html += '</div>'; //.reader_images
    }
    reader_html += '</div>';
    
    var reader_mod = document.createElement('div');
    reader_mod.style.cssText = 'width:100%;';
    if (mydb_settings.number_reader) {
      var reader_css = '#reader-mod .reader_images{position:relative;}#reader-mod .reader_index{position:absolute;top:0;bottom:0;}#reader-mod .reader_index .rc_sticky{position:sticky;top:50vh;}#reader-mod .reader_index ._rc{margin:0;}';
      reader_html = `<style>${reader_css}</style>`+ reader_html;
    }
    reader_mod.innerHTML = reader_html;
    
    if (note == 'api' && document.body.className.search(/new_cms|themesia|mangapark|webtoons/) == -1) {
      imgArea.appendChild(reader_mod);
    } else {
      imgArea.parentElement.insertBefore(reader_mod, imgArea);
      removeElem(imgArea);
    }
    imgArea = el('#reader-mod');
    
    overflowUnset(el('#reader-mod .reader_index .rc_sticky'));
    scrollImage(el('#reader-mod img', 'all'));
    readerBtnHtml(el('#reader-mod img', 'all'));
    document.body.classList.add('read-mode');
    
    if (wh.indexOf('webtoons') != -1) {
      document.body.classList.remove('fixed');
      if (WT_autoLike) {
        isPause = true;
        loadListener('load', function() {
          el('#likeItButton').scrollIntoView();
          var e_like = setInterval(function() {
            if (el('#footer_favorites.on')) {
              clearInterval(e_like);
              if (!el('#likeItButton ._btnLike.on')) el('#likeItButton').click();
              setTimeout(function() { el('.paginate a[class*="pg_next"]').click(); }, 1200);
            }
          }, 100);
        });
      }
    }
    
    // console.log(note, data);
  }
  
  // ============================================================================================================
  
  function defCustom() {
    if (wh.search(/animesc-kun|readcmic/) != -1) {
      var e_post = wh.indexOf('animesc-kun') != -1 ? el('#post-wrapper') : el('#main-wrapper');
      e_post.style.width = '100%';
      removeElem('#sidebar-wrapper');
    }
  }
  
  function defArea() {
    var d_def = [
      '#readerarea',
      '.reading-content',
      '.read-container',
      '#readerareaimg',
      '.reader-area',
      '#readarea',
      '.main-reading-area',
      '.viewer-cnt #all',
      '#Gambar_komik',
      '#viewer',
      '[for="Viewer-module"]',
      '[id^="Blog"] .post-body'
    ];
    
    var d_list = {
      "webtoons": "#_imageList",
      "mangacdn": ".entry-content",
      "komikfoxy": "#gallery-1",
      "mangadropout": "#displayNoAds .col-md-12.text-center",
      "manhuaid": ".row.mb-4 .col-md-12",
      "komiku": "#Baca_Komik",
      "bacakomik": "#chimg-auh",
      "nyanfm": ".elementor-widget-image-carousel",
      "readmangabat": ".container-chapter-reader",
      "rawdevart": "#img-container"
    };
    
    var d_site = wh.replace(wh_rgx, '').replace(/\.(.*?)+$/, '');
    
    if (d_site in d_list) {
      imgArea = el(d_list[d_site]);
    } else {
      for (var i = 0; i < d_def.length; i++) {
        if (el(d_def[i])) {
          imgArea = el(d_def[i]);
          break;
        }
      }
    }
  }
    
  function genImageDef() { //default
    defArea();
    console.log('imgArea (default): '+ document.body.contains(imgArea));
    if (!document.body.contains(imgArea)) alert('imgArea (default): '+ document.body.contains(imgArea));
    
    if (!imgArea) {
      console.error('!! Error: imgArea (default) not found');
      return;
    }
    
    var d_data = el('img', imgArea, 'all');
    if (d_data.length == 0) {
      alert('d_data.length: '+ d_data.length);
      return;
    }
    
    if (el('img[src=""]', imgArea)) removeElem(el('img[src=""]', imgArea)); //komikcast
    
    var img_def = '';
    for (var i = 0; i < d_data.length; i++) {
      var data_src = '';
      if (d_data[i].getAttribute('original')) {
        data_src = d_data[i].getAttribute('original');
      } else if (wh.indexOf('komiku.id') != -1) { //komiku.id
        data_src = d_data[i].dataset.src ? d_data[i].dataset.src : d_data[i].src;
        if (data_src.indexOf('http') == -1) data_src = '//img.komiku.co.id/low'+ data_src; //hd, nor, low
      } else if (d_data[i].dataset.src) {
        data_src = d_data[i].dataset.src;
      } else if (d_data[i].dataset.lazySrc) {
        data_src = d_data[i].dataset.lazySrc;
      } else if (d_data[i].dataset.url) {
        data_src = d_data[i].dataset.url;
      } else if (d_data[i].dataset.imgsrc) {
        data_src = d_data[i].dataset.imgsrc;
      } else if (d_data[i].dataset.cfsrc) {
        data_src = d_data[i].dataset.cfsrc;
      } else {
        data_src = d_data[i].src;
      }
      img_def += data_src.replace(/^\s+/, '').replace(/\s+$/, '');
      if (i < d_data.length-1) img_def += '|';
    }
    
    defCustom();
    replaceImage('default', img_def);
  }
  
  // ============================================================================================================
  
  function apiCustom(main, data) {
    // change & remove element
    if (document.body.classList.contains('themesia')) {
      localStorage.setItem('tsms_readingmode', 'full');
      if (data.nextUrl == '') {
        removeElem('.nextprev [rel="next"]', 'all');
      /*} else if (document.body.classList.contains('ads_newtab')) {
        el('.ctop .nextprev [rel="next"]').dataset.href = data.nextUrl;
        el('.cbot .nextprev [rel="next"]').dataset.href = data.nextUrl;*/
      } else {
        el('.ctop .nextprev [rel="next"]').href = data.nextUrl;
        el('.cbot .nextprev [rel="next"]').href = data.nextUrl;
      }
    } else if (wh.indexOf('webtoons') != -1) {
      el('.viewer_footer').style.cssText = 'position:absolute;top:0;';
      el('.viewer_footer').parentElement.style.cssText = 'position:relative;';
    } else if (document.body.classList.contains('new_cms')) {
      main.innerHTML = '';
      main.removeAttribute('id');
    } else if (wh.indexOf('merakiscans') != -1) {
      removeElem(el('#content', main));
      el('#toHome').style.cssText = 'height:0;overflow:hidden;';
      el('#toTop').style.cssText = 'height:0;overflow:hidden;';
    } else if (wh.indexOf('softkomik') != -1) {
      if (data.nextData.length > 0) {
        el('#content-mod a').setAttribute('rel', 'next');
        el('#content-mod a').href = '/'+ data.komik.title_slug +'/chapter/'+ data.nextData[0].chapter;
      }
    } else if (wh.indexOf('mangayu') != -1) {
      el('.m-scroll-chapter').classList.remove('sticky');
    } else if (wh.indexOf('komikrealm') != -1) {
      removeElem(el('[id^="chapterImage"]', main));
    } else if (document.body.classList.contains('reader_cms')) {
      var my_next = wh.indexOf('comicfx') != -1 ? el('.ch-nav a.ch-next') : el('.pager-cnt .pull-right a');
      if (window['next_chapter'] != '') {
        if (my_next) my_next.href = window['next_chapter']; //from web
      } else {
        if (my_next) removeElem('.ch-nav a.ch-next', 'all');
      }
    }
  }
  
  function genImageApi(data) {
    var a_list = {
      "softkomik": ["#content-mod #readerarea","imgSrc"],
      "mangayu": ["#mangaReading","images"],
      "webtoons": ["#_viewer"],
      "merakiscans": ["#container"],
      "mangapark": ["#readerarea","httpLis"],
      "zeroscans": ["main .container"],
      "komikrealm": ["#readarea"]
    };
    
    var a_site = wh.replace(wh_rgx, '').replace(/\.(.*?)+$/, '');
    var a_elem, a_data;
    
    if (a_site in a_list) {
      a_elem = a_list[a_site][0];
      a_data = a_list[a_site].length == 2 ? data[a_list[a_site][1]] : data;
    } else if (document.body.classList.contains('themesia')) {
      a_elem = el('#readerarea');
      a_data = data.sources[0].images;
    } else if (document.body.classList.contains('new_cms')) {
      a_elem = '#pages-container';
      a_data = data;
    } else if (document.body.classList.contains('reader_cms')) {
      a_elem = el('.viewer-cnt');
      a_data = data;
    }
    
    imgArea = typeof a_elem == 'string' ? el(a_elem) : a_elem;
    if (!imgArea) {
      alert('!! Error: imgArea (api) not found');
      return;
    }
    
    if (a_data.length == 0) {
      alert('a_data.length: '+ a_data.length);
      return;
    }
    
    var img_api = '';
    for (var i = 0; i < a_data.length; i++) {
      var data_src = '';
      if (wh.indexOf('webtoons') != -1) {
        data_src = a_data[i].url;
      } else if (wh.indexOf('mangapark') != -1) {
        data_src = a_data[i] +'?'+ data.wordLis[i]; //v5
      } else if (wh.indexOf('softkomik') != -1) {
        data_src = '//cdn.softkomik.com/'+ a_data[i];
      } else if (wh.search(/mangayu/) != -1 || document.body.classList.contains('themesia')) {
        data_src = a_data[i];
      } else if (document.body.classList.contains('reader_cms')) {
        data_src = a_data[i].page_image;
      } else {
        data_src = data[i];
      }
      img_api += data_src;
      if (i < a_data.length-1) img_api += '|';
    }
    
    apiCustom(imgArea, data);
    replaceImage('api', img_api);
  }
  
  // ============================================================================================================
  
  function getImageScript(key) {
    var eData = '';
    var eScript = el('body script', 'all');
    for (var i = 0; i < eScript.length; i++) {
      if (eScript[i].innerHTML.search(key) != -1) {
        eData = eScript[i].innerHTML.toString(); //from web
        break;
      }
    }
    return eData == '' ? false : eData; //if "data" more than 1
  }
  
  function checkAll() {
    //if (el('[rel="tag"]') && el('[rel="tag"]').innerHTML.search(/project/i) != -1) return;
    
    if (wh.indexOf('komikrealm') != -1) { //api
      genImageApi(_chapterImage); //from web
    }
    
    if (wh.indexOf('webtoons') != -1 && isMobile) { //api
      genImageApi(imageList); //from web
    }
    
    if (wh.indexOf('reaperscans.com') != -1) { //reaperscans (en)
      el('main nav').nextElementSibling.id = 'readerarea';
    }
    
    if (wh.indexOf('readcmic') != -1) { //Show nextprev
      el('.post-footer').insertBefore(el('.nextprev'), el('.post-footer').children[0]);
    }
    
    if (wh.indexOf('mangacdn') != -1) { //mangaindo
      el('.readinfo').parentElement.insertBefore(el('#post-nav'), el('.readinfo')); //Show nextprev
    }
    
    if (wh.indexOf('komiku.id') != -1) { //click
      document.body.classList.add('click');
      el('.main').outerHTML = el('.main').outerHTML; //stop infinite scroll
    }
    
    if (wh.indexOf('comicnime') != -1) { //emissionhex
      var r_area = el('#chapterSelect').parentElement.nextElementSibling;
      r_area.setAttribute('for', 'Viewer-module');
    }
    
    if (wh.indexOf('hayatoscans') != -1) { //emissionhex
      var r_area = el('#nPL').nextElementSibling;
      r_area.setAttribute('for', 'Viewer-module');
    }
    
    if (wh.indexOf('zeroscans') != -1) {
      var z_next = getParents(el("//*[contains(text(), 'next')]", 'xpath'), 'a');
      if (z_next.length > 0) {
        var z_new = document.createElement('a');
        z_new.setAttribute('rel', 'next');
        z_new.href = z_next[0].href;
        el('main').appendChild(z_new);
      }
      
      var z_data = __ZEROSCANS__.data[0].current_chapter.good_quality; //from web
      genImageApi(z_data);
    }
    
    if (wh.indexOf('komiknesia') != -1) { //eastheme
      if (wl.href.indexOf('?read=list') == -1) {
        window.stop();
        wl.href = wl.href.replace(/\?read\=paged?/g, '') + '?read=list';
        return;
      }
    }
    
    if (wh.search(batoto_rgx) != -1) {
      document.body.classList.add('batoto');
      var eAll = el('select [label="Load pages"] option[value="a"]');
      if (eAll.selected == false) {
        window.stop();
        wl.href = wl.href.replace(/(\/chapter\/)(.*)/g, '$1'+ episodeIid); //from web
        return;
      }
    }
    
    if (wh.indexOf('funmanga') != -1) {
      el('.img-responsive').parentElement.id = 'readerarea';
      if (wp.indexOf('all-pages') == -1) {
        window.stop();
        wl.href = wl.href.replace(/(\/\d+)\/\d(.*)/g, '$1') + '/all-pages';
        return;
      }
      el('.chapter-read').appendChild(el('.prev-next-post'));
    }
    
    if (wh.indexOf('mangayu') != -1) {
      var yu_rgx = /read\("/;
      var yu_chk = setInterval(function() {
        if (getImageScript(yu_rgx)) {
          clearInterval(yu_chk);
          getData(getImageScript(yu_rgx).match(/read\("([^"]+)"\)/)[1]);
        }
      }, 100);
    }
    
    if (wh.indexOf('softkomik') != -1) { //api
      /* CDN
       - cdnwk.softkomik.com
       - cdn.softkomik.com
       - drive-image.softkomik.com
       - softkomik.com/img?url=
       - spaces.animeyusha.com
      */
      var api_data = JSON.parse(el('#__NEXT_DATA__').innerHTML);
      removeElem('#__NEXT_DATA__');
      
      var content = el('#__next');
      var new_content = document.createElement('div');
      new_content.id = 'content-mod';
      new_content.innerHTML = '<div id="readerarea"></div><a href="#">next</a>';
      content.parentElement.insertBefore(new_content, content);
      removeElem(content);
      
      genImageApi(api_data.props.pageProps.data);
    }
    
    if (wh.indexOf('mangapark') != -1) { //script
      // v5
      localStorage.setItem('page_chapter_load', '1'); //all pages
      
      var api_data = JSON.parse(el('#__NEXT_DATA__').innerHTML);
      removeElem('#__NEXT_DATA__');
      
      var content = el('[name="head-panel"]').parentElement.nextElementSibling;
      var new_content = document.createElement('div');
      new_content.id = 'readerarea';
      content.parentElement.insertBefore(new_content, content);
      removeElem(content);
      
      genImageApi(api_data.props.pageProps.dehydratedState.queries[0].state.data.data.imageSet);
    }
    
    if (wh.indexOf('mangacanblog') != -1) {
      var can_rgx = /(?:var|let|const)?\s?([^\s=]+)\s?=\s?\'\{"ciphertext/i;
      var can_elem = el('#readerarea').nextElementSibling;
      var can_scr = can_elem.innerHTML;
      var can_id = can_scr.match(can_rgx)[1];
      var can_data = window[can_id];
      removeElem(can_elem);
      
      function abcd(data) {
        var d_obj = JSON.parse(data);
        var d_enc = d_obj.ciphertext;
        var d_salt = CryptoJS.enc.Hex.parse(d_obj.salt);
        var d_iv = CryptoJS.enc.Hex.parse(d_obj.iv);
        var d_pass = CryptoJS.PBKDF2('_0xcfdi', d_salt, {
          hasher: CryptoJS.algo.SHA512,
          keySize: 64 / 8,
          iterations: 999
        });
        var d_arr = CryptoJS.AES.decrypt(d_enc, d_pass, {
          iv: d_iv
        });
        return d_arr.toString(CryptoJS.enc.Utf8)
      }
      
      el('#readerarea').innerHTML = abcd(can_data).replace(/\ssrc=/, 'data-src=');
    }
    
    if (document.body.classList.contains('madara')) {
      if (wl.href.indexOf('?style=paged') != -1) {
        window.stop();
        wl.href = wl.href.replace(/\?style\=paged?/g, '') + '?style=list';
        return;
      }
    }
    
    if (document.body.classList.contains('reader_cms')) { //my Manga Reader CMS
      //if (el('#all')) el('#all').style.display = 'block';
      //if (el('#ppp')) el('#ppp').style.display = 'none';
      if (wh.indexOf('comicfx') != -1 && el('.viewer-cnt .isi-chapter')) removeElem('.viewer-cnt .isi-chapter');
      genImageApi(window['pages']); //from web
    }
    
    if (document.body.classList.contains('new_cms')) { //new cms
      var eShow = setInterval(function() {
        if (window['chapterPages']) {
          clearInterval(eShow);
          genImageApi(window['chapterPages']); //from web
        }
      }, 100);
    }
    
    if (document.body.classList.contains('themesia')) { //Themesia new
      var ts_rgx = /ts_reader\.run/;
      var ts_chk = setInterval(function() {
        if (getImageScript(ts_rgx)) {
          clearInterval(ts_chk);
          ts_chk = false;
          var ts_data = JSON.parse(getImageScript(ts_rgx).match(/(\{[^\;]+)\)\;/)[1].replace(/:\s?\'/g, ':"').replace(/\',/g, '",'));
          ts_data.sources[0].images.length == 0 ? alert('!! NO CHAPTER !!') : genImageApi(ts_data);
        }
      }, 100);
      
      // use element
      loadListener('dom', function() {
        if (ts_chk) {
          clearInterval(ts_chk);
          genImageDef();
        }
      });
    }
    
    if (wh.indexOf('mangadropout') != -1) {
      var mwp = wp.match(/collection[^\d]*\/\d+\/([^\/]*)/)[1];
      var mid = el('#displayNoAds');
      var mlnk = el('a', mid, 'all');
      for (var i = 0; i < mlnk.length; i++) {
        if (mlnk[i].href.indexOf('generelatelink') != -1) {
          var mnm = mlnk[i].href.match(/generelatelink[^\d]*\/(\d+)\/([^\/\?\#]*)/);
          mlnk[i].href = '//mangadropout.net/collection/link/'+mnm[1]+'/'+mwp+'/chapter/'+mnm[2];
        }
      }
    }
    
    if (wh.indexOf('merakiscans') != -1) { //script
      function elemMS() {
        var deferImg = el('script[defer]','all');
        for (var i = 0; i < deferImg.length; i++) {
          if (deferImg[i].innerHTML.indexOf('currentChapter ') != -1) {
            return deferImg[i].innerHTML;
          }
        }
      }
      function dataMS(tImg) {
        var regexImg = new RegExp('var\\s' + tImg + '\\s\\=\\s([^;]*)', 'g');
        var allImg = scriptMS.match(regexImg).toString();
        allImg = allImg.replace(regexImg, '$1');
        return tImg == 'images' ? allImg.replace(/\[|\"\]/g, '').replace(/\"\,/g, ',').replace(/\"/g, '/manga/'+ dataMS('manga_slug') +'/'+ dataMS('viewschapter') + '/').split(',') : allImg.replace(/\"/g, '');
      }
      var scriptMS = elemMS();
      var imgMS = dataMS('images');
      genImageApi(imgMS);
    }
    
    if (document.body.className.search(rgxApi) == -1 || (wh.indexOf('webtoons') != -1 && !isMobile)) genImageDef();
  }
  
  
  var wl = window.location;
  var wh = wl.hostname;
  var wp = wl.pathname;
  var chcdn = false; //if image use CDN, wp.com | statically.io | imagesimple.co
  var chgi = false; //if google images
  var loadCDN = false;
  var loadGi = false;
  var loadImage = false; //all images loaded
  var isPause = false; //pause images from loading
  var isFrom = false; //load image from [index]
  var isMobile = document.documentElement.classList.contains('is-mobile') ? true : false; //from database tools
  var WT_autoLike = false; //webtoons auto like
  var imgGi = ''; //default google image size
  var halfScreen = Math.floor((window.screen.height / 2) + 30);
  var rgxCdn = /(?:i\d+|cdn|img)\.(wp|statically|imagesimple)\.(?:com?|io)\/(?:img\/(?:[^\.]+\/)?)?/i;
  var rgxGi = /\/([swh]\d+)(?:-[\w]+[^\/]+)?\/|=([swh]\d+)[^\w]+(.*)/i;
  var rgxApi = /new_cms|reader_cms|themesia|kyuroku|merakiscans|mangapark|softkomik|webtoons|zeroscans|komikrealm/i;
  var checkPoint, imgArea, imgList, cdnName, zoomID;
  
  // START reader
  if (mydb_reader && !mydb_project && typeof bakomon_web === 'undefined') {
    console.log('page: chapter');
    zoomID = getId('reader');
    if (localStorage.getItem(zoomID)) localStorage.removeItem(zoomID); //temporary
    mydb_zoom = localStorage.getItem('mydb_zoom') ? JSON.parse(localStorage.getItem('mydb_zoom')) : {};
    window.onunload = function() { window.scrollTo(0,0); }; //prevent browsers auto scroll on reload/refresh
    checkAll();
    mydb_read = true;
    if (el('#_loader')) removeElem('#_loader');
  } else {
    mydb_read = false;
  }
  // START reader
  
  mydb_info['reader_js'] = 'loaded';
  
  if (mydb_settings.remove_site.history) {
    if (localStorage.getItem('visited-chapters')) localStorage.removeItem('visited-chapters'); //komikcast
    if (localStorage.getItem('history')) localStorage.removeItem('history');
    if (localStorage.getItem('bm_history')) localStorage.removeItem('bm_history'); //themesia
    if (localStorage.getItem('ts_history')) localStorage.removeItem('ts_history'); //themesia
    if (localStorage.getItem('ts_hs_history')) localStorage.removeItem('ts_hs_history'); //themesia
    indexedDB.open('cfx_komik').onsuccess = function() { indexedDB.deleteDatabase('cfx_komik') }; //comicfx
    indexedDB.open('ts_series_history').onsuccess = function() { indexedDB.deleteDatabase('ts_series_history') }; //themesia
    if (wh.search(batoto_rgx) != -1) indexedDB.open('history').onsuccess = function() { indexedDB.deleteDatabase('history') }; //batotoo
  }
}

if ((typeof live_test_comic_r != 'undefined' && typeof mydb_crjs_loaded != 'undefined') && (!live_test_comic_r && !mydb_crjs_loaded)) {
  var db_cr_check = setInterval(function() {
    if (mydb_loaded) {
      clearInterval(db_cr_check);
      clearTimeout(db_cr_wait);
      mydb_cr_fnc();
    }
  }, 100);
  var db_cr_wait = setTimeout(function() { clearInterval(db_cr_check); }, 60000);
}
