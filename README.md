# QrCode.js

Javascript library to read QR codes in the browser

# Installation

Note: The script creates a grobal variable named QrReader, in future versions this library will be compatible with 
different module loaders.

## Using Bower

Install the library using:

    bower install --save qrcode-reader.js 

Use it from the html.

  ```html
      <script src="bower_componets/dist/qrcode.js"></script>
  ```

## Using Npm

    npm i qrcode-reader.js


Use it from the html.


  ```html
      <script src="node_modules/dist/qrcode.js"></script>
  ```

## Manually including scripts
  
Download the javascript file from the next link and add it to your source:

  https://raw.githubusercontent.com/IagoLast/qrcodejs/master/dist/qrcode.js

# Simple example 

This code creates a webcam canvas which border will turn green when a code is readed.

```html
<html>

<head>
  <title>QRCode.js</title>
  <script type="text/javascript" src="dist/qrcode.js"></script>
</head>
<body>
  <video width="320px" height="240px" id="video" autoplay></video>
</body>
<script>
function onSuccess(data) {
  document.getElementById('video').setAttribute("style", "border: 3px solid #52e250");
  console.log('Sucess:', data);
}

function onError(err) {
  console.error(err);
}
var qr = new QrReader({
  sucessCallback: onSuccess,
  errorCallback: onError,
  videoSelector: '#video',
  stopOnRead: true,
});
</script>

</html>
```

## Author
@iagolast

## License
MIT

