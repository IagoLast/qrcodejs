function QR_CODE() {
  var qrcode;

  qrcode.imagedata = null;
  qrcode.width = 0;
  qrcode.height = 0;
  qrcode.qrCodeSymbol = null;
  qrcode.debug = false;
  qrcode.maxImgSize = 1024 * 1024;

  qrcode.sizeOfDataLengthInfo = [
    [10, 9, 8, 8],
    [12, 11, 16, 10],
    [14, 13, 16, 12]
  ];

  this.decode = function(image) {
    qrcode.width = image.width;
    qrcode.height = image.height;
    qrcode.imagedata = image;
    qrcode.result = this.process();
    return qrcode.result;
  }

  this.process = function() {
    var image = qrcode.grayScaleToBitmap(qrcode.grayscale());
    var detector = new Detector(image);
    var qRCodeMatrix = detector.detect();
    var reader = Decoder.decode(qRCodeMatrix.bits);
    var data = reader.DataByte;
    var string = '';

    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data[i].length; j++) {
        string += String.fromCharCode(data[i][j]);
      }
    }
    return qrcode.decode_utf8(string);
  }
}
