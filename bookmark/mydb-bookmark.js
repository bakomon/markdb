// DATABASE BOOKMARK
(function() {
//function comic_bm() {
  
  function getHostname(url) {
    var wh_rgx = /^(w{3}|web|m(obile)?|read)\./i;
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
  
  function db_pathId(chk, custom) {
    var path = mydb_select == 'list' ? '' : 'source/';
    path = 'bookmark/'+ path + mydb_type;
    if (chk) {
      var id = custom ? custom : mydb_select == 'list' ? el('.db_form .db_id').value : getHostname(el('.db_form .db_host').value).replace(/\./g, '-');
      path = path +'/'+ id;
    }
    return path;
  }
  
  function db_checkData(path) {
    return firebase.app(fbase_app).database().ref(path).once('value').then(function(snapshot) {
      return snapshot.exists() ? true : false;
    });
  }
  
  function db_deleteData(path) {
    el('.db_notif span').innerHTML = 'Loading..';
    el('.db_notif').classList.remove('db_hidden');
    
    firebase.app(fbase_app).database().ref(path).remove()
      .then(function() {
        if (mydb_type == mydb_type_bkp && mydb_select == 'list') db_mainData('remove');
        if (is_index) db_startIndex('remove');
        if (mydb_select == 'source') changeSource();
      })
      .catch(function(error) {
        el('.db_notif span').innerHTML = 'Error!!';
      });
  }
  
  function db_genData(note) {
    var g_val, g_arr = mydb_select == 'source' ? ['host','domain','status','theme','tag','project','icon'] : ['id','bmdb','title','alternative','number','note','type','host','url','read','image','update','similar'];
    var g_txt = '{';
    for (var i = 0; i < g_arr.length; i++) {
      if (note == 'update' && g_arr[i] == 'id') continue;
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
      
      if (g_arr[i].search(/title|alternative/) != -1) g_val = g_val.replace(/(")/g, '\\$1');
      if (g_arr[i] == 'host') g_val = getHostname(g_val);
      if (g_arr[i].search(/domain|project|url|read/) != -1) g_val = g_val.replace(/^(https?:)?\/\//g, '//').replace(/\/\/((w{3}|m(obile)?)\.)?/g, '//');
      if (mydb_select == 'source' && g_arr[i] == 'domain') g_val = g_val.replace(/\//g, '');
      if (g_arr[i] == 'update') g_val = new Date(g_val).getTime();
      if (g_arr[i].search(/project|icon|title|alternative|url|read|image|update/) == -1) g_val = g_val.toLowerCase();
      
      g_txt += '"'+ g_arr[i] +'":'+ (g_arr[i] == 'update' ? g_val : '"'+ g_val +'"');
      if (i < g_arr.length-1) g_txt += ',';
    }
    g_txt += '}';
    return JSON.parse(g_txt);
  }
  
  // Firebase update vs set https://stackoverflow.com/a/38924648
  function db_changeData(type) {
    firebase.app(fbase_app).database().ref(db_pathId(true))[type](db_genData(type), (error) => {
      if (error) {
        console.log(error);
        el('.db_notif span').innerHTML = 'Error!!';
        el('.db_notif span').classList.add('db_danger');
        setTimeout(function() { el('.db_notif').classList.add('db_hidden'); }, 1500);
      } else {
        if (mydb_type == mydb_type_bkp && mydb_select == 'list') db_mainData(type);
        if (type == 'update' && is_index) db_startIndex(type);
        if (mydb_select == 'source') {
          changeSource();
          if (type == 'set') {
            el('.db_notif span').innerHTML = 'Done';
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
    setTimeout(function() {
      el('.db_notif').classList.add('db_hidden');
      el('.db_notif span').innerHTML = '';
      el('.db_notif span').classList.remove('db_danger');
    }, 500);
  }
  
  function db_resetMenu() {
    el('.db_menu2 .db_td2').classList.add('db_hidden');
    el('.db_menu2 .db_td2').removeAttribute('data-dbid');
    el('.db_menu_selected span').innerHTML = '';
    el('.db_list span').innerHTML = '';
    if (el('.db_bm_menu [type="radio"]:checked')) el('.db_bm_menu [type="radio"]:checked').checked = false;
  }
  
  function db_formCheck() {
    if (mydb_select == 'source') {
      if (el('.db_host').value == '') {
        alert('web hostname is empty');
        return false;
      }
      if (el('.db_status').value == '') {
        alert('web status is empty');
        return false;
      }
    } else {
      if (el('.db_id').value == '' || el('.db_number').value == '') {
        alert('id or number is empty');
        return false;
      }
      if (el('.db_type') && el('.db_type').value == '') {
        alert(`${mydb_type} type is empty`);
        return false;
      }
      if (el('.db_bmdb').value == '') {
        alert(`${mydb_type} id is empty or fill with "none"`);
        return false;
      } else {
        if (el('.db_bmdb').value == 'none' && el('.db_image').value == '') {
          alert('cover image is empty');
          return false;
        }
        /*if (el('.db_bmdb').value != 'none' && el('.db_bmdb').value.indexOf('md|') != -1 && el('.db_image').value != '') {
          alert(`delete image, image is included in ${mydb_type} id`); //mangadex
          return false;
        }*/
      }
    }
    return true;
  }
  
  function db_formEdit(note, data) {
    is_form = 'edit';
    el('.db_form_btn').classList.remove('db_hidden'); //always above db_formSelect()
    db_formSelect();
    el('.db_form').classList.remove('db_hidden');
    el('.db_form_btn .db_set').classList.add('db_hidden');
    el('.db_form_btn .db_btn_update').classList.remove('db_hidden');
    if (is_search) el('.bmark_db').classList.add('db_s_shide');
    el('.db_tr1').classList.add('db_hidden');
    
    el('.db_host').value = data.host;
    if (mydb_select == 'source') {
      el('.db_domain').value = data.domain;
      el('.db_status').value = data.status;
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
      el('.db_id').value = data.id;
      el('.db_bmdb').value = data.bmdb;
      el('.db_title').value = data.title;
      el('.db_alternative').value = data.alternative;
      el('.db_number').value = data.number;
      el('.db_note').value = data.note;
      if ('type' in data && el('.db_type')) el('.db_type option[value="'+ data.type +'"]').selected = true;
      el('.db_url').value = data.url;
      if ('read' in data && el('.db_read')) el('.db_read').value = data.read;
      el('.db_image').value = data.image;
      el('.db_update').valueAsDate = local_date;
      el('.db_similar').value = data.similar;
      
      if (data.image != '') {
        el('.db_cover img').src = data.image;
        el('.db_cover').classList.remove('db_hidden');
        el('.db_image_open').classList.remove('db_hidden');
      }
      if (data.bmdb == 'none') {
        var id_search = data.id.replace(/\-/g, ' ');
        if (mydb_type == 'comic') {
          el('.db_bmdb_mangadex').dataset.href = '//mangadex.org/titles/?q='+ id_search;
          el('.db_bmdb_mangaupdates').dataset.href = '//mangaupdates.com/series.html?search='+ id_search;
          el('.db_bmdb_mangadex').classList.remove('db_hidden');
          el('.db_bmdb_mangaupdates').classList.remove('db_hidden');
        } else if (mydb_type == 'novel') {
          el('.db_bmdb_mangaupdates').dataset.href = '//mangaupdates.com/series.html?search='+ id_search;
          el('.db_bmdb_mangaupdates').classList.remove('db_hidden');
        } else {
          el('.db_bmdb_myanimelist').dataset.href = '//myanimelist.net/anime.php?cat=anime&q='+ id_search;
          el('.db_bmdb_anilist').dataset.href = '//anilist.co/search/anime?search='+ id_search;
          el('.db_bmdb_anidb').dataset.href = '//anidb.net/anime/?view=grid&adb.search='+ id_search;
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
    }
  }
  
  function db_formGen(name, data, parent) {
    var f_txt = '';
    var f_att = '';
    name = name.replace(/^\d+_/, '');
    if ('attribute' in data) {
      for (var att in data['attribute']) {
        f_att += ' '+ att +'="'+ data['attribute'][att] +'"';
      }
    }
    var f_cls = parent ? (parent +'_'+ name) : name;
    var f_val = 'value' in data ? data['value'] : name;
    
    switch (data['type']) {
      case 'select':
        f_txt += '<select class="_db db_100 db_'+ f_cls +'"'+ f_att +' required><option value="" selected disabled hidden>'+ name +'</option>';
        var odata = data['option'].split(',');
        for (var i = 0; i < odata.length; i++) {
          f_txt += '<option value="' + odata[i] + '">' + odata[i] + '</option>';
        }
        f_txt += '</select>';
        break;
      case 'button':
        f_txt += '<button class="_db db_selected db_hidden db_'+ f_cls +'"'+ f_att +'>'+ f_val +'</button>';
        break;
      case 'radio':
        if ('option' in data) {
          var rdata = data['option'].split(',');
          for (var i = 0; i < rdata.length; i++) {
            f_txt += '<label><input name="'+ name +'" type="radio" value="'+ rdata[i] +'"/><span>'+ rdata[i] +'</span></label>';
          }
          f_txt = '<div class="db_radio _db db_100 db_'+ f_cls +'"'+ f_att +'>'+ f_txt +'</div>';
        } else {
          f_txt += '<label class="_db db_100 db_'+ f_cls +'"'+ f_att +'><input name="'+ name +'" type="radio" value="'+ f_val +'"/><span>'+ f_val +'</span></label>';
        }
        break;
      case 'checkbox':
        if ('option' in data) {
          var cdata = data['option'].split(',');
          for (var i = 0; i < cdata.length; i++) {
            f_txt += '<label><input type="checkbox" value="'+ cdata[i] +'"/><span>'+ cdata[i] +'</span></label>';
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
      default:
        f_txt += '<input class="_db db_100 db_'+ f_cls +'" type="text" placeholder="'+ f_val +'"'+ f_att +'/>';
        break;
    }
    
    if ('next' in data) {
      for (var name2 in data['next']) {
        f_txt += db_formGen(name2, data['next'][name2], name);
      }
      f_txt = '<div class="flex db_100">'+ f_txt +'</div>';
    }
    
    return f_txt;
  }
  
  function db_formSelect() {
    var f_txt = '';
    var data = db_settings[mydb_type];
    
    if (is_form == 'edit' && mydb_select.indexOf('project') == -1) f_txt += '<div class="db_cover db_100 t_center db_hidden"><img src=""></div>';
    f_txt += '<div class="db_text db_100">&#10095;&#10095;&#160;&#160;&#160;<b>'+ mydb_type +'</b>&#160;&#160;>&#160;&#160;<b>'+ mydb_select +'</b>&#160;&#160;>&#160;&#160;<span class="db_border"><b>'+ is_form +'</b></span></div>';
    for (var name in data[mydb_select]) {
      f_txt += db_formGen(name, data[mydb_select][name]);
    }
    el('.db_form').innerHTML = '<div class="f_grow"></div><div class="flex_wrap">'+ f_txt +'</div>';
    el('.db_form').style.cssText = 'flex-direction:column;overflow-y:auto;height:calc(100vh - '+ (el('.db_form_btn').offsetHeight + 31) +'px);';
    
    if (mydb_select == 'list') {
      el('.db_bmdb_open').onclick = function() {
        var op_url, op_id = el('.db_bmdb').value;
        if (mydb_type == 'comic') {
          op_url = op_id.indexOf('md|') != -1 ? 'mangadex.org/title/' : 'mangaupdates.com/series.html?id=';
        } else if (mydb_type == 'novel') {
          op_url = 'mangaupdates.com/series.html?id=';
        } else {
          op_url = op_id.indexOf('mal|') != -1 ? 'myanimelist.net/anime/' : op_id.indexOf('al|') != -1 ? 'anilist.co/anime/' : 'anidb.net/anime/';
        }
        op_url = op_url + op_id.replace(/^(m(d|u|al)|a(l|db))\|/, '');
        window.open('//'+ op_url);
      };
      
      el('.db_update_before').onclick = function() {
        el('.db_update').valueAsDate = new Date(Number(this.dataset.date));
      };
    }
    
    /*// old
    f_txt += '<div class="db_cover db_100 t_center db_hidden"><img src=""></div>';
    f_txt += '<input class="db_id _db db_100" type="text" placeholder="ID">';
    f_txt += '<div class="flex db_100"><input class="db_bmdb _db db_100" type="text" placeholder="Comic ID"><button class="db_bmdb_mangadex _db db_selected db_hidden" onclick="window.open(this.dataset.href)">&#128270; MD</button><button class="db_bmdb_mangaupdates _db db_selected db_hidden" onclick="window.open(this.dataset.href)">&#128270; MU</button><button class="db_bmdb_open _db db_selected db_hidden">Open</button></div>';
    f_txt += '<input class="db_title _db db_100" type="text" placeholder="Title">';
    f_txt += '<input class="db_alternative _db db_100" type="text" placeholder="Alternative Title">';
    f_txt += '<input class="db_number _db db_100" type="text" placeholder="number" onclick="this.select()">';
    f_txt += '<input class="db_note _db db_100" type="text" placeholder="Note">';
    f_txt += '<select class="db_type _db db_100" required><option value="" selected disabled hidden>Type</option><option value="manga">manga</option><option value="manhwa">manhwa</option><option value="manhua">manhua</option></select>';
    f_txt += '<input class="db_host _db db_100" type="text" placeholder="hostname">';
    f_txt += '<div class="flex db_100"><input class="db_url _db db_100" type="text" placeholder="URL"><button class="db_url_open _db flex f_middle db_selected db_hidden"><span>&#128279;</span> Open</button></div>';
    f_txt += '<input class="db_read _db db_100" type="text" placeholder="Link to read (if web to read is different)">';
    f_txt += '<div class="flex db_100"><input class="db_image _db db_100" type="text" placeholder="Cover image"><button class="db_image_open _db flex f_middle db_selected db_hidden"><span>&#128444;</span> Open</button></div>';
    f_txt += '<div class="flex db_100"><input class="db_update _db f_grow" type="date" title="Last Update"><button class="db_update_before _db db_selected db_hidden" onclick="document.querySelector(\'.db_update\').valueAsDate = new Date(Number(this.dataset.date))">Before</button></div>';
    f_txt += '<input class="db_similar _db db_100" type="text" placeholder="Similar comic ID">';
    */
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
    n_txt += '><div class="_db '+ (nav_current == 1 ? 'db_disabled' : 'db_inav') +'">&#10094;</div></li>';
    
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
    n_txt += '><div class="_db '+ (nav_current == nav_total ? 'db_disabled' : 'db_inav') +'">&#10095;</div></li>';
    
    n_txt += '</ul>';
    n_txt += '<div class="db_count db_text">Page '+ nav_current +' of '+ nav_total +'</div>';
    
    nav_elem.innerHTML = n_txt;
    
    el('.db_inav', 'all').forEach(function(item) {
      item.addEventListener('click', function() {
        nav_current = Number(this.parentNode.dataset.page);
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
        i_txt += '<div class="db_ihost"><a href="//'+ i_host +'" target="_blank">'+ i_host +'</a></div>';
        i_txt += '</div>';
        i_txt += '<div class="db_idetail db_100">';
        i_txt += '<div class="db_istatus">Status: <span class="db_text">'+ data[i].status +'</span></div>';
        if (data[i].theme != '') i_txt += '<div class="db_itheme">Theme: <span class="db_text">'+ data[i].theme +'</span></div>';
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
    
    el('.db_icatalog .db_iedit', 'all').forEach(function(item) {
      item.addEventListener('click', function() {
        mydb_select = item.dataset.id;
        el('.bm_index').classList.add('db_hidden');
        db_formEdit(mydb_type, index_data[item.parentNode.dataset.id]);
      });
    });
    
    el('.db_icatalog .db_idelete', 'all').forEach(function(item) {
      item.addEventListener('click', function() {
        var id = item.parentNode.dataset.id;
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
        el('.db_notif span').innerHTML = 'Done';
        db_resetForm('remove');
      }
      
      // sorting data
      nav_current = note == 'start' ? 1 : nav_current;
      index_sort = note == 'start' ? (mydb_select == 'source' ? 'status' : 'title') : index_sort;
      index_order = index_sort == 'update' ? false : true;
      sortBy(index_arr, index_sort, index_order);
      
      // index search
      if (is_isearch) {
        var query = note != 'start' && is_isearch ? el('.db_isearch input').value : param; //if data updated and "is_isearch = true" then show search
        var s_rgx = new RegExp(query, 'ig');
        var s_arr = mydb_select == 'source' ? ['host','domain','status','theme','tag'] : ['id','bmdb','title','alternative','number','note','type','host'];
        index_arr = index_arr.filter(function(item) {
          for (var i = 0; i < s_arr.length; i++) {
            if (s_arr[i] == 'type' && !item['type']) continue;
            if (item[s_arr[i]].search(s_rgx) != -1) return true;
          }
        });
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
    });
  }
  
  function db_indexHtml() {
    var b_txt = '';
    // css
    b_txt += '<style>.bm_index{padding:25px;}.db_idata{background:#17151b;padding:10px;}.db_imenu{margin-top:10px;}.db_icatalog{max-height:calc(100vh - 230px);overflow-y:auto;margin:15px 0;}.db_icatalog .db_ipost{padding:10px;}.db_icatalog.db_ilist .db_ipost{width:33.3%;}.db_icatalog.db_isource .db_ipost{width:25%;}.db_ipost .db_icover{width:25%;margin-right:10px;}.db_icover a{height:100%;}.db_iclose{position:fixed;bottom:0;left:0;}.db_image_bg{position:relative;height:115px;}.db_image_bg:before{content:\x27\x27;position:absolute;top:0;left:0;width:100%;height:100%;text-indent:-9999px;background:#252428;}.db_image_bg:after{content:\x27no image\x27;position:absolute;top:0;left:0;color:#ddd;font-size:14px;}.db_pagination .db_count{margin-left:20px;}.db_icon img{height:30px;width:30px;margin-right:10px;padding:5px;background:#ddd;}</style>';
    // mobile
    b_txt += '<style>.bm_index.db_mobile{padding:0;}.db_mobile .db_icatalog{max-height:calc(100vh - 210px);}.db_mobile .db_icatalog .db_ipost{width:100%;}.db_mobile .db_ipost .db_icover{width:30%;}.db_mobile .db_ifilter .db_text,.db_mobile .db_pagination .db_count{display:none;}</style>';
    // html
    b_txt += '<div class="db_idata flex_wrap db_hidden">';
    b_txt += '<div class="db_isearch flex db_100"><input class="_db db_100" type="text" placeholder="Search ('+ mydb_type +')..."><button class="_db">Search</button></div>';
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
    b_html.style.cssText = 'z-index:2147483647;';
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
      
      el('.db_isearch button').onclick = function() {
        if (el('.db_isearch input').value == '') return;
        is_isearch = true;
        document.activeElement.blur();
        el('.db_imenu').classList.add('db_hidden');
        el('.db_icatalog').innerHTML = '<div class="db_100 t_center">Loading...</div>';
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
        el('.bm_index').classList.add('db_hidden');
      };
    }
    
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
        s_txt += '<div class="_db db_100" onclick="window.open(\''+ arr[i].url +'\')" title="'+ arr[i].url +'">'+ arr[i].title;
        if (arr[i].alternative != '') s_txt += ' | '+ arr[i].alternative;
        s_txt += '</div>';
        s_txt += '<div class="flex db_100" data-id="'+ arr[i].id +'">';
        s_txt += '<span class="bs_ch _db db_100 line_text">'+ arr[i].number + (arr[i].note ? ' ('+ arr[i].note +')' : '') +'</span>';
        if ('read' in arr[i] && arr[i].read != '') s_txt += '<button class="_db db_selected" onclick="window.open(\''+ arr[i].read +'\')" title="'+ arr[i].read +'">Read</button>';
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
        db_formEdit('search', main_data[item.parentNode.dataset.id]);
      });
    });
    
    el('.bs_delete', 'all').forEach(function(item) {
      item.addEventListener('click', function() {
        var id = item.parentNode.dataset.id;
        if (confirm('Are you sure you want to delete >> '+ id +' << ?\nYou can\'t undo this action.')) {
          db_deleteData(db_pathId(true, id));
        }
      });
    });
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
    var chk = not_support || wh.indexOf(data.host) != -1;
    var s_txt = '';
    s_txt += '<li class="_bm '+ (note ? 'db_line_top' : 'bm_main');
    if ('read' in data && data.read != '') s_txt += ' db_url_read';
    s_txt += ' flex_wrap">';
    s_txt += '<div class="_db db_100"'+ ((wh.indexOf(data.host) == -1 || data.url.indexOf(wp) == -1 && note) && el('title').innerHTML.search(number_t_rgx) == -1 ? ' onclick="window.open(\''+ data.url +'\')"' : '') +' title="'+ data.url +'">';
    if (note != 'db_startData') {
      s_txt += data.title;
      if (data.alternative != '') s_txt += ' | '+ data.alternative;
    } else {
      s_txt += firstCase(data.id, '-');
    }
    s_txt += '</div>';
    s_txt += '<div class="db_100 '+ (chk ? 'flex_wrap' : 'flex') +'" data-id="'+ data.id +'">';
    if (note != 'db_startData') {
      s_txt += '<span class="bm_ch _db line_text'+ (chk ? ' f_grow' : ' db_50') +'">'+ data.number + (data.note ? ' ('+ data.note +')' : '') +'</span>';
      if ('read' in data && data.read != '') s_txt += '<button class="_db db_selected'+ (chk ? '' : ' db_hidden') +'" onclick="window.open(\''+ data.read +'\')" title="'+ data.read +'">Read</button>';
      s_txt += '<button class="bm_edit _db'+ (chk ? '' : ' db_hidden') +'" data-id="list">Edit</button>';
      s_txt += '<button class="bm_delete _db'+ (chk ? '' : ' db_hidden') +'" title="Delete">X</button>';
    }
    s_txt += '<span class="bm_site db_text'+ (wh.indexOf(data.host) != -1 ? ' db_hidden' : (not_support ? ' db_100 t_center' : '')) +'" onclick="window.open(\''+ data.url +'\')">'+ data.host +'</span>';
    s_txt += '</div>';
    s_txt += '</li>';
    
    if (note) {
      el('.db_bm_show .bm_list').classList.add('bm_similar');
      el('.db_bm_show .bm_list').innerHTML += s_txt;
    } else {
      el('.db_bm_show').innerHTML = '<ul class="bm_list">'+ s_txt +'</ul>';
      el('.db_bm_show .bm_list').style.maxHeight = 'calc(100vh - '+ (el('.db_menu').offsetHeight + el('.db_search').offsetHeight  + 60) +'px)';
    }
    
    /*if (data.type != '') {
      if (!localStorage.getItem(data.id)) localStorage.setItem(data.id, 'is_'+ data.type);
      document.body.classList.add('is-'+ data.type);
    }*/
  }
  
  function db_showData(data, note) {
    is_exist = true;
    var smlr_note = 'similar';
    db_showHtml(data);
    console.log(`${mydb_type} data from: ${note}`);
    el('.db_bm_show').classList.remove('db_hidden');
    
    if (note.indexOf('db_startData') != -1) {
      if (!main_data) main_data = {};
      main_data[data.id] = data;
      smlr_note = 'db_startData';
    }
    
    if (data.similar != '') {
      var smlr_list = data.similar.replace(/\s+/g, '').split(',');
      for (var j = 0; j < smlr_list.length; j++) {
        var smlr = main_arr.filter(item => (item.id == smlr_list[j]));
        if (smlr.length > 0) db_showHtml(smlr[0], smlr_note);
      }
    }
    
    if (el('.bmark_db').classList.contains('db_shide') && (data.url.indexOf(wp) != -1 || (wp.search(number_w_rgx) == -1 && el('title').innerHTML.search(number_t_rgx) == -1))) {
      el('.db_toggle').click();
    }  
    
    el('.bm_edit', 'all').forEach(function(item) {
      item.addEventListener('click', function() {
        mydb_select = item.dataset.id;
        db_formEdit(mydb_type, main_data[item.parentNode.dataset.id]);
      });
    });
    
    el('.bm_delete', 'all').forEach(function(item) {
      item.addEventListener('click', function() {
        var id = item.parentNode.dataset.id;
        if (confirm('Are you sure you want to delete >> '+ id +' << ?\nYou can\'t undo this action.')) {
          db_deleteData(db_pathId(true, id));
        }
      });
    });
  }
  
  function db_checkDB(arr, chk) {
    chk = chk ? (chk+1) : 1;
    var id_chk = false;
    var url_id = db_getId().url;
    var title_id = db_getId().title;
    var title_rgx = new RegExp(title_id.replace(/(\?|\(|\))/g, '\\$1'), 'i');
    console.log('title_rgx: '+ title_rgx);
    
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
        if (chk <= 5) db_checkDB(arr, chk); //double check if title not same as id
      }
    }
  }
  
  function db_genList(data) {
    var list_txt = '[';
    for (var i = 0; i < data.length; i++) {
      list_txt += '{"id":"'+ data[i].id +'","host":"'+ data[i].host +'","url":"'+ data[i].url +'"}';
      if (i < data.length-1) list_txt += ',';
    }
    list_txt += ']';
    localStorage.setItem(`mydb_${mydb_type}_list`, list_txt);
    crossStorage.set(`mydb_${mydb_type}_list`, list_txt);
  }
  
  function db_mainData(note, query) {
    firebase.app(fbase_app).database().ref(`bookmark/${mydb_type}`).once('value').then(function(snapshot) {
      main_data = snapshot.val();
      main_arr = genArray(snapshot.val());
      db_genList(main_arr);
      if (note == 'get') return;
      
      if (note != 'start') {
        el('.db_notif span').innerHTML = 'Done';
        db_resetForm('remove');
      }
      
      if (note == 'set' && mydb_type == mydb_type_bkp) el('.db_menu .db_menu_shide').click();
      if (wp.search(/^\/((m|id|en)\/?)?$/) == -1 && wl.href.search(/[\/\?&](s(earch)?|page)[\/=\?]/) == -1) db_checkDB(main_arr); //check if data exist and show bookmark
      
      // search
      query = note != 'start' && is_search ? el('.db_search input').value : query; //if data updated and "is_search = true" then show search
      if (query) {
        var key_rgx = new RegExp(query, 'ig');
        var search_data = main_arr.filter(item => (item.id.search(key_rgx) != -1 || item.bmdb.search(key_rgx) != -1 || item.title.search(key_rgx) != -1 || item.alternative.search(key_rgx) != -1 || item.number.search(key_rgx) != -1 || item.note.search(key_rgx) != -1 || ('type' in item && item.type.search(key_rgx) != -1) || item.host.search(key_rgx) != -1));
        db_searchResult(search_data);
      }
    });
  }
  
  function db_getId() {
    var url = wp.match(id_w_rgx)[1].replace(/-(bahasa|sub(title)?)-indo(nesia)?(-online-terbaru)?/i, '').replace(/-batch/i, '').replace(/\.html?$/i, '').toLowerCase();
    var title = el('title').innerHTML.replace(/&#{0,1}[a-z0-9]+;/ig, '').replace(/\([^\)]+\)/g, '').replace(/\s+/g, ' ').replace(/\s((bahasa|sub(title)?)\s)?indo(nesia)?/i, '').replace(/(man(ga|hwa|hua)|[kc]omi[kc]|baca|read|novel|anime|download)\s/i, '').replace(number_t_rgx, ' ').replace(/[\||\-|\–](?:.(?![\||\-|\–]))+$/, '').replace(/\s+$/, '').replace(/\|/g, ''); //old ^([^\||\-|\–]+)(?:\s[\||\-|\–])?
    var id = '{"url":"'+ url +'","title":"'+ title +'"}';
    return JSON.parse(id);
  }
  
  function db_startData(chk) {
    chk = chk ? (chk+1) : 1;
    if (chk == 1) {
      /* always check & update main_arr */
      crossStorage.get(`mydb_${mydb_type}_list`, function(res) {
        if (res == null || res == 'error') {
          db_mainData('get');
        } else {
          localStorage.setItem(`mydb_${mydb_type}_list`, res);
        }
      });
      
      var main_list = localStorage.getItem(`mydb_${mydb_type}_list`)
      if (main_list) {
        main_arr = JSON.parse(main_list);
        console.log(`${mydb_type} bookmark: `+ main_arr.length);
        el('.db_total').innerHTML = `${mydb_type}: <b>`+ main_arr.length +'</b>';
        el('.db_total').classList.remove('db_hidden');
      }
    }
    if (wp.search(/^\/((m|id|en)\/?)?$/) != -1 || wl.href.search(/[\/\?&](s(earch)?|page)[\/=\?]/) != -1) return;
    
    var child, order;
    var id = db_getId();
    
    if (chk == 1) {
      child = 'id';
      id = id.url;
    }
    if (chk == 2) {
      child = 'title';
      id = id.title;
    }
    if (chk == 3) {
      child = 'alternative';
      id = id.title;
    }
    
    var ref = firebase.app(fbase_app).database().ref(`bookmark/${mydb_type}`).orderByChild(child);
    var dataRef = chk == 1 ? ref.equalTo(id) : ref.startAt(id).endAt(id+'\uf8ff');
    
    dataRef.once('value').then(function(snapshot) {
      var data = snapshot.val();
      if (!data && chk < 3) {
        db_startData(chk);
      } else {
        if (data) {
          data = genArray(data)[0];
          db_showData(data, 'db_startData '+ child);
        } else {
          db_mainData('start');
        }
      }
    });
  }
  
  function bookmarkHtml() {
    var b_txt = '';
    // css control already in database tools
    // css bookmark
    b_txt += '<style>.db_100{width:100%;}.db_50{width:50%;}._bmark ::-webkit-scrollbar{-webkit-appearance:none;}._bmark ::-webkit-scrollbar:vertical{width:10px;}._bmark ::-webkit-scrollbar:horizontal{height:10px;}._bmark ::-webkit-scrollbar-thumb{background-color:rgba(0,0,0,.5);border:2px solid #757575;}._bmark ::-webkit-scrollbar-track{background-color:#757575;}._bmark a,._bmark a:hover,._bmark a:visited{color:#ddd;text-shadow:none;}._bmark ::-webkit-input-placeholder{color:#757575;}._bmark ::placeholder{color:#757575;}.bmark_db{position:fixed;top:0;bottom:0;left:0;width:350px;padding:10px;/*flex-direction:column;*/background:#17151b;color:#ddd;border-right:1px solid #333;}.bmark_db.db_shide{left:-350px;}._bmark ._db{background:#252428;color:#ddd;padding:4px 8px;margin:4px;font:14px Arial;text-transform:initial;cursor:pointer;outline:0 !important;border:1px solid #3e3949;}._bmark ._db[disabled]{color:#555;border-color:#252428;}.db_line{margin-bottom:10px;padding-bottom:10px;border-bottom:5px solid #333;}.db_line_top{margin-top:10px;padding-top:10px;border-top:5px solid #333;}.db_space{margin:10px 0;}._db.fp_content{margin:auto;}.db_text{padding:4px 8px;margin:4px;color:#ddd;}.db_btn_radio input[type="radio"]{display:none;}.db_btn_radio input[type="radio"]+label:before{content:none;}.db_btn_radio input[type="radio"]:checked+label,._bmark .db_selected,._bmark:not(.db_mobile) button:not(.db_no_hover):hover{background:#4267b2;border-color:#4267b2;}._bmark .db_active{background:#238636;border-color:#238636;}._bmark .db_danger{background:#d7382d;border-color:#d7382d;}.db_border{padding:1px 6px;border:1px solid #ddd;}._bmark select{-webkit-appearance:menulist-button;color:#ddd;}._bmark select:invalid{color:#757575;}._bmark select option{color:#ddd;}._bmark ul{padding:0;margin:0;list-style:none;}._bmark input[type="text"]{display:initial;cursor:text;height:auto;background:#252428 !important;color:#ddd !important;border:1px solid #3e3949;}._bmark input[type="text"]:hover{border-color:#3e3949;}._bmark label [type="radio"],._bmark label [type="checkbox"]{display:initial;margin:-2px 6px 0 0;vertical-align:middle;}.bmark_db:not(.db_s_shide) .db_bm_show .bm_list{max-height:25vh !important;}.db_bm_show .bm_similar .bm_main{margin:5px;border:4px solid #4267b2;}.db_bm_show .bm_similar .bm_main .bm_edit{background:#4267b2;border:0;}.db_bm_show .bm_list,.db_result .bs_list{overflow-y:auto;}.db_result li,.db_bm_show li{border-width:1px;}._bmark .db_toggle{position:absolute;bottom:0;right:-40px;align-items:center;width:40px;height:40px;font-size:30px !important;padding:0;margin:0;line-height:0;}.db_bg,.bm_index{position:fixed;top:0;bottom:0;left:0;right:0;background:rgba(0,0,0,.5);}.db_cover img{max-width:100px;}.db_radio label,.db_cbox label{display:inline-block;margin:5px 10px 5px 0;}._bmark .db_disabled{color:#555;border-color:#252428;cursor:not-allowed;}.bmark_db.db_s_shide .db_result,.db_hidden{display:none;}</style>';
    // css mobile
    b_txt += '<style>.db_mobile .bmark_db{width:80%;}.db_mobile .bmark_db.db_shide{left:-80%;}.db_mobile._bmark ._db{font-size:16px;}.db_mobile._bmark .db_toggle{right:-70px;width:70px;height:70px;background:transparent;color:#fff;border:0;}</style>';
    // html
    b_txt += '<div class="db_bg db_hidden"></div>';
    b_txt += '<div class="bmark_db db_s_shide db_shide flex_wrap f_bottom">';
    b_txt += '<div class="db_data db_100 db_hidden">';
    b_txt += '<div class="db_form flex_wrap db_hidden"></div>';
    b_txt += '<div class="db_form_btn flex db_line_top db_hidden"><button class="db_btn_gen _db">Generate</button><span class="f_grow"></span><button class="db_btn_close _db db_danger">Close</button><button class="db_set _db db_active db_no_hover db_hidden">Set</button><button class="db_btn_update _db db_active db_no_hover db_hidden">Update</button></div>';
    b_txt += '<div class="db_result db_line db_hidden"></div>';
    b_txt += '<div class="db_tr1">';
    b_txt += '<div class="db_td1">';
    b_txt += '<div class="db_bm_show db_line db_hidden"></div>';
    b_txt += '<div class="db_search db_line flex"><input class="_db db_100" type="text" placeholder="Search ('+ mydb_type +')..."><button class="_db">GO</button></div>';
    b_txt += '</div>';// .db_td1
    b_txt += '<div class="db_menu2 db_line flex_wrap db_hidden">';
    b_txt += '<div class="db_td2 db_100 db_hidden">';
    b_txt += '<div class="db_menu_selected db_text db_100">&#10095;&#10095;&#160;&#160;&#160;<b><span></span></b></div>';
    b_txt += '<div class="flex db_100 db_space" data-id="list"><button class="db_index db_list _db f_grow t_center">List (<span></span>)</button><button class="db_new _db">New &#43;</button></div>';
    b_txt += '<div class="flex db_100 db_space" data-id="source"><button class="db_index db_source _db f_grow t_center">Source (project)</button><button class="db_new _db">New &#43;</button></div>';
    b_txt += '</div>';// .db_td2
    b_txt += '<div class="db_bm_menu flex db_100">';
    b_txt += '<div class="db_btn_radio flex"><input type="radio" id="comic" name="bookmark" value="comic"><label class="_db db_comic" for="comic">Comic</label><input type="radio" id="novel" name="bookmark" value="novel"><label class="_db db_novel" for="novel">Novel</label><input type="radio" id="anime" name="bookmark" value="anime"><label class="_db db_anime" for="anime">Anime</label></div>';
    b_txt += '<span class="f_grow"></span><button class="db_out _db">&#10006;</button>';
    b_txt += '</div>';// .db_bm_menu
    b_txt += '</div>';// .db_menu2
    b_txt += '<div class="db_menu flex"><button class="db_menu_shide _db">Menu</button><span class="f_grow"></span><span class="db_total _db db_active db_hidden"></span></div>';
    b_txt += '</div>';// .db_tr1
    b_txt += '</div>';// .db_data
    b_txt += '<div class="db_login flex_wrap db_hidden">';
    b_txt += '<input class="db_email _db db_100" type="email" placeholder="Email">';
    b_txt += '<input class="db_pass _db db_100" type="password" placeholder="Password">';
    b_txt += '<div class="flex"><button class="db_in _db">Login</button><span class="lg_notif _db db_selected db_hidden"></span></div>';
    b_txt += '</div>';// .db_login
    b_txt += '<div class="db_toggle _db db_100 flex f_center">&#9733;</div>';
    b_txt += '<div class="db_notif flex flex_perfect" style="position:absolute;"><span class="_db fp_content">Loading...</span></div>';
    b_txt += '</div>';// .bmark_db
    
    var b_html = document.createElement('div');
    b_html.style.cssText = 'position:relative;z-index:2147483647;';
    b_html.className = '_bmark cbr_mod' + (is_mobile ? ' db_mobile' : '');
    b_html.innerHTML = b_txt;
    document.body.appendChild(b_html);
  }
  
  function db_startBookmark() {
    bookmarkHtml();
    
    // Check login source: https://youtube.com/watch?v=iKlWaUszxB4&t=102
    firebase.app(fbase_app).auth().onAuthStateChanged(function(user) {
      if (user) { //User is signed in.
        mydb_login = true;
        db_startData(); //Start firebase data
        el('.db_login').classList.add('db_hidden');
        el('.db_notif').classList.add('db_hidden');
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
      if (!el('.db_form').classList.contains('db_hidden') && e.keyCode == 13) {
        if (el('.db_set').classList.contains('db_hidden')) el('.db_btn_update').click();
        if (el('.db_btn_update').classList.contains('db_hidden')) el('.db_set').click();
      }
      if (e.keyCode == 13) document.activeElement.blur();
    };
    
    el('.db_toggle').onclick = function() {
      this.classList.toggle('db_selected');
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
        var errorCode = error.code;
        var errorMessage = error.message;
        el('.lg_notif').innerHTML = 'Error!!';
      });
    };
    
    el('.db_bm_menu .db_out').onclick = function() {
      if (confirm('Are you sure you want to log out?')) {
        firebase.app(fbase_app).auth().signOut();
      }
    };
    
    el('.db_menu .db_menu_shide').onclick = function() {
      db_resetMenu();
      this.classList.toggle('db_danger');
      if (this.classList.contains('db_danger')) mydb_type = mydb_type_bkp;
      el('.db_menu2').classList.toggle('db_hidden');
      //el('.db_bm_menu input[value="'+ mydb_type +'"]').checked = true;
      el('.db_td1').classList.toggle('db_hidden');
      if (is_search) el('.db_result').classList.toggle('db_hidden');
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
        mydb_select = item.parentNode.dataset.id;
        is_index = true;
        db_startIndex('start');
      });
    });
    
    el('.db_menu2 .db_new', 'all').forEach(function(item) {
      item.addEventListener('click', function() {
        mydb_select = item.parentNode.dataset.id;
        db_resetForm();
        is_form = 'new';
        el('.db_form_btn').classList.remove('db_hidden'); //always above db_formSelect()
        db_formSelect();
        el('.db_form').classList.remove('db_hidden');
        el('.db_form_btn .db_set').classList.remove('db_hidden');
        el('.db_form_btn .db_btn_update').classList.add('db_hidden');
        if (is_search) el('.bmark_db').classList.add('db_s_shide');
        el('.db_tr1').classList.add('db_hidden');
      });
    });
    
    el('.db_search button').onclick = function() {
      if (el('.db_search input').value == '') return;
      is_search = true;
      document.activeElement.blur();
      el('.db_notif span').innerHTML = 'Loading..';
      el('.db_notif').classList.remove('db_hidden');
      db_mainData('search', el('.db_search input').value);
    };
    
    // klik "Generate" harus pada halaman komik project
    el('.db_form_btn .db_btn_gen').onclick = function() {
      el('.db_host').value = wh.replace(wh_rgx, '');
      if (mydb_select == 'list') {
        var bmark_id = wp.match(id_w_rgx)[1].replace(/-(bahasa|sub(title)?)-indo(nesia)?(-online-terbaru)?/i, '').replace(/-batch/i, '').replace(/\.html?$/i, '').toLowerCase();
        el('.db_id').value = bmark_id;
        if (wp.search(/\/(title|anime|novel|series)\/\d+\//) != -1) el('.db_bmdb').value = wp.match(/\/(title|anime|novel|series)\/([^\/]+)/)[1];
        el('.db_title').value = wh.indexOf('mangacanblog') != -1 ? firstCase(bmark_id, '_') : firstCase(bmark_id, '-');
        el('.db_url').value = '//'+ wh.replace(wh_rgx, '') + wp + (wh.indexOf('webtoons') != -1 ? wl.search : '');
        el('.db_update').valueAsDate = local_date;
        
        if (mydb_type == 'comic') {
          var id_search = bmark_id.replace(/[-_\.]/g, ' ');
          el('.db_bmdb_mangadex').dataset.href = '//mangadex.org/titles?q='+ id_search;
          el('.db_bmdb_mangaupdates').dataset.href = '//mangaupdates.com/series.html?search='+ id_search;
        } else if (mydb_type == 'novel') {
          el('.db_bmdb_mangaupdates').dataset.href = '//mangaupdates.com/series.html?search='+ id_search;
        } else {
          el('.db_bmdb_myanimelist').dataset.href = '//myanimelist.net/anime.php?cat=anime&q='+ id_search;
          el('.db_bmdb_anilist').dataset.href = '//anilist.co/search/anime?search='+ id_search;
          el('.db_bmdb_anidb').dataset.href = '//anidb.net/anime/?view=grid&adb.search='+ id_search;
        }
        if (el('.db_bmdb').value == '' || el('.db_bmdb').value == 'none') {
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
        
        // if bookmark id is "none" then it must be filled
        var gen_cover = el('.seriestucontent img') || el('.animefull .bigcontent img') || el('.komikinfo .bigcontent img') || el('.profile-manga .summary_image img') || el('.series .series-thumb img') || el('#Informasi .ims img') || el('.komik_info-content-thumbnail img') || el('.info-left img') || el('meta[property="og:image"]') || false;
        if (gen_cover) {
          var cover_tag = gen_cover.tagName == 'IMG' ? gen_cover.src : el('meta[property="og:image"]').getAttribute('content');
          el('.db_image').value = cover_tag.replace(/i\d+\.wp\.com\//, '');
        }
        
        /* old: Mangadex image format, example: 
        - https://mangadex.org/images/manga/58050.jpg
        - https://mangadex.org/images/manga/58050.large.jpg
        */
      }
    };
    
    el('.db_form_btn .db_btn_close').onclick = function() {
      db_resetForm('remove');
      if (is_search) el('.bmark_db').classList.remove('db_s_shide');
      if (is_index) el('.bm_index').classList.remove('db_hidden');
    };
    
    el('.db_form_btn .db_set').onclick = function() {
      if (!db_formCheck()) return;
      el('.db_notif span').innerHTML = 'Loading..';
      el('.db_notif').classList.remove('db_hidden');
      db_checkData(db_pathId(true)).then(function(res) {
        if (!res) {
          db_changeData('set');
        } else {
          el('.db_notif span').innerHTML = (mydb_select == 'source' ? mydb_select : mydb_type) +' already exist';
          el('.db_notif span').classList.add('db_danger');
          setTimeout(function() {
            el('.db_notif').classList.add('db_hidden');
            el('.db_notif span').classList.remove('db_danger');
          }, 1500);
        }
      });
    };
    
    el('.db_form_btn .db_btn_update').onclick = function() {
      if (!db_formCheck()) return;
      el('.db_notif span').innerHTML = 'Loading..';
      el('.db_notif').classList.remove('db_hidden');
      db_changeData('update');
    };
  }
  
  var main_data, main_arr, nav_total, nav_elem, nav_current, index_data, index_arr, index_sort, index_order;
  var wl = window.location;
  var wh = wl.hostname;
  var wp = wl.pathname;
  var is_exist = false;
  var is_search = false;
  var is_form = false;
  var is_index = false;
  var is_isearch = false;
  var is_mobile = isMobile(); //from database tools
  var nav_max = 3; // result always: nav_max + 2 = 5
  var index_max = 12;
  var local_date = new Date(toISOLocal().split('T')[0]);
  
  var db_settings = {"comic":{"source":{"1_host":{"value":"hostname"},"2_domain":{"value":"alternative domain"},"3_status":{"type":"select","option":"active,discontinued"},"4_theme":{"type":"select","option":"none,themesia,madara,eastheme,koidezign,emissionhex,new_cms,reader_cms"},"5_tag":{"type":"checkbox","option":"ads_newtab,not_support,_rightclick"},"6_project":{"value":"project url"},"7_icon":{"value":"favicon url"}},"list":{"1_id":{},"2_bmdb":{"value":"comic id","next":{"mangadex":{"type":"button","value":"md","attribute":{"onclick":"window.open(this.dataset.href)"}},"mangaupdates":{"type":"button","value":"mu","attribute":{"onclick":"window.open(this.dataset.href)"}},"open":{"type":"button"}}},"3_title":{},"4_alternative":{"value":"alternative title"},"5_number":{"value":"chapter","attribute":{"onclick":"this.select()"}},"6_note":{},"7_type":{"type":"select","option":"manga,manhwa,manhua"},"8_host":{"value":"hostname"},"9_url":{"value":"comic url","next":{"open":{"type":"button","attribute":{"onclick":"window.open(this.parentNode.children[0].value)"}}}},"10_read":{"value":"link to read (if web to read is different)","next":{"open":{"type":"button","attribute":{"onclick":"window.open(this.parentNode.children[0].value)"}}}},"11_image":{"value":"cover image","next":{"open":{"type":"button","attribute":{"onclick":"window.open(this.parentNode.children[0].value)"}}}},"12_update":{"type":"date","value":"last update","next":{"before":{"type":"button"}}},"13_similar":{"value":"similar comic id"}}},"novel":{"source":{"1_host":{"value":"hostname"},"2_domain":{"value":"alternative domain"},"3_status":{"type":"select","option":"active,discontinued"},"4_theme":{"type":"select","option":"none,themesia,madara,koidezign,yuukithemes"},"5_tag":{"type":"checkbox","option":"ads_newtab,not_support,_rightclick"},"6_project":{"value":"project url"},"7_icon":{"value":"favicon url"}},"list":{"1_id":{},"2_bmdb":{"value":"novel id","next":{"mangaupdates":{"type":"button","value":"mu","attribute":{"onclick":"window.open(this.dataset.href)"}},"open":{"type":"button"}}},"3_title":{},"4_alternative":{"value":"alternative title"},"5_number":{"value":"chapter","attribute":{"onclick":"this.select()"}},"6_note":{},"7_type":{"type":"select","option":"mtl,htl"},"8_host":{"value":"hostname"},"9_url":{"value":"novel url","next":{"open":{"type":"button","attribute":{"onclick":"window.open(this.parentNode.children[0].value)"}}}},"10_image":{"value":"cover image","next":{"open":{"type":"button","attribute":{"onclick":"window.open(this.parentNode.children[0].value)"}}}},"11_update":{"type":"date","value":"last update","next":{"before":{"type":"button"}}},"12_similar":{"value":"similar novel id"}}},"anime":{"source":{"1_host":{"value":"hostname"},"2_domain":{"value":"alternative domain"},"3_status":{"type":"select","option":"active,discontinued"},"4_theme":{"type":"select","option":"none,themesia,eastheme,koidezign"},"5_tag":{"type":"checkbox","option":"ads_newtab,not_support,_rightclick"},"6_project":{"value":"project url"},"7_icon":{"value":"favicon url"}},"list":{"1_id":{},"2_bmdb":{"value":"anime id","next":{"myanimelist":{"type":"button","value":"mal","attribute":{"onclick":"window.open(this.dataset.href)"}},"anilist":{"type":"button","value":"al","attribute":{"onclick":"window.open(this.dataset.href)"}},"anidb":{"type":"button","value":"adb","attribute":{"onclick":"window.open(this.dataset.href)"}},"open":{"type":"button"}}},"3_title":{},"4_alternative":{"value":"alternative title"},"5_number":{"value":"episode","attribute":{"onclick":"this.select()"}},"6_note":{},"7_host":{"value":"hostname"},"8_url":{"value":"anime url","next":{"open":{"type":"button","attribute":{"onclick":"window.open(this.parentNode.children[0].value)"}}}},"9_image":{"value":"cover image","next":{"open":{"type":"button","attribute":{"onclick":"window.open(this.parentNode.children[0].value)"}}}},"10_update":{"type":"date","value":"last update","next":{"before":{"type":"button"}}},"11_similar":{"value":"similar novel id"}}}};
  
  var db_check = setInterval(function() {
    if (typeof firebase !== 'undefined' && typeof firebase.database !== 'undefined' && typeof firebase.auth !== 'undefined') {
      clearInterval(db_check);
      db_startBookmark();
      
      /* always check & update source */
      crossStorage.get('mydb_source_data', function(res) {
        mydb_change = true;
        if (res == null || res == 'error') {
          genSource('change');
        } else {
          localStorage.setItem('mydb_source_data', res);
          mydb_source = JSON.parse(res);
          genSource('check');
        }
      });
    }
  }, 100);
})();
