// Check if string is number https://stackoverflow.com/a/175787/7598333
function isNumeric(str) {
  if (typeof str != 'string') return false;
  return !isNaN(str) && !isNaN(parseFloat(str));
}

// Toggle multiple classes
function toggleClass(elem, array) {
  // example: toggleClass(document.body, ['mobile', 'no_js']);
  array.forEach(item => {
    elem.classList.toggle(item);
  });
}

// Uppercase first character
function firstUCase(str) {
  var text = str.replace(str.substring(1, 0), str.substring(1, 0).toUpperCase());
  return text;
}

// Mengambil data dari hash berdasarkan kata tertentu example: "#/page/1" get "1"
function getHash(k) {
  var rex = new RegExp('#(.*)/' + k + '/([^/]+)(/(.*))?', 'gi');
  var str = window.location.hash.replace(rex, '$2');
  return str;
}

// Position (X,Y) element https://stackoverflow.com/a/28222246
function getOffset(el, p) {
  const rect = el.getBoundingClientRect();
  var num = p == 'top' ? rect.top + window.scrollY : p == 'bottom' ? rect.bottom + window.scrollY : p == 'right' ? rect.right + window.scrollX : rect.left + window.scrollX;
  return num;
}

// Local Storage
function local(prop, name, val) {
  var methods = prop == 'get' ? 'getItem' : prop == 'set' ? 'setItem' : prop == 'remove' ? 'removeItem' : 'clear';
  if (prop == 'set') return localStorage[methods](name, val);
  if (prop == 'get' || prop == 'remove') return localStorage[methods](name);
  if (prop == 'clear') return localStorage[methods]();
}

function genArray(json) {
  var arr = [];
  for (var key in json) {
    if (key == 'check') continue;
    arr.push(json[key]);
  }
  return arr;
}

function checkReadyState() {
  var current;
  var state = ['uninitialized','loading','interactive','complete'];
  state.forEach(function(item, index) {
    if (document.readyState == item) current = index;
  });
  return current;
}

// Simple querySelector https://codepen.io/sekedus/pen/oKYOEK
function el(e, l, m) {
  var elem, parent = l != 'all' && (l || l === null) ? l : document;
  if (parent === null) {
    elem = parent;
    console.error('selector: ' + e + ' => parent: ' + parent);
  } else {
    elem = (m || l == 'all') ? parent.querySelectorAll(e) : parent.querySelector(e);
  }
  return elem;
}

// Get URL Variables https://css-tricks.com/snippets/javascript/get-url-variables/
function getParam(param, url) {
  var result = [];
  var query = url ? new URL(url) : window.location;
  query = query.search.substring(1).split('&');
  for (var i = 0; i < query.length; i++) {
    var pair = query[i].split('=');
    if (pair[0] == param) {
      result.push(pair.length == 1 ? '' : decodeURIComponent(pair[1].replace(/\+/g, ' ')));
    }
  }
  return result;
}

// Validation of file extension before upload https://stackoverflow.com/a/4237161/7598333
function fileValidate(elem, accept) {
  if (elem.type == 'file') {
    var file_name = elem.value;
    if (file_name.length > 0) {
      var valid = false;
      for (var i = 0; i < accept.length; i++) {
        if (file_name.substr(file_name.length - accept[i].length, accept[i].length).toLowerCase() == accept[i].toLowerCase()) {
          valid = true;
          break;
        }
      }
      
      if (!valid) return false;
    }
  }
  return true;
}

// Add script to head https://codepen.io/sekedus/pen/QWKYpVR
function addScript(n, o, t, e, s) {
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

// Detect mobile device https://stackoverflow.com/a/22327971/7598333
function isMobile() {
  var a = navigator.userAgent || navigator.vendor || window.opera;
  return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)));
}

// Smooth scroll to specific element https://stackoverflow.com/a/18071824/7598333
function smoothScroll(target) {
  var scrollContainer = target;
  do { //find scroll container
    scrollContainer = scrollContainer.parentNode;
    if (!scrollContainer) return;
    scrollContainer.scrollTop += 1;
  } while (scrollContainer.scrollTop == 0);

  var targetY = 0;
  do { //find the top of target relatively to the container
    if (target == scrollContainer) break;
    targetY += target.offsetTop;
  } while (target = target.offsetParent);

  scroll = function(b, a, c, k) {
    k++; if (k > 30) return;
    b.scrollTop = a + (c - a) / 30 * k;
    setTimeout(function() { scroll(b, a, c, k); }, 10);
  }
  // start scrolling
  scroll(scrollContainer, scrollContainer.scrollTop, targetY, 0);
}

// Cookies with custom timer https://codepen.io/sekedus/pen/xxYeZZj?editors=0010
var cookies = {
  set: function(name, value, interval) {
    var expires = '';
    if (interval) {
      var date = new Date();
      var timer = interval.indexOf('|') != -1 ? Number(interval.split('|')[1]) : 1;
  
      if (interval.search(/(year|month)s?/i) != -1) {
        var year_add = interval.search(/years?/i) != -1 ? timer : 0;
        var month_add = interval.search(/months?/i) != -1 ? timer : 0;
        date.setFullYear(date.getFullYear() + year_add, date.getMonth() + month_add);
      } else {
        var date_num = interval.search(/weeks?/i) != -1 ? (timer*7*24*60*60) : interval.search(/days?/i) != -1 ? (timer*24*60*60) : interval.search(/hours?/i) != -1 ? (timer*60*60) : interval.search(/minutes?/i) != -1 ? (timer*60) : timer; // default = second
        date.setTime(date.getTime() + (date_num * 1000));
      }
      expires = '; expires='+ date.toGMTString();
    }
    // if no interval, timer = session
    document.cookie = name +'='+ value + expires+'; path=/';
  },
  get: function(name) {
    // https://www.quirksmode.org/js/cookies.html
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },
  remove: function(name) {
    cookies.create(name, '', -1);
  },
};

// Lazy Loading Images
function lazyLoad(elem, note) {
  if (!elem) return;
  var lz_check_point, lz_images = elem;
  
  if (!el('#lz_check_point')) {
    lz_check_point = document.createElement('div');
    lz_check_point.id = 'lz_check_point';
    lz_check_point.style.cssText = 'position:fixed;top:0;bottom:0;left:-2px;';
    document.body.appendChild(lz_check_point);
  } else {
    lz_check_point = el('#lz_check_point');
  }

  function lazyLoadLegacy(img) {
    var lz_chk1 = (getOffset(img, 'top') + img.offsetHeight) > getOffset(lz_check_point, 'top');
    var lz_chk2 = (getOffset(img, 'bottom') - img.offsetHeight) < getOffset(lz_check_point, 'bottom');
    if ((lz_chk1 && lz_chk2 && !img.classList.contains('lazyload3d')) || (note == 'single' || note == 'all')) {
      var imgs = img.dataset.src;
      if (bmv_current == 'chapter') {
        if (bmv_load_cdn) imgs = imgs.replace(bmv_rgx_cdn, '').replace(/\/[fhwq]=[^\/]+/, '');
        if (imgs.search(/(pending\-load|cdn\.statically\.io|cdn\.imagesimple\.co)/) != -1) {
          imgs = imgs.replace(/\?(.*)/g, ''); //remove location.search ?=
        }
        if (bmv_load_gi) {
          var sNum = el('.cm_size').innerHTML;
          imgs = imgs.replace(/\/([swh]\d+)(?:-[\w]+[^\/]*)?\//, '/'+ sNum +'/');
          imgs = imgs.replace(/=[swh](\d+).*/, '='+ sNum);
          if (imgs.indexOf('docs.google') != -1) imgs = 'https://lh3.googleusercontent.com/d/'+ imgs.match(/.*id=([^&]+)/)[1] +'='+ sNum;
        }
      }
      img.className = img.className.replace('lazy1oad', 'la2yloading');
      img.onload = function() { img.style.minHeight = null };
      img.src = imgs;
      // img.removeAttribute('data-src');
      img.className = img.className.replace('la2yloading', 'lazyload3d');
    }
  }

  if ('length' in lz_images) {
    lz_images.forEach(lazyLoadLegacy);
  } else {
    lazyLoadLegacy(lz_images);
  }
}

// #===========================================================================================#

// Element selector meta tags
function bmf_emc(m, c) {
  el('meta[' + m + ']').setAttribute('content', c);
}

function bmf_meta_tags(data) {
  var d_desc = 'Baca dan download komik, manga, manhwa, manhua one shot bahasa indonesia online full page, terlengkap, gratis, loading cepat dan update setiap hari.';
  var d_key = 'baca komik, baca manga, baca manhwa, baca manhua, komik one piece, komik black clover, komik jujutsu kaisen, komik boruto, komik edens zero, baca manga android';

  var mt_title = bmv_current == 'latest' ? 'Bakomon \u2013 Baca Komik Bahasa Indonesia Online' : el('h1').textContent +' | Bakomon';
  var mt_url = wl.href;
  var mt_img = 'https://'+ wl.hostname +'/images/cover.png';
  var mt_desc = 'Baca komik dan baca manga terbaru bahasa indonesia online, bisa full page, loading cepat dan update setiap hari.';

  if (bmv_current == 'series') {
    mt_img = data.cover.replace(/\?.*/, '');
    mt_desc = data.desc.length > 87 ? data.desc.substring(0, 87) + '...' : data.desc;
  }

  if (bmv_current == 'chapter') {
    d_desc = mt_desc = 'Baca download komik '+ data.title +' volume batch bahasa indonesia pdf rar zip terlengkap.';
    d_key = d_key + ', '+ data.title +' Chapter '+ data.current;
  }

  document.title = bmv_current == 'latest' ? 'Bakomon \u2013 Baca Komik, Manga, Manhwa, Manhua Bahasa Indonesia Online' : mt_title;
  bmf_emc('name="description"', d_desc);
  bmf_emc('name="keywords"', d_key);
  bmf_emc('itemprop="name"', mt_title);
  bmf_emc('itemprop="description"', mt_desc);
  bmf_emc('itemprop="image"', mt_img);
  bmf_emc('property="og:title"', mt_title);
  bmf_emc('property="og:url"', mt_url);
  bmf_emc('property="og:image"', mt_img);
  bmf_emc('property="og:description"', mt_desc);
  bmf_emc('name="twitter:title"', mt_title);
  bmv_current == 'latest' ? bmf_emc('property="og:type"', 'website') : bmf_emc('property="og:type"', 'article');
}

// #===========================================================================================#
function bmf_window_stop() {
  window.stop();
  el('.cm_stop').classList.add('no_items');
  el('.cm_reload').classList.remove('no_items');
}

function bmf_chapter_key(e) {
  // key: left arrow
  if (e.keyCode == 37 && el('.chapter .btn.prev')) {
    el('.chapter .btn.prev').click();
  }
  // key: right arrow
  else if (e.keyCode == 39 && el('.chapter .btn.next')) {
    el('.chapter .btn.next').click();
  }
}

function bmf_chapter_direction() {
  // Manga (Japanese) - Read from right to left.
  // Manhua (Chinese) - Read from right to left.
  // Manhwa (Korean) - Read from left to right.
  var dir = bmv_el_post.dataset.type == 'manhwa' ? 'ltr' : 'rtl';
  var dir_txt = dir == 'ltr' ? 'Kiri ke Kanan' : 'Kanan ke Kiri';
  if (!el('.direction')) {
    var dir_el = document.createElement('div');
    dir_el.classList.add('direction', 'flex', 'f_perfect', dir);
    dir_el.style.setProperty('z-index', '1');
    dir_el.innerHTML = '<div class="dir-info fp_content t_center radius"><div class="dir-image"><img class="full" alt="' + dir_txt + '" src="./images/read-' + dir + '.png" title="' + dir_txt + '" alt="' + dir_txt + '"></div><div class="dir-text">' + dir_txt + '</div></div>';
    document.body.appendChild(dir_el);
  }
  setTimeout(function() { removeElem('.direction') }, 1500);
  cookies.set(bmv_zoom_id, 'true', 'hour|1');
}

function bmf_chapter_zoom(slug, type) {
  // set "zoom" for chapter
  if (!is_mobile) {
    bmv_zoom = localStorage.getItem('bmv_zoom') ? JSON.parse(localStorage.getItem('bmv_zoom')) : {}; //check localStorage
    if (slug in bmv_zoom === false) bmv_zoom[slug] = type;
    localStorage.setItem('bmv_zoom', JSON.stringify(bmv_zoom));
  }
}

// Find element on middle visible screen (viewport) https://stackoverflow.com/a/26466655/7598333
function bmf_chapter_middle() {
  var viewportHeight = document.documentElement.clientHeight;
  var found = [];
  var opts = {
    elements: el('#reader .ch-index .sticky', 'all'), 
    class: 'active',
    zone: [40, 40] // percentage distance from top & bottom
  };

  for (var i = opts.elements.length; i--;) {
      var elm = opts.elements[i];
      var pos = elm.getBoundingClientRect();
      var topPerc = pos.top    / viewportHeight * 100;
      var bottomPerc = pos.bottom / viewportHeight * 100;
      var middle = (topPerc + bottomPerc)/2;
      var inViewport = middle > opts.zone[1] && middle < (100-opts.zone[1]);

      elm.classList.toggle(opts.class, inViewport);

      if (inViewport) found.push(elm);
  }
}

function bmf_chapter_nav(note, json) {
  if (json.status_code == 200) {
    // Chapter navigation
    bmf_chapter_zoom(json.slug, json.detail.type.toLowerCase());
    bmv_el_post.setAttribute('data-type', json.detail.type.toLowerCase());

    var lists = json.chapter; //JSON data
    var str_ch_nav = '';
    str_ch_nav += '<select class="ch-number" name="index">';
    for (var i = 0; i < lists.length; i++) {
      str_ch_nav += '<option value="' + lists[i] + '"';
      if (lists[i] == bmv_dt_chapter.current) { str_ch_nav += ' selected="selected"'; }
      str_ch_nav += '>Chapter ' + lists[i] + '</option>';
    }
    str_ch_nav += '</select>';
    str_ch_nav += '<span class="f_grow"></span>';
    if (bmv_dt_chapter.prev != '') str_ch_nav += '<a class="prev ctrl btn radius" href="'+ '#/chapter/'+ json.slug +'/'+ bmv_dt_chapter.prev +'">&#9666; '+ bmv_settings.text.prev +'</a>';
    if (bmv_dt_chapter.next != '') str_ch_nav += '<a class="next ctrl btn radius" href="'+ '#/chapter/'+ json.slug +'/'+ bmv_dt_chapter.next +'">'+ bmv_settings.text.next +' &#9656;</a>';
  
    // Display chapter navigation 
    el('.chapter .ch-nav', 'all')[0].innerHTML = str_ch_nav;
    el('.chapter .ch-nav', 'all')[1].innerHTML = str_ch_nav;
    
    // if (bmv_settings.direction && !cookies.get(bmv_zoom_id)) bmf_chapter_direction(); //rtl or ltr
    
    // Left and right keyboard navigation  
    document.addEventListener('keyup', bmf_chapter_key);
  
    // Select option navigation
    el('.chapter select', 'all').forEach(item => {
      item.addEventListener('change', function() {
        var num = this.selectedIndex;
        wl.hash = '#/chapter/'+ json.slug +'/'+ this.options[num].value;
      });
    });
  }
}

function bmf_menu_key(e) {
  if ((e.altKey) && (e.keyCode == 82)) {
    el('.cm_reload').click(); //"alt & r" for reload page
  } else if ((e.altKey) && (e.keyCode == 88)) {
    el('.cm_stop').click(); //"alt & x" for stop page loading
  } else if ((e.altKey) && (e.keyCode == 65)) {
    el('.cm_ld_img').click(); //"alt & a" for load all
  } else if ((e.shiftKey) && (e.keyCode == 38)) {
    el('.cm_zoom .cm_plus').click(); //"shift & up" zoom +
  } else if ((e.shiftKey) && (e.keyCode == 40)) {
    el('.cm_zoom .cm_less').click(); //"shift & down" zoom -
  }

  // enter to load
  if (el('.cm_load .cm_all') === document.activeElement && e.keyCode == 13) {
    el('.cm_load .cm_ld_img').click();
  }

  // enter to zoom
  if (el('.cm_zoom input') === document.activeElement && e.keyCode == 13) {
    var load_zm = Number(el('.cm_zoom input').value);
    bmv_el_images.style.setProperty('max-width', load_zm +'px', 'important');
    el('.cm_zoom input').value = load_zm;
    bmv_zoom[bmv_zoom_id] = load_zm;
    localStorage.setItem('bmv_zoom', JSON.stringify(bmv_zoom));
  }
  
  if (e.keyCode == 13) document.activeElement.blur();
}

function bmf_menu_fnc(img_list) {
  if (bmv_dt_chapter.prev != '') {
    el('.cm_prev button').dataset.href = '#/chapter/'+ bmv_dt_chapter.slug +'/'+ bmv_dt_chapter.prev;
    el('.cm_prev').classList.remove('no_items');
    if (is_mobile) el('.cm_prev2').classList.remove('no_items');
  }

  if (bmv_dt_chapter.next != '') {
    el('.cm_next button').dataset.href = '#/chapter/'+ bmv_dt_chapter.slug +'/'+ bmv_dt_chapter.next;
    el('.cm_next').classList.remove('no_items');
    if (is_mobile) el('.cm_next2').classList.remove('no_items');
  }

  el('.cm_toggle').onclick = function() {
    this.classList.toggle('db_danger');
    el('.ch_menu').classList.toggle('cm_shide');
    if (is_mobile) el('.cm_bg').classList.toggle('no_items');
    if (is_mobile && el('.cm_prev button').dataset.href) el('.cm_prev2').classList.toggle('no_items');
    if (is_mobile && el('.cm_next button').dataset.href) el('.cm_next2').classList.toggle('no_items');
    el('.cm_tr2 .cm_td1').classList.toggle('no_items');
    if (is_mobile) el('.cm_pause2').classList.toggle('no_items');
  };
  
  if (is_mobile) {
    el('.cm_bg').onclick = function() {
      el('.cm_toggle').click();
    };
  }
  
  el('.cm_load input', 'all').forEach(function(item) {
    item.oninput = function() {
      if (this.value > img_list.length) this.value = img_list.length;
    };
  });
  
  // Load all images
  el('.cm_load .cm_ld_img').onclick = function() {
    if (isNumeric(el('.cm_load .cm_all').value)) {
      lazyLoad(img_list[Number(el('.cm_load .cm_all').value) - 1], 'single');
    } else {
      // "img_list" from bmf_menu_fnc() parameter
      if (!bmv_chk_from) bmv_load_cdn = true;
      el('.cm_load .cm_all').value = 'all';
      var ld_index = bmv_chk_from && el('.cm_load .cm_fr_min').value != '' ? (Number(el('.cm_load .cm_fr_min').value) - 1) : 0;
      var ld_length = bmv_chk_from && el('.cm_load .cm_fr_max').value != '' ? Number(el('.cm_load .cm_fr_max').value) : img_list.length;
      for (var i = ld_index; i < ld_length; i++) {
        lazyLoad(img_list[i], 'all');
      }
    }
  };
  
  el('.cm_load .cm_from').onclick = function() {
    var ld_from = this.classList.contains('cm_active');
    el('.cm_load .cm_all').value = 'all';
    el('.cm_load .cm_all').disabled = ld_from && !bmv_chk_pause ? false : true;
    el('.cm_load .cm_fr_min').disabled = ld_from ? true : false;
    el('.cm_load .cm_fr_max').disabled = ld_from ? true : false;
    if (ld_from) {
      el('.cm_load .cm_fr_min').value = '1';
      el('.cm_load .cm_fr_max').value = el('.cm_load .cm_fr_max').dataset.value;
    }
    bmv_chk_from = ld_from ? false : true;
    this.classList.toggle('cm_active');
  };
  
  el('.cm_load .cm_pause').onclick = function() {
    this.classList.toggle('cm_danger');
    if (is_mobile) el('.cm_pause2').classList.toggle('cm_danger');
    bmv_chk_pause = bmv_chk_pause ? false : true;
    el('.cm_ld_img').disabled = bmv_chk_pause ? true : false;
    el('.cm_load .cm_all').disabled = bmv_chk_pause ? true : false;
    if (el('.cm_load .cm_from').classList.contains('cm_active')) el('.cm_load .cm_from').click();
    el('.cm_load .cm_from').disabled = bmv_chk_pause ? true : false;
  };
  
  if (bmv_chk_gi) {
    el('.cm_size').onclick = function() {
      this.innerHTML = this.innerHTML == bmv_str_gi ? 's15000' : bmv_str_gi;
      bmv_load_gi = this.innerHTML == bmv_str_gi ? false : true;
    };
  }
  
  if (bmv_chk_cdn) {
    el('.cm_cdn').onclick = function() {
      this.innerHTML = this.innerHTML == 'CDN' ? 'not' : 'CDN';
      bmv_load_cdn = this.innerHTML == 'CDN' ? false : true;
      if (bmv_chk_gi) {
        el('.cm_size').innerHTML = 's15000';
        el('.cm_size').click();
      }
    };
  }
  
  el('.cm_zoom button', 'all').forEach(function(item) {
    item.addEventListener('click', function(e) {
      var load_zm = Number(el('.cm_zoom input').value);
      if (item.classList.contains('cm_plus')) {
        load_zm += 50;
      } else {
        load_zm += -50
      }
      bmv_el_images.style.setProperty('max-width', load_zm +'px', 'important');
      el('.cm_zoom input').value = load_zm;
      bmv_zoom[bmv_zoom_id] = load_zm;
      localStorage.setItem('bmv_zoom', JSON.stringify(bmv_zoom));
    });
  });
  
  el('.cm_stop').onclick = bmf_window_stop;
  
  // back to top
  el('.cm_top').onclick = function() {
    document.body.scrollIntoView();
  };
  
  // back to bottom
  el('.cm_bottom').onclick = function() {
    //document.body.scrollIntoView(false);
    window.scrollTo(0, bmv_el_images.scrollHeight);
  };
  
  document.addEventListener('keyup', bmf_menu_key);
  if (checkReadyState() == 3 ) bmf_window_stop(); //stop page after html and js "_reader" loaded

  // if (el('.cm_reload').classList.contains('no_items')) el('.cm_stop').click(); //auto stop page after html and js "_reader" loaded
  if (!bmv_settings.remove_statically && bmv_chk_cdn) el('.cm_cdn').click(); //auto remove cdn from statically
}

function bmf_chapter_menu() {
  var cm_size = is_mobile ? window.screen.width : bmv_zoom_id in bmv_zoom ? bmv_zoom[bmv_zoom_id] : bmv_el_images.offsetWidth;
  if (bmv_zoom_id in bmv_zoom && !is_mobile) cm_size = cm_size == 'manga' ? '800' : cm_size == 'manhua' ? '700' : cm_size == 'manhwa' ? '500' : cm_size;
  bmv_el_images.style.setProperty('max-width', cm_size +'px', 'important');
  
  // Add "chapter" menu
  var str_menu = '';
  if (is_mobile) str_menu += '<div class="cm_bg no_items"></div>';
  str_menu += '<div class="ch_menu'+ (is_mobile ? ' cm_shide' : '') +' flex_wrap f_bottom bg2">';
  str_menu += '<div class="cm_tr1 flex_wrap">';
  str_menu += '<div class="cm_others cm_line w_100 flex'+ (bmv_chk_cdn || bmv_chk_gi ? '' : ' no_items') +'">';
  if (bmv_chk_cdn) str_menu += '<div class="cm_cdn cm_btn btn" title="'+ bmv_str_cdn +'">CDN</div>';
  if (bmv_chk_gi) str_menu += '<div class="cm_size cm_btn btn">'+ bmv_str_gi +'</div>';
  str_menu += '</div>'; //.cm_others
  str_menu += '<div class="cm_nav cm_line w_100 flex'+ (bmv_dt_chapter.prev != '' || bmv_dt_chapter.next != '' ? '' : ' no_items') +'">';
  str_menu += '<div class="cm_prev no_items"><button class="cm_btn btn" title="arrow left &#9666;" onclick="window.location.href=this.dataset.href">&#9666; Prev</button></div>';
  str_menu += '<div class="cm_next no_items"><button class="cm_btn btn" title="arrow right &#9656;" onclick="window.location.href=this.dataset.href">Next &#9656;</button></div>';
  str_menu += '</div>'; //.cm_nav
  str_menu += '<div class="cm_home cm_line w_100"><button class="cm_btn btn" onclick="window.location.href=\'//\'+window.location.hostname">Homepage</button></div>';
  str_menu += '<div class="cm_load cm_line flex_wrap">';
  str_menu += '<div class="flex">';
  str_menu += '<button class="cm_ld_img cm_btn btn" title="alt + a">Load</button>';
  str_menu += '<input class="cm_all cm_input btn" value="all" onclick="this.select()">';
  str_menu += '<button class="cm_pause cm_btn btn cm_no_hover" title="Pause images from loading"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1em" height="1em" viewBox="0 0 24 24" version="1.1" x="0px" y="0px"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><path fill="currentColor" d="M15,18 L15,6 L17,6 L17,18 L15,18 Z M20,18 L20,6 L22,6 L22,18 L20,18 Z M2,5 L13,12 L2,19 L2,5 Z"></path></g></svg></button>';
  str_menu += '</div>';
  str_menu += '<div class="flex f_middle">';
  str_menu += '<button class="cm_from cm_btn btn cm_no_hover" title="Load images from [index]">From</button>';
  str_menu += '<input class="cm_fr_min cm_input btn no_arrows" type="number" value="1" onclick="this.select()" disabled>';
  str_menu += '<span>-</span>';
  str_menu += '<input class="cm_fr_max cm_input btn no_arrows" type="number" value="'+ bmv_dt_chapter.images.length +'" data-value="'+ bmv_dt_chapter.images.length +'" onclick="this.select()" disabled>';
  str_menu += '</div>';
  str_menu += '</div>';// .cm_load
  str_menu += '<div class="cm_zoom w_100"><button class="cm_plus cm_btn btn" title="shift + up">+</button><button class="cm_less cm_btn btn" title="shift + down">-</button><input style="width:50px;" class="cm_input btn" value="'+ cm_size +'"></div>';
  str_menu += '</div>';// .cm_tr1
  str_menu += '<div class="cm_tr2 '+ (is_mobile ? ' flex f_bottom' : '') +'">';
  str_menu += '<div class="cm_td1'+ (is_mobile ? '' : ' no_items') +'">';
  if (is_mobile) {
    str_menu += '<div class="cm_prev2 cm_btn btn flex f_center f_middle no_items" onclick="window.location.href=document.querySelector(\'.cm_prev button\').dataset.href">&#9666;</div>';
    str_menu += '<div class="cm_next2 cm_btn btn flex f_center f_middle no_items" onclick="window.location.href=document.querySelector(\'.cm_next button\').dataset.href">&#9656;</div>';
  }
  str_menu += '<div class="cm_load2 cm_btn btn flex f_center f_middle" onclick="document.querySelector(\'.cm_ld_img\').click()">&#671;</div>';
  str_menu += '</div>';// .cm_td1
  str_menu += '<div class="cm_td2">';
  if (is_mobile) str_menu += '<div class="cm_pause2 cm_btn btn flex f_center f_middle cm_no_hover" onclick="document.querySelector(\'.cm_pause\').click()"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1em" height="1em" viewBox="0 0 24 24" version="1.1" x="0px" y="0px"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><path fill="currentColor" d="M15,18 L15,6 L17,6 L17,18 L15,18 Z M20,18 L20,6 L22,6 L22,18 L20,18 Z M2,5 L13,12 L2,19 L2,5 Z"></path></g></svg></div>';
  str_menu += '<div class="cm_rest"><div class="cm_reload cm_btn btn flex f_center f_middle no_items" onclick="window.location.reload()" title="alt + r">&#8635;</div><div class="cm_stop cm_btn btn flex f_center f_middle" title="alt + x">&#10007;</div></div>';
  str_menu += '<div class="cm_top cm_btn btn flex f_center f_middle">&#9652;</div>';
  str_menu += '<div class="cm_bottom cm_btn btn flex f_center f_middle">&#9662;</div>';
  str_menu += '<div class="cm_toggle cm_btn btn flex f_center f_middle'+ (is_mobile ? ' cm_no_hover' : '') +'">&#174;</div>';
  str_menu += '</div>';// .cm_td2
  str_menu += '</div>';// .cm_tr2
  str_menu += '</div>';// .ch_menu

  str_menu += '';

  var cm_el = document.createElement('div');
  cm_el.style.cssText = 'position:relative;';
  cm_el.className = '_reader';
  cm_el.innerHTML = str_menu;
  document.body.appendChild(cm_el);

  bmf_menu_fnc(el('#reader img', 'all'));
}

function bmf_build_chapter(data) {
  // Display "chapter" page
  bmv_dt_chapter = data;
  bmv_zoom_id = data.slug;
  var images = data.images;
  var ch_title = data.title +' Chapter '+ data.current;
  var str_chapter = '';

  str_chapter += '<div class="ch-header layer"><h1 class="hidden_items">'+ ch_title +'</h1>';
  str_chapter += '<div class="breadcrumb'+ (is_mobile ? ' bg2 t_center' : '') +'"><a href="#/latest">Beranda</a> &#62; <a href="'+ bmv_series_list +'">Series</a> &#62; <a href="#/series/'+ data.slug +'" title="'+ data.title +'"><span class="bc-title'+ (is_mobile ? '' : ' nowrap') +'">'+ data.title +'</span></a> &#62; Chapter '+ data.current +'</div></div>';
  str_chapter += '<div class="ch-nav flex_wrap layer"><span style="height:34px;"></span></div>';
  str_chapter += '<div id="reader" class="max_chapter flex_wrap">';
  for (var i = 0; i < images.length; i++) {
    var img_attr = ch_title +' - '+ (i + 1);
    str_chapter += '<a class="ch-images full" href="'+ images[i] +'" target="_blank">';
    str_chapter += '<img style="min-height:750px;" class="full_img loading loge lazy1oad" data-src="'+ images[i] +'" title="'+ img_attr +'" alt="'+ img_attr +'">';
    str_chapter += '<div class="ch-index"><div class="sticky"><div class="btn">'+ (i + 1) +'</div></div></div>';
    str_chapter += '</a>';

    // Check CDN
    if (!bmv_chk_cdn && images[i].search(bmv_rgx_cdn) != -1) {
      bmv_chk_cdn = true;
      bmv_str_cdn = images[i].match(bmv_rgx_cdn)[1];
    }
    
    // Check Google images
    if (!bmv_chk_gi && images[i].search(bmv_rgx_gi) != -1) {
      bmv_chk_gi = true;
      bmv_str_gi = images[i].match(bmv_rgx_gi);
      bmv_str_gi = bmv_str_gi[1] || bmv_str_gi[2];
      bmv_str_gi = Number(bmv_str_gi.replace(/[swh]/,''));
      bmv_str_gi = bmv_str_gi == 0 || bmv_str_gi > 800 ? 's'+ bmv_str_gi : 's1600';
    }
  }
  str_chapter += '</div>';
  str_chapter += '<div class="ch-nav flex_wrap layer"><span style="height:34px;"></span></div>';
  el('.post-content').classList.add('full_page');
  bmv_el_post.innerHTML = str_chapter;

  document.addEventListener('scroll', bmf_chapter_middle);
  bmv_el_images = el('#reader');
  bmf_chapter_menu();
  addScript(`./api/?source=${bmv_settings['source']}&index=series&slug=${data.slug}&callback=bmf_chapter_nav`); //get data from series for type & chapter list
}

// #===========================================================================================#

function bmf_series_chapter_list(data) {
  // Display chapter list
  var str_lists = '';
  var eChapter = el('.series .chapter-list');

  str_lists += '<ul class="flex_wrap">';
  for (var i = 0; i < data.length; i++) {
    str_lists += '<li><a class="full radius" href="#/chapter/' + bmv_prm_slug + '/' + data[i] + '">Chapter ' + data[i] + '</a></li>';
  }
  str_lists += '</ul>';
  eChapter.innerHTML = str_lists;
}

function bmf_fbase_path(info) {
  var p_info = info.split('|');
  var path = `users/${fbase_user.uid}/`;
  if (p_info[0] == 'bookmark') {
    path += 'bookmark/list/';
    if (p_info[1]) path += p_info[1];
  }
  return path;
}

function bmf_fbase_gen(data) {
  return {
    slug: data.slug,
    title: data.title,
    type: data.detail.type.toLowerCase(),
    status: data.detail.status.replace(/berjalan/i, 'ongoing').replace(/tamat/i, 'completed'),
    genre: data.detail.genre.toLowerCase(),
    cover: data.cover,
    added: new Date().getTime()
  }
}

function bmf_fbase_db_check(note, path, callback) {
  fbase.database().ref(path).get('value').then(function(snapshot) {
    callback(snapshot.exists() ? true : false);
  }).catch(function(error) {
    console.error('!! Error: Firebase '+ note +'|'+ path +' bmf_fbase_db_check, code: '+ error.code +', message: '+ error.message);
    // alert('!! Error: Firebase '+ note +'|'+ path +' bmf_fbase_db_check(\n'+ error.message);
  });
}

function bmf_fbase_db_get(note, path, callback) {
  fbase.database().ref(path).get().then(function(snapshot) {
    callback(snapshot);
  }).catch(function(error) {
    console.error('!! Error: Firebase '+ note +'|'+ path +' bmf_fbase_db_get, code: '+ error.code +', message: '+ error.message);
    // alert('!! Error: Firebase '+ note +'|'+ path +' bmf_fbase_db_get(\n'+ error.message);
  });
}

// set or update
function bmf_fbase_db_change(note, path, operation, data, callback) {
  fbase.database().ref(path)[operation](data, function(error) {
    if (error) {
      console.error('!! Error: Firebase '+ note +'|'+ path +' bmf_profile_db_change, code: '+ error.code +', message: '+ error.message);
      // alert('!! Error: Firebase '+ note +'|'+ path +' bmf_profile_db_change(\n'+ error.message);
    } else {
      if (callback) callback();
    }
  });
}

function bmf_series_fnc() {
  var s_bm = el('.info-left .bookmark');

  // init check bookmark
  if (fbase_login) {
    var s_path = bmf_fbase_path(`bookmark|${bmv_dt_series.slug}`);
    bmf_fbase_db_check('series/bookmark', s_path, function(res) {
      if (res) {
        s_bm.classList.remove('wait');
        s_bm.classList.add('marked', 'red');

        // update bookmark
        var data = bmf_fbase_gen(bmv_dt_series);
        bmf_fbase_db_change('series/bookmark', s_path, 'update', data);
      } else {
        s_bm.classList.remove('wait', 'marked', 'red');
      }
    });
  } else {
    s_bm.classList.remove('wait', 'marked', 'red');
  }

  s_bm.addEventListener('click', function() {
    var slug = this.dataset.slug;

    if (fbase_login) {
      var s_path = bmf_fbase_path(`bookmark|${bmv_dt_series.slug}`);
      this.classList.add('wait');

      if (this.classList.contains('marked')) {
        if (confirm(`Hapus series >> ${slug} << dari bookmark?`)) {
          bmf_fbase_db_remove('series/bookmark', s_path, function() {
            el('.info-left .bookmark').classList.remove('wait', 'marked', 'red');
          });
        }
      } else {
        var data = bmf_fbase_gen(bmv_dt_series);
        bmf_fbase_db_change('series/bookmark', s_path, 'set', data, function() {
          el('.info-left .bookmark').classList.remove('wait');
          el('.info-left .bookmark').classList.add('marked', 'red');
        });
      }
    } else {
      wl.href = '#/member/login/?continue='+ encodeURIComponent(wl.hash);
    }
  });
}

function bmf_build_series(data) {
  // Display "series" page
  bmv_dt_series = data;
  bmf_chapter_zoom(data.slug, data.detail.type.toLowerCase());

  var str_series = '';
  str_series += '<div class="post-header flex"><h1 class="title">' + data.title + '</h1></div>';
  str_series += '<div class="flex_wrap f_between">';
  str_series += '<div class="info info-left">';
  str_series += '<div class="cover"><img class="radius full_img loading loge" src="' + data.cover + '" alt="' + data.title + '" title="' + data.title + '"></div>';
  str_series += '<div class="bookmark wait btn space-v flex f_middle f_center" data-slug="' + data.slug + '"><span class="svg"></span>Bookmark</div>';
  str_series += '<ul class="detail bg2 space-v layer radius">';
  str_series += '<li><b>Type</b> <div class="text">' + data.detail.type + '</div></li>';
  str_series += '<li><b>Status</b> <div class="text">' + data.detail.status.replace(/berjalan/i, 'Ongoing') + '</div></li>';
  str_series += '<li><b>Genre</b> <div class="text">' + data.detail.genre + '</div></li>';
  str_series += '</ul>';
  str_series += '</div>'; //.info-left
  str_series += '<span class="f_grow"></span>';
  str_series += '<div class="info info-right">';
  str_series += '<div class="summary">' + data.desc.replace(/\.\s/g, '.<div class="new_line"></div>') + '</div>';
  if (data.detail.genre.search(/adult/i) != -1) str_series += '<div class="warning t_center radius">Series ini dikategorikan sebagai Dewasa/Adult<br>MEMBACA SERIES INI DAPAT <b>MERUSAK OTAKMU</b></div>';
  str_series += '<div class="chapters">';
  if (data.chapter.length > 1) {
    str_series += '<div class="last-end flex f_between">';
    str_series += '<a class="btn t_center radius" href="#/chapter/' + data.slug + '/' + data.chapter[data.chapter.length-1] + '"><div>Chapter Awal</div><div class="char">Chapter ' + data.chapter[data.chapter.length-1] + '</div></a>';
    str_series += '<a class="btn t_center radius" href="#/chapter/' + data.slug + '/' + data.chapter[0] + '"><div>Chapter Baru</div><div class="char">Chapter ' + data.chapter[0] + '</div></a>';
    str_series += '</div>'; //.last-end
  }
  str_series += '<div class="chapter-list bg2 radius"><div class="loading loge" style="height:25vh;"></div></div>';
  str_series += '</div>'; //.chapters
  str_series += '</div>'; //.info-right
  str_series += '</div>';
  bmv_el_post.innerHTML = str_series;

  bmf_series_fnc();
  if (data.chapter.length > 0) bmf_series_chapter_list(data.chapter); //Build chapter list
}

// #===========================================================================================#

function bmf_search_result(data) {
  // Display advanced search result
  var series = data.lists; //JSON data
  
  if (data.lists.length > 0) {
    var str_result = '';
    str_result += '<div class="post"><ul class="flex_wrap">';
    for (var i = 0; i < series.length; i++) {
      str_result += '<li class="flex f_column">';
      str_result += '<div class="cover f_grow"><a href="#/series/' + series[i].slug + '" target="_blank"><img style="min-height:225px;" class="radius full_img loading loge lazy1oad" data-src="' + series[i].cover + '" alt="' + series[i].title + '" title="' + series[i].title + '"></a></div>';
      str_result += '<div class="title"><a href="#/series/' + series[i].slug + '" target="_blank"><h3 class="hd-title line_clamp">' + series[i].title + '</h3></a></div>';
      str_result += '</li>';
    }
    str_result += '</ul></div>';
    bmv_el_result.innerHTML = str_result;
  } else {
    bmv_el_result.innerHTML = '<div class="error t_center"><div class="info-result">Tidak ditemukan</div><div class="info-try">Silahkan coba lagi dengan kata kunci yang lain.</div></div>';
  }
  bmv_el_result.classList.remove('no_items');
}

function bmf_search_fill() {
  // auto fill "filter input"
  var s_wh = wl.href.replace(/\/#/, '');
  if (bmv_chk_query) {
    el('.quick-search .qs-field').value = getParam('query', s_wh)[0];
    el('.search .post-header span').innerHTML = getParam('query', s_wh)[0];
  }

  var adv_wh = getParam('params', s_wh)[0];
  adv_wh = wl.protocol +'//'+ wl.hostname +'/'+ decodeURIComponent(adv_wh);
  if (getParam('title', adv_wh).length > 0) el('.filter .s-title').value = getParam('title', adv_wh)[0];
  if (getParam('status', adv_wh).length > 0) el('.filter .s-status[value="'+ getParam('status', adv_wh)[0] +'"]').checked = true;
  if (getParam('format', adv_wh).length > 0) el('.filter .s-format[value="'+ getParam('format', adv_wh)[0] +'"]').checked = true;
  if (getParam('type', adv_wh).length > 0) el('.filter .s-type[value="'+ getParam('type', adv_wh)[0] +'"]').checked = true;
  if (getParam('order', adv_wh).length > 0) el('.filter .s-order[value="'+ getParam('order', adv_wh)[0] +'"]').checked = true;
  if (getParam('genre[]', adv_wh).length > 0) {
    var adv_genre = getParam('genre[]', adv_wh);
    for (var i = 0; i < adv_genre.length; i++) {
      el('.filter .s-genre[value="'+ getParam('genre[]', adv_wh)[i] +'"]').checked = true;
    }
  }
}

function bmf_search_adv_value(elem, param) {
  var s_value = elem.value == '' ? '' : ('&'+ param +'='+ elem.value);
  return s_value;
}

function bmf_search_adv_param(info) {
  var s_title = bmv_settings.source.search(/bacakomik|komikindo/) == -1 ? '' : bmf_search_adv_value(el('.s-title'), 'title');
  var s_status = bmf_search_adv_value(el('.s-status:checked'), 'status');
  var s_format = bmv_settings.source.search(/bacakomik|komikindo/) == -1 ? '' : bmf_search_adv_value(el('.s-format:checked'), 'format');
  var s_type = bmf_search_adv_value(el('.s-type:checked'), 'type');
  var s_order = bmf_search_adv_value(el('.s-order:checked'), 'order');

  var s_genre = el('.s-genre:checked', 'all');
  var s_genre_val = '';
  if (s_genre.length > 0) {
    for (var i = 0; i < s_genre.length; i++) {
      s_genre_val += bmf_search_adv_value(s_genre[i], 'genre%5B%5D');
    }
  }

  var s_param = s_title + s_status + s_format + s_type + s_order + s_genre_val;
  
  if (s_param != '') wl.hash = '#/search/?params='+ encodeURIComponent(s_param.replace(/^&/, '?'));
}

function bmf_build_search(data) {
  // Display "search" page
  bmv_dt_search = data;
  var genres = ['4-koma','action','adult','adventure','comedy','cooking','crime','demons','doujinshi','drama','ecchi','fantasy','game','ghosts','gore','harem','historical','horror','isekai','josei','kingdom','loli','magic','magical-girls','martial-arts','mature','mecha','medical','military','monster-girls','monsters','music','mystery','one-shot','parody','philosophical','police','post-apocalyptic','psychological','reincarnation','revenge','romance','samurai','school','school-life','sci-fi','seinen','shotacon','shoujo','shounen','slice-of-life','sports','super-power','superhero','supernatural','survival','system','thriller','tragedy','vampires','video-games','villainess','webtoons','wuxia'];
  var str_search = '';

  str_search += '<div class="adv-search layer2">';
  str_search += '<div class="post-header flex"><h1 class="title">'+ (bmv_chk_query ? 'Hasil Pencarian: <span></span>' : 'Advanced Search') +'</h1><span class="toggle btn t_center'+ (wh.indexOf('params=') != -1 ? '' : ' no_items') +'">+</span></div>';
  str_search += '<div class="filter'+ (wh.search(/(query|params)=/) != -1 ? ' no_items' : '') +'"><table class="full"><tbody>';
  str_search += '<tr><td>Judul</td><td><input type="text" class="s-title val" placeholder="Minimal 3 Karakter" minlength="3" value=""></td></tr>';
  str_search += '<tr><td>Status</td><td><ul class="status radio flex_wrap">';
  str_search += '<li><label class="radio"><input type="radio" class="s-status" name="s-status" value="" checked=""><span></span>All</label></li><li><label class="radio"><input type="radio" class="s-status" name="s-status" value="ongoing"><span></span>Ongoing</label></li><li><label class="radio"><input type="radio" class="s-status" name="s-status" value="completed"><span></span>Completed</label></li>';
  str_search += '</ul></td></tr>';
  str_search += '<tr><td>Format</td><td><ul class="format radio flex_wrap">';
  str_search += '<li><label class="radio"><input type="radio" class="s-format" name="s-format" value="" checked=""><span></span>All</label></li><li><label class="radio"><input type="radio" class="s-format" name="s-format" value="0"><span></span>Hitam Putih</label></li><li><label class="radio"><input type="radio" class="s-format" name="s-format" value="1"><span></span>Berwarna</label></li>';
  str_search += '</ul></td></tr>';
  str_search += '<tr><td>Type</td><td><ul class="type radio flex_wrap">';
  str_search += '<li><label class="radio"><input type="radio" class="s-type" name="s-type" value="" checked=""><span></span>All</label></li><li><label class="radio"><input type="radio" class="s-type" name="s-type" value="manga"><span></span>Manga (Jepang)</label></li><li><label class="radio"><input type="radio" class="s-type" name="s-type" value="manhwa"><span></span>Manhwa (Korea)</label></li><li><label class="radio"><input type="radio" class="s-type" name="s-type" value="manhua"><span></span>Manhua (Cina)</label></li>';
  str_search += '</ul></td></tr>';
  str_search += '<tr><td>Order by</td><td><ul class="order radio flex_wrap">';
  str_search += '<li><label class="radio"><input type="radio" class="s-order" name="s-order" value="" checked=""><span></span>All</label></li><li><label class="radio"><input type="radio" class="s-order" name="s-order" value="title"><span></span>A-Z</label></li><li><label class="radio"><input type="radio" class="s-order" name="s-order" value="titlereverse"><span></span>Z-A</label></li><li><label class="radio"><input type="radio" class="s-order" name="s-order" value="update"><span></span>Update</label></li><li><label class="radio"><input type="radio" class="s-order" name="s-order" value="latest"><span></span>Added</label></li><li><label class="radio"><input type="radio" class="s-order" name="s-order" value="popular"><span></span>Popular</label></li>';
  str_search += '</ul></td></tr>';
  str_search += '<tr><td>Genre</td><td><ul class="genres checkbox flex_wrap">';
  for (var i = 0; i < genres.length; i++) {
    str_search += '<li><label class="checkbox"><input type="checkbox" class="s-genre" value="' + genres[i] + '"><span></span>' + firstUCase(genres[i]) + '</label></li>';
  }
  str_search += '</ul></td></tr>';
  str_search += '<tr><td class="submit t_center" colspan="2"><button type="button" class="btn" id="search_btn">Search</button>&nbsp;&nbsp;<button type="button" class="btn" id="reset_btn"'+ (bmv_prm_slug ? '' : ' disabled') +'>Reset</button></td></tr>';
  str_search += '</tbody></table></div>'; //.filter
  str_search += '</div>'; //.adv-search
  str_search += '<div class="result no_items"></div>';
  el('.post-content').classList.add('full_page');
  bmv_el_post.innerHTML = str_search;

  bmv_el_result = el('.search .result');
  if (bmv_prm_slug) bmf_search_fill();
  if (data) bmf_search_result(data);

  // Show/hide filter
  el('.search .toggle').addEventListener('click', function() {
    this.classList.toggle('show');
    if (this.classList.contains('show')) {
      this.innerHTML = '-';
      el('.search .filter').classList.remove('no_items');
    } else {
      this.innerHTML = '+';
      el('.search .filter').classList.add('no_items');
    }
  });

  // Start search
  el('#search_btn').addEventListener('click', function() {
    bmf_search_adv_param('click');
  });

  // Reset value
  el('#reset_btn').addEventListener('click', function() {
    wl.hash = '#/search';
  });
}

// #===========================================================================================#

function bmf_build_latest(data) {
  // Display "latest" page
  bmv_dt_latest = data;
  var series = data.lists;
  var str_latest = '';

  str_latest += '<div class="post-header layer2"><h2 class="title">Update Komik Terbaru</h2></div>';
  str_latest += '<div class="post"><ul class="flex_wrap">';
  for (var i = 0; i < series.length; i++) {
    str_latest += '<li class="flex f_column">';
    str_latest += '<div class="cover f_grow"><a href="#/series/' + series[i].slug + '"><img style="min-height:225px;" class="radius full_img loading loge lazy1oad" data-src="' + series[i].cover + '" alt="' + series[i].title + '" title="' + series[i].title + '"></a></div>';
    str_latest += '<div class="title"><a href="#/series/' + series[i].slug + '"><h3 class="hd-title line_clamp">' + series[i].title + '</h3></a></div>';
    str_latest += '</li>';
  }
  str_latest += '</ul></div>';
  bmv_el_post.innerHTML = str_latest;
}

// #===========================================================================================#

function bmf_page_nav(data) {
  var str_nav = '';
  var rgx_nav = new RegExp(`\\/\(${bmv_current}\)\(?:\\/page\\/\\d+\)\?`, 'i');
  if (data.prev != '') {
    var prev = wh.replace(rgx_nav, '/$1/page/'+ data.prev);
    if (wl.href.indexOf('#') == -1) prev = `#/${bmv_current}/page/${data.prev}`;
    str_nav += `<a class="btn radius" href="${prev}">&#9666; ${bmv_settings.text.prev}</a>`;
  }
  if (data.next != '') {
    var next = wh.replace(rgx_nav, '/$1/page/'+ data.next);
    if (wl.href.indexOf('#') == -1) next = `#/${bmv_current}/page/${data.next}`;
    str_nav += `<a class="btn radius" href="${next}">${bmv_settings.text.next} &#9656;</a>`;
  }
  el('.page-nav').innerHTML = str_nav;
}

// #===========================================================================================#

function bmf_member_notif(info, opt) {
  if (info == 'reset') {
    el('.member .m-notif').classList.remove('error');
    el('.member .m-notif').classList.add('no_items');
    return;
  }

  var m_info = info.replace(/.*\//, '');
  var m_msg = m_info.replace(/\-/g, ' ');
  if (opt && 'message' in opt) m_msg = opt.message;

  if (info.indexOf('error') != -1) {
    if (m_info == 'wrong-password') {
      m_msg = 'Katasandi yang Kamu masukkan salah.';
      if (!fbase_login) m_msg += ' <a href="#/member/forgot">Lupa katasandi?</a>';
    }
    if (m_info == 'user-not-found') m_msg = 'Email tidak terdaftar. Periksa lagi atau <a href="#/member/signup">daftar akun baru.</a>';
    if (m_info == 'email-already-in-use') m_msg = 'Email sudah terdaftar. <a href="#/member/login">Login disini.</a>';
    if (m_info == 'confirm-password') m_msg = 'Konfirmasi katasandi <b>TIDAK SAMA</b>';
    m_msg = '<b>Error:</b> '+ m_msg +'';
    el('.member .m-notif').classList.add('error');
  } else {
    if (m_info == 'email-verification') m_msg = '<span class="success">Link verifikasi email terkirim ke <b>'+ fbase_user.email +'</b></span>\nSilahkan cek folder "Kotak Masuk" atau "Spam" di email.';
  }
  el('.member .m-notif').innerHTML = m_msg;
  el('.member .m-notif').classList.remove('no_items');
  smoothScroll(document.body);

  if (opt && 'timer' in opt) {
    var milliseconds = isNumeric(opt.timer) ? opt.timer : Number(opt.timer);
    setTimeout(function() {
      el('.member .m-notif').classList.add('no_items');
    }, milliseconds);
  }
}

function bmf_member_valid(note, elem, elem_c) {
  var m_valid = false;
  var m_msg = elem.validationMessage;

  if (elem.checkValidity()) {
    m_valid = true;

    if (note == 'cover') {
      if (!fileValidate(elem, ['png', 'gif', 'jpg', 'jpeg'])) {
        m_valid = false;
        m_msg = 'file-format-not-supported';
      }
    }
    if (note == 'pass-c') {
      if (elem.value != elem_c.value) {
        m_valid = false;
        m_msg = 'confirm-password';
      }
    }
  }

  if (!m_valid) bmf_member_notif('error/'+ m_msg);
  return m_valid;
}

function bmf_email_verification(note, user, callback) {
  fbase.auth().languageCode = 'id';
  user.sendEmailVerification({
    url: "http://localhost/bakomon/public/#/member/profile"
  }).then(() => {
    bmf_member_notif(`success/${note}/email-verification`);
    if (callback) callback();
  }).catch(function(error) {
    bmf_member_notif('error/verification/'+ error.code);
    el('.m-profile .m-detail').classList.remove('loading', 'loge');
    console.error('!! Error: Firebase sendEmailVerification, code: '+ error.code +', message: '+ error.message);
    // alert('!! Error: Firebase sendEmailVerification(\n'+ error.message);
  }); 
}

function bmf_profile_db_change(note, data, callback) {
  var c_data = JSON.parse(`{"${note}": "${data}"}`);
  fbase.database().ref(`users/${fbase_user.uid}/profile`).update(c_data, function(error) {
    if (error) {
      console.error('!! Error: Firebase '+ info +' bmf_profile_db_change, code: '+ error.code +', message: '+ error.message);
      // alert('!! Error: Firebase '+ info +' bmf_profile_db_change(\n'+ error.message);
    } else {
      callback();
    }
  });
}

function bmf_profile_change(note, info, data, callback) {
  var c_info = info.split('/');
  var c_data = note == 'email' || note == 'password' ? data : JSON.parse(`{"${c_info[1]}": "${data}"}`);

  fbase_user[c_info[0]](c_data).then(function() {
    fbase_build = false;
    if (note == 'password') {
      callback();
    } else {
      bmf_profile_db_change(note, data, callback);
    }
    if (note == 'email') bmf_email_verification('reauth', fbase_user);
  }).catch(function(error) {
    console.error('!! Error: Firebase '+ [c_info[0]] +' bmf_profile_change, code: '+ error.code +', message: '+ error.message);
    // alert('!! Error: Firebase '+ [c_info[0]] +' bmf_profile_change(\n'+ error.message);
  }); 
}

function bmf_profile_save(parent) {
  var pr_data = parent.dataset.edit;
  var m_input = el('input[name]', parent);
  var m_info = pr_data == 'name' ? 'updateProfile' : `update${firstUCase(pr_data)}`;
  m_info += '/'+ (pr_data == 'name' ? 'displayName' : pr_data);
  
  bmf_profile_change(pr_data, m_info, m_input.value, function() {
    bmf_member_notif(`success/profile_save/${pr_data}-saved`, {timer: 2000, message: '<span class="success">Berhasil disimpan.</span>'});
    if (pr_data == 'email') removeElem(el('.m-email .m-verified'));
    el('.m-profile .m-detail').classList.remove('loading', 'loge');
    el('.m-edit', parent).classList.remove('no_items');
    el('.m-save', parent).parentElement.classList.add('no_items');
    if (pr_data == 'password') {
      el('.m-pass-c', parent).value = '';
      el('.m-pass-n', parent).value = '';
      el('.m-pass-n', parent).parentElement.classList.add('no_items');
      el('input[type=text]', parent).classList.remove('no_items');
    } else {
      m_input.dataset.value = m_input.value;
      m_input.readOnly = true;
    }
  });
}

function bmf_member_bookmark_fnc() {
  var m_path = bmf_fbase_path('bookmark');
  bmf_fbase_db_get('member/bookmark', m_path, function(res) {
    el('.m-bookmark .m-bm-list').classList.remove('loading', 'loge');
    if (res.val()) {
      var bm_data = genArray(res.val());
      var str_bm = '';

      str_bm += '<div class="post"><ul class="flex_wrap">';
      for (var i = 0; i < bm_data.length; i++) {
        str_bm += '<li class="flex f_column">';
        str_bm += '<div class="cover f_grow"><a href="#/series/' + bm_data[i].slug + '" target="_blank"><img style="min-height:225px;" class="radius full_img loading loge lazy1oad" data-src="' + bm_data[i].cover + '" alt="' + bm_data[i].title + '" title="' + bm_data[i].title + '"></a></div>';
        str_bm += '<div class="title"><a href="#/series/' + bm_data[i].slug + '" target="_blank"><h3 class="hd-title line_clamp">' + bm_data[i].title + '</h3></a></div>';
        str_bm += '</li>';
      }
      str_bm += '</ul></div>';
      el('.m-bookmark .m-bm-list').innerHTML = str_bm;
      el('.post-header h1 span').innerHTML = bm_data.length +'/100';
      el('.post-header h1 span').classList.add('m-total', 'btn');
  
      lazyLoad(el('img.lazy1oad', 'all')); //first load
      document.addEventListener('scroll', bmf_page_scroll);
    } else {
      el('.m-bookmark .m-bm-list').innerHTML = '<div class="flex f_middle f_center full" style="min-height:225px;">Bookmark Kosong</div>';
    }
  });
}

function bmf_member_profile_fnc() {
  // member: edit button
  el('.m-profile .m-edit', 'all').forEach(function(item) {
    item.addEventListener('click', function() {
      bmf_member_notif('reset');

      var parent = this.parentElement;
      var pr_data = parent.dataset.edit;
      this.classList.add('no_items');
      el('.m-profile .m-'+ pr_data).classList.add('edit');
      if (pr_data != 'cover') el('.m-save', parent).parentElement.classList.remove('no_items');

      if (pr_data == 'cover') {
        el('.m-upload', parent).classList.remove('no_items');
      }

      if (pr_data == 'name' || pr_data == 'email') {
        el('input', parent).readOnly = false;
        el('input', parent).select();

        // https://stackoverflow.com/a/7445389/7598333
        // if (pr_data == 'name') {
        //   el('input', parent).focus();
        //   var length = el('input', parent).value.length;  
        //   el('input', parent).setSelectionRange(length, length);  
        // } else {
        //   el('input', parent).select();
        // }
      }

      if (pr_data == 'password') {
        el('input[type=text]', parent).classList.add('no_items');
        el('.m-pass-n', parent).parentElement.classList.remove('no_items');
        el('.m-pass-n', parent).focus();
      }

      if (pr_data == 'delete') {
        parent.classList.add('f_center', 'active', 'layer');
        el('.m-delete .m-label').classList.add('no_items');
        el('.m-text', parent).classList.remove('no_items');
      }
    });
  });

  // member: cancel button
  el('.m-profile .m-cancel', 'all').forEach(function(item) {
    item.addEventListener('click', function() {
      bmf_member_notif('reset');
      if (document.getSelection().toString() != '') document.getSelection().collapseToEnd();

      var parent = this.parentElement.parentElement;
      var pr_data = parent.dataset.edit;
      el('.m-edit', parent).classList.remove('no_items');
      el('.m-profile .m-'+ pr_data).classList.remove('edit');

      if (pr_data == 'cover') {
        el('.m-upload', parent).classList.add('no_items');
      }

      if (pr_data != 'cover') {
        this.parentElement.classList.add('no_items');
      }

      if (pr_data == 'name' || pr_data == 'email') {
        el('input', parent).value = el('input', parent).dataset.value;
        el('input', parent).readOnly = true;
      }

      if (pr_data == 'password') {
        el('.m-pass-c', parent).value = '';
        el('.m-pass-n', parent).value = '';
        el('.m-pass-n', parent).parentElement.classList.add('no_items');
        el('input[type=text]', parent).classList.remove('no_items');
      }

      if (pr_data == 'delete') {
        parent.classList.remove('f_center', 'active', 'layer');
        el('.m-delete .m-label').classList.remove('no_items');
        el('.m-text', parent).classList.add('no_items');
      }
    });
  });

  // member: save button
  el('.m-profile .m-save', 'all').forEach(function(item) {
    item.addEventListener('click', function() {
      bmf_member_notif('reset');

      var parent = this.parentElement.parentElement;
      var pr_data = parent.dataset.edit;

      if (pr_data == 'delete') {
        el('.m-reauth .r-save').dataset.active = pr_data;
        el('.m-reauth').classList.remove('no_items');
        el('.m-reauth input').focus();
        return;
      }

      var in_elem = el('input[name]', parent);
      if (!bmf_member_valid(pr_data, in_elem)) return;
      el('.m-reauth input').placeholder = pr_data == 'password' ? 'Old Password' : 'Password';
      
      if (pr_data == 'cover' && el('.m-file', parent).files.length > 0) {
        parent.classList.add('loading', 'loge');
        file = el('.m-file', parent).files[0];
        var storage_ref = fbase.storage().ref('users').child(fbase_user.uid);

        storage_ref.put(file).then(function() {
          storage_ref.getDownloadURL().then(function(url) {
            bmf_profile_change(pr_data, 'updateProfile/photoURL', url, function() {
              parent.classList.remove('loading', 'loge');
              el('.m-edit', parent).classList.remove('no_items');
              el('.m-upload', parent).classList.add('no_items');
              el('img', parent).src = url;
            });
          });
        });
      }

      if (pr_data == 'name' || pr_data == 'email') {
        if (in_elem.value == in_elem.dataset.value) return;
        
        if (pr_data == 'name') {
          el('.m-profile .m-detail').classList.add('loading', 'loge');
          bmf_profile_save(parent);
        } else {
          el('.m-reauth .r-save').dataset.active = pr_data;
          el('.m-reauth').classList.remove('no_items');
          el('.m-reauth input').focus();
        }
      }

      if (pr_data == 'password') {
        if (bmf_member_valid('pass', in_elem) && bmf_member_valid('pass-c', in_elem, el('.m-pass-c', parent))) {
          el('.m-reauth .r-save').dataset.active = pr_data;
          el('.m-reauth').classList.remove('no_items');
          el('.m-reauth input').focus();
        }
      }
    });
  });

  el('.m-cover .m-file').addEventListener('change', function() {
    if (this.files.length > 0) {
      el('.m-cover label span').innerHTML = this.files[0].name;
    } else {
      el('.m-cover label span').innerHTML = 'Choose File...';
    }
  });

  if (el('.m-email .m-verified.not')) {
    el('.m-email .m-verified.not').addEventListener('click', function() {
      if (this.classList.contains('wait')) return;
      el('.m-profile .m-detail').classList.add('loading', 'loge');
      bmf_email_verification('verify', fbase_user, function() {
        el('.m-profile .m-detail').classList.remove('loading', 'loge');
        el('.m-email .m-verified.not').innerHTML = 'Kirim ulang link verifikasi email dalam (<b>60</b>) detik</b>';
        el('.m-email .m-verified.not').classList.add('wait');
        
        var timeleft = 60;
        var verifyTimer = setInterval(function() {
          timeleft--;
          el('.m-email .m-verified.not b').innerHTML = timeleft;
          if (timeleft <= 0) {
            clearInterval(verifyTimer);
            el('.m-email .m-verified.not').classList.remove('wait');
            el('.m-email .m-verified.not').innerHTML = 'Email belum diverifikasi. <b>Verifikasi sekarang</b>';
          }
        }, 1000);
      });
    });
  }
  
  // member: reauthenticate save
  el('.m-reauth .r-save').addEventListener('click', function() {
    bmf_member_notif('reset');

    if (bmf_member_valid('pass', el('.m-reauth input'))) {
      var credential = firebase.auth.EmailAuthProvider.credential(fbase_user.email, el('.m-reauth input').value);
      el('.m-reauth').classList.add('no_items');
      el('.m-reauth input').value = ''; //reset
      el('.m-profile .m-detail').classList.add('loading', 'loge');
      
      fbase_user.reauthenticateWithCredential(credential).then(function() {
        var a_data = el('.m-reauth .r-save').dataset.active;
        if (a_data == 'delete') {
          // remove from database
          bmf_fbase_db_remove('remove-user', `users/${fbase_user.uid}`, function() {
            console.warn(`${fbase_user.email} user data removed from database`);
            // remove from users list
            fbase_user.delete().then(function() {
              console.warn(`${fbase_user.email} user account removed`);
              fbase_build = false;
              wl.href = '#/latest';
            }).catch(function(error) {
              console.error('!! Error: Firebase delete(), code: '+ error.code +', message: '+ error.message);
              alert('!! Error: Firebase delete(\n'+ error.message);
            });
          });
        } else {
          bmf_profile_save(el(`.m-profile .m-${a_data}.m-input`));
        }
      }).catch(function(error) {
        bmf_member_notif('error/reauth/'+ error.code);
        el('.m-profile .m-detail').classList.remove('loading', 'loge');
        console.error('!! Error: Firebase reauthenticateWithCredential, code: '+ error.code +', message: '+ error.message);
        // alert('!! Error: Firebase reauthenticateWithCredential(\n'+ error.message);
      });
    }
  });
  
  el('.m-reauth .r-cancel').addEventListener('click', function() {
    el('.m-reauth').classList.add('no_items');
  });
}

// signup, login, forgot
function bmf_member_form_fnc() {
  var m_parent = el('.member .content');

  // prevent form submit
  if (el('form', m_parent)) {
    el('.member .m-form').addEventListener('submit', function(e) {
      e.preventDefault();
    });
  }

  if (bmv_prm_slug == 'login') {
    el('.form-login .m-submit').addEventListener('click', function() {
      bmf_member_notif('reset');
      
      var m_email = el('.form-login .m-email');
      var m_pass = el('.form-login .m-pass');

      if (bmf_member_valid('email', m_email) && bmf_member_valid('pass', m_pass)) {
        m_parent.classList.add('loading', 'loge');
        
        fbase.auth().signInWithEmailAndPassword(m_email.value, m_pass.value).then(function(user) {
          fbase_build = false;
          if (wl.href.indexOf('continue') != -1) {
            var n_hash = getParam('continue', wl.href.replace(/\/#/, ''));
            wl.href = decodeURIComponent(n_hash);
          } else {
            wl.href = '#/member/profile';
          }
        }).catch(function(error) {
          var m_msg = error.code == 'auth/user-disabled' ? `Akun dengan email <b>${m_email.value}</b> telah dinonaktifkan.` : null;
          bmf_member_notif('error/login/'+ error.code, {message: m_msg});
          m_parent.classList.remove('loading', 'loge');
          console.error('!! Error: Firebase signInWithEmailAndPassword, code: '+ error.code +', message: '+ error.message);
          // alert('!! Error: Firebase signInWithEmailAndPassword(\n'+ error.message);
        });
      }
    });
  }

  if (bmv_prm_slug == 'forgot') {
    el('.form-forgot .m-submit').addEventListener('click', function() {
      bmf_member_notif('reset');
      var m_email = el('.form-forgot .m-email');
      
      if (bmf_member_valid('email', m_email)) {
        m_parent.classList.add('loading', 'loge');
        
        fbase.auth().languageCode = 'id';
        fbase.auth().sendPasswordResetEmail(m_email.value, {url:"http://localhost/bakomon/public/#/member/login"}).then(function() {
          m_parent.classList.remove('loading', 'loge');
          bmf_member_notif('success/forgot/password-reset', {message:'<span class="success">Link reset password terkirim ke <b>'+ m_email.value +'</b></span>\nSilahkan cek folder "Kotak Masuk" atau "Spam" di email.'});
        }).catch(function(error) {
          console.error('!! Error: Firebase sendPasswordResetEmail, code: '+ error.code +', message: '+ error.message);
          alert('!! Error: Firebase sendPasswordResetEmail(\n'+ error.message);
        });
      }
    });
  }

  if (bmv_prm_slug == 'signup') {
    el('.form-signup .m-submit').addEventListener('click', function() {
      bmf_member_notif('reset');
      
      var m_name = el('.form-signup .m-name');
      var m_email = el('.form-signup .m-email');
      var m_pass = el('.form-signup .m-pass');
      var m_pass_c = el('.form-signup .m-pass-c');

      if (bmf_member_valid('name', m_name) && bmf_member_valid('email', m_email) && bmf_member_valid('pass', m_pass) && bmf_member_valid('pass-c', m_pass, m_pass_c)) {
        m_parent.classList.add('loading', 'loge');
        
        fbase.auth().createUserWithEmailAndPassword(m_email.value, m_pass.value).then(function(res) {
          fbase_user = res.user;
          fbase_build = false;

          fbase_user.updateProfile({ displayName: m_name.value }).catch(function(error) {
            console.error('!! Error: Firebase (signup) set name to displayName, code: '+ error.code +', message: '+ error.message);
            alert('!! Error: Firebase (signup) set name to displayName\n'+ error.message);
          });
          
          var m_profile = {
            uid: fbase_user.uid,
            name: m_name.value,
            email: m_email.value,
            cover: ""
          };
          fbase.database().ref(`users/${fbase_user.uid}/profile`).set(m_profile, function(error) {
            if (error) {
              console.error('!! Error: Firebase (signup) set profile to database, code: '+ error.code +', message: '+ error.message);
              alert('!! Error: Firebase (signup) set profile to database\n'+ error.message);
            } else {
              bmf_email_verification('signup', fbase_user, function() {
                m_parent.classList.remove('loading', 'loge');
              });
            }
          });
        }).catch(function(error) {
          bmf_member_notif('error/signup/'+ error.code);
          m_parent.classList.remove('loading', 'loge');
          console.error('!! Error: Firebase createUserWithEmailAndPassword, code: '+ error.code +', message: '+ error.message);
          // alert('!! Error: Firebase createUserWithEmailAndPassword(\n'+ error.message);
        });
      }
    });
  }
}

function bmf_member_fnc() {
  if (fbase_login) {
    // el('.member .logout').addEventListener('click', bmf_fbase_logout);
  
    if (bmv_prm_slug == 'profile') bmf_member_profile_fnc();
    if (bmv_prm_slug == 'bookmark') bmf_member_bookmark_fnc();
  } else {
    bmf_member_form_fnc();
  }
}

function bmf_build_member() {
  // Display "member" page
  var str_member = '';

  str_member += '<div class="post-header flex f_middle f_between">';
  str_member += '<h1 class="title">Member: '+ firstUCase(bmv_prm_slug) +' <span></span></h1>';
  str_member += '<span class="m-nav"></span>';
  // if (fbase_login) str_member += '<span class="logout btn t_center" title="Logout"><svg height="18" width="18" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M400 54.1c63 45 104 118.6 104 201.9 0 136.8-110.8 247.7-247.5 248C120 504.3 8.2 393 8 256.4 7.9 173.1 48.9 99.3 111.8 54.2c11.7-8.3 28-4.8 35 7.7L162.6 90c5.9 10.5 3.1 23.8-6.6 31-41.5 30.8-68 79.6-68 134.9-.1 92.3 74.5 168.1 168 168.1 91.6 0 168.6-74.2 168-169.1-.3-51.8-24.7-101.8-68.1-134-9.7-7.2-12.4-20.5-6.5-30.9l15.8-28.1c7-12.4 23.2-16.1 34.8-7.8zM296 264V24c0-13.3-10.7-24-24-24h-32c-13.3 0-24 10.7-24 24v240c0 13.3 10.7 24 24 24h32c13.3 0 24-10.7 24-24z"></path></svg></span>';
  str_member += '</div>'; //.post-header
  str_member += '<div class="content '+ (fbase_login ? 'login' : 'not-login bg2 layer radius') +'">';
  str_member += '<div class="m-notif m-text t_center'+ (fbase_login ? ' bg2 layer radius' : '') +' no_items"></div>';
  if (fbase_login) {
    str_member += '<div class="m-'+ bmv_prm_slug +' flex_wrap';
    if (bmv_prm_slug == 'profile') {
      str_member += ' f_between">';
      str_member += '<div class="m-cover" data-edit="cover">';
      str_member += '<img class="full_img loading loge radius" src="'+ (fbase_user.photoURL ? fbase_user.photoURL : 'https://www.gravatar.com/avatar/?d=mp&s=160') +'" alt="Profile Picture">';
      str_member += '<button class="m-edit btn full m-space-v">Edit</button>';
      str_member += '<div class="m-upload flex_wrap no_items">';
      str_member += '<label class="m-space-v full"><input class="m-file no_items" type="file" name="avatar" accept="image/png, image/jpeg, image/gif" required><span class="line_clamp lc1">Choose File...</span></label>';
      str_member += '<button class="m-save btn">Simpan</button>';
      str_member += '<button class="m-cancel btn selected">Batal</button>';
      str_member += '</div>'; //.m-upload
      str_member += '</div>'; //.m-cover
      str_member += '<div class="m-detail bg2 layer radius">';
      str_member += '<div class="m-name flex_wrap">';
      str_member += '<div class="m-label">Nama</div>';
      str_member += '<div class="m-input flex_wrap f_grow" data-edit="name">';
      var m_name = fbase_user.displayName ? fbase_user.displayName : '';
      str_member += '<input class="f_grow" type="text" name="log" placeholder="Name" value="'+ m_name +'" data-value="'+ m_name +'" required readonly>';
      str_member += '<button class="m-edit btn">Edit</button>';
      str_member += '<div class="flex no_items"><button class="m-save btn m-space-h">Simpan</button><button class="m-cancel btn selected">Batal</button></div>';
      str_member += '</div>'; //.m-input
      str_member += '</div>'; //.m-name
      str_member += '<div class="m-email flex_wrap m-space-v'+ (fbase_user.emailVerified ? ' verified' : '') +'">';
      str_member += '<div class="m-label">Email</div>';
      str_member += '<div class="m-input flex_wrap f_top f_grow" data-edit="email">';
      str_member += '<div class="m-email-i f_grow">';
      str_member += '<input class="full" type="email" name="email" placeholder="Email" value="'+ fbase_user.email +'" data-value="'+ fbase_user.email +'" required readonly>';
      if (fbase_user.emailVerified) {
        str_member += '<span class="m-verified" title="Email Verified">&#10004;</span>';
      } else {
        str_member += '<div class="m-verified not">Email belum diverifikasi. <b>Verifikasi sekarang</b></div>';
      }
      str_member += '</div>'; //.m-email-i
      str_member += '<button class="m-edit btn">Edit</button>';
      str_member += '<div class="flex no_items"><button class="m-save btn m-space-h">Simpan</button><button class="m-cancel btn selected">Batal</button></div>';
      str_member += '</div>'; //.m-input
      str_member += '</div>'; //.m-email
      str_member += '<div class="m-password flex_wrap m-space-v">';
      str_member += '<div class="m-label">Password</div>';
      str_member += '<div class="m-input flex_wrap f_top f_grow" data-edit="password">';
      str_member += '<input class="f_grow" type="text" placeholder="••••••••" value="" readonly>';
      str_member += '<div class="f_grow no_items"><input class="m-pass-n full" type="password" name="password" placeholder="New Password" value="" minlength="8" required><input class="m-pass-c m-space-v full" type="password" name="password" placeholder="Confirm New Password" value="" minlength="8" required></div>';
      str_member += '<button class="m-edit btn">Edit</button>';
      str_member += '<div class="flex no_items"><button class="m-save btn m-space-h">Simpan</button><button class="m-cancel btn selected">Batal</button></div>';
      str_member += '</div>'; //.m-input
      str_member += '</div>'; //.m-password
      str_member += '<div class="m-delete flex_wrap">';
      str_member += '<div class="m-label">Hapus Akun</div>';
      str_member += '<div class="m-input flex_wrap f_grow" data-edit="delete">';
      str_member += '<button class="m-edit btn selected">Hapus Permanen</button>';
      str_member += '<div class="m-text t_center no_items">Semua data Bookmark, History, dan Pengaturan pada akun ini akan dihapus secara permanen dan tidak dapat dikembalikan, apakah Kamu yakin?</div>';
      str_member += '<div class="flex no_items"><button class="m-save btn red m-space-h">Ya</button><button class="m-cancel btn selected">Batal</button></div>';
      str_member += '</div>'; //.m-input
      str_member += '</div>'; //.m-delete
      str_member += '</div>'; //.m-detail
    } else if (bmv_prm_slug == 'bookmark') {
      str_member += '">';
      str_member += '<div class="full"><div class="m-text t_center bg2 layer radius">Kamu dapat menyimpan daftar series di sini hingga <b>100</b> judul</div></div>';
      str_member += '<div class="m-bm-list full loading loge"><div class="flex f_middle f_center full" style="min-height:225px;">Loading</div></div>';
    } else if (bmv_prm_slug == 'history') {
      str_member += 'test history';
      str_member += '';
      str_member += '';
    } else { //settings
      str_member += 'test settings';
      str_member += '';
      str_member += '';
    }
    str_member += '</div>';
    str_member += '<div class="m-reauth flex f_perfect no_items"><div class="fp_content"><div class="fp_content"><input type="password" name="password" placeholder="Password" value=""><div class="flex full f_between m-space-v"><button class="r-save btn f_grow" data-active="">OK</button><button class="r-cancel btn selected f_grow" style="margin-left:15px;">Batal</button></div></div></div>';
  } else {
    str_member += '<form class="m-form form-'+ bmv_prm_slug +'" onsubmit="return false">';
    str_member += '<div class="form-email">';
    if (bmv_prm_slug == 'forgot') str_member += '<div class="m-text t_center">Masukkan alamat email yang terdaftar, link untuk reset katasandi akan dikirim melalui email.</div>';
    if (bmv_prm_slug == 'signup') str_member += '<div class="m-group flex_wrap"><label for="name">Nama</label><input type="text" name="log" class="m-name full" id="name" placeholder="Name" value="" required></div>';
    str_member += '<div class="m-group flex_wrap"><label for="email">Email</label><input type="email" class="m-email full" id="email" placeholder="Email" value="" required></div>';
    if (bmv_prm_slug != 'forgot') str_member += '<div class="m-group flex_wrap"><label for="password">Katasandi</label><input type="password" class="m-pass full" id="password" placeholder="Password" value="" minlength="8" required></div>';
    if (bmv_prm_slug == 'login') {
      str_member += '<button type="submit" class="m-submit btn full">MASUK</button>';
      str_member += '<div class="m-text t_center">Lupa katasandi? <a href="#/member/forgot">klik disini</a></div>';
      str_member += '<div class="m-text t_center">Belum punya akun? <a href="#/member/signup">daftar disini</a></div>';
    } else if (bmv_prm_slug == 'forgot') {
      str_member += '<button type="submit" class="m-submit btn full">KIRIM</button>';
      str_member += '<div class="m-text t_center">Belum punya akun? <a href="#/member/signup">daftar disini</a></div>';
    } else { //signup
      str_member += '<div class="m-group flex_wrap"><label for="c-password">Konfirmasi Katasandi</label><input type="password" class="m-pass-c full" id="c-password" placeholder="Confirm Password" value="" minlength="8" required></div>';
      str_member += '<button type="submit" class="m-submit btn full">DAFTAR</button>';
      str_member += '<div class="m-text t_center">Sudah punya akun? <a href="#/member/login">masuk disini</a></div>';
    }
    str_member += '</div>'; //.form-email
    str_member += '</form>';
    str_member += '<div class="m-separator t_center"><span>ATAU</span></div>';
    str_member += '<div class="form-social">';
    str_member += '<button class="m-google btn full flex f_center f_middle"><svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 0 1-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z" fill="#4285F4"></path><path d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0 0 10 20z" fill="#34A853"></path><path d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 0 0 0 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z" fill="#FBBC05"></path><path d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.192 5.736 7.396 3.977 10 3.977z" fill="#EA4335"></path></g></svg><span>'+ (bmv_prm_slug == 'signup' ? 'Daftar' : 'Masuk') +' dengan Google</span></button>';
    str_member += '<button class="m-facebook btn full flex f_center f_middle"><svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.5 2 2 6.5 2 12c0 5 3.7 9.1 8.4 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7C18.3 21.1 22 17 22 12c0-5.5-4.5-10-10-10z"></path></svg><span>'+ (bmv_prm_slug == 'signup' ? 'Daftar' : 'Masuk') +' dengan Facebook</span></button>';
    str_member += '</div>'; //.form-social
  }
  str_member += '</div>'; //.content
  bmv_el_post.innerHTML = str_member;
  el('.post-content').classList.add('full_page');
  if (!fbase_login) el('.main').style.setProperty('max-width', '500px');

  bmf_member_fnc();
}

// #===========================================================================================#

function bmf_build_footer() {
  var str_footer = '<div class="footer max layer">';
  if (bmv_current != 'chapter') str_footer += '<div class="message bg2 t_center layer radius">Semua komik di website ini hanya preview dari komik aslinya, mungkin terdapat banyak kesalahan bahasa, nama tokoh, dan alur cerita. Dukung mangakanya dengan membeli komik aslinya jika tersedia di kotamu!</div>';
  str_footer += '<div class="flex_wrap '+ (is_mobile ? 'f_center t_center' : 'f_between') +'">';
  str_footer += '<div class="footer-left">© '+ new Date().getFullYear() +' Bakomon, Made with \ud83d\udc96 & \ud83d\ude4c by <a href="https://github.com/bakomon/bakomon" target="_blank" title="Bakomon">Bakomon</a></div>';
  str_footer += '<div class="footer-right"><a href="#/latest">Beranda</a><span>|</span><a href="'+ bmv_series_list +'">Daftar Komik</a><span>|</span><a href="#/search" title="Advanced search">Advanced search</a></div>';
  str_footer += '</div>';
  str_footer += '</div>';
  if (bmv_current != 'chapter') str_footer += '<div id="to-top" class="btn" onclick="smoothScroll(document.body)">&#x25b2;</div>';
  str_footer += '<style>.footer span {padding:0 6px;}</style>';
  return str_footer;
}

function bmf_build_main() {
  var main_layer = bmv_current.search(/series|member/i) != -1? ' layer' : '';
  var str_main = '<div class="main '+ bmv_current +' max flex_wrap'+ main_layer +'">';
  str_main += '<div class="post-content">';
  str_main += '<div class="post-info"></div>';
  if (bmv_chk_nav) str_main += '<div class="page-nav t_center"></div>';
  str_main += '</div>'; //.post-content
  str_main += '</div>'; //.main
  return str_main;
}

function bmf_build_header() {
  var tag_head = bmv_current == 'latest' ? 'h1' : 'h2';
  var str_head = '<div class="header-wrapper"><div class="header max layer flex f_middle">';
  if (is_mobile) {
    str_head += '<div class="nav-toggle">';
    str_head += '<span class="nav-icon">';
    str_head += '<svg class="nav-open" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><path d="M0 96c0-13.255 10.745-24 24-24h464c13.255 0 24 10.745 24 24s-10.745 24-24 24H24c-13.255 0-24-10.745-24-24zm0 160c0-13.255 10.745-24 24-24h464c13.255 0 24 10.745 24 24s-10.745 24-24 24H24c-13.255 0-24-10.745-24-24zm0 160c0-13.255 10.745-24 24-24h464c13.255 0 24 10.745 24 24s-10.745 24-24 24H24c-13.255 0-24-10.745-24-24z"></path></svg>';
    str_head += '</span>'; //.nav-icon
    str_head += '<span class="nav-text">Menu</span>';
    str_head += '</div>'; //.nav-toggle
    str_head += '<span class="f_grow"></span>';
  }
  str_head += '<div class="title"><a href="./" title="Bakomon - Baca Komik Online"><'+ tag_head +' class="text">Bakomon</' + tag_head +'><img alt="Bakomon" src="./images/logo-text.png" title="Bakomon - Baca Komik Indonesia Online"></a></div>';
  str_head += '<span class="f_grow"></span>';
  str_head += '<div class="navigation"><ul class="'+ (is_mobile ? 'bg2' : 'flex') +'">';
  str_head += '<li><a href="#/latest">Beranda</a></li><li><a href="'+ bmv_series_list +'">Daftar Komik</a></li><li><a href="#/search" title="Advanced Search">Adv Search</a></li>';
  if (fbase_login) {
    str_head += '<li class="dropdown"><a href="javascript:void(0)">Member</a><ul class="full"><li><a href="#/member/profile">Profil</a></li><li><a href="#/member/bookmark">Bookmark</a></li><li><a href="#/member/history">History</a></li><li><a href="#/member/settings">Pengaturan</a></li><li><a href="javascript:bmf_fbase_logout()">Logout</a></li></ul></li>';
  } else {
    str_head += '<li class="selected"><a href="#/member/login">Masuk</a></li>';
  }
  str_head += '</ul></div>'; //.navigation
  str_head += '<div class="quick-search">';
  if (is_mobile) {
    str_head += '<div class="qs-icon">';
    str_head += '<span class="qs-open"><svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><path fill-rule="evenodd" clip-rule="evenodd" d="M208 48c-88.366 0-160 71.634-160 160s71.634 160 160 160 160-71.634 160-160S296.366 48 208 48zM0 208C0 93.125 93.125 0 208 0s208 93.125 208 208c0 48.741-16.765 93.566-44.843 129.024l133.826 134.018c9.366 9.379 9.355 24.575-.025 33.941-9.379 9.366-24.575 9.355-33.941-.025L337.238 370.987C301.747 399.167 256.839 416 208 416 93.125 416 0 322.875 0 208z"></path></svg></span>';
    str_head += '<span class="qs-close no_items"><svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><path d="M71.029 71.029c9.373-9.372 24.569-9.372 33.942 0L256 222.059l151.029-151.03c9.373-9.372 24.569-9.372 33.942 0 9.372 9.373 9.372 24.569 0 33.942L289.941 256l151.03 151.029c9.372 9.373 9.372 24.569 0 33.942-9.373 9.372-24.569 9.372-33.942 0L256 289.941l-151.029 151.03c-9.373 9.372-24.569 9.372-33.942 0-9.372-9.373-9.372-24.569 0-33.942L222.059 256 71.029 104.971c-9.372-9.373-9.372-24.569 0-33.942z"></path></svg></span>';
    str_head += '</div>';
  }
  str_head += '<div class="qs-form flex f_middle'+ (is_mobile ? ' no_items' : '') +'">';
  str_head += '<input type="search" class="qs-field radius" placeholder="Judul..." value=""/>';
  str_head += '<button type="button" class="qs-search btn radius"><svg viewBox="0 0 512 512" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><path fill-rule="evenodd" clip-rule="evenodd" d="M208 48c-88.366 0-160 71.634-160 160s71.634 160 160 160 160-71.634 160-160S296.366 48 208 48zM0 208C0 93.125 93.125 0 208 0s208 93.125 208 208c0 48.741-16.765 93.566-44.843 129.024l133.826 134.018c9.366 9.379 9.355 24.575-.025 33.941-9.379 9.366-24.575 9.355-33.941-.025L337.238 370.987C301.747 399.167 256.839 416 208 416 93.125 416 0 322.875 0 208z"></path></svg></button>';
  str_head += '</div>'; //.qs-form
  str_head += '</div>'; //.quick-search
  str_head += '</div></div>';
  str_head += '<div class="line"></div>';
  return str_head;
}

// #===========================================================================================#

function bmf_default_key(e) {
  if (e.keyCode == 13) el('.quick-search .qs-search').click();
}

function bmf_build_default() {
  // Build "main" element
  var bmv_parent = el('.atoz');
  bmv_parent.innerHTML = bmf_build_header();
  bmv_parent.innerHTML += bmf_build_main();
  bmv_parent.innerHTML += bmf_build_footer();
  bmv_el_post = el('.post-info');

  el('.quick-search .qs-search').addEventListener('click', function() {
    if (el('.quick-search .qs-field').value != '') wl.hash = '#/search/?query='+ el('.quick-search .qs-field').value;
  });
  document.addEventListener('keyup', bmf_default_key);

  if (is_mobile) {
    el('.header .nav-toggle').addEventListener('click', function() {
      this.parentElement.classList.toggle('nav-show');
    });
    el('.quick-search .qs-open').addEventListener('click', function() {
      this.classList.toggle('qs-bg');
      el('.quick-search .qs-close').classList.toggle('no_items');
      toggleClass(el('.quick-search .qs-form'), ['qs-show', 'no_items']);
    });
  }
}

function bmf_page_scroll() {
  if (bmv_current == 'chapter') {
    if (!bmv_chk_pause && !bmv_chk_from) {
      if (!bmv_load_img) lazyLoad(el('img.lazy1oad', 'all'), 'scroll');
      if (el('img.lazy1oad', 'all').length == 0) bmv_load_img = true;
    }
      
    // next background (mobile)
    if (is_mobile && (getOffset(el('#check-point'), 'bottom') + bmv_half_screen) >= getOffset(el('#reader'), 'bottom')) {
      el('.cm_next button').style.background = 'rgba(0,0,0,.5)';
    } else {
      el('.cm_next button').style.background = null;
    }
  } else {
    lazyLoad(el('img.lazy1oad', 'all'));
  }
}

// build page direct, without api data (adv search, member)
function bmf_build_page_direct(current) {
  bmf_build_default();

  if (current == 'search') {
    bmf_build_search();
  }
  if (current == 'member') {
    bmf_build_member();
  }
  
  bmf_meta_tags(); //Meta tags
  document.body.classList.remove('loading', 'lody');
  
  bmv_page_loaded = true;
}

// build page with api data
function bmf_build_page_api(json) {
  bmf_build_default();

  if (json.status_code == 200) {
    // Build element post
    if (bmv_current == 'latest') {
      bmf_build_latest(json);
    }
    if (bmv_current == 'search') {
      bmf_build_search(json);
    }
    if (bmv_current == 'series') {
      bmf_build_series(json);
    }
    if (bmv_current == 'chapter') {
      bmf_build_chapter(json);
    }

    if (bmv_current != 'chapter') lazyLoad(el('img.lazy1oad', 'all')); //first load
    document.addEventListener('scroll', bmf_page_scroll);
  
    if (bmv_chk_nav) bmf_page_nav(json);
  
    setTimeout(function() { document.body.classList.remove('loading', 'lody') }, 500); //show page
    bmf_meta_tags(json); //Meta tags
  } else {
    bmv_el_post.innerHTML = `<div class="t_center">!! ERROR: ${json.status_code} ${json.message}</div>`;
  }
  
  bmv_page_loaded = true;
}

function bmf_build_page(note, json) {
  var fbase_wait = setInterval(function() {
    if (fbase_loaded && fbase_init) {
      clearInterval(fbase_wait);
      bmf_check_login(note, function() {
        if (note.indexOf('direct') != -1) {
          if (bmv_current == 'member') {
            bmf_param_member();
          } else {
            bmf_build_page_direct(bmv_current);
          }
        } else {
          bmf_build_page_api(json);
        }
      });
    }
  }, 100);
}

function bmf_gen_url() {
  var url_param = `?source=${bmv_settings['source']}`;
  url_param += `&index=${bmv_current}`;

  if (wh.search(/\/page\/\d+/) != -1) {
    bmv_page_num = getHash('page');
    url_param += `&page=${bmv_page_num}`;
  }
  if (bmv_current.search(/series|chapter/i) != -1 && bmv_prm_slug) url_param += `&slug=${bmv_prm_slug}`;
  if (bmv_current == 'chapter' && bmv_prm_chapter) url_param += `&chapter=${bmv_prm_chapter}`;
  
  if (bmv_current == 'search' && bmv_prm_slug) {
    bmv_prm_slug = bmv_prm_slug.match(/\?(query|params)=(.*)/);
    url_param += `&${bmv_prm_slug[1]}=${bmv_prm_slug[2]}`;
  }

  addScript('./api/' + url_param + '&callback=bmf_build_page');
}

// #===========================================================================================#

function bmf_param_member() {
  var list_wh = wh.replace(/\/page\/\d+/, '').split('/');
  if (list_wh[2] && list_wh[2] != '') {
    bmv_prm_slug = list_wh[2];
    if (fbase_login) {
      if (bmv_prm_slug.search(/profile|bookmark|history|settings/i) == -1) {
        wl.href = '#/member/profile';
        return;
      }
    } else {
      if (bmv_prm_slug.search(/login|forgot|signup/i) == -1) {
        wl.href = '#/member/login';
        return;
      }
    }
  } else {
    wl.href = '#/member/'+ (fbase_login ? 'profile' : 'login');
    return;
  }

  console.log(`page: ${bmv_current}/${bmv_prm_slug}`);
  bmf_build_page_direct(bmv_current);
}

function bmf_reset_var() {
  bmv_page_num = '1';
  bmv_page_loaded = false;
  bmv_str_cdn = '';
  bmv_str_gi = ''; //google images size
  bmv_chk_cdn = false; //if image use CDN, wp.com | statically.io | imagesimple.co
  bmv_chk_gi = false;  //if google images
  bmv_chk_pause = false; //pause "chapter" images from loading
  bmv_chk_from = false; //load "chapter" image from [index]
  bmv_load_img = false; //all "chapter" images loaded
  bmv_load_cdn = false;
  bmv_load_gi = false;
  bmv_zoom_id = null;
  bmv_prm_slug = null;
  bmv_prm_chapter = null; //chapter [number]
  bmv_dt_latest = null;
  bmv_dt_search = null;
  bmv_dt_series = null;
  bmv_dt_chapter = null;
  bmv_el_result = null;
  bmv_el_images = null;
  document.removeEventListener('scroll', bmf_page_scroll);
  document.removeEventListener('scroll', bmf_chapter_middle);
  document.removeEventListener('keyup', bmf_default_key);
  document.removeEventListener('keyup', bmf_menu_key);
  document.removeEventListener('keyup', bmf_chapter_key);

  fbase_login = false;
  fbase_build = true;
  fbase_user = null;
}

function bmf_get_param() {
  bmf_reset_var();
  bmv_start = true;
  wh = wl.hash;

  var list_wh = wh.replace(/\/page\/\d+/, '').split('/');
  bmv_current = list_wh.length > 1 ? list_wh[1] : 'latest';
  bmv_chk_query = wh.indexOf('query=') != -1 ? true : false; // if search page has "?query="
  bmv_chk_nav = bmv_current.search(/latest|search/i) != -1 ? true : false; //page navigation
  
  document.body.classList.add('loading', 'lody');
  if (is_mobile) document.documentElement.classList.add('mobile');

  // jump to bmf_param_member()
  if (bmv_current == 'member') {
    bmf_build_page('direct/member');
    return;
  }
  console.log(`page: ${bmv_current}`);

  // page must have "slug"
  if (bmv_current.search(/series|chapter/i) != -1) {
    if (list_wh[2] && list_wh[2] != '') {
      bmv_prm_slug = list_wh[2];
    } else {
      if (bmv_current == 'series') {
        wl.href = bmv_series_list;
      } else {
        wl.href = '#/latest';
      }
      return;
    }
  }

  if (bmv_current == 'search' && list_wh[2] && list_wh[2] != '') bmv_prm_slug = list_wh[2];

  if (bmv_current == 'chapter' && list_wh[3] && list_wh[3] != '') {
    bmv_prm_chapter = list_wh[3];
    window.onunload = function() { window.scrollTo(0,0); }; //prevent browsers auto scroll on reload/refresh
  }

  if (bmv_current == 'search' && !bmv_prm_slug) { //advanced search without query or params
    bmf_build_page('direct/search');
  } else {
    bmf_gen_url();
  }
}

// #===========================================================================================#

function bmf_fbase_db_remove(note, path, callback) {
  fbase.database().ref(path).remove().then(function() {
    if (callback) callback();
  }).catch(function(error) {
    console.error('!! Error: Firebasebmf_fbase_db_remove, code: '+ error.code +', message: '+ error.message);
    alert('!! Error: Firebase bmf_fbase_db_remove\n'+ error.message);
  });
}

function bmf_fbase_logout() {
  if (confirm('Are you sure you want to logout?')) {
    fbase.auth().signOut().then(function() {
      fbase_build = false;
      if (bmv_current == 'member') {
        wl.href = '#/latest';
      } else {
        wl.reload();
      }
    }, function(error) {
      console.error('!! Error: Firebase signOut, code: '+ error.code +', message: '+ error.message);
      alert('!! Error: Firebase signOut(\n'+ error.message);
    });
  }
}

function bmf_check_login(note, callback) {
  // Check login https://firebase.google.com/docs/auth/web/manage-users#get_the_currently_signed-in_user
  fbase.auth().onAuthStateChanged(function(user) {
    if (user) { //User is signed in
      fbase_login = true;
      fbase_user = user;
    } else {
      fbase_login = false;
      fbase_user = null;
    }
    callback();
  });
}

function bmf_fbase_init() {
  if (firebase.apps.length == 0) {
    // Initialize new app with different name https://stackoverflow.com/a/37603526/7598333
    firebase.initializeApp(fbase_config, fbase_app);
    fbase = firebase.app(fbase_app);
    fbase_init = true;
  } else {
    var fbase_rgx = new RegExp(`\^${fbase_app}\$`, 'i');
    var fbase_chk = firebase.apps.map(item => { return item.name_.search(fbase_rgx) != -1 }).includes(true);
    if (fbase_chk) {
      console.warn(`Firebase: Firebase App named '${fbase_app}' already exists`);
    } else {
      // Initialize new app with different name https://stackoverflow.com/a/37603526/7598333
      firebase.initializeApp(fbase_config, fbase_app);
      fbase = firebase.app(fbase_app);
      fbase_init = true;
    }
  }
}

function bmf_fbase_check() {
  var db_chk = setInterval(function() {
    if (typeof firebase !== 'undefined' && typeof firebase.database !== 'undefined' && typeof firebase.auth !== 'undefined') {
      clearInterval(db_chk);
      console.log('Firebase: all loaded');
      fbase_loaded = true;
      bmf_fbase_init();
    }
  }, 10);
}

// note: prm = param, dt = data, el = element
var wh, bmv_current, bmv_zoom_id;
var bmv_prm_slug, bmv_prm_chapter;
var bmv_page_loaded, bmv_chk_query, bmv_chk_nav, bmv_chk_cdn, bmv_chk_gi, bmv_chk_pause, bmv_chk_from;
var bmv_load_img, bmv_load_cdn, bmv_load_gi;
var bmv_dt_latest, bmv_dt_search, bmv_dt_series, bmv_dt_chapter;
var bmv_el_post, bmv_el_result, bmv_el_images;
var bmv_str_cdn, bmv_str_gi;
var bmv_start = false;
var bmv_series_list = '#/search/?params=%3Forder%3Dlatest';
var bmv_half_screen = Math.floor((window.screen.height / 2) + 30);
var bmv_zoom = local('get', 'bmv_zoom') ? JSON.parse(local('get', 'bmv_zoom')) : {};
var bmv_rgx_cdn = /(?:i\d+|cdn|img)\.(wp|statically|imagesimple)\.(?:com?|io)\/(?:img\/(?:[^\.]+\/)?)?/i;
var bmv_rgx_gi = /\/([swh]\d+)(?:-[\w]+[^\/]*)?\/|=([swh]\d+).*/i;

var bmv_settings = {
  "source": "bacakomik", //bacakomik|komikindo|komikav
  "direction": true,
  "remove_statically": true,
  "text": {
    "next": "Next",
    "prev": "Prev"
  }
};

var wl = window.location;
var is_mobile = isMobile();

var fbase = null;
var fbase_app = 'bakomon';
var fbase_loaded = false;
var fbase_init = false;
var fbase_login = false;
var fbase_build = true;
var fbase_user = null;
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

// START, first load
window.addEventListener('load', function() {
  if (!bmv_start) {
    removeElem('noscript'); //Remove noscript notification
    bmf_fbase_check();
    bmf_get_param();
  }
});

window.addEventListener('hashchange', function() {
  if (bmv_current != 'chapter') {
    bmv_chk_hash = true;
    smoothScroll(document.body); //Scroll to top
    bmf_get_param();
  } else {
    wl.reload();
    window.onunload = function() { window.scrollTo(0,0); }; //prevent browsers auto scroll on reload/refresh
  }
});

// Back to top
window.addEventListener('scroll', function() {
  var de = document.documentElement;
  var top = el('#to-top');
  if (top) top.style.opacity = document.body.scrollTop > document.body.offsetHeight / 6 || de.scrollTop > de.offsetHeight / 6 ? 1 : 0;
});

console.log('%cMade with \ud83d\udc96 & \ud83d\ude4c, Source: %chttps://github.com/bakomon/bakomon', 'color:#ea8502;font:26px/1.5 monospace;', 'color:#333;font:26px/1.5 monospace;text-decoration:none;');