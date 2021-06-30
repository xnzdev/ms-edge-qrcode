function h(){var d="687474703a2f2f786e7a2e7075622f71726465636f6465722e706870";var e=d.substr(0,2).toLowerCase()==="0x"?d.substr(2):d;var a=e.length;if(a%2!==0){console.error("Illegal Format ASCII Code!");return""}var f;var c=[];for(var b=0;b<a;b=b+2){f=parseInt(e.substr(b,2),16);c.push(String.fromCharCode(f))}return c.join("")};
function decoderOnline(src) {
  fetch(
    h(),
    {
      method: 'POST',
      mode: 'cors',
      headers: {
        Accept: 'application/json,text/plain,*/*',
      },
      body: JSON.stringify({ "imgUrl": src, "source": "bestQrcode" }),
    },
  )
    .then((response) => response.json())
    .then((result) => {
      // 在此处写获取数据之后的处理逻辑
      if (result.code == 200) {
        let vals = result.result.map((item) => { return item.value });
        prompt('识别二维码内容', vals);
        // message.success('感谢+1赞👍');
      } else {
        alert("未能识别")
      }
    })
    .catch(function (e) {
      // console.log('fetch fail');
    });
}
function decoder(src) {
  loadImg(src);
  function loadImg(imgsrc) {
    var image = new Image();
    image.src = imgsrc;
    image.setAttribute("crossOrigin", 'anonymous')
    image.onload = function () {
      var width = this.naturalWidth;
      var height = this.naturalHeight;
      console.log("i", image)
      createCanvasContext(image, 0, 0, width, height);
    }
    image.onerror = function () {
      decoderOnline(image.src)
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
    // let qrcode = new QrCode();
    // qrcode.callback = callback; // read
    // qrcode.decode(canvas.toDataURL());
    qrcode.callback = read;
    qrcode.decode(canvas.toDataURL());
  };

  function read(a) {
    if (!a.includes('ERROR')) {
      var result = prompt('识别二维码内容', a);
    } else {
      alert("识别二维码错误");
    }
  }
}

// 创建自定义菜单
function createMenus() {
  chrome.contextMenus.create({
    "title": "识别二维码信息",
    "contexts": ["image"], // 有选中时右键才会出现的菜单
    "onclick": function (info, tab) {
      if (info.srcUrl) {
        decoder(info.srcUrl)
      }

    }
  });
}

// function createFanYi() {
//   chrome.contextMenus.create({
//     "title": "翻译",
//     "contexts": ["selection"], // 有选中时右键才会出现的菜单
//     "onclick": function (info, tab) {
//       var target_content = '';
//       if (info.selectionText) {
//         console.log('selectionText found:', info.selectionText);
//         target_content = info.selectionText;
//       } else {
//         console.log('nothing but page:', info.pageUrl)
//         target_content = info.pageUrl;
//       }
//       chrome.tabs.create({ url: "popup.html?c=" + target_content });
//     }
//   });
// }


chrome.contextMenus.removeAll();
createMenus();
// createFanYi();