(function() {
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
  
  // Position (X,Y) element https://stackoverflow.com/a/28222246
  function getOffset(el, p) {
    const rect = el.getBoundingClientRect();
    var xy = p == 'left' ? rect.left + window.scrollX : rect.top + window.scrollY;
    return xy;
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
      
      var disqus_embed = document.createElement('script');
      disqus_embed.type = 'text/javascript';
      disqus_embed.async = true;
      disqus_embed.src = '//' + id + '.disqus.com/embed.js';
      el('head').appendChild(disqus_embed);
    }
  }
  
  function startChange(img, note) {
    var imgs = '';
    if (getOffset(img, 'top') < (getOffset(checkPoint, 'top') + 1000) || note != undefined) {
      imgs = img.dataset.readImg;
      if (loadCDN) imgs = imgs.replace(/(?:i\d+|cdn)\.(wp|statically)\.(?:com|io)\//g, '');
      if (imgs.search(/(pending\-load|cdn\.statically\.io)/) != -1) {
        imgs = imgs.replace(/\?(.*)/g, ''); //remove location.search ?=
      } else if (loadSz) {
        var sNum = el('.ld-size').innerHTML;
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
    if (wh.indexOf('manhuaid') != -1) {
      chNav = el('select.form-control').options;
    } else if (wh.indexOf('neumanga') != -1) {
      chNav = el('.readnav .chapter').options;
      removeElem('.gov-next.mode', 'all');
    } else if (wh.indexOf('mangacanblog') != -1) {
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
      el('.load-next a').href = nextLink;
      el('.load-next').classList.remove('hidden-items');
    }
  }
  
  function createBtn(img) {
    var ln = document.createElement('div');
    ln.style.cssText = 'position:fixed;top:10px;left:10px;z-index:2147483647;';
    ln.id = 'ctrl-read';
    ln.innerHTML = '<style>*,*:before,*:after{outline:0;-webkit-box-sizing:border-box;box-sizing:border-box;}.load{background:#252428;color:#ddd;margin-bottom:8px;padding:4px 8px;font:14px Arial;width:max-content;cursor:pointer;border:1px solid #3e3949;}.ld-btn:hover{background:#4267b2;border-color:#4267b2;}.load a{color:#ddd;font-size:14px;text-decoration:none;}input.load{padding:4px;display:initial;cursor:text;background:#252428 !important;color:#ddd !important;border:1px solid #3e3949;}input.load:hover{border-color:#3e3949;}.ld-all{width:30px !important;margin-left:8px;}</style>';
    ln.innerHTML += '<div><span class="ld-imgs ld-btn load" title="alt + a">Load</span><input class="ld-all ld-input load" value="all" onclick="this.select()"></div>';
    if (chcdn) {ln.innerHTML += '<div class="ld-img-cdn ld-btn load" title="'+ cdnName +'">CDN</div>';}
    if (chgi) {ln.innerHTML += '<div class="ld-size ld-btn load">'+ imgSize +'</div>';}
    ln.innerHTML += '<div class="ld-zoom"><input style="width:40px;" class="ld-input load" value="'+ (readCookie('reader-zoom') || imgArea.offsetWidth) +'"> <button class="ld-btn load less" title="shift + down">-</button> <button class="ld-btn load plus" title="shift + up">+</button></div>';
    //ln.innerHTML += '<div><form action="/" id="ld-form" method="get"><input style="width:80px;" class="ld-input load" type="text" placeholder="Search..." name="s" autocomplete="off"> <button class="ld-btn load" type="submit">GO</button></form></div>';
    document.body.appendChild(ln);
    if (readCookie('reader-zoom')) imgArea.style.cssText = 'max-width:'+ readCookie('reader-zoom') +'px !important;';
    
    // Load all images
    var loadImgs = el('.ld-imgs');
    var inImg = el('.ld-all');
    //inImg.select();
    loadImgs.onclick =  function() {
      if (inImg.value == 'all') {
        lsImg = true;
        for (var i = 0; i < img.length; i++) {
          startChange(img[i], 'all');
        }
      } else {
        startChange(img[inImg.value - 1]);
      }
    };
    
    if (chgi) {
      el('.ld-size').onclick = function() {
        this.innerHTML = this.innerHTML == imgSize ? 's15000' : imgSize;
        loadSz = this.innerHTML == imgSize ? false : true;
      };
    }
    
    if (chcdn) {
      el('.ld-img-cdn').onclick = function() {
        this.innerHTML = this.innerHTML == 'CDN' ? 'not' : 'CDN';
        loadCDN = this.innerHTML == 'CDN' ? false : true;
        if (chgi) {
          el('.ld-size').innerHTML = 's15000';
          el('.ld-size').click();
        }
      };
    }
    
    el('.ld-zoom .ld-btn', 'all').forEach(function(item) {
      item.addEventListener('click', function(e) {
        var load_zm = Number(el('.ld-zoom input').value);
        if (item.classList.contains('plus')) {
          load_zm += 50;
        } else {
          load_zm += -50
        }
        imgArea.style.cssText = 'max-width:'+ load_zm +'px !important;';
        el('.ld-zoom input').value = load_zm;
        createCookie('reader-zoom', load_zm, 365);
      });
    });
    
    // button below
    var ttp = document.createElement('div');
    ttp.style.cssText = 'position:fixed;right:40px;bottom:0;z-index:2147483647;';
    ttp.innerHTML = '<style>.scroll_to_top{font-size:35px;line-height:16px;padding:12px 7px;background:#4267b2;color:#fff;cursor:pointer;border-top-left-radius:5px;border-top-right-radius:5px;}.inline{display:inline-block;margin:0;}</style>';
    ttp.innerHTML += '<div class="load-next load inline hidden-items"><a href="javascript:void(0)">next</a></div>';
    ttp.innerHTML += '<div class="ld-imgs2 load inline">all</div>';
    ttp.innerHTML += '<div class="scroll_to_top inline">&#9652;</div>';
    document.body.appendChild(ttp);
    
    if (wh.search(/manhuaid|neumanga|mangacanblog|merakiscans|jaiminisbox/) != -1) {nextChapter();} //next button
    
    el('.ld-imgs2').onclick = function() {loadImgs.click();} //load all bottom
    el('.scroll_to_top').onclick = function() {document.body.scrollIntoView();}; //back to top
    
    document.onkeyup = function(e) {
      if ((e.altKey) && (e.keyCode == 65)) {
        loadImgs.click(); //alt & a for load all
      } else if ((e.shiftKey) && (e.keyCode == 38)) {
        el('.ld-zoom .ld-btn.plus').click(); //shift & up zoom +
      } else if ((e.shiftKey) && (e.keyCode == 40)) {
        el('.ld-zoom .ld-btn.less').click(); //shift & down zoom -
      } else if (e.keyCode == 39) { //arrow right
        var next_chapter = el('.nextprev a[rel="next"]') || el('.nav-links .btn.next_page') || el('.pager a[onclick*="next"]') || el('.reader-controls-chapters a[class*="right"]') || el('.nav-newer a[rel="next"]') || el('.naveps a[rel="next"]') || el('.paginate a[class*="next"]') || el('.btn-sm i[class*="right"]') || el('.urlChange span[class*="right"]') || el('.chapter a[rel="next"]') || el('.brk .brkn a') || el('.navi-change-chapter-btn-next') || el('.baca-button .fa-chevron-right');
        next_chapter = wh.search(/mangadropout|leviatanscans|zeroscans|reaperscans|secretscans|softkomik/) != -1 ? next_chapter.parentNode : next_chapter;
        next_chapter = next_chapter || el('.load-next a'); // from nextChapter()
        if (next_chapter) {
          if (wh.search(/mangadex|softkomik/) != -1) {
            wl.href = next_chapter.href;
          } else {
            next_chapter.click();
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
    var st = ['0','1','2','3','4','5','6','7','webtoons.com','neumanga.tv','mangaindo.web.id','mangacanblog.com','manhwa-san.xyz','komikfoxy.xyz','mangabat.com','mangadropout.net','manhuaid.com','komiku.id','maid.my.id','bacakomik.co'];
      var sl = ['#readerarea','.reading-content','.read-container','.viewer-cnt #all','#readerareaimg','#Gambar_komik','#viewer','#Blog1 .post-body','.viewer_lst .viewer_img','.readarea','.entry-content','#imgholder','.post-body.post-content','#gallery-1','.container-chapter-reader','#displayNoAds .col-md-12.text-center','.row.mb-4 .col-md-12','#Baca_Komik','.reader-area','#chimg'];
      var area_s = el(sl[0]) || el(sl[1]) || el(sl[2]) || el(sl[3]) || el(sl[4]) || el(sl[5]) || el(sl[6]) || el(sl[7]);
      for (var j = 8; j < st.length; j++) {
        if (wh.indexOf(st[j]) != -1) {
          imgArea = el(sl[j]);
          break;
        }
        imgArea = area_s;
      }
    }
    if (prnt && imgs) imgArea = prnt;
    imgList = prnt && imgs ? imgs.split(',') : el('img', imgArea, 'all');
    if (!imgList) {return}
    console.log('length', imgList.length);
    
    var reader_html = '<div id="reader-mod">';
    for (var j = 0; j < imgList.length; j++) {
      var imgLink;
      if (prnt && imgs) {
        imgLink = imgList[j];
      } else if (imgList[j].getAttribute('original')) { //manhwa-san.xyz
        imgLink = imgList[j].getAttribute('original');
      } else if (wh.indexOf('komiku.id') != -1) { //komiku.id
        imgLink = '//img.komiku.co.id/nor'+ imgList[j].dataset.src;
      } else if (imgList[j].dataset.src) {
        imgLink = imgList[j].dataset.src;
      } else if (imgList[j].dataset.lazySrc) {
        imgLink = imgList[j].dataset.lazySrc;
      } else if (imgList[j].dataset.url) {
        imgLink = imgList[j].dataset.url;
      } else if (imgList[j].dataset.imgsrc) {
        imgLink = imgList[j].dataset.imgsrc;
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
    
    if (wh.indexOf('manhwa-san') != -1) {
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
    } else if (wh.search(/leviatanscans|zeroscans|reaperscans|secretscans/) != -1) {
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
      if (data.nextUrl != '') {
        el('.ctop .nextprev [rel="next"]').href = data.nextUrl;
        el('.cbot .nextprev [rel="next"]').href = data.nextUrl;
      } else {
        el('.ctop .nextprev [rel="next"]').style.display = 'none';
        el('.cbot .nextprev [rel="next"]').style.display = 'none';
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
    } else if (wh.search(/leviatanscans|zeroscans|reaperscans|secretscans/) != -1) {
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
    if (wh.indexOf('manhwa-san') != -1 && el('a[href*="Title%20List"]')) {return}
    
    if (wh.indexOf('mangadex') != -1) { //api
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
          getData('//api.softkomik.site/api/baca-chapter/'+ eId +'&'+ eCh);
        }
      }, 100);
    } else if (wh.indexOf('komiku.id') != -1) { //click
      document.body.classList.add('click');
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
    } else if (wh.search(/readmanhua|ninjascans/) != -1) { //Madara theme
      if (wl .href.indexOf('?style=list') == -1) wl.href = wl.href.replace(/\?style\=paged?/g, '') + '?style=list';
    } else if (wh.search(/hatigarmscans|komikid/) != -1) { //my Manga Reader CMS
      el('#all').style.display = 'block';
      el('#ppp').style.display = 'none';
    } else if (wh.search(/leviatanscans|zeroscans|reaperscans|secretscans/) != -1) { //new cms
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
      };
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
      };
      
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
          var ps1_rgx = new RegExp('(?:const|let|var)\\s'+ d_txt[2] +'\\s?=\\s?[\'"]([^\\\'\\"]+)[\'"][;,]', 'i');
          d_ps1 = d_scr[i].innerHTML.match(ps1_rgx)[1];
          var ps2_rgx = new RegExp('(?:const|let|var)\\s'+ d_txt[3] +'\\s?=\\s?[\'"]([^\\\'\\"]+)[\'"][;,]', 'i');
          d_ps2 = d_scr[i].innerHTML.match(ps2_rgx)[1];
          break;
        }
      }
      
      var d_pass = getPass(d_ps1, d_ps2);
      var d_img = CryptoJS.AES.decrypt(window[d_id1], d_pass).toString(CryptoJS.enc.Utf8);
      d_img = rsxxx(d_img);
      d_img = _rscxx(d_img);
      d_img = _rsx(d_img);
      d_img = atob(d_img);
      d_img = d_img.replace(/\+/g, '%20');
      //wl.hash = d_img;
      d_img = decodeURIComponent(d_img);
      
      var par_elm = el('.'+ window[d_id2]);
      par_elm.parentNode.removeChild(par_elm.previousElementSibling);
      el_scr.parentNode.removeChild(el_scr);
      
      var r_area = document.createElement('div');
      r_area.id = 'readerarea';
      r_area.innerHTML = d_img;
      par_elm.parentNode.insertBefore(r_area, par_elm);
      par_elm.parentNode.removeChild(par_elm);
      
      /*var new_txt = document.createElement('textarea');
      new_txt.id = "data-img";
      new_txt.style.cssText = 'position:fixed;top:0;right:0;height:400px';
      new_txt.value = d_img;
      document.body.appendChild(new_txt);*/
    }
    
    if (el('body').className.search(/new_themesia|mangadex|kyuroku|merakiscans|leviatanscans|zeroscans|reaperscans|secretscans|jaiminisbox|softkomik/) == -1) { startImage(); }
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
  
  document.body.classList.add(wl.hostname.replace(/www\./, ''));
  removeAADB(); //remove anti adblock notify mangacanblog
  
  if (wh.indexOf('mangadex') != -1) {
    var content_ = el('#content');
    content_.style.cssText = 'position:initial;';
  } else if (wh.indexOf('webtoons') != -1) {
    el('#wrap').classList.add('no-css');
  } else if (wh.search(/mangaku|westmanga|komikindo.web.id|komikstation|sheamanga/) != -1) {
    // skip syndication.exdynsrv.com
    el('a', 'all').forEach(function(item) {
      item.addEventListener('click', function(e) {
        e.preventDefault();
        window.open(item.href);
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
  
  if (wp.search(wk1) != -1 && wl.hash.indexOf('project') == -1) {
    if (wh.search(/kiryuu|komikindo.web.id|sektekomik|komikav|sheamanga|gurukomik|masterkomik|kaisarkomik|boosei|asurascans/) != -1) document.body.classList.add('new_themesia');
    checkAll();
    //window.addEventListener('DOMContentLoaded', checkAll);
  }
  
  //RegExp https?:\/\/(www\.)?(mangaku|mangaindo|pecintakomik|komikstation|komikcast|neumanga|westmanga|mangakita|mangashiro|mangacanblog|otakufile|otakuindo|komikindo|kazemanga|komikgo|maid|ngomik|arsipmanga|mangakyo|kiryuu|komikotaku|bacamanga|aomegumi|komikav|komiku|kyuroku|mangapark|zeroscans|trashscanlations|yuumanga|animesc-kun)\.(blogspot\.)?((co|my|web)(m|\.id)?|net|org|me|in|tv|info|xyz)\/?(.*)
})();
