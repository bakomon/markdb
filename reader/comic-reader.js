// COMIC READER
function mydb_comic_reader() {
  // Position (X,Y) element https://stackoverflow.com/a/28222246
  function getOffset(el, p) {
    const rect = el.getBoundingClientRect();
    var xy = p == 'left' ? rect.left + window.scrollX : rect.top + window.scrollY;
    return xy;
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
    var par_dsqs = el('#disqus_thread').parentElement;
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
      if (loadCDN) imgs = imgs.replace(cdnRgx, '').replace(/\/[fhwq]=[^\/]+/, '');
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
    } else if (wh.indexOf('mangayu') != -1) {
      chNav = el('#chapterSelect').options;
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
    var readSize = isMobile ? window.screen.width : zoomID in mydb_zoom ? mydb_zoom[zoomID] : imgArea.offsetWidth;
    if (zoomID in mydb_zoom && !isMobile) readSize = readSize == 'manga' ? '750' : readSize == 'manhua' ? '650' : readSize == 'manhwa' ? '500' : readSize;
    var r_txt = '';
    // css control & main already in css tools
    // css reader
    r_txt += '<style>.rc_100{width:100%;}.rc_50{width:50%;}.reader_db{position:fixed;bottom:0;right:0;width:160px;padding:10px;background:#17151b;border:1px solid #333;border-right:0;border-bottom:0;}.reader_db.rc_shide{right:-160px;}._rc{background:#252428;color:#ddd;padding:4px 8px;margin:4px;font:14px Arial;cursor:pointer;border:1px solid #3e3949;}._rc a{color:#ddd;font-size:14px;text-decoration:none;}.rc_line{margin-bottom:10px;padding-bottom:10px;border-bottom:5px solid #333;}.rc_text{padding:4px 8px;margin:4px;}.rc_selected,.rc_btn:not(.rc_no_hover):hover{background:#4267b2;border-color:#4267b2;}.rc_active{background:#ea4335;border-color:#ea4335;}input._rc{padding:4px;display:initial;cursor:text;height:auto;background:#252428 !important;color:#ddd !important;border:1px solid #3e3949;}input._rc:hover{border-color:#3e3949;}.rc_all{width:30px !important;}.rc_pause{border-radius:50%;}.rc_tr2{position:absolute;bottom:0;left:-40px;}.rc_tr2 .rc_btn{align-items:center;width:40px;height:40px;font-size:30px !important;padding:0;margin:0;line-height:0;}._rc[disabled],._rc[disabled]:hover{background:#252428 !important;color:#555 !important;border-color:#252428 !important;}.rc_hidden{display:none;}</style>';
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
    r_html.style.cssText = 'position:relative;z-index:2147483643;'; //2147483647
    r_html.className = '_reader cbr_mod'+ (isMobile ? ' rc_mobile' : '');
    r_html.innerHTML = r_txt;
    document.body.appendChild(r_html);
    if (isMobile) el('.rc_toggle').classList.add('rc_no_hover');
    if (chcdn || chgi) el('.rc_others').classList.remove('rc_hidden');
    imgArea.style.cssText = 'max-width:'+ readSize +'px !important;';
    
    if (wh.search(/mangacanblog|mangayu|merakiscans|mangapark/) != -1) {nextChapter();} //next button
    
    el('.rc_toggle').onclick = function() {
      this.classList.toggle('db_danger');
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
      if (el('.rc_load .rc_all').value.search(/all/i) != -1) {
        loadImage = true;
        for (var i = 0; i < img.length; i++) {
          startChange(img[i], 'all');
        }
      } else {
        startChange(img[Number(el('.rc_load .rc_all').value) - 1], 'single');
      }
    };
    
    el('.rc_load .rc_pause').onclick =  function() {
      this.classList.toggle('rc_active');
      el('.rc_ld_img').disabled = isPause ? false : true;
      el('.rc_load .rc_all').disabled = isPause ? false : true;
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
        mydb_zoom[zoomID] = load_zm;
        localStorage.setItem('mydb_zoom', JSON.stringify(mydb_zoom));
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
    - i[rel="next"] = ads_newtab
    */
    var next_chap =  el('.manhuaid-com a[class*="float-left"]') || el('.nyanfm-com .fa-angle-right') || el('.funmanga-com #chapter-next-link')|| el('.readmng-com a[class*="next_page"]') || el('.funmanga-com #chapter-next-link') || el('.mangabat-com .navi-change-chapter-btn-next') || el('.bato-to .nav-next a') || el('.btn-sm i[class*="right"]') || el('.pager-cnt .pull-right a') || el('a[rel="next"]') || el('a[class*="next"]') || el('i[rel="next"]');
    if (next_chap) {
      next_chap = document.body.className.search(/new_cms|mangadropout|nyanfm/) != -1 ? next_chap.parentElement : next_chap;
      var next_url = /*document.body.classList.contains('ads_newtab') ? next_chap.dataset.href :*/ next_chap.href;
      el('.rc_next button').setAttribute('data-href', next_url);
      el('.rc_next').classList.remove('rc_hidden');
      if (isMobile) el('.rc_next2').classList.remove('rc_hidden');
    }
    
    var next_chk = setInterval(function() {
      var elm_url = el('.mangadex-org .reader-controls-chapters a[class*="right"]');
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
    
    // auto stop page after html and js _reader loaded
    if (el('.rc_reload').classList.contains('rc_hidden') && wh.indexOf('mangadex') == -1 && !autoLike) el('.rc_stop').click();
  }
  
  function startImage(note, prnt, imgs) {
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
        '9','label[for="Viewer-module"]',
        '10','[id^="Blog"] .post-body',
        'webtoons.com','#_imageList',
        'mangacdn.my.id','.entry-content',
        'mangacanblog.com','#imgholder',
        'komikfoxy.xyz','#gallery-1',
        'mangadropout.net','#displayNoAds .col-md-12.text-center',
        'manhuaid.com','.row.mb-4 .col-md-12',
        'komiku.id','#Baca_Komik',
        'bacakomik.co','#chimg-auh',
        'nyanfm.com','.elementor-widget-image-carousel',
        'mangabat.com','.container-chapter-reader',
        'rawdevart.com','#img-container'
      ];
      var area_s = el(st[1]) || el(st[3]) || el(st[5]) || el(st[7]) || el(st[9]) || el(st[11]) || el(st[13]) || el(st[15]) || el(st[17]) || el(st[19]) || el(st[21]);
      var s_length = st.length;
      if (s_length % 2 == 1) {
        s_length--
      }
      for (var j = 20; j < s_length; j += 2) {
        if (wh.indexOf(st[j]) != -1) {
          imgArea = el(st[j + 1]);
          break;
        } else {
          imgArea = area_s;
        }
      }
      console.log('imgArea: '+ document.body.contains(imgArea));
    }
    if (prnt && imgs) imgArea = prnt;
    if (!imgArea) return;
    
    if (el('img[src=""]', imgArea)) removeElem(el('img[src=""]', imgArea)); //komikcast
    imgList = prnt && imgs ? imgs.split('|') : el('img', imgArea, 'all');
    if (!imgList) {return}
    console.log('imgList.length: '+ imgList.length);
    
    var reader_html = '<div id="reader-mod">';
    for (var j = 0; j < imgList.length; j++) {
      var imgLink;
      //if (imgList[j].src && imgList[j].src == wl.href) continue;
      if (prnt && imgs) {
        imgLink = imgList[j];
      } else if (imgList[j].getAttribute('original')) {
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
      
      if (imgLink.search(cdnRgx) != -1) {
        chcdn = true;
        cdnName = imgLink.match(cdnRgx)[1];
      }
      
      if (imgLink.search(/\/([swh]\d+)(?:-[\w]+[^\/]*)?\/|=([swh]\d+)[^\n]+/) != -1) {
        chgi = true;
        imgSize = imgLink.match(/\/([swh]\d+)(?:-[\w]+[^\/]*)?\/|=([swh]\d+)[^\n]+/);
        imgSize = imgSize[1] || imgSize[2];
        imgSize = Number(imgSize.replace(/[swh]/,''));
        imgSize = imgSize == 0 || imgSize > 800 ? 's'+ imgSize : 's1600';
      }
      
      reader_html += '<div onclick="var img'+ (j+1) +'=this.querySelector(\'img\');window.open(img'+ (j+1) +'.src?img'+ (j+1) +'.src:img'+ (j+1) +'.dataset.readImg)" title="'+ (j+1) +' - '+ imgLink +'"><img style="min-height:750px;" data-read-img="'+ imgLink +'" alt="'+ (j+1) +'"></div>';
    }
    reader_html += '</div>';
    
    var reader_mod = document.createElement('div');
    reader_mod.style.cssText = 'width:100%;';
    reader_mod.innerHTML = reader_html;
    if (prnt && imgs && document.body.className.search(/new_cms|themesia|mangapark|webtoons/) == -1) {
      imgArea.appendChild(reader_mod);
    } else {
      imgArea.parentElement.insertBefore(reader_mod, imgArea);
      removeElem(imgArea);
    }
    imgArea = el('#reader-mod');
    
    scrollImage(el('#reader-mod img', 'all'));
    createBtn(el('#reader-mod img', 'all'));
    document.body.classList.add('read-mode');
    
    if (wh.search(/katakomik|animesc-kun|readcmic/) != -1) {
      var e_post = wh.indexOf('animesc-kun') != -1 ? el('#post-wrapper') : el('#main-wrapper');
      e_post.style.width = '100%';
      removeElem('#sidebar-wrapper');
    } else if (wh.indexOf('mangadex') != -1 && !isMobile) {
      imgArea.parentElement.style.cssText = 'padding-right: 20vw !important;';
    } else if (wh.indexOf('webtoons') != -1) {
      document.body.classList.remove('fixed');
    }
    
    /*//webtoons auto like
    window.addEventListener('load', function() {
      if (wh.indexOf('webtoons') != -1) {
        autoLike = true;
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
    } else if (wh.indexOf('webtoons') != -1) {
      csl = '#_viewer';
      total = data;
    } else if (document.body.classList.contains('themesia')) {
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
    } else if (wh.indexOf('mangayu') != -1) {
      csl = el('#mangaReading');
      total = data.images;
    } else if (document.body.classList.contains('reader_cms')) {
      csl = el('.viewer-cnt');
      total = data;
    }
    var main = typeof csl == 'string' ? el(csl) : csl;
    var img_api = '';
    
    for (var i = 0; i < total.length; i++) {
      var data_src = '';
      if (wh.indexOf('mangadex') != -1) {
        data_src = data.server + data.hash + '/' + data.page_array[i];
      } else if (wh.indexOf('webtoons') != -1) {
        data_src = total[i].url;
      } else if (wh.indexOf('mangapark') != -1) {
        data_src = total[i].u;
        //v3 data_src = imgCdnHost + total[i]; //from web
      } else if (wh.search(/mangayu/) != -1 || document.body.classList.contains('themesia')) {
        data_src = total[i];
      } else if (wh.indexOf('softkomik') != -1) {
        data_src = '//img.softkomik.online/'+ total[i].url_gambar;
      } else if (document.body.classList.contains('reader_cms')) {
        data_src = total[i].page_image;
      } else {
        data_src = data[i];
      }
      img_api += data_src;
      if (i < total.length-1) img_api += '|';
    }
    
    // change, remove element
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
    } else if (wh.indexOf('mangadex') != -1) {
      removeElem(el('.reader-images', main));
      removeElem(el('.reader-page-bar', main));
      el('#content').dataset.renderer = 'long-strip';
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
      if (data.NextChapter) {
        el('#content-mod a').setAttribute('rel', 'next');
        el('#content-mod a').href = '/'+ data.DataKomik.title_slug +'/chapter/'+ data.NextChapter.chapter;
      }
    } else if (wh.indexOf('mangayu') != -1) {
      el('.m-scroll-chapter').classList.remove('sticky');
    } else if (document.body.classList.contains('reader_cms')) {
      var my_next = wh.indexOf('comicfx') != -1 ? el('.ch-nav a.ch-next') : el('.pager-cnt .pull-right a');
      if (window['next_chapter'] != '') {
        if (my_next) my_next.href = window['next_chapter']; //from web
      } else {
        if (my_next) removeElem('.ch-nav a.ch-next', 'all');
      }
    }
    
    startImage('api', main, img_api);
  }
  
  function getDataImage(key) {
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
    if (wh.indexOf('mangadex') != -1 && wp.search(/title\/\d+/) != -1) {return}
    //if (el('[rel="tag"]') && el('[rel="tag"]').innerHTML.search(/project/i) != -1) {return}
    
    if (wh.indexOf('mangadex') != -1) { //api
      el('#content').style.cssText = 'position:initial;';
      var eId = el('meta[name="app"]').dataset.chapterId;
      getData('//mangadex.org/api/?type=chapter&id='+ eId);
      var eReader = el('.reader-controls-chapters');
      eReader.addEventListener('click', function(e) {
        wl.href = e.target.parentElement.href;
      });
    } else if (wh.indexOf('webtoons') != -1 && isMobile) { //api
      createImage(imageList); //from web
    } else if (wh.indexOf('komiku.id') != -1) { //click
      document.body.classList.add('click');
      el('.main').id = 'main-mod';
      el('.main').classList.remove('main'); //stop infinite scroll
    } else if (wh.indexOf('mangacanblog') != -1) { //click
      var eAll = el('.pagers a');
      if (eAll.innerHTML.indexOf('Full') != -1) eAll.click();
    } else if (wh.indexOf('mangayu') != -1) {
      var yu_rgx = /read\("/;
      var yu_chk = setInterval(function() {
        if (getDataImage(yu_rgx)) {
          clearInterval(yu_chk);
          getData(getDataImage(yu_rgx).match(/read\("([^"]+)"\)/)[1]);
        }
      }, 100);
    } else if (wh.indexOf('komiknesia') != -1) { //eastheme
      if (wl.href.indexOf('?read=list') == -1) wl.href = wl.href.replace(/\?read\=paged?/g, '') + '?read=list';
    } else if (wh.indexOf('softkomik') != -1) { //api
      var content = el('#__next');
      var new_content = document.createElement('div');
      new_content.id = 'content-mod';
      new_content.innerHTML = '<div id="readerarea"></div><a href="#">next</a>';
      content.parentElement.insertBefore(new_content, content);
      removeElem('#__next');
      var eId = wl.pathname.match(/([^\/]+)\/chapter\/(\d+)/)[1];
      var eCh = wl.pathname.match(/([^\/]+)\/chapter\/(\d+)/)[2];
      getData('//api.softkomik.online/api/baca-chapter/'+ eId +'&'+ eCh);
    } else if (wh.indexOf('mangapark') != -1) { //script
      /* //v3
      localStorage.setItem('read_load', 'f');
      createImage(imgPathLis); //from web
      */
      if (window['_page_sub_c'] != '') { //from web
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
      el('.img-responsive').parentElement.id = 'readerarea';
      if (wp.indexOf('all-pages') == -1) wl.href = wl.href.replace(/(\/\d+)\/\d(.*)/g, '$1') + '/all-pages';
      if (wh.indexOf('funmanga') != -1) el('.chapter-read').appendChild(el('.prev-next-post'));
    } else if (wh.search(/readmanhua|ninjascans|klikmanga|mangasushi/) != -1) { //Madara theme
      if (wl.href.indexOf('?style=list') == -1) wl.href = wl.href.replace(/\?style\=paged?/g, '') + '?style=list';
    } else if (document.body.classList.contains('reader_cms')) { //my Manga Reader CMS
      //if (el('#all')) el('#all').style.display = 'block';
      //if (el('#ppp')) el('#ppp').style.display = 'none';
      createImage(window['pages']); //from web
    } else if (document.body.classList.contains('new_cms')) { //new cms
      var eShow = setInterval(function() {
        if (window['chapterPages']) {
          clearInterval(eShow);
          createImage(window['chapterPages']); //from web
        }
      }, 100);
    } else if (document.body.classList.contains('themesia')) { //Themesia new
      var ts_rgx = /ts_reader\.run/;
      var ts_chk = setInterval(function() {
        if (getDataImage(ts_rgx)) {
          clearInterval(ts_chk);
          var ts_data = JSON.parse(getDataImage(ts_rgx).match(/(\{[^\;]+)\)\;/)[1]);
          ts_data.sources[0].images.length == 0 ? alert('!! NO CHAPTER !!') : createImage(ts_data);
        }
      }, 100);
    } else if (wh.search(/katakomik|readcmic/) != -1) { //Show nextprev
      var nextprev = el('.naviarea1') || el('.nextprev');
      el('.post-footer').insertBefore(nextprev, el('.post-footer').children[0]);
    } else if (wh.indexOf('mangaindo') != -1) { //Show nextprev
      var nextprev = el('#post-nav');
      el('.readinfo').parentElement.insertBefore(nextprev, el('.readinfo'));
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
    }
    
    if (document.body.className.search(/new_cms|reader_cms|themesia|mangadex|kyuroku|merakiscans|mangapark|softkomik|webtoons/) == -1 || (wh.indexOf('webtoons') != -1 && !isMobile)) { startImage('check'); }
  }
  
  function disqusMod() {
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
  }
  
  function chapterList() {
    var ch_list = [
      '0','#chapterlist',
      '1','#chapter_list',
      '2','#manga-chapters-holder',
      '3','#--box-list',
      '4','.series-chapterlist',
      'komikcast.com','.komik_info-chapters',
      'comicfx.net','.chaplist',
      'komikstation.com','.bxcl',
      'manhuaid.com','.tb-custom-scrollbar',
      'komiku.id','#Daftar_Chapter',
      'mangacdn.my.id','.lcp_catlist',
      'webtoons.com','#_episodeList',
      'mangabat.com','.row-content-chapter'
    ];
    if (isMobile) {
      var list_area, ch_area = el(ch_list[1]) || el(ch_list[3]) || el(ch_list[5]) || el(ch_list[7]) || el(ch_list[9]);
      var ch_length = ch_list.length;
      if (ch_length % 2 == 1) {
        ch_length--
      }
      for (var i = 8; i < ch_length; i += 2) {
        if (wh.indexOf(ch_list[i]) != -1 && el(ch_list[i + 1])) {
          list_area = el(ch_list[i + 1]);
          break;
        } else {
          list_area = ch_area;
        }
      }
      if (list_area) {
        var a_latest = wh.indexOf('webtoons') != -1 ? '[id^="episode_"] a' : 'a';
        if (el(a_latest, list_area)) {
          var a_rgx = wh.indexOf('webtoons') != -1 ? /(#\d+)/ : /(\d+(?:[,\.-]\d)?)/;
          var a_data = document.body.classList.contains('koidezign') ? 'title' : 'textContent';
          var l_last = document.createElement('div');
          l_last.id = 'mydb_latest_chapter';
          l_last.style.cssText = 'position:fixed;top:55%;right:0;z-index:2147483644;background:#252428;color:#ddd;padding:10px 15px;font-size:130%;border:1px solid #3e3949;';
          l_last.innerHTML = el(a_latest, list_area)[a_data].match(a_rgx)[1];
          document.body.appendChild(l_last);
          
          // scroll to chapter list
          el('#mydb_latest_chapter').onclick = function() {
            var half_screen = Math.floor((window.screen.height / 2) + 30);
            /*list_area.style.cssText = 'scroll-margin-top:'+ half_screen +'px';
            list_area.scrollIntoView();*/
            window.scroll(0, (getOffset(list_area, 'top') - half_screen));
          };
        }
      }
      
      // style for chapter link visited
      var l_visited = '';
      for (var j = 1; j < ch_length; j += 2) {
        l_visited += ch_list[j] +' a:visited';
        if (j < ch_length-1) l_visited += ',';
      }
      var l_elem = document.createElement('style');
      l_elem.innerHTML = l_visited +'{color:red !important;}';
      document.body.appendChild(l_elem);
    }
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
    } else if (wh.indexOf('wib.my.id') != -1) {
      localStorage.setItem('dark', 'true');
      document.documentElement.classList.add('dark');
    }
  }
  
  function removeAADB() {
    var adb_id, adb_style = el('style','all');
    for (var i = 0; i < adb_style.length; i++) {
      if (adb_style[i].innerHTML.search(/(#\w+)\s?~\s?\*\s?\{display:\s?none\s?(?:!important)?;?\}?/) != -1) {
        adb_style[i].parentElement.removeChild(adb_style[i]);
        adb_id = adb_style[i].innerHTML.match(/(#\w+)\s?~\s?\*\s?\{display:\s?none\s?(?:!important)?;?\}?/)[1];
        var adb_chk = setInterval(function() {
          if (el(adb_id)) {
            el(adb_id).parentElement.removeChild(el(adb_id));
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
  
  function customEdit() {
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
          list_manga[i].parentElement.style.display = 'none';
        }
      }
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
        el_a[i].parentElement.insertBefore(new_a, el_a[i]);
        el_a[i].parentElement.removeChild(el_a[i]);
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
  }
  
  function blockContent() {
    
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
  var isProject = false;
  var isMobile = document.documentElement.classList.contains('is-mobile') ? true : false; //from database tools
  var autoLike = false;
  var imgSize = ''; //image size
  var cdnRgx = /(?:i\d+|cdn|img)\.(wp|statically)\.(?:com|io)\/(?:img\/(?:[^\.]+\/)?)?/;
  var checkPoint, imgArea, imgList, cdnName, zoomID;
  
  blockContent();
  customEdit();
  
  // check if page is comic/project, from database bookmark
  // to avoid mis-detection, eg. blog from blogger.com or wordpress.com
  if (localStorage.getItem('mydb_comic_list')) {
    var crList = JSON.parse(localStorage.getItem('mydb_comic_list'));
    for (var n = 0; n < crList.length; n++) {
      if (wp.search(/^\/((m|id|en)\/?)?$/) == -1 && crList[n].url.indexOf(wp) != -1) {
        console.log('project page: '+ crList[n].url);
        isProject = true;
        break;
      }
    }
  }
  
  // Start reader
  if ((wp.search(number_w_rgx) != -1 || wl.search.search(number_w_rgx) != -1 || (el('title') && el('title').innerHTML.search(number_t_rgx) != -1)) && !isProject) {
    console.log('page: chapter');
    zoomID = getId('reader');
    mydb_read = true;
    mydb_zoom = localStorage.getItem('mydb_zoom') ? JSON.parse(localStorage.getItem('mydb_zoom')) : {};
    window.onunload = function() { window.scrollTo(0,0); }; //prevent browsers auto scroll on reload/refresh
    checkAll();
    
    if (localStorage.getItem('visited-chapters')) localStorage.removeItem('visited-chapters');
    if (localStorage.getItem('bookmark')) localStorage.removeItem('bookmark');
    if (localStorage.getItem('history')) localStorage.removeItem('history');
    if (localStorage.getItem('bm_history')) localStorage.removeItem('bm_history');
    if (localStorage.getItem('ts_history')) localStorage.removeItem('ts_history');
    indexedDB.open('ts_series_history').onsuccess = function() { indexedDB.deleteDatabase('ts_series_history') };
  } else {
    mydb_read = false;
  }
  
  removeAADB(); //remove anti adblock notify mangacanblog
  webDarkMode();
  chapterList();
  disqusMod();
}

if (!live_test_comic_r) mydb_comic_reader();
