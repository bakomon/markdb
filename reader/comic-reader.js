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
  
  // Add script to head. data, info, boolean, element. https://codepen.io/sekedus/pen/QWKYpVR
  function addScript(i,n,f,o) {
    var dJS = document.createElement('script');
    dJS.type = 'text/javascript';
    if (n == 'in') dJS.async = (n || f) === true ? true : false;
    n == 'in' ? dJS.innerHTML = i : dJS.src = i;
    var elm = n && n.tagName ? n : f && f.tagName ? f : o && o.tagName ? o : document.querySelector('head');
    elm.appendChild(dJS);
  }
  
  // Detect mobile device https://stackoverflow.com/a/11381730/7598333
  function isMobile() {
    var a = navigator.userAgent || navigator.vendor || window.opera;
    return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4));
  }
  
  function removeElem(elem, num) {
    var elmn = typeof elem == 'string' ? document.querySelectorAll(elem) : elem;
    elmn = num ? (num == 'all' ? elmn : elmn[num]) : (typeof elem == 'string' ? elmn[0] : elmn);
    
    if (num == 'all') {
      for (var i = 0; i < elmn.length; i++) {
        elmn[i].parentNode.removeChild(elmn[i]);
      }
    } else {
      elmn.parentNode.removeChild(elmn);
    }
  }
  
  function copyAttribute(element, new_node) {
    var el_new = document.createElement(new_node);
    var el_att = element.outerHTML.match(/<[^\s]+\s([^>]+)>/)[1];
    el_att = el_att.match(/([^"]+"[^"]+"\s?)/g);
    for (var i = 0; i < el_att.length; i++) {
      var att_name = el_att[i].match(/([^=]+)="([^"]+)"/)[1];
      var att_value = el_att[i].match(/([^=]+)="([^"]+)"/)[2];
      if (new_node == 'i' && att_name == 'href') att_name = 'data-'+ att_name; 
      el_new.setAttribute(att_name, att_value);
    }
    return el_new;
  }
  
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
  
  function getData(url) {
    var x = new XMLHttpRequest();
    x.onreadystatechange = function() {
      if (x.readyState == XMLHttpRequest.DONE) {
        var imgData = JSON.parse(x.responseText);
        createImage(imgData);
      }
    }
    x.open('GET', url, true);
    x.send();
  }
  
  function reloadComment(id) {
    var par_dsqs = el('#disqus_thread').parentNode;
    par_dsqs.removeChild(el('#disqus_thread'));
    
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
    if (getOffset(img, 'top') < (getOffset(checkPoint, 'top') + 1000) || note != undefined) {
      imgs = img.dataset.readImg;
      if (loadCDN) imgs = imgs.replace(/(?:i\d+|cdn)\.(wp|statically)\.(?:com|io)\//g, '');
      if (imgs.search(/(pending\-load|cdn\.statically\.io)/) != -1) {
        imgs = imgs.replace(/\?(.*)/g, ''); //remove location.search ?=
      } else if (loadSz) {
        var sNum = el('.rc_size').innerHTML;
        imgs = imgs.replace(/\/([swh]\d+)(?:-[\w]+[^\/]*)?\//, '/'+ sNum +'/');
        imgs = imgs.replace(/=[swh](\d+)[^\n]*/, '='+ sNum);
        if (imgs.indexOf('docs.google') != -1) imgs = imgs.replace(/https?:\/\/docs\.google\.com\/uc\?export=view&id=(.*)/g, 'https://lh3.googleusercontent.com/d/$1='+ sNum);
      }
      img.src = imgs;
      setTimeout(function() {img.style.minHeight = null}, 2000);
    }
  }
  
  function scrollImage(img) {
    window.onscroll = function() {
      for (var i = 0; i < img.length; i++) {
        if (!lsImg) {
          startChange(img[i]);
        }
        if (img[img.length-1].src) {lsImg = true;}
      }
    }
  }
  
  function nextChapter() {
    var chNav, chUrl, nextCh, nextChk, nextLink;
    var chNum = wp.replace(/(?:\/(?:manga|comic|komik)\/)?[^\/]*\/([^\/]*)\/?/g, '$1');
    if (wh.indexOf('mangacanblog') != -1) {
      chNav = el('.pager select[name="chapter"]').options;
    } else if (wh.indexOf('jaiminisbox') != -1) {
      var ch_val = el('.tbtitle.dnone a[title*="hapter"]').href;
      el('#csel option[value="'+ ch_val +'"]').selected = true;
      chNav = el('#csel').options;
    } else if (wh.indexOf('merakiscans') != -1) {
      el('#chapter_select option[value="'+ chNum +'"]').selected = true;
      chNav = el('#chapter_select').options;
      chUrl = el('#reader_text a').href;
      removeElem('#next');
      removeElem('#nextbot');
      removeElem('#page_select');
    }
    
    nextChk = wh.search(/merakiscans/) != -1 ? 'nextElementSibling' : 'previousElementSibling';
    for (var i = 0; i < chNav.length; i++) {
      if (chNav[i].selected == true) {nextCh = chNav[i];}
    }
    
    if (nextCh[nextChk]) {
      nextLink = nextCh[nextChk].value;
      if (wh.search(/merakiscans/) != -1) {
        nextLink = chUrl +'/'+ nextLink;
      } else if (wh.indexOf('mangacanblog') != -1) {
        var manga_name = el('.pager select[name="manga"]').value;
        var next_plus = ((nextLink-1)+2);
        nextLink = '//'+ wh +'/baca-komik-'+ manga_name +'-'+ nextLink +'-'+ next_plus +'-bahasa-indonesia-'+ manga_name +'-'+ nextLink +'-terbaru.html';
      }
      el('.rc_next button').setAttribute('data-href', next_chap.href);
      el('.rc_next').classList.remove('_hidden');
    }
  }
  
  function createBtn(img) {
    var r_txt = '';
    // css reader
    r_txt += '<style>.rc_100{width:100%;}.rc_50{width:50%;}.reader_db{position:fixed;bottom:0;right:0;width:150px;padding:10px;background:#17151b;border:1px solid #333;border-right:0;border-bottom:0;}.reader_db.rc_shide{right:-150px;}._rc{background:#252428;color:#ddd;padding:4px 8px;margin:4px;font:14px Arial;cursor:pointer;border:1px solid #3e3949;}._rc a{color:#ddd;font-size:14px;text-decoration:none;}.rc_line{margin-bottom:10px;padding-bottom:10px;border-bottom:5px solid #333;}.rc_text{padding:4px 8px;margin:4px;}._selected,.rc_btn:hover{background:#4267b2;border-color:#4267b2;}input._rc{padding:4px;display:initial;cursor:text;height:auto;background:#252428 !important;color:#ddd !important;border:1px solid #3e3949;}input._rc:hover{border-color:#3e3949;}.rc_all{width:30px !important;margin-left:8px;}.rc_tr2{position:absolute;bottom:0;left:-40px;}.rc_tr2 .rc_btn{align-items:center;width:40px;height:40px;font-size:30px !important;padding:0;margin:0;line-height:0;}._hidden{display:none;}</style>';
    r_txt += '<style>.scrollToTop,[title*="Back To Top"]{display:none !important;}</style>'; //css hidden
    r_txt += '<style>.rc_mobile ._rc{font-size:16px;}.rc_mobile .rc_toggle{position:absolute;bottom:0;left:-70px;width:70px;height:70px;background:transparent;color:#fff;border:0;}</style>'; //css mobile
    r_txt += '<div class="reader_db flex_wrap f_bottom">';
    r_txt += '<div class="rc_tr1 flex_wrap">';
    r_txt += '<div class="rc_others rc_line rc_100 flex _hidden">';
    if (chcdn) r_txt += '<div class="rc_cdn rc_btn _rc" title="'+ cdnName +'">CDN</div>';
    if (chgi) r_txt += '<div class="rc_size rc_btn _rc">'+ imgSize +'</div>';
    r_txt += '</div>'; //.rc_others
    r_txt += '<div class="rc_next rc_line rc_100 _hidden"><button class="rc_btn _rc" title="arrow right &#9656;" onclick="window.location.href=this.dataset.href">Next Chapter</button></div>';
    r_txt += '<div class="rc_load rc_line rc_100"><button class="rc_load rc_btn _rc" title="alt + a">Load</button><input class="rc_all rc_input _rc" value="all" onclick="this.select()"></div>';
    r_txt += '<div class="rc_zoom rc_100"><button class="rc_plus rc_btn _rc" title="shift + up">+</button><button class="rc_less rc_btn _rc" title="shift + down">-</button><input style="width:40px;" class="rc_input _rc" value="'+ (readCookie('reader-zoom') || imgArea.offsetWidth) +'"></div>';
    r_txt += '</div>';// .rc_tr1
    r_txt += '<div class="rc_tr2">';
    r_txt += '<div class="rc_top rc_btn _rc flex t_center">&#9652;</div>';
    r_txt += '<div class="rc_bottom rc_btn _rc flex t_center">&#9662;</div>';
    r_txt += '<div class="rc_toggle rc_btn _rc flex t_center">&#174;</div>';
    r_txt += '</div>';// .rc_tr2
    r_txt += '</div>';// .reader_db
    
    var r_html = document.createElement('div');
    r_html.style.cssText = 'position:relative;z-index:2147483646;';
    r_html.className = '_reader' + (isMobile() ? ' rc_mobile' : '');
    r_html.innerHTML = r_txt;
    document.body.appendChild(r_html);
    if (chcdn || chgi) el('.rc_others').classList.remove('_hidden');
    if (readCookie('reader-zoom')) imgArea.style.cssText = 'max-width:'+ readCookie('reader-zoom') +'px !important;';
    
    if (wh.search(/mangacanblog|merakiscans|jaiminisbox/) != -1) {nextChapter();} //next button
    
    el('.rc_toggle').onclick = function() {
      this.classList.toggle('_selected');
      el('.reader_db').classList.toggle('rc_shide');
    };
    
    // Load all images
    el('.rc_load').onclick =  function() {
      if (el('.rc_all').value == 'all') {
        lsImg = true;
        for (var i = 0; i < img.length; i++) {
          startChange(img[i], 'all');
        }
      } else {
        startChange(img[el('.rc_all').value - 1]);
      }
    };
    
    if (chgi) {
      el('.rc_size').onclick = function() {
        this.innerHTML = this.innerHTML == imgSize ? 's15000' : imgSize;
        loadSz = this.innerHTML == imgSize ? false : true;
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
        createCookie('reader-zoom', load_zm, 365);
      });
    });
    
    // back to top
    el('.rc_top').onclick = function() {
      document.body.scrollIntoView();
    };
    
    // back to bottom
    el('.rc_bottom').onclick = function() {
      if (el('#disqus_trigger')) {
        el('#disqus_trigger').parentNode.scrollIntoView();
      } else {
        document.body.scrollIntoView(false);
      }
    };
    
    /*
    note:
    - .pager-cnt .pull-right = my Manga Reader CMS
    - .btn-sm i[class*="right"] = new CMS "scans"
    - i[rel="next"] = new_tab
    */
    var next_chap =  el('.mangayu\\.com a>i[class*="arrow-right"]') || el('.manhuaid\\.com a[class*="float-left"]') || el('.softkomik\\.site .baca-button .fa-chevron-right') || el('.mangadex\\.org .reader-controls-chapters a[class*="right"]') || el('.readmng\\.com a[class*="next_page"]') || el('.funmanga\\.com #chapter-next-link') || el('.m\\.mangabat\\.com .navi-change-chapter-btn-next') || el('.bato\\.to .nav-next a') || el('.btn-sm i[class*="right"]') || el('.pager-cnt .pull-right a') || el('a[rel="next"]') || el('a[class*="next"]') || el('i[rel="next"]');
    if (next_chap) {
      next_chap = wh.search(/mangadropout|leviatanscans|zeroscans|reaperscans|secretscans|hatigarmscanz|softkomik|mangayu/) != -1 ? next_chap.parentNode : next_chap;
      el('.rc_next button').setAttribute('data-href', next_chap.href);
      el('.rc_next').classList.remove('_hidden');
    }
    
    document.onkeyup = function(e) {
      if ((e.altKey) && (e.keyCode == 65)) {
        el('.rc_load').click(); //"alt & a" for load all
      } else if ((e.shiftKey) && (e.keyCode == 38)) {
        el('.rc_zoom .rc_plus').click(); //"shift & up" zoom +
      } else if ((e.shiftKey) && (e.keyCode == 40)) {
        el('.rc_zoom .rc_less').click(); //"shift & down" zoom -
      } else if (e.keyCode == 39) { //arrow right
        if (next_chap) {
          if (wh.search(/mangadex|softkomik/) != -1) {
            wl.href = next_chap.href;
          } else if (document.body.classList.contains('new_tab')) {
            wl.href = next_chap.dataset.href;
          } else {
            next_chap.click();
          }
        }
      }
    };
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
        '5','.viewer-cnt #all',
        '6','#Gambar_komik',
        '7','#viewer',
        '8','#Blog1 .post-body',
        'webtoons.com','.viewer_lst .viewer_img',
        'mangaindo.web.id','.entry-content',
        'mangacanblog.com','#imgholder',
        'komikfoxy.xyz','#gallery-1',
        'mangabat.com','.container-chapter-reader',
        'mangadropout.net','#displayNoAds .col-md-12.text-center',
        'manhuaid.com','.row.mb-4 .col-md-12',
        'komiku.id','#Baca_Komik',
        'bacakomik.co','#chimg-auh',
        'rawdevart.com','#img-container'
      ];
      var area_s = el(st[1]) || el(st[3]) || el(st[5]) || el(st[7]) || el(st[9]) || el(st[11]) || el(st[13]) || el(st[15]) || el(st[17]);
      var s_length = st.length;
      if (s_length % 2 == 1) {
        s_length--
      }
      for (var j = 16; j < s_length; j += 2) {
        if (wh.indexOf(st[j]) != -1) {
          imgArea = el(st[j + 1]);
          break;
        } else {
          imgArea = area_s;
        }
      }
      console.log('imgArea:', document.body.contains(imgArea));
      if (!imgArea) return;
    }
    if (prnt && imgs) imgArea = prnt;
    imgList = prnt && imgs ? imgs.split(',') : el('img', imgArea, 'all');
    if (!imgList) {return}
    console.log('length', imgList.length);
    
    var reader_html = '<div id="reader-mod">';
    for (var j = 0; j < imgList.length; j++) {
      var imgLink;
      //if (imgList[j].src && imgList[j].src == wl.href) continue;
      if (prnt && imgs) {
        imgLink = imgList[j];
      } else if (imgList[j].getAttribute('original')) { //manhwa-san.xyz
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
      
      reader_html += '<a href="'+ imgLink +'" target="_blank"><img style="min-height:750px;" data-read-img="'+ imgLink +'" title="' + (j+1) + '"></a>';
    }
    reader_html += '</div>';
    
    var reader_mod = document.createElement('div');
    reader_mod.style.cssText = 'width:100%;';
    reader_mod.innerHTML = reader_html;
    if (prnt && imgs) {
      imgArea.appendChild(reader_mod);
    } else {
      imgArea.parentNode.insertBefore(reader_mod, imgArea);
      removeElem(imgArea);
    }
    imgArea = el('#reader-mod');
    
    scrollImage(el('#reader-mod img', 'all'));
    createBtn(el('#reader-mod img', 'all'));
    
    if (wh.search(/manhwa\-san|katakomik|animesc-kun|readcmic/) != -1) {
      var e_post = wh.indexOf('animesc-kun') != -1 ? el('#post-wrapper') : el('#main-wrapper');
      e_post.style.width = '100%';
      el('#sidebar-wrapper').parentNode.removeChild(el('#sidebar-wrapper'));
    } else if (wh.indexOf('mangadex') != -1) {
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
    } else if (el('body').classList.contains('new_themesia')) {
      csl = el('#readerarea').parentNode;
      total = data.sources[0].images;
    } else if (wh.search(/leviatanscans|zeroscans|reaperscans|secretscans|hatigarmscanz/) != -1) {
      csl = '#pages-container';
      total = data;
    } else if (wh.indexOf('merakiscans') != -1) {
      csl = '#container';
      total = data;
    } else if (wh.indexOf('jaiminisbox') != -1) {
      csl = '#page';
      total = data;
    } else if (wh.indexOf('softkomik') != -1) {
      csl = el('.baca-button').nextElementSibling;
      total = data.DataGambar;
    }
    var main = typeof csl == 'string' ? el(csl) : csl;
    var img_api = '';
    
    for (var i = 0; i < total.length; i++) {
      var data_src = '';
      if (wh.indexOf('mangadex') != -1) {
        data_src = data.server + data.hash + '/' + data.page_array[i];
      } else if (wh.indexOf('jaiminisbox') != -1) {
        data_src = data[i].thumb_url;
      } else if (el('body').classList.contains('new_themesia')) {
        data_src = total[i];
      } else if (wh.indexOf('softkomik') != -1) {
        data_src = '//api.softkomik.site/'+ total[i].url_gambar;
      } else {
        data_src = data[i];
      }
      img_api += data_src;
      if (i < total.length-1) img_api += ',';
    }
    
    // change, remove element
    if (el('body').classList.contains('new_themesia')) {
      localStorage.setItem('tsms_readingmode', 'full');
      if (data.nextUrl == '') {
        removeElem(el('.ctop .nextprev [rel="next"]'));
        removeElem(el('.cbot .nextprev [rel="next"]'));
      } else if (document.body.classList.contains('new_tab')) {
        el('.ctop .nextprev [rel="next"]').dataset.href = data.nextUrl;
        el('.cbot .nextprev [rel="next"]').dataset.href = data.nextUrl;
      } else {
        el('.ctop .nextprev [rel="next"]').href = data.nextUrl;
        el('.cbot .nextprev [rel="next"]').href = data.nextUrl;
      }
      var new_div = document.createElement('div');
      main.insertBefore(new_div, el('#readerarea'));
      main.removeChild(el('#readerarea'));
      if (el('#readerarea noscript')) main.removeChild(el('#readerarea'));
      main = new_div;
    } else if (wh.indexOf('mangadex') != -1) {
      main.removeChild(el('.reader-images', main));
      main.removeChild(el('.reader-page-bar', main));
      el('#content').dataset.renderer = 'long-strip';
    } else if (wh.search(/leviatanscans|zeroscans|reaperscans|secretscans|hatigarmscanz/) != -1) {
      main.innerHTML = '';
      main.removeAttribute('id');
    } else if (wh.indexOf('merakiscans') != -1) {
      main.removeChild(el('#content', main));
      el('#toHome').style.cssText = 'height:0;overflow:hidden;';
      el('#toTop').style.cssText = 'height:0;overflow:hidden;';
    } else if (wh.indexOf('jaiminisbox') != -1) {
      main.removeChild(el('.inner', main));
    } else if (wh.indexOf('softkomik') != -1) {
      var new_div = document.createElement('div');
      main.parentNode.insertBefore(new_div, main);
      main.parentNode.removeChild(main);
      main = new_div;
    }
    
    startImage(main, img_api);
  }
  
  function checkAll() {
    if (wh.indexOf('mangadex') != -1 && wp.search(/title\/\d+/) != -1) {return}
    //if (el('[rel="tag"]') && el('[rel="tag"]').innerHTML.search(/project/i) != -1) {return}
    
    if (wh.indexOf('mangadex') != -1) { //api
      el('#content').style.cssText = 'position:initial;';
      var eId = el('meta[name="app"]').dataset.chapterId;
      getData('//mangadex.org/api/?id='+eId+'&type=chapter');
      var eReader = el('.reader-controls-chapters');
      eReader.addEventListener('click', function(e) {
        wl.href = e.target.parentNode.href;
      });
    } else if (wh.indexOf('softkomik') != -1) { //api
      var eId = wl.pathname.match(/([^\/]+)\/chapter\/(\d+)/)[1];
      var eCh = wl.pathname.match(/([^\/]+)\/chapter\/(\d+)/)[2];
      var eReader = setInterval(function() {
        if (el('#container .baca-button')) {
          clearInterval(eReader);
          getData('//softkomik.site/api/baca-chapter/'+ eId +'&'+ eCh);
        }
      }, 100);
    } else if (wh.indexOf('komiku.id') != -1) { //click
      document.body.classList.add('click');
      el('.main').id = 'main-mod';
      el('.main').classList.remove('main'); //stop infinite scroll
    } else if (wh.indexOf('mangacanblog') != -1) { //click
      var eAll = el('.pagers a');
      if (eAll.innerHTML.indexOf('Full') != -1) eAll.click();
    } else if (wh.indexOf('mangayu.com') != -1) {
      el('.ch-img').parentNode.parentNode.id = 'readerarea';
    } else if (wh.indexOf('jaiminisbox') != -1) { //script
      createImage(pages); //from web
    } else if (wh.indexOf('mangapark') != -1) { //replace
      var eAll = el('#sel_load option[value=""]');
      if (eAll.selected == false) wl.href = el('link[rel="canonical"]').href;
    } else if (wh.search(/bato\.to|mangawindow/) != -1) { //replace
      var eAll = el('select [label="Load pages"] option[value="a"]');
      if (eAll.selected == false) wl.href = wl.href.replace(/(\/chapter\/)(.*)/g, '$1'+ chapterId); //from web
    } else if (wh.search(/readmng|funmanga/) != -1) { //replace
      el('.img-responsive').parentNode.id = 'readerarea';
      if (wp.indexOf('all-pages') == -1) wl.href = wl.href.replace(/(\/\d+)\/\d(.*)/g, '$1') + '/all-pages';
      if (wh.indexOf('funmanga') != -1) el('.chapter-read').appendChild(el('.prev-next-post'));
    } else if (wh.search(/readmanhua|ninjascans|klikmanga|mangasushi/) != -1) { //Madara theme
      if (wl .href.indexOf('?style=list') == -1) wl.href = wl.href.replace(/\?style\=paged?/g, '') + '?style=list';
    } else if (wh.search(/komikid.com|comicfx/) != -1) { //my Manga Reader CMS
      el('#all').style.display = 'block';
      el('#ppp').style.display = 'none';
      if (el('.pager-cnt .pull-right')) el('.pull-right a').href = next_chapter; //from web
    } else if (wh.search(/leviatanscans|zeroscans|reaperscans|secretscans|hatigarmscanz/) != -1) { //new cms
      var eShow = setInterval(function() {
        if (window.chapterPages) {
          clearInterval(eShow);
          createImage(window.chapterPages);
        }
      }, 100); //'chapterPages' from web
    } else if (el('body').classList.contains('new_themesia')) { //Themesia new
      var eData, eScript = el('script', 'all');
      for (var i = 0; i < eScript.length; i++) {
        if (eScript[i].innerHTML.indexOf('ts_reader.run') != -1) {
          eScript = eScript[i].innerHTML; //from web
          break;
        }
      }
      eData = JSON.parse(eScript.match(/(\{[^\;]+)\)\;/)[1]);
      createImage(eData);
    } else if (wh.search(/manhwa\-san|katakomik|readcmic/) != -1) { //Show nextprev
      var nextprev = el('.alphanx') || el('.naviarea1') || el('.nextprev');
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
      var mgk_chk = setInterval(function() {
        if (el('#data_mgk')) {
          clearInterval(mgk_chk);
          var par_elm = el('.singlep .section_ad.group_ad').parentNode.nextElementSibling; //dtxx
          var r_area = document.createElement('div');
          r_area.id = 'readerarea';
          r_area.innerHTML = el('#data_mgk').innerHTML;
          par_elm.parentNode.insertBefore(r_area, par_elm);
          par_elm.parentNode.removeChild(par_elm);
          
          startImage();
        }
      }, 100);
      
      /* new
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
      
      /* old
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
    
    if (el('body').className.search(/new_themesia|mangadex|mangaku|kyuroku|merakiscans|leviatanscans|zeroscans|reaperscans|secretscans|hatigarmscanz|jaiminisbox|softkomik/) == -1) { startImage(); }
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
  var wk1 = /chapter(\/|\-)|\-bahasa|\-indonesia|ch\-|(\-|\/)\d+|(\-|\/)ep\d+|(chap|episode)\_|\/c\d+/;
  var chcdn = false; //if image has wp.com or statically.io
  var chgi = false; //if google images
  var loadCDN = false;
  var loadSz = false;
  var lsImg = false; //all images loaded
  var imgSize = ''; //image size
  var checkPoint, imgArea, imgList, cdnName;
  
    // css control
  var s_txt = '<style id="css_ctrl">*,*:before,*:after{outline:0;-webkit-box-sizing:border-box;box-sizing:border-box;}.flex{display:-webkit-flex;display:flex;}.flex_wrap{display:-webkit-flex;display:flex;-webkit-flex-wrap:wrap;flex-wrap:wrap;}.flex_center{position:fixed;top:0;left:0;width:100%;height:100%;display:-webkit-flex;display:flex;} /* Perfect Centering */.f_center{-webkit-align-items:center;align-items:center;-webkit-align-content:center;align-content:center;}.f_bottom{-webkit-align-items:flex-end;align-items:flex-end;-webkit-align-content:flex-end;align-content:flex-end;}.f_grow{-webkit-flex-grow:1;flex-grow:1;}.f_between{-webkit-justify-content:space-between;justify-content:space-between;}.t_center{text-align:center;justify-content:center;}.t_left{text-align:left;justify-content:flex-start;}.t_right{text-align:right;justify-content:flex-end;}.t_justify{text-align:justify;}</style>';
    // css main
  s_txt += '<style>/* Custom Scrollbar */body::-webkit-scrollbar{width:15px;}body::-webkit-scrollbar-track{background:#312f40;}body::-webkit-scrollbar-thumb{background:#151515;}html,body,article{background:#151515 !important;-webkit-user-select:text;user-select:text;}.mangainfo li a:visited,.komikinfo li a:visited,.animeinfo li a:visited,.animeinfo .episodelist a:visited,.wp-manga-chapter a:visited,.bixbox li a:visited,.bxcl li a:visited,#scans a:visited h3,#latestchapters .updates a:visited,#list .chapter a:visited,.chapter-container .chapter-row a:visited,.elementor-icon-list-item a:visited,.epxs a:visited,.chapter-item a:visited,.fixyear a:visited,.fixyear a:visited .year .ytps a:visited,.chli .cli a:visited,.Manga_Chapter a:visited .viewind{color:#607d8b !important;}#reader-mod,#wrap:not(.no-css) p:not([class="logo"]){background:#151515;max-width:750px !important;min-width:inherit;height:auto !important;margin:0 auto !important;display:block;float:none !important;}#reader-mod img,#wrap:not(.no-css) p:not([class="logo"]) img{width:auto;max-width:100% !important;/*max-width:700px !important;*/height:auto;position:initial !important;display:block;margin:0 auto;}#content .carousel,.darex .carousel,.vezone .carousel{height:auto;max-height:100%;}#content .carousel-cell,.darex .carousel-cell,.vezone .carousel-cell{float:left;position:relative;}#content .carousel-cell img,.darex .carousel-cell img,.vezone .carousel-cell img{height:100%;}#menu li,#main-menu li{float:none;display:inline-block;}.episode-table tr td[width="100"]{width:100%;}body.manga-page .main-col .listing-chapters_wrap ul.version-chap{max-height:none;overflow:initial;}/* komikgo.com */.chapter-type-manga .c-blog-post .entry-content .entry-content_wrap .reading-content::before{position:relative;}/* manhwa-san.xyz | katakomik.site */.manhwa-san\.xyz #outer-wrapper,.katakomik\.site #outer-wrapper,.katakomik\.site .header-header{background:#151515 !important;}.manhwa-san\.xyz .blog-post.item-post h1.post-title{color:#999;}.manhwa-san\.xyz .alphanx,.katakomik\.site .naviarea1 .awnavi1,.funmanga\.com .prev-next-post{display:flex;justify-content:space-between;}/* mangaku.pro */.mangaku\.pro .owl-carousel{display:block;}/* manhuaid.com */.manhuaid\.com#darkbody{background:#151515 !important;}.manhuaid\.com img[alt^="Aplikasi"]{display:none;}/* mangayu.com */.mangayu\.com{overflow:auto !important;}.mangayu\.com .swal2-container{display:none;}/* readcmic.blogspot.com */.readcmic\.blogspot\.com #outer-wrapper{background:#151515 !important;}/* webtoons.com */.webtoons\.com img{opacity:0.9 !important;}.webtoons\.com #wrap a,.webtoons\.com #wrap p,#wrap .main_hotnew h2,#wrap .title_area h2,#wrap .grade_num{color:#838383 !important;}#wrap #header,#wrap .snb_wrap,#wrap #container.bg,#wrap .detail_body .detail_lst,#wrap .detail_body .detail_install_app,#wrap .detail_body .detail_lst li,#wrap .detail_body .aside.detail,#wrap .detail_body .detail_paywall,#wrap .main_daily_wrap,#wrap .daily_tab_wrap,#wrap .main_hotnew_wrap,#wrap .main_genre_wrap,#wrap .main_challenge,#wrap .lst_type1 li,#wrap #footer,#wrap .notice_area,#wrap .foot_app,#wrap .discover_lst li,#wrap .ranking_tab,#wrap .ranking_tab li,#wrap .lst_type1,#wrap .daily_head,#wrap .daily_card_item,#wrap .daily_card,#wrap .daily_card li,#wrap #cbox_module,#wrap .u_cbox .u_cbox_comment_box,#wrap .u_cbox a{background-color:#151515 !important;border-color:#000 !important;color:#838383 !important;}#wrap .card_item .card_back,#wrap .daily_tab li.on .btn_daily,#wrap .main_challenge .title_area .btnarea a,#wrap .snb li.on a,#wrap .ranking_tab li.on a,#wrap .daily_section.on,#wrap .episode_area{background-color:#2f2f2f !important;color:#838383 !important;}/* display none */#footer2,noscript,#ftads,.kln:not(.blox),.kln.mlb,.c-sub-header-nav.sticky,html body [class*="iklan"],html body [rel="noopener"]:not([target="_blank"]),html body [style="z-index:2147483647;"],html body [style="background:rgb(221,221,221); z-index:9999999; opacity:1; visibility:visible;"],html body [style="z-index:999999; background:rgba(0,0,0,0.8); display:block;"],html body [style="position:fixed; top:0px; bottom:0px; left:0px; right:0px; z-index:2147483647; background:black; opacity:0.01; height:637px; width:1366px;"],center a[href*="mangatoon"],#navkanan[class*="scroll"],#bottom-banner-ads,footer.perapih.chf,#Notifikasi{display:none !important;visibility:hidden !important;opacity:0 !important;}.hidden-items{position:fixed;top:-9999px;left:-9999px;}/* exception */.judulseries .iklan{display:block !important;visibility:visible !important;opacity:1 !important;}</style>';
  var s_html = document.createElement('style');
  s_html.type = 'text/css';
  s_html.id = '_style';
  s_html.innerHTML = s_txt;
  document.body.appendChild(s_html);
  
  // re-enable right click https://stackoverflow.com/a/43754205
  window.addEventListener('contextmenu', function(e) {
    e.stopPropagation();
  }, true);
  
  document.body.classList.add(wl.hostname.replace(/www\./, ''));
  removeAADB(); //remove anti adblock notify mangacanblog
  
  // custom
  if (wh.indexOf('webtoons') != -1) {
    el('#wrap').classList.add('no-css');
  } else if (wh.indexOf('komikcast') != -1) {
    // https://stackoverflow.com/a/29998770
    window.open = function (url, windowName, windowFeatures) {
      console.log('window.open caught!');
    };
  } else if (wh.search(/westmanga|komikindo.web.id|komikstation|sheamanga|klikmanga/) != -1) {
  	document.body.classList.add('new_tab');
    // skip syndication.exdynsrv.com || jomtingi.net
    var el_a = el('a', 'all');
    for (var i = 0; i < el_a.length; i++) {
      var new_a = copyAttribute(el_a[i], 'i');
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
    });
  }
  
  // Dark mode
  var switch_btn = el('#thememode .switch') || el('.theme.quickswitcher') || el('.theme-mode .switch');
  if (switch_btn) { //theme enduser.id|themesia.com
    localStorage.setItem('thememode', 'darkmode');
    localStorage.setItem('theme-mode', 'dark');
    document.body.classList.add('darkmode', 'dark');
    document.body.classList.remove('lightmode');
  } else if (wh.indexOf('manhuaid.com') != -1) {
    localStorage.setItem('theme', 'dark');
    document.body.setAttribute('id', 'darkbody');
    el('.isdark').setAttribute('id', 'darkmode');
    el('nav').classList.add('bg-dark');
    el('nav').classList.remove('bg-success', 'fixed-top');
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
  
  if ((wp.search(wk1) != -1 || wl.search.search(wk1) != -1) && wl.search.indexOf('project') == -1) {
    if (wh.search(/kiryuu|komikindo.web.id|sektekomik|komikav|sheamanga|gurukomik|masterkomik|kaisarkomik|boosei|westmanga|komikru|asurascans/) != -1) document.body.classList.add('new_themesia');
    checkAll();
  }
})();
