// COMIC BOOKMARK
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
  
  // Local time with timezone ISO standart https://stackoverflow.com/a/17415677/7598333
  function toISOLocal(d) {
    d = typeof d === 'string' || typeof d === 'number' ? new Date(d) : d ? d : new Date();
    var tzo = -d.getTimezoneOffset(),
      dif = tzo >= 0 ? '+' : '-',
      pad = function(num) {
        var norm = Math.floor(Math.abs(num));
        return (norm < 10 ? '0' : '') + norm;
      };
    return d.getFullYear() +
      '-' + pad(d.getMonth() + 1) +
      '-' + pad(d.getDate()) +
      'T' + pad(d.getHours()) +
      ':' + pad(d.getMinutes()) +
      ':' + pad(d.getSeconds()) +
      dif + pad(tzo / 60) +
      ':' + pad(tzo % 60);
  }
  
  // https://stackoverflow.com/a/32589289
  function firstCase(str, sep) {
    var separate = sep ? sep : ' ';
    var splitStr = str.toLowerCase().split(separate);
    for (var i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
    return splitStr.join(' '); 
  }
  
  function bc_checkData(id) {
    return firebase.database().ref(`bookmark/comic/${id}`).once('value').then(function(snapshot) {
        return snapshot.exists() ? true : false;
    });
  }
  
  function bc_deleteData(id) {
    el('.mn_notif span').innerHTML = 'Loading..';
    el('.mn_notif').classList.remove('bc_hidden');
      
    firebase.database().ref('bookmark/comic/' + id).remove()
      .then(function() {
        bc_mainData('remove');
      })
      .catch(function(error) {
        el('.mn_notif span').innerHTML = 'Error!!';
      });
  }
  
  // Firebase update vs set https://stackoverflow.com/a/38924648
  function bc_updateData(id, mangadex, title, alternative, chapter, note, type, host, url, read, image, update, similar) {
    firebase.database().ref('bookmark/comic/' + id).update({
      id: id.toLowerCase(),
      mangadex: mangadex.toLowerCase(),
      title: title,
      alternative: alternative,
      chapter: chapter.toLowerCase(),
      note: note.toLowerCase(),
      type: type.toLowerCase(),
      host: host.replace(/\.(blogspot|wordpress)(.*)/i, '').toLowerCase(),
      url: url.toLowerCase(),
      read: read.toLowerCase(),
      image: image,
      update: new Date(update).getTime(),
      similar: similar.toLowerCase()
    }, (error) => {
      if (error) {
        console.log(error);
        el('.mn_notif span').innerHTML = 'Error!!';
        el('.mn_notif span').classList.add('bc_danger');
        setTimeout(function() { el('.mn_notif').classList.add('bc_hidden'); }, 1500);
      } else {
        bc_mainData('update');
      }
    });
  }
  
  // Firebase update vs set https://stackoverflow.com/a/38924648
  function bc_setData(id, mangadex, title, alternative, chapter, note, type, host, url, read, image, update, similar) {
    firebase.database().ref('bookmark/comic/' + id).set({
      id: id.toLowerCase(),
      mangadex: mangadex.toLowerCase(),
      title: title,
      alternative: alternative,
      chapter: chapter.toLowerCase(),
      note: note.toLowerCase(),
      type: type.toLowerCase(),
      host: host.replace(/\.(blogspot|wordpress)(.*)/i, '').toLowerCase(),
      url: url.toLowerCase(),
      read: read.toLowerCase(),
      image: image,
      update: new Date(update).getTime(),
      similar: similar.toLowerCase()
    }, (error) => {
      if (error) {
        console.log(error);
        el('.mn_notif span').innerHTML = 'Error!!';
        el('.mn_notif span').classList.add('bc_danger');
        setTimeout(function() { el('.mn_notif').classList.add('bc_hidden'); }, 1500);
      } else {
        bc_mainData('set');
      }
    });
  }
  
  function bc_resetData() {
    el('.bc_id').value = '';
    el('.bc_mangadex').value = '';
    el('.bc_title').value = '';
    el('.bc_alt').value = '';
    el('.bc_ch').value = '';
    el('.bc_note').value = '';
    el('.bc_type').value = '';
    el('.bc_host').value = '';
    el('.bc_url').value = '';
    el('.bc_read').value = '';
    el('.bc_image').value = '';
    el('.bc_last').value = '';
    el('.bc_similar').value = '';
    el('.bc_mgdx_search').classList.add('bc_hidden');
    el('.bc_mgdx_open').classList.add('bc_hidden');
    el('.bc_date_before').classList.add('bc_hidden');
    setTimeout(function() {
      el('.mn_notif').classList.add('bc_hidden');
      el('.mn_notif span').innerHTML = '';
      el('.mn_notif span').classList.remove('bc_danger');
    }, 500);
  }
  
  function bc_editData(note, data) {
    if (is_mobile) el('.bc_data').classList.add('bc_f_edit');
    el('.bc_form').classList.remove('bc_hidden');
    el('.bc_form_btn').classList.remove('bc_hidden');
    el('.bc_form_btn .bc_set').classList.add('bc_hidden');
    el('.bc_form_btn .bc_update').classList.remove('bc_hidden');
    if (is_search) el('.bmark_db').classList.add('bc_s_shide');
    el('.bc_tr1').classList.add('bc_hidden');
    is_edit = true;
    
    el('.bc_id').value = data.id;
    el('.bc_mangadex').value = data.mangadex;
    el('.bc_title').value = data.title;
    el('.bc_alt').value = data.alternative;
    el('.bc_ch').value = data.chapter;
    el('.bc_note').value = data.note;
    el('.bc_type option[value="'+ data.type +'"]').selected = true;
    el('.bc_host').value = data.host;
    el('.bc_url').value = data.url;
    el('.bc_read').value = data.read;
    el('.bc_image').value = data.image;
    el('.bc_last').valueAsDate = local_date;
    el('.bc_similar').value = data.similar;
    el('.bc_ch').select();
    el('.bc_date_before').setAttribute('data-date', data.update);
    el('.bc_date_before').classList.remove('bc_hidden');
    if (el('.bc_mangadex').value == 'none') {
      el('.bc_mgdx_search').dataset.href = '//mangadex.org/search?title='+ data.id.replace(/\-/g, ' ') +'#listing';
      el('.bc_mgdx_search').classList.remove('bc_hidden');
    }
    if (wh.indexOf('mangadex') == -1 && el('.bc_mangadex').value != '' && el('.bc_mangadex').value != 'none') el('.bc_mgdx_open').classList.remove('bc_hidden');
  }
  
  function bc_formCheck() {
    if (el('.bc_id').value == '' || el('.bc_ch').value == '') {
      alert('id or chapter is empty');
      return false;
    }
    if (el('.bc_type').value == '') {
      alert('comic type is empty');
      return false;
    }
    if (el('.bc_mangadex').value == '') {
      alert('mangadex id is empty or fill with "none"');
      return false;
    } else {
      if (el('.bc_mangadex').value == 'none' && el('.bc_image').value == '') {
        alert('cover image is empty');
        return false;
      }
      if (el('.bc_mangadex').value != 'none' && el('.bc_image').value != '') {
        alert('delete image, image is included in mangadex id');
        return false;
      }
    }
    return true;
  }
  
  function bc_searchResult(arr) {
    var s_txt = '<div class="cs_list" style="margin-bottom:10px;"><ul>';
    if (arr.length != 0) {
      for (var i = 0; i < arr.length; i++) {
        s_txt += '<li class="_cl';
        if (i+1 < arr.length) s_txt += ' bc_line';
        if (arr[i].read != '') s_txt += ' bc_url_read';
        s_txt += ' flex_wrap">';
        s_txt += '<div class="_bc bc_100" onclick="window.open(\''+ arr[i].url +'\')" title="'+ arr[i].url +'">'+ arr[i].title;
        if (arr[i].alternative != '') s_txt += ' | '+ arr[i].alternative;
        s_txt += '</div>';
        s_txt += '<div class="flex bc_100" data-id="'+ arr[i].id +'">';
        s_txt += '<span class="cs_ch _bc bc_100 line_text">'+ arr[i].chapter + (arr[i].note ? ' ('+ arr[i].note +')' : '') +'</span>';
        if (arr[i].read != '') s_txt += '<button class="_bc bc_selected" onclick="window.open(\''+ arr[i].read +'\')" title="'+ arr[i].read +'">Read</button>';
        s_txt += '<button class="cs_edit _bc">Edit</button>';
        s_txt += '<button class="cs_delete _bc" title="Delete">X</button>';
        s_txt += '<span class="cs_num _bc bc_selected">'+ (i+1) +'</span>';
        s_txt += '</div>';
        s_txt += '</li>';
      }
    } else {
      s_txt += '<li>Oops! Comic not found</li>';
    }
    s_txt += '</ul></div>';
    s_txt += '<div class="cs_text flex"><span class="bc_text">Search Result <span class="_bc bc_active"><b>'+ arr.length +'</b></span></span><span class="f_grow"></span><button class="cs_close _bc">Close</button></div>';
    
    el('.bc_result').innerHTML = s_txt;
    el('.bc_result').classList.remove('bc_hidden');
    el('.bmark_db').classList.remove('bc_s_shide');
    el('.bc_result .cs_list').style.height = 'calc(100vh - '+ (el('.bc_tr1').offsetHeight + el('.cs_text').offsetHeight  + 60) +'px)';
      
    el('.cs_close').onclick = function() {
      is_search = false;
      el('.bc_result').classList.add('bc_hidden');
      //el('.bc_search input').value = '';
      el('.bmark_db').classList.add('bc_s_shide');
    };
    
    el('.cs_edit', 'all').forEach(function(item) {
      item.addEventListener('click', function() {
        bc_editData('search', main_data[item.parentNode.dataset.id]);
      });
    });
    
    el('.cs_delete', 'all').forEach(function(item) {
      item.addEventListener('click', function() {
        if (confirm('Delete '+ item.parentNode.dataset.id +' ?')) {
          bc_deleteData(item.parentNode.dataset.id);
        }
      });
    });
  }
  
  function bc_showHtml(data, note) {
    var chk = data.host.search(not_support) != -1 || wh.indexOf(data.host) != -1;
    var s_txt = '';
    s_txt += '<li class="_cm';
    if (data.similar != '' && note) s_txt += ' cm_similar';
    if (data.read != '') s_txt += ' bc_url_read';
    s_txt += ' flex_wrap'+ (data.similar != '' && (main_data[data.similar] || data.similar.indexOf(',') != -1) && !note ? ' cm_main' : '') +'">';
    s_txt += '<div class="_bc bc_100"'+ (!note && wh.indexOf(data.host) != -1 && el('title').innerHTML.search(chapter_t_rgx) == -1 ? '' : ' onclick="window.open(\''+ data.url +'\')"') +' title="'+ data.url +'">'+ data.title;
    if (data.alternative != '') s_txt += ' | '+ data.alternative;
    s_txt += '</div>';
    s_txt += '<div class="flex bc_100" data-id="'+ data.id +'">';
    s_txt += '<span class="cm_ch _bc line_text'+ (chk ? ' bc_100' : ' bc_50') +'">'+ data.chapter + (data.note ? ' ('+ data.note +')' : '') +'</span>';
    if (data.read != '') s_txt += '<button class="_bc bc_selected'+ (chk ? '' : ' bc_hidden') +'" onclick="window.open(\''+ data.read +'\')" title="'+ data.read +'">Read</button>';
    s_txt += '<button class="cm_edit _bc'+ (chk ? '' : ' bc_hidden') +'">Edit</button>';
    s_txt += '<button class="cm_delete _bc'+ (chk ? '' : ' bc_hidden') +'" title="Delete">X</button>';
    s_txt += '</div>';
    s_txt += '</li>';
    
    if (note) {
      el('.bc_comic .cm_list').innerHTML += s_txt;
    } else {
      el('.bc_comic').innerHTML = '<ul class="cm_list">'+ s_txt +'</ul>';
      el('.bc_comic .cm_list').style.maxHeight = 'calc(100vh - '+ (el('.bc_menu').offsetHeight + el('.bc_search').offsetHeight  + 60) +'px)';
    }
    
    /*if (data.type != '') {
      if (!localStorage.getItem(data.id)) localStorage.setItem(data.id, 'is_'+ data.type);
      document.body.classList.add('is-'+ data.type);
    }*/
  }
  
  function bc_showComic(data, note) {
    is_comic = true;
    bc_showHtml(data);
    console.log(`check comic: ${note}`);
    el('.bc_comic').classList.remove('bc_hidden');
    
    if (data.similar != '') {
      if (data.similar.indexOf(',') != -1) {
        var smlr_list = data.similar.replace(/\s+/g, '').split(',');
        for (var j = 0; j < smlr_list.length; j++) {
          if (main_data[smlr_list[j]]) bc_showHtml(main_data[smlr_list[j]], 'similar');
        }
      } else {
        if (main_data[data.similar]) bc_showHtml(main_data[data.similar], 'similar');
      }
    }
    
    if (el('.bmark_db').classList.contains('bc_shide') && (data.url.indexOf(wp) != -1 || (wp.search(chapter_w_rgx) == -1 && el('title').innerHTML.search(chapter_t_rgx) == -1))) {
      el('.bc_toggle').click();
    }  
    
    el('.cm_edit', 'all').forEach(function(item) {
      item.addEventListener('click', function() {
        bc_editData('comic', main_data[item.parentNode.dataset.id]);
      });
    });
    
    el('.cm_delete', 'all').forEach(function(item) {
      item.addEventListener('click', function() {
        if (confirm('Delete '+ item.parentNode.dataset.id +' ?')) {
          bc_deleteData(item.parentNode.dataset.id);
        }
      });
    });
  }
  
  function bc_checkComic(arr, chk) {
    chk = chk ? (chk+1) : 1;
    var id_chk = false;
    var comic_id = wp.match(id_w_rgx)[1].replace(/-bahasa-indonesia(-online-terbaru)?/i, '').replace(/\.html/i, '').toLowerCase();
    var title_id = el('title').innerHTML.replace(/&#{0,1}[a-z0-9]+;/ig, '').replace(/\([^\)]+\)/g, '').replace(/\s+/g, ' ').replace(/\s(bahasa\s)?indonesia/i, '').replace(/(man(ga|hwa|hua)|[kc]omi[kc]|baca|read)\s/i, '').replace(/[\||\-|\–](?:.(?![\||\-|\–]))+$/, '').replace(/\s$/, '').replace(/\|/g, ''); //old ^([^\||\-|\–]+)(?:\s[\||\-|\–])?
    var title_rgx = new RegExp(title_id, 'i');
    
    for (var i = 0; i < arr.length; i++) {
      // mangadex
      if (wp.indexOf('/title/'+ arr[i].mangadex +'/') != -1) {
        id_chk = true;
        bc_showComic(arr[i], 'mangadex');
        break;
      }
      // wp same with id, check 2
      if (chk == 2 && (comic_id == arr[i].id || title_id.replace(/[^\s\w]/g, '').replace(/\s+/g, '-').toLowerCase() == arr[i].id)) {
        id_chk = true;
        bc_showComic(arr[i], 'same');
        break;
      }
      // contains title id, check 3
      if (chk == 3 && title_id != '' && (arr[i].id.replace(/\-/g, ' ').search(title_rgx) != -1 || arr[i].title.search(title_rgx) != -1 || arr[i].alternative.search(title_rgx) != -1 || arr[i].url.indexOf(wp) != -1)) {
        id_chk = true;
        console.log('title_rgx: '+ title_rgx);
        bc_showComic(arr[i], 'contains');
        break;
      }
      // wp contains id, check 4
      if (chk == 4 && wp.indexOf(arr[i].id) != -1) {
        id_chk = true;
        bc_showComic(arr[i], 'wp contains');
      }
      if (i == arr.length-1 && !id_chk) {
        is_comic = false;
        el('.bc_comic').classList.add('bc_hidden');
        if (chk <= 4) bc_checkComic(arr, chk); //double check if title not same as id
      }
    }
  }
  
  function bc_genList(data) {
    var list_txt = '[';
    for (var i = 0; i < data.length; i++) {
      list_txt += '{"url":"'+ data[i].url +'"}';
      if (i < data.length-1) list_txt += ',';
    }
    list_txt += ']';
    localStorage.setItem('comic_tools_list', list_txt);
  }
  
  function bc_genData(json) {
    var arr = [];
    for (var key in json) {
      arr.push(json[key]);
    }
    return arr;
  }
  
  function bc_mainData(note, query) {
    firebase.database().ref('bookmark/comic').once('value', function(snapshot) {
      main_data = snapshot.val();
      arr_data = bc_genData(snapshot.val());
      bc_genList(arr_data);
      console.log('comic bookmark: '+ arr_data.length);
      el('.bc_total').innerHTML = 'Total: <b>'+ arr_data.length +'<b>';
      el('.bc_total').classList.remove('bc_hidden');
      
      if (wp != '/' && wp.search(/\/(\?s=|search\?)/) == -1) bc_checkComic(arr_data); //check if comic data exist and show bookmark
      
      if (note != 'start') {
        el('.mn_notif span').innerHTML = 'Done';
        bc_resetData();
        is_edit = false;
        if (is_mobile) el('.bc_data').classList.remove('bc_f_edit');
        el('.bc_form').classList.add('bc_hidden');
        el('.bc_form_btn').classList.add('bc_hidden');
        el('.bc_tr1').classList.remove('bc_hidden');
      }
      
      // search
      query = note != 'start' && is_search ? el('.bc_search input').value : query;
      if (query) {
        var key_rgx = new RegExp(query, 'ig');
        var search_data = arr_data.filter(item => (item.id.search(key_rgx) != -1 || item.mangadex.search(key_rgx) != -1 || item.title.search(key_rgx) != -1 || item.alternative.search(key_rgx) != -1 || item.chapter.search(key_rgx) != -1 || item.note.search(key_rgx) != -1 || item.type.search(key_rgx) != -1 || item.host.search(key_rgx) != -1));
        bc_searchResult(search_data);
      }
    });
  }
  
  function startBookmark() {
    var b_txt = '';
    // css control already in css tools
    // css bookmark
    b_txt += '<style>.bc_100{width:100%;}.bc_50{width:50%;}._bmark ::-webkit-scrollbar{-webkit-appearance:none;}._bmark ::-webkit-scrollbar:vertical{width:10px;}._bmark ::-webkit-scrollbar:horizontal{height:10px;}._bmark ::-webkit-scrollbar-thumb{background-color:rgba(0,0,0,.5);border:2px solid #757575;}._bmark ::-webkit-scrollbar-track{background-color:#757575;}._bmark a,._bmark a:hover,._bmark a:visited{color:#ddd;text-shadow:none;}._bmark ::-webkit-input-placeholder{color:#757575;}._bmark ::placeholder{color:#757575;}._bmark select{-webkit-appearance:menulist-button;color:#ddd;}._bmark select:invalid{color:#757575;}._bmark select option{color:#ddd;}.bmark_db{position:fixed;top:0;bottom:0;left:0;width:350px;padding:10px;background:#17151b;color:#ddd;border-right:1px solid #333;}.bmark_db.bc_shide{left:-350px;}.bmark_db .bc_f_edit{overflow-y:auto;}.bmark_db ul{padding:0;margin:0;}.bc_line:not(.cm_similar){margin-bottom:10px;padding-bottom:10px;border-bottom:5px solid #333;}._bmark ._bc{background:#252428;color:#ddd;padding:4px 8px;margin:4px;font:14px Arial;text-transform:initial;cursor:pointer;outline:0 !important;border:1px solid #3e3949;}._bc.fp_content{margin:auto;}.bc_text{padding:4px 8px;margin:4px;}._bmark .bc_selected,._bmark button:not(.bc_no_hover):hover{background:#4267b2;border-color:#4267b2;}._bmark .bc_active{background:#238636;border-color:#238636;}._bmark .bc_danger{background:#ea4335;border-color:#ea4335;}._bmark input._bc{padding:4px;display:initial;cursor:text;height:auto;background:#252428 !important;color:#ddd !important;border:1px solid #3e3949;}._bmark input._bc:hover{border-color:#3e3949;}.bmark_db:not(.bc_s_shide) .bc_comic .cm_list{max-height:25vh !important;}.bc_comic .cm_main{margin:5px;border:4px solid #4267b2;}.bc_comic .cm_main .cm_edit{background:#4267b2;border:0;}.bc_comic .cm_similar{margin-top:10px;padding-top:10px;border-top:1px solid #333;}.bc_comic .cm_list,.bc_result .cs_list{overflow-y:auto;}.bc_result li,.bc_comic li{border-width:1px;}._bmark .bc_toggle{position:absolute;bottom:0;right:-40px;align-items:center;width:40px;height:40px;font-size:30px !important;padding:0;margin:0;line-height:0;}.bc_bg{position:fixed;top:0;bottom:0;left:0;right:0;background:rgba(0,0,0,.5);}.bmark_db.bc_s_shide .bc_result,.bc_hidden{display:none;}</style>';
    // css mobile
    b_txt += '<style>.bc_mobile .bmark_db{width:80%;flex-direction:column;}.bc_mobile .bmark_db.bc_shide{left:-80%;}._bmark.bc_mobile ._bc{font-size:16px;}._bmark.bc_mobile .bc_toggle{right:-70px;width:70px;height:70px;background:transparent;color:#fff;border:0;}</style>';
    // html
    b_txt += '<div class="bc_bg bc_hidden"></div>';
    b_txt += '<div class="bmark_db bc_s_shide bc_shide flex_wrap f_bottom">';
    if (is_mobile) b_txt += '<div class="f_grow"></div>'; //only if "is_edit = true"
    b_txt += '<div class="bc_data bc_100 bc_hidden">';
    b_txt += '<div class="bc_form bc_line flex_wrap bc_hidden">';
    b_txt += '<input class="bc_id _bc bc_100" type="text" placeholder="ID">';
    b_txt += '<div class="flex bc_100"><input class="bc_mangadex _bc bc_100" type="text" placeholder="Mangadex ID"><button class="bc_mgdx_search _bc bc_selected bc_hidden" onclick="window.open(this.dataset.href)">Search</button><button class="bc_mgdx_open _bc bc_selected bc_hidden" onclick="window.open(\'//mangadex.org/title/\'+document.querySelector(\'.bc_mangadex\').value+\'/\')">Open</button></div>';
    b_txt += '<input class="bc_title _bc bc_100" type="text" placeholder="Title">';
    b_txt += '<input class="bc_alt _bc bc_100" type="text" placeholder="Alternative Title">';
    b_txt += '<input class="bc_ch _bc bc_100" type="text" placeholder="Chapter" onclick="this.select()">';
    b_txt += '<input class="bc_note _bc bc_100" type="text" placeholder="Note">';
    b_txt += '<select class="bc_type _bc bc_100" required><option value="" selected disabled hidden>Type</option><option value="manga">manga</option><option value="manhua">manhua</option><option value="manhwa">manhwa</option></select>';
    b_txt += '<input class="bc_host _bc bc_100" type="text" placeholder="hostname">';
    b_txt += '<input class="bc_url _bc bc_100" type="text" placeholder="URL">';
    b_txt += '<input class="bc_read _bc bc_100" type="text" placeholder="Link to read (if web to read is different)">';
    b_txt += '<input class="bc_image _bc bc_100" type="text" placeholder="Cover image">';
    b_txt += '<div class="flex bc_100"><input class="bc_last _bc bc_100" type="date" title="Last Update"><button class="bc_date_before _bc bc_selected bc_hidden" onclick="document.querySelector(\'.bc_last\').valueAsDate = new Date(Number(this.dataset.date))">Before</button></div>';
    b_txt += '<input class="bc_similar _bc bc_100" type="text" placeholder="Similar">';
    b_txt += '</div>';// .bc_form
    b_txt += '<div class="bc_form_btn bc_100 flex bc_hidden"><button class="bc_gen _bc'+ (wp != '/' && wp.search(/\/(\?s=|search\?)/) == -1 ? '' : ' bc_hidden') +'">Generate</button><span class="f_grow"></span><button class="bc_close _bc">Close</button><button class="bc_set _bc bc_active bc_no_hover bc_hidden">Set</button><button class="bc_update _bc bc_active bc_no_hover bc_hidden">Update</button></div>';
    b_txt += '<div class="bc_result bc_line bc_hidden"></div>';
    b_txt += '<div class="bc_tr1">';
    b_txt += '<div class="bc_comic bc_line bc_hidden"></div>';
    b_txt += '<div class="bc_search bc_line flex"><input class="_bc bc_100" type="text" placeholder="Search..."><button class="_bc">GO</button></div>';
    b_txt += '<div class="bc_menu flex"><button class="bc_add _bc">Add</button><button class="bc_out _bc">Logout</button><span class="f_grow"></span><span class="bc_total _bc bc_active bc_hidden"></span></div>';
    b_txt += '</div>';// .bc_tr1
    b_txt += '</div>';// .bc_data
    b_txt += '<div class="bc_login flex_wrap bc_hidden">';
    b_txt += '<input class="bc_email _bc bc_100" type="email" placeholder="Email">';
    b_txt += '<input class="bc_pass _bc bc_100" type="password" placeholder="Password">';
    b_txt += '<div class="flex"><button class="bc_in _bc">Login</button><span class="lg_notif _bc bc_selected bc_hidden"></span></div>';
    b_txt += '</div>';// .bc_login
    b_txt += '<div class="bc_toggle _bc bc_100 flex f_center">&#9733;</div>';
    b_txt += '<div class="mn_notif flex flex_perfect bc_hidden" style="position:absolute;"><span class="_bc fp_content"></span></div>';// .bmark_db
    b_txt += '</div>';// .bmark_db
    
    var b_html = document.createElement('div');
    b_html.style.cssText = 'position:relative;z-index:2147483647;';
    b_html.className = '_bmark cbr_mod' + (is_mobile ? ' bc_mobile' : '');
    b_html.innerHTML = b_txt;
    document.body.appendChild(b_html);
    if (is_mobile) el('.bc_toggle').classList.add('bc_no_hover');
    
    // Check login source: https://youtube.com/watch?v=iKlWaUszxB4&t=102
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) { //User is signed in.
        is_login = true;
        bc_mainData('start'); //Start firebase data
        el('.bc_login').classList.add('bc_hidden');
        el('.bc_data').classList.remove('bc_hidden');
      } else {
        is_login = false;
        el('.bc_login').classList.remove('bc_hidden');
        el('.bc_data').classList.add('bc_hidden');
      }
    });
    
    document.onkeyup = function(e) {
      // enter to search
      if (el('.bc_search input') === document.activeElement && e.keyCode == 13) {
        el('.bc_search button').click();
      }
      // enter to set/update
      if (!el('.bc_form').classList.contains('bc_hidden') && e.keyCode == 13) {
        if (el('.bc_set').classList.contains('bc_hidden')) el('.bc_update').click();
        if (el('.bc_update').classList.contains('bc_hidden')) el('.bc_set').click();
      }
      if (e.keyCode == 13) document.activeElement.blur();
    };
    
    el('.bc_toggle').onclick = function() {
      this.classList.toggle('bc_selected');
      el('.bmark_db').classList.toggle('bc_shide');
      el('.bc_bg').classList.toggle('bc_hidden');
      if (is_mobile) document.body.style.overflow = el('.bmark_db').classList.contains('bc_shide') ? 'initial' : 'hidden';
    };
    
    el('.bc_bg').onclick = function() {
      el('.bc_toggle').click();
    };
    
    el('.bc_login .bc_in').onclick = function() {
      var userEmail = el('.bc_email').value;
      var userPass = el('.bc_pass').value;
      el('.lg_notif').innerHTML = 'Loading..';
      el('.lg_notif').classList.remove('bc_hidden');
      
      firebase.auth().signInWithEmailAndPassword(userEmail, userPass).then((user) => {
        el('.lg_notif').classList.add('bc_hidden');
      }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        el('.lg_notif').innerHTML = 'Error!!';
      });
    };
    
    el('.bc_menu .bc_out').onclick = function() {
      firebase.auth().signOut();
    };
    
    el('.bc_menu .bc_add').onclick = function() {
      bc_resetData();
      is_edit = true;
      if (is_mobile) el('.bc_data').classList.add('bc_f_edit');
      el('.bc_form').classList.remove('bc_hidden');
      el('.bc_form_btn').classList.remove('bc_hidden');
      el('.bc_form_btn .bc_set').classList.remove('bc_hidden');
      el('.bc_form_btn .bc_update').classList.add('bc_hidden');
      if (is_search) el('.bmark_db').classList.add('bc_s_shide');
      el('.bc_tr1').classList.add('bc_hidden');
    };
    
    el('.bc_search button').onclick = function() {
      if (el('.bc_search input').value == '') return;
      is_search = true;
      document.activeElement.blur();
      el('.mn_notif span').innerHTML = 'Loading..';
      el('.mn_notif').classList.remove('bc_hidden');
      bc_mainData('search', el('.bc_search input').value);
    };
    
    // klik "Generate" harus pada halaman komik project
    el('.bc_form_btn .bc_gen').onclick = function() {
      var comic_id = wp.match(id_w_rgx)[1].replace(/-bahasa-indonesia(-online-terbaru)?/i, '').replace(/\.html/i, '').toLowerCase();
      el('.bc_id').value = comic_id;
      if (wh.indexOf('mangadex') != -1 && wp.indexOf('/title/') != -1) el('.bc_mangadex').value = wp.match(/\/title\/([^\/]+)/)[1];
      el('.bc_title').value = wh.indexOf('mangacanblog') != -1 ? firstCase(comic_id, '_') : firstCase(comic_id, '-');
      el('.bc_host').value = wh.replace(/(w{3}|m)\./, '');
      el('.bc_url').value = '//'+ wh.replace(/(w{3}|m)\./, '') + wp + (wh.indexOf('webtoons') != -1 ? wl.search : '');
      el('.bc_mgdx_search').dataset.href = '//mangadex.org/search?title='+ comic_id.replace(/[-_\.]/g, ' ') +'#listing';
      if (el('.bc_mangadex').value == '' || el('.bc_mangadex').value == 'none') el('.bc_mgdx_search').classList.remove('bc_hidden');
      // for .bc_image if mangadex id exists then leave it blank, if none then it must be filled
      el('.bc_last').valueAsDate = local_date;
      
      /* Mangadex image format, example: 
      - https://mangadex.org/images/manga/58050.jpg
      - https://mangadex.org/images/manga/58050.large.jpg
      */
    };
    
    el('.bc_form_btn .bc_close').onclick = function() {
      bc_resetData();
      is_edit = false;
      if (is_mobile) el('.bc_data').classList.remove('bc_f_edit');
      el('.bc_form').classList.add('bc_hidden');
      el('.bc_form_btn').classList.add('bc_hidden');
      if (is_search) el('.bmark_db').classList.remove('bc_s_shide');
      el('.bc_tr1').classList.remove('bc_hidden');
    };
    
    el('.bc_form_btn .bc_set').onclick = function() {
      el('.bc_mangadex').value = el('.bc_mangadex').value.toLowerCase();
      if (!bc_formCheck()) return;
      
      el('.mn_notif span').innerHTML = 'Loading..';
      el('.mn_notif').classList.remove('bc_hidden','bc_danger');
      bc_checkData(el('.bc_id').value).then(function(res) {
        if (!res) {
          bc_setData(el('.bc_id').value, el('.bc_mangadex').value, el('.bc_title').value, el('.bc_alt').value, el('.bc_ch').value, el('.bc_note').value, el('.bc_type').value, el('.bc_host').value, el('.bc_url').value, el('.bc_read').value, el('.bc_image').value, el('.bc_last').value, el('.bc_similar').value);
        } else {
          el('.mn_notif span').innerHTML = 'Comic already exist';
          el('.mn_notif span').classList.add('bc_danger');
          setTimeout(function() { el('.mn_notif').classList.add('bc_hidden'); }, 1500);
        }
      });
    };
    
    el('.bc_form_btn .bc_update').onclick = function() {
      if (!bc_formCheck()) return;
      
      el('.mn_notif span').innerHTML = 'Loading..';
      el('.mn_notif').classList.remove('bc_hidden');
      bc_updateData(el('.bc_id').value, el('.bc_mangadex').value, el('.bc_title').value, el('.bc_alt').value, el('.bc_ch').value, el('.bc_note').value, el('.bc_type').value, el('.bc_host').value, el('.bc_url').value, el('.bc_read').value, el('.bc_image').value, el('.bc_last').value, el('.bc_similar').value);
    };
  }
  
  var main_data, arr_data;
  var wl = window.location;
  var wh = wl.hostname;
  var wp = wl.pathname;
  var is_login = false;
  var is_comic = false;
  var is_search = false;
  var is_edit = false;
  var is_mobile = document.documentElement.classList.contains('is-mobile') ? true : false; //from comic tools
  var local_date = new Date(toISOLocal().split('T')[0]);
  var chapter_t_rgx = /\s(ch\.?(ap(ter)?)?|ep\.?(isode)?)(\s?\d+|\s)/i; //chek for <title>
  var chapter_w_rgx = /(\/|\-|\_|\d+)((ch|\/c)(ap(ter)?)?|ep(isode)?)(\/|\-|\_|\d+)/i; //check for window.location
  var id_w_rgx = /\/(?:(?:baca-)?(?:komik|manga|read|[a-z]{2}\/[^\/]+|(?:title|series|comics?)(?:\/\d+)?|(?:\d{4}\/\d{2})|p)[\/\-])?([^\/\n]+)\/?(?:list)?/i; //id from window.location
  var not_support = /mangaku|mangacanblog|mangayu|klankomik|softkomik|bacakomik.co|komikindo.web.id|mangaindo.web.id|readmng|(zero|hatigarm|reaper|secret)scan[sz]/;
  
  addScript('https://www.gstatic.com/firebasejs/8.2.3/firebase-app.js');
  
  // Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyBma6cWOGzwSE4sv8SsSewIbCjTPhm7qi0",
    authDomain: "bakomon99.firebaseapp.com",
    databaseURL: "https://bakomon99.firebaseio.com",
    projectId: "bakomon99",
    storageBucket: "bakomon99.appspot.com",
    messagingSenderId: "894358128479",
    appId: "1:894358128479:web:6fbf2d52cf76da755918ea",
    measurementId: "G-Z4YQS31CXM"
  };
  
  var db_chk = setInterval(function() {
    if (typeof firebase !== 'undefined') {
      clearInterval(db_chk);
      firebase.initializeApp(firebaseConfig);
      addScript('https://www.gstatic.com/firebasejs/8.2.3/firebase-database.js');
      var db2_chk = setInterval(function() {
        if (typeof firebase.database !== 'undefined') {
          clearInterval(db2_chk);
          addScript('https://www.gstatic.com/firebasejs/8.2.3/firebase-auth.js');
          var db3_chk = setInterval(function() {
            if (typeof firebase.auth !== 'undefined') {
              clearInterval(db3_chk);
              startBookmark();
            }
          }, 100);
        }
      }, 100);
    }
  }, 100);
})();
