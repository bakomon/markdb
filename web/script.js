// Escape
function escape(note, str) {
  if (note == 'json') return str.replace(/["\&\t\b\f\r\n]/g, '\\$&');
  if (note == 'regex') return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

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
  var rgx = new RegExp('#(?:.*)\\/' + k + '\\/([^\\/]+)', 'i');
  var mtch = window.location.hash.match(rgx);
  var str = mtch ? mtch[1] : null;
  return str;
}

// Position (X,Y) element https://stackoverflow.com/a/28222246
function getOffset(el, p) {
  const rect = el.getBoundingClientRect();
  var num = p == 'top' ? rect.top + window.scrollY : p == 'bottom' ? rect.bottom + window.scrollY : p == 'right' ? rect.right + window.scrollX : rect.left + window.scrollX;
  return num;
}

// Get first {n} data from Array https://stackoverflow.com/a/50930772/7598333
function firstArray(array, length, last) {
  return array.filter(function(item, index) {
    if (last) {
      return index >= length && index < array.length;
    } else {
      return index < length;
    }
  });
}

function genArray(json) {
  var arr = [];
  for (var key in json) {
    arr.push(json[key]);
  }
  return arr;
}

function genJSON(array, param) {
  var json = {};
  for (index in array) {
    var name = param ? array[index][param] : index;
    json[name] = array[index];
  }
  return json;
}

// Local Storage
function local(prop, name, val) {
  var methods = prop == 'get' ? 'getItem' : prop == 'set' ? 'setItem' : prop == 'remove' ? 'removeItem' : 'clear';
  if (prop == 'set') return localStorage[methods](name, val);
  if (prop == 'get' || prop == 'remove') return localStorage[methods](name);
  if (prop == 'clear') return localStorage[methods]();
}

function checkReadyState() {
  var current;
  var state = ['uninitialized','loading','interactive','complete'];
  state.forEach(function(item, index) {
    if (document.readyState == item) current = index;
  });
  return current;
}
  
// Sorting JSON by values https://stackoverflow.com/a/9188211/7598333
function sortBy(array, prop, asc) {
  return array.sort(function(a, b) {
    if (asc) {
      return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
    } else {
      return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
    }
  });
}

// Filter Array data with multiple value https://stackoverflow.com/a/10870500/7598333
function filterBy(array, filter) {
  return array.filter(function(item) {
    for(var i in filter) {
      // match or indexOf
      if(!item[i].toString().match(filter[i])) return null;
    }
    return item;
  });
}

// Date toLocaleString() with local format, ref: https://www.w3schools.com/jsref/jsref_tolocalestring.asp
function dateLocal(date) {
  var date_lang = 'id-ID';
  var date_format = {
    // timeZone: 'Asia/Jakarta', 
    hour12: false, 
    dateStyle: 'full', 
    timeStyle: 'long'
  };
  return new Date(date).toLocaleString(date_lang, date_format);
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
  
// Copy to clipboard https://stackoverflow.com/a/30810322/7598333
function copyToClipboard(text, elem) {
  var msg, elm = elem || document.body; /* parent element for textarea */
  var copyTextarea = document.createElement('textarea');
  copyTextarea.value = text;
  elm.appendChild(copyTextarea);
  copyTextarea.focus();
  copyTextarea.select();

  try {
    var successful = document.execCommand('copy');
    msg = successful ? true : false;
  } catch (err) {
    msg = false;
    console.log('Oops, unable to copy ', err);
  }

  elm.removeChild(copyTextarea);
  return msg;
}

// Timestamp to relative time https://stackoverflow.com/a/6109105/7598333
function timeDifference(date) {
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;
  var elapsed = new Date() - new Date(date);

  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + ' seconds ago';
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + ' minutes ago';
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + ' hours ago';
  } else if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay) + ' days ago';
  } else if (elapsed < msPerYear) {
    return Math.round(elapsed / msPerMonth) + ' months ago';
  } else {
    return Math.round(elapsed / msPerYear) + ' years ago';
  }
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
    var lz_chk3 = lz_chk1 && lz_chk2 && !img.classList.contains('lazyload3d');
    var lz_chk4 = note == 'single' || note == 'all';
    
    if (lz_chk3 || lz_chk4) {
      var imgs = img.dataset.src;
      if (bmv_current == 'chapter') {
        imgs = imgs.replace(bmv_rgx_cdn, '').replace(/\/[fhwq]=[^\/]+/, '');
        imgs = bmv_load_cdn ? (bmv_str_cdn_link + imgs) : imgs;
        imgs = '//'+ imgs;
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
      img.onload = function() {
        img.classList.remove('loading', 'loge');
        img.style.removeProperty('min-height');
      };
      img.onerror = function() {
        img.classList.remove('loading', 'loge');
        img.style.removeProperty('min-height');
      };
      img.src = imgs;
      // img.removeAttribute('data-src');
      img.className = img.className.replace('la2yloading', 'lazyload3d');
      img.parentElement.classList.add('lazy-loaded');
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

function bmf_meta_tags(note, data) {
  var d_desc = 'Baca dan download komik, manga, manhwa, manhua one shot bahasa indonesia online full page, terlengkap, gratis, loading cepat dan update setiap hari.';
  var d_key = 'baca komik, baca manga, baca manhwa, baca manhua, komik one piece, komik black clover, komik jujutsu kaisen, komik boruto, komik edens zero, baca manga android';

  var mt_page = getHash('page') ? ` \u2013 Laman ${getHash('page')}` : '';
  var mt_title = bmv_current == 'latest' ? 'Bakomon'+ mt_page +' \u2013 Baca Komik Bahasa Indonesia Online' : el('h1').textContent +' | Bakomon';
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

  document.title = bmv_current == 'latest' ? 'Bakomon'+ mt_page +' \u2013 Baca Komik, Manga, Manhwa, Manhua Bahasa Indonesia Online' : mt_title;
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
  document.body.scrollIntoView();

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
  // console.log(elem.validity);

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

function bmf_bmhs_change(info, total) {
  var m_info = info.split('|');
  var m_path = bmf_fbase_path(`check/${m_info[0]}`);
  bmf_fbase_db_get(`series/${m_info[0]}/${m_info[1]}`, m_path, function(res) {
    var m_length = res.val() ? Number(res.val().length) : 0;
    if (m_info[1] == 'remove') m_length = m_length > 0 ? (m_length - 1) : m_length;
    if (m_info[1] == 'set') m_length = m_length + 1;
    if (typeof total === 'number') m_length = total;
    var m_chk_data = bmf_fbase_gen(`${m_info[0]}|check`, {length: m_length});
    bmf_fbase_db_change(`series/${m_info[0]}/check`, m_path, 'set', m_chk_data);
  });
}

function bmf_bmhs_length(note) {
  var m_path = bmf_fbase_path(`check/${bmv_prm_slug}`);
  bmf_fbase_db_get(note, m_path, function(res) {
    var m_length = res.val() ? Number(res.val().length) : 0;
    var m_sort = bmv_prm_slug == 'bookmark' ? 'bm_added' : 'hs_update';
    if (m_length > bmv_max_bmhs) {
      var new_data = genArray(bmv_dt_bmhs); //convert to Array
      new_data = sortBy(new_data, m_sort); //sot by "m_sort" (desc)
      new_data = firstArray(new_data, bmv_max_bmhs, 'last'); //get last after {bmv_max_bmhs} data

      for (var i in new_data) {
        bmf_bmhs_remove(`series/${new_data[i].slug}`);
      }
    }
  });
}

function bmf_bmhs_remove_split(data) {
  if (bmv_prm_slug == 'bookmark') {
    if ('hs_visited' in data) {
      data.bookmarked = 'false';
      return data;
    }
  } else { //history
    if ('bookmarked' in data && data.bookmarked == 'true') {
      data.history = 'false';
      data.hs_visited = {};
      return data;
    }
  }
  return {};
}

function bmf_bmhs_remove(note) {
  var m_note = `member/${bmv_prm_slug}/${note}`;
  var m_path = bmf_fbase_path(note);
  
  bmf_fbase_db_get(m_note, m_path, function(res) {
    var series = res.val();
    var new_series = {};

    if (note == 'series') { //all
      for (var i in series) {
        new_series[series[i].slug] = bmf_bmhs_remove_split(series[i]);
      }
      bmv_dt_bmhs = null;
    } else {
      new_series = bmf_bmhs_remove_split(series);
      delete bmv_dt_bmhs[series.slug];
    }

    bmf_fbase_db_change(m_note, m_path, 'set', new_series, function() {
      var m_length = genArray(bmv_dt_bmhs).length;
      bmf_bmhs_change(`${bmv_prm_slug}|remove`, m_length);
      el('.member .m-total').innerHTML = m_length +'/'+ bmv_max_bmhs;

      if (m_length > 0) {
        removeElem(el(`.member .m-list li[data-slug="${series.slug}"]`));
      } else {
        el('.member .m-total').classList.add('no_items');
        el('.member .m-delete').classList.add('no_items');
        el('.member .m-nav').classList.add('no_items');
        el('.member .m-list').classList.remove('loading', 'loge');
        el('.member .m-list').innerHTML = `<div class="flex f_middle f_center full" style="min-height:230px;">${firstUCase(bmv_prm_slug)} Kosong</div>`;
      }
    });
  });
}

function bmf_bmhs_fnc(note) {
  if (note == 'first') {
    el('.post-header h1 span').classList.add('m-total', 'btn');
    el('.member .m-delete').classList.remove('no_items');
    el('.member .m-nav').classList.remove('no_items');

    el('.member .m-sort').addEventListener('change', function() {
      bmf_member_bmhs_data(`${bmv_prm_slug}/sort`);
    });
    
    el('.member .m-filter').addEventListener('change', function() {
      bmf_member_bmhs_data(`${bmv_prm_slug}/filter`);
    });
  
    el('.member .m-delete').addEventListener('click', function() {
      el('.m-delete-all').classList.toggle('no_items');
      el('.member .m-list .delete', 'all').forEach(function(item) {
        item.classList.toggle('no_items');
      });
    });
  
    el('.m-delete-all').addEventListener('click', function() {
      if (confirm(`Semua ${bmv_prm_slug} pada akun ini akan dihapus secara permanen dan tidak dapat dikembalikan. Apakah Kamu yakin?`)) {
        el('.member .m-list').classList.add('loading', 'loge');
        bmf_bmhs_remove('series');
      }
    });
  }
  
  el('.member .m-list .delete', 'all').forEach(function(item) {
    item.addEventListener('click', function() {
      var h_slug = this.parentElement.dataset.slug;
      if (confirm(`Hapus series ini dari ${bmv_prm_slug}?\n👉 ${h_slug}`)) {
        this.parentElement.classList.add('loading', 'loge');
        bmf_bmhs_remove(`series/${h_slug}`);
      }
    });
  });
}

function bmf_bmhs_filter(note, data, value) {
  if (value == '') return data;
  var m_val = value.split('|');
  return  filterBy(data, JSON.parse(`{"${m_val[0]}": "${m_val[1]}"}`));
}

function bmf_bmhs_sort(note, data, value) {
  var m_val = value.split('|');
  var m_chk = m_val[1] && m_val[1] == 'asc' ? true : false;
  return sortBy(data, m_val[0], m_chk);
}

function bmf_member_bmhs_data(note) {
  var m_empty = `<div class="flex f_middle f_center full" style="min-height:130px;">${firstUCase(bmv_prm_slug)} Kosong</div>`;
  el('.member .m-list').classList.remove('loading', 'loge');

  if (bmv_dt_bmhs) {
    var m_data = genArray(bmv_dt_bmhs);
    bmf_bmhs_change(`${bmv_prm_slug}|update`, m_data.length); //update "check" length on database
    m_data = bmf_bmhs_filter(note, m_data, el('.member .m-filter').value);

    if (m_data.length > 0) {
      m_data = bmf_bmhs_sort(note, m_data, el('.member .m-sort').value);
      var str_bmhs = '';

      str_bmhs += '<div class="post post-list'+ (bmv_prm_slug == 'history' ? ' full-cover' : '') +'"><ul class="flex_wrap">';
      for (var i = 0; i < m_data.length; i++) {
        if (bmv_prm_slug == 'bookmark') {
          str_bmhs += '<li class="flex f_column" data-slug="'+ m_data[i].slug +'">';
          str_bmhs += '<div class="cover f_grow">';
          str_bmhs += '<a href="#/series/'+ m_data[i].slug +'" target="_blank"><img style="min-height:225px;" class="radius full_img loading loge lazy1oad" data-src="'+ m_data[i].cover +'" alt="'+ m_data[i].title +'" title="'+ m_data[i].title +'"></a>';
          str_bmhs += '<span class="type m-icon btn radius">'+ m_data[i].type +'</span>';
          str_bmhs += '';
          str_bmhs += '</div>';
          str_bmhs += '<div class="title"><a href="#/series/'+ m_data[i].slug +'" target="_blank"><h3 class="hd-title line_clamp">'+ m_data[i].title +'</h3></a></div>';
        } else { //history
          str_bmhs += '<li class="flex f_between" data-slug="'+ m_data[i].slug +'">';
          str_bmhs += '<div class="cover">';
          str_bmhs += '<a href="#/series/'+ m_data[i].slug +'" target="_blank"><img style="min-height:130px;" class="radius full_img loading loge lazy1oad" data-src="'+ m_data[i].cover +'" alt="'+ m_data[i].title +'" title="'+ m_data[i].title +'"></a>';
          if (m_data[i].bookmarked == 'true') str_bmhs += '<span class="bookmarked m-icon btn green" title="Bookmarked"><svg xmlns="http://www.w3.org/2000/svg" width="0.84em" height="1em" viewBox="0 0 1280 1536"><path fill="currentColor" d="M1164 0q23 0 44 9q33 13 52.5 41t19.5 62v1289q0 34-19.5 62t-52.5 41q-19 8-44 8q-48 0-83-32l-441-424l-441 424q-36 33-83 33q-23 0-44-9q-33-13-52.5-41T0 1401V112q0-34 19.5-62T72 9q21-9 44-9h1048z"/></svg></span>';
          str_bmhs += '</div>'; //.cover
          str_bmhs += '<div class="detail">';
          str_bmhs += '<div class="title"><a href="#/series/'+ m_data[i].slug +'" target="_blank"><h3 class="hd-title line_clamp lc1">'+ m_data[i].title +'</h3></a></div>';
          str_bmhs += '<ul class="">';
          var m_visited = genArray(m_data[i].hs_visited);
          m_visited = sortBy(m_visited, 'added'); //desc
          for (var j = 0; j < m_visited.length; j++) {
            str_bmhs += '<li class="flex"><a class="f_grow" href="#/chapter/'+ m_data[i].slug +'/'+ m_visited[j].number +'" target="_blank">Chapter '+ m_visited[j].number +'</a><span class="time-ago" title="'+ dateLocal(m_visited[j].added) +'">'+ timeDifference(m_visited[j].added) +'</span></li>';
          }
          str_bmhs += '</ul>';
          str_bmhs += '</div>'; //.detail
        }
        str_bmhs += '<div class="delete m-icon btn red no_items">Hapus</div>';
        str_bmhs += '</li>';
      }
      str_bmhs += '</ul></div>';
      el('.member .m-list').innerHTML = str_bmhs;
      el('.post-header h1 span').innerHTML = m_data.length +'/'+ bmv_max_bmhs;
  
      bmf_bmhs_fnc(note);
      if (note == 'first') bmf_bmhs_length(`member/${bmv_prm_slug}/check`); //if length more than {bmv_max_bmhs}, remove
      lazyLoad(el('img.lazy1oad', 'all')); //first load
      document.addEventListener('scroll', bmf_page_scroll);
    } else { //empty
      el('.member .m-list').innerHTML = m_empty;
    }
  } else { //empty
    bmf_bmhs_change(`${bmv_prm_slug}|remove`, 0); //reset to default
    el('.member .m-list').innerHTML = m_empty;
  }
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
              el('.m-cover label span').innerHTML = 'Choose File...';
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
          if (wl.href.indexOf('continue') != -1) {
            var n_hash = getParam('continue', wl.href.replace(/\/#/, ''));
            wl.href = decodeURIComponent(n_hash);
          } else {
            wl.href = '#/member/profile';
          }
        }).catch(function(error) {
          var m_msg = error.code == 'auth/user-disabled' ? `Akun dengan email <b>${m_email.value}</b> telah dinonaktifkan.<br><a href="#/contact" target="_blank">Hubungi Admin</a> untuk mengaktifkan kembali.` : null;
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

          fbase_user.updateProfile({ displayName: m_name.value }).catch(function(error) {
            console.error('!! Error: Firebase (signup) set name to displayName, code: '+ error.code +', message: '+ error.message);
            alert('!! Error: Firebase (signup) set name to displayName\n'+ error.message);
          });

          var m_profile = bmf_fbase_gen('signup', {name: m_name.value, email: m_email.value});
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
    if (bmv_prm_slug == 'profile') bmf_member_profile_fnc();
    if (bmv_prm_slug == 'bookmark' || bmv_prm_slug == 'history') {
      var order_by = bmv_prm_slug == 'bookmark' ? 'bookmarked' : bmv_prm_slug;
      bmf_fbase_db_get(`member${bmv_prm_slug}`, bmf_fbase_path('series'), function(res) {
        bmv_dt_bmhs = res.val();
        bmf_member_bmhs_data('first');
      }, `equal|${order_by}|true`);
    }
    
    // el('.member .m-logout').addEventListener('click', bmf_fbase_logout);
  } else {
    bmf_member_form_fnc();
  }
}

function bmf_build_member() {
  // Display "member" page
  var str_member = '';

  str_member += '<div class="post-header flex f_middle f_between">';
  str_member += '<h1 class="title">Member: '+ firstUCase(bmv_prm_slug) +' <span></span></h1>';
  if (fbase_login) {
    // str_member += '<span class="m-logout btn t_center" title="Logout"><svg width="18" height="18" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M400 54.1c63 45 104 118.6 104 201.9 0 136.8-110.8 247.7-247.5 248C120 504.3 8.2 393 8 256.4 7.9 173.1 48.9 99.3 111.8 54.2c11.7-8.3 28-4.8 35 7.7L162.6 90c5.9 10.5 3.1 23.8-6.6 31-41.5 30.8-68 79.6-68 134.9-.1 92.3 74.5 168.1 168 168.1 91.6 0 168.6-74.2 168-169.1-.3-51.8-24.7-101.8-68.1-134-9.7-7.2-12.4-20.5-6.5-30.9l15.8-28.1c7-12.4 23.2-16.1 34.8-7.8zM296 264V24c0-13.3-10.7-24-24-24h-32c-13.3 0-24 10.7-24 24v240c0 13.3 10.7 24 24 24h32c13.3 0 24-10.7 24-24z"></path></svg></span>';
    str_member += '<span class="m-delete btn red no_items" title="Delete"><svg xmlns="http://www.w3.org/2000/svg" width="0.94em" height="1.2em" viewBox="0 0 1408 1536"><path fill="currentColor" d="M512 608v576q0 14-9 23t-23 9h-64q-14 0-23-9t-9-23V608q0-14 9-23t23-9h64q14 0 23 9t9 23zm256 0v576q0 14-9 23t-23 9h-64q-14 0-23-9t-9-23V608q0-14 9-23t23-9h64q14 0 23 9t9 23zm256 0v576q0 14-9 23t-23 9h-64q-14 0-23-9t-9-23V608q0-14 9-23t23-9h64q14 0 23 9t9 23zm128 724V384H256v948q0 22 7 40.5t14.5 27t10.5 8.5h832q3 0 10.5-8.5t14.5-27t7-40.5zM480 256h448l-48-117q-7-9-17-11H546q-10 2-17 11zm928 32v64q0 14-9 23t-23 9h-96v948q0 83-47 143.5t-113 60.5H288q-66 0-113-58.5T128 1336V384H32q-14 0-23-9t-9-23v-64q0-14 9-23t23-9h309l70-167q15-37 54-63t79-26h320q40 0 79 26t54 63l70 167h309q14 0 23 9t9 23z"/></svg></span>';
  }
  str_member += '</div>'; //.post-header
  str_member += '<div class="content '+ (fbase_login ? 'login' : 'not-login bg2 layer radius') +'">';
  str_member += '<div class="m-notif m-text t_center'+ (fbase_login ? ' bg2 layer radius' : '') +' no_items"></div>';
  if (fbase_login) {
    if (bmv_prm_slug == 'bookmark' || bmv_prm_slug == 'history') {
      str_member += '<div class="m-nav flex_wrap full radius no_items">';
      str_member += '<select class="m-sort mn-menu'+ (is_mobile ? ' f_grow' : '') +'"><option value="" disabled>Sort by</option>';
      if (bmv_prm_slug == 'bookmark') {
        str_member += '<option value="bm_added" selected>Added</option>';
      } else { //history
        str_member += '<option value="hs_update" selected>Update</option>';
      }
      str_member += '<option value="title|asc">A-Z</option><option value="title">Z-A</option>';
      str_member += '</select>'; //.m-sort
      str_member += '<select class="m-filter mn-menu'+ (is_mobile ? ' f_grow' : '') +'">';
      str_member += '<option value="" selected disabled>Filter by</option><option value="">All</option>';
      if (bmv_prm_slug == 'bookmark') {
        for (var i in bmv_genres) {
          str_member += '<option value="genre|'+ bmv_genres[i] +'">'+ firstUCase(bmv_genres[i]) +'</option>';
        }
      } else { //history
        str_member += '<option value="bookmarked|true">Bookmarked</option><option value="bookmarked|false">Not Bookmarked</option>';
      }
      str_member += '</select>'; //.m-filter
      str_member += '<div class="m-delete-all mn-menu btn red t_center no_items">Delete All</div>';
      if (!is_mobile) str_member += '<span class="f_grow"></span>';
      str_member += '<div class="ms-form flex f_middle">';
      str_member += '<input class="ms-field radius f_grow" type="search" placeholder="Judul..." value=""/>';
      str_member += '<span class="ms-search btn radius"><svg viewBox="0 0 512 512" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><path fill-rule="evenodd" clip-rule="evenodd" d="M208 48c-88.366 0-160 71.634-160 160s71.634 160 160 160 160-71.634 160-160S296.366 48 208 48zM0 208C0 93.125 93.125 0 208 0s208 93.125 208 208c0 48.741-16.765 93.566-44.843 129.024l133.826 134.018c9.366 9.379 9.355 24.575-.025 33.941-9.379 9.366-24.575 9.355-33.941-.025L337.238 370.987C301.747 399.167 256.839 416 208 416 93.125 416 0 322.875 0 208z"></path></svg></span>';
      str_member += '</div>'; //.qs-form
      str_member += '</div>'; //.m-nav
    }
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
      str_member += '<div class="full"><div class="m-text t_center bg2 layer radius">Kamu dapat menyimpan daftar series di sini hingga <b>'+ bmv_max_bmhs +'</b> judul</div></div>';
      str_member += '<div class="m-bm-list m-list full loading loge"><div class="flex f_middle f_center full" style="min-height:225px;"></div></div>';
    } else if (bmv_prm_slug == 'history') {
      str_member += '">';
      str_member += '<div class="m-hs-list m-list full loading loge"><div class="flex f_middle f_center full" style="min-height:225px;"></div></div>';
    } else { //settings
      str_member += '">';
      str_member += 'test settings';
      str_member += '';
      str_member += '';
    }
    str_member += '</div>';
    if (bmv_prm_slug == 'profile') str_member += '<div class="m-reauth flex f_perfect no_items"><div class="fp_content"><div class="fp_content"><input type="password" name="password" placeholder="Password" value=""><div class="flex full f_between m-space-v"><button class="r-save btn f_grow" data-active="">OK</button><button class="r-cancel btn selected f_grow" style="margin-left:15px;">Batal</button></div></div></div>';
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
  if (!fbase_login) el('.main').style.maxWidth = '500px';

  bmf_member_fnc();
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
    dir_el.style.zIndex = '1';
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
      if (!bmv_chk_from) bmv_load_img = true;
      el('.cm_load .cm_all').value = 'all';
      var ld_index = bmv_chk_from && el('.cm_load .cm_fr_min').value != '' ? (Number(el('.cm_load .cm_fr_min').value) - 1) : 0;
      var ld_length = bmv_chk_from && el('.cm_load .cm_fr_max').value != '' ? Number(el('.cm_load .cm_fr_max').value) : img_list.length;
      for (var i = ld_index; i < ld_length; i++) {
        lazyLoad(img_list[i], 'all');
      }
      if (bmv_chk_from) el(`#reader [data-index="${ld_index+1}"]`).scrollIntoView();
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
    el(`.cm_cdn.cdn_${bmv_str_cdn}`).classList.add('cm_active');
    el(`.cm_cdn.cdn_${bmv_str_cdn}`).setAttribute('data-cdn', bmv_str_cdn_link);

    function chapter_cdn(elem) {
      el('.cm_cdn.cm_active').classList.remove('cm_active');
      elem.classList.add('cm_active');
      if (bmv_chk_gi) {
        el('.cm_size').innerHTML = 's15000';
        el('.cm_size').click();
      }
    }

    el('.cdn_statically').onclick = function() {
      if (this.classList.contains('cm_active')) return;
      var bmv_cdn = this.dataset.cdn;
      bmv_str_cdn_link = bmv_cdn ? bmv_cdn : 'cdn.statically.io/img/';
      bmv_load_cdn = true;
      chapter_cdn(this);
    };

    el('.cdn_wp').onclick = function() {
      if (this.classList.contains('cm_active')) return;
      var bmv_cdn = this.dataset.cdn;
      bmv_str_cdn_link = bmv_cdn ? bmv_cdn : 'i2.wp.com/';
      bmv_load_cdn = true;
      chapter_cdn(this);
    };

    el('.cdn_not').onclick = function() {
      if (this.classList.contains('cm_active')) return;
      bmv_load_cdn = false;
      chapter_cdn(this);
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
  if (bmv_settings.remove_statically && bmv_chk_cdn) el('.cm_cdn').click(); //auto remove cdn from statically
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
  str_menu += '<div class="cm_others cm_line w_100 flex_wrap'+ (bmv_chk_cdn || bmv_chk_gi ? '' : ' no_items') +'">';
  if (bmv_chk_cdn) {
    str_menu += '<button class="cdn_statically cm_cdn cm_btn btn">Statically</button>';
    str_menu += '<button class="cdn_wp cm_cdn cm_btn btn">WP</button>';
    str_menu += '<button class="cdn_not cm_cdn cm_btn btn">not</button>';
  }
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
  str_menu += '<input class="cm_all cm_input" value="all" type="text" onclick="this.select()">';
  str_menu += '<button class="cm_pause cm_btn btn no_hover" title="Pause images from loading"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1em" height="1em" viewBox="0 0 24 24" version="1.1" x="0px" y="0px"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><path fill="currentColor" d="M15,18 L15,6 L17,6 L17,18 L15,18 Z M20,18 L20,6 L22,6 L22,18 L20,18 Z M2,5 L13,12 L2,19 L2,5 Z"></path></g></svg></button>';
  str_menu += '</div>';
  str_menu += '<div class="flex f_middle">';
  str_menu += '<button class="cm_from cm_btn btn no_hover" title="Load images from [index]">From</button>';
  str_menu += '<input class="cm_fr_min cm_input no_arrows" type="number" value="1" onclick="this.select()" disabled>';
  str_menu += '<span>-</span>';
  str_menu += '<input class="cm_fr_max cm_input no_arrows" type="number" value="'+ bmv_dt_chapter.images.length +'" data-value="'+ bmv_dt_chapter.images.length +'" onclick="this.select()" disabled>';
  str_menu += '</div>';
  str_menu += '</div>';// .cm_load
  str_menu += '<div class="cm_zoom w_100"><button class="cm_plus cm_btn btn" title="shift + up">+</button><button class="cm_less cm_btn btn" title="shift + down">-</button><input style="width:50px;" class="cm_input" value="'+ cm_size +'" type="text"></div>';
  str_menu += '</div>';// .cm_tr1
  str_menu += '<div class="cm_tr2 '+ (is_mobile ? ' flex f_bottom' : '') +'">';
  str_menu += '<div class="cm_td1'+ (is_mobile ? '' : ' no_items') +'">';
  if (is_mobile) {
    str_menu += '<div class="cm_next2 cm_btn btn flex f_center f_middle no_items" onclick="window.location.href=document.querySelector(\'.cm_next button\').dataset.href">&#9656;</div>';
    str_menu += '<div class="cm_prev2 cm_btn btn flex f_center f_middle no_items" onclick="window.location.href=document.querySelector(\'.cm_prev button\').dataset.href">&#9666;</div>';
  }
  str_menu += '<div class="cm_load2 cm_btn btn flex f_center f_middle" onclick="document.querySelector(\'.cm_ld_img\').click()">&#671;</div>';
  str_menu += '</div>';// .cm_td1
  str_menu += '<div class="cm_td2">';
  if (is_mobile) str_menu += '<div class="cm_pause2 cm_btn btn flex f_center f_middle no_hover" onclick="document.querySelector(\'.cm_pause\').click()"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1em" height="1em" viewBox="0 0 24 24" version="1.1" x="0px" y="0px"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><path fill="currentColor" d="M15,18 L15,6 L17,6 L17,18 L15,18 Z M20,18 L20,6 L22,6 L22,18 L20,18 Z M2,5 L13,12 L2,19 L2,5 Z"></path></g></svg></div>';
  str_menu += '<div class="cm_rest"><div class="cm_reload cm_btn btn flex f_center f_middle no_items" onclick="window.location.reload()" title="alt + r">&#8635;</div><div class="cm_stop cm_btn btn flex f_center f_middle" title="alt + x">&#10007;</div></div>';
  str_menu += '<div class="cm_top cm_btn btn flex f_center f_middle">&#9652;</div>';
  str_menu += '<div class="cm_bottom cm_btn btn flex f_center f_middle">&#9662;</div>';
  str_menu += '<div class="cm_toggle cm_btn btn flex f_center f_middle'+ (is_mobile ? ' no_hover' : '') +'">&#174;</div>';
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

function bmf_chapter_fnc() {
  // generate & send data to firebase realtime database
  if (fbase_login) {
    var c_path = bmf_fbase_path(`series/${bmv_dt_chapter.slug}`);
    bmf_fbase_db_get('chapter/history', `${c_path}/hs_visited`, function(res) {
      var ch_data = bmf_fbase_gen('history|info|set', bmv_dt_chapter);
      var ch_visited = {};

      if (res.exists()) {
        // update history, get first {bmv_max_hv} data
        ch_visited = res.val();
        ch_visited[bmv_dt_chapter.current] = {number: bmv_dt_chapter.current, added: new Date().getTime()}; //add current chapter
        ch_visited = genArray(ch_visited); //convert to Array
        ch_visited = sortBy(ch_visited, 'added'); //sort by "added" (desc)
        ch_visited = firstArray(ch_visited, bmv_max_hv); //get first {bmv_max_hv} data
        ch_visited = genJSON(ch_visited, 'number'); //convert to JSON
      } else {
        ch_visited[bmv_dt_chapter.current] = {number: bmv_dt_chapter.current, added: new Date().getTime()}; //add current chapter
        bmf_bmhs_change('history|set');
      }

      ch_data.hs_visited = ch_visited;
      bmf_fbase_db_change('chapter/history/set', c_path, 'update', ch_data); //use "update" to keep "other data" from being deleted
    });
  }
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
    str_chapter += '<a class="ch-images full" data-index="'+ (i + 1) +'" href="'+ images[i] +'" target="_blank">';
    str_chapter += '<img style="min-height:750px;" class="full_img loading loge lazy1oad" data-src="'+ images[i] +'" title="'+ img_attr +'" alt="'+ img_attr +'">';
    str_chapter += '<div class="ch-index"><div class="sticky"><div class="btn">'+ (i + 1) +'</div></div></div>';
    str_chapter += '</a>';

    // Check CDN
    if (!bmv_chk_cdn && images[i].search(bmv_rgx_cdn) != -1) {
      var cdn_match = images[i].match(bmv_rgx_cdn);
      bmv_chk_cdn = true;
      bmv_load_cdn = true;
      bmv_str_cdn = cdn_match[2];
      bmv_str_cdn_link = cdn_match[1];
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
  str_chapter += '<div id="disqus_thread"><div class="full t_center"><button class="disqus-trigger btn selected">Komentar</button></div></div>';
  el('.post-content').classList.add('full_page');
  bmv_el_post.innerHTML = str_chapter;

  bmf_chapter_fnc();
  document.addEventListener('scroll', bmf_chapter_middle);
  bmv_el_images = el('#reader');
  bmf_chapter_menu();
  addScript(`./api/?source=${bmv_settings['source']}&index=series&slug=${data.slug}&callback=bmf_chapter_nav`); //get data from series for type & chapter list
}

// #===========================================================================================#

function bmf_series_chapter_list(note, data) {
  // Display chapter list
  var str_lists = '';
  if (note == 'visited') str_lists += '<div class="ch-title">terakhir dibaca</div>';
  str_lists += '<ul class="flex_wrap">';
  for (var i in data) {
    str_lists += '<li><a class="full radius" href="#/chapter/' + bmv_prm_slug + '/' + data[i] + '">Chapter ' + data[i] + '</a></li>';
  }
  str_lists += '</ul>';
  el(`.series .${note}-list`).innerHTML = str_lists;
}

function bmf_fbase_path(info) {
  var path = `users/${fbase_user.uid}`;
  if (info) path += '/'+ info;
  return path;
}

function bmf_fbase_gen(info, data) {
  var g_info = info.split('|');
  var g_data = {};
  var g_set = g_info[2] && g_info[2] == 'set';
  var g_update = g_info[2] && g_info[2] == 'update';

  if (g_info[0] == 'signup') {
    g_data = {
      uid: fbase_user.uid,
      name: data.name,
      email: data.email,
      cover: '',
      tier: 'lite'
    };
  }

  if (g_info[0] == 'bookmark') {
    if (g_info[1] == 'check') {
      g_data = {
        length: data.length,
        update: new Date().getTime()
      };
    }
    if (g_info[1] == 'info') {
      g_data = {
        bookmarked: 'true',
        slug: data.slug,
        title: data.title,
        type: data.detail.type.toLowerCase(),
        status: data.detail.status.replace(/berjalan/i, 'ongoing').replace(/tamat/i, 'completed'),
        genre: data.detail.genre.toLowerCase(),
        cover: data.cover
      };
      if (g_set) g_data['bm_added'] = new Date().getTime();
    }
  }

  if (g_info[0] == 'history') {
    if (g_info[1] == 'check') {
      g_data = {
        length: data.length,
        update: new Date().getTime()
      };
    }
    if (g_info[1] == 'info') {
      g_data = {
        history: 'true',
        slug: data.slug,
        title: data.title,
        cover: data.cover,
        hs_visited: {},
        hs_update: new Date().getTime()
      };
    }
  }

  return g_data;
}

function bmf_fbase_db_check(note, path, callback) {
  fbase.database().ref(path).once('value').then(function(snapshot) {
    callback(snapshot.exists() ? true : false);
  }).catch(function(error) {
    console.error('!! Error: Firebase '+ note +'|'+ path +' bmf_fbase_db_check, code: '+ error.code +', message: '+ error.message);
    // alert('!! Error: Firebase '+ note +'|'+ path +' bmf_fbase_db_check(\n'+ error.message);
  });
}

function bmf_fbase_db_get(note, path, callback, adv) {
  var fb_ref = fbase.database().ref(path);
  if (adv) {
    var fb_adv = adv.split('|');
    fb_ref = fb_ref.orderByChild(fb_adv[1]);
    
    if (fb_adv[0] == 'equal') fb_ref = fb_ref.equalTo(fb_adv[2]);
    // if (fb_adv[0] == 'startEnd') fb_ref = fb_ref.startAt(fb_adv[2]).endAt(fb_adv[2] +'\uf8ff');
  }
  fb_ref.once('value').then(function(snapshot) {
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
      console.error('!! Error: Firebase '+ note +'|'+ path +' bmf_fbase_db_change, code: '+ error.code +', message: '+ error.message);
      // alert('!! Error: Firebase '+ note +'|'+ path +' bmf_fbase_db_change(\n'+ error.message);
    } else {
      if (callback) callback();
    }
  });
}

function bmf_series_fnc() {
  var s_bm = el('.info-left .bookmark');

  // init check bookmark
  if (fbase_login) {
    var s_path = bmf_fbase_path(`series/${bmv_dt_series.slug}`);
    bmf_fbase_db_get('series/bookmark', `${s_path}/bookmarked`, function(res) {
      if (res.val() == 'true') {
        s_bm.classList.remove('wait');
        s_bm.classList.add('marked', 'red');
        s_bm.removeAttribute('disabled');

        // update bookmark
        var data = bmf_fbase_gen('bookmark|info|update', bmv_dt_series);
        bmf_fbase_db_change('series/bookmark', s_path, 'update', data);
      } else {
        s_bm.classList.remove('wait', 'marked', 'red');
        s_bm.removeAttribute('disabled');
      }
    });
    
    bmf_fbase_db_get('series/bookmark/style', `${s_path}/hs_visited`, function(res) {
      if (res.exists()) {
        var hs_data = genArray(res.val());
        hs_data = sortBy(hs_data, 'added');

        var hs_list = [];
        for (var i in hs_data) {
          hs_list.push(hs_data[i].number);
          el(`.chapter-list a[href$="/${hs_data[i].number}"]`).classList.add('visited');
        }
        
        el('.series .visited-list').classList.add('ch-list', 'bg2', 'radius');
        bmf_series_chapter_list('visited', hs_list); //Build visited list
      }
    });
  } else {
    s_bm.classList.remove('wait', 'marked', 'red');
    s_bm.removeAttribute('disabled');
  }

  s_bm.addEventListener('click', function() {
    var slug = this.dataset.slug;

    if (fbase_login) {
      var s_path = bmf_fbase_path(`series/${bmv_dt_series.slug}`);
      this.classList.add('wait');

      if (this.classList.contains('marked')) {
        if (confirm(`Hapus series ini dari bookmark?\n👉 ${slug}`)) {
          var r_note = 'series/bookmark/remove';
          var hs_path = bmf_fbase_path(`series/${bmv_dt_series.slug}/hs_visited`);
          bmf_fbase_db_check(r_note, hs_path, function(res) {
            if (res) {
              bmf_fbase_db_change(r_note, s_path, 'update', {bookmarked: 'false'}, function() {
                s_bm.classList.remove('wait', 'marked', 'red');
              });
            } else {
              bmf_fbase_db_remove(r_note, s_path, function() {
                s_bm.classList.remove('wait', 'marked', 'red');
              });
            }
            bmf_bmhs_change('bookmark|remove');
          });
        }
      } else {
        var bm_path = bmf_fbase_path('check/bookmark');
        bmf_fbase_db_get('series/bookmark/check', bm_path, function(res) {
          var bm_length = res.val() ? Number(res.val().length) : 0;
          if (bm_length >= bmv_max_bmhs) {
            s_bm.classList.remove('wait');
            alert(`Total bookmark telah melampaui kuota (${bmv_max_bmhs}), coba hapus bookmark lain.`);
          } else {
            var bm_data = bmf_fbase_gen('bookmark|info|set', bmv_dt_series);
            bmf_fbase_db_change('series/bookmark/set', s_path, 'update', bm_data, function() { //use "update" to keep "history" from being deleted
              s_bm.classList.remove('wait');
              s_bm.classList.add('marked', 'red');
            });
    
            bmf_bmhs_change('bookmark|set');
          }
        });
      }
    } else {
      wl.href = '#/member/login/?continue='+ encodeURIComponent(wl.hash);
    }
  });

  el('.series .s-copy').addEventListener('click', function() {
    copyToClipboard(el('.series h1').textContent, this);
  });
}

function bmf_build_series(data) {
  // Display "series" page
  bmv_dt_series = data;
  bmf_chapter_zoom(data.slug, data.detail.type.toLowerCase());

  var str_series = '';
  str_series += '<div class="post-header flex f_middle">';
  str_series += '<span class="s-copy"><svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 512 512"><path fill="currentColor" d="M502.6 70.63L441.35 9.38C435.4 3.371 427.2 0 418.7 0H255.1c-35.35 0-64 28.66-64 64l.02 256c.88 35.4 29.58 64 64.88 64h192c35.2 0 64-28.8 64-64V93.25c0-8.48-3.4-16.62-9.4-22.62zM464 320c0 8.836-7.164 16-16 16H255.1c-8.838 0-16-7.164-16-16V64.13c0-8.836 7.164-16 16-16h128L384 96c0 17.67 14.33 32 32 32h47.1v192zM272 448c0 8.836-7.164 16-16 16H63.1c-8.838 0-16-7.164-16-16l.88-255.9c0-8.836 7.164-16 16-16H160V128H63.99c-35.35 0-64 28.65-64 64L0 448c.002 35.3 28.66 64 64 64h192c35.2 0 64-28.8 64-64v-32h-47.1l-.9 32z"/></svg></span>';
  str_series += '<h1 class="title">' + data.title + '</h1>';
  str_series += '</div>'; //.post-header
  str_series += '<div class="flex_wrap f_between '+ (fbase_login ? 'login' : 'not-login') +'">';
  str_series += '<div class="info info-left">';
  str_series += '<div class="cover"><img class="radius full_img loading loge" src="' + data.cover + '" alt="' + data.title + '" title="' + data.title + '"></div>';
  str_series += '<div class="bookmark wait btn space-v flex f_middle f_center" data-slug="' + data.slug + '" disabled><span class="svg"></span>Bookmark</div>';
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
  str_series += '<div class="visited-list"></div>';
  if (data.chapter.length > 1) {
    str_series += '<div class="last-end flex f_between">';
    str_series += '<a class="btn t_center radius" href="#/chapter/' + data.slug + '/' + data.chapter[data.chapter.length-1] + '"><div>Chapter Awal</div><div class="char">Chapter ' + data.chapter[data.chapter.length-1] + '</div></a>';
    str_series += '<a class="btn t_center radius" href="#/chapter/' + data.slug + '/' + data.chapter[0] + '"><div>Chapter Baru</div><div class="char">Chapter ' + data.chapter[0] + '</div></a>';
    str_series += '</div>'; //.last-end
  }
  str_series += '<div class="chapter-list ch-list bg2 radius"><div class="loading loge" style="height:25vh;"></div></div>';
  str_series += '</div>'; //.chapters
  str_series += '<div id="disqus_thread"><div class="full t_center"><button class="disqus-trigger btn selected">Komentar</button></div></div>';
  str_series += '</div>'; //.info-right
  str_series += '</div>';
  bmv_el_post.innerHTML = str_series;

  bmf_series_fnc();
  if (data.chapter.length > 0) bmf_series_chapter_list('chapter', data.chapter); //Build chapter list
}

// #===========================================================================================#

function bmf_search_result(data) {
  // Display advanced search result
  var series = data.lists; //JSON data
  
  if (data.lists.length > 0) {
    var str_result = '';
    str_result += '<div class="post post-list"><ul class="flex_wrap">';
    for (var i = 0; i < series.length; i++) {
      str_result += '<li class="flex f_column">';
      str_result += '<div class="cover f_grow">';
      str_result += '<a href="#/series/' + series[i].slug + '" target="_blank"><img style="min-height:225px;" class="radius full_img loading loge lazy1oad" data-src="' + series[i].cover + '" alt="' + series[i].title + '" title="' + series[i].title + '"></a>';
      str_result += '<span class="type m-icon btn radius">'+ series[i].type +'</span>';
      if (series[i].color) str_result += '<span class="color m-icon btn radius" title="Berwarna"><svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 512 512"><path fill="currentColor" d="M204.3 5C104.9 24.4 24.8 104.3 5.2 203.4c-37 187 131.7 326.4 258.8 306.7c41.2-6.4 61.4-54.6 42.5-91.7c-23.1-45.4 9.9-98.4 60.9-98.4h79.7c35.8 0 64.8-29.6 64.9-65.3C511.5 97.1 368.1-26.9 204.3 5zM96 320c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32zm32-128c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32zm128-64c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32zm128 64c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32z"/></svg></span>';
      str_result += '</div>';
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
  var s_page = getHash('page') ? ` \u2013 Laman ${getHash('page')}` : '';
  var str_search = '';

  str_search += '<div class="adv-search layer2">';
  str_search += '<div class="post-header flex"><h1 class="title">'+ (bmv_chk_query ? 'Hasil Pencarian: <span></span>' : 'Advanced Search') + s_page +'</h1><span class="toggle btn t_center'+ (wh.indexOf('params=') != -1 ? '' : ' no_items') +'">+</span></div>';
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
  for (var i in bmv_genres) {
    str_search += '<li><label class="checkbox"><input type="checkbox" class="s-genre" value="' + bmv_genres[i] + '"><span></span>' + firstUCase(bmv_genres[i]) + '</label></li>';
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

// Validate
function bmf_email_validate(str) {
  return /^[+a-zA-Z0-9_.!#$%&'*\/=?^`{|}~-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,63}$/.test(str);
}

function bmf_build_contact() {
  // Display "contact" page
  var str_contact = '';

  str_contact += '<div class="post-header"><h1 class="title">Hubungi Kami</h1></div>';
  str_contact += '<div class="post">';
  str_contact += '<div class="contact-form bg2 layer radius">';
  str_contact += '<iframe class="no_items" id="contact-frame" name="contact-frame"data-loaded="false"></iframe>';
  str_contact += '<form action="https://docs.google.com/forms/d/1ezK2EoF11JzEYb1Mk5vO0ZJqGOO8sQ3KQq1uHCM-XSY/formResponse" method="POST" target="contact-frame" autocomplete="off">';
  str_contact += '<div class="contact-name"><input name="entry.2005620554" type="text" placeholder="Nama Asli (wajib)" value="" required></div>';
  str_contact += '<div class="contact-email"><input name="entry.1045781291" type="email" placeholder="Email Aktif (wajib)" value="" required></div>';
  str_contact += '<div class="contact-title"><input name="entry.703833447" type="text" placeholder="Judul Pesan (wajib)" value="" required></div>';
  str_contact += '<div class="contact-message"><textarea name="entry.839337160" rows="5" cols="25" placeholder="Isi pesan tulis disini.. (wajib)" required></textarea></div>';
  str_contact += '<input name="partialResponse" type="hidden" value="[,,&quot;328016698945689561&quot;]">';
  str_contact += '<input name="pageHistory" type="hidden" value="0">';
  str_contact += '<input name="fbzx" type="hidden" value="328016698945689561">';
  str_contact += '<button class="contact-submit btn full" type="submit" name="submit">Kirim</button>';
  str_contact += '</div>'; //.contact-form
  str_contact += '<div class="contact-status bg2 layer radius t_center no_items"></div>';
  str_contact += '</div>';
  el('.post-content').classList.add('full_page');
  bmv_el_post.innerHTML = str_contact;
  el('.main').style.maxWidth = '500px';
  
  el('#contact-frame').addEventListener('load', function() {
    if (this.dataset.loaded == 'true') {
      el('.contact-form').classList.remove('loading', 'loge');
      el('.contact-status').classList.remove('no_items');
      el('.contact-status').classList.add('green');
      el('.contact-status').innerHTML = 'Pesan sudah dikirim.';
    }
  });

  el('.contact-form form').addEventListener('submit', function(e) {
    el('.contact-status').classList.add('no_items');
    var f_lists = ['name', 'email', 'title', 'message'];
    
    for (var i in f_lists) {
      var f_elem = f_lists[i] == 'message' ? el(`.contact-${f_lists[i]} textarea`) : el(`.contact-${f_lists[i]} input`);
      var f_chk = f_lists[i] == 'email' ? bmf_email_validate(f_elem.value) : f_elem.checkValidity();

      if (!f_chk) {
        var f_msg = f_lists[i] == 'email' ? 'Alamat email harus valid.' : f_elem.validationMessage;
        e.preventDefault();
        el('#contact-frame').dataset.loaded = 'false';
        el('.contact-status').classList.remove('no_items');
        el('.contact-status').classList.add('red');
        el('.contact-status').innerHTML = '!! Error: '+ f_msg;
        return;
      }
    }

    this.parentElement.classList.add('loading', 'loge');
    el('#contact-frame').dataset.loaded = 'true';
  });
}

// #===========================================================================================#

function bmf_build_latest(data) {
  // Display "latest" page
  bmv_dt_latest = data;
  var series = data.lists;
  var l_page = getHash('page') ? ` \u2013 Laman ${getHash('page')}` : '';
  var str_latest = '';

  str_latest += '<div class="post-header layer2"><h2 class="title">Update Komik Terbaru'+ l_page +'</h2></div>';
  str_latest += '<div class="post post-list"><ul class="flex_wrap">';
  for (var i = 0; i < series.length; i++) {
    str_latest += '<li class="flex f_column">';
    str_latest += '<div class="cover f_grow">';
    str_latest += '<a href="#/series/'+ series[i].slug +'"><img style="min-height:225px;" class="radius full_img loading loge lazy1oad" data-src="'+ series[i].cover +'" alt="'+ series[i].title +'" title="'+ series[i].title +'"></a>';
    str_latest += '<span class="type m-icon btn radius">'+ series[i].type +'</span>';
    if (series[i].color) str_latest += '<span class="color m-icon btn radius" title="Berwarna"><svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 512 512"><path fill="currentColor" d="M204.3 5C104.9 24.4 24.8 104.3 5.2 203.4c-37 187 131.7 326.4 258.8 306.7c41.2-6.4 61.4-54.6 42.5-91.7c-23.1-45.4 9.9-98.4 60.9-98.4h79.7c35.8 0 64.8-29.6 64.9-65.3C511.5 97.1 368.1-26.9 204.3 5zM96 320c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32zm32-128c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32zm128-64c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32zm128 64c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32z"/></svg></span>';
    str_latest += '</div>'; //.cover
    str_latest += '<div class="title"><a href="#/series/'+ series[i].slug +'"><h3 class="hd-title line_clamp">'+ series[i].title +'</h3></a></div>';
    str_latest += '<div class="date">'+ series[i].date +'</div>';
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

function bmf_build_footer() {
  var str_footer = '<div class="footer max layer">';
  if (bmv_current != 'chapter') str_footer += '<div class="message bg2 t_center layer radius">Semua komik di website ini hanya preview dari komik aslinya, mungkin terdapat banyak kesalahan bahasa, nama tokoh, dan alur cerita. Dukung mangakanya dengan membeli komik aslinya jika tersedia di kotamu!</div>';
  str_footer += '<div class="flex_wrap '+ (is_mobile ? 'f_center t_center' : 'f_between') +'">';
  str_footer += '<div class="footer-left">© '+ new Date().getFullYear() +', Made with \ud83d\udc96 & \ud83d\ude4c by <a href="https://github.com/bakomon/bakomon" target="_blank" title="Bakomon">Bakomon</a></div>';
  str_footer += '<div class="footer-right"><a href="#/latest">Beranda</a><span>|</span><a href="'+ bmv_series_list +'">Daftar Komik</a><span>|</span><a href="#/search" title="Advanced search">Advanced search</a><span>|</span><a href="#/contact">Contact</a></div>';
  str_footer += '</div>';
  str_footer += '</div>';
  if (bmv_current != 'chapter') str_footer += '<div id="to-top" class="btn" onclick="document.body.scrollIntoView()">&#x25b2;</div>';
  str_footer += '<style>.footer span {padding:0 6px;}</style>';
  return str_footer;
}

function bmf_build_main() {
  var main_layer = bmv_current.search(/series|member|contact/i) != -1? ' layer' : '';
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
  var str_head = '<div class="header-wrapper"><div class="header max layer flex f_middle" id="header">';
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
  str_head += '<li><a href="#/latest">Beranda</a></li><li><a href="'+ bmv_series_list +'">Daftar Komik</a></li><li><a href="#/search" title="Advanced Search">Adv Search</a></li><li><a href="#/contact">Contact</a></li>';
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
  str_head += '<input class="qs-field radius" type="search" placeholder="Judul..." value=""/>';
  str_head += '<button class="qs-search btn radius"><svg viewBox="0 0 512 512" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><path fill-rule="evenodd" clip-rule="evenodd" d="M208 48c-88.366 0-160 71.634-160 160s71.634 160 160 160 160-71.634 160-160S296.366 48 208 48zM0 208C0 93.125 93.125 0 208 0s208 93.125 208 208c0 48.741-16.765 93.566-44.843 129.024l133.826 134.018c9.366 9.379 9.355 24.575-.025 33.941-9.379 9.366-24.575 9.355-33.941-.025L337.238 370.987C301.747 399.167 256.839 416 208 416 93.125 416 0 322.875 0 208z"></path></svg></button>';
  str_head += '</div>'; //.qs-form
  str_head += '</div>'; //.quick-search
  str_head += '<div class="toggle-mode'+ (is_mobile ? '' : ' btn selected radius') +'">';
  str_head += '<span class="tm-moon'+ (is_dark ? ' no_items' : '') +'"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><g fill="currentColor"><path d="M6 .278a.768.768 0 0 1 .08.858a7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277c.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316a.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71C0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/><path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z"/></g></svg></span>';
  str_head += '<span class="tm-sun'+ (is_dark ? '' : ' no_items') +'"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" d="M8 12a4 4 0 1 0 0-8a4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/></svg></span>';
  str_head += '</div>'; //.toggle-mode
  str_head += '</div></div>';
  str_head += '<div class="line"></div>';
  return str_head;
}

// #===========================================================================================#

function bmf_default_key(e) {
  if (e.keyCode == 13) el('.quick-search .qs-search').click();
}

function bmf_disqus_load(data) {
  var disqus_vars = {
    url: wl.href.replace('#/', '#!/'), //replace with hashbang
    identifier: bmv_current +'-'+ data.slug +' '+ wl.href.replace('/#/', '#!'),
    title: el('h1').textContent
  };

  if (el('#disqus-embed')) {
    // https://help.disqus.com/en/articles/1717163-using-disqus-on-ajax-sites
    DISQUS.reset({
      reload: true,
      config: function() {
        this.page.url = disqus_vars.url;
        this.page.identifier = disqus_vars.identifier;
        this.page.title = disqus_vars.title;
      }
    });
  } else {
    window['disqus_shortname'] = 'bakomon';
    window['disqus_url'] = disqus_vars.url;
    window['disqus_identifier'] = disqus_vars.identifier;
    window['disqus_title'] = disqus_vars.title;
    addScript('https://' + disqus_shortname + '.disqus.com/embed.js', '#disqus-embed', true);
  }

  var disqus_config_custom = window.disqus_config;
  window['disqus_config'] = function() {
    // Disqus loaded
    this.callbacks.onReady.push(function() {
      console.log('Disqus: loaded');
      if (el('.disqus-trigger')) removeElem(el('.disqus-trigger'));
    });

    if (disqus_config_custom) disqus_config_custom.call(this);
  };
}

function bmf_toggle_dark() {
  document.documentElement.classList.toggle('dark');
  el('.toggle-mode .tm-moon').classList.toggle('no_items');
  el('.toggle-mode .tm-sun').classList.toggle('no_items');
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

  el('.header .toggle-mode').addEventListener('click', bmf_toggle_dark);
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', bmf_toggle_dark);

  if (is_mobile) {
    el('.header .nav-toggle').addEventListener('click', function() {
      this.parentElement.classList.toggle('nav-show');
      document.body.classList.toggle('no-scroll');
    });
    el('.quick-search .qs-open').addEventListener('click', function() {
      this.classList.toggle('qs-bg');
      el('.quick-search .qs-close').classList.toggle('no_items');
      toggleClass(el('.quick-search .qs-form'), ['qs-show', 'no_items']);
    });
  }
}

function bmf_page_scroll() {
  if (is_mobile) {
    var d_header = el('#header');
    var scroll_top = window.pageYOffset || document.documentElement.scrollTop;
    
    if (getOffset(check_point, 'top') > (getOffset(d_header.parentElement, 'top') + d_header.offsetHeight)) {
      if (!document.body.classList.contains('header-floating')) d_header.parentElement.style.height = d_header.offsetHeight +'px';
      document.body.classList.add('header-floating');
      
      if (scroll_top > last_scroll && !d_header.classList.contains('nav-show')) {
        d_header.style.top = '-'+ d_header.offsetHeight +'px';
        // el('.main-navigation .main-nav>ul', d_header).style.top = null;
      } else {
        d_header.style.top = 0;
        // if (ads_top) {
        //   var header_top = ads_top.dataset.anchorStatus == 'displayed' ? (ads_top.offsetHeight + 25) : 30;
        //   d_header.style.top = header_top +'px';
        //   el('.main-navigation .main-nav>ul', d_header).style.top = (header_top + d_header.offsetHeight) +'px';
        // }
      }
    } else {
      if (document.body.classList.contains('header-floating')) d_header.parentElement.style.removeProperty('height');
      document.body.classList.remove('header-floating');
      d_header.style.removeProperty('top');
      // if (ads_top) el('.main-navigation .main-nav>ul', d_header).style.top = (getOffset(d_header, 'top') + d_header.offsetHeight) +'px';
    }

    last_scroll = scroll_top;
  }
  
  if (bmv_current == 'chapter') {
    if (!bmv_chk_pause && !bmv_chk_from) {
      if (!bmv_load_img) lazyLoad(el('img.lazy1oad', 'all'), 'scroll');
      if (el('img.lazy1oad', 'all').length == 0) bmv_load_img = true;

      // load next image
      var r_imgs = el('#reader img', 'all');
      r_imgs.forEach(function(item, index) {
        var lz_chk1 = getOffset(item, 'top') < (getOffset(check_point, 'top') + check_point.offsetHeight);
        var lz_chk2 = getOffset(item, 'bottom') > getOffset(check_point, 'bottom');
        var lz_chk3 = lz_chk1 && lz_chk2 && item.classList.contains('lazyload3d');
        var lz_chk4 = r_imgs[index+1] && r_imgs[index+1].classList.contains('lazy1oad');
        if (lz_chk3 && lz_chk4) {
          item.classList.add('next-loaded');
          lazyLoad(r_imgs[index+1], 'single');
        }
      });
    }
      
    // next background (mobile)
    if (is_mobile && (getOffset(check_point, 'bottom') + bmv_half_screen) >= getOffset(el('#reader'), 'bottom')) {
      el('.cm_next').classList.add('cm_next_floating');
    } else {
      el('.cm_next').classList.remove('cm_next_floating');
    }
  } else {
    if (el('img.lazy1oad')) lazyLoad(el('img.lazy1oad', 'all'));
  }
}

// build page direct, without api data (adv search, member)
function bmf_build_page_direct(current) {
  bmf_build_default();

  if (current == 'search') bmf_build_search();
  if (current == 'member') bmf_build_member();
  if (current == 'contact') bmf_build_contact();
  
  bmf_meta_tags('direct'); //Meta tags
  document.body.classList.remove('loading', 'lody');
  document.addEventListener('scroll', bmf_page_scroll);
  
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
    bmf_meta_tags('api', json); //Meta tags

    if (bmv_current == 'series' || bmv_current == 'chapter') {
      el('.disqus-trigger').addEventListener('click', function() {
        this.innerHTML = 'Loading...';
        bmf_disqus_load(json);
      });
    }
  } else {
    bmv_el_post.innerHTML = `<div class="t_center">!! ERROR: ${json.status_code} ${json.message}</div>`;
  }
  
  bmv_page_loaded = true;
}

function bmf_build_page(note, json) {
  var fbase_wait = setInterval(function() {
    if (fbase_loaded && fbase_init && fbase_observer) {
      clearInterval(fbase_wait);
      if (note.indexOf('direct') != -1) {
        if (bmv_current == 'member') {
          bmf_param_member();
        } else {
          bmf_build_page_direct(bmv_current);
        }
      } else {
        bmf_build_page_api(json);
      }
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
  if (bmv_prm_slug == 'profile' && typeof firebase.storage === 'undefined') addScript('https://www.gstatic.com/firebasejs/8.10.0/firebase-storage.js');
}

function bmf_reset_var() {
  bmv_page_num = '1';
  bmv_page_loaded = false;
  bmv_str_cdn = '';
  bmv_str_gi = ''; //google images size
  bmv_str_cdn_link = '';
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
  bmv_dt_bmhs = null;
  bmv_el_result = null;
  bmv_el_images = null;
  document.removeEventListener('scroll', bmf_page_scroll);
  document.removeEventListener('scroll', bmf_chapter_middle);
  document.removeEventListener('keyup', bmf_default_key);
  document.removeEventListener('keyup', bmf_menu_key);
  document.removeEventListener('keyup', bmf_chapter_key);
}

function bmf_get_param() {
  bmf_reset_var();
  bmv_start = true;
  wh = wl.hash;
  el('title').innerHTML = 'Loading... \u2013 Bakomon'

  var list_wh = wh.replace(/\/page\/\d+/, '').split('/');
  bmv_current = list_wh.length > 1 ? list_wh[1] : 'latest';
  bmv_chk_query = wh.indexOf('query=') != -1 ? true : false; // if search page has "?query="
  bmv_chk_nav = bmv_current.search(/latest|search/i) != -1 ? true : false; //page navigation
  
  document.body.classList.add('loading', 'lody');
  if (is_mobile) document.documentElement.classList.add('mobile');

  // jump if "member" page
  if (bmv_current == 'member') {
    bmf_build_page('direct/member');
    return;
  }
  console.log(`page: ${bmv_current}`);

  // page must have "slug"
  if (bmv_current == 'series'|| bmv_current == 'chapter') {
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
    bmv_prm_chapter = list_wh[3].match(/([^\/#\?]+)/)[1];
    window.onunload = function() { window.scrollTo(0,0); }; //prevent browsers auto scroll on reload/refresh
  }

  if (bmv_current == 'search' && !bmv_prm_slug) { //advanced search without query or params
    bmf_build_page('direct/search');
  } else if (bmv_current == 'contact') {
    bmf_build_page('direct/contact');
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

function bmf_fbase_observer() {
  // Initialize new app with different name https://stackoverflow.com/a/37603526/7598333
  firebase.initializeApp(fbase_config, fbase_app);
  fbase = firebase.app(fbase_app);
  fbase_init = true;

  // Check login https://firebase.google.com/docs/auth/web/manage-users#get_the_currently_signed-in_user
  fbase.auth().onAuthStateChanged(function(user) {
    if (user) { //User is signed in
      fbase_login = true;
      fbase_user = user;
    } else {
      fbase_login = false;
      fbase_user = null;
    }
    fbase_observer = true;
  });
}

function bmf_fbase_init() {
  if (firebase.apps.length == 0) {
    bmf_fbase_observer();
  } else {
    var fbase_rgx = new RegExp(`\^${fbase_app}\$`, 'i');
    var fbase_chk = firebase.apps.map(item => { return item.name_.search(fbase_rgx) != -1 }).includes(true);
    if (fbase_chk) {
      console.warn(`Firebase: Firebase App named '${fbase_app}' already exists`);
    } else {
      bmf_fbase_observer();
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
var bmv_dt_latest, bmv_dt_search, bmv_dt_series, bmv_dt_chapter, bmv_dt_bmhs;
var bmv_el_post, bmv_el_result, bmv_el_images;
var bmv_str_cdn, bmv_str_gi, bmv_str_cdn_link;
var bmv_start = false;
var bmv_max_bmhs = 100; //bookmark & history
var bmv_max_hv = 5; //history visited
var bmv_series_list = '#/search/?params=%3Forder%3Dlatest';
var bmv_half_screen = Math.floor((window.screen.height / 2) + 30);
var bmv_zoom = local('get', 'bmv_zoom') ? JSON.parse(local('get', 'bmv_zoom')) : {};
var bmv_rgx_cdn = /(?:https?:\/\/)?((?:i\d+|cdn|img)\.(wp|statically|imagesimple)\.(?:com?|io)\/(?:img\/(?:[^\.]+\/)?)?)/i;
var bmv_rgx_gi = /\/([swh]\d+)(?:-[\w]+[^\/]*)?\/|=([swh]\d+).*/i;
var bmv_genres = ['4-koma','action','adult','adventure','comedy','cooking','crime','demons','doujinshi','drama','ecchi','fantasy','game','ghosts','gore','harem','historical','horror','isekai','josei','kingdom','loli','magic','magical-girls','martial-arts','mature','mecha','medical','military','monster-girls','monsters','music','mystery','one-shot','parody','philosophical','police','post-apocalyptic','psychological','reincarnation','revenge','romance','samurai','school','school-life','sci-fi','seinen','shotacon','shoujo','shounen','slice-of-life','sports','super-power','superhero','supernatural','survival','system','thriller','tragedy','vampires','video-games','villainess','webtoons','wuxia'];

var bmv_settings = {
  "source": "bacakomik", //bacakomik|komikindo|komikav
  "direction": true,
  "remove_statically": false,
  "text": {
    "next": "Next",
    "prev": "Prev"
  },
  "tier": {
    "super_admin": {
      "bookmark": 5000,
      "history": 5000,
      "visited": 500
    },
    "admin": {
      "bookmark": 3000,
      "history": 3000,
      "visited": 100
    },
    "pro": {
      "bookmark": 1000,
      "history": 1000,
      "visited": 50
    },
    "lite": {
      "bookmark": 100,
      "history": 100,
      "visited": 5
    }
  }
};

var wl = window.location;
var is_mobile = isMobile();
var is_dark = document.documentElement.classList.contains('dark');
var bakomon_web = true;
var last_scroll = 0;
var check_point = el('#check-point');

var fbase = null;
var fbase_app = 'bakomon';
var fbase_loaded = false;
var fbase_init = false;
var fbase_login = false;
var fbase_observer = false;
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
    document.body.scrollIntoView(); //Scroll to top
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

window.addEventListener('offline', function() {
  alert('Tidak ada koneksi internet. Pastikan Wi-Fi atau kuota internet aktif, lalu muat ulang halaman.');
});

console.log('%cMade with \ud83d\udc96 & \ud83d\ude4c, Source: %chttps://github.com/bakomon/bakomon', 'color:#ea8502;font:26px/1.5 monospace;', 'color:#333;font:26px/1.5 monospace;text-decoration:none;');