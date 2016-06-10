/*global qrcode:true*/

/**
 * QrReader
 *
 * This class allows to read QR codes from a web-browser in any device with a video-camera.
 *
 * @example
 * // First define the options passed to the QrReader.
 * let options = {};
 *
 * options.sucessCallback = function(){}; // This function will be executed when the detector reads a code.
 * options.errorCallback = function(){}; // This function will be executed when the detector fails reading a code.
 * options.videoSelector = '.video-preview'; // If you have a video tag with the video preview you can indicate a css selector.
 * options.stopOnRead =  true;  // When this flag is activated the detector will stop once a code was readed sucessfully.
 * options.startOnCreate = false;  // When this flag is activated the detector will start when instantiated.
 *
 * let reader = new QrReader(options);
 *
 * reader.start(); // Start reading
 * reader.stop(); // Stop streams and video.
 */
export default class QrReader {
  /**
   * Instantiate a QrReader object.
   * @param {object} options - Constructor options.
   * @param {function} options.sucessCallback - Callback to execute when the detector reads a code.
   * @param {function} options.errorCallback - Callback to execute when the detector fails reading a code.
   * @param {string} options.videoSelector -  The detector will use a video element found using the given selector, if undefined it will create his own.
   * @param {boolean} options.stopOnRead - When this flag is activated the detector will stop once a qrcode was readed sucessfully.
   * @param {boolean} options.startOnCreate - When this flag is activated the detector will start when instantiated.
   */
  constructor(options) {
    let videoSelector = options.videoSelector;

    // Initialize default values for atributes
    this._stopOnRead = options.stopOnRead;
    this._video = null;
    this._context = null;
    this._mediaStream = null;
    this._stopped = false;
    this._defaultHeight = '240';
    this._defaultWidth = '320';
    this._facingMode = options.facingMode || 'environment';
    this._startOnCreate = options.startOnCreate || true;

    /**
     * Callback to run when a qr code is decoded.
     * @param {string} data - The decoded string obtained from the qr code.
     */
    this.onSuccess = options.sucessCallback;

    /**
     * Callback to run when an error happens trying to decode a code.
     * @param {Error} error - The error.
     */
    this.onError = options.errorCallback;

    // Initialize attributes
    this._video = this._createVideoElement(videoSelector)
    this._width = this._video.width;
    this._height = this._video.height;
    this._context = this._createContext2D(this._video);

    if (this._startOnCreate) {
      this.start();
    }
  }

  /**
   * Start reading video from the video-camera decoding each frame.
   */
  start() {
    navigator.getUserMedia({ video: { facingMode: this._facingMode } }, this._onMediaStream.bind(this), this._onMediaStreamError.bind(this));
  }

  /**
   * Stop video streams.
   */
  stop() {
    this._stopStreams();
  }

  /**
   * Return the existing video or create a new one from scratch.
   */
  _createVideoElement(videoSelector) {
    if (videoSelector) {
      return document.querySelector(videoSelector);
    } else {
      let video = document.createElement('video');
      video.setAttribute('width', this._defaultWidth);
      video.setAttribute('height', this._defaultHeight);
      return video;
    }
  }

  /**
   * Return a 2D context with the same size of the video.
   */
  _createContext2D(video) {
    let canvas = document.createElement("canvas");
    canvas.width = video.width;
    canvas.height = video.height;
    return canvas.getContext("2d");
  }

  /**
   * Callback to run when the videoStream is obtained.
   */
  _onMediaStream(stream) {
    this._mediaStream = stream;
    this._video.src = URL.createObjectURL(stream);
    this._video.play();
    requestAnimationFrame(this._onAnimationFrameRequested.bind(this));
  }

  /**
   * Callback to run when error on get mediastream.
   */
  _onMediaStreamError(e) {
    console.error(e);
  }

  /**
   * Main Loop, get a frame from video and put it into canvas
   */
  _onAnimationFrameRequested() {
    if (this._stopped) {
      return;
    }
    this._context.drawImage(this._video, 0, 0, this._width, this._height);
    let frame = this._context.getImageData(0, 0, this._width, this._height);
    this._decode(frame);
    requestAnimationFrame(this._onAnimationFrameRequested.bind(this));
  }

  /**
   *
   */
  _decode(frame) {
    var result = '';
    try {
      result = qrcode.decode(frame);
    } catch (e) {
      if (this._isExpectedError(e)) {
        return;
      } else {
        console.error('Unexpected error: ', e);
        this.onError(e);
      }
    }
    if (result !== '' && this._stopOnRead) {
      this._stopStreams();
    }
    if (result !== '') {
      this.onSuccess(result);
    }
  }

  _isExpectedError(e) {
    return String(e).indexOf("Couldn't find enough") >= 0;
  }

  _stopStreams() {
    this._stopped = true;
    this._video.pause();
    this._mediaStream.getVideoTracks().forEach(function(videoTrack) {
      videoTrack.stop();
    });
  }
}
