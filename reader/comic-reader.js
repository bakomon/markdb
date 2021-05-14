// COMIC READER
(function() {
  // Position (X,Y) element https://stackoverflow.com/a/28222246
  function getOffset(el, p) {
    const rect = el.getBoundingClientRect();
    var xy = p == 'left' ? rect.left + window.scrollX : rect.top + window.scrollY;
    return xy;
  }
  
  // Simple querySelector https://codepen.io/pen/oKYOEK
  function el(e,l,m) {
    var elem, parent = l != 'all' && (l || l === null) ? l : document;
    if (parent === null) {
      elem = parent;
      console.error('selector: '+ e +' => parent: '+ parent);
    } else {
      elem = (m || l == 'all') ? parent.querySelectorAll(e) : parent.querySelector(e);
    }
    return elem;
  }  
  
  // Add script to head https://codepen.io/sekedus/pen/QWKYpVR
  function addScript(n,o,t,e,s) {
    // data, id, info, boolean, parent
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
  }
  
  // Remove element https://codepen.io/sekedus/pen/ZEYRyeY
  function removeElem(elem, index) {
    var elmn = typeof elem === 'string' ? document.querySelectorAll(elem) : elem;
    if (!elmn || (elmn && elmn.length == 0)) {
      console.error('ERROR: removeElem(), elem = ', elem);
      return;
    }
    // if match 1 element & have specific index
    if (elmn && !elmn.length && index) {
      console.error('ERROR: use querySelectorAll() for specific index');
      return;
    }
    
    elmn = index ? (index == 'all' ? elmn : elmn[index]) : (typeof elem == 'string' || elmn.length ? elmn[0] : elmn);
    
    if (elmn.length && index == 'all') {
      for (var i = 0; i < elmn.length; i++) {
        elmn[i].parentElement.removeChild(elmn[i]);
      }
    } else {
      elmn.parentElement.removeChild(elmn);
    }
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
        createImage(imgData);
      }
    };
    x.open('GET', url, true);
    x.send();
  }
  
  function reloadComment(id) {
    var par_dsqs = el('#disqus_thread').parentNode;
    removeElem('#disqus_thread');
    
    var disqus_load = document.createElement('div');
    disqus_load.innerHTML = '<div style="text-align:center;"><button id="disqus_trigger" style="border:0;padding:5px 10px;font-size:20px;cursor:pointer;">Post a Comment</button></div>';
    par_dsqs.appendChild(disqus_load);
    
    var disqus_new = document.createElement('div');
    par_dsqs.appendChild(disqus_new);
    
    el('#disqus_trigger').onclick = function() {
      this.style.display = 'none';
      disqus_new.id = 'disqus_thread';
      addScript('//' + id + '.disqus.com/embed.js', true);
    };
  }
  
  function startChange(img, note) {
    var imgs = '';
    if ((getOffset(img, 'top') < (getOffset(checkPoint, 'top') + 1000) && !img.classList.contains('rc_loaded')) || note != undefined) {
      imgs = img.dataset.readImg;
      if (loadCDN) imgs = imgs.replace(/(?:i\d+|cdn)\.(wp|statically)\.(?:com|io)\//g, '');
      if (imgs.search(/(pending\-load|cdn\.statically\.io)/) != -1) {
        imgs = imgs.replace(/\?(.*)/g, ''); //remove location.search ?=
      } else if (loadSize) {
        var sNum = el('.rc_size').innerHTML;
        imgs = imgs.replace(/\/([swh]\d+)(?:-[\w]+[^\/]*)?\//, '/'+ sNum +'/');
        imgs = imgs.replace(/=[swh](\d+)[^\n]*/, '='+ sNum);
        if (imgs.indexOf('docs.google') != -1) imgs = 'https://lh3.googleusercontent.com/d/'+ imgs.match(/[^\n]+id=([^&]+)/)[1] +'='+ sNum;
      }
      img.src = imgs;
      img.classList.add('rc_loaded');
      setTimeout(function() {img.style.minHeight = null}, 1500);
    }
  }
  
  function scrollImage(img) {
    window.onscroll = function() {
      if (!isPause) {
        for (var i = 0; i < img.length; i++) {
          if (!loadImage) {
            startChange(img[i]);
          }
          if (img[img.length-1].src) {loadImage = true;}
        }
      }
    };
  }
  
  function nextChapter() {
    var chNav, chUrl, nextCh, nextChk, nextLink;
    var chNum = wp.replace(/(?:\/(?:manga|comic|komik)\/)?[^\/]*\/([^\/]*)\/?/g, '$1');
    if (wh.indexOf('mangacanblog') != -1) {
      chNav = el('.pager select[name="chapter"]').options;
    } else if (wh.indexOf('mangapark') != -1) {
      chNav = el('#sel_book_1').options;
    } else if (wh.indexOf('merakiscans') != -1) {
      el('#chapter_select option[value="'+ chNum +'"]').selected = true;
      chNav = el('#chapter_select').options;
      chUrl = el('#reader_text a').href;
      removeElem('#next, #nextbot, #page_select', 'all');
    }
    
    nextChk = wh.search(/merakiscans|mangapark/) != -1 ? 'nextElementSibling' : 'previousElementSibling';
    for (var i = 0; i < chNav.length; i++) {
      if (chNav[i].selected == true) {nextCh = chNav[i];}
    }
    
    if (nextCh[nextChk]) {
      nextLink = nextCh[nextChk].value;
      if (wh.search(/merakiscans/) != -1) {
        nextLink = chUrl +'/'+ nextLink;
      } else if (wh.search(/mangapark/) != -1) {
        nextLink = el('.switch .loc a').href + nextLink;
      } else if (wh.indexOf('mangacanblog') != -1) {
        var manga_name = el('.pager select[name="manga"]').value;
        var next_plus = ((nextLink-1)+2);
        nextLink = '//'+ wh +'/baca-komik-'+ manga_name +'-'+ nextLink +'-'+ next_plus +'-bahasa-indonesia-'+ manga_name +'-'+ nextLink +'-terbaru.html';
      }
      el('.rc_next button').setAttribute('data-href', nextLink);
      el('.rc_next').classList.remove('rc_hidden');
      if (isMobile) el('.rc_next2').classList.remove('rc_hidden');
    }
  }
  
  function createBtn(img) {
    var readSize = localStorage.getItem(zoomID) && !isMobile ? localStorage.getItem(zoomID) : imgArea.offsetWidth;
    var r_txt = '';
    // css control & main already in css tools
    // css reader
    r_txt += '<style>.rc_100{width:100%;}.rc_50{width:50%;}.reader_db{position:fixed;bottom:0;right:0;width:150px;padding:10px;background:#17151b;border:1px solid #333;border-right:0;border-bottom:0;}.reader_db.rc_shide{right:-150px;}._rc{background:#252428;color:#ddd;padding:4px 8px;margin:4px;font:14px Arial;cursor:pointer;border:1px solid #3e3949;}._rc a{color:#ddd;font-size:14px;text-decoration:none;}.rc_line{margin-bottom:10px;padding-bottom:10px;border-bottom:5px solid #333;}.rc_text{padding:4px 8px;margin:4px;}.rc_selected,.rc_btn:not(.rc_no_hover):hover{background:#4267b2;border-color:#4267b2;}.rc_active{background:#ea4335;border-color:#ea4335;}input._rc{padding:4px;display:initial;cursor:text;height:auto;background:#252428 !important;color:#ddd !important;border:1px solid #3e3949;}input._rc:hover{border-color:#3e3949;}.rc_all{width:30px !important;}.rc_pause{border-radius:50%;}.rc_tr2{position:absolute;bottom:0;left:-40px;}.rc_tr2 .rc_btn{align-items:center;width:40px;height:40px;font-size:30px !important;padding:0;margin:0;line-height:0;}.rc_hidden{display:none;}</style>';
    r_txt += '<style>.scrollToTop,[title*="Back To Top"],.back-to-top,.go-to-top,.btn-top{display:none !important;}</style>'; //css hidden
    r_txt += '<style>.rc_mobile ._rc{font-size:16px;}.rc_mobile .rc_toggle{position:absolute;bottom:0;left:-70px;width:70px;height:70px;background:transparent;color:#fff;border:0;}.rc_mobile .rc_bg{position:fixed;top:0;bottom:0;left:0;right:0;background:rgba(0,0,0,.5);}.rc_mobile .rc_tr2{left:-81px;}.rc_mobile .reader_db:not(.rc_shide) .rc_tr2{left:-40px;}.rc_mobile .reader_db.rc_shide .rc_next button{position:fixed;top:0;bottom:0;left:0;margin:0;max-width:20%;background:0 0;color:transparent;border:0;}</style>'; //css mobile
    // html
    r_txt += '<div class="rc_bg'+ (isMobile ? ' rc_hidden' : '') +'"></div>';
    r_txt += '<div class="reader_db'+ (isMobile ? ' rc_shide' : '') +' flex_wrap f_bottom">';
    r_txt += '<div class="rc_tr1 flex_wrap">';
    r_txt += '<div class="rc_others rc_line rc_100 flex rc_hidden">';
    if (chcdn) r_txt += '<div class="rc_cdn rc_btn _rc" title="'+ cdnName +'">CDN</div>';
    if (chgi) r_txt += '<div class="rc_size rc_btn _rc">'+ imgSize +'</div>';
    r_txt += '</div>'; //.rc_others
    r_txt += '<div class="rc_next rc_line rc_100 rc_hidden"><button class="rc_btn _rc" title="arrow right &#9656;" oncontextmenu="window.open(this.dataset.href)" onclick="window.location.href=this.dataset.href">Next Chapter</button></div>';
    r_txt += '<div class="rc_home rc_line rc_100"><button class="rc_btn _rc" onclick="window.location.href=\'//\'+window.location.hostname">Homepage</button></div>';
    r_txt += '<div class="rc_load rc_line flex">';
    r_txt += '<button class="rc_ld_img rc_btn _rc" title="alt + a">Load</button>';
    r_txt += '<input class="rc_all rc_input _rc" value="all" onclick="this.select()">';
    r_txt += '<button class="rc_pause rc_btn _rc rc_no_hover" title="Pause images from loading">X</button>';
    r_txt += '</div>';// .rc_load
    //var zoom_size = document.body.classList.contains('is-manga') ? '750' : document.body.classList.contains('is-manhua') ? '650' : '500'; //from comic bookmark
    r_txt += '<div class="rc_zoom rc_100"><button class="rc_plus rc_btn _rc" title="shift + up">+</button><button class="rc_less rc_btn _rc" title="shift + down">-</button><input style="width:40px;" class="rc_input _rc" value="'+ readSize +'"></div>';
    r_txt += '</div>';// .rc_tr1
    r_txt += '<div class="rc_tr2 '+ (isMobile ? ' flex f_bottom' : '') +'">';
    r_txt += '<div class="rc_td1'+ (isMobile ? '' : ' rc_hidden') +'">';
    r_txt += '<div class="rc_next2 rc_btn _rc flex f_center rc_hidden" onclick="window.location.href=document.querySelector(\'.rc_next button\').dataset.href">&#9656;</div>';
    r_txt += '<div class="rc_load2 rc_btn _rc flex f_center" onclick="document.querySelector(\'.rc_ld_img\').click()">&#671;</div>';
    r_txt += '</div>';// .rc_td1
    r_txt += '<div class="rc_td2">';
    r_txt += '<div class="rc_rest"><div class="rc_reload rc_btn _rc flex f_center rc_hidden" onclick="window.location.reload()" title="alt + r">&#8635;</div><div class="rc_stop rc_btn _rc flex f_center" title="alt + x">&#10007;</div></div>';
    r_txt += '<div class="rc_top rc_btn _rc flex f_center">&#9652;</div>';
    r_txt += '<div class="rc_bottom rc_btn _rc flex f_center">&#9662;</div>';
    r_txt += '<div class="rc_toggle rc_btn _rc flex f_center">&#174;</div>';
    r_txt += '</div>';// .rc_td2
    r_txt += '</div>';// .rc_tr2
    r_txt += '</div>';// .reader_db
    
    var r_html = document.createElement('div');
    r_html.style.cssText = 'position:relative;z-index:2147483646;';
    r_html.className = '_reader cbr_mod'+ (isMobile ? ' rc_mobile' : '');
    r_html.innerHTML = r_txt;
    document.body.appendChild(r_html);
    if (isMobile) el('.rc_toggle').classList.add('rc_no_hover');
    if (chcdn || chgi) el('.rc_others').classList.remove('rc_hidden');
    imgArea.style.cssText = 'max-width:'+ readSize +'px !important;';
    
    if (wh.search(/mangacanblog|merakiscans|mangapark/) != -1) {nextChapter();} //next button
    
    el('.rc_toggle').onclick = function() {
      this.classList.toggle('rc_selected');
      el('.reader_db').classList.toggle('rc_shide');
      if (isMobile) el('.rc_bg').classList.toggle('rc_hidden');
      if (el('.rc_next button').dataset.href) el('.rc_next2').classList.toggle('rc_hidden');
      el('.rc_tr2 .rc_td1').classList.toggle('rc_hidden');
    };
    
    el('.rc_bg').onclick = function() {
      el('.rc_toggle').click();
    };
    
    // Load all images
    el('.rc_load .rc_ld_img').onclick =  function() {
      if (el('.rc_all').value.search(/all/i) != -1) {
        loadImage = true;
        for (var i = 0; i < img.length; i++) {
          startChange(img[i], 'all');
        }
      } else {
        startChange(img[Number(el('.rc_all').value) - 1], 'single');
      }
    };
    
    el('.rc_load .rc_pause').onclick =  function() {
      this.classList.toggle('rc_active');
      el('.rc_ld_img').disabled = isPause ? false : true;
      isPause = isPause ? false : true;
    };
    
    if (chgi) {
      el('.rc_size').onclick = function() {
        this.innerHTML = this.innerHTML == imgSize ? 's15000' : imgSize;
        loadSize = this.innerHTML == imgSize ? false : true;
      };
    }
    
    if (chcdn) {
      el('.rc_cdn').onclick = function() {
        this.innerHTML = this.innerHTML == 'CDN' ? 'not' : 'CDN';
        loadCDN = this.innerHTML == 'CDN' ? false : true;
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
        imgArea.style.cssText = 'max-width:'+ load_zm +'px !important;';
        el('.rc_zoom input').value = load_zm;
        localStorage.setItem(zoomID, load_zm);
      });
    });
    
    el('.rc_stop').onclick = function() {
      window.stop();
      this.classList.add('rc_hidden');
      el('.rc_reload').classList.remove('rc_hidden');
    };
    
    // back to top
    el('.rc_top').onclick = function() {
      document.body.scrollIntoView();
    };
    
    // back to bottom
    el('.rc_bottom').onclick = function() {
      var cmt_el = el('#disqus_trigger') || el('.webtoons\\.com .comment_area');
      if (cmt_el) {
        cmt_el.parentNode.scrollIntoView();
      } else {
        //document.body.scrollIntoView(false);
        window.scrollTo(0, imgArea.scrollHeight);
      }
    };
    
    /*
    note:
    - .pager-cnt .pull-right = my Manga Reader CMS
    - .btn-sm i[class*="right"] = new CMS "scans"
    - i[rel="next"] = ads_newtab
    */
    var next_chap =  el('.mangayu\\.com a>i[class*="arrow-right"]') || el('.manhuaid\\.com a[class*="float-left"]') || el('.readmng\\.com a[class*="next_page"]') || el('.funmanga\\.com #chapter-next-link') || el('.m\\.mangabat\\.com .navi-change-chapter-btn-next') || el('.bato\\.to .nav-next a') || el('.btn-sm i[class*="right"]') || el('.pager-cnt .pull-right a') || el('a[rel="next"]') || el('a[class*="next"]') || el('i[rel="next"]');
    if (next_chap) {
      next_chap = document.body.className.search(/new_cms|mangadropout|mangayu/) != -1 ? next_chap.parentNode : next_chap;
      var next_url = /*document.body.classList.contains('ads_newtab') ? next_chap.dataset.href :*/ next_chap.href;
      el('.rc_next button').setAttribute('data-href', next_url);
      el('.rc_next').classList.remove('rc_hidden');
      if (isMobile) el('.rc_next2').classList.remove('rc_hidden');
    }
    
    var next_chk = setInterval(function() {
      var elm_url = el('.mangadex\\.org .reader-controls-chapters a[class*="right"]');
      if (elm_url && elm_url.href != wl.href) {
        clearInterval(next_chk);
        if (wh.indexOf('mangadex') != -1) {
          el('.rc_next button').dataset.href = elm_url.href;
          if (el('.rc_reload').classList.contains('rc_hidden')) el('.rc_stop').click();
        }
      }
    }, 100);
    
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
          if (wh.search(/mangadex|softkomik/) != -1 /*|| document.body.classList.contains('ads_newtab')*/) {
            wl.href = el('.rc_next button').dataset.href;
          } else {
            next_chap.click();
          }
        }
      }
    };
    
    // after html and js _reader loaded then auto click to stop page
    if (el('.rc_reload').classList.contains('rc_hidden') && wh.search(/webtoons|mangadex/) == -1) el('.rc_stop').click();
  }
  
  function startImage(prnt, imgs) {
    var cp = document.createElement('div');
    cp.id = 'check-point';
    cp.style.cssText = 'z-index:2;color:transparent;position:fixed;bottom:-400px;';
    cp.innerHTML = '.';
    document.body.appendChild(cp);
    checkPoint = el('#check-point');
    
    if (!prnt && !imgs) {
      var st = [
        '0','#readerarea',
        '1','.reading-content',
        '2','.read-container',
        '3','#readerareaimg',
        '4','.reader-area',
        '5','.main-reading-area',
        '6','.viewer-cnt #all',
        '7','#Gambar_komik',
        '8','#viewer',
        '9','[id^="Blog"] .post-body',
        'webtoons.com','.viewer_lst .viewer_img',
        'mangacdn.my.id','.entry-content',
        'mangacanblog.com','#imgholder',
        'komikfoxy.xyz','#gallery-1',
        'mangabat.com','.container-chapter-reader',
        'mangadropout.net','#displayNoAds .col-md-12.text-center',
        'manhuaid.com','.row.mb-4 .col-md-12',
        'komiku.id','#Baca_Komik',
        'bacakomik.co','#chimg-auh',
        'rawdevart.com','#img-container'
      ];
      var area_s = el(st[1]) || el(st[3]) || el(st[5]) || el(st[7]) || el(st[9]) || el(st[11]) || el(st[13]) || el(st[15]) || el(st[17]) || el(st[19]);
      var s_length = st.length;
      if (s_length % 2 == 1) {
        s_length--
      }
      for (var j = 18; j < s_length; j += 2) {
        if (wh.indexOf(st[j]) != -1) {
          imgArea = el(st[j + 1]);
          break;
        } else {
          imgArea = area_s;
        }
      }
      console.log('imgArea: '+ document.body.contains(imgArea));
      if (!imgArea) return;
    }
    if (prnt && imgs) imgArea = prnt;
    if (el('img[src=""]', imgArea)) removeElem(el('img[src=""]', imgArea)); //komikcast
    imgList = prnt && imgs ? imgs.split(',') : el('img', imgArea, 'all');
    if (!imgList) {return}
    console.log('imgList.length: '+ imgList.length);
    
    var reader_html = '<div id="reader-mod">';
    for (var j = 0; j < imgList.length; j++) {
      var imgLink;
      //if (imgList[j].src && imgList[j].src == wl.href) continue;
      if (prnt && imgs) {
        imgLink = imgList[j];
      } else if (imgList[j].getAttribute('original')) { //manhwa-san.com
        imgLink = imgList[j].getAttribute('original');
      } else if (wh.indexOf('komiku.id') != -1) { //komiku.id
        imgLink = imgList[j].dataset.src ? imgList[j].dataset.src : imgList[j].src;
        if (imgLink.indexOf('http') == -1) imgLink = '//img.komiku.co.id/low'+ imgLink; //hd, nor, low
      } else if (imgList[j].dataset.src) {
        imgLink = imgList[j].dataset.src;
      } else if (imgList[j].dataset.lazySrc) {
        imgLink = imgList[j].dataset.lazySrc;
      } else if (imgList[j].dataset.url) {
        imgLink = imgList[j].dataset.url;
      } else if (imgList[j].dataset.imgsrc) {
        imgLink = imgList[j].dataset.imgsrc;
      } else if (imgList[j].dataset.cfsrc) {
        imgLink = imgList[j].dataset.cfsrc;
      } else {
        imgLink = imgList[j].src;
      }
      imgLink = imgLink.replace(/^\s/, '').replace(/\s$/, '');
      
      if (imgLink.search(/(?:i\d+|cdn)\.(wp|statically)\.(?:com|io)\//) != -1) {
        chcdn = true;
        cdnName = imgLink.match(/(?:i\d+|cdn)\.(wp|statically)\.(?:com|io)\//)[1];
      }
      
      if (imgLink.search(/\/([swh]\d+)(?:-[\w]+[^\/]*)?\/|=([swh]\d+)[^\n]+/) != -1) {
        chgi = true;
        imgSize = imgLink.match(/\/([swh]\d+)(?:-[\w]+[^\/]*)?\/|=([swh]\d+)[^\n]+/);
        imgSize = imgSize[1] || imgSize[2];
        imgSize = Number(imgSize.replace(/[swh]/,''));
        imgSize = imgSize == 0 || imgSize > 800 ? 's'+ imgSize : 's1600';
      }
      
      reader_html += '<div onclick="window.open(\''+ imgLink +'\')"><img style="min-height:750px;" data-read-img="'+ imgLink +'" title="' + (j+1) + '"></div>';
    }
    reader_html += '</div>';
    
    var reader_mod = document.createElement('div');
    reader_mod.style.cssText = 'width:100%;';
    reader_mod.innerHTML = reader_html;
    if (prnt && imgs && document.body.className.search(/new_cms|new_themesia|mangapark/) == -1) {
      imgArea.appendChild(reader_mod);
    } else {
      imgArea.parentNode.insertBefore(reader_mod, imgArea);
      removeElem(imgArea);
    }
    imgArea = el('#reader-mod');
    
    scrollImage(el('#reader-mod img', 'all'));
    createBtn(el('#reader-mod img', 'all'));
    
    if (wh.search(/katakomik|animesc-kun|readcmic/) != -1) {
      var e_post = wh.indexOf('animesc-kun') != -1 ? el('#post-wrapper') : el('#main-wrapper');
      e_post.style.width = '100%';
      removeElem('#sidebar-wrapper');
    } else if (wh.indexOf('mangadex') != -1 && !isMobile) {
      imgArea.parentNode.style.cssText = 'padding-right: 20vw !important;';
    }
    
    /*//webtoons auto like
    window.addEventListener('load', function() {
      if (wh.indexOf('webtoons') != -1) {
        el('#likeItButton').scrollIntoView();
        var e_like = setInterval(function() {
          if (el('#footer_favorites.on')) {
            clearInterval(e_like);
            if (!el('#likeItButton ._btnLike.on')) el('#likeItButton').click();
            setTimeout(function() { el('.paginate a[class*="pg_next"]').click(); }, 1200);
          }
        }, 100);
      }
    });*/
  }
  
  // Comics api/data
  function createImage(data) {
    var csl, total;
    if (wh.indexOf('mangadex') != -1) {
      csl = '#content .reader-main';
      total = data.page_array;
    } else if (document.body.classList.contains('new_themesia')) {
      csl = el('#readerarea');
      total = data.sources[0].images;
    } else if (document.body.classList.contains('new_cms')) {
      csl = '#pages-container';
      total = data;
    } else if (wh.indexOf('merakiscans') != -1) {
      csl = '#container';
      total = data;
    } else if (wh.indexOf('mangapark') != -1) {
      csl = '#viewer';
      total = data;
    } else if (wh.indexOf('softkomik') != -1) {
      csl = el('#content-mod #readerarea');
      total = data.DataGambar;
    }
    var main = typeof csl == 'string' ? el(csl) : csl;
    var img_api = '';
    
    for (var i = 0; i < total.length; i++) {
      var data_src = '';
      if (wh.indexOf('mangadex') != -1) {
        data_src = data.server + data.hash + '/' + data.page_array[i];
      } else if (wh.indexOf('mangapark') != -1) {
        data_src = data[i].u;
      } else if (document.body.classList.contains('new_themesia')) {
        data_src = total[i];
      } else if (wh.indexOf('softkomik') != -1) {
        data_src = '//img.softkomik.online/'+ total[i].url_gambar;
      } else {
        data_src = data[i];
      }
      img_api += data_src;
      if (i < total.length-1) img_api += ',';
    }
    
    // change, remove element
    if (document.body.classList.contains('new_themesia')) {
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
    } else if (wh.indexOf('mangadex') != -1) {
      removeElem(el('.reader-images', main));
      removeElem(el('.reader-page-bar', main));
      el('#content').dataset.renderer = 'long-strip';
    } else if (document.body.classList.contains('new_cms')) {
      main.innerHTML = '';
      main.removeAttribute('id');
    } else if (wh.indexOf('merakiscans') != -1) {
      removeElem(el('#content', main));
      el('#toHome').style.cssText = 'height:0;overflow:hidden;';
      el('#toTop').style.cssText = 'height:0;overflow:hidden;';
    } else if (wh.indexOf('softkomik') != -1) {
      if (data.NextChapter) {
        el('#content-mod a').setAttribute('rel', 'next');
        el('#content-mod a').href = '/'+ data.DataKomik.title_slug +'/chapter/'+ data.NextChapter.chapter;
      }
    }
    
    startImage(main, img_api);
  }
  
  function checkAll() {
    if (wh.indexOf('mangadex') != -1 && wp.search(/title\/\d+/) != -1) {return}
    //if (el('[rel="tag"]') && el('[rel="tag"]').innerHTML.search(/project/i) != -1) {return}
    
    if (wh.indexOf('mangadex') != -1) { //api
      el('#content').style.cssText = 'position:initial;';
      var eId = el('meta[name="app"]').dataset.chapterId;
      getData('//mangadex.org/api/?type=chapter&id='+ eId);
      var eReader = el('.reader-controls-chapters');
      eReader.addEventListener('click', function(e) {
        wl.href = e.target.parentNode.href;
      });
    } else if (wh.indexOf('softkomik') != -1) { //api
      var content = el('#__next');
      var new_content = document.createElement('div');
      new_content.id = 'content-mod';
      new_content.innerHTML = '<div id="readerarea"></div><a href="#">next</a>';
      content.parentNode.insertBefore(new_content, content);
      removeElem('#__next');
      var eId = wl.pathname.match(/([^\/]+)\/chapter\/(\d+)/)[1];
      var eCh = wl.pathname.match(/([^\/]+)\/chapter\/(\d+)/)[2];
      getData('//api.softkomik.online/api/baca-chapter/'+ eId +'&'+ eCh);
    } else if (wh.indexOf('komiku.id') != -1) { //click
      document.body.classList.add('click');
      el('.main').id = 'main-mod';
      el('.main').classList.remove('main'); //stop infinite scroll
    } else if (wh.indexOf('mangacanblog') != -1) { //click
      var eAll = el('.pagers a');
      if (eAll.innerHTML.indexOf('Full') != -1) eAll.click();
    } else if (wh.indexOf('mangayu') != -1) {
      //el('.ch-img').parentNode.parentNode.id = 'readerarea';
    } else if (wh.indexOf('komiknesia') != -1) { //eastheme
      if (wl.href.indexOf('?read=list') == -1) wl.href = wl.href.replace(/\?read\=paged?/g, '') + '?read=list';
    } else if (wh.indexOf('mangapark') != -1) { //script
      // window[data]  = from web
      if (window['_page_sub_c'] != '') {
        wl.href = el('link[rel="canonical"]').href;
      } else {
        createImage(window['_load_pages']); //from web
      }
      /*var eAll = el('#sel_load option[value=""]');
      if (eAll.selected == false) wl.href = el('link[rel="canonical"]').href;*/
    } else if (wh.search(/bato\.to|mangawindow/) != -1) { //replace
      var eAll = el('select [label="Load pages"] option[value="a"]');
      if (eAll.selected == false) wl.href = wl.href.replace(/(\/chapter\/)(.*)/g, '$1'+ chapterId); //from web
    } else if (wh.search(/readmng|funmanga/) != -1) { //replace
      el('.img-responsive').parentNode.id = 'readerarea';
      if (wp.indexOf('all-pages') == -1) wl.href = wl.href.replace(/(\/\d+)\/\d(.*)/g, '$1') + '/all-pages';
      if (wh.indexOf('funmanga') != -1) el('.chapter-read').appendChild(el('.prev-next-post'));
    } else if (wh.search(/readmanhua|ninjascans|klikmanga|mangasushi/) != -1) { //Madara theme
      if (wl.href.indexOf('?style=list') == -1) wl.href = wl.href.replace(/\?style\=paged?/g, '') + '?style=list';
    } else if (wh.search(/komikid.com|comicfx/) != -1) { //my Manga Reader CMS
      el('#all').style.display = 'block';
      el('#ppp').style.display = 'none';
      if (el('.pager-cnt .pull-right')) el('.pull-right a').href = next_chapter; //from web
    } else if (document.body.classList.contains('new_cms')) { //new cms
      var eShow = setInterval(function() {
        if (window['chapterPages']) {
          clearInterval(eShow);
          createImage(window['chapterPages']); //from web
        }
      }, 100);
    } else if (document.body.classList.contains('new_themesia')) { //Themesia new
      function getDataImage() {
        var eData = '';
        var eScript = el('body script', 'all');
        for (var i = 0; i < eScript.length; i++) {
          if (eScript[i].innerHTML.search(/ts_reader\.run/) != -1) {
            eData = eScript[i].innerHTML.toString(); //from web
            break;
          }
        }
        return eData == '' ? false : eData;
      }
      var ths_chk = setInterval(function() {
        if (getDataImage()) {
          clearInterval(ths_chk);
          createImage(JSON.parse(getDataImage().match(/(\{[^\;]+)\)\;/)[1]));
        }
      }, 100);
    } else if (wh.search(/katakomik|readcmic/) != -1) { //Show nextprev
      var nextprev = el('.naviarea1') || el('.nextprev');
      el('.post-footer').insertBefore(nextprev, el('.post-footer').children[0]);
    } else if (wh.indexOf('mangaindo') != -1) { //Show nextprev
      var nextprev = el('#post-nav');
      el('.readinfo').parentNode.insertBefore(nextprev, el('.readinfo'));
    } else if (wh.indexOf('mangadropout') != -1) {
      var mwp = wp.match(/collection[^\d]*\/\d+\/([^\/]*)/)[1];
      var mid = el('#displayNoAds');
      var mlnk = el('a', mid, 'all');
      for (var i = 0; i < mlnk.length; i++) {
        if (mlnk[i].href.indexOf('generelatelink') != -1) {
          var mnm = mlnk[i].href.match(/generelatelink[^\d]*\/(\d+)\/([^\/\?\#]*)/);
          mlnk[i].href = '//mangadropout.net/collection/link/'+mnm[1]+'/'+mwp+'/chapter/'+mnm[2];
        }
      }
    } else if (wh.indexOf('merakiscans') != -1) { //script
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
      createImage(imgMS);
    } else if (wh.indexOf('mangaku') != -1) { //script
      /* #2
      var el_mgk = el('#contentwrap');
      var new_mgk = document.createElement('div');
      new_mgk.innerHTML = el_mgk.innerHTML;
      el_mgk.parentNode.insertBefore(new_mgk, el_mgk);
      el_mgk.parentNode.removeChild(el_mgk);
      
      //if (el('i[class*="chevron-right"]')) el('i[class*="chevron-right"]').parentNode.parentNode.classList.add('next_page');
      
      var par_elm = el('.singlep .section_ad.group_ad').parentNode.nextElementSibling; //dtxx
      var d_img = ''; //img[data-imgsrc]
      
      // https://stackoverflow.com/a/31371721
      var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.addedNodes.length > 1) {
            for (var i = 0; i < mutation.addedNodes.length; i++) {
              d_img += mutation.addedNodes[i].outerHTML;
            }
            observer.disconnect();
            
            var r_area = document.createElement('div');
            r_area.id = 'readerarea';
            r_area.innerHTML = d_img;
            par_elm.parentNode.insertBefore(r_area, par_elm);
            par_elm.parentNode.removeChild(par_elm);
            
            startImage();
          }
        });
      });
      observer.observe(par_elm, { childList: true });
      */
      
      /* #1
      function dePass(pr1, pr2) {
        var pr_list = '-ABCDEFGHIJKLMNOPQRSTUVWXYZ=0123456789abcdefghijklmnopqrstuvwxyz+';
        var pr_chk1 = pr_list.indexOf(pr1);
        if (pr_chk1 == -1) return null;
        var pr_chk2 = pr_list.indexOf(pr2);
        if (pr_chk2 == -1) return null;
        var pr_right = pr_list.substring(pr_chk1, pr_list.length);
        var pr_left = pr_list.substring(0, pr_chk1);
        var pr_key = pr_right + pr_left;
        var pr_pass = pr_key.split('')[pr_chk2];
        return pr_pass;
      }
      
      function getPass(ps1, ps2) {
        var ps2_bs64 = btoa(ps2);
        var ps2_arr = ps2_bs64.split('');
        var ps1_arr = ps1.split('');
        var ps_num = 0;
        var ps_txt = '';
        for (var i = 0; i < ps2_arr.length; i++) {
          var the_pass = dePass(ps1_arr[ps_num], ps2_arr[i]);
          if (the_pass) {
            ps_txt += the_pass;  
          } else {
            return null;
          }
          ps_num == ps1_arr.length - 1 ? ps_num = 0 : ps_num++;
        }
        return ps_txt;
      }
      
      function mgk_next() {
        var d_pass = getPass(d_ps1, d_ps2);
        var d_img = CryptoJS.AES.decrypt(window[d_id1], d_pass).toString(CryptoJS.enc.Utf8);
        d_img = rsxxx(d_img);
        d_img = _rscxx(d_img);
        d_img = _rsx(d_img);
        d_img = atob(d_img);
        d_img = d_img.replace(/\+/g, '%20');
        d_img = decodeURIComponent(d_img);
        
        var par_elm = el('.'+ window[d_id2]);
        par_elm.parentNode.removeChild(par_elm.previousElementSibling);
        el_scr.parentNode.removeChild(el_scr);
        
        var r_area = document.createElement('div');
        r_area.id = 'readerarea';
        r_area.innerHTML = d_img;
        par_elm.parentNode.insertBefore(r_area, par_elm);
        par_elm.parentNode.removeChild(par_elm);
        
        startImage();
      }
      
      var en_img = el('noscript', el('.lds-ring-ct').parentNode).previousElementSibling;
      var d_id1 = en_img.innerHTML.match(/;(?:const|let|var)\s([^\s\=]+)\s?\=/)[1];
      var d_rgx = new RegExp('\\('+ d_id1 +',([^,\\)]+),([^,\\)]+),([^,\\)]+)\\)[;,]', 'i');
      
      var el_scr, d_txt, d_id2, d_ps1, d_ps2;
      var d_scr = el('script', 'all');
      for (var i = 0; i < d_scr.length; i++) {
        if (d_scr[i].innerHTML.search(d_rgx) != -1) {
          el_scr = d_scr[i];
          d_txt = d_scr[i].innerHTML.match(d_rgx);
          d_id2 = d_txt[1];
          wl.hash = el('.post.singlep').outerHTML;
          
          var ps1_rgx = new RegExp('(?:const|let|var)\\s'+ d_txt[2] +'\\s?=\\s?[\'"]([^\\\'\\"]+)[\'"][;,]', 'i');
          d_ps1 = d_scr[i].innerHTML.match(ps1_rgx)[1];
          
          //var ps2_rgx = new RegExp('(?:const|let|var)\\s'+ d_txt[3] +'\\s?=\\s?[\'"]([^\\\'\\"]+)[\'"][;,]', 'i');
          //d_ps2 = d_scr[i].innerHTML.match(ps2_rgx)[1];
          var mgk_chk = setInterval(function() {
            if (el('meta[app-mgk="app-mgk"]')) {
              clearInterval(mgk_chk);
              d_ps2 = el('meta[app-mgk="app-mgk"]').getAttribute('content');
              mgk_next();
            }
          }, 100);
          
          break;
        }
      }
      
      var new_txt = document.createElement('textarea');
      new_txt.style.cssText = 'position:fixed;top:0;right:0;height:400px';
      new_txt.value = d_id1;
      //wl.hash = d_img;
      document.body.appendChild(new_txt);
      */
    }
    
    if (document.body.className.search(/new_cms|new_themesia|mangadex|mangaku|kyuroku|merakiscans|mangapark|softkomik/) == -1) { startImage(); }
  }
  
  function removeAADB() {
    var adb_id, adb_style = el('style','all');
    for (var i = 0; i < adb_style.length; i++) {
      if (adb_style[i].innerHTML.search(/(#\w+)\s?~\s?\*\s?\{display:\s?none\s?(?:!important)?;?\}?/) != -1) {
        adb_style[i].parentNode.removeChild(adb_style[i]);
        adb_id = adb_style[i].innerHTML.match(/(#\w+)\s?~\s?\*\s?\{display:\s?none\s?(?:!important)?;?\}?/)[1];
        var adb_chk = setInterval(function() {
          if (el(adb_id)) {
            el(adb_id).parentNode.removeChild(el(adb_id));
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
  
  var wl = window.location;
  var wh = wl.hostname;
  var wp = wl.pathname;
  var chcdn = false; //if image has wp.com or statically.io
  var chgi = false; //if google images
  var loadCDN = false;
  var loadSize = false;
  var loadImage = false; //all images loaded
  var isPause = false; //pause images from loading
  var isComic = false;
  var isMobile = document.documentElement.classList.contains('is-mobile') ? true : false; //from comic tools
  var imgSize = ''; //image size
  var checkPoint, imgArea, imgList, cdnName, titleId, wpId, zoomID;
  
  var chapter_t_rgx = /\s(ch\.?(ap(ter)?)?|ep\.?(isode)?)(\s?\d+|\s)/i; //chek for <title>
  var chapter_w_rgx = /(\/|\-|\_|\d+)((ch|\/c)(ap(ter)?)?|ep(isode)?)(\/|\-|\_|\d+)/i; //check for window.location
  //var chapter_w_rgx = /chapter(\/|\-)|\-bahasa|\-indonesia|ch\-|(\-|\/)\d+|(\-|\/)ep\d+|(chap|episode)\_|\/c\d+/;
  var id_w_rgx = /\/(?:(?:baca-)?(?:komik|manga|read|[a-z]{2}\/[^\/]+|(?:title|series|comics?)(?:\/\d+)?|(?:\d{4}\/\d{2})|p)[\/\-])?([^\/\n]+)\/?(?:list)?/i; //id from window.location
  
  if (wh.search(/mangaku|komikru|comicfx|mgkomik|softkomik/) != -1) document.body.classList.add('_rightclick');
  if (wh.search(/komikcast|westmanga|komikindo.web.id|komikstation|sheamanga|klikmanga|masterkomik/) != -1) document.body.classList.add('ads_newtab');
  if (wh.search(/leviatanscans|zeroscans|reaperscans|secretscans|hatigarmscan[sz]/) != -1) document.body.classList.add('new_cms');
  if (wh.search(/komikindo.web.id|sektekomik|kiryuu|komikav|sheamanga|gurukomik|masterkomik|kaisarkomik|boosei|komikru|westmanga|mangakita|klankomik|wordhero|ngomik|asurascans/) != -1) document.body.classList.add('new_themesia');
  
  document.body.classList.add(wh.replace(/(w{3}|web|m(obile)?)\./, ''));
  removeAADB(); //remove anti adblock notify mangacanblog
  
  // custom
  if (wh.indexOf('webtoons') != -1) {
    el('#wrap').classList.add('no-css');
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
  if (wh.indexOf('toonily') != -1) { //hidden adult
    var list_manga = el('.page-item-detail.manga', 'all');
    for (var i = 0; i < list_manga.length; i++) {
      if (el('[id^="manga-item-"] .adult', list_manga[i])) {
        list_manga[i].parentNode.style.display = 'none';
      }
    }
  }
  if (document.body.classList.contains('_rightclick')) {
    // re-enable right click (don't forget "true") https://stackoverflow.com/a/43754205
    window.addEventListener('contextmenu', function(e) {
      e.stopPropagation();
    }, true);
  }
  // skip ads window.open(), eg. syndication.exdynsrv.com || jomtingi.net
  if (document.body.classList.contains('ads_newtab')) {
    window.onload = function() {
      removeElem('iframe[style*="display: none"], iframe[style*="opacity: 0"]', 'all');
    };
    
    // Override window.open() https://codepen.io/crmolloy/pen/YqdagV
    var windowOpenBackup = window.open;
    window.open = function(url, name, features) {
      console.log('window.open caught!');
      window.open = windowOpenBackup;
    };
    
    /*var el_a = el('a', 'all');
    for (var i = 0; i < el_a.length; i++) {
      var new_a = copyAttribute(el_a[i], 'i');
      new_a.classList.add('link-mod');
      new_a.style.cssText = 'font-style:normal;cursor:pointer;';
      new_a.innerHTML = el_a[i].innerHTML;
      el_a[i].parentNode.insertBefore(new_a, el_a[i]);
      el_a[i].parentNode.removeChild(el_a[i]);
    }
    el('i[data-href]', 'all').forEach(function(item) {
      item.addEventListener('click', function(e) {
        //e.preventDefault();
        //window.open(item.dataset.href);
        wl.href = item.dataset.href;
      });
      // right click
      item.addEventListener('contextmenu', function(e) {
        window.open(item.dataset.href);
      });
    });*/
  }
  
  // Dark mode
  if (el('#thememode .switch') || el('.theme.quickswitcher') || el('.theme-mode .switch')) {
    // theme enduser.id|themesia.com
    localStorage.setItem('thememode', 'darkmode');
    localStorage.setItem('theme-mode', 'dark');
    document.body.classList.add('darkmode', 'dark');
    document.body.classList.remove('lightmode');
  } else if (el('.theme.switchmode') || el('#quickswitcher')) {
    // theme eastheme.com || komikcast.com
    localStorage.setItem('theme-mode', 'darkmode');
    document.body.classList.add('darkmode');
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
  } else if (wh.indexOf('manhwa-san') != -1) {
    localStorage.setItem('mode', 'darkmode');
    el('#mainContent').classList.add('dark-mode');
  } else if (wh.indexOf('mangadex') != -1) {
    var mgdx_css = document.createElement('link');
    mgdx_css.href = '//mangadex.org/scripts/css/Dark-Slate.css';
    mgdx_css.setAttribute('rel', 'stylesheet');
    el('head').appendChild(mgdx_css);
  }
  
  // Disqus
  var cmt_chk = setInterval(function() {
    if (el('#disqus_thread')) {
      if (typeof embedVars != 'undefined') { //from web
        clearInterval(cmt_chk);
        reloadComment(embedVars.disqusShortname);
      } else if (el('#disqus_thread').dataset.disqusShortname) {
        clearInterval(cmt_chk);
        reloadComment(el('#disqus_thread').dataset.disqusShortname);
      } else if (el('#disqus_thread').nextElementSibling) {
        clearInterval(cmt_chk);
        if (el('#disqus_thread').nextElementSibling.innerHTML.indexOf('disqus') == -1) return;
        var dsqs_sn = el('#disqus_thread').nextElementSibling.innerHTML;
        dsqs_sn = dsqs_sn.match(/\/\/([^\n]+)\.disqus\.com[^\n]+\.js/)[1];
        reloadComment(dsqs_sn);
      } else {
        clearInterval(cmt_chk);
        var idDsqs, sDsqs = el('script', 'all');
        for (var i = 0; i < sDsqs.length; i++) {
          if (sDsqs[i].innerHTML.indexOf('disqus.com') != -1) {
            idDsqs = sDsqs[i].innerHTML.match(/\/\/([^\n]+)\.disqus\.com[^\n]+\.js/)[1];
            reloadComment(idDsqs);
            break;
          }
        }
      }
    } else if (document.body.classList.contains('new_cms') && el('#comic-details-container')) { //from web
      clearInterval(cmt_chk);
      el('#comic-details-container').id = 'disqus_thread';
      reloadComment(window['disqusName']);
    } else if (wh.indexOf('softkomik') != -1) { //api
      clearInterval(cmt_chk);
      /*var eDsqs = setInterval(function() {
        if (el('#container #disqus_thread')) {
          clearInterval(eDsqs);
          reloadComment(el('#disqus_thread').dataset.disqusShortname);
        }
      }, 100);*/
    } else {
      clearInterval(cmt_chk);
    }
  }, 100);
  
  // check if page is comic/project, from comic bookmark
  if (localStorage.getItem('comic_tools_list')) {
    var data_list = JSON.parse(localStorage.getItem('comic_tools_list'));
    for (var j = 0; j < data_list.length; j++) {
      if (wp != '/' && data_list[j].url.indexOf(wp) != -1) {
        console.log('project page: '+ data_list[j].url);
        isComic = true;
        break;
      }
    }
  }
  
  var ch_list = [
    '0','#chapterlist',
    '1','#manga-chapters-holder .page-content-listing',
    '2','#--box-list',
    '3','.series-chapterlist',
    'komikcast.com','.komik_info-chapters',
    'comicfx.net','.chaplist',
    'mangaku.pro','#content-b',
    'komikstation.com','.bxcl .releases',
    'manhuaid.com','.tb-custom-scrollbar',
    'komiku.id','#Daftar_Chapter tbody',
    'bacakomik.co','#chapter_list',
    'mangacdn.my.id','.lcp_catlist li',
    'webtoons.com','#_episodeList li',
    'mangabat.com','.row-content-chapter'
  ];
  if (isComic && isMobile) {
    var ch_area = el(st[1]) || el(st[3]) || el(st[5]) || el(st[7]);
    var ch_length = ch_list.length;
    if (ch_length % 2 == 1) {
      ch_length--
    }
    for (var k = 6; k < ch_length; k += 2) {
      if (wh.indexOf(ch_list[k]) != -1 && el(ch_list[k + 1])) {
        el(ch_list[k + 1]).parentNode.scrollIntoView();
        break;
      }
    }
  }
  
  if ((wp.search(chapter_w_rgx) != -1 || wl.search.search(chapter_w_rgx) != -1 || (el('title') && el('title').innerHTML.search(chapter_t_rgx) != -1)) && !isComic) {
    titleId = !el('title') ? '' : el('title').innerHTML.replace(/&#{0,1}[a-z0-9]+;/ig, '').replace(/\([^\)]+\)/g, '').replace(/\s+/g, ' ').replace(/\s(bahasa\s)?indonesia/i, '').replace(/(man(ga|hwa|hua)|[kc]omi[kc]|baca|read)\s/i, '').replace(/[\||\-|\–](?:.(?![\||\-|\–]))+$/, '').replace(/\s$/, '').replace(/\|/g, '').replace(/[^\s\w]/g, '').replace(/\s+/g, '-').toLowerCase();
    wpId = wp.match(id_w_rgx)[1].replace(/-bahasa-indonesia(-online-terbaru)?/i, '').replace(/\.html/i, '').toLowerCase();
    zoomID = wh.search(/webtoons|softkomik/i) != -1 ? wpId : titleId;
    console.log('page: chapter');
    checkAll();
    
    if (localStorage.getItem('bookmark')) localStorage.removeItem('bookmark');
    if (localStorage.getItem('history')) localStorage.removeItem('history');
    if (localStorage.getItem('bm_history')) localStorage.removeItem('bm_history');
    if (localStorage.getItem('ts_history')) localStorage.removeItem('ts_history');
    indexedDB.open('ts_series_history').onsuccess = function() { indexedDB.deleteDatabase('ts_series_history') };
  }
})();
