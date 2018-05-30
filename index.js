import assign from 'ingo-deep-defaults';

function contentLoaded() {
  return new Promise(function (resolve) {
    var state = document.readyState;
    if (state === "interactive" || state === "complete") {
      resolve();
    } else {
      document.addEventListener("DOMContentLoaded", function () {
        return resolve();
      });
    }
  });
}

var domain = document.domain;

function uid() {
  return domain + "-" + 1 * new Date() + "-" + (0 | Math.random() * 9e6).toString(36);
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

  this.frame.addEventListener("load", function () {
    that.loaded = true;

    var items = that.preLoadQueue;
    that.preLoadQueue = [];

    return items.map(function (message) {
      return that.send(message.data).then(message.resolve, message.reject);
    });
  }, false);

  // set src after onload callback not before!!!
  this.frame.src = baseUrl + pagePath;

  window.addEventListener("message", function (e) {
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
  }, false);

  contentLoaded.then(function () {
    document.body.appendChild(that.frame);
  }).catch(function () {});
}

IFrame.prototype.send = function (data) {
  var _resolve, _reject;
  var promise = new Promise(function (resolve, reject) {
    _resolve = resolve;
    _reject = reject;
  });
  if (this.loaded) {
    var id = uid();
    this.messageQueue[id] = { resolve: _resolve, reject: _reject };
    //IE8 and IE9 need  target will be iframe domain (for mystic security reasons)
    data = assign({}, data, { _requestID: id });
    this.frame.contentWindow.postMessage(JSON.stringify(data), this.baseUrl);
  } else {
    this.preLoadQueue.push({ data: data, resolve: _resolve, reject: _reject });
  }
  return promise;
};

function RemoteStorage(options) {
  this.prefix = options.prefix || "";
  this.transport = new IFrame(options.baseUrl, options.pagePath);
  this.obj = options.obj || "localStorage";
}

RemoteStorage.prototype = {
  getItem: function getItem(name) {
    return this.transport.send({
      obj: this.obj,
      op: "getItem",
      args: [this.prefix + ":" + name]
    });
  },

  setItem: function setItem(name, value) {
    return this.transport.send({
      obj: this.obj,
      op: "setItem",
      args: [this.prefix + ":" + name, value]
    });
  },

  removeItem: function removeItem(name) {
    return this.transport.send({
      obj: this.obj,
      op: "removeItem",
      args: [this.prefix + ":" + name]
    });
  },

  getItems: function getItems(keys) {
    var that = this;
    return Promise.all(keys.map(function (key) {
      return that.getItem(key);
    })).then(function (values) {
      var obj = {};
      keys.forEach(function (key, idx) {
        obj[key] = values[idx];
      });
      return obj;
    });
  },

  removeItems: function removeItems(keys) {
    var that = this;
    return Promise.all(keys.map(function (key) {
      return that.removeItem(key);
    }));
  },

  setItems: function setItems(obj) {
    var that = this;
    return Promise.all(Object.keys(obj).map(function (key) {
      return that.setItem(key, obj[key]);
    }));
  }
};

export default RemoteStorage;
