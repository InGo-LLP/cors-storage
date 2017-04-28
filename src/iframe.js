import { contentLoaded } from "document-promises-pinkie";
import Promise from "pinkie-promise";
import merge from "./merge";

var domain = document.domain;

function uid() {
  return domain + "-" + 1 * new Date() + "-" + (0 | (Math.random() * 9e6)).toString(36);
}

function IFrame(baseUrl, pagePath) {
  var that = this;

  this.baseUrl = baseUrl;
  this.pagePath = pagePath;

  this.frame = document.createElement("iframe");
  this.frame.style.display = "none";
  this.frame.style.visibility = "hidden";

  this.messageQueue = {};
  this.preLoadQueue = [];

  this.loaded = false;

  this.frame.addEventListener(
    "load",
    function() {
      that.loaded = true;

      var items = that.preLoadQueue;
      that.preLoadQueue = [];

      return items.map(function(message) {
        return that.send(message.data).then(message.resolve, message.reject);
      });
    },
    false
  );

  // set src after onload callback not before!!!
  this.frame.src = baseUrl + pagePath;

  window.addEventListener(
    "message",
    function(e) {
      if (e.origin.indexOf(that.baseUrl) !== 0) {
        return;
      }

      var data = JSON.parse(e.data);
      var requestData = that.messageQueue[data._requestID];
      if (requestData) {
        if ("error" in data) {
          var error = new Error(data.error);
          requestData.reject(error);

          return;
        }

        requestData.resolve(data.data);

        delete that.messageQueue[data._requestID];
      }
    },
    false
  );

  contentLoaded
    .then(function() {
      document.body.appendChild(that.frame);
    })
    .catch(() => {});
}

IFrame.prototype.send = function(data) {
  var _resolve, _reject;
  var promise = new Promise(function(resolve, reject) {
    _resolve = resolve;
    _reject = reject;
  });
  if (this.loaded) {
    var id = uid();
    this.messageQueue[id] = { resolve: _resolve, reject: _reject };
    //IE8 and IE9 need  target will be iframe domain (for mystic security reasons)
    this.frame.contentWindow.postMessage(JSON.stringify(merge({}, data, { _requestID: id })), this.baseUrl);
  } else {
    this.preLoadQueue.push({ data: data, resolve: _resolve, reject: _reject });
  }
  return promise;
};

export default IFrame;
