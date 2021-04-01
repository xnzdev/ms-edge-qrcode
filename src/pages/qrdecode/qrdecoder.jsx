// 识别图片二维码内容
import QrCodeReader from 'qrcode-reader';

export const decoder = (src, callback) => {
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
      let qrcode = new QrCodeReader();
      qrcode.callback = callback; // read
      qrcode.decode(canvas.toDataURL());
    };
  
    // function read(err, value) {
    //   console.log(err, value)
    //   prompt("识别二维码内容", value.result)
    // }
  }