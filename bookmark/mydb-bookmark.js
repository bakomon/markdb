// DATABASE BOOKMARK
function mydb_bm_fnc() {
  if (mydb_bm_loaded) return;
  mydb_bm_loaded = true;
  
  // RegExp.escape function in JavaScript https://stackoverflow.com/a/3561711/7598333
  function escapeRegex(str) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  }
  
  function getHostname(url) {
    var wh_rgx = /^(w{3}|web|m(obile)?|read|data)\./i;
    url = 'http://'+ url.replace(/(https?:)?\/\//, '');
    url = new URL(url).hostname.replace(wh_rgx, '')/*.replace(/\.(blogspot|wordpress)(.*)/i, '')*/;
    return url;
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
  
  // Sorting JSON by values https://stackoverflow.com/a/9188211/7598333
  function sortBy(array, prop, asc) {
    array = array.sort(function(a, b) {
      if (asc) {
        return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
      } else {
        return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
      }
    });
  }
  
  function dateFormat(date, lang) {
    // ref: https://www.w3schools.com/js/js_date_formats.asp
    date = new Date(date);
    var months = lang == 'in' ? ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'] : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var dates = lang == 'in' ? (date.getDate() +'\x20'+ months[date.getMonth()] +'\x20') : (months[date.getMonth()] +'\x20'+ date.getDate() +', ');
    return dates + date.getFullYear();
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
  
  // Check if string is URL https://stackoverflow.com/a/49849482/7598333
  function isValidUrl(string) {
    // regex = https://gist.github.com/dperini/729294
    var res = string.match(/^(?:(?:(?:https?|ftp):)?\/\/)?(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i);
    return (res !== null);
  }
  
  // Validate image file extension https://stackoverflow.com/a/10473222/7598333
  function isValidImage(string) {
    return (/\.(a?png|jpe?g|avif|gif|svg|bmp|ico|tiff?|webp)$/i).test(string);
  }
  
  function db_info(text, type, timeout) {
    if (text == 'RESET') {
      setTimeout(function() {
        el('.db_notif').classList.add('db_hidden');
        el('.db_notif .db_notif_text').innerHTML = '';
        el('.db_notif .db_notif_text').classList.remove('db_danger');
      }, 500);
    } else {
      type = type || '';
      el('.db_notif .db_notif_text').innerHTML = text;
      el('.db_notif .db_notif_text').classList.add('db_'+ type);
      el('.db_notif').classList.remove('db_hidden');
      if (timeout) setTimeout(function() {
        el('.db_notif').classList.add('db_hidden');
        el('.db_notif .db_notif_text').classList.remove('db_danger');
      }, 1500);
    }
  }
  
  function db_validId(type) {
    var id_elem = el('.db_form .db_'+ type);
    var id = id_elem.value;
    if (id_elem.dataset[type]) id = id_elem.dataset[type];
    return id;
  }
  
  function db_pathId(chk, custom) {
    var path = mydb_select == 'list' ? `${mydb_type}/list` : `source/${mydb_type}`;
    path = 'bookmark/'+ path;
    if (chk) {
      var id = custom ? custom : mydb_select == 'list' ? db_validId('id') : getHostname(db_validId('host')).replace(/\./g, '-');
      path = path +'/'+ id;
    }
    return path;
  }
  
  function db_listChange() {
    var lc_obj = '{"length":"'+ main_arr.length +'", "update":'+ new Date().getTime() +'}';
    lc_obj = JSON.parse(lc_obj);
    firebase.app(fbase_app).database().ref(`bookmark/${mydb_type}/check`).update(lc_obj, (error) => {
      if (error) {
        console.log('!! Error: '+ error);
        alert('!! Error: db_listChange(');
      }
    });
  };
  
  function db_checkData(note, path) {
    var fb_ref = firebase.app(fbase_app).database().ref(path);
    if (mydb_select == 'list' && note == 'bmdb') fb_ref = fb_ref.orderByChild('bmdb').equalTo(el('.db_form .db_bmdb').value);
    return fb_ref.once('value').then(function(snapshot) {
      if (mydb_select == 'list') {
        // chek 1
        if (note == 'id') {
          if (snapshot.exists()) {
            return '{"check":true,"note":"'+ note +'"}';
          } else {
            return el('.db_form .db_bmdb').value == 'none' ? false : db_checkData('bmdb', `bookmark/${mydb_type}/list`);
          }
        }
        // check 2
        if (note == 'bmdb') {
          var cd_chk = snapshot.exists() ? true : false;
          return '{"check":'+ cd_chk +',"note":"'+ note +'"}';
        }
      } else { //mydb_select == 'source'
        var cd_chk = snapshot.exists() ? true : false;
        return '{"check":'+ cd_chk +',"note":"'+ note +'"}';
      }
    });
  }
  
  function db_deleteData(path) {
    db_info('Loading..');
    
    firebase.app(fbase_app).database().ref(path).remove()
      .then(function() {
        if (mydb_type == mydb_type_bkp && mydb_select == 'list') db_mainData('remove');
        if (is_index) db_startIndex('remove');
        if (mydb_select == 'source') sourceChange();
      })
      .catch(function(error) {
        db_info('Error!!', 'danger', true);
      });
  }
  
  function db_genData(note) {
    var g_val, g_arr = mydb_select == 'source' ? ['host','domain','status','language','theme','tag','project','icon'] : ['id','bmdb','title','alternative','number','note','type','host','url','read','image','update','similar'];
    var g_txt = '{';
    for (var i = 0; i < g_arr.length; i++) {
      if (note == 'update' && (g_arr[i] == 'id' || mydb_select == 'source' && g_arr[i] == 'host')) continue;
      if (mydb_type.search(/novel|anime/) != -1 && g_arr[i] == 'read') continue;
      if (mydb_type == 'anime' && g_arr[i] == 'type') continue;
      
      if (mydb_select == 'source' && g_arr[i] == 'tag') {
        var s_txt = '';
        var sdata = el('.db_'+ g_arr[i] +' input', 'all');
        for (var j = 0; j < sdata.length; j++) {
          if (sdata[j].checked == true) s_txt += sdata[j].value +',';
        }
        g_val = s_txt.replace(/,$/, '');
      } else {
        g_val = el('.db_form .db_'+ g_arr[i]).value;
      }
      
      if (mydb_select == 'source' && g_arr[i] == 'domain' && g_val != '') {
        var d_txt = '';
        var d_list = g_val.split(/\n/);
        for (var j = 0; j < d_list.length; j++) {
          d_txt += getHostname(d_list[j]) +'\n';
        }
        g_val = d_txt.replace(/\n$/, '');
      }
      
      if (g_arr[i].search(/title|alternative/) != -1) g_val = g_val.replace(/(")/g, '\\$1');
      if (g_arr[i].search(/domain|alternative/) != -1) g_val = g_val.replace(/\n/g, ' | ');
      if (g_arr[i] == 'host') g_val = getHostname(g_val);
      if (g_arr[i].search(/project|url|read/) != -1) g_val = g_val.replace(/^(https?:)?\/\//g, '//').replace(/\/\/((w{3}|m(obile)?)\.)?/g, '//');
      if (g_arr[i] == 'update') g_val = new Date(g_val).getTime();
      if (g_arr[i].search(/project|icon|title|alternative|url|read|image|update/) == -1) g_val = g_val.toLowerCase();
      if (g_arr[i] == 'similar') g_val = g_val.replace(/\n/g, ', ');
      
      g_txt += '"'+ g_arr[i] +'":'+ (g_arr[i] == 'update' ? g_val : '"'+ g_val +'"');
      if (i < g_arr.length-1) g_txt += ',';
    }
    g_txt += '}';
    return JSON.parse(g_txt);
  }
  
  // Firebase update vs set https://stackoverflow.com/a/38924648
  function db_changeData(note) {
    firebase.app(fbase_app).database().ref(db_pathId(true))[note](db_genData(note), (error) => {
      if (error) {
        console.log('!! Error: '+ error);
        db_info('Error!!', 'danger', true);
      } else {
        if (mydb_type == mydb_type_bkp && mydb_select == 'list') {
          if (note == 'update' && !is_search && !mydb_settings.server_check.bm_list) {
            el('.db_bm_show').innerHTML = 'Loading...';
            listCheck(JSON.stringify(main_data));
            db_info('Done');
            db_resetForm('remove');
          } else {
            db_mainData(note);
          }
        }
        if (note == 'update' && is_index) db_startIndex(note);
        if (mydb_select == 'source') {
          sourceChange();
          if (note == 'set') {
            db_info('Done');
            db_resetForm('remove');
          }
        }
      }
    });
  }
  
  function db_resetForm(note) {
    if (note == 'remove') {
      is_form = false;
      el('.db_form').classList.add('db_hidden');
      el('.db_form_btn').classList.add('db_hidden');
      el('.db_tr1').classList.remove('db_hidden');
    }
    el('.db_form').innerHTML = '';
    db_info('RESET');
  }
  
  function db_resetMenu() {
    el('.db_menu2 .db_td2').classList.add('db_hidden');
    el('.db_menu2 .db_td2').removeAttribute('data-dbid');
    el('.db_menu_selected span').innerHTML = '';
    el('.db_list span').innerHTML = '';
    if (el('.db_bm_menu [type="radio"]:checked')) el('.db_bm_menu [type="radio"]:checked').checked = false;
  }
  
  function db_formCheck() {
    if (el('.db_host').value == '') {
      alert('web [hostname] is empty');
      return false;
    } else if (!isValidUrl(el('.db_host').value)) {
      alert('web [hostname] not valid');
      return false;
    }
    
    if (mydb_select == 'source') {
      if (el('.db_status').value == '') {
        alert('web [status] is empty');
        return false;
      }
      if (el('.db_language').value == '') {
        alert('web [language] is empty');
        return false;
      }
      if (el('.db_theme').value == '') {
        alert('web [db_theme] is empty or select "none"');
        return false;
      }
    } else {
      if (el('.db_id').value == '') {
        alert('[id] is empty');
        return false;
      }
      if (el('.db_bmdb').value == '') {
        alert(`[${mydb_type} id] is empty or fill with "none"`);
        return false;
      } else {
        /* old: Mangadex
        if (el('.db_bmdb').value != 'none' && el('.db_bmdb').value.indexOf('md|') != -1 && el('.db_image').value != '') {
          alert(`delete cover image, cover image is included in ${mydb_type} id`); //mangadex
          return false;
        }*/
      }
      if (el('.db_title').value == '') {
        alert('[title] is empty');
        return false;
      }
      if (el('.db_number').value == '') {
        var number = mydb_type == 'anime' ? 'episode' : 'chapter';
        alert(`[${number}] is empty`);
        return false;
      }
      if (el('.db_type') && el('.db_type').value == '') {
        alert(`[${mydb_type} type] is empty`);
        return false;
      }
      if (el('.db_url').value == '') {
        alert(`web [${mydb_type} url] is empty`);
        return false;
      } else if (!isValidUrl(el('.db_url').value)) {
        alert(`web [${mydb_type} url] not valid`);
        return false;
      }
      if (el('.db_image').value == '' && el('.db_bmdb').value == 'none') {
        alert('[cover image] is empty');
        return false;
      }
      if (el('.db_image').value != '' && !isValidImage(el('.db_image').value)) {
        alert('[cover image] not valid');
        return false;
      }
      if (el('.db_update').value == '') {
        alert('[last update] is empty');
        return false;
      }
    }
    return true;
  }
  
  function db_formEdit(note, data) {
    is_form = 'edit';
    el('.db_form_btn').classList.remove('db_hidden'); //always above db_formSelect()
    db_formSelect('edit');
    el('.db_form').classList.remove('db_hidden');
    el('.db_form_btn .db_set').classList.add('db_hidden');
    el('.db_form_btn .db_btn_update').classList.remove('db_hidden');
    if (is_search) el('.bmark_db').classList.add('db_s_shide');
    el('.db_tr1').classList.add('db_hidden');
    
    el('.db_host').value = data.host;
    if (mydb_select == 'source') {
      el('.db_host').readOnly = true;
      el('.db_host').setAttribute('data-host', data.host);
      el('.db_domain').value = data.domain.replace(/\s\|\s/g, '\n');
      el('.db_status').value = data.status;
      el('.db_language').value = data.language;
      el('.db_theme').value = data.theme;
      el('.db_project').value = data.project;
      el('.db_icon').value = data.icon;
      if (data.tag != '') {
        if (data.tag.indexOf(',') != -1) {
          var tdata = data.tag.replace(/\s+/g, '').split(',');
          for (var i = 0; i < tdata.length; i++) {
            el('.db_tag input[value="'+ tdata[i] +'"]').checked = true;
          }
        } else {
          el('.db_tag input[value="'+ data.tag +'"]').checked = true;
        }
      }
    } else {
      ch_before = is_search ? false : data.number;
      if (is_mobile) el('.db_host_select').classList.remove('db_hidden');
      el('.db_id').value = data.id;
      el('.db_id').readOnly = true;
      el('.db_id').setAttribute('data-id', data.id);
      el('.db_bmdb').value = data.bmdb;
      el('.db_title').value = data.title;
      el('.db_alternative').value = data.alternative.replace(/\s\|\s/g, '\n');
      el('.db_number').value = data.number;
      el('.db_number_select').classList.remove('db_hidden');
      el('.db_number_before').setAttribute('data-number', data.number);
      el('.db_number_before').classList.remove('db_hidden');
      el('.db_note').value = data.note;
      if ('type' in data && el('.db_type')) {
        el('.db_type option[value="'+ data.type +'"]').selected = true;
        el('.db_type').setAttribute('data-type', data.type);
        el('.db_type_manual').classList.remove('db_hidden');
      }
      el('.db_url').value = data.url;
      if (is_mobile) el('.db_url_select').classList.remove('db_hidden');
      if ('read' in data && el('.db_read')) el('.db_read').value = data.read;
      el('.db_image').value = data.image;
      el('.db_update').valueAsDate = local_date;
      el('.db_similar').value = data.similar.replace(/,\s/g, '\n');
      
      if (data.image != '') {
        el('.db_cover img').src = data.image;
        el('.db_cover').classList.remove('db_hidden');
        el('.db_image_open').classList.remove('db_hidden');
      }
      el('.db_bmdb_paste').classList.remove('db_hidden');
      var db_md_chk = mydb_type == 'comic' && data.bmdb.indexOf('md|') != -1; //temporary until all mangadex id replaced with mangaupdates id
      if (data.bmdb == 'none' || db_md_chk) {
        el('.db_bmdb').dataset.val = data.id.replace(/\-/g, ' ');
        if (mydb_type == 'comic') {
          el('.db_bmdb_mangadex').classList.remove('db_hidden');
          el('.db_bmdb_mangaupdates').classList.remove('db_hidden');
        } else if (mydb_type == 'novel') {
          el('.db_bmdb_mangaupdates').classList.remove('db_hidden');
        } else {
          el('.db_bmdb_myanimelist').classList.remove('db_hidden');
          el('.db_bmdb_anilist').classList.remove('db_hidden');
          el('.db_bmdb_anidb').classList.remove('db_hidden');
        }
      }
      if (data.bmdb != '' && data.bmdb != 'none') el('.db_bmdb_open').classList.remove('db_hidden');
      el('.db_number').select();
      el('.db_url_open').classList.remove('db_hidden');
      el('.db_update_before').setAttribute('data-date', data.update);
      el('.db_update_before').classList.remove('db_hidden');
      el('.db_fVanced').classList.remove('db_hidden');
    }
  }
  
  function db_formGen() {
    el('.db_host').value = wh.replace(wh_rgx, '');
    
    if (mydb_select == 'list') {
      if (el('.db_type')) el('.db_type_manual').classList.remove('db_hidden');
      if (is_mobile) el('.db_host_select').classList.remove('db_hidden');
      el('.db_update').valueAsDate = local_date;
      if (!is_fVanced) el('.db_fVanced').click();
      
      //if (wp.search(/^\/((m|id|en)\/?)?$/) == -1 && wl.href.search(/[\/\?&](s(earch)?|page)[\/=\?]/) == -1) { //temporary
      if (wp != '/' && wp.search(skip1_rgx) == -1 && wp.search(skip2_rgx) == -1) {
        var bmark_id = getId('bookmark').url; //from wl.pathname
        if (is_form == 'new') el('.db_id').value = bmark_id;
        el('.db_bmdb').dataset.val = bmark_id.replace(/[-_\.]/g, ' ');
        if (wp.search(/\/(title|anime|novel|series)\/\d+\//) != -1) el('.db_bmdb').value = wp.match(/\/(title|anime|novel|series)\/([^\/]+)/)[1];
        if (is_form == 'new') el('.db_title').value = wh.indexOf('mangacanblog') != -1 ? firstCase(bmark_id, '_') : firstCase(bmark_id, '-');
        if (is_mobile) el('.db_title_select').classList.remove('db_hidden');
        el('.db_url').value = '//'+ wh.replace(wh_rgx, '') + wp + (wh.indexOf('webtoons') != -1 ? wl.search : '');
        if (is_mobile) el('.db_url_select').classList.remove('db_hidden');
      }
      
      if (el('.db_bmdb').value == '' || el('.db_bmdb').value == 'none') {
        el('.db_bmdb').parentElement.className = el('.db_bmdb').parentElement.className.replace(/flex\s/, '_db db_next flex_wrap f_right ');
        el('.db_bmdb_paste').classList.remove('db_hidden');
        el('.db_bmdb_none').classList.remove('db_hidden');
        el('.db_number_default').classList.remove('db_hidden');
        if (mydb_type == 'comic') {
          el('.db_bmdb_mangadex').classList.remove('db_hidden');
          el('.db_bmdb_mangaupdates').classList.remove('db_hidden');
        } else if (mydb_type == 'novel') {
          el('.db_bmdb_mangaupdates').classList.remove('db_hidden');
        } else {
          el('.db_bmdb_myanimelist').classList.remove('db_hidden');
          el('.db_bmdb_anilist').classList.remove('db_hidden');
          el('.db_bmdb_anidb').classList.remove('db_hidden');
        }
      }
      
      // if bookmark id is "none", then it must be filled
      var gen_cover = el('.seriestucontent img') || el('.animefull .bigcontent img') || el('.komikinfo .bigcontent img') || el('.profile-manga .summary_image img') || el('.series .series-thumb img') || el('#Informasi .ims img') || el('.komik_info-content-thumbnail img') || el('.info-left img') || el('meta[property="og:image"]') || false;
      if (gen_cover && is_form == 'new') {
        var cover_tag = gen_cover.tagName == 'IMG' ? gen_cover.src : el('meta[property="og:image"]').getAttribute('content');
        el('.db_image').value = cover_tag.replace(/i\d+\.wp\.com\//, '');
      }
      
      /* old: Mangadex image format, temporary
      - https://mangadex.org/images/manga/58050.jpg
      - https://mangadex.org/images/manga/58050.large.jpg
      */
    }
  }
  
  function db_formNew(note, name, data, parent) {
    var f_txt = '';
    var f_att = '';
    name = name.replace(/^\d+_/, '');
    var f_val = 'value' in data ? data['value'] : name;
    if (f_val == 'paste') f_val = '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 512 512"><path fill="currentColor" d="m502.6 198.6l-61.25-61.25A31.901 31.901 0 0 0 418.8 128H256c-35.3 0-64.9 28.7-64 64l.006 255.1C192 483.3 220.7 512 256 512h192c35.2 0 64-28.8 64-64l.01-226.7c-.01-8.5-3.41-16.7-9.41-22.7zM464 448c0 8.836-7.164 16-16 16H256c-8.838 0-16-7.164-16-16V192.1c0-8.836 7.164-16 16-16h128V224c0 17.67 14.33 32 32 32h48.01v192zM317.7 96c-7.1-27.55-31.9-48-61.7-48h-40.8C211.3 20.93 188.1 0 160 0s-51.3 20.93-55.2 48H64C28.65 48 0 76.65 0 112v272c0 35.34 28.65 64 64 64h96v-48H64c-8.836 0-16-7.164-16-16V112c0-8.8 7.18-16 16-16h16v16c0 17.67 14.33 32 32 32h61.35C190 115.4 220.6 96 256 96h61.7zM160 72c-8.822 0-16-7.176-16-16s7.178-16 16-16s16 7.176 16 16s-7.2 16-16 16z"/></svg>';
    
    var f_cls = parent ? (parent +'_'+ name) : name;
    if ('class' in data) {
      var c_list = data['class'].split(',');
      for (var i = 0; i < c_list.length; i++) {
        if (c_list[i].search(/^_/) != -1) {
          f_cls += ' db_'+ (parent || name) +'_'+ c_list[i].replace(/^_/, '');
        } else {
          f_cls += ' '+ c_list[i];
        }
      }
      if (note == 'edit' && data['class'].indexOf('fVanced') != -1 && !('next' in data)) f_cls += ' db_hidden';
    }
    
    if ('attribute' in data) {
      for (var att in data['attribute']) {
        f_att += ' '+ att +'="'+ data['attribute'][att] +'"';
      }
    }
    
    switch (data['type']) {
      case 'select':
        f_txt += '<select class="_db db_100 db_'+ f_cls +'"'+ f_att +' required><option value="" selected disabled hidden>'+ name +'</option>';
        var odata = data['option'].split(',');
        for (var j = 0; j < odata.length; j++) {
          f_txt += '<option value="' + odata[j] + '">' + odata[j] + '</option>';
        }
        f_txt += '</select>';
        break;
      case 'button':
        f_txt += '<button class="_db db_selected'+ (parent ? ' db_hidden' : '') +' db_'+ f_cls +'"'+ f_att +'>'+ f_val +'</button>';
        break;
      case 'radio':
        if ('option' in data) {
          var rdata = data['option'].split(',');
          for (var j = 0; j < rdata.length; j++) {
            f_txt += '<label><input name="'+ name +'" type="radio" value="'+ rdata[j] +'"/><span>'+ rdata[j] +'</span></label>';
          }
          f_txt = '<div class="db_radio _db db_100 db_'+ f_cls +'"'+ f_att +'>'+ f_txt +'</div>';
        } else {
          f_txt += '<label class="_db db_100 db_'+ f_cls +'"'+ f_att +'><input name="'+ name +'" type="radio" value="'+ f_val +'"/><span>'+ f_val +'</span></label>';
        }
        break;
      case 'checkbox':
        if ('option' in data) {
          var cdata = data['option'].split(',');
          for (var j = 0; j < cdata.length; j++) {
            f_txt += '<label><input type="checkbox" value="'+ cdata[j] +'"/><span>'+ cdata[j] +'</span></label>';
          }
          f_txt = '<div class="db_cbox _db db_100 db_'+ f_cls +'"'+ f_att +'>'+ f_txt +'</div>';
        } else {
          f_txt += '<label class="_db db_100 db_'+ f_cls +'"'+ f_att +'><input type="checkbox" value="'+ f_val +'"/><span>'+ f_val +'</span></label>';
        }
        break;
      case 'date':
        f_txt += '<input class="_db db_100 db_'+ f_cls +'" type="date" title="'+ f_val +'"'+ f_att +'/>';
        break;
      case 'text':
        f_txt += '<span class="db_text db_'+ f_cls +'"'+ f_att +'>'+ name +'</span>';
        break;
      case 'textarea':
        f_txt += '<textarea class="_db db_100 db_'+ f_cls +'" placeholder="'+ f_val +'"'+ f_att +'></textarea>';
        break;
      default:
        f_txt += '<input class="_db db_100 db_'+ f_cls +'" type="text" placeholder="'+ f_val +'"'+ f_att +'/>';
        break;
    }
    
    if ('next' in data) {
      for (var name2 in data['next']) {
        if (name2.search(/^par_/i) == -1) f_txt += db_formNew(note, name2, data['next'][name2], name);
      }
      
      var f_par_cls = 'par_class' in data['next'] ? (' '+ data['next']['par_class']) : '';
      var f_par_vncd = note == 'edit' && f_par_cls.indexOf('fVanced') != -1 ? (f_par_cls +' db_hidden') : '';
      f_txt = '<div class="flex db_100'+ f_par_cls + f_par_vncd +'">'+ f_txt +'</div>';
    }
    
    return f_txt;
  }
  
  function db_formSelect(note) {
    var f_txt = '';
    var data = db_settings[mydb_type];
    is_fVanced = false;
    
    if (is_form == 'edit' && mydb_select.indexOf('project') == -1) f_txt += '<div class="db_cover db_100 t_center db_hidden"><img src=""></div>';
    f_txt += '<div class="db_text db_100" title="breadcrumb">&#10095;&#10095;&#160;&#160;&#160;<b>'+ mydb_type +'</b>&#160;&#160;>&#160;&#160;<b>'+ mydb_select +'</b>&#160;&#160;>&#160;&#160;<span class="db_border"><b>'+ is_form +'</b></span></div>';
    for (var name in data[mydb_select]) {
      f_txt += db_formNew(note, name, data[mydb_select][name]);
    }
    f_txt += '<button class="db_fVanced _db db_100 db_active db_no_hover db_hidden">&#8659;&#160;&#160;Advanced&#160;&#160;&#8659;</button>';
    el('.db_form').innerHTML = '<div class="f_grow"></div><div class="flex_wrap">'+ f_txt +'</div>';
    el('.db_form').style.cssText = 'flex-direction:column;overflow-y:auto;height:calc(100vh - '+ (el('.db_form_btn').offsetHeight + 31) +'px);';
    
    if (mydb_select == 'list') {
      el('.db_paste_generate').classList.remove('db_hidden');
      el('.db_paste_close').classList.remove('db_hidden');
      
      el('.db_id').onkeyup = function() {
        el('.db_bmdb').dataset.val = el('.db_id').value.replace(/[-_\.]/g, ' ');
      };
      
      el('.db_bmdb_paste').onclick = function() {
        var ps_form = el('.db_paste_form');
        if (ps_form.classList.contains('db_hidden')) {
          ps_form.classList.remove('db_hidden');
          ps_form.style.cssText = 'position:fixed;left:0;right:0;z-index:2147483647;'+ (is_mobile ? 'justify-content:end;bottom' : 'top') +':0;background:#252428;border-'+ (is_mobile ? 'top' : 'bottom') +':2px solid #757575;';
          el('button', ps_form).style.cssText = is_mobile ? 'order:1;' : '';
          el('textarea', ps_form).style.cssText = is_mobile ? 'order:2;' : '';
          el('textarea', ps_form).focus();
        } else {
          ps_form.classList.add('db_hidden');
        }
        this.classList.toggle('db_danger');
      };
      
      el('.db_paste_generate').onclick = function() {
        var ps_txt = el('.db_paste_form textarea');
        if (ps_txt.value == '') return;
        
        ps_obj = JSON.parse(ps_txt.value);
        el('.db_bmdb').value = ps_obj.id;
        if ('type' in ps_obj && el('.db_type')) {
          if (ps_obj.type.search(/man(ga|h[wu]a)/i) != -1) el('.db_type').value = ps_obj.type;
          if (el('.db_type').dataset.type) el('.db_type').value = el('.db_type').dataset.type;
        }
        if ('img' in ps_obj) el('.db_image').value = ps_obj.img;
        
        ps_txt.value = '';
        el('.db_bmdb_paste').classList.remove('db_danger');
        el('.db_paste_form').classList.add('db_hidden');
        if (!is_mobile) el('.db_number').focus();
      };
      
      el('.db_paste_close').onclick = function() {
        el('.db_bmdb_paste').classList.remove('db_danger')
        el('.db_paste_form').classList.add('db_hidden');
      };
      
      el('.db_bmdb_source', 'all').forEach(function(item) {
        item.addEventListener('click', function() {
          if (el('.db_id').value == '') {
            alert('[id] is empty');
          } else {
            openInNewTab(this.dataset.href + el('.db_bmdb').dataset.val);
          }
        });
      });
      
      el('.db_bmdb_open').onclick = function() {
        var op_url, op_id = el('.db_bmdb').value;
        if (mydb_type == 'comic') {
          op_url = op_id.search(/mu\d?\|/) != -1 ? 'mangaupdates.com/series.html?id=' : 'mangadex.org/title/';
        } else if (mydb_type == 'novel') {
          op_url = 'mangaupdates.com/series.html?id=';
        } else {
          op_url = op_id.indexOf('mal|') != -1 ? 'myanimelist.net/anime/' : op_id.indexOf('al|') != -1 ? 'anilist.co/anime/' : 'anidb.net/anime/';
        }
        op_url = op_url + op_id.replace(/^(m(d\d?|u\d?|al)|a(nl|db))\|/, ''); //temporary = \d?
        openInNewTab('//'+ op_url);
      };
      
      if (el('.db_type')) {
        el('.db_type_manual').onclick = function() {
          var tm_str = '';
          var tm_elm = el('.db_type').options;
          for (var i = 0; i < tm_elm.length; i++) {
            if (tm_elm[i].value != '') {
              tm_str += '"'+ tm_elm[i].value +'"';
              if (i < tm_elm.length-1) tm_str += ', ';
            }
          }
          var tm_val = prompt('fill with '+ tm_str +'\n(case sensitive & without double quotes)', '');
          if (tm_val != null && tm_val != '') {
            el('.db_type option[value="'+ tm_val.toLowerCase() +'"]').selected = true;
          }
        }
      }
      
      el('.db_fVanced').onclick = function() {
        el('.db_form .fVanced', 'all').forEach(function(item) {
          if (is_fVanced) {
            item.classList.add('db_hidden');
          } else {
            item.classList.remove('db_hidden');
          }
        });
        this.classList.toggle('db_danger');
        is_fVanced = this.classList.contains('db_danger') ? true : false;
        this.innerHTML = is_fVanced ? '&#8657;&#160;&#160;Advanced&#160;&#160;&#8657;' : '&#8659;&#160;&#160;Advanced&#160;&#160;&#8659;';
      };
    }
  }
  
  function db_index_nav_html() {
    var n_txt = '';
    var n_num = parseInt(nav_max / 2);
    var n_start = nav_current - n_num;
    var n_end = nav_current + n_num;
    
    if (nav_current < (nav_max+2)) {
      n_start = 1;
      n_end = (nav_max+2);
    }
    
    if (nav_current > (nav_total - (nav_max+2))) {
      n_start = nav_total - (nav_max+1);
      n_end = nav_total;
    }
    
    if (n_start < 1) n_start = 1;
    
    n_txt += '<ul class="flex">';
    
    // "prev" button
    n_txt += '<li';
    if (nav_current != 1) n_txt += ' data-page="'+ (nav_current-1) +'"';
    n_txt += '><div class="_db db_iprev '+ (nav_current == 1 ? 'db_disabled' : 'db_inav') +'">&#10094;</div></li>';
    
    // add '...'
    if (n_start > 1) {
      n_txt += '<li data-page="1"><div class="_db db_inav">1</div></li>';
      n_txt += '<li><div class="_db">...</div></li>';
    }
    
    for (var i = n_start; i <= n_end; i++) {
      n_txt += '<li';
      if (nav_current != i) n_txt += '  data-page="'+ i +'"';
      n_txt += '><div class="_db '+ (nav_current == i ? 'db_selected' : 'db_inav') +'">'+ i +'</div></li>';
    }
    
    // add '...'
    if (n_end < nav_total) {
      n_txt += '<li><div class="_db">...</div></li>';
      n_txt += '<li data-page="'+ nav_total +'"><div class="_db db_inav">'+ nav_total +'</div></li>';
    }
    
    // "next" button
    n_txt += '<li';
    if (nav_current != nav_total) n_txt += ' data-page="'+ (nav_current+1) +'"';
    n_txt += '><div class="_db db_inext '+ (nav_current == nav_total ? 'db_disabled' : 'db_inav') +'">&#10095;</div></li>';
    
    n_txt += '</ul>';
    n_txt += '<div class="db_count db_text">Page '+ nav_current +' of '+ nav_total +'</div>';
    
    nav_elem.innerHTML = n_txt;
    
    el('.db_inav', 'all').forEach(function(item) {
      item.addEventListener('click', function() {
        nav_current = Number(this.parentElement.dataset.page);
        db_indexChange(nav_current);
      });
    });
  }
  
  function db_index_catalog_html(data, index, note) {
    if (data.length == 0) {
      el('.db_icatalog').innerHTML = 'Not Found !!';
      return;
    }
    
    var i_txt = '';
    i_txt += '<ul class="flex_wrap">';
    for (var i = (index-1) * index_max; i < (index * index_max) && i < data.length; i++) {
      if (mydb_select == 'list') {
        i_txt += '<li class="db_ipost flex">';
        i_txt += '<div class="db_icover"><a href="'+ data[i].url +'" target="_blank" title="'+ data[i].title +'"><img class="db_image_bg db_100" src="'+ data[i].image +'"/></a></div>';
        i_txt += '<div class="db_idetail db_100">';
        i_txt += '<div class="db_ititle line_clamp"><a href="'+ data[i].url +'" target="_blank" title="'+ data[i].title +'">'+ data[i].title +'</a></div>';
        if ('type' in data[i]) i_txt += '<div class="db_itype">Type: <span class="db_text">'+ data[i].type +'</span></div>';
        i_txt += '<div class="db_inumber">Latest: <span class="db_text">'+ data[i].number +'</span></div>';
        i_txt += '<div class="db_iupdate">Update: <span class="db_text">'+ dateFormat(data[i].update) +'</span></div>';
        i_txt += '<div class="db_ibtn flex" data-id="'+ data[i].id +'">';
        if ('read' in data[i] && data[i].read != '') i_txt += '<div class="db_iread _db">Read</div>';
        i_txt += '<span class="db_iedit _db" data-id="list">Edit</span>';
        i_txt += '<span class="db_idelete _db">X</span>';
        i_txt += '</div>'; //.db_ibtn
        i_txt += '</div>'; //.db_idetail
      } else {
        i_txt += '<li class="db_ipost flex_wrap">';
        i_txt += '<div class="flex f_middle db_100">';
        i_txt += '<div class="db_icon"><img src="'+ data[i].icon +'"/></div>';
        var i_host = data[i].domain;
        i_host = i_host != '' ? i_host : data[i].host;
        if (i_host.indexOf('|') != -1) {
          i_host = i_host.replace(/\s+/g, '').split('|');
          i_host = i_host[i_host.length-1];
        }
        i_txt += '<div class="db_ihost"><a href="//'+ i_host +'" target="_blank">'+ i_host + (data[i].language != 'id' ? ('&#160;&#160;&#40;'+ data[i].language +'&#41;') : '') +'</a></div>';
        i_txt += '</div>';
        i_txt += '<div class="db_idetail db_100">';
        i_txt += '<div class="db_istatus">Status: <span class="db_text">'+ data[i].status +'</span></div>';
        if (data[i].theme != '' && data[i].theme != 'none') i_txt += '<div class="db_itheme">Theme: <span class="db_text">'+ data[i].theme +'</span></div>';
        if (data[i].tag != '') i_txt += '<div class="db_itag">Tag: <span class="db_text">'+ data[i].tag +'</span></div>';
        i_txt += '<div class="db_ibtn flex" data-id="'+ data[i].host.replace(/\./g, '-') +'">';
        if (data[i].project != '') i_txt += '<span class="db_iproject _db"><a href="'+ data[i].project +'" target="_blank">Project</a></span>';
        i_txt += '<span class="db_iedit _db" data-id="source">Edit</span>';
        i_txt += '<span class="db_idelete _db">X</span>';
        i_txt += '</div>'; //.db_ibtn
        i_txt += '</div>'; //.db_idetail
      }
      i_txt += '</li>'; //.db_ipost
    }
    i_txt += '</ul>';
    el('.db_icatalog').innerHTML = i_txt;
    el('.db_icatalog').scrollTop = 0;
    
    el('.db_icatalog .db_iedit', 'all').forEach(function(item) {
      item.addEventListener('click', function() {
        mydb_select = item.dataset.id;
        el('.bm_index').classList.add('db_hidden');
        db_formEdit(mydb_type, index_data[item.parentElement.dataset.id]);
      });
    });
    
    el('.db_icatalog .db_idelete', 'all').forEach(function(item) {
      item.addEventListener('click', function() {
        var id = item.parentElement.dataset.id;
        if (confirm('Are you sure you want to delete >> '+ id +' << ?\nYou can\'t undo this action.')) {
          db_deleteData(db_pathId(true, id));
        }
      });
    });
  }
  
  function db_indexChange(index) {
    nav_total = Math.ceil(index_arr.length / index_max);
    
    if (index < 1) index = 1;
    if (index > nav_total) index = nav_total;
    
    db_index_catalog_html(index_arr, index, 'grid');
    db_index_nav_html();
  }
  
  function db_indexData(note, param) {
    firebase.app(fbase_app).database().ref(db_pathId()).once('value').then(function(snapshot) {
      index_data = snapshot.val();
      index_arr = genArray(snapshot.val());
      
      if (note != 'start') {
        db_info('Done');
        db_resetForm('remove');
      }
      
      // sorting data
      nav_current = note.search(/(start|search)/) != -1 ? 1 : nav_current;
      index_sort = note.search(/(start|search)/) != -1 ? (mydb_select == 'source' ? 'status' : 'title') : index_sort;
      index_order = index_sort == 'update' ? false : true;
      sortBy(index_arr, index_sort, index_order);
      
      // index search
      if (is_isearch) {
        var query = note != 'start' && is_isearch ? el('.db_isearch input').value : param; //if data updated and "is_isearch = true" then show search
        index_arr = db_searchFilter('index', index_arr, query);
        el('.db_imenu').classList.remove('db_hidden');
      }
      
      db_indexChange(nav_current); //generate catalog & pagination
      el('.db_imenu .db_inote').innerHTML = is_isearch ? ('Search Result <span class="_db db_active"><b>'+ index_arr.length +'</b></span>') : 
      ((mydb_select == 'source' ? 'Source' : 'All') +' '+ mydb_type +' ('+ index_arr.length +')');
      if (mydb_select == 'source') {
        el('.db_inote').classList.add('db_100', 't_center');
        el('.db_ifilter').classList.add('db_hidden');
      } else {
        el('.db_ifilter input[value="'+ index_sort +'"]').checked = true;
      }
      el('.db_idata').classList.remove('db_hidden');
      el('.db_iloading').classList.add('db_hidden');
      el('.db_icatalog').scrollTop = 0; //first
    });
  }
  
  function db_indexHtml() {
    var b_txt = '';
    // css
    b_txt += '<style>.bm_index{position:fixed;top:0;bottom:0;left:0;right:0;padding:25px;}.db_idata,.db_iloading{position:relative;}.db_idata{background:#17151b;padding:10px;}.db_idata .db_ihelp_note{padding:8px 10px 10px;cursor:default;}.db_imenu{margin-top:10px;}.db_icatalog{max-height:calc(100vh - 230px);overflow-y:auto;margin:15px 0;}.db_icatalog .db_ipost{padding:10px;}.db_icatalog.db_ilist .db_ipost{width:33.3%;}.db_icatalog.db_isource .db_ipost{width:25%;}.db_ipost .db_icover{width:25%;margin-right:10px;}.db_icover a{height:100%;}.db_iclose{position:fixed;bottom:0;left:0;}.db_image_bg{position:relative;height:115px;}.db_image_bg:before{content:\x27\x27;position:absolute;top:0;left:0;width:100%;height:100%;text-indent:-9999px;background:#252428;}.db_image_bg:after{content:\x27no image\x27;position:absolute;top:0;left:0;color:#ddd;font-size:14px;}.db_pagination .db_count{margin-left:20px;}.db_icon img{height:30px;width:30px;margin-right:10px;padding:5px;background:#ddd;}</style>';
    // mobile
    b_txt += '<style>.bm_index.db_mobile{padding:0;}.db_mobile .db_icatalog{max-height:calc(100vh - 210px);}.db_mobile .db_icatalog .db_ipost{width:100%;}.db_mobile .db_ipost .db_icover{width:30%;}.db_mobile .db_ifilter .db_text,.db_mobile .db_pagination .db_count{display:none;}</style>';
    // html
    b_txt += '<div class="db_ibg"></div>';
    b_txt += '<div class="db_idata flex_wrap db_hidden">';
    b_txt += '<div class="db_isearch flex_wrap db_100">';
    b_txt += '<div class="flex db_100"><input class="_db db_100" type="search" placeholder="Search ('+ mydb_type +')..." readonly onfocus="this.removeAttribute(\'readonly\')"><span class="db_ihelp _db" title="How to use Advanced Search">?</span><button class="_db">Search</button></div>';
    b_txt += '<div class="db_ihelp_note _db db_100 db_hidden">';
    b_txt += '<b>How to use Advanced Search:</b><br/>In the search box, enter one of the Search operators below.';
    b_txt += '<br/><br/><b>Search operators (source):</b><br/>host, domain, status, language, theme, tag';
    b_txt += '<br/><br/><b>Search operators (list)</b><br/>id, bmdb, title, alternative, number, note, type, host';
    b_txt += '<br/><br/><b>Examples:</b><br/>1. Search by host<br/>&#160;&#160;»&#160;host::mangaku<br/>2. Search for multiple operator with "@"<br/>&#160;&#160;»&#160;language::id@status::discontinued<br/>&#160;&#160;»&#160;title::level@type::manhwa@bmdb::none';
    b_txt += '</div>';// .db_ihelp_note
    b_txt += '</div>';// .db_isearch
    b_txt += '<div class="db_imenu flex db_100">';
    b_txt += '<span class="db_inote db_text"></span><span class="f_grow"></span>';
    b_txt += '<div class="db_ifilter db_btn_radio flex"><span class="db_text">Sort by: </span><input type="radio" id="az" name="sort" value="title" checked><label class="_db" for="az">A-Z</label><input type="radio" id="latest" name="sort" value="update"><label class="_db" for="latest">Latest</label></div>';
    b_txt += '</div>';// .db_imenu
    b_txt += '<div class="db_icatalog db_100 db_i'+ mydb_select +'"></div>';
    b_txt += '<div class="db_pagination flex f_center f_middle db_100"></div>';
    b_txt += '</div>';// .db_idata
    b_txt += '<div class="db_iloading db_100 flex f_center f_middle" style="height:100%;"><span class="_db">Loading..</span></div>';
    b_txt += '<div class="db_iclose flex f_center db_100"><span class="_db db_danger">close</span></div>';
    
    var b_html = document.createElement('div');
    b_html.style.cssText = 'z-index:2147483645;'; //2147483647
    b_html.className = '_bmark bm_index cbr_mod' + (is_mobile ? ' db_mobile' : '');
    b_html.innerHTML = b_txt;
    document.body.appendChild(b_html);
  }
  
  function db_startIndex(note) {
    if (el('.bm_index')) {
      el('.db_isearch input').setAttribute('placeholder', 'Search ('+ mydb_type +')...');
      el('.db_inote').classList.remove('db_100', 't_center');
      if (mydb_select == 'list') el('.db_ifilter').classList.remove('db_hidden');
      el('.db_icatalog').className = 'db_icatalog db_100 db_i'+ mydb_select;
      el('.db_idata').classList.add('db_hidden');
      el('.db_iloading').classList.remove('db_hidden');
      el('.bm_index').classList.remove('db_hidden');
    } else {
      db_indexHtml();
      nav_elem = el('.db_pagination');
      
      el('.db_iclose').onclick = function() {
        is_isearch = false;
        is_index = false;
        el('.db_isearch input').value = '';
        el('.bm_index').classList.add('db_hidden');
      };
      
      el('.db_ibg').onclick = function() {
        el('.db_iclose').click();
      };
      
      el('.db_isearch .db_ihelp').onclick = function() {
        this.classList.toggle('db_danger');
        el('.db_ihelp_note').classList.toggle('db_hidden');
      };
      
      el('.db_isearch button').onclick = function() {
        el('.db_isearch .db_ihelp').classList.remove('db_danger');
        el('.db_ihelp_note').classList.add('db_hidden');
        if (el('.db_isearch input').value == '') return;
        is_isearch = true;
        document.activeElement.blur();
        el('.db_imenu').classList.add('db_hidden');
        el('.db_icatalog').innerHTML = '<div class="db_100 t_center">Loading..</div>';
        el('.db_pagination').innerHTML = '';
        db_indexData('search', el('.db_isearch input').value);
      };
      
      el('.db_ifilter input', 'all').forEach(function(item) {
        item.addEventListener('click', function() {
          index_sort = this.value;
          if (index_sort == 'update') {
            sortBy(index_arr, index_sort);
          } else {
            sortBy(index_arr, index_sort, true);
          }
          nav_current = 1;
          db_indexChange(nav_current);
        });
      });
      
      el('.db_iclose').onclick = function() {
        is_isearch = false;
        is_index = false;
        el('.db_isearch input').value = '';
        el('.db_isearch .db_ihelp').classList.remove('db_danger');
        el('.db_ihelp_note').classList.add('db_hidden');
        el('.bm_index').classList.add('db_hidden');
      };
    }
    
    // Start Index
    db_indexData(note);
  }
  
  function db_searchResult(arr) {
    var s_txt = '<div class="bs_list" style="margin-bottom:10px;"><ul>';
    if (arr.length != 0) {
      for (var i = 0; i < arr.length; i++) {
        s_txt += '<li class="_bs';
        if (i+1 < arr.length) s_txt += ' db_line';
        if ('read' in arr[i] && arr[i].read != '') s_txt += ' db_url_read';
        s_txt += ' flex_wrap">';
        s_txt += '<div class="_db db_100" onclick="openInNewTab(\''+ arr[i].url +'\', \'bs_list\')" title="'+ arr[i].url +'">'+ arr[i].title;
        if (arr[i].alternative != '') s_txt += ' | '+ arr[i].alternative;
        s_txt += '</div>';
        s_txt += '<div class="flex db_100" data-id="'+ arr[i].id +'">';
        s_txt += '<span class="bs_ch _db db_100 line_text">'+ arr[i].number + (arr[i].note ? ' ('+ arr[i].note +')' : '') +'</span>';
        if ('read' in arr[i] && arr[i].read != '') s_txt += '<button class="_db db_selected" onclick="openInNewTab(\''+ arr[i].read +'\', \'bs_list\')" title="'+ arr[i].read +'">Read</button>';
        s_txt += '<button class="bs_edit _db" data-id="list">Edit</button>';
        s_txt += '<button class="bs_delete _db" title="Delete">X</button>';
        s_txt += '<span class="bs_num _db db_selected">'+ (i+1) +'</span>';
        s_txt += '</div>';
        s_txt += '</li>';
      }
    } else {
      s_txt += '<li>Oops! '+ mydb_type +' data, not found</li>';
    }
    s_txt += '</ul></div>';
    s_txt += '<div class="bs_text flex"><span class="db_text">Search Result <span class="_db db_active"><b>'+ arr.length +'</b></span></span><span class="f_grow"></span><button class="bs_close _db">Close</button></div>';
    
    el('.db_result').innerHTML = s_txt;
    el('.db_result').classList.remove('db_hidden');
    el('.bmark_db').classList.remove('db_s_shide');
    el('.db_result .bs_list').style.height = 'calc(100vh - '+ (el('.db_tr1').offsetHeight + el('.bs_text').offsetHeight + 60) +'px)';
      
    el('.bs_close').onclick = function() {
      is_search = false;
      el('.db_result').classList.add('db_hidden');
      //el('.db_search input').value = '';
      el('.bmark_db').classList.add('db_s_shide');
    };
    
    el('.bs_edit', 'all').forEach(function(item) {
      item.addEventListener('click', function() {
        mydb_select = item.dataset.id;
        db_formEdit('search', main_data.list[item.parentElement.dataset.id]);
      });
    });
    
    el('.bs_delete', 'all').forEach(function(item) {
      item.addEventListener('click', function() {
        var id = item.parentElement.dataset.id;
        if (confirm('Are you sure you want to delete >> '+ id +' << ?\nYou can\'t undo this action.')) {
          db_deleteData(db_pathId(true, id));
        }
      });
    });
  }
  
  function db_searchFilter(note, arr, query) {
    var s_data, s_arr, s_rgx;
    is_sVanced = query.search(/\w+\:\:/) != -1 ? true : false;
    
    if (is_sVanced) {
      s_arr = {};
      var s_filter = query.split('@');
      for (var i = 0; i < s_filter.length; i++) {
        var s_operator = s_filter[i].split('::');
        s_arr[s_operator[0].toLowerCase()] = s_operator[1];
      }
      // Filter array multiple conditions https://stackoverflow.com/a/31831801/7598333
      s_data = arr.filter(function(item) {
        for (var key in s_arr) {
          s_rgx = new RegExp(escapeRegex(s_arr[key]), 'ig');
          if (item[key] === undefined || item[key].search(s_rgx) == -1) return false;
        }
        return true;
      });
    } else {
      s_rgx = new RegExp(escapeRegex(query), 'ig');
      s_arr = mydb_select == 'list' || note == 'main' ? ['id','bmdb','title','alternative','number','note','type','host'] : ['host','domain','status','language','theme','tag'];
      s_data = arr.filter(function(item) {
        for (var i = 0; i < s_arr.length; i++) {
          if (s_arr[i] == 'type' && !item['type']) continue; //list
          if (item[s_arr[i]].search(s_rgx) != -1) return true;
        }
      });
    }
    return s_data;
  }
  
  function db_supportCheck(data, name, value) {
    var source = mydb_source[mydb_type];
    for (var site in source) {
      if (source[site]['host'].indexOf(data) != -1 || source[site]['domain'].indexOf(data) != -1) {
        return source[site][name].indexOf(value) != -1;
      }
    }
    return false;
  }
  
  function db_showHtml(data, note) {
    var not_support = db_supportCheck(data.host, 'status', 'discontinued') || db_supportCheck(data.host, 'tag', 'not_support');
    var chk = not_support || wh.indexOf(data.host) != -1 || !mydb_settings.read_project;
    var s_txt = '';
    s_txt += '<li class="_bm '+ (note.indexOf('similar') != -1 ? 'db_line_top' : 'bm_main');
    if ('read' in data && data.read != '') s_txt += ' db_url_read';
    s_txt += ' flex_wrap">';
    // bug: if title is project and contains "episode" or "chapter"
    s_txt += '<div class="_db db_100"'+ ((wh.indexOf(data.host) == -1 || data.url.indexOf(wp) == -1 || note.indexOf('similar') != -1) && el('title').innerHTML.search(number_t_rgx) == -1 ? ' onclick="openInNewTab(\''+ data.url +'\', \'bm_list\')"' : '') +' title="'+ data.url +'">';
    if (note != 'similar_one') {
      s_txt += data.title;
      if (data.alternative != '') s_txt += ' | '+ data.alternative;
    } else {
      s_txt += firstCase(data.id, '-');
    }
    s_txt += '</div>';
    s_txt += '<div class="db_100 '+ ((not_support && note != 'similar_one') || !mydb_settings.read_project ? 'flex_wrap' : 'flex') +'" data-id="'+ data.id +'">';
    if (note != 'similar_one') {
      s_txt += '<span class="bm_ch _db line_text'+ (chk ? ' f_grow' : ' db_50') +'">'+ (ch_before && ch_before != data.number ? (ch_before +' <span style="font-size:120%;line-height:0;">&#10142;</span> ') : '') + data.number + (data.note ? ' ('+ data.note +')' : '') +'</span>';
      if ('read' in data && data.read != '') s_txt += '<button class="_db db_selected'+ (chk ? '' : ' db_hidden') +'" onclick="openInNewTab(\''+ data.read +'\', \'bm_list\')" title="'+ data.read +'">Read</button>';
      s_txt += '<button class="bm_edit _db'+ (chk ? '' : ' db_hidden') +'" data-id="list">Edit</button>';
      s_txt += '<button class="bm_delete _db'+ (chk ? '' : ' db_hidden') +'" title="Delete">X</button>';
    }
    s_txt += '<span class="bm_site db_text'+ (wh.indexOf(data.host) != -1 ? ' db_hidden' : ((not_support && note != 'similar_one') || !mydb_settings.read_project ? ' db_100 t_center' : '')) +'" onclick="openInNewTab(\''+ data.url +'\', \'bm_list\')">'+ data.host +'</span>';
    s_txt += '</div>';
    s_txt += '</li>';
    
    if (note.indexOf('similar') != -1) {
      el('.db_bm_show .bm_list').classList.add('bm_similar');
      el('.db_bm_show .bm_list').innerHTML += s_txt;
    } else {
      el('.db_bm_show').innerHTML = '<ul class="bm_list">'+ s_txt +'</ul>';
      el('.db_bm_show .bm_list').style.maxHeight = 'calc(100vh - '+ (el('.db_menu').offsetHeight + el('.db_search').offsetHeight  + 60) +'px)';
    }
    ch_before = false;
  }
  
  function db_showData(data, note) {
    is_exist = true;
    var smlr_note = 'similar';
    db_showHtml(data, 'main');
    if (mydb_settings.number_title) el('title').innerHTML = '('+ data.number +') '+ el('title').innerHTML.replace(/^\([^\)]+\)\s/, '');
    el('.db_bm_show').classList.remove('db_hidden');
    console.log(`${mydb_type} data from: ${note}`);
    
    // set zoom for comic reader
    if (mydb_type == 'comic' && 'type' in data && !is_mobile) {
      mydb_zoom = localStorage.getItem('mydb_zoom') ? JSON.parse(localStorage.getItem('mydb_zoom')) : {};
      if (getId('reader') in mydb_zoom === false) mydb_zoom[getId('reader')] = data.type;
      localStorage.setItem('mydb_zoom', JSON.stringify(mydb_zoom));
      if (localStorage.getItem(getId('reader'))) localStorage.removeItem(getId('reader')); //remove old data, temporary
    }
    
    if (note.indexOf('db_checkBookmarkOne') != -1) smlr_note = 'similar_one';
    
    if (data.similar != '') {
      var smlr_list = data.similar.replace(/\s+/g, '').split(',');
      for (var j = 0; j < smlr_list.length; j++) {
        var smlr = main_arr.filter(item => (item.id == smlr_list[j]));
        if (smlr.length > 0) db_showHtml(smlr[0], smlr_note);
      }
    }
    
    if (el('.bmark_db').classList.contains('db_shide') && (mydb_project || data.url.indexOf(wp) != -1 || (wp.search(number_w_rgx) == -1 && el('title').innerHTML.search(number_t_rgx) == -1))) {
      el('.db_toggle').click();
    }  
    
    el('.bm_edit', 'all').forEach(function(item) {
      item.addEventListener('click', function() {
        mydb_select = item.dataset.id;
        db_formEdit(mydb_type, main_data.list[item.parentElement.dataset.id]);
      });
    });
    
    el('.bm_delete', 'all').forEach(function(item) {
      item.addEventListener('click', function() {
        var id = item.parentElement.dataset.id;
        if (confirm('Are you sure you want to delete >> '+ id +' << ?\nYou can\'t undo this action.')) {
          db_deleteData(db_pathId(true, id));
        }
      });
    });
  }
  
  function db_checkBookmarkAll(arr, chk) {
    chk = chk ? (chk+1) : 1;
    var id_chk = false;
    var url_id = getId('bookmark').url; //from wl.pathname
    var title_id = getId('bookmark').title; //from <title>
    //var title_rgx = new RegExp(title_id.replace(/(\?|\(|\)|\.)/g, '\\$1'), 'i'); //temporary
    var title_rgx = new RegExp(escapeRegex(title_id), 'i');
    console.log('chk: '+ chk +', title_rgx: '+ title_rgx);
    
    for (var i = 0; i < arr.length; i++) {
      // mangadex, check 1
      /*if (mydb_type == 'comic' && wp.indexOf('/title/'+ arr[i].bmdb +'/') != -1) {
        id_chk = true;
        db_showData(arr[i], 'mangadex');
        break;
      }*/
      // url same with id, check 2
      if (chk == 2 && url_id == arr[i].id) {
        id_chk = true;
        db_showData(arr[i], 'url same');
        break;
      }
      // title same with id, check 3
      if (chk == 3 && title_id.replace(/[^\s\w]/g, '').replace(/\s+/g, '-').toLowerCase() == arr[i].id) {
        id_chk = true;
        db_showData(arr[i], 'title same');
        break;
      }
      // contains title id, check 4
      if (chk == 4 && title_id != '' && (arr[i].id.replace(/\-/g, ' ').search(title_rgx) != -1 || arr[i].title.search(title_rgx) != -1 || arr[i].alternative.search(title_rgx) != -1 || arr[i].url.indexOf(wp) != -1)) {
        id_chk = true;
        db_showData(arr[i], 'contains');
        break;
      }
      // wp contains id, check 5
      if (chk == 5 && wp.indexOf(arr[i].id) != -1) {
        id_chk = true;
        db_showData(arr[i], 'wp contains');
      }
      if (i == arr.length-1 && !id_chk) {
        is_exist = false;
        el('.db_bm_show').classList.add('db_hidden');
        if (chk <= 5) db_checkBookmarkAll(arr, chk); //double check if title not same as id
      }
    }
  }
  
  function db_checkBookmarkOne(chk) {
    chk = chk ? (chk+1) : 1;
    
    //if (wp.search(/^\/((m|id|en)\/?)?$/) != -1 || wl.href.search(/[\/\?&](s(earch)?|page)[\/=\?]/) != -1) return; //temporary
    if (wp == '/' || wp.search(skip1_rgx) != -1 || wp.search(skip2_rgx) != -1) return;
    
    var child, order;
    var id = getId('bookmark');
    
    if (chk == 1) {
      child = 'id';
      id = id.url; //from wl.pathname
    }
    if (chk == 2) {
      child = 'title';
      id = id.title; //from <title>
    }
    if (chk == 3) {
      child = 'alternative';
      id = id.title; //from <title>
    }
    
    var ref = firebase.app(fbase_app).database().ref(`bookmark/${mydb_type}/list`).orderByChild(child);
    var dataRef = chk == 1 ? ref.equalTo(id) : ref.startAt(id).endAt(id+'\uf8ff');
    
    dataRef.once('value').then(function(snapshot) {
      var data = snapshot.val();
      if (!data && chk < 3) {
        db_checkBookmarkOne(chk);
      } else {
        if (data) {
          data = genArray(data)[0];
          // change crossStorage data after update, from db_changeData(
          if (JSON.stringify(main_data.list[data.id]) != JSON.stringify(data)) {
            main_data.list[data.id] = data;
            crossStorage.set(`mydb_${mydb_type}_data`, JSON.stringify(main_data));
          }
          db_showData(data, 'db_checkBookmarkOne '+ child);
        } else {
          db_mainData('start'); //if not found, search bookmark with "all" data
        }
      }
    });
  }
  
  function db_showTotal() {
    console.log(`${mydb_type} bookmark: `+ main_arr.length);
    el('.db_total').innerHTML = `${mydb_type}: <b>`+ main_arr.length +'</b>';
    el('.db_total').classList.remove('db_hidden');
  }
  
  /* temporary
  function db_genList(data) {
    main_arr = genArray(data.list); //only data from "list"
    
    // generate list
    var gl_str = '[';
    for (var i = 0; i < main_arr.length; i++) {
      gl_str += '{"id":"'+ main_arr[i].id +'",'+ ('type' in main_arr[i] ? '"type":"'+ main_arr[i].type +'",' : '') +'"host":"'+ main_arr[i].host +'","url":"'+ main_arr[i].url +'"}';
      if (i < main_arr.length-1) gl_str += ',';
    }
    gl_str += ']';
    
    var gl_data = '{"check":{"length":"'+ data.check['length'] +'","update":'+ data.check.update +'},"list":'+ gl_str +'}'
    crossStorage.set(`mydb_${mydb_type}_data`, gl_data);
  }*/
  
  function db_mainData(note, query) {
    firebase.app(fbase_app).database().ref(`bookmark/${mydb_type}`).once('value').then(function(snapshot) {
      main_data = snapshot.val();
      main_arr = genArray(main_data.list); //only data from "list"
      crossStorage.set(`mydb_${mydb_type}_data`, JSON.stringify(main_data));
      
      if (note == 'get') {
        db_checkBookmarkOne(); //check if bookmark exist, single data
        db_showTotal();
        return;
      }
      
      if (note != 'start') {
        db_info('Done');
        db_resetForm('remove');
      }
      
      if (note.search(/set|update|remove/) != -1) db_listChange();
      
      if (note == 'set' && mydb_type == mydb_type_bkp) el('.db_menu .db_menu_shide').click();
      //if (wp.search(/^\/((m|id|en)\/?)?$/) == -1 && wl.href.search(/[\/\?&](s(earch)?|page)[\/=\?]/) == -1) db_checkBookmarkAll(main_arr); //temporary
      if (wp != '/' && wp.search(skip1_rgx) == -1 && wp.search(skip2_rgx) == -1) db_checkBookmarkAll(main_arr); //check if bookmark exist, all data
      
      // search
      query = note != 'start' && is_search ? el('.db_search input').value : query; //if data updated and "is_search = true" then show search
      if (query) {
        var search_data = db_searchFilter('main', main_arr, query);
        db_searchResult(search_data);
      }
    });
  }
  
  function listCheck(data) {
    if (data && (data != 'null' && data != 'error')) {
      data = JSON.parse(data);
      firebase.app(fbase_app).database().ref(`bookmark/${mydb_type}/check`).once('value').then(function(snapshot) {
        var res = snapshot.val();
        if ((data.check['length'] != res['length']) || (data.check.update != res.update) && mydb_settings.server_check.bm_list) {
          console.log(`mydb: update mydb_${mydb_type}_data`);
          db_mainData('get');
        } else {
          main_data = data;
          main_arr = genArray(data.list);
          if (typeof bakomon_web === 'undefined') db_checkBookmarkOne(); //check if bookmark exist, single data
          db_showTotal();
        }
      });
    } else {
      console.log(`mydb: generate mydb_${mydb_type}_data`);
      db_mainData('get');
    }
  }
  
  function bookmarkHtml() {
    var b_txt = '';
    // css control already in database tools
    // css bookmark
    b_txt += '<style>';
    b_txt += '._bmark ::-webkit-scrollbar{-webkit-appearance:none;}._bmark ::-webkit-scrollbar:vertical{width:10px;}._bmark ::-webkit-scrollbar:horizontal{height:10px;}._bmark ::-webkit-scrollbar-thumb{background-color:rgba(0,0,0,.5);border:2px solid #757575;}._bmark ::-webkit-scrollbar-track{background-color:#757575;}._bmark ::-webkit-input-placeholder{color:#757575;}._bmark ::placeholder{color:#757575;}._bmark a,._bmark a:hover,._bmark a:visited{color:#ddd;text-shadow:none;}._bmark .db_100{width:100%;}._bmark .db_50{width:50%;}.bmark_db{position:fixed;top:0;bottom:0;left:0;width:350px;padding:10px;/*flex-direction:column;*/background:#17151b;color:#ddd;border-right:1px solid #333;}.bmark_db.db_shide{left:-350px;}._bmark ._db{background:#252428;color:#ddd;padding:4px 8px;margin:4px;font:14px Arial;text-transform:initial;cursor:pointer;outline:0 !important;border:1px solid #3e3949;}._bmark svg{width:1em;height:1em;}._bmark ul{padding:0;margin:0;list-style:none;}._bmark input[type="text"],._bmark input[type="search"]{display:initial;cursor:text;height:auto;background:#252428 !important;color:#ddd !important;border:1px solid #3e3949;}._bmark input[type="text"],._bmark input[type="search"]:hover{border-color:#3e3949;}._bmark label [type="radio"],._bmark label [type="checkbox"]{display:initial;margin:-2px 6px 0 0;vertical-align:middle;}._bmark input[readonly]{cursor:default;background:#333 !important;}._bmark select{-webkit-appearance:menulist-button;color:#ddd;}._bmark select:invalid{color:#757575;}._bmark select option{color:#ddd;}.bmark_db .db_line{margin-bottom:10px;padding-bottom:10px;border-bottom:5px solid #333;}.bmark_db .db_line_top{margin-top:10px;padding-top:10px;border-top:5px solid #333;}.bmark_db .db_space{margin:10px 0;}.bmark_db .db_text{padding:4px 8px;margin:4px;color:#ddd;}.bmark_db .db_border{padding:1px 6px;border:1px solid #ddd;}._bmark .db_btn_radio input[type="radio"]{display:none;}._bmark .db_btn_radio input[type="radio"]+label:before{content:none;}._bmark .db_btn_radio input[type="radio"]:checked+label,._bmark .db_selected,._bmark:not(.db_mobile) button:not(.db_no_hover):hover{background:#4267b2;border-color:#4267b2;}._bmark .db_active{background:#238636;border-color:#238636;}._bmark .db_danger{background:#d7382d;border-color:#d7382d;}.bmark_db .db_form .db_next{padding:2px 4px;background:transparent;}.bmark_db .db_notif .fp_content{margin:auto;}';
    b_txt += '.bmark_db .db_account{position:relative;}.bmark_db .db_account .db_act_email{position:absolute;top:-35px;right:0;}.bmark_db .db_account .db_act_out{padding:4px;}.bmark_db:not(.db_s_shide) .db_bm_show .bm_list{max-height:25vh !important;}.bmark_db .db_bm_show .bm_similar .bm_main{margin:5px;border:4px solid #4267b2;}.bmark_db .db_bm_show .bm_similar .bm_main .bm_edit{background:#4267b2;border:0;}.bmark_db .db_bm_show .bm_list,.bmark_db .db_result .bs_list{overflow-y:auto;}.bmark_db .db_result li,.bmark_db .db_bm_show li{border-width:1px;}.bmark_db .db_data .db_s_help_note{padding-bottom:8px;}';
    b_txt += '.bmark_db .db_toggle{position:absolute;bottom:0;right:-40px;align-items:center;width:40px;height:40px;font-size:30px !important;padding:0;margin:0;line-height:0;}._bmark .db_bg,._bmark .db_ibg{position:fixed;top:0;bottom:0;left:0;right:0;background:rgba(0,0,0,.5);}.bmark_db .db_cover img{max-width:100px;}.bmark_db .db_radio label,.bmark_db .db_cbox label{display:inline-block;margin:5px 10px 5px 0;}._bmark ._db[disabled],._bmark ._db[disabled]:hover,._bmark .db_disabled{background:#252428;color:#555;border-color:#252428;cursor:not-allowed;}.bmark_db.db_s_shide .db_result,.db_hidden{display:none;height:0;width:0;visibility:hidden;position:fixed;margin-left:-9999px;}';
    b_txt += '</style>';
    // css mobile
    b_txt += '<style>.db_mobile .bmark_db{width:80%;}.db_mobile .bmark_db.db_shide{left:-80%;}.db_mobile._bmark ._db{font-size:16px;}.db_mobile._bmark .bmark_db .db_toggle{right:-70px;width:70px;height:70px;background:transparent;color:#fff;border:0;text-shadow:-1px 0 #000,0 1px #000,1px 0 #000,0 -1px #000;}</style>';
    // html
    b_txt += '<div class="db_bg db_hidden"></div>';
    b_txt += '<div class="bmark_db db_s_shide db_shide flex_wrap f_bottom">';
    b_txt += '<div class="db_data db_100 db_hidden">';
    b_txt += '<div class="db_form flex_wrap db_hidden"></div>';
    b_txt += '<div class="db_form_btn flex db_line_top db_hidden"><button class="db_btn_gen _db">Generate</button><span class="f_grow"></span><button class="db_btn_close _db db_danger">Close</button><button class="db_set _db db_active db_no_hover db_hidden">Set</button><button class="db_btn_update _db db_active db_no_hover db_hidden">Update</button></div>';
    b_txt += '<div class="db_result db_line db_hidden"></div>';
    b_txt += '<div class="db_tr1">';
    b_txt += '<div class="db_td1">';
    b_txt += '<div class="db_s_help_note _db db_hidden">';
    b_txt += '<b>How to use Advanced Search:</b><br/>In the search box, enter one of the Search operators below.';
    b_txt += '<br/><br/><b>Search operators</b><br/>id, bmdb, title, alternative, number, note, type, host';
    b_txt += '<br/><br/><b>Examples:</b><br/>»&#160;&#160;host::mangaku<br/>»&#160;&#160;title::level@type::manhwa';
    b_txt += '</div>';// .db_s_help_note
    b_txt += '<div class="db_bm_show db_line db_hidden"></div>';
    // onfocus readonly to remove chrome autocomplete
    b_txt += '<div class="db_search db_line flex"><input class="_db db_100" type="search" placeholder="Search ('+ mydb_type +')..." readonly onfocus="this.removeAttribute(\'readonly\')"><span class="db_s_help _db" title="How to use Advanced Search">?</span><button class="_db">GO</button></div>';
    b_txt += '</div>';// .db_td1
    b_txt += '<div class="db_menu2 db_line flex_wrap db_hidden">';
    b_txt += '<div class="db_td2 db_100 db_hidden">';
    b_txt += '<div class="db_menu_selected db_text db_100">&#10095;&#10095;&#160;&#160;&#160;<b><span></span></b></div>';
    b_txt += '<div class="flex db_100 db_space" data-id="list"><button class="db_index db_list _db f_grow t_center">List (<span></span>)</button><button class="db_new _db">New &#43;</button></div>';
    b_txt += '<div class="flex db_100 db_space" data-id="source"><button class="db_index db_source _db f_grow t_center">Source (project)</button><button class="db_new _db">New &#43;</button></div>';
    b_txt += '</div>';// .db_td2
    b_txt += '<div class="db_bm_menu flex db_100">';
    b_txt += '<div class="db_btn_radio flex"><input type="radio" id="comic" name="bookmark" value="comic"><label class="_db db_comic" for="comic">Comic</label><input type="radio" id="novel" name="bookmark" value="novel"><label class="_db db_novel" for="novel">Novel</label><input type="radio" id="anime" name="bookmark" value="anime"><label class="_db db_anime" for="anime">Anime</label></div>';
    b_txt += '<span class="f_grow"></span>';
    b_txt += '<div class="db_account flex">';
    b_txt += '<div class="db_act_email _db db_active db_hidden"></div>';
    b_txt += '<div class="db_act_icon _db">i</div>';
    b_txt += '<button class="db_act_out _db" title="Logout"><svg width="18" height="18" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M400 54.1c63 45 104 118.6 104 201.9 0 136.8-110.8 247.7-247.5 248C120 504.3 8.2 393 8 256.4 7.9 173.1 48.9 99.3 111.8 54.2c11.7-8.3 28-4.8 35 7.7L162.6 90c5.9 10.5 3.1 23.8-6.6 31-41.5 30.8-68 79.6-68 134.9-.1 92.3 74.5 168.1 168 168.1 91.6 0 168.6-74.2 168-169.1-.3-51.8-24.7-101.8-68.1-134-9.7-7.2-12.4-20.5-6.5-30.9l15.8-28.1c7-12.4 23.2-16.1 34.8-7.8zM296 264V24c0-13.3-10.7-24-24-24h-32c-13.3 0-24 10.7-24 24v240c0 13.3 10.7 24 24 24h32c13.3 0 24-10.7 24-24z"/></svg></button>';
    b_txt += '</div>';// .db_account
    b_txt += '</div>';// .db_bm_menu
    b_txt += '</div>';// .db_menu2
    b_txt += '<div class="db_menu flex"><button class="db_menu_shide _db">Menu</button><button class="db_new_gen _db" title="Auto generate '+ mydb_type +' list">+</button><span class="f_grow"></span><span class="db_total _db db_active db_hidden"></span></div>';
    b_txt += '</div>';// .db_tr1
    b_txt += '</div>';// .db_data
    b_txt += '<div class="db_login flex_wrap db_hidden">';
    b_txt += '<input class="db_email _db db_100" type="email" placeholder="Email" readonly onfocus="this.removeAttribute(\'readonly\')">';
    b_txt += '<input class="db_pass _db db_100" type="password" placeholder="Password" readonly onfocus="this.removeAttribute(\'readonly\')">';
    b_txt += '<div class="flex"><button class="db_in _db">Login</button><span class="lg_notif _db db_selected db_hidden"></span></div>';
    b_txt += '</div>';// .db_login
    b_txt += '<div class="db_toggle _db db_100 flex f_center">&#9733;</div>';
    b_txt += '<div class="db_notif flex f_perfect db_hidden" style="position:absolute;"><span class="db_notif_text _db fp_content">Loading..</span></div>';
    b_txt += '</div>';// .bmark_db
    
    var b_html = document.createElement('div');
    b_html.style.cssText = 'position:relative;z-index:2147483643;'; //2147483647
    b_html.className = '_bmark cbr_mod' + (is_mobile ? ' db_mobile' : '');
    b_html.innerHTML = b_txt;
    document.body.appendChild(b_html);
    if (el('meta[name="viewport"]')) el('meta[name="viewport"]').setAttribute('content', 'width=device-width, initial-scale=1');
  }
  
  function db_startBookmark() {
    bookmarkHtml();
    if (el('#_loader')) el('#_loader').parentElement.removeChild(el('#_loader'));
    
    // Check login source: https://youtube.com/watch?v=iKlWaUszxB4&t=102
    firebase.app(fbase_app).auth().onAuthStateChanged(function(user) {
      if (user) { //User is signed in
        mydb_login = true;
        crossStorage.get(`mydb_${mydb_type}_data`, function(res){ listCheck(res); }); //Check & update list data
        db_info('RESET');
        el('.db_login').classList.add('db_hidden');
        el('.db_data').classList.remove('db_hidden');
      } else {
        mydb_login = false;
        el('.db_login').classList.remove('db_hidden');
        el('.db_data').classList.add('db_hidden');
      }
    });
    
    document.onkeyup = function(e) {
      // enter to search
      if (el('.db_search input') === document.activeElement && e.keyCode == 13) {
        el('.db_search button').click();
      }
      // enter to search (index)
      if (is_index && el('.db_isearch input') === document.activeElement && e.keyCode == 13) {
        el('.db_isearch button').click();
      }
      // enter to set/update
      if (!el('.db_form').classList.contains('db_hidden') && 'TEXTAREA' !== document.activeElement.tagName && e.keyCode == 13) {
        if (el('.db_set').classList.contains('db_hidden')) el('.db_btn_update').click();
        if (el('.db_btn_update').classList.contains('db_hidden')) el('.db_set').click();
      }
      if (document.activeElement.tagName !== 'TEXTAREA' && e.keyCode == 13) document.activeElement.blur();
    };
    
    el('.db_toggle').onclick = function() {
      document.documentElement.classList.toggle('no-scroll');
      document.body.classList.toggle('no-scroll');
      el('.db_search .db_s_help').classList.remove('db_danger');
      el('.db_s_help_note').classList.add('db_hidden');
      if (el('.db_paste_form')) {
        el('.db_bmdb_paste').classList.remove('db_danger')
        el('.db_paste_form').classList.add('db_hidden');
      }
      
      this.classList.toggle('db_danger');
      el('.bmark_db').classList.toggle('db_shide');
      el('.db_bg').classList.toggle('db_hidden');
      if (is_mobile) document.body.style.overflow = el('.bmark_db').classList.contains('db_shide') ? 'initial' : 'hidden';
    };
    
    el('.db_bg').onclick = function() {
      el('.db_toggle').click();
    };
    
    el('.db_login .db_in').onclick = function() {
      var userEmail = el('.db_email').value;
      var userPass = el('.db_pass').value;
      el('.lg_notif').innerHTML = 'Loading..';
      el('.lg_notif').classList.remove('db_hidden');
      
      firebase.app(fbase_app).auth().signInWithEmailAndPassword(userEmail, userPass).then((user) => {
        el('.lg_notif').classList.add('db_hidden');
      }).catch(function(error) {
        console.error('!! Error: Firebase login, code: '+ error.code +', message: '+ error.message);
        alert('!! Error: Firebase login(\n'+ error.message);
        el('.lg_notif').innerHTML = 'Error!!';
      });
    };
    
    el('.db_account .db_act_icon').onclick = function() {
      el('.db_bm_menu .db_act_email').innerHTML = firebase.app(fbase_app).auth().currentUser.email;
      el('.db_bm_menu .db_act_email').classList.toggle('db_hidden');
    };
    
    el('.db_account .db_act_out').onclick = function() {
      if (confirm('Are you sure you want to log out?')) {
        firebase.app(fbase_app).auth().signOut();
      }
    };
    
    el('.db_menu .db_menu_shide').onclick = function() {
      el('.db_search .db_s_help').classList.remove('db_danger');
      el('.db_s_help_note').classList.add('db_hidden');
      
      db_resetMenu();
      this.classList.toggle('db_danger');
      if (this.classList.contains('db_danger')) {
        this.innerHTML = 'Close';
        el('.db_menu .db_new_gen').classList.add('db_hidden');
      } else {
        mydb_type = mydb_type_bkp;
        this.innerHTML = 'Menu';
        el('.db_menu .db_new_gen').classList.remove('db_hidden');
      }
      el('.db_menu2').classList.toggle('db_hidden');
      //el('.db_bm_menu input[value="'+ mydb_type +'"]').checked = true;
      el('.db_td1').classList.toggle('db_hidden');
      if (is_search) el('.db_result').classList.toggle('db_hidden');
    };
    
    el('.db_menu .db_new_gen').onclick = function() {
      is_autoGen = true;
      el('.db_menu .db_menu_shide').click();
      el('.db_menu .db_new_gen').classList.add('db_hidden');
      setTimeout(function() { el('.db_bm_menu .db_'+ mydb_type).click(); }, 100);
      setTimeout(function() { el('.db_menu2 [data-id="list"] .db_new').click(); }, 100);
      setTimeout(function() { el('.db_form_btn .db_btn_gen').click(); }, 100);
    };
    
    el('.db_bm_menu [type="radio"]', 'all').forEach(function(item) {
      item.addEventListener('click', function() {
        mydb_type = this.value;
        el('.db_menu2 .db_td2').classList.remove('db_hidden');
        el('.db_menu2 .db_td2').dataset.dbid = mydb_type;
        el('.db_menu_selected span').innerHTML = mydb_type;
        el('.db_list span').innerHTML = mydb_type;
      });
    });
    
    el('.db_menu2 .db_index', 'all').forEach(function(item) {
      item.addEventListener('click', function() {
        mydb_select = item.parentElement.dataset.id;
        is_index = true;
        db_startIndex('start');
      });
    });
    
    el('.db_menu2 .db_new', 'all').forEach(function(item) {
      item.addEventListener('click', function() {
        mydb_select = item.parentElement.dataset.id;
        db_resetForm();
        is_form = 'new';
        el('.db_form_btn').classList.remove('db_hidden'); //always above db_formSelect()
        db_formSelect('new');
        el('.db_form').classList.remove('db_hidden');
        el('.db_form_btn .db_set').classList.remove('db_hidden');
        el('.db_form_btn .db_btn_update').classList.add('db_hidden');
        if (is_search) el('.bmark_db').classList.add('db_s_shide');
        el('.db_tr1').classList.add('db_hidden');
      });
    });
    
    el('.db_search .db_s_help').onclick = function() {
      this.classList.toggle('db_danger');
      el('.db_s_help_note').classList.toggle('db_hidden');
    };
    
    el('.db_search button').onclick = function() {
      el('.db_search .db_s_help').classList.remove('db_danger');
      el('.db_s_help_note').classList.add('db_hidden');
      
      if (el('.db_search input').value == '') return;
      is_search = true;
      document.activeElement.blur();
      db_info('Loading..');
      db_mainData('search', el('.db_search input').value);
    };
    
    // klik "Generate" harus pada halaman komik project
    el('.db_form_btn .db_btn_gen').onclick = db_formGen;
    
    el('.db_form_btn .db_btn_close').onclick = function() {
      db_resetForm('remove');
      if (is_search) el('.bmark_db').classList.remove('db_s_shide');
      if (is_index) el('.bm_index').classList.remove('db_hidden');
      if (is_autoGen) {
        is_autoGen = false;
        setTimeout(function() { el('.db_menu .db_menu_shide').click(); }, 100);
      }
    };
    
    el('.db_form_btn .db_set').onclick = function() {
      if (!db_formCheck()) return;
      db_info('Loading..');
      db_checkData('id', db_pathId(true)).then(function(res) {
        var cd_res = JSON.parse(res);
        if (!cd_res.check) {
          db_changeData('set');
        } else {
          var exist_str = (mydb_select == 'source' ? mydb_select : mydb_type) +' already exist: '+ cd_res.note;
          db_info(exist_str, 'danger', true);
        }
      });
    };
    
    el('.db_form_btn .db_btn_update').onclick = function() {
      if (!db_formCheck()) return;
      db_info('Loading..');
      db_changeData('update');
    };
  }
  
  var main_data, main_arr, ch_before, nav_total, nav_elem, nav_current, index_data, index_arr, index_sort, index_order;
  var wl = window.location;
  var wh = wl.hostname;
  var wp = wl.pathname;
  var is_exist = false;
  var is_search = false;
  var is_autoGen = false;
  var is_form = false;
  var is_index = false;
  var is_isearch = false;
  var is_sVanced = false;
  var is_fVanced = false;
  var is_mobile = isMobile(); //from database tools
  var nav_max = 3; // result always: nav_max + 2 = 5
  var index_max = 12;
  var local_date = new Date(toISOLocal().split('T')[0]);
  
  /*
  note:
    - multiple name 'class' use ','
      eg. "class": "source,search"
  */
  var db_settings = {"comic":{"source":{"1_host":{"value":"hostname"},"2_domain":{"type":"textarea","value":"alternative domain"},"3_status":{"type":"select","option":"active,discontinued"},"4_language":{"type":"select","option":"id,en,raw"},"5_theme":{"type":"select","option":"none,themesia,madara,eastheme,koidezign,emissionhex,pemudanolep,new_cms,reader_cms"},"6_tag":{"type":"checkbox","option":"ads_newtab,not_support,_rightclick"},"7_project":{"value":"project url"},"8_icon":{"value":"favicon url"}},"list":{"1_id":{"class":"fVanced"},"2_bmdb":{"value":"comic id","attribute":{"data-val":""},"next":{"paste":{"type":"button","class":"db_no_hover"},"none":{"type":"button","attribute":{"onclick":"this.parentElement.querySelector('input').value='none'"}},"mangadex":{"type":"button","value":"md","class":"_source","attribute":{"data-href":"//mangadex.org/titles?q="}},"mangaupdates":{"type":"button","value":"mu","class":"_source","attribute":{"data-href":"//mangaupdates.com/series.html?search="}},"open":{"type":"button"}}},"3_paste":{"type":"textarea","value":"paste here","next":{"par_class":"db_paste_form flex_wrap db_hidden","generate":{"type":"button"},"close":{"type":"button","value":"X"}}},"4_title":{"next":{"select":{"type":"button","attribute":{"onclick":"this.parentElement.querySelector('input').select()"}}}},"5_alternative":{"type":"textarea","value":"alternative title","class":"fVanced"},"6_number":{"value":"chapter","next":{"default":{"type":"button","attribute":{"onclick":"this.parentElement.querySelector('input').value='belum'"}},"select":{"type":"button","attribute":{"onclick":"this.parentElement.querySelector('input').select()"}},"before":{"type":"button","attribute":{"onclick":"this.parentElement.querySelector('input').value=this.dataset.number"}}}},"7_note":{},"8_type":{"type":"select","option":"manga,manhwa,manhua","next":{"par_class":"fVanced","manual":{"type":"button"}}},"9_host":{"value":"hostname","next":{"par_class":"fVanced","select":{"type":"button","attribute":{"onclick":"this.parentElement.querySelector('input').select()"}}}},"10_url":{"value":"comic url","next":{"par_class":"fVanced","select":{"type":"button","attribute":{"onclick":"this.parentElement.querySelector('input').select()"}},"open":{"type":"button","attribute":{"onclick":"openInNewTab(this.parentElement.querySelector('input').value)"}}}},"11_read":{"value":"link to read (if web to read is different)","next":{"par_class":"fVanced","open":{"type":"button","attribute":{"onclick":"openInNewTab(this.parentElement.querySelector('input').value)"}}}},"12_image":{"value":"cover image","next":{"par_class":"fVanced","open":{"type":"button","attribute":{"onclick":"openInNewTab(this.parentElement.querySelector('input').value)"}}}},"13_update":{"type":"date","value":"last update","next":{"before":{"type":"button","attribute":{"onclick":"this.parentElement.querySelector('input').valueAsDate=new Date(Number(this.dataset.date))"}}}},"14_similar":{"type":"textarea","value":"similar comic id","class":"fVanced"}}},"novel":{"source":{"1_host":{"value":"hostname"},"2_domain":{"type":"textarea","value":"alternative domain"},"3_status":{"type":"select","option":"active,discontinued"},"4_language":{"type":"select","option":"id,en,raw"},"5_theme":{"type":"select","option":"none,themesia,madara,koidezign,yuukithemes"},"6_tag":{"type":"checkbox","option":"ads_newtab,not_support,_rightclick"},"7_project":{"value":"project url"},"8_icon":{"value":"favicon url"}},"list":{"1_id":{"class":"fVanced"},"2_bmdb":{"value":"novel id","attribute":{"data-val":""},"next":{"paste":{"type":"button","class":"db_no_hover"},"none":{"type":"button","attribute":{"onclick":"this.parentElement.querySelector('input').value='none'"}},"mangaupdates":{"type":"button","value":"mu","class":"_source","attribute":{"data-href":"//mangaupdates.com/series.html?search="}},"open":{"type":"button"}}},"3_paste":{"type":"textarea","value":"paste here","next":{"par_class":"db_paste_form flex_wrap db_hidden","generate":{"type":"button"},"close":{"type":"button","value":"X"}}},"4_title":{"next":{"select":{"type":"button","attribute":{"onclick":"this.parentElement.querySelector('input').select()"}}}},"5_alternative":{"type":"textarea","value":"alternative title","class":"fVanced"},"6_number":{"value":"chapter","next":{"default":{"type":"button","attribute":{"onclick":"this.parentElement.querySelector('input').value='belum'"}},"select":{"type":"button","attribute":{"onclick":"this.parentElement.querySelector('input').select()"}},"before":{"type":"button","attribute":{"onclick":"this.parentElement.querySelector('input').value=this.dataset.number"}}}},"7_note":{},"8_type":{"type":"select","option":"mtl,htl","next":{"par_class":"fVanced","manual":{"type":"button"}}},"9_host":{"value":"hostname","next":{"par_class":"fVanced","select":{"type":"button","attribute":{"onclick":"this.parentElement.querySelector('input').select()"}}}},"10_url":{"value":"novel url","next":{"par_class":"fVanced","select":{"type":"button","attribute":{"onclick":"this.parentElement.querySelector('input').select()"}},"open":{"type":"button","attribute":{"onclick":"openInNewTab(this.parentElement.querySelector('input').value)"}}}},"11_image":{"value":"cover image","next":{"par_class":"fVanced","open":{"type":"button","attribute":{"onclick":"openInNewTab(this.parentElement.querySelector('input').value)"}}}},"12_update":{"type":"date","value":"last update","next":{"before":{"type":"button","attribute":{"onclick":"this.parentElement.querySelector('input').valueAsDate=new Date(Number(this.dataset.date))"}}}},"13_similar":{"type":"textarea","value":"similar novel id","class":"fVanced"}}},"anime":{"source":{"1_host":{"value":"hostname"},"2_domain":{"type":"textarea","value":"alternative domain"},"3_status":{"type":"select","option":"active,discontinued"},"4_language":{"type":"select","option":"id,en,raw"},"5_theme":{"type":"select","option":"none,themesia,eastheme,koidezign"},"6_tag":{"type":"checkbox","option":"ads_newtab,not_support,_rightclick"},"7_project":{"value":"project url"},"8_icon":{"value":"favicon url"}},"list":{"1_id":{"class":"fVanced"},"2_bmdb":{"value":"anime id","attribute":{"data-val":""},"next":{"paste":{"type":"button","class":"db_no_hover"},"none":{"type":"button","attribute":{"onclick":"this.parentElement.querySelector('input').value='none'"}},"myanimelist":{"type":"button","value":"mal","class":"_source","attribute":{"data-href":"//myanimelist.net/anime.php?cat=anime&q="}},"anilist":{"type":"button","value":"anl","class":"_source","attribute":{"data-href":"//anilist.co/search/anime?search="}},"anidb":{"type":"button","value":"adb","class":"_source","attribute":{"data-href":"//anidb.net/anime/?view=grid&adb.search="}},"open":{"type":"button"}}},"3_paste":{"type":"textarea","value":"paste here","next":{"par_class":"db_paste_form flex_wrap db_hidden","generate":{"type":"button"},"close":{"type":"button","value":"X"}}},"4_title":{"next":{"select":{"type":"button","attribute":{"onclick":"this.parentElement.querySelector('input').select()"}}}},"5_alternative":{"type":"textarea","value":"alternative title","class":"fVanced"},"6_number":{"value":"episode","next":{"default":{"type":"button","attribute":{"onclick":"this.parentElement.querySelector('input').value='belum'"}},"select":{"type":"button","attribute":{"onclick":"this.parentElement.querySelector('input').select()"}},"before":{"type":"button","attribute":{"onclick":"this.parentElement.querySelector('input').value=this.dataset.number"}}}},"7_note":{},"8_host":{"value":"hostname","next":{"par_class":"fVanced","select":{"type":"button","attribute":{"onclick":"this.parentElement.querySelector('input').select()"}}}},"9_url":{"value":"anime url","next":{"par_class":"fVanced","select":{"type":"button","attribute":{"onclick":"this.parentElement.querySelector('input').select()"}},"open":{"type":"button","attribute":{"onclick":"openInNewTab(this.parentElement.querySelector('input').value)"}}}},"10_image":{"value":"cover image","next":{"par_class":"fVanced","open":{"type":"button","attribute":{"onclick":"openInNewTab(this.parentElement.querySelector('input').value)"}}}},"11_update":{"type":"date","value":"last update","next":{"before":{"type":"button","attribute":{"onclick":"this.parentElement.querySelector('input').valueAsDate=new Date(Number(this.dataset.date))"}}}},"12_similar":{"type":"textarea","value":"similar novel id","class":"fVanced"}}}};
  
  // START
  var fbase_wait = setInterval(function() {
    if (mydb_fbase_loaded) {
      clearInterval(fbase_wait);
      db_startBookmark();
      
      if (!mydb_settings.server_check.source_bm) sourceCheck('after', JSON.stringify(mydb_source));
      mydb_info['bookmark_js'] = 'loaded';
    }
  }, 100);
  
  if (mydb_settings.remove_site.bookmark) {
    if (localStorage.getItem('bookmarkedKomik')) localStorage.removeItem('bookmarkedKomik'); //komikcast
    if (localStorage.getItem('konten')) localStorage.removeItem('konten'); //emissionhex
    if (localStorage.getItem('bookmark')) localStorage.removeItem('bookmark'); //themesia
    if (localStorage.getItem('bookmarks')) localStorage.removeItem('bookmarks'); //themesia
    if (document.cookie.match(RegExp('(?:^|;\\s*)simplefavorites=([^;]*)'))) document.cookie = 'simplefavorites=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'; //koidezign
  }
}

if ((typeof live_test_bookmark != 'undefined' && typeof mydb_bm_loaded != 'undefined') && (!live_test_bookmark && !mydb_bm_loaded)) {
  var db_bm_check = setInterval(function() {
    if (mydb_loaded) {
      clearInterval(db_bm_check);
      clearTimeout(db_bm_wait);
      mydb_bm_fnc();
    }
  }, 100);
  var db_bm_wait = setTimeout(function() { clearInterval(db_bm_check); }, 60000);
}
