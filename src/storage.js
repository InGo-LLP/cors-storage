import IFrame from "./iframe";
import Promise from "pinkie-promise";

function RemoteStorage(options) {
  this.prefix = options.prefix || "";
  this.transport = new IFrame(options.baseUrl, options.pagePath);
  this.obj = options.obj || "localStorage";
}

RemoteStorage.prototype = {
  getItem: function(name) {
    return this.transport.send({
      obj: this.obj,
      op: "getItem",
      args: [this.prefix + ":" + name]
    });
  },

  setItem: function(name, value) {
    return this.transport.send({
      obj: this.obj,
      op: "setItem",
      args: [this.prefix + ":" + name, value]
    });
  },

  removeItem: function(name) {
    return this.transport.send({
      obj: this.obj,
      op: "removeItem",
      args: [this.prefix + ":" + name]
    });
  },

  getItems: function(keys) {
    var that = this;
    return Promise.all(
      keys.map(function(key) {
        return that.getItem(key);
      })
    ).then(function(values) {
      var obj = {};
      keys.forEach(function(key, idx) {
        obj[key] = values[idx];
      });
      return obj;
    });
  },

  removeItems: function(keys) {
    var that = this;
    return Promise.all(
      keys.map(function(key) {
        return that.removeItem(key);
      })
    );
  },

  setItems: function(obj) {
    var that = this;
    return Promise.all(
      Object.keys(obj).map(function(key) {
        return that.setItem(key, obj[key]);
      })
    );
  }
};

export default RemoteStorage;
