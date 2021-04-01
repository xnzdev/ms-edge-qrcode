var MSG_DISABLE_CONTEXT_MENUS = 'A1';
var MSG_ENABLE_CONTEXT_MENUS = 'A2';
var MSG_ENABLE_SCANNER = 'A3';

// Reset all
chrome.contextMenus.removeAll();

createMenus();
function removeMenus(){
  chrome.contextMenus.remove(Number(cmid_text));
  chrome.contextMenus.remove(Number(cmid_link));
  chrome.contextMenus.remove(Number(cmid_page));
}
var cmid_text;
var cmid_link;
var cmid_page;

function createMenus() {
  console.log('create!');
  if(localStorage.getItem('adv-config-context') == '0') return;
  cmid_text = chrome.contextMenus.create({
    "title": "ctx_string",
    "contexts":["selection"],
    "onclick":function(info, tab) {
    	var target_content = '';
      if (info.selectionText) {
      	console.log('selectionText found:', info.selectionText);
      	target_content = info.selectionText;
      } else {
      	console.log('nothing but page:', info.pageUrl)
      	target_content = info.pageUrl;
      }
      chrome.tabs.create({url:"popup.html?c="+target_content});
    }
  });

  cmid_page = chrome.contextMenus.create({
    "title":"ctx_page",
    "contexts":["page"],
    "onclick":function(info, tab) {
    	var target_content = '';
      if (info.selectionText) {
      	console.log('selectionText found:', info.selectionText);
      	target_content = info.selectionText;
      } else {
      	console.log('nothing but page:', info.pageUrl)
      	target_content = info.pageUrl;
      }
      chrome.tabs.create({url:"popup.html?c="+target_content});
    }
  });

  cmid_link = chrome.contextMenus.create({
    "title":chrome.i18n.getMessage("ctx_link"),
    "contexts":["link"],
    "onclick":function(info, tab) {
    	var target_content = '';
      if(info.linkUrl) {
      	console.log('link found:', info.linkUrl);
      	target_content = info.linkUrl;
      } else if (info.selectionText) {
      	console.log('selectionText found:', info.selectionText);
      	target_content = info.selectionText;
      } else {
      	console.log('nothing but page:', info.pageUrl)
      	target_content = info.pageUrl;
      }
      chrome.tabs.create({url:"popup.html?c="+target_content});
    }
  });
}
if(localStorage.getItem('cmid_scan')) {
  createQRScanner();
}
function createQRScanner(){
  if(window.cmid_scan && localStorage.getItem('cmid_scan')) return;
  window.cmid_scan = chrome.contextMenus.create({
    "title":chrome.i18n.getMessage("ctx_scan"),
    "contexts":["image"]
  });
  localStorage.setItem('cmid_scan', cmid_scan);
}

function is_scanner(cmid) {
  return cmid.toString() == localStorage.getItem('cmid_scan');
}


function toggle_M_pops(){
  
}

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if(is_scanner(info.menuItemId)) {
    var target_content = '';
    if(info.srcUrl) {
      decoderQR(info.srcUrl);
    } 
  }
});

function decoderQR(src){
  loadImg(src);
  function loadImg(imgsrc) {
    var image = new Image();
    image.src = imgsrc;
    image.onload = function () {
      var width = this.naturalWidth;
      var height = this.naturalHeight;
      createCanvasContext(image, 0, 0, width, height);
    }
  }

  function createCanvasContext(img, t, l, w, h) {
    var canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'qr-canvas');
    canvas.height = h + 100;
    canvas.width = w + 100;
    var context = canvas.getContext('2d');
    context.fillStyle = 'rgb(255,255,255)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, l, t, w, h, 50, 50, w, h);
    qrcode.callback = read;
    qrcode.decode(canvas.toDataURL());
  };

  function read(a) {
    if(!a.includes('ERROR')){
      var result = prompt(chrome.i18n.getMessage("scan_result"),a);
    } else {
      alert(chrome.i18n.getMessage("scan_result_fail"));
    }
  }

}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  executeRequest(request.code);
  return true;
  // return Promise.resolve("");
});

function executeRequest(code) {
  switch (code) {
    case MSG_DISABLE_CONTEXT_MENUS:
      removeMenus();
      break;
    case MSG_ENABLE_CONTEXT_MENUS:
      createMenus();
      break;
    case MSG_ENABLE_SCANNER:
      createQRScanner();
      break;
  }
}